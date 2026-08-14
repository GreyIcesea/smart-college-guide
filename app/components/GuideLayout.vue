<script setup lang="ts">
import { ChevronDown, Menu, X } from '@lucide/vue'
import {
  buildGuideNavigation,
  type GuideNavigationItem,
  type GuideNavigationSource
} from '~/utils/guideNavigation'

const route = useRoute()
const menuOpen = ref(false)
const props = defineProps<{
  activePath?: string
}>()
const activeRoutePath = computed(() => decodeURI(props.activePath ?? route.path))
const sidebarElement = ref<HTMLElement>()
const sidebarScrollTop = useState('guide-sidebar-scroll-top', () => 0)
const openSectionTitles = useState<string[]>('guide-open-sections', () => [])

const { data: guides } = await useAsyncData('guide-navigation', () =>
  queryCollection('guides')
    .select('title', 'slug', 'path', 'stem', 'category', 'order')
    .all()
)

const sections = computed(() => {
  const navigation = buildGuideNavigation((guides.value ?? []) as GuideNavigationSource[])
  return navigation.map((section) => {
    const items = [
      ...(section.overview ? [section.overview] : []),
      ...section.groups.flatMap((group) => group.items)
    ]
    return {
      ...section,
      items,
      active: items.some((item) => item.path === activeRoutePath.value)
    }
  })
})

const currentLocation = computed(() => {
  for (const section of sections.value) {
    if (section.overview?.path === activeRoutePath.value) {
      return { section: section.title, group: '概览', item: section.overview }
    }
    for (const group of section.groups) {
      const item = group.items.find((candidate) => candidate.path === activeRoutePath.value)
      if (item) return { section: section.title, group: group.title, item }
    }
  }
  return undefined
})

const activeSectionTitle = computed(() =>
  sections.value.find((section) => section.active)?.title
)

watch(activeSectionTitle, (title) => {
  if (!title || openSectionTitles.value.includes(title)) return
  openSectionTitles.value = [...openSectionTitles.value, title]
}, { immediate: true })

function handleSectionToggle(title: string, event: Event) {
  const open = (event.currentTarget as HTMLDetailsElement).open
  const titles = new Set(openSectionTitles.value)
  if (open) titles.add(title)
  else titles.delete(title)
  openSectionTitles.value = [...titles]
}

function handleSidebarScroll(event: Event) {
  sidebarScrollTop.value = (event.currentTarget as HTMLElement).scrollTop
}

function closeMenu() {
  menuOpen.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && menuOpen.value) closeMenu()
}

watch(
  () => route.fullPath,
  closeMenu
)

watch(menuOpen, (open) => {
  if (!import.meta.client) return
  document.documentElement.classList.toggle('guide-menu-open', open)
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  nextTick(() => {
    if (sidebarElement.value) sidebarElement.value.scrollTop = sidebarScrollTop.value
  })
})
onBeforeUnmount(() => {
  if (sidebarElement.value) sidebarScrollTop.value = sidebarElement.value.scrollTop
  window.removeEventListener('keydown', handleKeydown)
  document.documentElement.classList.remove('guide-menu-open')
})

function itemClass(item: GuideNavigationItem) {
  return [
    `depth-${Math.min(item.depth, 1)}`,
    { overview: item.role === 'overview' }
  ]
}
</script>

<template>
  <div class="guide-shell">
    <button
      class="guide-menu-trigger"
      type="button"
      aria-controls="guide-navigation"
      :aria-expanded="menuOpen"
      @click="menuOpen = !menuOpen"
    >
      <Menu v-if="!menuOpen" :size="19" />
      <X v-else :size="19" />
      <span>目录</span>
    </button>

    <aside
      id="guide-navigation"
      ref="sidebarElement"
      class="guide-sidebar"
      :class="{ open: menuOpen }"
      @scroll.passive="handleSidebarScroll"
    >
      <div class="guide-sidebar-heading">
        <div>
          <NuxtLink to="/guides">新生指南</NuxtLink>
        </div>
        <button type="button" aria-label="关闭目录" @click="closeMenu"><X :size="20" /></button>
      </div>

      <nav aria-label="新生指南目录">
        <template v-for="section in sections" :key="section.title">
          <details
            :open="openSectionTitles.includes(section.title)"
            @toggle="handleSectionToggle(section.title, $event)"
          >
            <summary>
              <span>{{ section.title }}</span>
              <ChevronDown :size="16" />
            </summary>

            <div class="guide-nav-section-body">
              <NuxtLink
                v-if="section.overview"
                :to="section.overview.path"
                class="guide-section-overview"
                :class="{ 'is-active': section.overview.path === activeRoutePath }"
              >
                {{ section.overview.label }}
              </NuxtLink>

              <div v-for="group in section.groups" :key="group.title" class="guide-nav-group">
                <p>{{ group.title }}</p>
                <NuxtLink
                  v-for="item in group.items"
                  :key="item.slug"
                  :to="item.path"
                  :class="[itemClass(item), { 'is-active': item.path === activeRoutePath }]"
                >
                  {{ item.label }}
                </NuxtLink>
              </div>
            </div>
          </details>
        </template>
      </nav>
    </aside>

    <div v-if="menuOpen" class="guide-sidebar-backdrop" aria-hidden="true" @click="closeMenu" />

    <main class="guide-reading-pane">
      <div class="guide-reading-inner">
        <div v-if="currentLocation" class="guide-breadcrumb" aria-label="当前位置">
          <NuxtLink to="/guides">新生指南</NuxtLink>
          <span>/</span>
          <span>{{ currentLocation.section }}</span>
          <span>/</span>
          <span>{{ currentLocation.group }}</span>
        </div>

        <slot />
      </div>
    </main>
  </div>
</template>
