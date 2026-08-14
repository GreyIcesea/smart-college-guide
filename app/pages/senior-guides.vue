<script setup lang="ts">
import { ArrowRight, BookOpen, CalendarRange, GraduationCap, Trophy } from '@lucide/vue'

useSeoMeta({ title: '老生指南', description: '面向大二至大四学生的课程、培养方案、竞赛与发展入口。' })

const sections = [
  { title: '按年级看学习路线', description: '从大二开始查看每一学年的重点、选择与准备事项。', to: '/roadmap/year-2', icon: GraduationCap },
  { title: '核对培养方案', description: '按届次查看课程安排，正式要求仍以学院发布的培养方案为准。', to: '/curricula', icon: CalendarRange },
  { title: '查课程经验', description: '浏览课程重点、前置知识和同学整理的学习建议。', to: '/courses', icon: BookOpen },
  { title: '准备竞赛', description: '根据年级、基础和组队需求选择合适的竞赛入口。', to: '/competitions', icon: Trophy }
]
</script>

<template>
  <div>
    <PageHeading title="老生指南" description="不再从报到讲起，直接进入课程安排、学习方向、竞赛与毕业选择。" />
    <nav class="portal-list page-wrap" aria-label="老生指南入口">
      <NuxtLink v-for="section in sections" :key="section.to" :to="section.to">
        <component :is="section.icon" :size="22" aria-hidden="true" />
        <div>
          <h2>{{ section.title }}</h2>
          <p>{{ section.description }}</p>
        </div>
        <ArrowRight :size="19" aria-hidden="true" />
      </NuxtLink>
    </nav>
  </div>
</template>
