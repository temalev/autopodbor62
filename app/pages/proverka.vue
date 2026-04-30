<script setup lang="ts">
import { sendLead } from '../utils/lead'

const { app: { baseURL } } = useRuntimeConfig()
const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL

useHead({
  title: 'Разовая проверка автомобиля перед покупкой — Автоподбор 62',
  meta: [
    {
      name: 'description',
      content: 'Проверка автомобиля перед покупкой: полная диагностика, VIN и история, замер ЛКП, отчёт 150+ фото и видео. Заключение эксперта — стоит ли покупать. Рязань.',
    },
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

  const res = await sendLead({ name, phone, source: 'proverka' })
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
  { title: 'Полная диагностика', text: 'Техсостояние, кузов, электрика, подвеска — всё, что важно перед покупкой. Не поверхностный осмотр, а глубокая проверка.' },
  { title: 'VIN, история, пробег', text: 'Документы, маркировочные обозначения, реальная история авто. Юридическая чистота и понимание, не скручен ли пробег.' },
  { title: 'Фото- и видеоотчёт', text: 'Не менее 150 фото и видео, плюс краткое заключение эксперта: стоит покупать или нет. Решение за вами — но вы его принимаете на основе фактов.' },
]

const checklist = [
  'Общий осмотр автомобиля',
  'Проверка документов, маркировочных обозначений и основных моментов истории',
  'Проверка силовой конструкции кузова, точек крепления навесных элементов',
  'Состояние и работоспособность освещения, электроприводов и обогревов остекления',
  'Фиксация повреждений и недостатков на кузове',
  'Замер толщины ЛКП внешних элементов, силовой конструкции и проёмов кузова',
  'Проверка системы безопасности и осмотр салона',
  'Проверка шин, дисков, элементов тормозной системы',
  'Техническая часть: следы ремонта, жидкости, течи, ходовая часть, пробная поездка',
  'Компьютерная диагностика: пробег, ошибки, рабочие параметры систем',
]
</script>

<template>
  <div class="proverka-page">
    <div class="proverka-page__hero">
      <div class="proverka-page__hero-bg">
        <img :src="`${base}/images/services/2.jpeg`" alt="Проверка автомобиля" class="proverka-page__hero-img" />
        <div class="proverka-page__hero-overlay" />
      </div>
      <div class="proverka-page__hero-content">
        <NuxtLink to="/" class="proverka-page__back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          На главную
        </NuxtLink>
        <p class="proverka-page__label">Разовая проверка</p>
        <h1 class="proverka-page__title">Уже нашли вариант? Проверим глубже, чем в сервисе</h1>
        <p class="proverka-page__lead">Полная диагностика перед покупкой: юридическая чистота, техсостояние, кузов, электрика. Отчёт с 150+ фото и видео плюс заключение эксперта — стоит ли покупать этот автомобиль.</p>
      </div>
    </div>

    <section class="proverka-page__section">
      <div class="proverka-page__container">
        <h2 class="proverka-page__h2">Что входит в разовую проверку</h2>
        <p class="proverka-page__intro">Мы не ограничиваемся «посмотрели и сказали». Проводим полноценный комплекс проверок и выдаём структурированный отчёт, по которому вы можете принять решение.</p>
        <ul class="proverka-page__highlights">
          <li v-for="(item, i) in highlights" :key="i" class="proverka-page__highlight">
            <span class="proverka-page__highlight-num" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="proverka-page__highlight-body">
              <h3 class="proverka-page__highlight-title">{{ item.title }}</h3>
              <p class="proverka-page__highlight-text">{{ item.text }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section class="proverka-page__section proverka-page__section--dark">
      <div class="proverka-page__container">
        <h2 class="proverka-page__h2 proverka-page__h2--light">Полный чек-лист проверки</h2>
        <p class="proverka-page__intro proverka-page__intro--light">Каждый осмотр включает эти пункты. Такой комплекс максимально снижает риск при покупке автомобиля.</p>
        <ol class="proverka-page__checklist">
          <li v-for="(item, i) in checklist" :key="i" class="proverka-page__checklist-item">
            <span class="proverka-page__checklist-num" aria-hidden="true">{{ i + 1 }}</span>
            <span class="proverka-page__checklist-text">{{ item }}</span>
          </li>
        </ol>
      </div>
    </section>

    <section class="proverka-page__section">
      <div class="proverka-page__container">
        <h2 class="proverka-page__h2">Что вы получаете</h2>
        <div class="proverka-page__result">
          <p>Полный отчёт: не менее 150 фото- и видеофайлов и краткое заключение — комментарий эксперта. Вы знаете правду об автомобиле до покупки и можете торговаться или отказаться от сделки, опираясь на факты.</p>
        </div>
        <div class="proverka-page__cta">
          <p class="proverka-page__cta-text">Нашли автомобиль? Закажите проверку — назовём стоимость и сроки</p>
          <form class="proverka-page__form" @submit.prevent="submitLead">
            <div class="proverka-page__form-fields">
              <input type="text" class="proverka-page__form-input" name="name" placeholder="Ваше имя" autocomplete="name" />
              <input type="tel" class="proverka-page__form-input" name="phone" placeholder="+7 (___) ___-__-__" autocomplete="tel" @input="handlePhoneInput" @keydown="handlePhoneKeydown" />
            </div>
            <button type="submit" class="proverka-page__form-btn" :disabled="leadStatus === 'sending'">
              {{ leadStatus === 'sending' ? 'Отправляем…' : 'Заказать проверку' }}
            </button>
            <p v-if="leadStatus === 'sent'" class="proverka-page__form-hint">Заявка отправлена. Перезвоним в ближайшее время.</p>
            <p v-else-if="leadStatus === 'error'" class="proverka-page__form-hint proverka-page__form-hint--error">Не удалось отправить заявку. {{ leadError }}</p>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.proverka-page {
  padding-top: 0;
  min-height: 100vh;
}

.proverka-page__hero {
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

.proverka-page__hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.proverka-page__hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.proverka-page__hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.95) 100%);
}

.proverka-page__hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  color: #fff;
}

.proverka-page__back {
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

.proverka-page__label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-accent);
  margin: 0 0 12px;
}

.proverka-page__title {
  font-size: clamp(28px, 4.5vw, 42px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin: 0 0 16px;
}

.proverka-page__lead {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.55;
  margin: 0;
}

.proverka-page__section {
  padding: 64px 24px;

  @media (max-width: 720px) {
    padding: 48px 20px;
  }

  &--dark {
    background: var(--color-dark);
    color: #fff;
  }
}

.proverka-page__container {
  max-width: 800px;
  margin: 0 auto;
}

.proverka-page__h2 {
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

.proverka-page__intro {
  font-size: 17px;
  color: var(--color-text-muted);
  line-height: 1.65;
  margin: 0 0 40px;

  &--light {
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 40px;
  }
}

.proverka-page__highlights {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.proverka-page__highlight {
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

.proverka-page__highlight-num {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: 0.05em;
}

.proverka-page__highlight-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-dark);
  margin: 0 0 6px;
  line-height: 1.3;
}

.proverka-page__highlight-text {
  font-size: 15px;
  color: var(--color-text);
  line-height: 1.65;
  margin: 0;
}

.proverka-page__checklist {
  list-style: none;
  margin: 0;
  padding: 0;
  counter-reset: checklist;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.proverka-page__checklist-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
}

.proverka-page__checklist-num {
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

.proverka-page__checklist-text {
  padding-top: 2px;
}

.proverka-page__result {
  font-size: 17px;
  line-height: 1.7;
  color: var(--color-text);
  margin-bottom: 48px;

  p {
    margin: 0;
  }
}

.proverka-page__cta {
  padding: 36px;
  background: var(--color-bg-alt);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.proverka-page__cta-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-dark);
  margin: 0 0 24px;
}

.proverka-page__form-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
}

.proverka-page__form-input {
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

.proverka-page__form-btn {
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

.proverka-page__form-hint {
  margin: 10px 0 0;
  font-size: 14px;
  color: rgba(17, 17, 17, 0.8);
}

.proverka-page__form-hint--error {
  color: #b42318;
}
</style>
