<script setup lang="ts">
import { ChevronRight, Download, ExternalLink, X } from '@lucide/vue'
import {
  competitionGuideSections,
  type CompetitionGuideItem,
  type CompetitionGuideSection
} from '~/data/competitionGuide'

useSeoMeta({
  title: '竞赛指南',
  description: '按专业相关、其他竞赛和课内学科三类了解常见竞赛的时间、形式、所需技能与备赛建议。'
})

const competitionDialog = ref<HTMLDialogElement | null>(null)
const activeCompetition = ref<CompetitionGuideItem | null>(null)
const activeSection = ref<CompetitionGuideSection | null>(null)

const openCompetition = async (competition: CompetitionGuideItem, section: CompetitionGuideSection) => {
  activeCompetition.value = competition
  activeSection.value = section
  await nextTick()
  competitionDialog.value?.showModal()
}

const handleCompetitionClick = (
  _event: MouseEvent,
  competition: CompetitionGuideItem,
  section: CompetitionGuideSection
) => {
  if (window.getSelection()?.toString().trim()) return
  openCompetition(competition, section)
}

const closeCompetition = () => competitionDialog.value?.close()

const resetCompetition = () => {
  activeCompetition.value = null
  activeSection.value = null
}
</script>

<template>
  <main class="contest-guide contest-balanced page-wrap">
    <header class="contest-title-row">
      <h1>竞赛指南</h1>
      <p>比赛时间为常见安排，请以当届通知为准。</p>
    </header>

    <a
      class="contest-download-row"
      href="/downloads/河海大学学生竞赛级别认定结果清单（2025版）.pdf"
      download
    >
      <strong>河海大学学科竞赛认定表（2025 版）</strong>
      <span>下载 PDF <Download :size="16" aria-hidden="true" /></span>
    </a>

    <nav class="contest-category-nav" aria-label="竞赛分类">
      <a
        v-for="section in competitionGuideSections"
        :key="section.id"
        :class="`contest-nav-${section.id}`"
        :href="`#${section.id}`"
      >
        {{ section.title }}
      </a>
    </nav>

    <section
      v-for="section in competitionGuideSections"
      :id="section.id"
      :key="section.id"
      :class="['contest-section', `contest-theme-${section.id}`]"
      :aria-labelledby="`${section.id}-title`"
    >
      <h2 :id="`${section.id}-title`">{{ section.title }}</h2>

      <div class="contest-entry-list">
        <article
          v-for="competition in section.items"
          :key="competition.name"
          class="contest-entry"
          role="button"
          tabindex="0"
          :aria-label="`查看${competition.name}的完整信息`"
          @click="handleCompetitionClick($event, competition, section)"
          @keydown.enter.prevent="openCompetition(competition, section)"
          @keydown.space.prevent="openCompetition(competition, section)"
        >
          <header>
            <h3>
              {{ competition.name }}<span v-if="competition.aliases[0]" class="contest-inline-alias">（{{ competition.aliases[0] }}）</span>
            </h3>
            <ChevronRight class="contest-entry-arrow" :size="20" aria-hidden="true" />
          </header>

          <dl class="contest-details">
            <div>
              <dt>时间</dt>
              <dd>{{ competition.time }}</dd>
            </div>
            <div>
              <dt>形式</dt>
              <dd>{{ competition.format }}</dd>
            </div>
            <div>
              <dt>技能</dt>
              <dd>{{ competition.skills.join('、') }}</dd>
            </div>
            <div
              class="contest-detail-advice"
              :class="{ 'contest-detail-advice--long': competition.advice.length > 64 }"
            >
              <dt>建议</dt>
              <dd>{{ competition.advice }}</dd>
              <span v-if="competition.advice.length > 64" aria-hidden="true">…</span>
            </div>
          </dl>
        </article>
      </div>
    </section>

    <dialog
      ref="competitionDialog"
      :class="[
        'resource-dialog',
        'contest-dialog',
        activeSection ? `contest-theme-${activeSection.id}` : ''
      ]"
      aria-labelledby="contest-dialog-title"
      @click.self="closeCompetition"
      @close="resetCompetition"
    >
      <template v-if="activeCompetition">
        <header>
          <div class="contest-dialog-heading">
            <h2 id="contest-dialog-title">
              {{ activeCompetition.name }}<span v-if="activeCompetition.aliases[0]" class="contest-inline-alias">（{{ activeCompetition.aliases[0] }}）</span>
            </h2>
          </div>
          <button type="button" aria-label="关闭竞赛详情" title="关闭" @click="closeCompetition">
            <X :size="21" aria-hidden="true" />
          </button>
        </header>

        <div class="contest-dialog-scroll">
          <p class="contest-dialog-summary">{{ activeCompetition.description }}</p>

          <div class="contest-dialog-meta">
            <span>{{ activeSection?.title }}</span>
            <span>{{ activeCompetition.recognition }}</span>
          </div>

          <dl class="contest-dialog-facts">
            <div>
              <dt>比赛时间</dt>
              <dd>{{ activeCompetition.time }}</dd>
            </div>
            <div>
              <dt>比赛形式</dt>
              <dd>{{ activeCompetition.format }}</dd>
            </div>
            <div>
              <dt>需要的技能</dt>
              <dd>
                <ul>
                  <li v-for="skill in activeCompetition.skills" :key="skill">{{ skill }}</li>
                </ul>
              </dd>
            </div>
          </dl>

          <section class="contest-dialog-advice">
            <h3>备赛建议</h3>
            <p>{{ activeCompetition.advice }}</p>
          </section>

          <a
            class="contest-dialog-official"
            :href="activeCompetition.officialUrl"
            target="_blank"
            rel="noreferrer"
          >
            查看赛事官网
            <ExternalLink :size="17" aria-hidden="true" />
          </a>
        </div>
      </template>
    </dialog>
  </main>
</template>
