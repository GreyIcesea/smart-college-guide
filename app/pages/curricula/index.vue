<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import { automationCurriculum, type ResourceCourse, type ResourceCurriculum } from '~/data/additionalCurricula'
import { artificialIntelligenceCurriculum } from '~/data/artificialIntelligenceCurriculum'
import { intelligentScienceCurriculum } from '~/data/intelligentScienceCurriculum'

useSeoMeta({ title: '培养方案', description: '按入学年份和专业查看人工智能、自动化与智能科学与技术的课程安排。' })

const { data: contentCurricula } = await useAsyncData('curricula', () =>
  queryCollection('curricula').order('cohort', 'DESC').all()
)
const { data: courses } = await useAsyncData('curriculum-course-index', () =>
  queryCollection('courses').select('title', 'slug', 'path', 'credits', 'type').all()
)

const curricula = computed<ResourceCurriculum[]>(() => {
  const entries = new Map<string, ResourceCurriculum>()
  const localCurricula = [
    artificialIntelligenceCurriculum,
    automationCurriculum,
    intelligentScienceCurriculum
  ]

  for (const item of localCurricula) entries.set(`${item.cohort}-${item.major}`, item)
  for (const item of (contentCurricula.value ?? []) as unknown as ResourceCurriculum[]) {
    if (!item.note.includes('示例')) entries.set(`${item.cohort}-${item.major}`, item)
  }

  return Array.from(entries.values()).sort((left, right) =>
    right.cohort - left.cohort || left.majorName.localeCompare(right.majorName, 'zh-CN')
  )
})

const selection = ref('')

watchEffect(() => {
  const first = curricula.value?.[0]
  if (!selection.value && first) {
    selection.value = `${first.cohort}-${first.major}`
  }
})

const current = computed(() =>
  curricula.value?.find((item) => `${item.cohort}-${item.major}` === selection.value)
)
const courseBySlug = computed(() => new Map<string, ResourceCourse & { path?: string }>([
  ...(courses.value ?? []).map(course => [course.slug, course as ResourceCourse & { path?: string }] as const),
  ...Object.entries(artificialIntelligenceCurriculum.courseDetails ?? {}),
  ...Object.entries(automationCurriculum.courseDetails ?? {}),
  ...Object.entries(intelligentScienceCurriculum.courseDetails ?? {})
]))
const semesters = computed(() => {
  return [...(current.value?.semesters ?? [])]
    .sort((left, right) => left.year - right.year || left.semester - right.semester)
    .map(term => ({
      ...term,
      items: term.courses.map(slug => courseBySlug.value.get(slug)).filter(Boolean)
    }))
})

const semesterTitle = (year: number, semester: number) => {
  const grade = ['一', '二', '三', '四'][year - 1] ?? year
  if (semester === 3) return `大${grade}暑期学期`
  return `大${grade}${semester === 1 ? '上' : '下'}`
}

const coursePath = (course: ResourceCourse & { path?: string }) => course.path ?? `/courses/${course.slug}`
</script>

<template>
  <div>
    <PageHeading title="培养方案" description="按专业查看四年课程结构。课程与学分来自现有培养方案文件，正式选课和毕业审核仍以教务系统及学院最新通知为准。" />
    <div class="curriculum page-wrap">
      <div class="curriculum-select">
        <label for="curriculum">选择培养方案</label>
        <select id="curriculum" v-model="selection">
          <option v-for="item in curricula" :key="`${item.cohort}-${item.major}`" :value="`${item.cohort}-${item.major}`">
            {{ item.cohort }} 级 · {{ item.majorName }}
          </option>
        </select>
        <p>{{ current?.note }}</p>
      </div>

      <div class="semester-track">
        <section v-for="(semester, index) in semesters" :key="`${semester.year}-${semester.semester}`" class="semester-block">
          <header>
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
            <div><h2>{{ semesterTitle(semester.year, semester.semester) }}</h2><p>{{ semester.items.length }} 门已收录课程</p></div>
          </header>
          <div v-if="semester.items.length" class="semester-courses">
            <NuxtLink v-for="course in semester.items" :key="course!.slug" :to="coursePath(course!)">
              <div><strong>{{ course!.title }}</strong><span>{{ typeLabels[course!.type] }} · {{ course!.credits }} 学分</span></div>
              <ArrowRight :size="18" />
            </NuxtLink>
          </div>
          <p v-else class="semester-empty">示例数据暂未录入这个学期。</p>
        </section>
      </div>
    </div>
  </div>
</template>
