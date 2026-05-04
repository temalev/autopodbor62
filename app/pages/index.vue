<script setup lang="ts">
import { ElCollapse, ElCollapseItem } from 'element-plus'
import { sendLead } from '../utils/lead'

const { app: { baseURL } } = useRuntimeConfig()
const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL

function assetUrl(path: string) {
  return `${base}${path}`
}

const phoneRaw = ref('')
const showScrollTop = ref(false)

const heroLeadStatus = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const heroLeadError = ref('')
const ctaLeadStatus = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const ctaLeadError = ref('')

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onScroll() {
  showScrollTop.value = window.scrollY > 400

  if (window.location.hash) {
    const id = window.location.hash.slice(1)
    const el = document.getElementById(id)
    if (el) {
      const rect = el.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        history.replaceState(null, '', window.location.pathname)
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

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

async function submitHeroLead(e: Event) {
  const form = e.target as HTMLFormElement | null
  if (!form) return

  heroLeadStatus.value = 'sending'
  heroLeadError.value = ''

  const fd = new FormData(form)
  const name = String(fd.get('name') || '').trim()
  const phone = String(fd.get('phone') || '').trim()

  const res = await sendLead({ name, phone, source: 'index-hero' })
  if (res.ok) {
    heroLeadStatus.value = 'sent'
    form.reset()
    phoneRaw.value = ''
    return
  }

  heroLeadStatus.value = 'error'
  heroLeadError.value = 'error' in res ? res.error : 'Ошибка отправки'
}

async function submitCtaLead(e: Event) {
  const form = e.target as HTMLFormElement | null
  if (!form) return

  ctaLeadStatus.value = 'sending'
  ctaLeadError.value = ''

  const fd = new FormData(form)
  const name = String(fd.get('name') || '').trim()
  const phone = String(fd.get('phone') || '').trim()

  const res = await sendLead({ name, phone, source: 'index-cta-bottom' })
  if (res.ok) {
    ctaLeadStatus.value = 'sent'
    form.reset()
    phoneRaw.value = ''
    return
  }

  ctaLeadStatus.value = 'error'
  ctaLeadError.value = 'error' in res ? res.error : 'Ошибка отправки'
}

interface ReviewImage {
  '1280x960'?: string
  '640x480'?: string
  '256x192'?: string
  '180x135'?: string
  '432x324'?: string
  originalSize?: { width: number; height: number }
}

interface ReviewAnswer {
  answered: string
  title: string
  text: string
  avatar?: Record<string, string>
  images?: ReviewImage[]
}

interface Review {
  id: number
  avatar: Record<string, string>
  title: string
  titleCaption: string
  rated: string
  score: number
  stageTitle: string
  itemTitle: string
  textSections: { text: string }[]
  images?: ReviewImage[]
  answer?: ReviewAnswer
}

const activeServiceIndex = ref(0)
const activeService = computed(() => services[activeServiceIndex.value]!)

const services = [
  {
    icon: 'manage_search',
    title: 'Автоподбор под ключ',
    description: 'Полный цикл: от анализа рынка и поиска вариантов до проверки и оформления сделки. Вы получаете честный автомобиль по реальной цене без лишних усилий.',
    features: [
      { icon: 'travel_explore', text: 'Поиск по открытым интернет-ресурсам, закрытым чатам и партнёрским каналам' },
      { icon: 'shield', text: 'Максимальное снижение рисков появления технических и юридических проблем' },
      { icon: 'handshake', text: 'Торг с продавцом для нас — спортивный интерес' },
      { icon: 'article', text: 'Регистрация в ГИБДД входит в стоимость' },
    ],
    link: '/podbor',
    index: '01',
  },
  {
    icon: 'verified',
    title: 'Разовая проверка',
    description: 'Уже нашли вариант? Проверим глубже, чем в обычном сервисе — толщинометрия, диагностика, VIN-история. Полный отчёт за несколько часов.',
    features: [
      { icon: 'straighten', text: 'Толщинометрия кузова — более 200 точек замера' },
      { icon: 'car_repair', text: 'Компьютерная диагностика всех электросистем' },
      { icon: 'manage_search', text: 'Проверка VIN, истории, залогов и ограничений' },
      { icon: 'photo_camera', text: 'Фото- и видеоотчёт 150+ файлов с заключением эксперта' },
    ],
    link: '/proverka',
    index: '02',
  },
  {
    icon: 'sell',
    title: 'Выкуп и комиссионная продажа',
    description: 'Продайте автомобиль быстро и выгодно. Выкупим сразу или возьмём на комиссию — вы занимаетесь своими делами, мы продаём.',
    features: [
      { icon: 'price_check', text: 'Честная оценка по рынку — без занижения на месте' },
      { icon: 'payments', text: 'Выкуп в день обращения, деньги сразу' },
      { icon: 'campaign', text: 'Качественные фото и размещение на всех площадках' },
      { icon: 'forum', text: 'Показы и переговоры с покупателями — на нас' },
    ],
    link: '/vykup',
    index: '03',
  },
  {
    icon: 'article',
    title: 'Регистрация в ГИБДД',
    description: 'Оформим автомобиль на нового владельца без очередей и лишних поездок. Входит в стоимость подбора под ключ и импорта.',
    features: [
      { icon: 'queue', text: 'Подача документов без очередей' },
      { icon: 'directions_car', text: 'Осмотр автомобиля с нашим сопровождением' },
      { icon: 'pin', text: 'Получение государственных номерных знаков' },
      { icon: 'check_circle', text: 'Входит в стоимость подбора под ключ и импорта' },
    ],
    link: '/registraciya-gibdd',
    index: '04',
  },
  {
    icon: 'flight_takeoff',
    title: 'Импорт из-за рубежа',
    description: 'Привезём автомобиль из Кореи или Китая под ключ — подбор, проверка, таможня, доставка в Рязань и постановка на учёт.',
    features: [
      { icon: 'public', text: 'Подбор и проверка автомобиля в Корее или Китае' },
      { icon: 'local_shipping', text: 'Логистика и таможенное оформление' },
      { icon: 'location_on', text: 'Доставка до Рязани, ТО и детейлинг' },
      { icon: 'badge', text: 'Постановка на учёт в ГИБДД' },
    ],
    link: '/import',
    index: '05',
  },
  {
    icon: 'fact_check',
    title: 'Прием а/м из кузовного ремонта',
    description: 'Принимаем автомобиль после ремонта, кузовных работ или покупки у дилера. Проверяем качество, замеряем ЛКП, фиксируем нарушения.',
    features: [
      { icon: 'build', text: 'Осмотр после ремонта или покупки у дилера' },
      { icon: 'brush', text: 'Контроль качества кузовных и малярных работ' },
      { icon: 'straighten', text: 'Замер ЛКП и сверка с нормо-часами' },
      { icon: 'photo_camera', text: 'Подробный отчёт с фотофиксацией нарушений' },
    ],
    link: '/proverka-kuzova',
    index: '06',
  },
]

const reviews: Review[] = [
  {
    id: 381146673,
    avatar: {
      '100x100': 'https://30.img.avito.st/image/1/1.5hjcALa1XPGiooDynFvUCsihSPFiq4DyoqJI8w.XHVGtvGhJ_sg9YotQHS6GOGAazewA3MLkMomJOq86OA?cqp=2.pGdjs5fBvl5-fB-fm84xxYDAkt8GM2Wgr1fOyxua9Q==',
      '64x64': 'https://30.img.avito.st/image/1/1.5hjcALa1XPHqosjynFvUCsihSPFiq8jy6qJI8w.Ezd3d6G9_48RVyJiSBM11QZwM2g_K5Gl1fF1xRYNJCQ?cqp=2.pGdjs5fBvl5-fB-fm84xxYDAkt8GM2Wgr1fOyxua9Q==',
    },
    title: 'ИП ГЕРАСИМОВ ОЛЕГ ВАЛЕРЬЕВИЧ',
    titleCaption: 'Клиент',
    rated: '23 декабря 2025',
    score: 5,
    stageTitle: 'Сделка состоялась',
    itemTitle: 'Проверка автомобиля, автоподбор',
    textSections: [
      { text: 'Автоподбор.\nОсмотрел автомобиль тщательно. Все нюансы зафиксировал. Прислал отличный отчет. Рекомендую.' },
    ],
    images: [
      { '640x480': 'https://10.img.avito.st/image/1/1.rLxqhra5qgjepQiX28fTpkzTAFfYIwDX1uUFV9gzBFc.q802kxGSdVhbdp6CSWDc8ztb4CAeMnJw4DbySBSYBKc?cqp=2.ZTpOdDGMwjQ9FxykYYx1emcExdwnB4QJTJ3gQLJr84nkJsv0XyRRJhYQ4iKI_UhK0gA=', '180x135': 'https://10.img.avito.st/image/1/1.rLxqhra5qgjezQDZ3sfTpkzTAFfYIwC_3qsAV9gzBFc.54773lapZmf6i07LEsiEwQ-SC9d8ljO3PpZsNrM__mU?cqp=2.ZTpOdDGMwjQ9FxykYYx1emcExdwnB4QJTJ3gQLJr84nkJsv0XyRRJhYQ4iKI_UhK0gA=' },
      { '640x480': 'https://90.img.avito.st/image/1/1.A1VfSba5BeHraqd-7lZmTXkcr77t7K8-4yqqvu38q74.vweCdGwrvhwDILbZFqtZRgvCxYR0y2yMX7Zie_4DDT4', '180x135': 'https://90.img.avito.st/image/1/1.A1VfSba5BeHrAq8w61ZmTXkcr77t7K9W62Svvu38q74.1d_Xd_S0cffiICrCXRCcfO9namUtIgFHOh7J2ZtnNpI' },
    ],
  },
  {
    id: 377580961,
    avatar: {
      '100x100': 'https://10.img.avito.st/image/1/1.b_z5Bba21RWHpwkWqxw24nKmwx9HbsDfTqbB.eMBHGbCUxv15fmFL3yTLxxekgYS6fseyzWfx9MhJ1hw?cqp=2.pGdjs5fBvl5-fB-fm84xxYDAkt8GM2Wgr1fOyxua9Q==',
      '64x64': 'https://10.img.avito.st/image/1/1.b_z5Bba21RXPp0EWqxw24nKmwx9HJsCXTqbB.Wd3repHIEacIW0oCm1zqT20GT8_waPtfpUmXI1koDZQ?cqp=2.pGdjs5fBvl5-fB-fm84xxYDAkt8GM2Wgr1fOyxua9Q==',
    },
    title: 'Дмитрий',
    titleCaption: 'Клиент',
    rated: '11 декабря 2025',
    score: 5,
    stageTitle: 'Сделка состоялась',
    itemTitle: 'Проверка автомобиля, автоподбор',
    textSections: [
      { text: 'Выражаю огромное спасибо своему коллеге Дмитрию за проведенный осмотр а/м Lexus RX300. Максимально подробный отчет, человек понимает, что делает. Рекомендую однозначно' },
    ],
  },
  {
    id: 371244433,
    avatar: {
      '64x64': 'https://static.avito.ru/stub_avatars/%D0%9C/12_64x64.png',
      '96x96': 'https://static.avito.ru/stub_avatars/%D0%9C/12_96x96.png',
    },
    title: 'Максим',
    titleCaption: 'Клиент',
    rated: '19 ноября 2025',
    score: 5,
    stageTitle: 'Сделка состоялась',
    itemTitle: 'Проверка автомобиля, автоподбор',
    textSections: [
      { text: 'Сам с другого региона, нужен был оперативный, разовый осмотр автомобиля, с полным отчетом. Большое спасибо за проделанную работу! Столько информации за по сути смешную цену!!! Машина после подбора понравилась и была куплена! Человек был на связи мучил его своими назойливыми вопросами)))\nБольшое спасибо!' },
    ],
    images: [
      { '1280x960': 'https://90.img.avito.st/image/1/1.c_n2b7a5dU1CTMmSTxAzy4Y83xJEyt-SVEzSEkTa2xI.xJPB2F4hkPjoPY0w5vEMdnMvW7bLTovfWRkJ6gc7wuY', '180x135': 'https://90.img.avito.st/image/1/1.c_n2b7a5dU1CJN-cQhAzy4Y83xJEyt_6QkLfEkTa2xI.TTC6rrB3sqvtUV-sCOEqfDBdDMdjOPTPtDt7CtqVVuc', '640x480': 'https://90.img.avito.st/image/1/1.c_n2b7a5dU1CTNfSRxAzy4Y83xJEyt-SSgzaEkTa2xI.1L-Qj7OpSEDcZOQqO2ybcjZSxlE1qLhfzvFlF8emQqg' },
    ],
  },
  {
    id: 308296737,
    avatar: {
      '100x100': 'https://00.img.avito.st/image/1/1.7sCt8ra2VCnTUIgq_YmA0URRQiMTmUHjGlFA.uRU7C3L9K33LQ0xJ-kOAqh5ZOOhL2avjIpJ4y8T__yw?cqp=2.pGdjs5fBvl5-fB-fm84xxYDAkt8GM2Wgr1fOyxua9Q==',
      '64x64': 'https://00.img.avito.st/image/1/1.7sCt8ra2VCmbUMAq_YmA0URRQiMT0UGrGlFA.wEy6f6BWygE5n2tLEErWsv2hfG1U1br90yk6umCP9Yg?cqp=2.pGdjs5fBvl5-fB-fm84xxYDAkt8GM2Wgr1fOyxua9Q==',
    },
    title: 'Василий',
    titleCaption: 'Клиент',
    rated: '3 апреля 2025',
    score: 5,
    stageTitle: 'Сделка состоялась',
    itemTitle: 'Проверка автомобиля, автоподбор',
    textSections: [
      { text: 'Обратился к Дмитрию за осмотром бмв х3. Нужен был полный комплекс. Осмотр, подъемник и эндоскопия. Все было сделано крайне тщательно и профессионально. Отношение такое как должно быть в идеале и даже лучше. Есть с чем сравнить, поэтому Дмитрия смело рекомендую и буду в дальнейшем обращаться и советовать. Еще раз большое спасибо, жму руку 🤝' },
    ],
    answer: {
      answered: '3 апреля 2025',
      title: 'Автоподбор autopodbor_62',
      text: 'Спасибо за обращение в целом и развёрнутый отзыв. Поздравляю с покупкой, был рад показать все скрытые от глаз детали состояния автомобиля и по возможности содействовать в разборе нюансов функционала машины 🤝',
      avatar: { '64x64': 'https://00.img.avito.st/image/1/1.i-WaLra2MQysjKUPgDyvh3yNJwYkDSSOLY0l.BWlzhLPHT472Ez1lwSOu1YawJhLnks0gRxANQDl5jWM?cqp=2.pGdjs5fBvl5-fB-fm84xxYDAkt8GM2Wgr1fOyxua9Q==' },
      images: [
        { '640x480': 'https://90.img.avito.st/image/1/1.cv_RzbazVJ9mbFwep2kCup21HBZnbg.kvVzopMBwI2Vnagdn-lYxeHV0IPvkFIdmwmeJnfiNs8', '180x135': 'https://90.img.avito.st/image/1/1.cv_RzbazVJ9mbDwS72sCup21HBZnbg.txfLXtl8fp7haczCJxbzYJj8Dq4x6GNwxsf-_SV9M-s' },
        { '640x480': 'https://40.img.avito.st/image/1/1.qUTe07azjyRpcoelqHfvGteqx61ocA.sv97yrTStYzg91EUS7nRzBiU9wx4mHeEPEZZj5nY60k', '432x324': 'https://40.img.avito.st/image/1/1.qUTe07azjyRpcuep4HXvGteqx61ocA.gyjVLbWg4WY8U2aedI_oyg-2Ynw9FgLJxObd4DXk3Kk' },
      ],
    },
  },
  {
    id: 296447553,
    avatar: {
      '64x64': 'https://static.avito.ru/stub_avatars/%D0%90/4_64x64.png',
      '96x96': 'https://static.avito.ru/stub_avatars/%D0%90/4_96x96.png',
    },
    title: 'Андрей',
    titleCaption: 'Клиент',
    rated: '20 февраля 2025',
    score: 5,
    stageTitle: 'Сделка состоялась',
    itemTitle: 'Эндоскопия двигателя выездная',
    textSections: [
      { text: 'Позвонил для эндоскопии двигателя. Мастер нашёл время в тот же день. Работу выполнил быстро и  качественно, составил подробный отчёт, поделился своим советом. Рекомендую.' },
    ],
    answer: {
      answered: '26 февраля 2025',
      title: 'Автоподбор autopodbor_62',
      text: 'Спасибо за обращение, мы всегда на связи ',
      avatar: { '64x64': 'https://00.img.avito.st/image/1/1.i-WaLra2MQysjKUPgDyvh3yNJwYkDSSOLY0l.BWlzhLPHT472Ez1lwSOu1YawJhLnks0gRxANQDl5jWM?cqp=2.pGdjs5fBvl5-fB-fm84xxYDAkt8GM2Wgr1fOyxua9Q==' },
    },
  },
]
</script>

<template>
  <div class="page">
    <section class="page__hero" :style="{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.45) 100%), url(${base}/images/bg.webp)` }">
      <div class="page__hero-inner">
        <div class="page__hero-left">
          <div class="page__content">
            <h1 class="page__title">
              Автоподбор 62 — покупка
              и&nbsp;продажа&nbsp;автомобиля без&nbsp;риска
              и&nbsp;потери времени
            </h1>
            <p class="page__text">
              Мы берём на себя все сложные и рискованные этапы, чтобы вы получили честный автомобиль по реальной цене — без обмана, сюрпризов и лишних затрат.
            </p>
          </div>
          <div class="page__hero-cta">
            <div class="page__hero-cta-badge">
              <span class="page__hero-cta-badge-dot"></span>
              Хорошие автомобили разбирают как горячие пирожки — успейте забрать свой
            </div>
            <form class="page__hero-form" @submit.prevent="submitHeroLead">
              <input type="text" class="page__hero-form-input" name="name" placeholder="Ваше имя" autocomplete="name" />
              <input type="tel" class="page__hero-form-input" name="phone" placeholder="+7 (___) ___-__-__" autocomplete="tel" @input="handlePhoneInput" @keydown="handlePhoneKeydown" />
              <button type="submit" class="page__hero-form-btn" :disabled="heroLeadStatus === 'sending'">
                {{ heroLeadStatus === 'sending' ? 'Отправляем…' : 'Оставить заявку' }}
              </button>
              <p v-if="heroLeadStatus === 'sent'" class="page__form-hint">Заявка отправлена. Перезвоним в ближайшее время.</p>
              <p v-else-if="heroLeadStatus === 'error'" class="page__form-hint page__form-hint--error">Не удалось отправить заявку. {{ heroLeadError }}</p>
            </form>
          </div>
        </div>

        <div class="page__hero-stats">
          <div class="page__hero-stat">
            <span class="page__hero-stat-num">10+</span>
            <span class="page__hero-stat-label">лет в автоподборе</span>
          </div>
          <div class="page__hero-stat">
            <span class="page__hero-stat-num">5000+</span>
            <span class="page__hero-stat-label">проверенных авто</span>
          </div>
          <div class="page__hero-stat">
            <span class="page__hero-stat-num">5.0</span>
            <span class="page__hero-stat-label">рейтинг на Авито</span>
          </div>
        </div>
      </div>
    </section>

    <section id="services" class="page__section page__section--services">
      <h2 class="page__section-title">Наши услуги</h2>
      <p class="page__section-text">
        Полный спектр услуг для покупки, продажи и обслуживания автомобилей
      </p>

      <div class="page__svc-wrap">
        <div class="page__svc-tabs" role="tablist">
          <button
            v-for="(srv, i) in services"
            :key="i"
            class="page__svc-tab"
            :class="{ 'page__svc-tab--active': activeServiceIndex === i }"
            role="tab"
            :aria-selected="activeServiceIndex === i"
            @click="activeServiceIndex = i"
          >
            <span class="page__svc-tab-icon material-symbols-outlined" aria-hidden="true">{{ srv.icon }}</span>
            <span class="page__svc-tab-label">{{ srv.title }}</span>
          </button>
        </div>

        <div class="page__svc-panel" role="tabpanel">
          <div class="page__svc-panel-left">
            <h3 class="page__svc-panel-title">{{ activeService.title }}</h3>
            <p class="page__svc-panel-desc">{{ activeService.description }}</p>
            <NuxtLink :to="activeService.link" class="page__svc-panel-btn">
              Подробнее об услуге
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </NuxtLink>
          </div>

          <div class="page__svc-panel-right">
            <div class="page__svc-features">
              <div
                v-for="(feat, j) in activeService.features"
                :key="j"
                class="page__svc-feature"
              >
                <span class="page__svc-feature-icon material-symbols-outlined" aria-hidden="true">{{ feat.icon }}</span>
                <span class="page__svc-feature-text">{{ feat.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>



    <section id="korea" class="page__section page__section--korea">
      <div class="page__korea-image">
        <img :src="assetUrl('/images/korea.webp')" alt="Авто из Кореи и Китая" />
        <div class="page__korea-image-overlay" />
      </div>
      <div class="page__korea-content">
        <p class="page__korea-label">Импорт из Кореи и Китая</p>
        <h2 class="page__korea-title">Покупка автомобиля в Корее и Китае под ключ</h2>
        <p class="page__korea-text">Берём на себя анализ рынка, подбор и проверку автомобиля, сопровождение сделки, логистику, таможенное оформление, доставку в Рязань, техобслуживание, детейлинг и регистрацию в ГИБДД. Вы получаете полностью готовый к эксплуатации автомобиль с номерами — обслуженный, чистый, с прозрачной историей и понятной конечной стоимостью, без скрытых платежей.</p>
        <div class="page__korea-blocks">
          <div class="page__korea-block">
            <span class="page__korea-block-icon material-symbols-outlined" aria-hidden="true">fact_check</span>
            <span class="page__korea-block-text">Подбор, проверка и сопровождение сделки</span>
          </div>
          <div class="page__korea-block">
            <span class="page__korea-block-icon material-symbols-outlined" aria-hidden="true">local_shipping</span>
            <span class="page__korea-block-text">Логистика, таможня, доставка в Рязань</span>
          </div>
          <div class="page__korea-block">
            <span class="page__korea-block-icon material-symbols-outlined" aria-hidden="true">build_circle</span>
            <span class="page__korea-block-text">ТО, детейлинг и регистрация в ГИБДД</span>
          </div>
          <div class="page__korea-block">
            <span class="page__korea-block-icon material-symbols-outlined" aria-hidden="true">receipt_long</span>
            <span class="page__korea-block-text">Прозрачная стоимость без скрытых платежей</span>
          </div>
        </div>
      </div>
    </section>

    <section id="afterservice" class="page__section page__section--afterservice">
      <div class="page__afterservice-wrap">
        <div class="page__afterservice-content">
          <div class="page__afterservice-left">
            <p class="page__afterservice-label">Собственный сервис</p>
            <h2 class="page__afterservice-title">Обслуживаем своих клиентов после покупки</h2>
            <p class="page__afterservice-text">У нас есть собственный автосервис, где мы с огромным удовольствием и на лучших условиях можем заботится о вашем автомобиле. </p>
             <p class="page__afterservice-text">Техническое обслуживание, ремонт, предпродажная подготовка - это лишь неполных перечень услуг. Купили автомобиль с нашей помощью - будьте уверены, он под надежной заботой.</p>
            <p class="page__afterservice-text">Мы знаем полную историю каждого автомобиля, который подобрали своим клиентам, поэтому обслуживаем его правильно — без лишних работ и переплат.</p>
            <a href="#contact" class="page__afterservice-btn">Записаться на ТО</a>
          </div>

          <div class="page__afterservice-right">
            <div class="page__afterservice-list">
              <div class="page__afterservice-item">
                <span class="page__afterservice-item-icon material-symbols-outlined" aria-hidden="true">oil_barrel</span>
                <div class="page__afterservice-item-body">
                  <h3 class="page__afterservice-item-title">Плановое ТО</h3>
                  <p class="page__afterservice-item-text">Замена масла, фильтров, технических жидкостей по регламенту производителя</p>
                </div>
              </div>
              <div class="page__afterservice-item">
                <span class="page__afterservice-item-icon material-symbols-outlined" aria-hidden="true">tire_repair</span>
                <div class="page__afterservice-item-body">
                  <h3 class="page__afterservice-item-title">Ходовая часть</h3>
                  <p class="page__afterservice-item-text">Диагностика и ремонт подвески, тормозной системы, рулевого управления</p>
                </div>
              </div>
              <div class="page__afterservice-item">
                <span class="page__afterservice-item-icon material-symbols-outlined" aria-hidden="true">electric_car</span>
                <div class="page__afterservice-item-body">
                  <h3 class="page__afterservice-item-title">Компьютерная диагностика</h3>
                  <p class="page__afterservice-item-text">Чтение и сброс ошибок, проверка всех систем профильным оборудованием</p>
                </div>
              </div>
              <div class="page__afterservice-item">
                <span class="page__afterservice-item-icon material-symbols-outlined" aria-hidden="true">handshake</span>
                <div class="page__afterservice-item-body">
                  <h3 class="page__afterservice-item-title">Только для наших клиентов</h3>
                  <p class="page__afterservice-item-text">Приоритетная запись и честные цены — для тех, кто покупал автомобиль через нас</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="page__section page__section--why">
      <h2 class="page__why-headline">Почему выбирают Автоподбор 62</h2>
      <p class="page__why-intro">Мы работаем так, чтобы вы получили честный автомобиль по адекватной цене — без сюрпризов после покупки.</p>
      <div class="page__why-cards">
        <div class="page__why-card">
          <span class="page__why-card-num" aria-hidden="true">1</span>
          <div class="page__why-card-body">
            <h3 class="page__why-card-title">Реальный рынок</h3>
            <p class="page__why-card-text">Работаем с живыми объявлениями и реальными продавцами. Никаких «виртуальных» машин и завышенных ожиданий — только то, что можно осмотреть и купить.</p>
          </div>
        </div>
        <!-- <div class="page__why-card">
          <span class="page__why-card-num" aria-hidden="true">2</span>
          <div class="page__why-card-body">
            <h3 class="page__why-card-title">Честность без прикрас</h3>
            <p class="page__why-card-text">Если машина не тянет на ваши деньги или есть скрытые дефекты — скажем прямо. Не продаём кота в мешке и не навязываем сомнительные варианты.</p>
          </div>
        </div> -->
        <div class="page__why-card">
          <span class="page__why-card-num" aria-hidden="true">2</span>
          <div class="page__why-card-body">
            <h3 class="page__why-card-title">Экономим деньги и время</h3>
            <p class="page__why-card-text">Отсекаем риски до сделки: проверяем юрчистоту, техсостояние, историю. Вы не платите за чужие проблемы и не теряете время на «пустые» поездки.</p>
          </div>
        </div>
        <div class="page__why-card">
          <span class="page__why-card-num" aria-hidden="true">3</span>
          <div class="page__why-card-body">
            <h3 class="page__why-card-title">Ответственность за результат</h3>
            <p class="page__why-card-text">Берём на себя осмотр, подробный отчёт и чёткую рекомендацию. Итог — ваша уверенность в выборе и понимание, за что платите.</p>
          </div>
        </div>
        <div class="page__why-card">
          <span class="page__why-card-num" aria-hidden="true">4</span>
          <div class="page__why-card-body">
            <h3 class="page__why-card-title">Опыт и репутация</h3>
            <p class="page__why-card-text">Более 10 лет в автоподборе, 500+ проверенных автомобилей, рейтинг 5.0 на Авито. Работаем так, чтобы клиенты возвращались и советовали нас друзьям.</p>
          </div>
        </div>
        <div class="page__why-card">
          <span class="page__why-card-num" aria-hidden="true">5</span>
          <div class="page__why-card-body">
            <h3 class="page__why-card-title">Поддержка после покупки</h3>
            <p class="page__why-card-text">Собственный автосервис для наших клиентов: приоритетная запись, честные цены, знаем историю вашего авто. Купили у нас — остаётесь под нашей заботой.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="team" class="page__section page__section--team">
      <p class="page__team-label">Наша команда</p>
      <h2 class="page__team-title">Люди, которым вы доверяете свой выбор</h2>

      <div class="page__team">
        <div class="page__team-member">
          <div class="page__team-avatar">
            <img :src="assetUrl('/images/team/vladimir.webp')" alt="Владимир" />
          </div>
          <div class="page__team-info">
            <h3 class="page__team-name">Владимир</h3>
            <p class="page__team-role">Технический эксперт</p>
            <p class="page__team-bio">РГАТУ им. Костычева, «Эксплуатация транспортно-технологических машин и комплексов», выпуск&nbsp;2016. С&nbsp;автомобилями с&nbsp;2014&nbsp;года.</p>
            <p class="page__team-since">В автоподборе с 2020 года</p>
          </div>
        </div>

        <div class="page__team-member">
          <div class="page__team-avatar">
            <img :src="assetUrl('/images/team/dmitry.webp')" alt="Дмитрий" />
          </div>
          <div class="page__team-info">
            <h3 class="page__team-name">Дмитрий</h3>
            <p class="page__team-role">Руководитель, технический эксперт</p>
            <p class="page__team-bio">РГАТУ им. Костычева, «Сервис транспортных и технологических машин и оборудования», выпуск&nbsp;2011. С&nbsp;автомобилями с&nbsp;2007&nbsp;года.</p>
            <p class="page__team-since">В автоподборе с 2014 года</p>
          </div>
        </div>

        <div class="page__team-member">
          <div class="page__team-avatar">
            <img :src="assetUrl('/images/team/ivan.webp')" alt="Иван Ермаков" />
          </div>
          <div class="page__team-info">
            <h3 class="page__team-name">Иван Ермаков</h3>
            <p class="page__team-role">Аналитик автомобильного рынка, эксперт направления импорта, юридический консультант</p>
            <p class="page__team-bio">РГУ им. С.А. Есенина, юридический факультет, уголовно-правовой профиль, выпуск&nbsp;2020. С&nbsp;техникой с&nbsp;2020&nbsp;года.</p>
            <p class="page__team-since">В автоподборе с 2022 года</p>
          </div>
        </div>
      </div>
    </section>

    <section id="reviews" class="page__section">
      <h2 class="page__section-title">Отзывы клиентов</h2>
      <p class="page__section-text">
        Реальные отзывы о нашей работе по автоподбору и проверке автомобилей
      </p>

      <div class="page__reviews">
        <article
          v-for="review in reviews"
          :key="review.id"
          class="page__review"
        >
          <header class="page__review-header">
            <img
              :src="review.avatar['64x64'] || review.avatar['100x100']"
              :alt="review.title"
              class="page__review-avatar"
              width="48"
              height="48"
            >
            <div class="page__review-meta">
              <div class="page__review-name">{{ review.title }}</div>
              <div class="page__review-date">{{ review.rated }}</div>
              <div class="page__review-stars" :aria-label="`Оценка: ${review.score} из 5`">
                <span
                  v-for="n in 5"
                  :key="n"
                  class="page__review-star"
                  :class="{ 'page__review-star--filled': n <= review.score }"
                >★</span>
              </div>
            </div>
          </header>
          <div class="page__review-item">{{ review.itemTitle }}</div>
          <div class="page__review-text">
            <p
              v-for="(section, idx) in review.textSections"
              :key="idx"
              class="page__review-paragraph"
            >
              {{ section.text }}
            </p>
          </div>
          <div v-if="review.images?.length" class="page__review-images">
            <a
              v-for="(img, imgIdx) in review.images"
              :key="imgIdx"
              :href="img['1280x960'] || img['640x480']"
              target="_blank"
              rel="noopener"
              class="page__review-image-link"
            >
              <img
                :src="img['180x135'] || img['256x192'] || img['640x480']"
                :alt="`Фото отзыва ${imgIdx + 1}`"
                class="page__review-image"
                loading="lazy"
              >
            </a>
          </div>
          <div v-if="review.answer" class="page__review-answer">
            <div class="page__review-answer-header">
              <img
                v-if="review.answer.avatar"
                :src="review.answer.avatar['64x64'] || review.answer.avatar['96x96']"
                :alt="review.answer.title"
                class="page__review-answer-avatar"
                width="32"
                height="32"
              >
              <div class="page__review-answer-meta">
                <span class="page__review-answer-title">{{ review.answer.title }}</span>
                <span class="page__review-answer-date">{{ review.answer.answered }}</span>
              </div>
            </div>
            <p class="page__review-answer-text">{{ review.answer.text }}</p>
            <div v-if="review.answer.images?.length" class="page__review-images">
              <a
                v-for="(img, imgIdx) in review.answer.images"
                :key="'ans-' + imgIdx"
                :href="img['1280x960'] || img['640x480']"
                target="_blank"
                rel="noopener"
                class="page__review-image-link"
              >
                <img
                  :src="img['180x135'] || img['432x324'] || img['256x192'] || img['640x480']"
                  :alt="`Фото ответа ${imgIdx + 1}`"
                  class="page__review-image"
                  loading="lazy"
                >
              </a>
            </div>
          </div>
        </article>
      </div>
      <div class="page__reviews-more">
        <a
          href="https://www.avito.ru/brands/i17034625#open-reviews-list"
          target="_blank"
          rel="noopener noreferrer"
          class="page__reviews-more-btn"
        >
          Больше отзывов на Авито
        </a>
      </div>
    </section>

    <section id="faq" class="page__section page__section--alt">
      <h2 class="page__section-title">FAQ — часто задаваемые вопросы</h2>
      
      <div class="page__faq">
        <ClientOnly>
          <el-collapse>
          <!-- <el-collapse-item name="1">
            <template #title>
                Что такое Автоподбор62 и чем мы отличаемся от обычного осмотра автомобиля в автосервисе?
            </template>
              Автоподбор62 — это полный комплекс работ: от анализа бюджета клиента и ситуации на автомобильном рынке до поиска автомобиля, объемного комплекса проверок, его покупки, регистрации в ГИБДД и дальнейшего обслуживания нашими силами.<br><br>
              Мы не просто осматриваем авто, а ищем лучший вариант на рынке, проверяем его историю, юридически и технически, сопровождаем сделку и берём ответственность за результат. В рамках подбора под ключ по РФ и другим странам так же регистрируем автомобиль в ГИБДД на имя нового владельца.
          </el-collapse-item>

          <el-collapse-item name="2">
            <template #title>
                Какие автомобили вы подбираете?
            </template>
              Мы подбираем как новые, так и подержанные автомобили, которые соответствуют своему бюджету и состоянию:<br><br>
              • без юридических проблем,<br>
              • без серьёзных ДТП,<br>
              • с небольшим пробегом и прозрачной историей,<br>
              • без скрытых вложений.<br><br>
              Если автомобиль не стоит своих денег — мы прямо об этом говорим.
          </el-collapse-item> -->

          <el-collapse-item name="3">
            <template #title>
                Сколько времени занимает подбор автомобиля?
            </template>
              Стандартный срок подбора — от 2 до 60 дней. Если требуется оперативность, доступна услуга Экспресс-подбора — до 10 дней с предложением до 3 лучших вариантов на рынке.
          </el-collapse-item>

          <el-collapse-item name="4">
            <template #title>
                Что если я уже нашёл автомобиль сам?
            </template>
              В этом случае мы проведём разовую проверку автомобиля:<br><br>
              <strong>1️⃣</strong> Общий осмотр автомобиля<br>
              <strong>2️⃣</strong> Проверка документов, маркировочных обозначений и основных моментов его истории<br>
              <strong>3️⃣</strong> Проверка силовой конструкции кузова, точек крепления навесных элементов<br>
              <strong>4️⃣</strong> Проверка состояния, датировок выпуска и работоспособности системы освещения, оригинальность, работоспособность электроприводов и обогревов остекления кузова<br>
              <strong>5️⃣</strong> Фиксация основных повреждений и недостатков на кузове автомобиля<br>
              <strong>6️⃣</strong> Замер толщины ЛКП внешних элементов, силовой конструкции и проемов кузова<br>
              <strong>7️⃣</strong> Проверка системы безопасности и общий осмотр салона автомобиля<br>
              <strong>8️⃣</strong> Проверка шин, дисков, элементов тормозной системы<br>
              <strong>9️⃣</strong> Общий проверка технической части: наличие следов проведения ремонтных работ, уровень и состояние технических жидкостей, выявление течей, посторонних звуков, визуальный осмотр элементов ходовой части, проведение пробной поездки и т.д.<br>
              <strong>🔟</strong> Компьютерная диагностика преимущественно профильным оборудованием: проверка показаний пробега, чтение ошибок, анализ доступных рабочих параметров по отдельным системам<br><br>
              По результатам проверки формируется полный отчет, включающий в себя не менее 150 фото- и видеофайлов и краткое заключение - комментарий эксперта.<br><br>
              Такой комплекс позволит максимально снизить риск при покупке автомобиля.
          </el-collapse-item>

          <el-collapse-item name="5">
            <template #title>
                Даёте ли вы какие-то гарантии?
            </template>
              Да.<br><br>
              • гарантия юридической чистоты,<br>
              • гарантия актуальности информации о состоянии авто,<br>
              • гарантия выкупа подобранного автомобиля в течение 90 дней.
          </el-collapse-item>

          <el-collapse-item name="6">
            <template #title>
                Почему требуется предоплата?
            </template>
              Предоплата — это оплата нашей работы по поиску, аналитике и организации проверок автомобилей.<br><br>
              Она гарантирует вовлечённость обеих сторон и компенсирует расходы в случае, если клиент решает прекратить подбор.
          </el-collapse-item>

          <el-collapse-item name="7">
            <template #title>
                Вы помогаете с регистрацией автомобиля в ГИБДД?
            </template>
              Да. Мы можем полностью взять регистрацию на себя:<br><br>
              • подача документов,<br>
              • осмотр,<br>
              • получение номеров.<br><br>
              Вы экономите время и получаете готовый результат.<br><br>
              В рамках подбора под ключ по РФ и импорта автомобилей из других стран регистрация в ГИБДД входит в стоимость услуги.
          </el-collapse-item>

          <el-collapse-item name="8">
            <template #title>
                Сколько стоят ваши услуги?
            </template>
              Стоимость зависит от ценовой категории автомобиля и выбранной услуги.<br><br>
              Цены прозрачные и фиксируются заранее — без скрытых доплат. Точную стоимость мы всегда озвучиваем до начала работ.
          </el-collapse-item>
        </el-collapse>
      </ClientOnly>
      </div>
    </section>

    <section class="page__section page__section--cta-bottom">
      <div class="page__cta-bottom">
        <div class="page__cta-bottom-left">
          <p class="page__cta-bottom-label">Бесплатная консультация</p>
          <h2 class="page__cta-bottom-title">Уже присматриваете авто? Не рискуйте — позвоните нам первыми</h2>
          <p class="page__cta-bottom-sub">Расскажем, на что смотреть, какие варианты реально стоят своих денег, и сразу назовём стоимость проверки.</p>
          <div class="page__cta-bottom-stats">
            <div class="page__cta-bottom-stat">
              <span class="page__cta-bottom-stat-num">10+</span>
              <span class="page__cta-bottom-stat-text">лет в автоподборе</span>
            </div>
            <div class="page__cta-bottom-stat">
              <span class="page__cta-bottom-stat-num">500+</span>
              <span class="page__cta-bottom-stat-text">проверенных авто</span>
            </div>
            <div class="page__cta-bottom-stat">
              <span class="page__cta-bottom-stat-num">5.0</span>
              <span class="page__cta-bottom-stat-text">рейтинг на Авито</span>
            </div>
          </div>
        </div>

        <div class="page__cta-bottom-right">
          <form class="page__cta-bottom-form" @submit.prevent="submitCtaLead">
            <p class="page__cta-bottom-form-title">Оставьте заявку — перезвоним в течение 15 минут</p>
            <div class="page__cta-bottom-form-fields">
              <input type="text" class="page__cta-bottom-input" name="name" placeholder="Ваше имя" autocomplete="name" />
              <input type="tel" class="page__cta-bottom-input" name="phone" placeholder="+7 (___) ___-__-__" autocomplete="tel" @input="handlePhoneInput" @keydown="handlePhoneKeydown" />
            </div>
            <button type="submit" class="page__cta-bottom-btn" :disabled="ctaLeadStatus === 'sending'">
              {{ ctaLeadStatus === 'sending' ? 'Отправляем…' : 'Хочу бесплатную консультацию' }}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <p v-if="ctaLeadStatus === 'sent'" class="page__form-hint page__form-hint--light">Заявка отправлена. Перезвоним в ближайшее время.</p>
            <p v-else-if="ctaLeadStatus === 'error'" class="page__form-hint page__form-hint--light page__form-hint--error">Не удалось отправить заявку. {{ ctaLeadError }}</p>
            <p class="page__cta-bottom-guarantee">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
              Без спама. Не передаём данные третьим лицам.
            </p>
          </form>
        </div>
      </div>
    </section>

  </div>

  <a :href="SITE_PHONE_HREF" class="page__fixed-call">
    <span class="page__fixed-call-icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.5 11.5 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.5 11.5 0 0 0 .57 3.6 1 1 0 0 1-.25 1.02l-2.2 2.17z"/>
      </svg>
    </span>
    <span class="page__fixed-call-body">
      <span class="page__fixed-call-label">Позвоните нам</span>
      <span class="page__fixed-call-number">{{ SITE_PHONE_DISPLAY }}</span>
    </span>
  </a>

  <button
    type="button"
    class="page__scroll-top"
    :class="{ 'page__scroll-top--visible': showScrollTop }"
    aria-label="Наверх"
    @click="scrollToTop"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M18 15l-6-6-6 6"/>
    </svg>
  </button>
</template>

<style scoped lang="scss">
.page {
  display: flex;
  flex-direction: column;
  background: var(--color-bg);

  &__hero {
    min-height: 90vh;
    display: flex;
    align-items: stretch;
    justify-content: center;
    padding: 0 40px;
    background-image: none;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    @media (max-width: 1024px) {
      padding: 0 24px;
    }

    @media (max-width: 720px) {
      padding: 0 20px;
    }
  }

  &__hero-inner {
    width: 100%;
    max-width: 80%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 64px;
    padding: 120px 0 0px;

    @media (max-width: 960px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 48px;
      padding: 100px 0 48px;
      max-width: 100%;
    }

    @media (max-width: 720px) {
      padding: 80px 0 40px;
      gap: 36px;
    }
  }

  &__hero-left {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
    gap: 36px;
  }

  &__hero-stats {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: 180px;
    margin-left: auto;
    padding-left: 64px;

    @media (max-width: 960px) {
      flex-direction: row;
      width: 100%;
      margin-left: 0;
      padding-left: 0;
      border-left: none;
    }
  }

  &__hero-stat {
    display: flex;
    flex-direction: column;
    padding: 20px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);

    &:first-child {
      border-top: 1px solid rgba(255, 255, 255, 0.15);
    }

    @media (max-width: 960px) {
      flex: 1;
      padding: 0 24px;
      border-bottom: none;
      border-top: none;
      border-left: 1px solid rgba(255, 255, 255, 0.15);

      &:first-child {
        border-left: none;
        padding-left: 0;
      }
    }
  }

  &__hero-stat-num {
    font-size: 36px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.03em;
    line-height: 1;
    margin-bottom: 5px;

    @media (max-width: 960px) {
      font-size: 28px;
    }
  }

  &__hero-stat-label {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.4;
  }

  &__content {
    max-width: 680px;
  }

  &__title {
    font-family: var(--font-body);
    color: #fff;
    font-size: clamp(32px, 5vw, 42px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin: 0 0 20px 0;
    text-shadow: 0 2px 24px rgba(0, 0, 0, 0.4);
  }

  &__title::after {
    content: '';
    display: block;
    width: 60px;
    height: 4px;
    background: var(--color-accent);
    margin: 20px 0 0;
    border-radius: 2px;
  }

  &__text {
    color: rgba(255, 255, 255, 0.9);
    font-size: 16px;
    font-weight: 500;
    line-height: 1.6;
    margin: 0;
    text-shadow: 0 1px 12px rgba(0, 0, 0, 0.3);
  }

  &__hero-cta {
    max-width: 560px;
    width: 100%;
  }

  &__hero-cta-badge {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
    padding: 8px 16px 8px 14px;
    background: rgba(249, 115, 22, 0.15);
    border: 1px solid rgba(249, 115, 22, 0.35);
    border-radius: 999px;
    font-size: 13px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.4;
    text-align: left;

    @media (max-width: 520px) {
      font-size: 12px;
    }
  }

  &__hero-cta-badge-dot {
    flex-shrink: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.3);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.3); }
    50% { box-shadow: 0 0 0 6px rgba(249, 115, 22, 0.12); }
  }

  &__hero-form {
    display: flex;
    gap: 10px;
    max-width: 100%;
    flex-wrap: wrap;

    @media (max-width: 600px) {
      flex-direction: column;
      gap: 10px;
    }
  }

  &__hero-form-input {
    flex: 1;
    min-width: 0;
    padding: 15px 18px;
    font-size: 16px;
    font-family: inherit;
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    transition: border-color 0.2s ease, background 0.2s ease;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.15);

    &::placeholder {
      color: rgba(255, 255, 255, 0.45);
    }

    &:focus {
      outline: none;
      border-color: rgba(249, 115, 22, 0.7);
      background: rgba(255, 255, 255, 0.14);
    }

    @media (max-width: 600px) {
      padding: 14px 16px;
    }
  }

  &__hero-form-btn {
    flex-shrink: 0;
    padding: 15px 24px;
    font-size: 16px;
    font-weight: 700;
    font-family: inherit;
    color: #fff;
    background: var(--color-accent);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    box-shadow: 0 4px 16px rgba(249, 115, 22, 0.4);

    &:hover {
      background: var(--color-accent-hover);
      box-shadow: 0 6px 24px rgba(249, 115, 22, 0.5);
      transform: translateY(-2px);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.72;
      transform: none;
    }

    @media (max-width: 600px) {
      padding: 14px 20px;
      width: 100%;
    }
  }

  &__section {
    width: 100%;
    margin: 0 auto;
    text-align: center;
    padding: 80px 24px;
    background-color: var(--color-surface);

    @media (max-width: 720px) {
      padding: 56px 20px;
    }

    &--alt {
      background-color: var(--color-bg-alt);
    }

    &--contact {
      background-color: var(--color-bg);
    }
  }

  &__section-title {
    font-family: var(--font-body);
    color: var(--color-dark);
    font-size: clamp(26px, 4vw, 40px);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0 0 12px 0;
    line-height: 1.2;
  }

  &__section-title::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: var(--color-accent);
    margin: 12px auto 0;
    border-radius: 2px;
  }

  &__section-text {
    color: var(--color-text-muted);
    font-size: 16px;
    line-height: 1.65;
    margin: 0 auto 40px;
    max-width: 600px;
  }

  &__section--services {
    background: var(--color-bg-alt);
    padding-left: 40px;
    padding-right: 40px;

    @media (max-width: 1024px) {
      padding-left: 24px;
      padding-right: 24px;
    }

    @media (max-width: 720px) {
      padding-left: 16px;
      padding-right: 16px;
    }
  }

  &__svc-wrap {
    max-width: 1100px;
    margin: 0 auto;
  }

  &__svc-tabs {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 20px;
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: 2px;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__svc-tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 14px 16px;
    flex: 1;
    background: var(--color-surface);
    border: 1.5px solid var(--color-border);
    border-radius: 14px;
    cursor: pointer;
    flex-shrink: 0;
    transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
    font-family: inherit;

    @media (max-width: 860px) {
      width: 150px;
      flex: none;
    }

    &--active {
      background: var(--color-dark);
      border-color: var(--color-dark);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18);

      .page__svc-tab-icon {
        color: var(--color-accent);
      }

      .page__svc-tab-label {
        color: #fff;
      }
    }

    &:not(&--active):hover {
      border-color: var(--color-accent);
      background: var(--color-accent-bg);
    }
  }

  &__svc-tab-icon {
    font-family: 'Material Symbols Outlined', sans-serif;
    font-size: 22px;
    font-weight: normal;
    line-height: 1;
    color: var(--color-text-muted);
    transition: color 0.2s ease;
  }

  &__svc-tab-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--color-text-muted);
    line-height: 1.3;
    text-align: center;
    word-break: break-word;
    overflow-wrap: break-word;
    transition: color 0.2s ease;
  }

  &__svc-panel {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    background: var(--color-dark);
    border-radius: 24px;
    padding: 48px;
    align-items: center;

    @media (max-width: 860px) {
      grid-template-columns: 1fr;
      gap: 36px;
      padding: 36px 32px;
    }

    @media (max-width: 520px) {
      padding: 28px 20px;
    }
  }

  &__svc-panel-index {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-accent);
    margin: 0 0 12px;
  }

  &__svc-panel-title {
    font-size: clamp(22px, 3vw, 30px);
    font-weight: 800;
    color: #fff;
    line-height: 1.25;
    letter-spacing: -0.02em;
    margin: 0 0 16px;
  }

  &__svc-panel-desc {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.65;
    margin: 0 0 32px;
  }

  &__svc-panel-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    background: var(--color-accent);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    font-family: inherit;
    text-decoration: none;
    border-radius: 10px;
    transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 4px 20px rgba(249, 115, 22, 0.4);

    svg {
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }

    &:hover {
      background: var(--color-accent-hover);
      transform: translateY(-2px);
      box-shadow: 0 6px 28px rgba(249, 115, 22, 0.5);

      svg {
        transform: translateX(4px);
      }
    }
  }

  &__svc-features {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;

    @media (max-width: 520px) {
      grid-template-columns: 1fr;
      gap: 10px;
    }
  }

  &__svc-feature {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    padding: 18px 16px;
    transition: background 0.2s ease, border-color 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(249, 115, 22, 0.4);
    }
  }

  &__svc-feature-icon {
    font-family: 'Material Symbols Outlined', sans-serif;
    font-size: 20px;
    font-weight: normal;
    line-height: 1;
    color: var(--color-accent);
    flex-shrink: 0;
    margin-top: 1px;
  }

  &__svc-feature-text {
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.5;
    text-align: left;
  }

  &__cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 40px;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__card {
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    padding: 28px 24px;
    text-align: left;
    border: 2px solid var(--color-border);
    border-left: 4px solid var(--color-accent);
    box-shadow: var(--shadow-sm);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    width: 100%;

    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
      border-left-color: var(--color-accent-hover);
    }
  }

  &__card-title {
    font-family: var(--font-body);
    color: var(--color-dark);
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 12px;
  }

  &__card-text {
    color: var(--color-text);
    font-size: 16px;
    line-height: 1.65;
    flex: 1;
  }

  &__card-list {
    color: var(--color-text);
    font-size: 16px;
    line-height: 1.9;
    margin: 12px 0 0 0;
    padding-left: 20px;
    flex: 1;

    li {
      margin-bottom: 6px;
    }
  }

  &__result {
    background: var(--color-accent-bg);
    border-radius: var(--radius-lg);
    padding: 28px 32px;
    color: var(--color-text);
    font-size: 17px;
    line-height: 1.65;
    border: 2px solid transparent;
    border-left: 4px solid var(--color-accent);
    box-shadow: var(--shadow-sm);

    strong {
      font-weight: 700;
      color: var(--color-dark);
    }

    &--key {
      text-align: center;
    }
  }

  &__section--key {
    padding: 80px 24px;

    @media (max-width: 720px) {
      padding: 56px 20px;
    }
    background: var(--color-dark);
    color: #fff;
    text-align: left;
  }

  &__section--key-twin {
    padding: 80px 24px;

    @media (max-width: 720px) {
      padding: 56px 20px;
    }
  }

  &__key-twin-lead {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: rgba(255, 255, 255, 0.45);
    text-align: center;
    margin: 0 0 40px 0;
  }

  &__key-twin {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 0 48px;
    max-width: 1240px;
    margin: 0 auto;
    align-items: stretch;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto;
      gap: 0;
    }
  }

  &__key-panel {
    padding: 0 16px;

    @media (max-width: 900px) {
      padding: 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 40px;
      margin-bottom: 40px;

      &:last-of-type {
        border-bottom: none;
        padding-bottom: 0;
        margin-bottom: 0;
      }
    }
  }

  &__key-twin-divider {
    width: 1px;
    background: rgba(255, 255, 255, 0.1);
    position: relative;
    min-height: 200px;

    @media (max-width: 900px) {
      width: 100%;
      min-height: 0;
      height: 1px;
      margin: 0 0 32px 0;
    }
  }

  &__key-twin-or {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #fff;
    background: var(--color-accent);
    box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.25);
    white-space: nowrap;

    @media (max-width: 900px) {
      width: 52px;
      height: 52px;
      font-size: 12px;
    }
  }

  &__key-wrap {
    max-width: 720px;
    margin: 0 auto;
  }

  &__section--key-twin &__key-wrap {
    max-width: 100%;
  }

  &__key-lead {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-accent);
    margin: 0 0 12px 0;
  }

  &__key-title {
    font-size: clamp(26px, 4vw, 34px);
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.02em;
    color: #fff;
    margin: 0 0 40px 0;
  }

  &__key-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  &__key-item {
    display: grid;
    grid-template-columns: 48px 1fr;
    gap: 16px;
    align-items: start;
    padding-bottom: 28px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);

    &:last-child {
      padding-bottom: 0;
      border-bottom: none;
    }
  }

  &__key-item-num {
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.02em;
  }

  &__key-item-body {
    font-size: 16px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.85);

    strong {
      color: #fff;
      font-weight: 600;
    }
  }

  &__key-outcome {
    margin: 40px 0 0 56px;
    font-size: 20px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.95);
    line-height: 1.5;
    padding-left: 0;
    border-left: 3px solid var(--color-accent);
    padding-left: 20px;

    @media (max-width: 600px) {
      margin-left: 0;
      font-size: 18px;
    }
  }

  &__key-link {
    display: inline-block;
    margin-top: 20px;
    margin-left: 56px;
    font-size: 16px;
    font-weight: 600;
    color: var(--color-accent);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: #fff;
    }

    @media (max-width: 600px) {
      margin-left: 0;
    }
  }

  &__section--sell {
    padding: 80px 24px;
    background: var(--color-bg-alt);

    @media (max-width: 720px) {
      padding: 56px 20px;
    }
  }

  &__sell-wrap {
    max-width: 920px;
    margin: 0 auto;
  }

  &__sell-header {
    text-align: center;
    margin-bottom: 48px;

    @media (max-width: 720px) {
      margin-bottom: 32px;
    }
  }

  &__sell-label {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--color-accent);
    margin: 0 0 10px;
  }

  &__sell-title {
    font-size: clamp(24px, 3.5vw, 34px);
    font-weight: 800;
    color: var(--color-dark);
    letter-spacing: -0.02em;
    margin: 0 0 12px;
    line-height: 1.2;
  }

  &__sell-lead {
    font-size: 16px;
    color: var(--color-text-muted);
    line-height: 1.5;
    margin: 0;
  }

  &__sell-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  &__sell-option {
    border-radius: 20px;
    padding: 36px;
    display: flex;
    flex-direction: column;

    @media (max-width: 480px) {
      padding: 28px 24px;
    }

    &--dark {
      background: var(--color-dark);
    }

    &--light {
      background: var(--color-surface, #fff);
      border: 1.5px solid var(--color-border);
    }
  }

  &__sell-option-badge {
    display: inline-flex;
    align-self: flex-start;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    padding: 5px 12px;
    border-radius: 100px;
    margin-bottom: 20px;

    .page__sell-option--dark & {
      background: rgba(255, 255, 255, 0.12);
      color: rgba(255, 255, 255, 0.8);
    }

    .page__sell-option--light & {
      background: var(--color-accent-bg);
      color: var(--color-accent);
    }
  }

  &__sell-option-title {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0 0 10px;
    line-height: 1.2;

    .page__sell-option--dark & {
      color: #fff;
    }

    .page__sell-option--light & {
      color: var(--color-dark);
    }
  }

  &__sell-option-desc {
    font-size: 16px;
    line-height: 1.6;
    margin: 0 0 24px;

    .page__sell-option--dark & {
      color: rgba(255, 255, 255, 0.6);
    }

    .page__sell-option--light & {
      color: var(--color-text-muted);
    }
  }

  &__sell-option-list {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 16px;
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    gap: 10px;

    li {
      display: flex;
      align-items: flex-start;
      gap: 10px;

      &::before {
        content: '✓';
        flex-shrink: 0;
        font-weight: 700;
        font-size: 13px;
        margin-top: 2px;
        color: var(--color-accent);
      }
    }

    .page__sell-option--dark & li {
      color: rgba(255, 255, 255, 0.85);
    }

    .page__sell-option--light & li {
      color: var(--color-text);
    }
  }

  &__features {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    max-width: 900px;
    margin: 0 auto;
  }

  &__feature {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    background: var(--color-surface);
    border-radius: var(--radius);
    padding: 24px;
    border-left: 4px solid var(--color-accent);
    box-shadow: var(--shadow-sm);
    text-align: left;
    transition: transform 0.25s ease, box-shadow 0.25s ease;

    &:hover {
      transform: translateX(4px);
      box-shadow: var(--shadow-md);
    }
  }

  &__feature-icon {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    background: var(--color-accent);
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 18px;
  }

  &__feature-text {
    color: var(--color-text);
    font-size: 16px;
    line-height: 1.55;
    flex: 1;
  }

  &__section--korea {
    padding: 0;
    background: var(--color-dark);
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 560px;
    overflow: hidden;
    border-radius: 24px 24px 0 0;

    @media (max-width: 860px) {
      grid-template-columns: 1fr;
    }
  }

  &__korea-image {
    position: relative;
    min-height: 360px;
    overflow: hidden;

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      transition: transform 0.5s ease;
    }

    &:hover img {
      transform: scale(1.04);
    }
  }

  &__korea-image-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 60%, rgba(0, 0, 0, 0.5) 100%);
    pointer-events: none;

    @media (max-width: 860px) {
      background: linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.5) 100%);
    }
  }

  &__korea-content {
    padding: 80px 56px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0;

    @media (max-width: 860px) {
      padding: 56px 24px 64px;
    }
  }

  &__korea-label {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-accent);
    margin: 0 0 12px;
  }

  &__korea-title {
    font-size: clamp(22px, 3vw, 30px);
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 16px;
  }

  &__korea-text {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.65;
    margin: 0 0 24px;
  }

  &__korea-blocks {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin: 0;
  }

  &__korea-block {
    --glow: #f97316;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 18px 22px;
    border-radius: 14px;
    background:
      linear-gradient(rgba(18, 18, 18, 0.95), rgba(18, 18, 18, 0.95)) padding-box,
      linear-gradient(135deg, var(--glow), rgba(255, 255, 255, 0.06) 70%) border-box;
    border: 1px solid transparent;
    transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;

    &:nth-child(2) { --glow: #3b82f6; }
    &:nth-child(3) { --glow: #a855f7; }
    &:nth-child(4) { --glow: #10b981; }

    &::before,
    &::after {
      content: '';
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      transition: opacity 0.4s ease, transform 0.4s ease;
    }

    &::before {
      top: -24px;
      left: -24px;
      width: 90px;
      height: 90px;
      background: var(--glow);
      opacity: 0.1;
      filter: blur(32px);
    }

    &::after {
      bottom: -16px;
      right: -16px;
      width: 60px;
      height: 60px;
      background: var(--glow);
      opacity: 0.06;
      filter: blur(22px);
    }

    &:hover {
      transform: translateX(6px);
      box-shadow: 0 6px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05);
      background:
        linear-gradient(rgba(24, 24, 24, 0.98), rgba(24, 24, 24, 0.98)) padding-box,
        linear-gradient(135deg, var(--glow), rgba(255, 255, 255, 0.12) 70%) border-box;

      &::before {
        opacity: 0.25;
        transform: scale(1.4);
      }

      &::after {
        opacity: 0.15;
        transform: scale(1.3);
      }
    }
  }

  &__korea-block-icon {
    font-family: 'Material Symbols Outlined', sans-serif;
    font-size: 24px;
    font-weight: normal;
    color: var(--glow);
    flex-shrink: 0;
    line-height: 1;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: color-mix(in srgb, var(--glow) 15%, transparent);
    border: 1px solid color-mix(in srgb, var(--glow) 30%, transparent);
    transition: background 0.3s ease, border-color 0.3s ease;

    .page__korea-block:hover & {
      background: color-mix(in srgb, var(--glow) 25%, transparent);
      border-color: color-mix(in srgb, var(--glow) 50%, transparent);
    }
  }

  &__korea-block-text {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    line-height: 1.4;
  }

  &__section--afterservice {
    padding: 80px 24px;
    background: var(--color-dark);

    @media (max-width: 720px) {
      padding: 56px 20px;
    }
  }

  &__afterservice-wrap {
    max-width: 1200px;
    margin: 0 auto;
  }

  &__afterservice-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      gap: 48px;
    }
  }

  &__afterservice-left {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  &__afterservice-label {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-accent);
    margin: 0 0 12px;
  }

  &__afterservice-title {
    font-size: clamp(26px, 3.5vw, 38px);
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 24px;
  }

  &__afterservice-text {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.7;
    margin: 0 0 16px;

    &:last-of-type {
      margin-bottom: 36px;
    }
  }

  &__afterservice-btn {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    padding: 15px 32px;
    background: var(--color-accent);
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    text-decoration: none;
    border-radius: 10px;
    transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 4px 20px rgba(249, 115, 22, 0.45);

    &:hover {
      background: var(--color-accent-hover);
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(249, 115, 22, 0.55);
    }
  }

  &__afterservice-right {
    display: flex;
    flex-direction: column;
  }

  &__afterservice-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__afterservice-item {
    --glow: #f97316;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: flex-start;
    gap: 18px;
    padding: 22px 24px;
    border-radius: 16px;
    background:
      linear-gradient(rgba(18, 18, 18, 0.95), rgba(18, 18, 18, 0.95)) padding-box,
      linear-gradient(135deg, var(--glow), rgba(255, 255, 255, 0.06) 70%) border-box;
    border: 1px solid transparent;
    transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;

    &:nth-child(2) { --glow: #3b82f6; }
    &:nth-child(3) { --glow: #a855f7; }
    &:nth-child(4) { --glow: #10b981; }

    &::before,
    &::after {
      content: '';
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      transition: opacity 0.4s ease, transform 0.4s ease;
    }

    &::before {
      top: -30px;
      left: -30px;
      width: 110px;
      height: 110px;
      background: var(--glow);
      opacity: 0.12;
      filter: blur(40px);
    }

    &::after {
      bottom: -20px;
      right: -20px;
      width: 70px;
      height: 70px;
      background: var(--glow);
      opacity: 0.07;
      filter: blur(28px);
    }

    &:hover {
      transform: translateX(8px);
      box-shadow: 0 8px 40px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.06);
      background:
        linear-gradient(rgba(24, 24, 24, 0.98), rgba(24, 24, 24, 0.98)) padding-box,
        linear-gradient(135deg, var(--glow), rgba(255, 255, 255, 0.12) 70%) border-box;

      &::before {
        opacity: 0.28;
        transform: scale(1.5);
      }

      &::after {
        opacity: 0.18;
        transform: scale(1.4);
      }
    }
  }

  &__afterservice-item-icon {
    font-family: 'Material Symbols Outlined', sans-serif;
    font-size: 22px;
    font-weight: normal;
    color: var(--glow);
    flex-shrink: 0;
    line-height: 1;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: color-mix(in srgb, var(--glow) 15%, transparent);
    border: 1px solid color-mix(in srgb, var(--glow) 30%, transparent);
    transition: background 0.3s ease, border-color 0.3s ease;
    flex-shrink: 0;

    .page__afterservice-item:hover & {
      background: color-mix(in srgb, var(--glow) 25%, transparent);
    }
  }

  &__afterservice-item-body {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding-top: 2px;
  }

  &__afterservice-item-title {
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    line-height: 1.3;
    margin: 0;
  }

  &__afterservice-item-text {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.5);
    line-height: 1.55;
    margin: 0;
  }

  &__section--why {
    padding: 72px 24px;

    @media (max-width: 720px) {
      padding: 56px 20px;
    }
    background: var(--color-dark);
    color: #fff;
    text-align: center;
  }

  &__why-headline {
    font-size: clamp(22px, 3vw, 28px);
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.02em;
    margin: 0 0 12px 0;
    line-height: 1.3;
  }

  &__why-intro {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.75);
    line-height: 1.55;
    max-width: 560px;
    margin: 0 auto 36px;
  }

  &__why-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    max-width: 1000px;
    margin: 0 auto;
    text-align: left;

    @media (max-width: 660px) {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  &__why-card {
    display: flex;
    align-items: flex-start;
    gap: 18px;
    padding: 24px 22px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 16px;
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(249, 115, 22, 0.35);
      transform: translateY(-2px);
    }
  }

  &__why-card-num {
    font-size: 42px;
    font-weight: 800;
    line-height: 1;
    flex-shrink: 0;
    letter-spacing: -0.04em;
    background: linear-gradient(135deg, #f97316 0%, #fb923c 40%, #fbbf24 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    transition: filter 0.2s ease;

    .page__why-card:hover & {
      filter: brightness(1.1);
    }
  }

  &__why-card-body {
    min-width: 0;
  }

  &__why-card-title {
    font-size: 17px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 8px;
    line-height: 1.3;
  }

  &__why-card-text {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.55;
    margin: 0;
  }

  &__advantages {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 800px;
    margin: 0 auto;
  }

  &__advantage {
    display: flex;
    align-items: center;
    gap: 18px;
    background: var(--color-surface);
    border-radius: var(--radius);
    padding: 20px 26px;
    text-align: left;
    transition: all 0.25s ease;
    border: 2px solid var(--color-border);
    border-left: 4px solid var(--color-accent);
    box-shadow: var(--shadow-sm);

    &:hover {
      border-left-color: var(--color-accent-hover);
      box-shadow: var(--shadow-md);
      transform: translateX(6px);
    }
  }

  &__advantage-icon {
    flex-shrink: 0;
    font-size: 22px;
    color: var(--color-accent);
  }

  &__advantage-text {
    color: var(--color-text);
    font-size: 16px;
    line-height: 1.5;
    flex: 1;
  }

  &__section--team {
    padding: 80px 24px;
    border-radius: 0 0 24px 24px;

    @media (max-width: 720px) {
      padding: 56px 20px;
    }
    background: var(--color-dark);
    text-align: left;
  }

  &__team-label {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-accent);
    margin: 0 0 12px;
    text-align: center;
  }

  &__team-title {
    font-size: clamp(22px, 3.5vw, 30px);
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 48px;
    text-align: center;
  }

  &__team {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
    max-width: 1100px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    overflow: hidden;

    @media (max-width: 860px) {
      grid-template-columns: 1fr;
      gap: 2px;
    }
  }

  &__team-member {
    background: #1a1a1a;
    padding: 32px 28px;
    display: flex;
    flex-direction: column;
    gap: 0;
    transition: background 0.25s ease;

    &:hover {
      background: #222;
    }

    &:first-child {
      border-radius: 20px 0 0 20px;

      @media (max-width: 860px) {
        border-radius: 20px 20px 0 0;
      }
    }

    &:last-child {
      border-radius: 0 20px 20px 0;

      @media (max-width: 860px) {
        border-radius: 0 0 20px 20px;
      }
    }
  }

  &__team-avatar {
    width: 100%;
    height: 280px;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 20px;
    flex-shrink: 0;
    background: #2a2a2a;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
      transition: transform 0.4s ease;
    }
  }

  &__team-member:hover &__team-avatar img {
    transform: scale(1.03);
  }

  &__team-name {
    font-size: 20px;
    font-weight: 800;
    color: #fff;
    margin: 0 0 4px;
    letter-spacing: -0.01em;
  }

  &__team-role {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-accent);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 0 0 20px;
  }

  &__team-bio {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
    margin: 0 0 16px;
    flex: 1;
  }

  &__team-since {
    font-size: 13px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.4);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 16px;
    margin: 0;
  }

  &__reviews {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;

    @media (max-width: 1000px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  &__review {
    background: var(--color-surface);
    border: 2px solid var(--color-border);
    border-radius: var(--radius);
    padding: 20px;
    text-align: left;
    box-shadow: var(--shadow-sm);
    transition: box-shadow 0.25s ease, border-color 0.25s ease;
    display: flex;
    flex-direction: column;
    min-height: 0;

    &:hover {
      box-shadow: var(--shadow-md);
      border-color: var(--color-accent-soft);
    }
  }

  &__review-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  &__review-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  &__review-meta {
    flex: 1;
    min-width: 0;
  }

  &__review-name {
    font-weight: 600;
    font-size: 15px;
    color: var(--color-dark);
    margin-bottom: 2px;
  }

  &__review-date {
    font-size: 12px;
    color: var(--color-text-muted);
    margin-bottom: 4px;
  }

  &__review-stars {
    display: flex;
    gap: 1px;
    font-size: 14px;
  }

  &__review-star {
    color: var(--color-border-strong);

    &--filled {
      color: var(--color-accent);
    }
  }

  &__review-item {
    font-size: 12px;
    color: var(--color-accent);
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__review-text {
    color: var(--color-text);
    font-size: 13px;
    line-height: 1.55;
    margin-bottom: 12px;
    white-space: pre-line;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
    min-height: 0;
  }

  &__review-paragraph {
    margin: 0 0 0.35em 0;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__review-images {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__review-image-link {
    display: block;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--color-border);
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.02);
    }
  }

  &__review-image {
    display: block;
    width: 100px;
    height: 75px;
    object-fit: cover;
  }

  &__review-answer {
    margin-top: 14px;
    padding: 12px 14px;
    border-top: 1px solid var(--color-border);
    background: var(--color-bg-alt);
    border-radius: 8px;
    margin-left: -2px;
    margin-right: -2px;
    margin-bottom: -2px;
  }

  &__review-answer-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
  }

  &__review-answer-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  &__review-answer-meta {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  &__review-answer-title {
    font-weight: 600;
    font-size: 12px;
    color: var(--color-dark);
  }

  &__review-answer-date {
    font-size: 11px;
    color: var(--color-text-muted);
  }

  &__review-answer-text {
    color: var(--color-text);
    font-size: 12px;
    line-height: 1.5;
    margin: 0 0 8px 0;
    white-space: pre-line;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__reviews-more {
    text-align: center;
    margin-top: 32px;
  }

  &__reviews-more-btn {
    display: inline-block;
    padding: 18px 36px;
    background: var(--color-accent);
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    text-decoration: none;
    border-radius: 10px;
    transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    border: none;
    letter-spacing: 0.02em;
    box-shadow: 0 4px 16px rgba(249, 115, 22, 0.4);

    &:hover {
      background: var(--color-accent-hover);
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(249, 115, 22, 0.45);
    }
  }

  &__faq {
    max-width: 900px;
    margin: 0 auto;
    text-align: left;

    :deep(.el-collapse) {
      border: none;
    }

    :deep(.el-collapse-item) {
      margin-bottom: 16px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      overflow: hidden;
      background: var(--color-surface);
      box-shadow: var(--shadow-sm);
      transition: box-shadow 0.3s ease;

      &:hover {
        box-shadow: var(--shadow-md);
      }
    }

    :deep(.el-collapse-item__header) {
      padding: 22px 28px;
      background: var(--color-bg-alt);
      border: none;
      font-size: 16px;
      font-weight: 700;
      color: var(--color-dark);
      transition: background 0.2s ease;

      &:hover {
        background: var(--color-accent-bg);
      }

      &.is-active {
        background: var(--color-surface);
        border-bottom: 2px solid var(--color-accent);
      }
    }

    :deep(.el-collapse-item__wrap) {
      border: none;
    }

    :deep(.el-collapse-item__content) {
      padding: 28px;
      color: var(--color-text);
      font-size: 16px;
      line-height: 1.75;
    }

    :deep(.el-collapse-item__arrow) {
      color: var(--color-accent) !important;
      font-size: 18px;
    }
  }

  &__faq-question {
    color: var(--color-dark);
    font-weight: 600;
  }

  &__faq-answer {
    color: var(--color-text);
    line-height: 1.75;

    strong {
      color: var(--color-dark);
      font-weight: 600;
    }
  }

  &__faq-loading {
    text-align: center;
    padding: 40px;
    color: var(--color-text-muted);
    font-size: 16px;
  }

  &__section--cta-bottom {
    background: var(--color-dark);
    padding: 80px 24px;
    text-align: left;

    @media (max-width: 720px) {
      padding: 56px 20px;
    }
  }

  &__cta-bottom {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: center;

    @media (max-width: 860px) {
      grid-template-columns: 1fr;
      gap: 48px;
    }
  }

  &__cta-bottom-label {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--color-accent);
    margin: 0 0 16px;
  }

  &__cta-bottom-title {
    font-size: clamp(24px, 3.5vw, 36px);
    font-weight: 800;
    color: #fff;
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin: 0 0 20px;
  }

  &__cta-bottom-sub {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.65);
    line-height: 1.65;
    margin: 0 0 40px;
  }

  &__cta-bottom-stats {
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
  }

  &__cta-bottom-stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__cta-bottom-stat-num {
    font-size: 28px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  &__cta-bottom-stat-text {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    line-height: 1.3;
  }

  &__cta-bottom-right {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 36px;

    @media (max-width: 520px) {
      padding: 24px 20px;
    }
  }

  &__cta-bottom-form-title {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    line-height: 1.4;
    margin: 0 0 24px;
  }

  &__cta-bottom-form-fields {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }

  &__cta-bottom-input {
    width: 100%;
    padding: 15px 18px;
    font-size: 16px;
    font-family: inherit;
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    transition: border-color 0.2s ease, background 0.2s ease;

    &::placeholder {
      color: rgba(255, 255, 255, 0.35);
    }

    &:focus {
      outline: none;
      border-color: rgba(249, 115, 22, 0.6);
      background: rgba(255, 255, 255, 0.11);
    }
  }

  &__cta-bottom-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 18px 24px;
    font-size: 16px;
    font-weight: 700;
    font-family: inherit;
    color: #fff;
    background: var(--color-accent);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    box-shadow: 0 6px 24px rgba(249, 115, 22, 0.45);
    margin-bottom: 16px;

    svg {
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }

    &:hover {
      background: var(--color-accent-hover);
      box-shadow: 0 8px 32px rgba(249, 115, 22, 0.55);
      transform: translateY(-2px);

      svg {
        transform: translateX(4px);
      }
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.72;
      transform: none;

      svg {
        transform: none;
      }
    }
  }

  &__form-hint {
    margin: 10px 0 0;
    font-size: 14px;
    color: rgba(17, 17, 17, 0.8);
    text-align: left;
    flex-basis: 100%;
    width: 100%;
  }

  &__form-hint--light {
    color: rgba(255, 255, 255, 0.7);
  }

  &__form-hint--error {
    color: #b42318;
  }

  &__cta-bottom-guarantee {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    margin: 0;
    justify-content: center;

    svg {
      flex-shrink: 0;
      color: rgba(255, 255, 255, 0.4);
    }
  }

  &__contact-links {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 24px 32px;
    margin-top: 12px;
  }

  &__contact-phone {
    display: inline-block;
    font-size: clamp(22px, 3vw, 28px);
    font-weight: 700;
    color: var(--color-accent);
    text-decoration: none;
    letter-spacing: 0.02em;
    transition: color 0.2s ease;

    &:hover {
      color: var(--color-accent-hover);
    }
  }

  &__contact-telegram {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    background: #0088cc;
    text-decoration: none;
    border-radius: 10px;
    transition: background 0.2s ease, transform 0.2s ease;

    &:hover {
      background: #0077b5;
      transform: translateY(-2px);
    }
  }

  &__contact-telegram-icon {
    flex-shrink: 0;
  }
}

::v-deep {
  .el-collapse-item__title {
  line-height: 1.4;
}
}
</style>

<style lang="scss">
.page__fixed-call {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%) translateX(calc(100% - 52px));
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0;
  text-decoration: none;
  background: var(--color-accent, #f97316);
  color: #fff;
  border-radius: 12px 0 0 12px;
  box-shadow: -4px 4px 24px rgba(249, 115, 22, 0.4);
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  animation: callSlideAttention 4s ease-in-out 2s infinite;

  &:hover {
    transform: translateY(-50%) translateX(0);
    box-shadow: -6px 6px 32px rgba(249, 115, 22, 0.5);
    animation: none;
  }

  @media (max-width: 600px) {
    top: auto;
    bottom: 24px;
    right: 16px;
    transform: none;
    border-radius: 999px;
    padding: 0;
    animation: callPulseMobile 3s ease-in-out 2s infinite;

    &:hover {
      transform: translateY(-3px);
      animation: none;
    }
  }
}

@keyframes callSlideAttention {
  0%, 70%, 100% {
    transform: translateY(-50%) translateX(calc(100% - 52px));
    box-shadow: -4px 4px 24px rgba(249, 115, 22, 0.4);
  }
  80% {
    transform: translateY(-50%) translateX(calc(100% - 52px - 12px));
    box-shadow: -6px 4px 32px rgba(249, 115, 22, 0.55);
  }
  90% {
    transform: translateY(-50%) translateX(calc(100% - 52px - 6px));
  }
}

@keyframes callPulseMobile {
  0%, 100% {
    box-shadow: 0 4px 20px rgba(249, 115, 22, 0.4);
  }
  50% {
    box-shadow: 0 4px 32px rgba(249, 115, 22, 0.7), 0 0 0 8px rgba(249, 115, 22, 0.15);
  }
}

.page__fixed-call-icon {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.15);
  animation: callIconRing 4s ease-in-out 2s infinite;
}

@keyframes callIconRing {
  0%, 70%, 100% { transform: rotate(0deg); }
  72% { transform: rotate(-15deg); }
  76% { transform: rotate(15deg); }
  80% { transform: rotate(-10deg); }
  84% { transform: rotate(8deg); }
  88% { transform: rotate(0deg); }
}

.page__fixed-call-body {
  display: flex;
  flex-direction: column;
  padding: 10px 20px 10px 16px;
  white-space: nowrap;
  gap: 2px;

  @media (max-width: 600px) {
    display: none;
  }
}

.page__fixed-call-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.8);
  font-family: inherit;
}

.page__fixed-call-number {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.02em;
  font-family: inherit;
}

.page__scroll-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 999;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: var(--color-surface, #fff);
  color: var(--color-dark, #1a1a1a);
  border: 1px solid var(--color-border, #e5e5e5);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  transition: opacity 0.25s ease, visibility 0.25s ease, transform 0.25s ease, background 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background: var(--color-accent, #f97316);
    color: #fff;
    border-color: var(--color-accent, #f97316);
    box-shadow: 0 6px 24px rgba(249, 115, 22, 0.4);
  }

  &--visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  @media (max-width: 600px) {
    right: 16px;
    bottom: 90px;
    width: 44px;
    height: 44px;
  }
}
</style>
