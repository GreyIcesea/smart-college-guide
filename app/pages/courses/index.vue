<script setup lang="ts">
import { ChevronDown, Search } from '@lucide/vue'
import { courseEncyclopedia, courseMajorOptions, type CourseEncyclopediaEntry, type CoursePlacement } from '~/data/courseEncyclopedia'

useSeoMeta({ title: '课程百科', description: '按培养方案顺序查看课程成绩构成和学长学姐建议。' })

const keyword = ref('')
const major = ref('all')
const year = ref('all')
const category = ref('all')
const expandedCourses = ref(new Set<string>())

const categoryOptions = Array.from(new Set(courseEncyclopedia.flatMap(course => course.categories)))
  .sort((left, right) => left.localeCompare(right, 'zh-CN'))

const majorOrder = new Map(courseMajorOptions.map((option, index) => [option.value, index]))

const filteredCourses = computed(() => {
  const term = keyword.value.trim().normalize('NFKC').toLocaleLowerCase('zh-CN')

  return courseEncyclopedia.filter((course) => {
    const searchable = [
      course.title,
      course.description,
      ...course.tags,
      ...course.categories,
      ...course.placements.map(item => item.majorName)
    ].join(' ').normalize('NFKC').toLocaleLowerCase('zh-CN')

    const matchesKeyword = !term || searchable.includes(term)
    const matchesMajor = major.value === 'all' || course.placements.some(item => item.major === major.value)
    const matchesYear = year.value === 'all' || course.placements.some(item => item.year === Number(year.value))
    const matchesCategory = category.value === 'all' || course.categories.includes(category.value)

    return matchesKeyword && matchesMajor && matchesYear && matchesCategory
  })
})

const placementForCourse = (course: CourseEncyclopediaEntry) => {
  const placements = major.value === 'all'
    ? course.placements
    : course.placements.filter(item => item.major === major.value)

  return [...placements].sort((left, right) =>
    left.year - right.year
    || left.semester - right.semester
    || (majorOrder.get(left.major) ?? 99) - (majorOrder.get(right.major) ?? 99)
    || left.order - right.order
  )[0]
}

const termGroups = computed(() => {
  const groups = new Map<string, { key: string, label: string, year: number, semester: number, courses: CourseEncyclopediaEntry[] }>()

  for (const course of filteredCourses.value) {
    const placement = placementForCourse(course)
    if (!placement) continue
    const key = `${placement.year}-${placement.semester}`
    const grade = ['一', '二', '三', '四'][placement.year - 1]
    const label = placement.semester === 3
      ? `大${grade}短学期`
      : `大${grade}${placement.semester === 1 ? '上' : '下'}`
    const group = groups.get(key) ?? { key, label, year: placement.year, semester: placement.semester, courses: [] }
    group.courses.push(course)
    groups.set(key, group)
  }

  return Array.from(groups.values())
    .sort((left, right) => left.year - right.year || left.semester - right.semester)
    .map(group => ({
      ...group,
      courses: group.courses.sort((left, right) => {
        const leftPlacement = placementForCourse(left)
        const rightPlacement = placementForCourse(right)
        if (!leftPlacement || !rightPlacement) return 0
        return (majorOrder.get(leftPlacement.major) ?? 99) - (majorOrder.get(rightPlacement.major) ?? 99)
          || leftPlacement.order - rightPlacement.order
          || left.title.localeCompare(right.title, 'zh-CN')
      })
    }))
})

const courseTone = (course: CourseEncyclopediaEntry) => {
  if (course.type === 'elective') return 'course-tone-elective'
  if (course.categories.includes('实践教育课')) return 'course-tone-practice'
  if (course.categories.some(item => item.includes('专业'))) return 'course-tone-major'
  if (course.categories.includes('大类平台课')) return 'course-tone-platform'
  return 'course-tone-foundation'
}

const majorNames = (course: CourseEncyclopediaEntry) =>
  Array.from(new Set(course.placements.map(item => item.majorName)))

const termLabel = (placement: CoursePlacement) => {
  const grade = ['一', '二', '三', '四'][placement.year - 1]
  if (placement.semester === 3) return `${placement.majorName} · 大${grade}短学期`
  return `${placement.majorName} · 大${grade}${placement.semester === 1 ? '上' : '下'}`
}

const isExpanded = (slug: string) => expandedCourses.value.has(slug)

const toggleCourse = (slug: string) => {
  const next = new Set(expandedCourses.value)
  if (next.has(slug)) next.delete(slug)
  else next.add(slug)
  expandedCourses.value = next
}

const resetFilters = () => {
  keyword.value = ''
  major.value = 'all'
  year.value = 'all'
  category.value = 'all'
}
</script>

<template>
  <main class="course-encyclopedia course-accordion-page">
    <PageHeading title="课程百科" description="按培养方案顺序找课程，展开即可查看成绩构成和学习建议。" />

    <div class="course-catalog page-wrap">
      <section class="course-filter-panel" aria-label="筛选课程">
        <label class="course-search-field">
          <Search :size="19" aria-hidden="true" />
          <input v-model="keyword" type="search" placeholder="搜索课程名称或关键词">
        </label>

        <div class="course-major-switch" aria-label="选择专业">
          <button
            v-for="option in courseMajorOptions"
            :key="option.value"
            type="button"
            :class="{ active: major === option.value }"
            :aria-pressed="major === option.value"
            @click="major = option.value"
          >
            {{ option.label }}
          </button>
        </div>

        <label>
          <span>年级</span>
          <select v-model="year">
            <option value="all">全部年级</option>
            <option value="1">大一</option>
            <option value="2">大二</option>
            <option value="3">大三</option>
            <option value="4">大四</option>
          </select>
        </label>

        <label>
          <span>课程类别</span>
          <select v-model="category">
            <option value="all">全部类别</option>
            <option v-for="item in categoryOptions" :key="item" :value="item">{{ item }}</option>
          </select>
        </label>
      </section>

      <div class="course-result-row">
        <p>共 {{ filteredCourses.length }} 门课程</p>
        <button v-if="major !== 'all' || year !== 'all' || category !== 'all' || keyword" type="button" @click="resetFilters">
          清除筛选
        </button>
      </div>

      <div v-if="termGroups.length" class="course-term-list">
        <section v-for="group in termGroups" :key="group.key" class="course-term-group">
          <header class="course-term-heading">
            <h2>{{ group.label }}</h2>
            <span>{{ group.courses.length }} 门</span>
          </header>

          <div class="course-accordion-list">
            <article
              v-for="(course, index) in group.courses"
              :key="course.slug"
              class="course-accordion-item"
              :class="[courseTone(course), { expanded: isExpanded(course.slug) }]"
            >
              <button
                type="button"
                class="course-accordion-trigger"
                :aria-expanded="isExpanded(course.slug)"
                :aria-controls="`course-panel-${course.slug}`"
                @click="toggleCourse(course.slug)"
              >
                <span class="course-row-order">{{ String(index + 1).padStart(2, '0') }}</span>
                <strong>{{ course.title }}</strong>
                <span class="course-row-majors">{{ majorNames(course).join(' / ') }}</span>
                <span class="course-row-meta">{{ course.credits }} 学分 · {{ course.categories.join(' / ') }}</span>
                <ChevronDown :size="19" aria-hidden="true" />
              </button>

              <div
                v-if="isExpanded(course.slug)"
                :id="`course-panel-${course.slug}`"
                class="course-accordion-panel"
              >
                <p class="course-accordion-summary">{{ course.description }}</p>

                <div class="course-accordion-placements">
                  <span v-for="placement in course.placements" :key="`${placement.major}-${placement.year}-${placement.semester}`">
                    {{ termLabel(placement) }}
                  </span>
                </div>

                <div class="course-accordion-content">
                  <section>
                    <h3>课程成绩构成</h3>
                    <p class="course-accordion-note">{{ course.assessmentNote }}</p>
                    <div class="course-inline-assessment">
                      <article v-for="(item, itemIndex) in course.assessment" :key="item.label">
                        <span>{{ String(itemIndex + 1).padStart(2, '0') }}</span>
                        <div><h4>{{ item.label }}</h4><p>{{ item.detail }}</p></div>
                      </article>
                    </div>
                  </section>

                  <section class="course-inline-advice">
                    <h3>学长学姐的建议</h3>
                    <ol>
                      <li v-for="(item, itemIndex) in course.advice" :key="item">
                        <span>{{ String(itemIndex + 1).padStart(2, '0') }}</span>
                        <p>{{ item }}</p>
                      </li>
                    </ol>
                  </section>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>

      <div v-else class="course-empty-state">
        <p>没有找到符合条件的课程。</p>
        <button type="button" @click="resetFilters">清除筛选</button>
      </div>
    </div>
  </main>
</template>
