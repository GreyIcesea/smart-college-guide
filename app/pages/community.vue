<script setup lang="ts">
import { GitBranch, MessagesSquare } from '@lucide/vue'

useSeoMeta({ title: '学生社区', description: '人工智能与自动化学院学生社区入口。' })
</script>

<template>
  <div>
    <PageHeading title="学生社区" description="具体、即时和需要讨论的问题，将在这里进入学生之间的问答。" />
    <section class="community-status page-wrap">
      <MessagesSquare :size="34" aria-hidden="true" />
      <div>
        <h2>社区入口正在筹备</h2>
        <p>正式地址尚未配置。社区上线前，本站继续专注于沉淀能够长期复用的指南内容。</p>
      </div>
      <a class="button button-primary" href="https://github.com/example/smart-college-guide" target="_blank" rel="noreferrer">
        <GitBranch :size="18" /> 参与内容建设
      </a>
    </section>
  </div>
</template>
