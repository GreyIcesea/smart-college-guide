<script setup lang="ts">
import { ArrowRight, BookOpen, Download, GraduationCap, MessagesSquare, Trophy, Users } from '@lucide/vue'

useSeoMeta({
  title: '首页',
  description: '由学生共同维护的人工智能与自动化学院学习、生活与成长指南。',
  ogTitle: '人工智能与自动化学院不完全指南',
  ogDescription: '从入学准备到课程、资料与竞赛，把重要经验留给下一届。'
})

const entrances = [
  { label: '新生指南', to: '/guides', icon: GraduationCap },
  { label: '老生指南', to: '/senior-guides', icon: Users },
  { label: '课程百科', to: '/courses', icon: BookOpen },
  { label: '资料下载', to: '/resources', icon: Download },
  { label: '竞赛指南', to: '/competitions', icon: Trophy },
  { label: '学生社区', to: '/community', icon: MessagesSquare }
]
</script>

<template>
  <div class="home-page">
    <section class="home-stage" aria-labelledby="home-title">
      <div class="home-stage-media" role="img" aria-label="河海大学人工智能与自动化学院楼正门" />
      <div class="home-stage-scrim" aria-hidden="true" />

      <div class="home-content">
        <p class="home-kicker">河海大学 · 学生共建知识站</p>
        <h1 id="home-title">人工智能与自动化学院<br><span>不完全指南</span></h1>
        <p class="home-lede">把课程、校园生活、学习资料和竞赛经验，整理成下一次选择前真正能用到的答案。</p>
        <div class="home-actions">
          <NuxtLink class="button button-primary" to="/guides">
            从新生指南开始 <ArrowRight :size="18" />
          </NuxtLink>
          <NuxtLink class="home-text-link" to="/courses">
            浏览课程百科 <ArrowRight :size="17" />
          </NuxtLink>
        </div>
      </div>

      <nav class="home-entrances" aria-label="主要内容入口">
        <NuxtLink v-for="item in entrances" :key="item.to" :to="item.to">
          <component :is="item.icon" :size="18" aria-hidden="true" />
          <span>{{ item.label }}</span>
          <ArrowRight class="home-entrance-arrow" :size="16" aria-hidden="true" />
        </NuxtLink>
      </nav>

      <p class="home-note">非官方网站 · 涉及政策与安排请以学校、学院最新通知为准</p>
    </section>
  </div>
</template>
