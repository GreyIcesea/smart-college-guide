<script setup lang="ts">
import { ExternalLink } from '@lucide/vue'

const route = useRoute()
const { data: competition } = await useAsyncData(`competition-${route.params.slug}`, () =>
  queryCollection('competitions').path(`/competitions/${route.params.slug}`).first()
)

if (!competition.value) throw createError({ statusCode: 404, statusMessage: '竞赛条目不存在' })
useSeoMeta({ title: () => competition.value?.title, description: () => competition.value?.description })
</script>

<template>
  <article v-if="competition">
    <header class="article-header page-wrap">
      <NuxtLink to="/competitions" class="back-link">返回竞赛指南</NuxtLink>
      <h1>{{ competition.title }}</h1>
      <p>{{ competition.description }}</p>
      <ContentMeta :status="competition.sourceStatus" :last-verified="competition.lastVerified" />
    </header>
    <div class="content-layout">
      <ContentRenderer class="prose" :value="competition" />
      <aside class="content-side">
        <dl class="side-facts">
          <div><dt>适合年级</dt><dd>{{ gradeLabel(competition.recommendedGrades) }}</dd></div>
          <div><dt>参与形式</dt><dd>{{ competition.teamSize }}</dd></div>
          <div><dt>入门难度</dt><dd>{{ competition.difficulty }} / 5</dd></div>
          <div><dt>建议基础</dt><dd>{{ competition.recommendedSkills.join(' / ') }}</dd></div>
        </dl>
        <a class="official-link" :href="competition.officialUrl" target="_blank" rel="noreferrer">查看赛事信息 <ExternalLink :size="16" /></a>
      </aside>
    </div>
    <AskCommunity :subject="competition.title" />
  </article>
</template>
