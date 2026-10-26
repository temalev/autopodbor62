<script setup lang="ts">
import { CASES } from '../utils/cases'
import {
  SITE_URL,
  breadcrumbJsonLd,
  jsonLdScript,
} from '../utils/schema'

const relatedServices = [
  {
    to: '/podbor',
    title: 'Подбор под ключ',
    description: 'Найдём, проверим и оформим машину под ваш бюджет — как в кейсах выше.',
  },
  {
    to: '/import',
    title: 'Импорт из Кореи, Китая и Японии',
    description: 'Когда в России за эти деньги только старше и с пробегом — везём из-за рубежа.',
  },
  {
    to: '/proverka',
    title: 'Разовая проверка',
    description: 'Уже нашли вариант сами? Проверим перед сделкой и дадим заключение эксперта.',
  },
]

const { app: { baseURL } } = useRuntimeConfig()
const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL

const PAGE_URL = `${SITE_URL}/kejsy/`
const PAGE_TITLE = 'Кейсы автоподбора в Рязани — Автоподбор 62'
const PAGE_DESCRIPTION =
  'Реальные подборы Автоподбор 62: Tucson, Jetta, X-Trail и Octavia с рынка РФ, Audi A3 и BMW X4 из Китая и Кореи — задача, срок поиска и цена покупки.'
const PAGE_OG_IMAGE = `${SITE_URL}/images/cases/hyundai-tucson-2020.webp`

useHead({
  title: PAGE_TITLE,
  meta: [
    { name: 'description', content: PAGE_DESCRIPTION },
    { property: 'og:url', content: PAGE_URL },
    { property: 'og:title', content: PAGE_TITLE },
    { property: 'og:description', content: PAGE_DESCRIPTION },
    { property: 'og:image', content: PAGE_OG_IMAGE },
    { property: 'og:image:type', content: 'image/webp' },
    { name: 'twitter:image', content: PAGE_OG_IMAGE },
  ],
  link: [{ rel: 'canonical', href: PAGE_URL }],
  script: [
    jsonLdScript(
      breadcrumbJsonLd([
        { name: 'Главная', url: `${SITE_URL}/` },
        { name: 'Кейсы', url: PAGE_URL },
      ]),
      'ld-kejsy-breadcrumbs',
    ),
  ],
})
</script>

<template>
  <div class="kejsy-page">
    <div class="kejsy-page__hero">
      <div class="kejsy-page__hero-bg">
        <img :src="`${base}/images/office.webp`" alt="Офис Автоподбор 62 на Грибоедова, 8Б в Рязани" width="1050" height="1400" fetchpriority="high" decoding="async" class="kejsy-page__hero-img" />
        <div class="kejsy-page__hero-overlay" />
      </div>
      <div class="kejsy-page__hero-content">
        <NuxtLink to="/" class="kejsy-page__back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          На главную
        </NuxtLink>
        <p class="kejsy-page__label">Кейсы</p>
        <h1 class="kejsy-page__title">Кейсы автоподбора: что нашли и за сколько</h1>
        <p class="kejsy-page__lead">Последние подборы и привозы — с задачей клиента, найденной машиной, сроком поиска и ценой покупки. Все цифры — по итогам реальных сделок.</p>
      </div>
    </div>

    <CaseCards :items="CASES" />

    <RelatedServices :items="relatedServices" heading="Хотите так же?" subheading="Расскажите о бюджете и задаче — подберём под вас" />
  </div>
</template>

<style scoped lang="scss">
.kejsy-page {
  padding-top: 0;
  min-height: 100vh;
}

.kejsy-page__hero {
  position: relative;
  // Потолок в px — см. комментарий у hero на главной (Googlebot и vh).
  min-height: min(60vh, 640px);
  display: flex;
  align-items: flex-end;
  padding: 120px 24px 64px;

  @media (max-width: 768px) {
    min-height: min(55vh, 520px);
    padding: 100px 20px 48px;
  }
}

.kejsy-page__hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.kejsy-page__hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.kejsy-page__hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.95) 100%);
}

.kejsy-page__hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  color: #fff;
}

.kejsy-page__back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  margin-bottom: 24px;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-accent);
  }
}

.kejsy-page__label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-accent);
  margin: 0 0 12px;
}

.kejsy-page__title {
  font-size: clamp(28px, 4.5vw, 42px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin: 0 0 16px;
}

.kejsy-page__lead {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.55;
  margin: 0;
}
</style>
