<script setup lang="ts">
import officePreset from '@file-viewer/preset-office'
import { FileViewer } from '@file-viewer/vue3'

defineProps<{
  url: string
}>()

const viewerOptions = {
  preset: officePreset,
  rendererMode: 'replace' as const,
  styleIsolation: 'shadow' as const,
  theme: 'system' as const,
  search: true,
  toolbar: {
    download: false,
    print: false,
    exportHtml: false,
    theme: false,
    zoom: true,
    position: 'top' as const
  }
}
</script>

<template>
  <FileViewer
    class="resource-office-viewer"
    :url="url"
    :options="viewerOptions"
  />
</template>
