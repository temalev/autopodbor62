<script setup lang="ts">
import { SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from './utils/site'

interface NuxtErrorLike {
  statusCode?: number
  statusMessage?: string
  message?: string
}

const props = defineProps<{ error: NuxtErrorLike }>()

const statusCode = computed(() => Number(props.error?.statusCode) || 500)
const isNotFound = computed(() => statusCode.value === 404)

const heading = computed(() =>
  isNotFound.value ? 'Страница не найдена' : 'Что-то пошло не так',
)

const subheading = computed(() =>
  isNotFound.value
    ? 'Возможно, мы перенесли или удалили эту страницу. Вернитесь на главную или посмотрите наши основные услуги ниже.'
    : 'Произошла техническая ошибка. Попробуйте обновить страницу или вернитесь на главную. Если ошибка повторится — позвоните нам.',
)

useHead({
  title: isNotFound.value
    ? '404 — Страница не найдена | Автоподбор 62'
    : `Ошибка ${statusCode.value} | Автоподбор 62`,
  meta: [
    { name: 'robots', content: 'noindex, follow' },
  ],
})

const services = [
  {
    to: '/podbor',
    title: 'Подбор автомобиля',
    description: 'Полный цикл: поиск, проверка, сделка, регистрация.',
  },
  {
    to: '/proverka',
    title: 'Разовая проверка',
    description: 'Полная диагностика и отчёт по 150+ фото перед покупкой.',
  },
  {
    to: '/vykup',
    title: 'Выкуп и комиссия',
    description: 'Срочный выкуп или продажа за вас по рыночной цене.',
  },
  {
    to: '/import',
    title: 'Импорт из Кореи и Китая',
    description: 'Покупка под ключ: подбор, логистика, таможня, ГИБДД.',
  },
  {
    to: '/registraciya-gibdd',
    title: 'Регистрация в ГИБДД',
    description: 'Поставим на учёт без очередей — документы, осмотр, номера.',
  },
  {
    to: '/proverka-kuzova',
    title: 'Проверка кузовного ремонта',
    description: 'Приёмка после ремонта или у дилера: ЛКП, фотоотчёт.',
  },
]

function handleHomeClick(event: MouseEvent) {
  event.preventDefault()
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="error">
    <div class="error__hero">
      <div class="error__hero-inner">
        <span class="error__code">{{ statusCode }}</span>
        <h1 class="error__title">{{ heading }}</h1>
        <p class="error__lead">{{ subheading }}</p>
        <div class="error__cta">
          <a href="/" class="error__btn error__btn--primary" @click="handleHomeClick">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12l2-2 7-7 7 7 2 2"/><path d="M5 10v10h14V10"/></svg>
            На главную
          </a>
          <a :href="SITE_PHONE_HREF" class="error__btn error__btn--ghost">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.5 11.5 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.5 11.5 0 0 0 .57 3.6 1 1 0 0 1-.25 1.02l-2.2 2.17z"/></svg>
            {{ SITE_PHONE_DISPLAY }}
          </a>
        </div>
      </div>
    </div>

    <section v-if="isNotFound" class="error__services">
      <div class="error__services-inner">
        <h2 class="error__h2">Наши услуги</h2>
        <p class="error__h2-sub">Возможно, вы искали что-то из этого</p>
        <div class="error__grid">
          <NuxtLink
            v-for="service in services"
            :key="service.to"
            :to="service.to"
            class="error__card"
          >
            <span class="error__card-title">{{ service.title }}</span>
            <span class="error__card-desc">{{ service.description }}</span>
            <span class="error__card-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.error {
  min-height: 100vh;
  background: var(--color-bg);
  padding-top: 96px;

  @media (max-width: 768px) {
    padding-top: 88px;
  }
}

.error__hero {
  background: var(--color-dark);
  color: #fff;
  padding: 72px 24px 64px;
  text-align: center;
}

.error__hero-inner {
  max-width: 680px;
  margin: 0 auto;
}

.error__code {
  display: inline-block;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-accent);
  background: var(--color-accent-soft);
  border-radius: 999px;
  padding: 6px 14px;
  margin-bottom: 20px;
}

.error__title {
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin: 0 0 18px;
}

.error__lead {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin: 0 0 32px;
}

.error__cta {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.error__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  padding: 12px 22px;
  border-radius: var(--radius);
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

  &--primary {
    background: var(--color-accent);
    color: #fff;
    box-shadow: var(--shadow-orange);

    &:hover {
      background: var(--color-accent-hover);
    }
  }

  &--ghost {
    background: transparent;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.2);

    &:hover {
      border-color: var(--color-accent);
      color: var(--color-accent);
    }
  }
}

.error__services {
  padding: 64px 24px 80px;

  @media (max-width: 720px) {
    padding: 48px 20px 56px;
  }
}

.error__services-inner {
  max-width: 1100px;
  margin: 0 auto;
}

.error__h2 {
  font-size: clamp(22px, 3.5vw, 28px);
  font-weight: 800;
  color: var(--color-dark);
  letter-spacing: -0.02em;
  margin: 0 0 6px;
  text-align: center;
}

.error__h2-sub {
  font-size: 15px;
  color: var(--color-text-muted);
  margin: 0 0 28px;
  text-align: center;
}

.error__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.error__card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 22px 60px 22px 22px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  text-decoration: none;
  color: var(--color-text);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: var(--color-accent);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);

    .error__card-arrow {
      background: var(--color-accent);
      color: #fff;
    }
  }
}

.error__card-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-dark);
}

.error__card-desc {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.error__card-arrow {
  position: absolute;
  top: 50%;
  right: 18px;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-accent-bg);
  color: var(--color-accent);
  border-radius: 50%;
  transition: background 0.2s ease, color 0.2s ease;
}
</style>
