<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="error-page page-wrap">
    <p class="error-code">{{ error.statusCode }}</p>
    <h1>{{ error.statusCode === 404 ? '这一页还没有写下' : '页面暂时无法打开' }}</h1>
    <p>{{ error.statusCode === 404 ? '可能是链接发生了变化，也可能这部分内容仍在整理。' : error.message }}</p>
    <button class="button button-primary" type="button" @click="handleError">
      返回首页
    </button>
  </div>
</template>
