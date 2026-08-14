<script setup lang="ts">
import { ArrowUpRight, GitBranch } from '@lucide/vue'

const firstGuidePath = '/guides/freshman/prepare-before-arrival'
const { data: guide } = await useAsyncData('guide-index', () =>
  queryCollection('guides').path(firstGuidePath).first()
)

if (!guide.value) {
  throw createError({ statusCode: 404, statusMessage: '指南不存在' })
}

useSeoMeta({ title: () => guide.value?.title, description: () => guide.value?.description })
</script>

<template>
  <GuideLayout :active-path="firstGuidePath">
    <article v-if="guide" class="guide-document">
      <header class="guide-document-header">
        <h1>{{ guide.title }}</h1>
      </header>
      <ContentRenderer class="prose" :value="guide" />
      <footer class="guide-document-footer">
        <span>{{ statusLabels[guide.sourceStatus] }} · 核验于 {{ formatDate(guide.lastVerified) }}</span>
        <div>
          <a href="https://github.com/example/smart-college-guide" target="_blank" rel="noreferrer"><GitBranch :size="16" /> 帮助修改</a>
          <NuxtLink to="/community">去社区提问 <ArrowUpRight :size="16" /></NuxtLink>
        </div>
      </footer>
    </article>
  </GuideLayout>
</template>
