<script setup lang="ts">
import { Search, X } from '@lucide/vue'
import { courseEncyclopedia } from '~/data/courseEncyclopedia'
import { guidePathFromStem } from '~/utils/guideNavigation'

const open = useSearch()
const query = ref('')
const input = ref<HTMLInputElement | null>(null)

const { data } = await useAsyncData('global-search-content', async () => {
  const [guides, competitions, faq] = await Promise.all([
    queryCollection('guides').select('title', 'description', 'path', 'stem').all(),
    queryCollection('competitions').select('title', 'description', 'path').all(),
    queryCollection('faq').select('title', 'description', 'path').all()
  ])

  return [
    ...guides.map((item) => ({ ...item, path: guidePathFromStem(item.stem), kind: '指南' })),
    ...courseEncyclopedia.map(({ title, description, path }) => ({ title, description, path, kind: '课程' })),
    ...competitions.map((item) => ({ ...item, kind: '竞赛' })),
    ...faq.map((item) => ({ ...item, kind: '问答' }))
  ]
})

const results = computed(() => {
  const keyword = query.value.trim().toLocaleLowerCase()
  if (!keyword) return data.value?.slice(0, 8) ?? []
  return (data.value ?? [])
    .filter((item) => `${item.title} ${item.description}`.toLocaleLowerCase().includes(keyword))
    .slice(0, 12)
})

watch(open, async (value) => {
  if (value) {
    await nextTick()
    input.value?.focus()
  } else {
    query.value = ''
  }
})

function close() {
  open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    open.value = !open.value
  }
  if (event.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="search-overlay" role="presentation" @click.self="close">
      <section class="search-panel" role="dialog" aria-modal="true" aria-label="全站搜索">
        <div class="search-input-row">
          <Search :size="21" aria-hidden="true" />
          <input ref="input" v-model="query" type="search" placeholder="搜索课程、指南、竞赛或问题">
          <button class="icon-button" type="button" aria-label="关闭搜索" @click="close"><X :size="20" /></button>
        </div>
        <div class="search-results">
          <NuxtLink v-for="item in results" :key="item.path" :to="item.path" @click="close">
            <span>{{ item.kind }}</span>
            <strong>{{ item.title }}</strong>
            <p>{{ item.description }}</p>
          </NuxtLink>
          <p v-if="!results.length" class="empty-state">没有找到相关内容。换一个关键词试试。</p>
        </div>
      </section>
    </div>
  </Teleport>
</template>
