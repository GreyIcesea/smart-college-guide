<script setup lang="ts">
import { ArrowUpRight, GitBranch } from '@lucide/vue'

const route = useRoute()
const guideStem = decodeURI(route.path).replace(/^\//, '')
const { data: guide } = await useAsyncData(`guide-${route.path}`, () =>
  queryCollection('guides').where('stem', '=', guideStem).first()
)

if (!guide.value) {
  throw createError({ statusCode: 404, statusMessage: '指南不存在' })
}

useSeoMeta({ title: () => guide.value?.title, description: () => guide.value?.description })

const needsDocumentHeader = computed(() => !guide.value?.category.startsWith('参考内容'))
</script>

<template>
  <GuideLayout>
    <article v-if="guide" class="guide-document">
      <header v-if="needsDocumentHeader" class="guide-document-header">
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
