<script setup lang="ts">
import { SITE_URL, breadcrumbJsonLd, jsonLdScript } from '../utils/schema'

const PAGE_URL = `${SITE_URL}/o-nas`
const PAGE_TITLE = 'О нас — Автоподбор 62 в Рязани'
const PAGE_DESCRIPTION =
  'Автоподбор 62 — команда экспертов в Рязани. Автоподбор под ключ, проверка авто, выкуп и комиссионная продажа, регистрация в ГИБДД, импорт из Кореи и Китая. Контакты и карта.'
const PAGE_OG_IMAGE = `${SITE_URL}/images/team/ivan.webp`

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
        { name: 'О нас', url: PAGE_URL },
      ]),
      'ld-onas-breadcrumbs',
    ),
  ],
})
</script>

<template>
  <div class="about">
    <div class="about__hero">
      <div class="about__hero-inner">
        <NuxtLink to="/" class="about__back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          На главную
        </NuxtLink>
        <h1 class="about__title">О нас</h1>
        <p class="about__lead">Команда экспертов, которая помогает купить или продать автомобиль без риска и потери времени</p>
      </div>
    </div>

    <div class="about__section">
      <div class="about__container">
        <h2 class="about__h2">Кто мы</h2>
        <div class="about__text">
          <p>
            <strong>Автоподбор 62</strong> — это сервис полного цикла по подбору, проверке и сопровождению сделок с автомобилями в Рязани и области. Мы работаем с 2014 года и за это время помогли сотням клиентов купить честный автомобиль по адекватной цене или выгодно продать своё авто.
          </p>
          <p>
            Мы не просто осматриваем машины — мы анализируем рынок, проверяем историю и юридическую чистоту, оцениваем техническое состояние и сопровождаем сделку до получения ключей и номеров. Если автомобиль не стоит своих денег, мы прямо об этом говорим. Наша цель — чтобы вы получили результат без обмана, скрытых дефектов и лишних трат.
          </p>
          <p>
            В команде — технические эксперты с профильным образованием и многолетним опытом, а также юрист для сопровождения сделок, проверки документов. Мы проводим автоподбор под ключ, разовую проверку, выкуп и комиссионную продажу, регистрацию в ГИБДД, импорт из Кореи и Китая, приёмку после ремонта и оценку кузовного ремонта по КАСКО/ОСАГО.
          </p>
        </div>
      </div>
    </div>

    <div class="about__section about__section--alt">
      <div class="about__container">
        <h2 class="about__h2">Контакты</h2>
        <div class="about__contacts">
          <div class="about__contact-card">
            <span class="about__contact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.5 11.5 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.5 11.5 0 0 0 .57 3.6 1 1 0 0 1-.25 1.02l-2.2 2.17z"/></svg>
            </span>
            <div>
              <p class="about__contact-label">Телефон</p>
              <a :href="SITE_PHONE_HREF" class="about__contact-value">{{ SITE_PHONE_DISPLAY }}</a>
            </div>
          </div>
          <div class="about__contact-card">
            <span class="about__contact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </span>
            <div>
              <p class="about__contact-label">Telegram</p>
              <a href="https://t.me/Autopodbor62" target="_blank" rel="noopener noreferrer" class="about__contact-value">@Autopodbor62</a>
            </div>
          </div>
          <div class="about__contact-card">
            <span class="about__contact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>
            </span>
            <div>
              <p class="about__contact-label">География</p>
              <span class="about__contact-value">{{ SITE_ADDRESS }}</span>
            </div>
          </div>
          <div class="about__contact-card">
            <span class="about__contact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 14.93V17a1 1 0 0 0-2 0v-.07A8 8 0 0 1 4.07 11H5a1 1 0 0 0 0-2h-.93A8 8 0 0 1 11 4.07V5a1 1 0 0 0 2 0v-.93A8 8 0 0 1 19.93 11H19a1 1 0 0 0 0 2h.93A8 8 0 0 1 13 16.93z"/></svg>
            </span>
            <div>
              <p class="about__contact-label">Режим работы</p>
              <span class="about__contact-value">{{ SITE_HOURS }}</span>
            </div>
          </div>
          <div class="about__contact-card">
            <span class="about__contact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </span>
            <div>
              <p class="about__contact-label">Отзывы</p>
              <a href="https://www.avito.ru/brands/i17034625#open-reviews-list" target="_blank" rel="noopener noreferrer" class="about__contact-value">Наша страница на Авито</a>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.about {
  padding-top: 96px;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding-top: 88px;
  }
}

.about__hero {
  background: var(--color-dark);
  color: #fff;
  padding: 64px 24px 56px;
  text-align: center;
}

.about__hero-inner {
  max-width: 720px;
  margin: 0 auto;
}

.about__back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  margin-bottom: 32px;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-accent);
  }
}

.about__title {
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin: 0 0 16px;
}

.about__lead {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.55;
  margin: 0;
}

.about__section {
  padding: 64px 24px;

  @media (max-width: 720px) {
    padding: 48px 20px;
  }

  &--alt {
    background: var(--color-bg-alt);
  }
}

.about__container {
  max-width: 800px;
  margin: 0 auto;
}

.about__h2 {
  font-size: clamp(22px, 3.5vw, 28px);
  font-weight: 800;
  color: var(--color-dark);
  letter-spacing: -0.02em;
  margin: 0 0 32px;
  line-height: 1.2;

  &--light {
    color: #fff;
    text-align: center;
    margin-bottom: 24px;
  }
}

.about__text {
  font-size: 16px;
  line-height: 1.75;
  color: var(--color-text);

  p {
    margin: 0 0 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    color: var(--color-dark);
    font-weight: 700;
  }
}

.about__contacts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.about__contact-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--color-border-strong);
  }
}

.about__contact-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-accent-bg);
  color: var(--color-accent);
  border-radius: 12px;
}

.about__contact-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  margin: 0 0 6px;
}

.about__contact-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-dark);
  line-height: 1.4;

  &[href] {
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--color-accent);
    }
  }
}
</style>
