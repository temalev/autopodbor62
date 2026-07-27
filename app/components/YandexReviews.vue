<script setup lang="ts">
/**
 * Виджет отзывов с Яндекс.Карт.
 *
 * Контент грузится в iframe с домена Яндекса — в индекс сайта он НЕ попадает
 * и объём текста страницы не увеличивает. Задача блока другая: доверие
 * посетителя и поток новых отзывов в карточку организации
 * (SEO_PLAN.md → Приоритет 2 — отзывы на Картах).
 *
 * iframe с loading="lazy" — грузится только при подходе к вьюпорту,
 * на LCP главной не влияет.
 */

/** ID организации в Яндекс.Картах */
const ORG_ID = '204442224583'

const WIDGET_URL = `https://yandex.ru/maps-reviews-widget/${ORG_ID}?comments`
const ORG_REVIEWS_URL = `https://yandex.ru/maps/org/autopodbor_62/${ORG_ID}/reviews/`

defineProps<{
  heading?: string
  subheading?: string
}>()
</script>

<template>
  <section class="ya-reviews" aria-labelledby="ya-reviews-heading">
    <div class="ya-reviews__inner">
      <h2 id="ya-reviews-heading" class="ya-reviews__heading">
        {{ heading || 'Отзывы на Яндекс.Картах' }}
      </h2>
      <p class="ya-reviews__sub">
        {{ subheading || 'Что пишут клиенты после работы с нами' }}
      </p>

      <div class="ya-reviews__frame">
        <iframe
          :src="WIDGET_URL"
          class="ya-reviews__iframe"
          loading="lazy"
          title="Отзывы об Автоподбор 62 на Яндекс.Картах"
        />
      </div>

      <a
        :href="ORG_REVIEWS_URL"
        target="_blank"
        rel="noopener noreferrer"
        class="ya-reviews__cta"
      >
        Оставить отзыв на Яндекс.Картах
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>
  </section>
</template>

<style scoped lang="scss">
.ya-reviews {
  padding: 64px 24px 72px;
  background: var(--color-bg-alt);

  @media (max-width: 720px) {
    padding: 48px 20px 56px;
  }
}

.ya-reviews__inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.ya-reviews__heading {
  font-size: clamp(22px, 3.5vw, 28px);
  font-weight: 800;
  color: var(--color-dark);
  letter-spacing: -0.02em;
  margin: 0 0 6px;
  text-align: center;
}

.ya-reviews__sub {
  font-size: 15px;
  color: var(--color-text-muted);
  margin: 0 0 28px;
  text-align: center;
}

.ya-reviews__frame {
  position: relative;
  // Контент виджета внутри iframe свёрстан как .badge с max-width: 760px —
  // если дать контейнеру больше, справа остаётся пустая полоса.
  width: 100%;
  max-width: 760px;
  align-self: center;
  height: 720px;
  overflow: hidden;
  border-radius: 12px;
  background: var(--color-surface);

  @media (max-width: 720px) {
    height: 560px;
  }
}

.ya-reviews__iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-sizing: border-box;
}

.ya-reviews__cta {
  display: inline-flex;
  align-self: center;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  padding: 14px 26px;
  border-radius: 10px;
  background: var(--color-accent);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s ease;

  &:hover {
    background: var(--color-accent-hover);
  }
}
</style>
