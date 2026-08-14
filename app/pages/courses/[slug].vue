<script setup lang="ts">
import { ArrowLeft } from '@lucide/vue'
import { courseEncyclopediaBySlug, type CourseEncyclopediaEntry, type CoursePlacement } from '~/data/courseEncyclopedia'

const route = useRoute()
const course = computed(() => courseEncyclopediaBySlug.get(String(route.params.slug)))

if (!course.value) throw createError({ statusCode: 404, statusMessage: '课程不存在' })

useSeoMeta({
  title: () => course.value?.title,
  description: () => course.value?.description
})

const typeLabel = (type: CourseEncyclopediaEntry['type']) => type === 'required' ? '必修' : '选修'

const termLabel = (placement: CoursePlacement) => {
  const grade = ['一', '二', '三', '四'][placement.year - 1]
  if (placement.semester === 3) return `${placement.majorName} · 大${grade}短学期`
  return `${placement.majorName} · 大${grade}${placement.semester === 1 ? '上' : '下'}`
}

const courseTone = computed(() => {
  const item = course.value
  if (!item) return ''
  if (item.type === 'elective') return 'course-tone-elective'
  if (item.categories.includes('实践教育课')) return 'course-tone-practice'
  if (item.categories.some(category => category.includes('专业'))) return 'course-tone-major'
  if (item.categories.includes('大类平台课')) return 'course-tone-platform'
  return 'course-tone-foundation'
})
</script>

<template>
  <main v-if="course" class="course-detail-page">
    <div class="course-detail-wrap page-wrap">
      <NuxtLink to="/courses" class="course-detail-back">
        <ArrowLeft :size="18" aria-hidden="true" />
        返回课程百科
      </NuxtLink>

      <header class="course-detail-header" :class="courseTone">
        <div class="course-detail-title">
          <h1>{{ course.title }}</h1>
          <p>{{ course.description }}</p>
        </div>

        <div class="course-detail-meta">
          <span>{{ course.credits }} 学分</span>
          <span>{{ typeLabel(course.type) }}</span>
          <span v-for="category in course.categories" :key="category">{{ category }}</span>
        </div>

        <div class="course-detail-terms">
          <span v-for="placement in course.placements" :key="`${placement.major}-${placement.year}-${placement.semester}`">
            {{ termLabel(placement) }}
          </span>
        </div>
      </header>

      <div class="course-detail-sections">
        <section class="course-assessment-section" aria-labelledby="course-assessment-title">
          <h2 id="course-assessment-title">课程成绩构成</h2>
          <p class="course-assessment-note">{{ course.assessmentNote }}</p>

          <div class="course-assessment-grid">
            <article v-for="(item, index) in course.assessment" :key="item.label">
              <span>{{ String(index + 1).padStart(2, '0') }}</span>
              <div>
                <h3>{{ item.label }}</h3>
                <p>{{ item.detail }}</p>
              </div>
            </article>
          </div>
        </section>

        <section class="course-advice-section" aria-labelledby="course-advice-title">
          <h2 id="course-advice-title">学长学姐的建议</h2>
          <ol>
            <li v-for="(item, index) in course.advice" :key="item">
              <span>{{ String(index + 1).padStart(2, '0') }}</span>
              <p>{{ item }}</p>
            </li>
          </ol>
        </section>
      </div>
    </div>
  </main>
</template>
