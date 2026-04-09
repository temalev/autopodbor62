<script setup lang="ts">
const { app: { baseURL } } = useRuntimeConfig()
const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL

useHead({
  title: 'Прием а/м из кузовного ремонта — Автоподбор 62',
  meta: [
    {
      name: 'description',
      content: 'Принимаем автомобиль после кузовного ремонта или покупки у дилера: замер ЛКП, контроль малярных работ, сверка с нормо-часами, фотоотчёт. Рязань.',
    },
  ],
})

const phoneRaw = ref('')

function phoneDisplay(raw: string): string {
  if (!raw) return ''
  let r = '+7'
  if (raw.length > 0) r += ' (' + raw.slice(0, 3)
  if (raw.length > 3) r += ') ' + raw.slice(3, 6)
  if (raw.length > 6) r += '-' + raw.slice(6, 8)
  if (raw.length > 8) r += '-' + raw.slice(8, 10)
  return r
}

function handlePhoneInput(e: Event) {
  const input = e.target as HTMLInputElement
  let digits = input.value.replace(/\D/g, '')
  if (digits.startsWith('7') || digits.startsWith('8')) digits = digits.slice(1)
  phoneRaw.value = digits.slice(0, 10)
  input.value = phoneDisplay(phoneRaw.value)
}

function handlePhoneKeydown(e: KeyboardEvent) {
  if (e.key === 'Backspace') {
    e.preventDefault()
    phoneRaw.value = phoneRaw.value.slice(0, -1)
    const input = e.target as HTMLInputElement
    input.value = phoneDisplay(phoneRaw.value)
  }
}

const highlights = [
  {
    title: 'Замер ЛКП и анализ покраски',
    text: 'Измеряем толщину лакокрасочного покрытия на каждом элементе кузова. Выявляем перекрашенные панели, шпаклёвку и следы скрытых повреждений — даже если визуально всё выглядит идеально.',
  },
  {
    title: 'Контроль качества кузовных и малярных работ',
    text: 'Проверяем геометрию зазоров, качество подготовки поверхности, равномерность нанесения лака и краски, наличие дефектов: подтёков, шагрени, включений. Сверяем объём выполненных работ с нормо-часами.',
  },
  {
    title: 'Фиксация нарушений и защита интересов',
    text: 'Составляем подробный отчёт с фото- и видеофиксацией всех выявленных нарушений. Документ можно использовать при общении с сервисом, для гарантийного ремонта или в суде.',
  },
]

const steps = [
  { num: '01', title: 'Звонок и описание ситуации', text: 'Рассказываете, что сделал сервис, какой объём работ был заявлен и какие сомнения возникли. Договариваемся о времени и месте осмотра.' },
  { num: '02', title: 'Осмотр и замеры', text: 'Приезжаем к автомобилю с толщиномером. Замеряем ЛКП на всех элементах, проверяем геометрию зазоров и качество выполненных работ.' },
  { num: '03', title: 'Сверка с нормо-часами', text: 'Сопоставляем фактический объём и качество работ с тем, что указано в заказ-наряде. Выявляем расхождения и экономию за ваш счёт.' },
  { num: '04', title: 'Фотофиксация нарушений', text: 'Фотографируем и снимаем видео по каждому выявленному дефекту с пояснениями. Всё документируется в хронологическом порядке.' },
  { num: '05', title: 'Готовый отчёт', text: 'Передаём структурированный отчёт: толщины ЛКП по элементам, перечень нарушений, фото и заключение. Объясняем, что с этим делать дальше.' },
]

const checklist = [
  'Замер толщины ЛКП на всех внешних элементах кузова',
  'Выявление перекрашенных панелей и следов шпаклёвки',
  'Контроль геометрии зазоров между элементами',
  'Оценка качества подготовки поверхности перед покраской',
  'Поиск дефектов покраски: подтёки, шагрень, включения, матовые пятна',
  'Сверка выполненных работ с заказ-нарядом и нормо-часами',
  'Проверка качества установки и стыковки кузовных элементов',
  'Фото- и видеофиксация всех выявленных нарушений',
]
</script>

<template>
  <div class="kuzov-page">
    <div class="kuzov-page__hero">
      <div class="kuzov-page__hero-bg">
        <img :src="`${base}/images/services/2.jpeg`" alt="Проверка качества кузовного ремонта" class="kuzov-page__hero-img" />
        <div class="kuzov-page__hero-overlay" />
      </div>
      <div class="kuzov-page__hero-content">
        <NuxtLink to="/" class="kuzov-page__back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          На главную
        </NuxtLink>
        <p class="kuzov-page__label">Проверка кузовного ремонта</p>
        <h1 class="kuzov-page__title">Убедитесь, что сервис сделал всё, за что взял деньги</h1>
        <p class="kuzov-page__lead">Принимаем автомобиль после ремонта, кузовных работ или покупки у дилера. Замеряем ЛКП, контролируем качество, сверяем с нормо-часами и фиксируем каждое нарушение.</p>
      </div>
    </div>

    <section class="kuzov-page__section">
      <div class="kuzov-page__container">
        <h2 class="kuzov-page__h2">Что мы проверяем</h2>
        <p class="kuzov-page__intro">Не поверхностный осмотр, а профессиональный контроль качества с приборами и документальным подтверждением каждого нарушения.</p>
        <ul class="kuzov-page__highlights">
          <li v-for="(item, i) in highlights" :key="i" class="kuzov-page__highlight">
            <span class="kuzov-page__highlight-num" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="kuzov-page__highlight-body">
              <h3 class="kuzov-page__highlight-title">{{ item.title }}</h3>
              <p class="kuzov-page__highlight-text">{{ item.text }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section class="kuzov-page__section kuzov-page__section--dark">
      <div class="kuzov-page__container">
        <h2 class="kuzov-page__h2 kuzov-page__h2--light">Полный чек-лист проверки</h2>
        <p class="kuzov-page__intro kuzov-page__intro--light">Каждый осмотр включает эти пункты — так ни одно нарушение не останется незамеченным.</p>
        <ol class="kuzov-page__checklist">
          <li v-for="(item, i) in checklist" :key="i" class="kuzov-page__checklist-item">
            <span class="kuzov-page__checklist-num" aria-hidden="true">{{ i + 1 }}</span>
            <span class="kuzov-page__checklist-text">{{ item }}</span>
          </li>
        </ol>
      </div>
    </section>

    <section class="kuzov-page__section kuzov-page__section--alt">
      <div class="kuzov-page__container">
        <h2 class="kuzov-page__h2">Как проходит проверка: по шагам</h2>
        <p class="kuzov-page__intro">От первого звонка до готового отчёта — один визит, чёткий результат.</p>
        <ol class="kuzov-page__steps">
          <li v-for="step in steps" :key="step.num" class="kuzov-page__step">
            <span class="kuzov-page__step-num" aria-hidden="true">{{ step.num }}</span>
            <div class="kuzov-page__step-body">
              <h3 class="kuzov-page__step-title">{{ step.title }}</h3>
              <p class="kuzov-page__step-text">{{ step.text }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="kuzov-page__section">
      <div class="kuzov-page__container">
        <h2 class="kuzov-page__h2">Что вы получаете</h2>
        <div class="kuzov-page__result">
          <p>Структурированный отчёт с замерами ЛКП по каждому элементу, перечнем нарушений и фотофиксацией. Документ достаточен для повторного обращения в сервис, гарантийной претензии или судебного разбирательства.</p>
        </div>
        <ul class="kuzov-page__guarantees">
          <li><strong>Объективные данные</strong> — замеры толщиномером, а не субъективная оценка</li>
          <li><strong>Полная документация</strong> — фото и видео каждого дефекта с пояснениями</li>
          <li><strong>Ясное заключение</strong> — что нарушено, насколько критично и что требовать от сервиса</li>
          <li><strong>Один визит</strong> — приедем в удобное место и время, без лишних поездок</li>
        </ul>

        <div class="kuzov-page__cta">
          <p class="kuzov-page__cta-text">Приняли автомобиль из сервиса? Закажите проверку — разберёмся вместе</p>
          <form class="kuzov-page__form" @submit.prevent>
            <div class="kuzov-page__form-fields">
              <input type="text" class="kuzov-page__form-input" name="name" placeholder="Ваше имя" autocomplete="name" />
              <input type="tel" class="kuzov-page__form-input" name="phone" placeholder="+7 (___) ___-__-__" autocomplete="tel" @input="handlePhoneInput" @keydown="handlePhoneKeydown" />
            </div>
            <button type="submit" class="kuzov-page__form-btn">Заказать проверку</button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.kuzov-page {
  padding-top: 0;
  min-height: 100vh;
}

.kuzov-page__hero {
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

.kuzov-page__hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.kuzov-page__hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.kuzov-page__hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.95) 100%);
}

.kuzov-page__hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  color: #fff;
}

.kuzov-page__back {
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

.kuzov-page__label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-accent);
  margin: 0 0 12px;
}

.kuzov-page__title {
  font-size: clamp(28px, 4.5vw, 42px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin: 0 0 16px;
}

.kuzov-page__lead {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.55;
  margin: 0;
}

.kuzov-page__section {
  padding: 64px 24px;

  @media (max-width: 720px) {
    padding: 48px 20px;
  }

  &--dark {
    background: var(--color-dark);
    color: #fff;
  }

  &--alt {
    background: var(--color-bg-alt);
  }
}

.kuzov-page__container {
  max-width: 800px;
  margin: 0 auto;
}

.kuzov-page__h2 {
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

.kuzov-page__intro {
  font-size: 17px;
  color: var(--color-text-muted);
  line-height: 1.65;
  margin: 0 0 40px;

  &--light {
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 40px;
  }
}

.kuzov-page__highlights {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.kuzov-page__highlight {
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 20px;
  padding: 24px 0;
  border-bottom: 1px solid var(--color-border);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 20px 0;
  }
}

.kuzov-page__highlight-num {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: 0.05em;
  padding-top: 4px;
}

.kuzov-page__highlight-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-dark);
  margin: 0 0 6px;
  line-height: 1.3;
}

.kuzov-page__highlight-text {
  font-size: 15px;
  color: var(--color-text);
  line-height: 1.65;
  margin: 0;
}

.kuzov-page__checklist {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.kuzov-page__checklist-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
}

.kuzov-page__checklist-num {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-accent);
  font-size: 13px;
  font-weight: 700;
  border-radius: 50%;
}

.kuzov-page__checklist-text {
  padding-top: 2px;
}

.kuzov-page__steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.kuzov-page__step {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 24px;
  padding: 28px 0;
  border-bottom: 1px solid var(--color-border);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 20px 0;
  }
}

.kuzov-page__step-num {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: 0.05em;
}

.kuzov-page__step-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-dark);
  margin: 0 0 8px;
  line-height: 1.3;
}

.kuzov-page__step-text {
  font-size: 15px;
  color: var(--color-text-muted);
  line-height: 1.65;
  margin: 0;
}

.kuzov-page__result {
  font-size: 17px;
  line-height: 1.7;
  color: var(--color-text);
  margin-bottom: 24px;

  p {
    margin: 0;
  }
}

.kuzov-page__guarantees {
  list-style: none;
  margin: 0 0 24px;
  padding: 0;
  font-size: 16px;
  line-height: 1.6;
  color: var(--color-text);

  li {
    position: relative;
    padding-left: 24px;
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }

    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--color-accent);
      font-weight: 700;
    }
  }
}

.kuzov-page__cta {
  margin-top: 48px;
  padding: 36px;
  background: var(--color-bg-alt);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.kuzov-page__cta-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-dark);
  margin: 0 0 24px;
}

.kuzov-page__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.kuzov-page__form-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
}

.kuzov-page__form-input {
  width: 100%;
  padding: 14px 18px;
  font-size: 15px;
  font-family: inherit;
  color: var(--color-dark);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;

  &::placeholder {
    color: var(--color-text-muted);
  }

  &:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-accent-soft);
  }
}

.kuzov-page__form-btn {
  width: 100%;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 700;
  font-family: inherit;
  color: #fff;
  background: var(--color-accent);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.35);

  &:hover {
    background: var(--color-accent-hover);
    box-shadow: 0 6px 24px rgba(249, 115, 22, 0.45);
    transform: translateY(-2px);
  }
}
</style>
