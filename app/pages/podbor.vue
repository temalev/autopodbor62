<script setup lang="ts">
import { sendLead } from '../utils/lead'
import {
  SITE_URL,
  breadcrumbJsonLd,
  jsonLdScript,
  serviceJsonLd,
} from '../utils/schema'

const { app: { baseURL } } = useRuntimeConfig()
const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL

const PAGE_URL = `${SITE_URL}/podbor`
const PAGE_TITLE = 'Подбор автомобиля под ключ в Рязани — Автоподбор 62'
const PAGE_DESCRIPTION =
  'Автоподбор под ключ в Рязани: поиск по рынку, три этапа проверки, сопровождение сделки, регистрация в ГИБДД. Гарантия юридической чистоты и выкупа в течение 90 дней.'

useHead({
  title: PAGE_TITLE,
  meta: [
    { name: 'description', content: PAGE_DESCRIPTION },
    { property: 'og:url', content: PAGE_URL },
    { property: 'og:title', content: PAGE_TITLE },
    { property: 'og:description', content: PAGE_DESCRIPTION },
  ],
  link: [{ rel: 'canonical', href: PAGE_URL }],
  script: [
    jsonLdScript(
      serviceJsonLd({
        name: 'Подбор автомобиля под ключ',
        description: PAGE_DESCRIPTION,
        url: PAGE_URL,
        serviceType: 'Автоподбор автомобиля под ключ',
      }),
      'ld-podbor-service',
    ),
    jsonLdScript(
      breadcrumbJsonLd([
        { name: 'Главная', url: `${SITE_URL}/` },
        { name: 'Подбор автомобиля под ключ', url: PAGE_URL },
      ]),
      'ld-podbor-breadcrumbs',
    ),
  ],
})

const phoneRaw = ref('')
const leadStatus = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const leadError = ref('')

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

async function submitLead(e: Event) {
  const form = e.target as HTMLFormElement | null
  if (!form) return

  leadStatus.value = 'sending'
  leadError.value = ''

  const fd = new FormData(form)
  const name = String(fd.get('name') || '').trim()
  const phone = String(fd.get('phone') || '').trim()

  const res = await sendLead({ name, phone, source: 'podbor' })
  if (res.ok) {
    leadStatus.value = 'sent'
    form.reset()
    phoneRaw.value = ''
    return
  }

  leadStatus.value = 'error'
  leadError.value = 'error' in res ? res.error : 'Ошибка отправки'
}

const includes = [
  { title: 'Анализ бюджета и постановка задачи', text: 'Ваши пожелания и доступный бюджет — наша аналитика рынка' },
  { title: 'Поиск по всем доступным каналам', text: 'Интернет-ресурсы, предложения от дилеров, закрытые чаты профессиональных продавцов и рекомендации от коллег из других регионов.' },
  { title: 'Предварительная проверка', text: 'Все доступные онлайн отчеты, дилерская и страховая история, проверка продавца, сбор первичной информации по текущему состоянию автомобиля.' },
  { title: 'Физическая проверка автомобиля', text: 'Полноценная инспекция состояния ТС в объеме разовой проверки + исследование проблемных позиций по каждой марке и модели' },
  { title: 'Сопровождение сделки купли-продажи', text: 'Повторная юридическая проверка, оформление договора купли-продажи, контроль передачи денежных средств.' },
  { title: 'Регистрация а/м в ГИБДД', text: 'Подготовка маркировочных обозначений и необходимых документов, при необходимости, прохождения технического осмотра с получением диагностической карты, подача и получение документов в ГИБДД от имени нового собственника, получение гос. номеров.' },
  { title: 'Выдача полностью готового автомобиля клинту', text: 'Передача клиенту полностью готового автомобиля.' },
]

const steps = [
  { num: '01', title: 'Заявка и согласование', text: 'Обсуждаем бюджет, пожелания к автомобилю и сроки. Фиксируем критерии: марка, модель, год, пробег, важные опции.' },
  { num: '02', title: 'Поиск и отбор вариантов', text: 'Ищем по всем доступным каналам, проверяем историю и объявления. Отбираем варианты, которые соответствуют вашим условиям.' },
  { num: '03', title: 'Проверки', text: 'Юридическая чистота, техосмотр, кузов, диагностика. Формируем отчёт. Рекомендуем к покупке или честно отказываем.' },
  { num: '04', title: 'Сделка', text: 'Ведём переговоры, сопровождаем оформление. Вы получаете автомобиль с чистыми документами и ясной историей.' },
  { num: '05', title: 'Регистрация', text: 'Оформляем постановку на учёт в ГИБДД. Вы забираете авто уже с номерами — без очередей и лишних поездок.' },
]
</script>

<template>
  <div class="podbor-page">
    <div class="podbor-page__hero">
      <div class="podbor-page__hero-bg">
        <img :src="`${base}/images/services/1.jpeg`" alt="Подбор автомобиля" class="podbor-page__hero-img" />
        <div class="podbor-page__hero-overlay" />
      </div>
      <div class="podbor-page__hero-content">
        <NuxtLink to="/" class="podbor-page__back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          На главную
        </NuxtLink>
        <p class="podbor-page__label">Автоподбор под ключ</p>
        <h1 class="podbor-page__title">Подбор автомобиля под ключ</h1>
        <p class="podbor-page__lead">От анализа бюджета и поиска по рынку до проверок, сделки и регистрации в ГИБДД — берём на себя весь цикл. Вы получаете автомобиль, который реально стоит своих денег.</p>
      </div>
    </div>

    <section class="podbor-page__section">
      <div class="podbor-page__container">
        <h2 class="podbor-page__h2">Что входит в подбор под ключ</h2>
        <p class="podbor-page__intro">Будьте уверены, мы найдем для вас лучший автомобиль в своем ценовом сегменте.</p>
        <ul class="podbor-page__includes">
          <li v-for="(item, i) in includes" :key="i" class="podbor-page__include">
            <span class="podbor-page__include-num" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="podbor-page__include-body">
              <h3 class="podbor-page__include-title">{{ item.title }}</h3>
              <p class="podbor-page__include-text">{{ item.text }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section class="podbor-page__section">
      <div class="podbor-page__container">
        <h2 class="podbor-page__h2">Что вы получаете и какие гарантии</h2>
        <div class="podbor-page__result">
          <p>Ваш автомобиль будет проверен нашими специалистами на столько, на сколько это возможно в отведенных для этого условиях и временных рамках.</p>
        </div>
        <ul class="podbor-page__guarantees">
          <li><strong>Гарантия актуальности информации</strong> о состоянии вашего автомобиля в целом и его юридической чистоте на момент проверки и заключения сделки купли-продажи.</li>
          <li><strong>Гарантия выкупа</strong> подобранного автомобиля в течение 90 дней. (до 100% от стоимости покупки)</li>
        </ul>
        <p class="podbor-page__terms">Срок подбора — от 2 до 60 дней. Доступен экспресс-подбор до 10 дней с предложением до 3 лучших вариантов. Стоимость зависит от ценовой категории автомобиля и фиксируется до начала работ — без скрытых доплат.</p>
        <div class="podbor-page__cta">
          <p class="podbor-page__cta-text">Обсудим бюджет и подберём оптимальный вариант</p>
          <form class="podbor-page__form" @submit.prevent="submitLead">
            <div class="podbor-page__form-fields">
              <input type="text" class="podbor-page__form-input" name="name" placeholder="Ваше имя" autocomplete="name" />
              <input type="tel" class="podbor-page__form-input" name="phone" placeholder="+7 (___) ___-__-__" autocomplete="tel" @input="handlePhoneInput" @keydown="handlePhoneKeydown" />
            </div>
            <button type="submit" class="podbor-page__form-btn" :disabled="leadStatus === 'sending'">
              {{ leadStatus === 'sending' ? 'Отправляем…' : 'Оставить заявку на подбор' }}
            </button>
            <p v-if="leadStatus === 'sent'" class="podbor-page__form-hint">Заявка отправлена. Перезвоним в ближайшее время.</p>
            <p v-else-if="leadStatus === 'error'" class="podbor-page__form-hint podbor-page__form-hint--error">Не удалось отправить заявку. {{ leadError }}</p>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.podbor-page {
  padding-top: 0;
  min-height: 100vh;
}

.podbor-page__hero {
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

.podbor-page__hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.podbor-page__hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.podbor-page__hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.95) 100%);
}

.podbor-page__hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  color: #fff;
}

.podbor-page__back {
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

.podbor-page__label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-accent);
  margin: 0 0 12px;
}

.podbor-page__title {
  font-size: clamp(28px, 4.5vw, 42px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin: 0 0 16px;
}

.podbor-page__lead {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.55;
  margin: 0;
}

.podbor-page__section {
  padding: 64px 24px;

  @media (max-width: 720px) {
    padding: 48px 20px;
  }

  &--dark {
    background: var(--color-dark);
    color: #fff;
  }
}

.podbor-page__container {
  max-width: 800px;
  margin: 0 auto;
}

.podbor-page__h2 {
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

.podbor-page__intro {
  font-size: 17px;
  color: var(--color-text-muted);
  line-height: 1.65;
  margin: 0 0 40px;

  &--light {
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 40px;
  }
}

.podbor-page__includes {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.podbor-page__include {
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

.podbor-page__include-num {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: 0.05em;
}

.podbor-page__include-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-dark);
  margin: 0 0 6px;
  line-height: 1.3;
}

.podbor-page__include-text {
  font-size: 15px;
  color: var(--color-text);
  line-height: 1.65;
  margin: 0;
}

.podbor-page__steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.podbor-page__step {
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

.podbor-page__step-num {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: 0.05em;
}

.podbor-page__step-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
  line-height: 1.3;
}

.podbor-page__step-text {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.65;
  margin: 0;
}

.podbor-page__result {
  font-size: 17px;
  line-height: 1.7;
  color: var(--color-text);
  margin-bottom: 24px;

  p {
    margin: 0;
  }
}

.podbor-page__guarantees {
  list-style: none;
  margin: 0 0 24px;
  padding: 0;
  font-size: 16px;
  line-height: 1.6;
  color: var(--color-text);

  li {
    position: relative;
    padding-left: 24px;
    margin-bottom: 10px;

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

.podbor-page__terms {
  font-size: 15px;
  color: var(--color-text-muted);
  line-height: 1.65;
  margin: 0 0 48px;
}

.podbor-page__cta {
  padding: 36px;
  background: var(--color-bg-alt);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.podbor-page__cta-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-dark);
  margin: 0 0 24px;
}

.podbor-page__form-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
}

.podbor-page__form-input {
  width: 100%;
  padding: 14px 18px;
  font-size: 15px;
  font-family: inherit;
  color: var(--color-dark);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder {
    color: var(--color-text-muted);
  }

  &:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-accent-soft);
  }
}

.podbor-page__form-btn {
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

  &:disabled {
    cursor: not-allowed;
    opacity: 0.72;
    transform: none;
  }
}

.podbor-page__form-hint {
  margin: 10px 0 0;
  font-size: 14px;
  color: rgba(17, 17, 17, 0.8);
}

.podbor-page__form-hint--error {
  color: #b42318;
}
</style>
