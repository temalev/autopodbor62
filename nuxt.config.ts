// https://nuxt.com/docs/api/configuration/nuxt-config
import { execSync } from 'node:child_process'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Файлы, которые выводятся на каждой странице: их правка меняет все страницы,
 * поэтому учитываем их в дате изменения любой из них. Компоненты, которые стоят
 * не везде (RelatedServices, YandexReviews), сюда сознательно не включены —
 * иначе правка виджета отзывов «обновляла» бы страницы, где его нет.
 */
const SHARED_UI = [
  'app/app.vue',
  'app/components/Header.vue',
  'app/components/Footer.vue',
  'assets/styles',
]

/**
 * Дата последнего коммита, тронувшего любой из путей, в формате ISO.
 * Нужна для честного `lastmod` в sitemap: `autoLastmod` ставил всем страницам
 * время сборки, то есть на каждом деплое сообщал об изменении всего сайта —
 * такой сигнал поисковик со временем перестаёт учитывать.
 *
 * Требует полной истории git: в CI у actions/checkout выставлен fetch-depth: 0.
 * Если истории нет (сборка из архива), возвращаем undefined — тогда `lastmod`
 * просто не попадёт в sitemap, что честнее одинаковой даты для всех страниц.
 */
function lastCommitISO(paths: string[]): string | undefined {
  try {
    const args = paths.map(p => JSON.stringify(p)).join(' ')
    const out = execSync(`git log -1 --format=%cI -- ${args}`, {
      cwd: __dirname,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    return out || undefined
  } catch {
    return undefined
  }
}

/** Страницы сайта: адрес со слэшем, файл для даты изменения и веса для sitemap. */
const PAGES = [
  { loc: '/', file: 'app/pages/index.vue', priority: 1.0, changefreq: 'weekly' },
  { loc: '/podbor/', file: 'app/pages/podbor.vue', priority: 0.9, changefreq: 'monthly' },
  { loc: '/proverka/', file: 'app/pages/proverka.vue', priority: 0.9, changefreq: 'monthly' },
  { loc: '/proverka-kuzova/', file: 'app/pages/proverka-kuzova.vue', priority: 0.8, changefreq: 'monthly' },
  { loc: '/vykup/', file: 'app/pages/vykup.vue', priority: 0.9, changefreq: 'monthly' },
  { loc: '/import/', file: 'app/pages/import.vue', priority: 0.9, changefreq: 'monthly' },
  { loc: '/registraciya-gibdd/', file: 'app/pages/registraciya-gibdd.vue', priority: 0.8, changefreq: 'monthly' },
  { loc: '/o-nas/', file: 'app/pages/o-nas.vue', priority: 0.6, changefreq: 'yearly' },
  { loc: '/dkp/', file: 'app/pages/dkp.vue', priority: 0.6, changefreq: 'yearly' },
  { loc: '/privacy-policy/', file: 'app/pages/privacy-policy.vue', priority: 0.3, changefreq: 'yearly' },
]

const SITEMAP_URLS = PAGES.map(({ loc, file, priority, changefreq }) => {
  const lastmod = lastCommitISO([file, ...SHARED_UI])
  return { loc, priority, changefreq, ...(lastmod ? { lastmod } : {}) }
})

const SITE_URL = 'https://xn--62-6kceem3eacgpr.xn--p1ai'

/**
 * Адреса, которые посетители угадывают и попадают на 404 — видно в Метрике по
 * входам со 100% отказов. Ведём их на живые страницы.
 */
const REDIRECTS: Record<string, string> = {
  '/about': '/o-nas/',
  '/contacts': '/o-nas/#kontakty',
}

/**
 * Страница-переадресация для статики. GitHub Pages не умеет отдавать 301,
 * поэтому переход делаем в самой странице. `canonical` здесь важнее самого
 * перехода: он говорит поисковику склеить старый адрес с новым (в canonical
 * якорь не указывают, поэтому отрезаем его). Видимая ссылка — на случай, если
 * и мета-обновление, и скрипт заблокированы.
 */
function redirectHtml(to: string): string {
  const canonical = SITE_URL + to.split('#')[0]
  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>Страница переехала — Автоподбор 62</title>
<link rel="canonical" href="${canonical}">
<meta http-equiv="refresh" content="0; url=${to}">
<script>location.replace(${JSON.stringify(to)})</script>
</head>
<body>
<p>Страница переехала. Если переход не сработал, <a href="${to}">откройте её вручную</a>.</p>
</body>
</html>`
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/sitemap'],
  experimental: {
    // Сбой загрузки чанка обрабатываем сами — см. app/plugins/chunk-reload.client.ts.
    // Встроенные режимы не годятся: 'automatic' реагирует только на переход между
    // страницами (а сбой бывает и на первой загрузке, её и видит робот),
    // 'automatic-immediate' перезагружает без ограничений и зацикливается,
    // если чанк недоступен насовсем.
    emitRouteChunkError: 'manual',
    defaults: {
      // Хостинг редиректит /podbor → /podbor/, поэтому внутренние ссылки сразу
      // ставим в конечной форме — иначе робот на каждой ссылке получает 301.
      nuxtLink: { trailingSlash: 'append' },
    },
  },
  site: {
    url: 'https://xn--62-6kceem3eacgpr.xn--p1ai',
    name: 'Автоподбор 62',
    // Канонический адрес страницы — со слэшем (так отдаёт хостинг).
    trailingSlash: true,
  },
  sitemap: {
    // Авто-обнаружение страниц + переопределяем priority/changefreq.
    // Google игнорирует priority, но Яндекс ещё учитывает.
    // Отключаем авто-сканирование <img> — иначе в sitemap попадают внешние
    // картинки с Авито (отзывы), которые нам там не нужны.
    discoverImages: false,
    // `lastmod` берём из git по каждой странице — см. lastCommitISO() выше.
    autoLastmod: false,
    urls: SITEMAP_URLS,
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
    // Element Plus: вместо полного index.css (~344 КБ) подключаем только нужные компоненты.
    'element-plus/theme-chalk/base.css',
    'element-plus/theme-chalk/el-collapse.css',
    'element-plus/theme-chalk/el-collapse-item.css',
    'element-plus/theme-chalk/el-collapse-transition.css',
    'element-plus/theme-chalk/el-drawer.css',
    'element-plus/theme-chalk/el-overlay.css',
  ],
  app: {
    baseURL: '/',
    head: {
      htmlAttrs: {
        lang: 'ru',
      },
      title: 'Автоподбор 62 — проверка и подбор автомобиля в Рязани',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap' },
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
  // Правила заданы и для формы со слэшем: на хостинге /about → 301 → /about/,
  // и до заглушки посетитель доходит уже по второму адресу.
  // На обычном сервере (после переезда с GitHub Pages) это станет честным 301.
  routeRules: Object.fromEntries(
    Object.entries(REDIRECTS).flatMap(([from, to]) => [
      [from, { redirect: { to, statusCode: 301 } }],
      [`${from}/`, { redirect: { to, statusCode: 301 } }],
    ]),
  ),
  nitro: {
    prerender: {
      crawlLinks: true,
      // Редиректы не находятся обходом ссылок — перечисляем явно
      routes: Object.keys(REDIRECTS),
    },
    hooks: {
      // Nitro отдаёт для редиректа голый мета-рефреш. Подменяем на страницу
      // с canonical и запасной ссылкой — см. redirectHtml() выше.
      'prerender:generate'(route) {
        const to = REDIRECTS[route.route] ?? REDIRECTS[route.route.replace(/\/$/, '')]
        if (to && route.fileName?.endsWith('.html')) route.contents = redirectHtml(to)
      },
    },
  },
  // Оптимизация для Element Plus
  vite: {
    optimizeDeps: {
      include: ['element-plus'],
    },
  },
})
