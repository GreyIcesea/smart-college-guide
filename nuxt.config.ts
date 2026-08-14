import { fileViewerRenderers } from '@file-viewer/vite-plugin'

export default defineNuxtConfig({
  compatibilityDate: '2026-08-01',
  devtools: { enabled: false },
  modules: ['@nuxt/content', '@nuxt/ui', '@nuxt/eslint'],
  css: ['@file-viewer/vue3/dist/file-viewer3.css', '~/assets/css/main.css'],
  vite: {
    plugins: [
      fileViewerRenderers({
        preset: 'office',
        copyAssets: {
          baseDir: 'file-viewer',
          mode: 'both'
        },
        chunkStrategy: 'renderer'
      })
    ]
  },
  ui: {
    fonts: false
  },
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },
  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      titleTemplate: '%s · 人工智能与自动化学院不完全指南',
      meta: [
        { name: 'description', content: '由学生共同维护的人工智能与自动化学院学习与成长指南。' },
        { name: 'theme-color', content: '#f4f5ef' }
      ],
      link: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }]
    }
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  },
  typescript: {
    strict: true,
    typeCheck: true
  }
})
