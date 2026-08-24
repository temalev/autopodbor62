<script setup lang="ts">
import { sendLead } from '../utils/lead'
import {
  SITE_URL,
  breadcrumbJsonLd,
  jsonLdScript,
  serviceJsonLd,
} from '../utils/schema'

const relatedServices = [
  {
    to: '/podbor',
    title: 'Подбор по рынку РФ',
    description: 'Альтернатива импорту — найдём подходящий вариант на российском рынке.',
  },
  {
    to: '/proverka',
    title: 'Разовая проверка',
    description: 'Уже привезли авто сами? Проведём полную диагностику перед эксплуатацией.',
  },
  {
    to: '/registraciya-gibdd',
    title: 'Регистрация в ГИБДД',
    description: 'Поставим импортированный автомобиль на учёт — входит в стоимость импорта под ключ.',
  },
]

const { app: { baseURL } } = useRuntimeConfig()
const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL

/** Вознаграждение за услугу. Меняется здесь — подхватится и в тексте, и в разметке. */
const SERVICE_PRICE = 150_000
const SERVICE_PRICE_LABEL = SERVICE_PRICE.toLocaleString('ru-RU')

const PAGE_URL = `${SITE_URL}/import/`
const PAGE_TITLE = 'Импорт авто из Кореи и Китая под ключ в Рязань — Автоподбор 62'
// Цена в описании подставляется из SERVICE_PRICE, чтобы сниппет не разошёлся
// с блоком на странице. Держим в пределах 160 символов — дальше Google обрезает.
const PAGE_DESCRIPTION =
  `Пригоним авто из Кореи, Китая и любой точки мира под ключ в Рязань: подбор, проверка, логистика, таможня, ТО, номера. Работа под ключ — ${SERVICE_PRICE_LABEL} ₽.`
const PAGE_OG_IMAGE = `${SITE_URL}/images/korea.webp`

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
      serviceJsonLd({
        name: 'Импорт автомобиля из Кореи и Китая под ключ',
        description: PAGE_DESCRIPTION,
        url: PAGE_URL,
        serviceType: 'Импорт автомобилей из-за рубежа',
        image: PAGE_OG_IMAGE,
        offer: {
          price: SERVICE_PRICE,
          description:
            'Автомобиль из любой точки мира под ключ: анализ рынка, подбор и проверка автомобиля, сопровождение сделки, логистика, таможенное оформление, доставка в Рязань, техобслуживание, детейлинг и регистрация в ГИБДД. Стоимость самого автомобиля, пошлины и фрахт оплачиваются напрямую от имени клиента.',
        },
      }),
      'ld-import-service',
    ),
    jsonLdScript(
      breadcrumbJsonLd([
        { name: 'Главная', url: `${SITE_URL}/` },
        { name: 'Импорт из Кореи и Китая', url: PAGE_URL },
      ]),
      'ld-import-breadcrumbs',
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

  const res = await sendLead({ name, phone, source: 'import' })
  if (res.ok) {
    leadStatus.value = 'sent'
    form.reset()
    phoneRaw.value = ''
    return
  }

  leadStatus.value = 'error'
  leadError.value = 'error' in res ? res.error : 'Ошибка отправки'
}

const steps = [
  { num: '01', title: 'Заявка и бюджет', text: 'Обсуждаем задачу и бюджет на покупку. Определяем рынок и ориентировочные сроки.' },
  { num: '02', title: 'Анализ рынка и подбор', text: 'Ищем варианты на аукционах и у проверенных поставщиков. Проверяем историю, аукционный лист, пробег и состояние. Отбираем несколько вариантов под ваши критерии.' },
  { num: '03', title: 'Проверка и сопровождение сделки', text: 'Проводим детальную проверку выбранного авто на месте. Сопровождаем сделку: документы, оплата, страховка. Контролируем погрузку и отправку.' },
  { num: '04', title: 'Логистика и таможня', text: 'Организуем доставку до России, таможенное оформление и расчёт пошлин. Всё прозрачно — вы знаете итоговую стоимость до начала процесса. Все оплаты идут от вашего имени напрямую.' },
  { num: '05', title: 'Доставка в Рязань', text: 'Автомобиль приходит в Рязань. Мы принимаем его, проверяем состояние после перевозки и при необходимости устраняем мелкие дефекты.' },
  { num: '06', title: 'ТО, детейлинг и регистрация', text: 'Проводим техобслуживание, детейлинг (мойка кузова, чистка салона). Проводим регистрацию в ГИБДД. Вы получаете авто с номерами, обслуженное и готовое к эксплуатации.' },
]
</script>

<template>
  <div class="import-page">
    <div class="import-page__hero">
      <div class="import-page__hero-bg">
        <img :src="`${base}/images/korea.webp`" alt="Импорт автомобилей из Кореи и Китая под ключ в Рязань — Автоподбор 62" class="import-page__hero-img" />
        <div class="import-page__hero-overlay" />
      </div>
      <div class="import-page__hero-content">
        <NuxtLink to="/" class="import-page__back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          На главную
        </NuxtLink>
        <p class="import-page__label">Импорт из Кореи и Китая</p>
        <h1 class="import-page__title">Пригнать авто из Кореи и Китая под ключ в Рязань</h1>
        <p class="import-page__lead">От подбора на аукционе до номеров в Рязани — берём на себя весь цикл. Вы получаете готовый к эксплуатации автомобиль с прозрачной историей и финальной ценой без сюрпризов.</p>
      </div>
    </div>

    <section class="import-page__section">
      <div class="import-page__container">
        <h2 class="import-page__h2">Почему импортные автомобили — выгодно и надёжно</h2>
        <p class="import-page__intro">Автомобили с рынков Кореи и Китая часто оказываются выгоднее и честнее российских предложений: климат, качество дорожного покрытия, нормы эксплуатации, "чистая" история в России, все эти плюсы делают предложения с азиатских рынков более привлекательными.</p>
        <ul class="import-page__features">
          <li class="import-page__feature">
            <span class="import-page__feature-icon">✓</span>
            <div>
              <strong>Цена ниже российского рынка</strong> — за счёт объёмов и конкуренции в Азии те же модели часто стоят в 1.5 - 2 раза меньше, чем при покупке в РФ. Экономия сохраняется даже с учётом логистики и таможни.
            </div>
          </li>
          <li class="import-page__feature">
            <span class="import-page__feature-icon">✓</span>
            <div>
              <strong>Свежие машины и хорошая комплектация</strong> — хорошие комплектации даже в бюджетных моделях.
            </div>
          </li>
          <li class="import-page__feature">
            <span class="import-page__feature-icon">✓</span>
            <div>
              <strong>Жёсткие нормы эксплуатации</strong> — практически полное отсутствие контактов с реагентами
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

    <section class="import-page__section import-page__section--gallery">
      <div class="import-page__container import-page__container--wide">
        <h2 class="import-page__h2">Наши автомобили из Кореи и Китая</h2>
        <div class="import-page__gallery">
          <div class="import-page__gallery-item import-page__gallery-item--wide">
            <img :src="`${base}/images/import/1.webp`" alt="Авто из Кореи, привезённое под ключ в Рязань — пример сделки Автоподбор 62" loading="lazy" />
          </div>
          <div class="import-page__gallery-item">
            <img :src="`${base}/images/import/2.webp`" alt="Подержанный автомобиль из Кореи после доставки и проверки" loading="lazy" />
          </div>
          <div class="import-page__gallery-item">
            <img :src="`${base}/images/import/3.webp`" alt="Автомобиль из Китая после импорта и таможенного оформления" loading="lazy" />
          </div>
          <div class="import-page__gallery-item">
            <img :src="`${base}/images/import/4.webp`" alt="Корейский автомобиль с пробегом, подобранный под бюджет клиента" loading="lazy" />
          </div>
          <div class="import-page__gallery-item">
            <img :src="`${base}/images/import/5.webp`" alt="Импорт авто из Китая под ключ — пример выполненного заказа" loading="lazy" />
          </div>
          <div class="import-page__gallery-item">
            <img :src="`${base}/images/import/6.webp`" alt="Авто из Кореи: подобран, проверен и доставлен в Рязань" loading="lazy" />
          </div>
          <div class="import-page__gallery-item">
            <img :src="`${base}/images/import/7.webp`" alt="Корейский автомобиль после регистрации в ГИБДД Рязани" loading="lazy" />
          </div>
          <div class="import-page__gallery-item">
            <img :src="`${base}/images/import/8.webp`" alt="Китайский автомобиль, привезённый в Рязань под ключ" loading="lazy" />
          </div>
          <div class="import-page__gallery-item">
            <img :src="`${base}/images/import/9.webp`" alt="Авто из Кореи — пример прошедшей подбор машины" loading="lazy" />
          </div>
          <div class="import-page__gallery-item">
            <img :src="`${base}/images/import/10.webp`" alt="Покупка авто в Китае: пример сделки под ключ" loading="lazy" />
          </div>
          <div class="import-page__gallery-item">
            <img :src="`${base}/images/import/11.webp`" alt="Импортный автомобиль из Кореи после полной проверки" loading="lazy" />
          </div>
          <div class="import-page__gallery-item">
            <img :src="`${base}/images/import/12.webp`" alt="Авто из Китая: подбор, логистика и регистрация в Рязани" loading="lazy" />
          </div>
          <div class="import-page__gallery-item">
            <img :src="`${base}/images/import/13.webp`" alt="Корейский автомобиль с прозрачной историей под бюджет клиента" loading="lazy" />
          </div>
        </div>
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

    <section class="import-page__section import-page__section--price">
      <div class="import-page__container">
        <h2 class="import-page__h2">Сколько стоит пригнать авто из Кореи или Китая</h2>
        <p class="import-page__intro"><strong>Автомобиль из любой точки мира.</strong> Цена нашей работы — за весь цикл, описанный выше: от анализа рынка до номеров и готового к эксплуатации автомобиля.</p>

        <div class="import-page__price">
          <div class="import-page__price-head">
            <div>
              <p class="import-page__price-caption">Импорт под ключ из любой точки мира — от заявки до номеров</p>
              <p class="import-page__price-value">{{ SERVICE_PRICE_LABEL }}&nbsp;₽</p>
            </div>
            <span class="import-page__price-badge">Цена фиксированная</span>
          </div>

          <p class="import-page__price-fixed">Сумма фиксируется до старта и не меняется по ходу сделки — независимо от того, сколько вариантов пришлось отсмотреть и как долго шла доставка.</p>

          <h3 class="import-page__price-col-title">Сверх услуги оплачиваются</h3>
          <ul class="import-page__price-list import-page__price-list--muted">
            <li>Стоимость самого автомобиля у продавца или на аукционе</li>
            <li>Таможенные пошлины и утилизационный сбор</li>
            <li>Перевозка и фрахт до России</li>
            <li>Госпошлины при регистрации в ГИБДД</li>
          </ul>
          <p class="import-page__price-hint">Организацию этих этапов мы берём на себя, а сами платежи идут <strong>напрямую от вашего имени</strong> — мы не закладываем их в свою цену и не берём процент сверху. Итоговую сумму со всеми расходами считаем и согласовываем до начала работы, поэтому конечная стоимость известна заранее.</p>
        </div>
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
          <form class="import-page__form" @submit.prevent="submitLead">
            <div class="import-page__form-fields">
              <input type="text" class="import-page__form-input" name="name" placeholder="Ваше имя" autocomplete="name" />
              <input type="tel" class="import-page__form-input" name="phone" placeholder="+7 (___) ___-__-__" autocomplete="tel" @input="handlePhoneInput" @keydown="handlePhoneKeydown" />
            </div>
            <button type="submit" class="import-page__form-btn" :disabled="leadStatus === 'sending'">
              {{ leadStatus === 'sending' ? 'Отправляем…' : 'Оставить заявку на консультацию' }}
            </button>
            <p v-if="leadStatus === 'sent'" class="import-page__form-hint">Заявка отправлена. Перезвоним в ближайшее время.</p>
            <p v-else-if="leadStatus === 'error'" class="import-page__form-hint import-page__form-hint--error">Не удалось отправить заявку. {{ leadError }}</p>
          </form>
        </div>
      </div>
    </section>

    <RelatedServices :items="relatedServices" subheading="Часто берут вместе с импортом" />
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

.import-page__container--wide {
  max-width: 1100px;
}

.import-page__section--gallery {
  padding-bottom: 48px;
}

.import-page__gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto;
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
}

.import-page__gallery-item {
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 4/3;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;

    &:hover {
      transform: scale(1.04);
    }
  }

  &--wide {
    grid-column: span 2;

    @media (max-width: 560px) {
      grid-column: span 1;
    }
  }
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

.import-page__section--price {
  background: var(--color-bg-alt);
}

.import-page__price {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 32px;
  box-shadow: var(--shadow-sm);

  @media (max-width: 720px) {
    padding: 24px 20px;
  }
}

.import-page__price-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 28px;
  margin-bottom: 28px;
  border-bottom: 1px solid var(--color-border);

  @media (max-width: 560px) {
    flex-direction: column;
    gap: 12px;
  }
}

.import-page__price-caption {
  margin: 0 0 6px;
  font-size: 15px;
  color: var(--color-text-muted);
}

.import-page__price-value {
  margin: 0;
  font-size: clamp(30px, 5vw, 44px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: var(--color-dark);
}

.import-page__price-badge {
  flex-shrink: 0;
  padding: 7px 14px;
  border-radius: 999px;
  background: var(--color-accent-bg);
  color: var(--color-accent-dark);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.import-page__price-fixed {
  margin: 0 0 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--color-border);
  font-size: 16px;
  line-height: 1.65;
  color: var(--color-text);
}

.import-page__price-col-title {
  margin: 0 0 14px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-dark);
}

.import-page__price-list {
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
    color: var(--color-text);

    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--color-accent);
      font-weight: 700;
    }
  }
}

.import-page__price-list--muted li {
  color: var(--color-text-muted);

  &::before {
    content: '—';
    color: var(--color-border-strong);
  }
}

.import-page__price-hint {
  margin: 16px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-muted);

  strong {
    color: var(--color-dark);
  }
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
  padding: 36px;
  background: var(--color-bg-alt);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.import-page__cta-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-dark);
  margin: 0 0 24px;
}

.import-page__form-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
}

.import-page__form-input {
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

.import-page__form-btn {
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

.import-page__form-hint {
  margin: 10px 0 0;
  font-size: 14px;
  color: rgba(17, 17, 17, 0.8);
}

.import-page__form-hint--error {
  color: #b42318;
}
</style>
