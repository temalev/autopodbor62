<script setup lang="ts">
interface RelatedService {
  to: string
  title: string
  description: string
}

defineProps<{
  items: RelatedService[]
  heading?: string
  subheading?: string
}>()
</script>

<template>
  <section class="related" aria-labelledby="related-heading">
    <div class="related__inner">
      <h2 id="related-heading" class="related__heading">{{ heading || 'Сопутствующие услуги' }}</h2>
      <p v-if="subheading" class="related__sub">{{ subheading }}</p>
      <div class="related__grid">
        <NuxtLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="related__card"
        >
          <span class="related__card-title">{{ item.title }}</span>
          <span class="related__card-desc">{{ item.description }}</span>
          <span class="related__card-arrow" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.related {
  padding: 64px 24px 72px;
  background: var(--color-bg-alt);

  @media (max-width: 720px) {
    padding: 48px 20px 56px;
  }
}

.related__inner {
  max-width: 1100px;
  margin: 0 auto;
}

.related__heading {
  font-size: clamp(22px, 3.5vw, 28px);
  font-weight: 800;
  color: var(--color-dark);
  letter-spacing: -0.02em;
  margin: 0 0 6px;
  text-align: center;
}

.related__sub {
  font-size: 15px;
  color: var(--color-text-muted);
  margin: 0 0 28px;
  text-align: center;
}

.related__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.related__card {
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

    .related__card-arrow {
      background: var(--color-accent);
      color: #fff;
    }
  }
}

.related__card-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-dark);
  line-height: 1.3;
}

.related__card-desc {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.related__card-arrow {
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
