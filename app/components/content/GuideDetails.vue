<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'

withDefaults(defineProps<{
  title?: string
}>(), {
  title: '展开查看'
})
</script>

<template>
  <details class="guide-details">
    <summary>
      <ChevronRight :size="17" aria-hidden="true" />
      <span>{{ title }}</span>
    </summary>
    <div class="guide-details__body">
      <slot />
    </div>
  </details>
</template>
