<script setup lang="ts">
import type { CaseItem } from '../utils/cases'

const props = defineProps<{
  items: CaseItem[]
  heading?: string
  subheading?: string
  /** Ссылка «Все кейсы» под карточками — для блоков на страницах услуг. */
  allLink?: boolean
}>()

const headingId = computed(() => (props.heading ? `cases-heading-${props.items[0]?.slug ?? 'list'}` : undefined))

const { app: { baseURL } } = useRuntimeConfig()
const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL
</script>

<template>
  <section class="cases" :aria-labelledby="headingId">
    <div class="cases__inner">
      <h2 v-if="heading" :id="headingId" class="cases__heading">{{ heading }}</h2>
      <p v-if="subheading" class="cases__sub">{{ subheading }}</p>
      <div class="cases__grid">
        <article v-for="item in items" :key="item.slug" class="cases__card">
          <div class="cases__media">
            <img
              v-if="item.image"
              :src="`${base}${item.image}`"
              :alt="item.imageAlt"
              width="800"
              height="600"
              loading="lazy"
              decoding="async"
              class="cases__img"
            />
            <span class="cases__origin">{{ item.origin }}</span>
          </div>
          <div class="cases__body">
            <h3 class="cases__title">{{ item.title }}</h3>
            <p class="cases__price">
              {{ item.price }}
              <span v-if="item.priceNote" class="cases__price-note">{{ item.priceNote }}</span>
            </p>
            <p class="cases__text">{{ item.text }}</p>
            <dl class="cases__stats">
              <div v-for="stat in item.stats" :key="stat.label" class="cases__stat">
                <dt class="cases__stat-label">{{ stat.label }}</dt>
                <dd class="cases__stat-value">{{ stat.value }}</dd>
              </div>
            </dl>
          </div>
        </article>
      </div>
      <div v-if="allLink" class="cases__all">
        <NuxtLink to="/kejsy" class="cases__all-link">
          Все кейсы
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cases {
  padding: 64px 24px 72px;

  @media (max-width: 720px) {
    padding: 48px 20px 56px;
  }
}

.cases__inner {
  max-width: 1100px;
  margin: 0 auto;
}

.cases__heading {
  font-size: clamp(24px, 3.5vw, 32px);
  font-weight: 800;
  color: var(--color-dark);
  letter-spacing: -0.02em;
  margin: 0 0 6px;
  text-align: center;
}

.cases__sub {
  font-size: 15px;
  color: var(--color-text-muted);
  margin: 0 0 28px;
  text-align: center;
}

.cases__grid {
  display: grid;
  // Ширина карточки ограничена и сетка по центру — иначе в блоке из двух
  // кейсов (страница импорта) справа остаётся пустая колонка.
  grid-template-columns: repeat(auto-fit, minmax(300px, 350px));
  justify-content: center;
  gap: 20px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
}

.cases__card {
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.cases__media {
  position: relative;
  aspect-ratio: 4 / 3;
  background: var(--color-bg-alt);
}

.cases__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cases__origin {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 999px;
}

.cases__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px 22px 22px;
}

.cases__title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-dark);
  line-height: 1.3;
  margin: 0 0 6px;
}

.cases__price {
  font-size: 17px;
  font-weight: 800;
  color: var(--color-accent);
  margin: 0 0 12px;
}

.cases__price-note {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.cases__text {
  font-size: 15px;
  color: var(--color-text);
  line-height: 1.6;
  margin: 0 0 16px;
}

.cases__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: auto 0 0;
  padding-top: 14px;
  border-top: 1px solid var(--color-border);
}

.cases__stat-label {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 0 0 2px;
}

.cases__stat-value {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-dark);
  margin: 0;
  line-height: 1.3;
}

.cases__all {
  margin-top: 28px;
  text-align: center;
}

.cases__all-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-accent);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
