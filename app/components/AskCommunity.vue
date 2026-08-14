<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue'

defineProps<{ subject?: string }>()
</script>

<template>
  <aside class="ask-community">
    <div>
      <h2>还有具体问题？</h2>
      <p>{{ subject ? `带着“${subject}”去社区提问，问题会更容易被看见。` : '去问答社区看看往届同学的回答。' }}</p>
    </div>
    <NuxtLink class="button button-dark" to="/community">
      去社区提问 <ArrowUpRight :size="18" />
    </NuxtLink>
  </aside>
</template>
