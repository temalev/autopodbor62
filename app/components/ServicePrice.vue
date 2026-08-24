<script setup lang="ts">
/**
 * Блок стоимости услуги. Один и тот же на всех страницах услуг, поэтому вынесен
 * в компонент: цены по плану появляются на шести страницах, и держать по копии
 * вёрстки со стилями в каждой — верный способ развести их между собой.
 *
 * Цену передаём числом: она же уходит в разметку Offer через serviceJsonLd(),
 * и так две записи не расходятся.
 */
interface Props {
  /** Сумма в рублях */
  price: number
  /** За что берётся сумма — короткая подпись над цифрой */
  caption: string
  badge?: string
  extraTitle?: string
  /** Фактические расходы, которые клиент платит сам, помимо нашей работы */
  extra?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  badge: 'Цена фиксированная',
  extraTitle: 'Сверх услуги оплачиваются',
  extra: () => [],
})

const priceLabel = computed(() => props.price.toLocaleString('ru-RU'))
</script>

<template>
  <div class="service-price">
    <div class="service-price__head">
      <div>
        <p class="service-price__caption">{{ caption }}</p>
        <p class="service-price__value">{{ priceLabel }}&nbsp;₽</p>
      </div>
      <span v-if="badge" class="service-price__badge">{{ badge }}</span>
    </div>

    <p v-if="$slots.note" class="service-price__note">
      <slot name="note" />
    </p>

    <template v-if="extra.length">
      <h3 class="service-price__extra-title">{{ extraTitle }}</h3>
      <ul class="service-price__list">
        <li v-for="item in extra" :key="item">{{ item }}</li>
      </ul>
    </template>

    <p v-if="$slots.hint" class="service-price__hint">
      <slot name="hint" />
    </p>
  </div>
</template>

<style scoped lang="scss">
.service-price {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 32px;
  box-shadow: var(--shadow-sm);

  @media (max-width: 720px) {
    padding: 24px 20px;
  }
}

.service-price__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 560px) {
    flex-direction: column;
    gap: 12px;
  }
}

.service-price__caption {
  margin: 0 0 6px;
  font-size: 15px;
  color: var(--color-text-muted);
}

.service-price__value {
  margin: 0;
  font-size: clamp(30px, 5vw, 44px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: var(--color-dark);
}

.service-price__badge {
  flex-shrink: 0;
  padding: 7px 14px;
  border-radius: 999px;
  background: var(--color-accent-bg);
  color: var(--color-accent-dark);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.service-price__note {
  margin: 28px 0 0;
  padding-top: 28px;
  border-top: 1px solid var(--color-border);
  font-size: 16px;
  line-height: 1.65;
  color: var(--color-text);
}

.service-price__extra-title {
  margin: 28px 0 14px;
  padding-top: 28px;
  border-top: 1px solid var(--color-border);
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-dark);
}

.service-price__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    position: relative;
    padding-left: 22px;
    font-size: 15px;
    line-height: 1.6;
    color: var(--color-text-muted);

    &::before {
      content: '—';
      position: absolute;
      left: 0;
      color: var(--color-border-strong);
    }
  }
}

.service-price__hint {
  margin: 16px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-muted);

  strong {
    color: var(--color-dark);
  }

  :deep(a) {
    color: var(--color-accent-dark);
    text-decoration: underline;
    text-underline-offset: 2px;
  }
}
</style>
