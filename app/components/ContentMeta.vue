<script setup lang="ts">
defineProps<{
  status: keyof typeof statusLabels
  lastVerified: string | Date
  cohorts?: number[]
}>()
</script>

<template>
  <div class="content-meta">
    <span>{{ statusLabels[status] }}</span>
    <span>核验于 {{ formatDate(lastVerified) }}</span>
    <span v-if="cohorts?.length">适用于 {{ cohorts.join(' / ') }} 级</span>
  </div>
</template>
