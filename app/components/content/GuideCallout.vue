<script setup lang="ts">
import { CircleAlert, Info, Lightbulb, ShieldAlert, TriangleAlert } from '@lucide/vue'

const props = withDefaults(defineProps<{
  type?: 'info' | 'tip' | 'warning' | 'caution' | 'important'
  title?: string
}>(), {
  type: 'info',
  title: undefined
})

const labels = {
  info: '说明',
  tip: '提示',
  warning: '注意',
  caution: '警告',
  important: '重要'
}

const icons = {
  info: Info,
  tip: Lightbulb,
  warning: TriangleAlert,
  caution: CircleAlert,
  important: ShieldAlert
}

const label = computed(() => props.title || labels[props.type])
const icon = computed(() => icons[props.type])
</script>

<template>
  <aside class="guide-callout" :class="`guide-callout--${type}`" :aria-label="label">
    <div class="guide-callout__title">
      <component :is="icon" :size="17" aria-hidden="true" />
      <span>{{ label }}</span>
    </div>
    <div class="guide-callout__body">
      <slot />
    </div>
  </aside>
</template>
