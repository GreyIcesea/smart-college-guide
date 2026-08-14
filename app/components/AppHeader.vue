<script setup lang="ts">
import { Menu, Moon, Search, Sun, X } from '@lucide/vue'

const route = useRoute()
const colorMode = useColorMode()
const searchOpen = useSearch()
const menuOpen = ref(false)

const links = [
  { label: '新生指南', to: '/guides' },
  { label: '老生指南', to: '/senior-guides' },
  { label: '课程百科', to: '/courses' },
  { label: '学习资料下载', to: '/resources' },
  { label: '竞赛指南', to: '/competitions' },
  { label: '学生社区', to: '/community' }
]

watch(
  () => route.fullPath,
  () => (menuOpen.value = false)
)

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <NuxtLink class="brand" to="/" aria-label="人工智能与自动化学院不完全指南首页">
        <span class="brand-crest" aria-hidden="true">
          <img src="/branding/college-logo.png" alt="" width="600" height="80">
        </span>
        <span class="brand-name">人工智能与自动化学院<span>不完全指南</span></span>
      </NuxtLink>

      <nav class="desktop-nav" aria-label="主导航">
        <NuxtLink v-for="link in links" :key="link.to" :to="link.to">
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="header-actions">
        <button class="icon-button search-button" type="button" aria-label="打开搜索" @click="searchOpen = true">
          <Search :size="19" />
          <kbd>⌘ K</kbd>
        </button>
        <button class="icon-button" type="button" aria-label="切换深色模式" @click="toggleColorMode">
          <Sun v-if="colorMode.value === 'dark'" :size="19" />
          <Moon v-else :size="19" />
        </button>
        <button class="icon-button mobile-menu-button" type="button" :aria-expanded="menuOpen" aria-label="打开导航" @click="menuOpen = !menuOpen">
          <X v-if="menuOpen" :size="21" />
          <Menu v-else :size="21" />
        </button>
      </div>
    </div>

    <nav v-if="menuOpen" class="mobile-nav" aria-label="移动端导航">
      <NuxtLink v-for="link in links" :key="link.to" :to="link.to">
        {{ link.label }}
      </NuxtLink>
    </nav>
  </header>
</template>
