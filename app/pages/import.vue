<script setup lang="ts">
const { app: { baseURL } } = useRuntimeConfig()
const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL

useHead({
  title: 'Импорт авто из Кореи и Китая под ключ — Автоподбор 62',
  meta: [
    {
      name: 'description',
      content: 'Покупка автомобиля в Корее и Китае под ключ: подбор, проверка, логистика, таможня, доставка в Рязань, ТО и регистрация. Прозрачная цена, без скрытых платежей.',
    },
  ],
})

const steps = [
  { num: '01', title: 'Заявка и бюджет', text: 'Обсуждаем задачу, бюджет и пожелания к автомобилю. Определяем рынок (Корея или Китай) и ориентировочные сроки.' },
  { num: '02', title: 'Анализ рынка и подбор', text: 'Ищем варианты на аукционах и у проверенных поставщиков. Проверяем историю, аукционный лист, пробег и состояние. Отбираем несколько вариантов под ваши критерии.' },
  { num: '03', title: 'Проверка и сопровождение сделки', text: 'Проводим детальную проверку выбранного авто на месте. Сопровождаем сделку: документы, оплата, страховка. Контролируем погрузку и отправку.' },
  { num: '04', title: 'Логистика и таможня', text: 'Организуем доставку до России, таможенное оформление и расчёт пошлин. Всё прозрачно — вы знаете итоговую стоимость до начала процесса.' },
  { num: '05', title: 'Доставка в Рязань', text: 'Автомобиль приходит в Рязань. Мы принимаем его, проверяем состояние после перевозки и при необходимости устраняем мелкие моменты.' },
  { num: '06', title: 'ТО, детейлинг и регистрация', text: 'Проводим техобслуживание, детейлинг (мойка, полировка, химчистка). Оформляем регистрацию в ГИБДД. Вы получаете авто с номерами, обслуженное и готовое к эксплуатации.' },
]
</script>

<template>
  <div class="import-page">
    <div class="import-page__hero">
      <div class="import-page__hero-bg">
        <img :src="`${base}/images/korea.webp`" alt="Авто из Кореи и Китая" class="import-page__hero-img" />
        <div class="import-page__hero-overlay" />
      </div>
      <div class="import-page__hero-content">
        <NuxtLink to="/" class="import-page__back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          На главную
        </NuxtLink>
        <p class="import-page__label">Импорт из Кореи и Китая</p>
        <h1 class="import-page__title">Покупка автомобиля в Корее и Китае под ключ</h1>
        <p class="import-page__lead">От подбора на аукционе до номеров в Рязани — берём на себя весь цикл. Вы получаете готовый к эксплуатации автомобиль с прозрачной историей и финальной ценой без сюрпризов.</p>
      </div>
    </div>

    <section class="import-page__section">
      <div class="import-page__container">
        <h2 class="import-page__h2">Почему импортные автомобили — выгодно и надёжно</h2>
        <p class="import-page__intro">Автомобили с рынков Кореи и Китая часто оказываются выгоднее и честнее российских предложений: прозрачная история, нормы эксплуатации и культура ухода за техникой делают их привлекательным выбором.</p>
        <ul class="import-page__features">
          <li class="import-page__feature">
            <span class="import-page__feature-icon">✓</span>
            <div>
              <strong>Прозрачная история</strong> — на корейских и китайских рынках обычно есть полные данные по пробегу, ремонтам и ДТП. Аукционные листы и отчёты дают ясную картину до покупки.
            </div>
          </li>
          <li class="import-page__feature">
            <span class="import-page__feature-icon">✓</span>
            <div>
              <strong>Цена ниже российского рынка</strong> — за счёт объёмов и конкуренции в Азии те же модели часто стоят на 20–40% меньше, чем при покупке в РФ. Экономия сохраняется даже с учётом доставки и таможни.
            </div>
          </li>
          <li class="import-page__feature">
            <span class="import-page__feature-icon">✓</span>
            <div>
              <strong>Свежие машины и хорошая комплектация</strong> — в Корее и Китае быстрее обновляют парк, много машин с небольшим пробегом и полным набором опций. Легко найти нужную конфигурацию.
            </div>
          </li>
          <li class="import-page__feature">
            <span class="import-page__feature-icon">✓</span>
            <div>
              <strong>Жёсткие нормы эксплуатации</strong> — регулярное ТО, ограничения по пробегу у такси и аренды, контроль состояния. Это снижает риск скрытых проблем по сравнению с «неизвестной» историей в РФ.
            </div>
          </li>
          <li class="import-page__feature">
            <span class="import-page__feature-icon">✓</span>
            <div>
              <strong>Широкий выбор марок и моделей</strong> — от массовых корейских и китайских марок до японских и европейских авто, которые завозятся в Азию. Можно подобрать именно то, что нужно под бюджет и задачи.
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section class="import-page__section import-page__section--dark">
      <div class="import-page__container">
        <h2 class="import-page__h2 import-page__h2--light">Как мы ведём импорт: по шагам</h2>
        <p class="import-page__intro import-page__intro--light">Весь процесс от заявки до выдачи ключей и номеров мы ведём сами. Вы получаете один контакт и одну итоговую цену.</p>
        <ol class="import-page__steps">
          <li v-for="step in steps" :key="step.num" class="import-page__step">
            <span class="import-page__step-num" aria-hidden="true">{{ step.num }}</span>
            <div class="import-page__step-body">
              <h3 class="import-page__step-title">{{ step.title }}</h3>
              <p class="import-page__step-text">{{ step.text }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="import-page__section">
      <div class="import-page__container">
        <h2 class="import-page__h2">Что вы получаете в итоге</h2>
        <div class="import-page__result">
          <p>Автомобиль с российскими номерами, прошедший техобслуживание и детейлинг, с прозрачной историей и зафиксированной конечной стоимостью. Без скрытых доплат на таможне, при доставке или при оформлении. Сроки и этапы мы согласовываем заранее, чтобы вы могли планировать.</p>
        </div>
        <div class="import-page__cta">
          <p class="import-page__cta-text">Обсудим ваш бюджет и подберём оптимальный вариант</p>
          <div class="import-page__cta-links">
            <a href="tel:+79156095787" class="import-page__cta-btn import-page__cta-btn--phone">+7 915 609 5787</a>
            <a href="https://t.me/Autopodbor62" target="_blank" rel="noopener noreferrer" class="import-page__cta-btn import-page__cta-btn--tg">Написать в Telegram</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.import-page {
  padding-top: 0;
  min-height: 100vh;
}

.import-page__hero {
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: flex-end;
  padding: 120px 24px 64px;

  @media (max-width: 768px) {
    min-height: 60vh;
    padding: 100px 20px 48px;
  }
}

.import-page__hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.import-page__hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.import-page__hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.95) 100%);
}

.import-page__hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  color: #fff;
}

.import-page__back {
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

.import-page__label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-accent);
  margin: 0 0 12px;
}

.import-page__title {
  font-size: clamp(28px, 4.5vw, 42px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin: 0 0 16px;
}

.import-page__lead {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.55;
  margin: 0;
}

.import-page__section {
  padding: 64px 24px;

  @media (max-width: 720px) {
    padding: 48px 20px;
  }

  &--dark {
    background: var(--color-dark);
    color: #fff;
  }
}

.import-page__container {
  max-width: 800px;
  margin: 0 auto;
}

.import-page__h2 {
  font-size: clamp(24px, 3.5vw, 32px);
  font-weight: 800;
  color: var(--color-dark);
  letter-spacing: -0.02em;
  margin: 0 0 20px;
  line-height: 1.2;

  &--light {
    color: #fff;
  }
}

.import-page__intro {
  font-size: 17px;
  color: var(--color-text-muted);
  line-height: 1.65;
  margin: 0 0 40px;

  &--light {
    color: rgba(255, 255, 255, 0.7);
  }
}

.import-page__features {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.import-page__feature {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  font-size: 16px;
  line-height: 1.65;
  color: var(--color-text);

  strong {
    color: var(--color-dark);
  }
}

.import-page__feature-icon {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-accent-bg);
  color: var(--color-accent);
  font-weight: 700;
  font-size: 14px;
  border-radius: 50%;
}

.import-page__steps {
  list-style: none;
  margin: 0;
  padding: 0;
  counter-reset: step;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.import-page__step {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 24px;
  padding: 28px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  counter-increment: step;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 20px 0;
  }
}

.import-page__step-num {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: 0.05em;
}

.import-page__step-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
  line-height: 1.3;
}

.import-page__step-text {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.65;
  margin: 0;
}

.import-page__result {
  font-size: 17px;
  line-height: 1.7;
  color: var(--color-text);
  margin-bottom: 48px;

  p {
    margin: 0;
  }
}

.import-page__cta {
  padding: 32px;
  background: var(--color-bg-alt);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.import-page__cta-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-dark);
  margin: 0 0 20px;
}

.import-page__cta-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.import-page__cta-btn {
  display: inline-flex;
  align-items: center;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  font-family: inherit;
  text-decoration: none;
  border-radius: 12px;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;

  &--phone {
    background: var(--color-accent);
    color: #fff;

    &:hover {
      background: var(--color-accent-hover);
      transform: translateY(-2px);
    }
  }

  &--tg {
    background: #0088cc;
    color: #fff;

    &:hover {
      background: #0077b5;
      transform: translateY(-2px);
    }
  }
}
</style>
