<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <UApp>
    <div class="site-shell" :class="{ 'home-shell': route.path === '/' }">
      <AppHeader />
      <main>
        <NuxtPage />
      </main>
      <AppFooter v-if="route.path !== '/'" />
      <SearchPalette />
    </div>
  </UApp>
</template>
