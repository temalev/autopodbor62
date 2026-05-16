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
    title: 'Подбор автомобиля под ключ',
    description: 'Подберём авто и сразу зарегистрируем — регистрация входит в стоимость.',
  },
  {
    to: '/import',
    title: 'Импорт из Кореи и Китая',
    description: 'Привезём автомобиль из-за рубежа и поставим на учёт — всё под ключ.',
  },
  {
    to: '/vykup',
    title: 'Выкуп и комиссионная продажа',
    description: 'Снимем старое авто с учёта при продаже и оформим документы покупателю.',
  },
]

const { app: { baseURL } } = useRuntimeConfig()
const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL

const PAGE_URL = `${SITE_URL}/registraciya-gibdd`
const PAGE_TITLE = 'Регистрация автомобиля в ГИБДД в Рязани — Автоподбор 62'
const PAGE_DESCRIPTION =
  'Поставим автомобиль на учёт в ГИБДД без очередей: подготовка документов, запись, осмотр, получение СТС и номерных знаков. Входит в стоимость подбора под ключ и импорта. Рязань.'
const PAGE_OG_IMAGE = `${SITE_URL}/images/services/1.jpeg`

useHead({
  title: PAGE_TITLE,
  meta: [
    { name: 'description', content: PAGE_DESCRIPTION },
    { property: 'og:url', content: PAGE_URL },
    { property: 'og:title', content: PAGE_TITLE },
    { property: 'og:description', content: PAGE_DESCRIPTION },
    { property: 'og:image', content: PAGE_OG_IMAGE },
    { property: 'og:image:type', content: 'image/jpeg' },
    { name: 'twitter:image', content: PAGE_OG_IMAGE },
  ],
  link: [{ rel: 'canonical', href: PAGE_URL }],
  script: [
    jsonLdScript(
      serviceJsonLd({
        name: 'Регистрация автомобиля в ГИБДД',
        description: PAGE_DESCRIPTION,
        url: PAGE_URL,
        serviceType: 'Регистрация транспортного средства в ГИБДД',
        image: PAGE_OG_IMAGE,
      }),
      'ld-gibdd-service',
    ),
    jsonLdScript(
      breadcrumbJsonLd([
        { name: 'Главная', url: `${SITE_URL}/` },
        { name: 'Регистрация в ГИБДД', url: PAGE_URL },
      ]),
      'ld-gibdd-breadcrumbs',
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

  const res = await sendLead({ name, phone, source: 'registraciya-gibdd' })
  if (res.ok) {
    leadStatus.value = 'sent'
    form.reset()
    phoneRaw.value = ''
    return
  }

  leadStatus.value = 'error'
  leadError.value = 'error' in res ? res.error : 'Ошибка отправки'
}

const highlights = [
  {
    title: 'Без очередей и лишних поездок',
    text: 'Записываемся через Госуслуги в удобное окно, приезжаем к назначенному времени. Вам не нужно разбираться в процедуре и тратить время на ожидание.',
  },
  {
    title: 'Подготовка и проверка документов',
    text: 'Перед подачей проверяем весь пакет: ПТС, договор купли-продажи, полис ОСАГО, квитанции об оплате госпошлин. Исключаем причины для отказа ещё до визита в МРЭО.',
  },
  {
    title: 'Осмотр и получение номеров',
    text: 'Сопровождаем при осмотре автомобиля сотрудниками ГИБДД, помогаем с оформлением заявления. По итогу — вы получаете СТС и государственные номерные знаки.',
  },
]

const steps = [
  { num: '01', title: 'Консультация и сбор документов', text: 'Уточняем ситуацию: новый или подержанный автомобиль, куплен у физлица или юрлица, есть ли ограничения. Составляем полный список нужных документов.' },
  { num: '02', title: 'Проверка пакета документов', text: 'Проверяем ПТС, договор купли-продажи, полис ОСАГО и другие бумаги до визита в ГИБДД. Своевременно выявляем и устраняем ошибки.' },
  { num: '03', title: 'Оплата госпошлин', text: 'Рассчитываем точные суммы госпошлин (СТС и номерные знаки), помогаем сформировать квитанции через Госуслуги — со скидкой 30%.' },
  { num: '04', title: 'Запись и визит в МРЭО', text: 'Берём талон без очереди через портал. Приезжаем к назначенному времени, подаём заявление и проходим осмотр автомобиля с нашим сопровождением.' },
  { num: '05', title: 'Получение СТС и номеров', text: 'В день обращения забираем свидетельство о регистрации и государственные номерные знаки. Автомобиль полностью готов к эксплуатации.' },
]

const documents = [
  'Паспорт владельца (оригинал)',
  'ПТС (паспорт транспортного средства)',
  'Договор купли-продажи или иной документ о переходе права',
  'Полис ОСАГО (действующий)',
  'Квитанции об оплате госпошлин',
  'Диагностическая карта — при необходимости',
]
</script>

<template>
  <div class="gibdd-page">
    <div class="gibdd-page__hero">
      <div class="gibdd-page__hero-bg">
        <img :src="`${base}/images/services/1.jpeg`" alt="Регистрация автомобиля в ГИБДД в Рязани — Автоподбор 62" class="gibdd-page__hero-img" />
        <div class="gibdd-page__hero-overlay" />
      </div>
      <div class="gibdd-page__hero-content">
        <NuxtLink to="/" class="gibdd-page__back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          На главную
        </NuxtLink>
        <p class="gibdd-page__label">Регистрация в ГИБДД</p>
        <h1 class="gibdd-page__title">Поставим автомобиль на учёт без очередей и лишних поездок</h1>
        <p class="gibdd-page__lead">Берём на себя подготовку документов, запись в МРЭО, осмотр и получение номерных знаков. Входит в стоимость подбора под ключ и импорта — или как отдельная услуга.</p>
      </div>
    </div>

    <section class="gibdd-page__section">
      <div class="gibdd-page__container">
        <h2 class="gibdd-page__h2">Что мы берём на себя</h2>
        <p class="gibdd-page__intro">Регистрация автомобиля — обязательная процедура после покупки, но с нами она проходит быстро и без нервов. Один визит, всё оформлено.</p>
        <ul class="gibdd-page__highlights">
          <li v-for="(item, i) in highlights" :key="i" class="gibdd-page__highlight">
            <span class="gibdd-page__highlight-num" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="gibdd-page__highlight-body">
              <h3 class="gibdd-page__highlight-title">{{ item.title }}</h3>
              <p class="gibdd-page__highlight-text">{{ item.text }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section class="gibdd-page__section gibdd-page__section--dark">
      <div class="gibdd-page__container">
        <h2 class="gibdd-page__h2 gibdd-page__h2--light">Как проходит постановка на учёт: по шагам</h2>
        <p class="gibdd-page__intro gibdd-page__intro--light">От первого звонка до получения номеров — полное сопровождение на каждом этапе.</p>
        <ol class="gibdd-page__steps">
          <li v-for="step in steps" :key="step.num" class="gibdd-page__step">
            <span class="gibdd-page__step-num" aria-hidden="true">{{ step.num }}</span>
            <div class="gibdd-page__step-body">
              <h3 class="gibdd-page__step-title">{{ step.title }}</h3>
              <p class="gibdd-page__step-text">{{ step.text }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="gibdd-page__section">
      <div class="gibdd-page__container">
        <h2 class="gibdd-page__h2">Документы, которые потребуются</h2>
        <p class="gibdd-page__intro">Мы заранее проверим ваш пакет документов и предупредим, если чего-то не хватает.</p>
        <ul class="gibdd-page__docs">
          <li v-for="(doc, i) in documents" :key="i">{{ doc }}</li>
        </ul>

        <div class="gibdd-page__note">
          <p>Регистрация входит в стоимость <NuxtLink to="/podbor" class="gibdd-page__note-link">подбора автомобиля под ключ</NuxtLink> и <NuxtLink to="/import" class="gibdd-page__note-link">импорта из-за рубежа</NuxtLink>. Если приобрели автомобиль самостоятельно — оформим отдельно.</p>
        </div>

        <div class="gibdd-page__cta">
          <p class="gibdd-page__cta-text">Нужно поставить автомобиль на учёт? Свяжитесь с нами — разберём вашу ситуацию</p>
          <form class="gibdd-page__form" @submit.prevent="submitLead">
            <div class="gibdd-page__form-fields">
              <input type="text" class="gibdd-page__form-input" name="name" placeholder="Ваше имя" autocomplete="name" />
              <input type="tel" class="gibdd-page__form-input" name="phone" placeholder="+7 (___) ___-__-__" autocomplete="tel" @input="handlePhoneInput" @keydown="handlePhoneKeydown" />
            </div>
            <button type="submit" class="gibdd-page__form-btn" :disabled="leadStatus === 'sending'">
              {{ leadStatus === 'sending' ? 'Отправляем…' : 'Получить консультацию' }}
            </button>
            <p v-if="leadStatus === 'sent'" class="gibdd-page__form-hint">Заявка отправлена. Перезвоним в ближайшее время.</p>
            <p v-else-if="leadStatus === 'error'" class="gibdd-page__form-hint gibdd-page__form-hint--error">Не удалось отправить заявку. {{ leadError }}</p>
          </form>
        </div>
      </div>
    </section>

    <RelatedServices :items="relatedServices" subheading="Часто берут вместе" />
  </div>
</template>

<style scoped lang="scss">
.gibdd-page {
  padding-top: 0;
  min-height: 100vh;
}

.gibdd-page__hero {
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

.gibdd-page__hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.gibdd-page__hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.gibdd-page__hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.95) 100%);
}

.gibdd-page__hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  color: #fff;
}

.gibdd-page__back {
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

.gibdd-page__label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-accent);
  margin: 0 0 12px;
}

.gibdd-page__title {
  font-size: clamp(28px, 4.5vw, 42px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin: 0 0 16px;
}

.gibdd-page__lead {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.55;
  margin: 0;
}

.gibdd-page__section {
  padding: 64px 24px;

  @media (max-width: 720px) {
    padding: 48px 20px;
  }

  &--dark {
    background: var(--color-dark);
    color: #fff;
  }
}

.gibdd-page__container {
  max-width: 800px;
  margin: 0 auto;
}

.gibdd-page__h2 {
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

.gibdd-page__intro {
  font-size: 17px;
  color: var(--color-text-muted);
  line-height: 1.65;
  margin: 0 0 40px;

  &--light {
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 40px;
  }
}

.gibdd-page__highlights {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.gibdd-page__highlight {
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

.gibdd-page__highlight-num {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: 0.05em;
  padding-top: 4px;
}

.gibdd-page__highlight-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-dark);
  margin: 0 0 6px;
  line-height: 1.3;
}

.gibdd-page__highlight-text {
  font-size: 15px;
  color: var(--color-text);
  line-height: 1.65;
  margin: 0;
}

.gibdd-page__steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.gibdd-page__step {
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

.gibdd-page__step-num {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: 0.05em;
}

.gibdd-page__step-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
  line-height: 1.3;
}

.gibdd-page__step-text {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.65;
  margin: 0;
}

.gibdd-page__docs {
  list-style: none;
  margin: 0 0 36px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;

  li {
    position: relative;
    padding-left: 24px;
    font-size: 16px;
    color: var(--color-text);
    line-height: 1.5;

    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--color-accent);
      font-weight: 700;
    }
  }
}

.gibdd-page__note {
  padding: 20px 24px;
  background: var(--color-bg-alt);
  border-left: 3px solid var(--color-accent);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  margin-bottom: 48px;

  p {
    font-size: 15px;
    color: var(--color-text);
    line-height: 1.65;
    margin: 0;
  }
}

.gibdd-page__note-link {
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}

.gibdd-page__cta {
  padding: 36px;
  background: var(--color-bg-alt);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.gibdd-page__cta-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-dark);
  margin: 0 0 24px;
}

.gibdd-page__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gibdd-page__form-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
}

.gibdd-page__form-input {
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

.gibdd-page__form-btn {
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

.gibdd-page__form-hint {
  margin: 10px 0 0;
  font-size: 14px;
  color: rgba(17, 17, 17, 0.8);
}

.gibdd-page__form-hint--error {
  color: #b42318;
}
</style>
