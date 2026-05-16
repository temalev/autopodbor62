// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/sitemap'],
  site: {
    url: 'https://xn--62-6kceem3eacgpr.xn--p1ai',
    name: 'Автоподбор 62',
  },
  sitemap: {
    // Авто-обнаружение страниц + переопределяем priority/changefreq.
    // Google игнорирует priority, но Яндекс ещё учитывает.
    // Отключаем авто-сканирование <img> — иначе в sitemap попадают внешние
    // картинки с Авито (отзывы), которые нам там не нужны.
    discoverImages: false,
    autoLastmod: true,
    urls: [
      { loc: '/', priority: 1.0, changefreq: 'weekly' },
      { loc: '/podbor', priority: 0.9, changefreq: 'monthly' },
      { loc: '/proverka', priority: 0.9, changefreq: 'monthly' },
      { loc: '/proverka-kuzova', priority: 0.8, changefreq: 'monthly' },
      { loc: '/vykup', priority: 0.9, changefreq: 'monthly' },
      { loc: '/import', priority: 0.9, changefreq: 'monthly' },
      { loc: '/registraciya-gibdd', priority: 0.8, changefreq: 'monthly' },
      { loc: '/o-nas', priority: 0.6, changefreq: 'yearly' },
      { loc: '/dkp', priority: 0.6, changefreq: 'yearly' },
      { loc: '/privacy-policy', priority: 0.3, changefreq: 'yearly' },
    ],
  },
  runtimeConfig: {
    public: {
      /**
       * Публичный endpoint для приёма заявок (например, Formspree).
       * Задаётся на этапе билда через переменную окружения.
       */
      formspreeEndpoint: process.env.NUXT_PUBLIC_FORMSPREE_ENDPOINT || 'https://formspree.io/f/mqenzran',
    },
  },
  css: [
    resolve(__dirname, 'assets/styles/main.scss'),
    'element-plus/dist/index.css',
  ],
  app: {
    baseURL: '/',
    head: {
      title: 'Автоподбор 62 — проверка и подбор автомобиля в Рязани',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
      meta: [
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Автоподбор 62' },
        { property: 'og:title', content: 'Автоподбор 62 — проверка и подбор автомобиля в Рязани' },
        { name: 'yandex-verification', content: '714fa8559263ac0d' },
        {
          name: 'description',
          content: 'Профессиональный автоподбор и проверка автомобилей в Рязани. Подбор под ключ, разовая проверка, выкуп и продажа, регистрация в ГИБДД. Честный осмотр и отчёт без риска.',
        },
        {
          property: 'og:description',
          content: 'Профессиональный автоподбор и проверка автомобилей в Рязани. Подбор под ключ, разовая проверка, выкуп и продажа, регистрация в ГИБДД. Честный осмотр и отчёт без риска.',
        },
        { name: 'twitter:card', content: 'summary_large_image' },
        // og:url, og:title, og:description, og:image, twitter:* — задаются индивидуально
        // на каждой странице через useHead() (см. app/pages/*.vue).
      ],
      script: [
        {
          src: 'https://mc.yandex.ru/metrika/tag.js',
          async: true,
        },
        {
          type: 'text/javascript',
          innerHTML: `window.ym=window.ym||function(){(window.ym.a=window.ym.a||[]).push(arguments)};window.ym.l=1*new Date();ym(108781955,'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`,
        },
      ],
      noscript: [
        {
          innerHTML: '<div><img src="https://mc.yandex.ru/watch/108781955" style="position:absolute; left:-9999px;" alt="" /></div>',
        },
      ],
    },
  },
  // Настройки для SSG
  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },
  // Оптимизация для Element Plus
  vite: {
    optimizeDeps: {
      include: ['element-plus'],
    },
  },
})
