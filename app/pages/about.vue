<script setup lang="ts">
import { GitBranch } from '@lucide/vue'

useSeoMeta({ title: '关于本站', description: '了解智能院入门指北的内容边界与贡献方式。' })
</script>

<template>
  <div>
    <PageHeading title="关于本站" description="这是一个由学生共同维护的非官方知识项目，目标是让可靠经验能够跨届传递。" />
    <div class="about-content page-wrap prose">
      <h2>内容从哪里来</h2>
      <p>指南正文保存在 Git 仓库的 Markdown 和 YAML 文件中。每次修改都可以被审阅和追溯，普通贡献者不需要理解网站代码。</p>

      <h2>我们记录什么</h2>
      <p>适合长期复用的学习方法、培养方案解读、课程经验、竞赛入门和高频问题。短期、个别和需要讨论的问题，更适合进入问答社区。</p>

      <h2>信息边界</h2>
      <p>本站不替代学校或学院通知，不发布教师人格评价、考试泄题、盗版资源、私人信息和未经许可的内部文件。</p>

      <h2>参与贡献</h2>
      <p>你可以修正过期信息、补充来源或分享经过整理的经验。提交前请区分官方信息与个人经验，并写明适用届次和核验时间。</p>
      <a class="button button-primary" href="https://github.com/example/smart-college-guide" target="_blank" rel="noreferrer"><GitBranch :size="18" /> 前往 GitHub</a>

      <h2>免责声明</h2>
      <p>本站由学生自发建设和维护，为非官方项目，与学院及学校官方无隶属关系。涉及培养方案、课程安排、考试、竞赛、奖学金等信息，请以学校和学院最新官方通知为准。</p>
    </div>
  </div>
</template>
