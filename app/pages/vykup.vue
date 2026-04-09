<script setup lang="ts">
const { app: { baseURL } } = useRuntimeConfig()
const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL

useHead({
  title: 'Выкуп авто в Рязани — срочный выкуп и комиссионная продажа автомобиля | Автоподбор 62',
  meta: [
    {
      name: 'description',
      content: 'Срочный выкуп автомобиля в Рязани — деньги в день обращения. Комиссионная продажа по рыночной цене: фото, размещение на всех площадках, показы и сделка под ключ.',
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

const options = [
  {
    title: 'Срочный выкуп',
    text: 'Оцениваем автомобиль по рынку и выкупаем сразу — без торга на месте и затяжных переговоров. Деньги получаете в день обращения. Подходит, если нужны деньги быстро или не хотите тратить время на самостоятельную продажу.',
    points: [
      'Оценка и осмотр в удобное для вас время',
      'Честная рыночная цена — без искусственного занижения',
      'Деньги наличными или переводом в день сделки',
      'Все документы оформляем самостоятельно',
    ],
  },
  {
    title: 'Комиссионная продажа',
    text: 'Берём автомобиль на реализацию и продаём по полной рыночной стоимости — вы не теряете разницу на срочности. Мы делаем профессиональные фото, размещаем объявления, проводим показы и ведём переговоры с покупателями.',
    points: [
      'Профессиональная съёмка и продающее объявление',
      'Размещение на всех ключевых площадках',
      'Показы, переговоры и проверка покупателя — на нас',
      'Оформление сделки и документов под ключ',
    ],
  },
]

const steps = [
  { num: '01', title: 'Звонок и первичная оценка', text: 'Рассказываете об автомобиле: марка, год, пробег, состояние. Мы смотрим рынок и называем ориентировочную стоимость.' },
  { num: '02', title: 'Осмотр и финальная цена', text: 'Приезжаем к вам или принимаете нас в удобном месте. Осматриваем авто и называем точную цену выкупа или прогнозируемую цену продажи.' },
  { num: '03', title: 'Выкуп или договор комиссии', text: 'Если выкуп — подписываем договор и передаём деньги сразу. Если комиссия — заключаем договор хранения и начинаем продажу.' },
  { num: '04', title: 'Продажа (при комиссии)', text: 'Фотографируем, размещаем объявления, принимаем звонки, организуем показы. Вы не тратите ни минуты на общение с покупателями.' },
  { num: '05', title: 'Сделка и передача денег', text: 'Проверяем покупателя, оформляем документы, проводим безопасную сделку. Деньги получаете в день продажи.' },
]
</script>

<template>
  <div class="vykup-page">
    <div class="vykup-page__hero">
      <div class="vykup-page__hero-bg">
        <img :src="`${base}/images/services/3.jpeg`" alt="Выкуп и комиссионная продажа автомобиля" class="vykup-page__hero-img" />
        <div class="vykup-page__hero-overlay" />
      </div>
      <div class="vykup-page__hero-content">
        <NuxtLink to="/" class="vykup-page__back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          На главную
        </NuxtLink>
        <p class="vykup-page__label">Выкуп и комиссионная продажа</p>
        <h1 class="vykup-page__title">Выкуп и комиссионная продажа автомобиля в Рязани</h1>
        <p class="vykup-page__lead">Выкупим в день обращения — деньги сразу. Или возьмём на комиссию: профессиональные фото, размещение на всех площадках, показы и сделка — полностью на нас.</p>
      </div>
    </div>

    <section class="vykup-page__section">
      <div class="vykup-page__container">
        <h2 class="vykup-page__h2">Два варианта продажи</h2>
        <p class="vykup-page__intro">Выбирайте, исходя из ситуации: нужны деньги быстро — выкуп. Хотите получить максимум — комиссионная продажа по рыночной цене.</p>
        <div class="vykup-page__options">
          <div v-for="(option, i) in options" :key="i" class="vykup-page__option">
            <span class="vykup-page__option-num" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="vykup-page__option-body">
              <h3 class="vykup-page__option-title">{{ option.title }}</h3>
              <p class="vykup-page__option-text">{{ option.text }}</p>
              <ul class="vykup-page__option-points">
                <li v-for="(point, j) in option.points" :key="j">{{ point }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="vykup-page__section vykup-page__section--dark">
      <div class="vykup-page__container">
        <h2 class="vykup-page__h2 vykup-page__h2--light">Как мы работаем: по шагам</h2>
        <p class="vykup-page__intro vykup-page__intro--light">От первого звонка до денег в руках — один контакт, прозрачные этапы, без неожиданностей.</p>
        <ol class="vykup-page__steps">
          <li v-for="step in steps" :key="step.num" class="vykup-page__step">
            <span class="vykup-page__step-num" aria-hidden="true">{{ step.num }}</span>
            <div class="vykup-page__step-body">
              <h3 class="vykup-page__step-title">{{ step.title }}</h3>
              <p class="vykup-page__step-text">{{ step.text }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="vykup-page__section">
      <div class="vykup-page__container">
        <h2 class="vykup-page__h2">Что вы получаете</h2>
        <div class="vykup-page__result">
          <p>Продажа без стресса, звонков от незнакомых людей и торга на показах. Мы берём весь процесс на себя — вы получаете деньги и тратите минимум времени.</p>
        </div>
        <ul class="vykup-page__guarantees">
          <li><strong>Честная оценка по рынку</strong> — без искусственного занижения</li>
          <li><strong>Прозрачные условия</strong> — фиксированная комиссия, никаких скрытых вычетов</li>
          <li><strong>Безопасная сделка</strong> — проверяем покупателя, оформляем документы</li>
          <li><strong>Скорость</strong> — выкуп в день обращения, комиссионная продажа в среднем за 7–21 день</li>
        </ul>
        <div class="vykup-page__cta">
          <p class="vykup-page__cta-text">Узнайте стоимость вашего автомобиля прямо сейчас</p>
          <form class="vykup-page__form" @submit.prevent>
            <div class="vykup-page__form-fields">
              <input type="text" class="vykup-page__form-input" name="name" placeholder="Ваше имя" autocomplete="name" />
              <input type="tel" class="vykup-page__form-input" name="phone" placeholder="+7 (___) ___-__-__" autocomplete="tel" @input="handlePhoneInput" @keydown="handlePhoneKeydown" />
            </div>
            <input type="text" class="vykup-page__form-input vykup-page__form-input--wide" name="car" placeholder="Марка, модель, год, пробег (например: Toyota Camry 2019, 85 000 км)" />
            <button type="submit" class="vykup-page__form-btn">Узнать стоимость</button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.vykup-page {
  padding-top: 0;
  min-height: 100vh;
}

.vykup-page__hero {
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

.vykup-page__hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.vykup-page__hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.vykup-page__hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.95) 100%);
}

.vykup-page__hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  color: #fff;
}

.vykup-page__back {
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

.vykup-page__label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-accent);
  margin: 0 0 12px;
}

.vykup-page__title {
  font-size: clamp(28px, 4.5vw, 42px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin: 0 0 16px;
}

.vykup-page__lead {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.55;
  margin: 0;
}

.vykup-page__section {
  padding: 64px 24px;

  @media (max-width: 720px) {
    padding: 48px 20px;
  }

  &--dark {
    background: var(--color-dark);
    color: #fff;
  }
}

.vykup-page__container {
  max-width: 800px;
  margin: 0 auto;
}

.vykup-page__h2 {
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

.vykup-page__intro {
  font-size: 17px;
  color: var(--color-text-muted);
  line-height: 1.65;
  margin: 0 0 40px;

  &--light {
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 40px;
  }
}

.vykup-page__options {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.vykup-page__option {
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 20px;
  padding: 32px 0;
  border-bottom: 1px solid var(--color-border);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 24px 0;
  }
}

.vykup-page__option-num {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: 0.05em;
  padding-top: 4px;
}

.vykup-page__option-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-dark);
  margin: 0 0 10px;
  line-height: 1.3;
}

.vykup-page__option-text {
  font-size: 15px;
  color: var(--color-text);
  line-height: 1.65;
  margin: 0 0 16px;
}

.vykup-page__option-points {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    position: relative;
    padding-left: 20px;
    font-size: 14px;
    color: var(--color-text-muted);
    line-height: 1.5;

    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--color-accent);
      font-weight: 700;
      font-size: 13px;
    }
  }
}

.vykup-page__steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.vykup-page__step {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 24px;
  padding: 28px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 20px 0;
  }
}

.vykup-page__step-num {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: 0.05em;
}

.vykup-page__step-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
  line-height: 1.3;
}

.vykup-page__step-text {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.65;
  margin: 0;
}

.vykup-page__result {
  font-size: 17px;
  line-height: 1.7;
  color: var(--color-text);
  margin-bottom: 24px;

  p {
    margin: 0;
  }
}

.vykup-page__guarantees {
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

.vykup-page__cta {
  margin-top: 48px;
  padding: 36px;
  background: var(--color-bg-alt);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.vykup-page__cta-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-dark);
  margin: 0 0 24px;
}

.vykup-page__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vykup-page__form-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
}

.vykup-page__form-input {
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

  &--wide {
    grid-column: 1 / -1;
  }
}

.vykup-page__form-btn {
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
