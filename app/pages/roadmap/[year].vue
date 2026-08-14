<script setup lang="ts">
import { ArrowLeft, ArrowRight } from '@lucide/vue'

const route = useRoute()
const year = computed(() => Number(String(route.params.year).replace('year-', '')))

const roadmaps = {
  1: {
    title: '大一：建立自己的节奏',
    description: '先适应大学的学习方式，再打好数学和编程基础。不必在第一个学期决定未来四年的方向。',
    stages: [
      ['入学与适应', '熟悉正式通知渠道、校园资源和课程安排，建立稳定作息。'],
      ['数学与编程', '把高数和程序设计作为长期能力训练，及时处理没有理解的基础概念。'],
      ['了解专业', '通过课程介绍、公开讲座和学长经验认识方向，不急于追逐名词。'],
      ['第一次尝试', '根据兴趣参加一次小项目、竞赛或社团活动，目标是完成完整流程。']
    ]
  },
  2: {
    title: '大二：走进专业基础',
    description: '课程开始互相连接。这一年适合建立扎实的数据结构、数学与工程基础，并发现自己的兴趣。',
    stages: [
      ['连接基础课', '理解线性代数、概率和程序设计如何进入后续专业课程。'],
      ['完成小项目', '把课程知识放进一个规模可控的作品，练习文档和版本管理。'],
      ['参与竞赛', '选择与当前基础匹配的赛事，重视复盘而不是单纯追求数量。'],
      ['认识方向', '了解科研、工程、升学和就业需要的能力，开始保留自己的选择记录。']
    ]
  },
  3: {
    title: '大三：做出有依据的选择',
    description: '专业核心课、科研、实习和升学准备会同时出现。减少无目的尝试，把时间投入到明确方向。',
    stages: [
      ['专业核心课', '补齐方向所需的关键基础，用项目检验是否真正掌握。'],
      ['科研或工程', '选择一种真实工作方式深入体验，形成可以复盘的成果。'],
      ['收集信息', '提前核对保研、考研、就业或留学的正式要求和时间线。'],
      ['明确主线', '根据体验与信息确定主要方向，同时保留现实的备选方案。']
    ]
  },
  4: {
    title: '大四：完成选择与交接',
    description: '处理毕业设计、升学或就业安排，也把有价值的经验整理下来，留给下一届继续使用。',
    stages: [
      ['推进毕业任务', '把毕业设计拆成稳定里程碑，尽早暴露数据、实验和写作风险。'],
      ['完成毕业选择', '按正式时间节点处理升学、就业和材料手续。'],
      ['整理个人资料', '归档项目、课程记录和必要文件，清理未经授权的共享资料。'],
      ['留下经验', '把反复被问到的问题写成可核验的指南，而不是散落在聊天记录里。']
    ]
  }
} as const

const roadmap = computed(() => roadmaps[year.value as keyof typeof roadmaps])
if (!roadmap.value) throw createError({ statusCode: 404, statusMessage: '年级路线不存在' })

useSeoMeta({ title: () => roadmap.value?.title, description: () => roadmap.value?.description })
</script>

<template>
  <div v-if="roadmap">
    <PageHeading :title="roadmap.title" :description="roadmap.description" />
    <div class="roadmap page-wrap">
      <nav class="roadmap-years" aria-label="切换年级">
        <NuxtLink v-for="item in 4" :key="item" :to="`/roadmap/year-${item}`">大{{ ['一', '二', '三', '四'][item - 1] }}</NuxtLink>
      </nav>
      <div class="roadmap-track">
        <section v-for="(stage, index) in roadmap.stages" :key="stage[0]">
          <span>{{ String(index + 1).padStart(2, '0') }}</span>
          <div><h2>{{ stage[0] }}</h2><p>{{ stage[1] }}</p></div>
        </section>
      </div>
      <div class="roadmap-navigation">
        <NuxtLink v-if="year > 1" :to="`/roadmap/year-${year - 1}`"><ArrowLeft :size="17" /> 上一年</NuxtLink>
        <NuxtLink v-if="year < 4" :to="`/roadmap/year-${year + 1}`">下一年 <ArrowRight :size="17" /></NuxtLink>
      </div>
    </div>
  </div>
</template>
