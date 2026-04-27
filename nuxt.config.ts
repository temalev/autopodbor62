// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    resolve(__dirname, 'assets/styles/main.scss'),
    'element-plus/dist/index.css',
  ],
  app: {
    baseURL: (globalThis.process?.env?.NUXT_PUBLIC_BASE_URL as string) || '/',
    head: {
      title: 'Автоподбор 62 — проверка и подбор автомобиля в Рязани',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined' },
      ],
      meta: [
        {
          name: 'description',
          content: 'Профессиональный автоподбор и проверка автомобилей в Рязани. Подбор под ключ, разовая проверка, выкуп и продажа, регистрация в ГИБДД. Честный осмотр и отчёт без риска.',
        },
      ],
      script: [
        {
          type: 'text/javascript',
          innerHTML: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');ym(108781955,'init',{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});`,
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
