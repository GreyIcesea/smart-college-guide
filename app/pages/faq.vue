<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'

useSeoMeta({ title: '常见问题', description: '课程、竞赛、科研与大学生活中的常见问题。' })

const { data: questions } = await useAsyncData('faq', () =>
  queryCollection('faq').order('order', 'ASC').all()
)
const active = ref<string | null>(questions.value?.[0]?.path ?? null)
</script>

<template>
  <div>
    <PageHeading title="常见问题" description="先看简明答案。涉及政策和时间节点的问题，请继续查看对应部门的最新正式通知。" />
    <div class="faq-list page-wrap">
      <section v-for="question in questions" :key="question.path" :class="{ open: active === question.path }">
        <button type="button" :aria-expanded="active === question.path" @click="active = active === question.path ? null : question.path">
          <span>{{ question.category }}</span>
          <h2>{{ question.title }}</h2>
          <ChevronDown :size="22" />
        </button>
        <div v-if="active === question.path" class="faq-answer">
          <ContentRenderer class="prose" :value="question" />
          <ContentMeta :status="question.sourceStatus" :last-verified="question.lastVerified" />
        </div>
      </section>
    </div>
    <AskCommunity />
  </div>
</template>
