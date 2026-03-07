<script setup lang="ts">
import { ElCollapse, ElCollapseItem } from 'element-plus'

const { app: { baseURL } } = useRuntimeConfig()
const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL

function assetUrl(path: string) {
  return `${base}${path}`
}

const phoneRaw = ref('')
const showScrollTop = ref(false)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onScroll() {
  showScrollTop.value = window.scrollY > 400
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

const services = [
  { headline: 'Автоподбор —', headlineItalic: 'под ключ', label: 'Наши услуги', title: 'Найдём лучший вариант', description: 'Поиск и проверка автомобиля с полным сопровождением сделки', image: assetUrl('/images/services/1.jpeg'), index: '01' },
  { headline: 'Разовая —', headlineItalic: 'проверка', label: 'Наши услуги', title: 'Проверим честно', description: 'Детальная диагностика автомобиля перед покупкой', image: assetUrl('/images/services/2.jpeg'), index: '02' },
  { headline: 'Выкуп и —', headlineItalic: 'продажа', label: 'Наши услуги', title: 'Быстро и выгодно', description: 'Быстрый выкуп или комиссионная продажа вашего авто', image: assetUrl('/images/services/3.jpeg'), index: '03' },
  { headline: 'ГИБДД —', headlineItalic: 'регистрация', label: 'Наши услуги', title: 'Без очередей', description: 'Полное сопровождение регистрации автомобиля', image: assetUrl('/images/services/1.jpeg'), index: '04' },
  { headline: 'Импорт —', headlineItalic: 'из-за рубежа', label: 'Наши услуги', title: 'Авто из любой страны', description: 'Пригон и оформление автомобилей из-за рубежа', image: assetUrl('/images/services/2.jpeg'), index: '05' },
  { headline: 'Приёмка —', headlineItalic: 'авто', label: 'Наши услуги', title: 'Профессиональный взгляд', description: 'Приёмка автомобиля после ремонта или покупки', image: assetUrl('/images/services/3.jpeg'), index: '06' },
  { headline: 'Кузовной —', headlineItalic: 'ремонт', label: 'Наши услуги', title: 'Оценим качество', description: 'Оценка ремонта по КАСКО и ОСАГО в сторонних техцентрах', image: assetUrl('/images/services/1.jpeg'), index: '07' },
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
    <div class="page__hero" :style="{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.45) 100%), url(${base}/images/bg.jpg)` }">
      <div class="page__hero-inner">
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
          <form class="page__hero-form" @submit.prevent>
            <input type="text" class="page__hero-form-input" name="name" placeholder="Ваше имя" autocomplete="name" />
            <input type="tel" class="page__hero-form-input" name="phone" placeholder="+7 (___) ___-__-__" autocomplete="tel" @input="handlePhoneInput" @keydown="handlePhoneKeydown" />
            <button type="submit" class="page__hero-form-btn">Оставить заявку</button>
          </form>
        </div>
      </div>
    </div>

    <div id="services" class="page__section page__section--services">
      <h2 class="page__section-title">Наши услуги</h2>
      <p class="page__section-text">
        Полный спектр услуг для покупки, продажи и обслуживания автомобилей
      </p>

      <div class="page__services">
        <article
          v-for="(srv, i) in services"
          :key="i"
          class="page__service"
          :style="{ '--service-bg': `url(${srv.image})` }"
        >
          <div class="page__service-overlay" />
          <div class="page__service-inner">

            <div class="page__service-top">
              <h3 class="page__service-headline">
                {{ srv.headline }} <span>{{ srv.headlineItalic }}</span>
              </h3>
              <div class="page__service-label">
                Наши услуги
              </div>
            </div>

            <div class="page__service-bottom">
              <div class="page__service-content">
                <h4 class="page__service-title">{{ srv.title }}</h4>
                <p class="page__service-text">{{ srv.description }}</p>
              </div>
              <div class="page__service-footer">
                <a href="#contact" class="page__service-btn">
                  <span class="page__service-btn-label">Подробнее</span>
                  <span class="page__service-btn-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </a>
                <span class="page__service-number" aria-hidden="true">{{ srv.index }}</span>
              </div>
            </div>

          </div>
        </article>
      </div>
    </div>

    <div id="how" class="page__section page__section--key page__section--key-twin">
      <p class="page__key-twin-lead">Два формата работы</p>

      <div class="page__key-twin">
        <div class="page__key-panel">
          <div class="page__key-wrap">
            <p class="page__key-lead">Автоподбор под ключ</p>
            <h2 class="page__key-title">Подбираем под ваш бюджет и задачи, а не «что попалось»</h2>

            <ul class="page__key-list">
              <li class="page__key-item">
                <span class="page__key-item-num">01</span>
                <div class="page__key-item-body">
                  <strong>Поиск по всем каналам</strong> — Авито, закрытые чаты, партнёры. Проверяем все варианты в вашем бюджете.
                </div>
              </li>
              <li class="page__key-item">
                <span class="page__key-item-num">02</span>
                <div class="page__key-item-body">
                  <strong>Три этапа проверки</strong> — юридическая чистота, техосмотр и кузов, контроль перед сделкой.
                </div>
              </li>
              <li class="page__key-item">
                <span class="page__key-item-num">03</span>
                <div class="page__key-item-body">
                  <strong>Сделка за вас</strong> — при необходимости ведём переговоры и оформляем. Вы получаете готовый результат.
                </div>
              </li>
            </ul>

            <p class="page__key-outcome">Вы покупаете автомобиль, который реально стоит своих денег.</p>
          </div>
        </div>

        <div class="page__key-twin-divider" aria-hidden="true">
          <span class="page__key-twin-or">или</span>
        </div>

        <div class="page__key-panel">
          <div class="page__key-wrap">
            <p class="page__key-lead">Разовая проверка</p>
            <h2 class="page__key-title">Уже нашли вариант? Проверим глубже, чем в сервисе</h2>

            <ul class="page__key-list">
              <li class="page__key-item">
                <span class="page__key-item-num">01</span>
                <div class="page__key-item-body">
                  <strong>Полная диагностика</strong> — техсостояние, кузов, электрика, подвеска. Всё, что важно перед покупкой.
                </div>
              </li>
              <li class="page__key-item">
                <span class="page__key-item-num">02</span>
                <div class="page__key-item-body">
                  <strong>VIN, история, пробег, залоги</strong> — юридическая чистота и реальная история авто.
                </div>
              </li>
              <li class="page__key-item">
                <span class="page__key-item-num">03</span>
                <div class="page__key-item-body">
                  <strong>Фото- и видеоотчёт</strong> — 200+ материалов и заключение: стоит покупать или нет.
                </div>
              </li>
            </ul>

            <p class="page__key-outcome">Вы знаете правду об автомобиле до покупки.</p>
          </div>
        </div>
      </div>
    </div>

    <div id="sell" class="page__section page__section--sell">
      <div class="page__sell-wrap">
        <h2 class="page__sell-title">Выкуп и комиссионная продажа</h2>
        <p class="page__sell-lead">Продать автомобиль быстро и без головной боли</p>

        <div class="page__sell-options">
          <div class="page__sell-option">
            <div class="page__sell-option-head">
              <span class="page__sell-option-dot"></span>
              <h3 class="page__sell-option-title">Выкуп</h3>
            </div>
            <ul class="page__sell-option-list">
              <li>Быстрая удалённая оценка</li>
              <li>Честная цена, без «сюрпризов» на осмотре</li>
            </ul>
          </div>

          <div class="page__sell-option">
            <div class="page__sell-option-head">
              <span class="page__sell-option-dot"></span>
              <h3 class="page__sell-option-title">Комиссионная продажа</h3>
            </div>
            <ul class="page__sell-option-list">
              <li>Профессиональный осмотр и отчёт</li>
              <li>Качественные фото и честное описание</li>
              <li>Размещение на всех площадках</li>
              <li>Переговоры с покупателями — на нас</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div id="gibdd" class="page__section page__section--gibdd">
      <div class="page__gibdd-wrap">
        <p class="page__gibdd-label">Регистрация в ГИБДД</p>
        <h2 class="page__gibdd-title">Сэкономим ваше время и нервы</h2>
        <p class="page__gibdd-lead">Подача документов, осмотр, получение номеров — делаем за вас. Вы занимаетесь своими делами.</p>

        <ul class="page__gibdd-list">
          <li>Полное сопровождение регистрации</li>
          <li>Физлица и юрлица</li>
          <li>Оплата после результата</li>
          <li>Вы получаете авто уже на учёте</li>
        </ul>
      </div>
    </div>

    <div id="korea" class="page__section page__section--korea">
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
    </div>

    <div class="page__section page__section--why">
      <h2 class="page__why-headline">Почему выбирают Autopodbor_62</h2>
      <div class="page__why-tags">
        <span class="page__why-tag">Реальный рынок</span>
        <span class="page__why-tag">Не продаём кота в мешке</span>
        <span class="page__why-tag">Экономим деньги и время</span>
        <span class="page__why-tag">Ответственность за результат</span>
        <span class="page__why-tag">Скажем, если не стоит покупать</span>
      </div>
    </div>

    <div id="team" class="page__section page__section--team">
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
            <p class="page__team-role">Эксперт по осмотру и диагностике</p>
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
            <p class="page__team-role">Юридическое сопровождение</p>
            <p class="page__team-bio">РГУ им. С.А. Есенина, юридический факультет, уголовно-правовой профиль, выпуск&nbsp;2020. С&nbsp;техникой с&nbsp;2020&nbsp;года.</p>
            <p class="page__team-since">В автоподборе с 2022 года</p>
          </div>
        </div>
      </div>
    </div>

    <div id="reviews" class="page__section">
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
    </div>

    <div id="faq" class="page__section page__section--alt">
      <h2 class="page__section-title">FAQ — часто задаваемые вопросы</h2>
      
      <div class="page__faq">
        <ClientOnly>
          <el-collapse>
          <el-collapse-item name="1">
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
          </el-collapse-item>

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

    <div class="page__section page__section--cta-bottom">
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
          <form class="page__cta-bottom-form" @submit.prevent>
            <p class="page__cta-bottom-form-title">Оставьте заявку — перезвоним в течение 15 минут</p>
            <div class="page__cta-bottom-form-fields">
              <input type="text" class="page__cta-bottom-input" name="name" placeholder="Ваше имя" autocomplete="name" />
              <input type="tel" class="page__cta-bottom-input" name="phone" placeholder="+7 (___) ___-__-__" autocomplete="tel" @input="handlePhoneInput" @keydown="handlePhoneKeydown" />
            </div>
            <button type="submit" class="page__cta-bottom-btn">
              Хочу бесплатную консультацию
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <p class="page__cta-bottom-guarantee">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
              Без спама. Не передаём данные третьим лицам.
            </p>
          </form>
        </div>
      </div>
    </div>

    <div id="contact" class="page__section page__section--contact">
      <h2 class="page__section-title">Связаться с нами</h2>
      <p class="page__section-text">
        Позвоните или напишите — ответим на вопросы и подберём удобное время
      </p>
      <div class="page__contact-links">
        <a href="tel:+79156095787" class="page__contact-phone">+7 915 609 5787</a>
        <a href="https://t.me/Autopodbor62" target="_blank" rel="noopener noreferrer" class="page__contact-telegram">
          <svg class="page__contact-telegram-icon" viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          Написать в Telegram
        </a>
      </div>
    </div>
  </div>
  </div>

  <a href="tel:+79156095787" class="page__fixed-call">
    <span class="page__fixed-call-icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.5 11.5 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.5 11.5 0 0 0 .57 3.6 1 1 0 0 1-.25 1.02l-2.2 2.17z"/>
      </svg>
    </span>
    <span class="page__fixed-call-body">
      <span class="page__fixed-call-label">Позвоните нам</span>
      <span class="page__fixed-call-number">+7 915 609 5787</span>
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
    text-align: center;
    padding: 0 24px;
    background-image: none;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
  }

  &__hero-inner {
    width: 100%;
    max-width: 820px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 100px 0 56px;

    @media (max-width: 720px) {
      padding: 72px 0 40px;
    }
  }

  &__content {
    max-width: 820px;
    margin-bottom: 0;
    margin-top: 50px;
  }

  &__title {
    font-family: var(--font-body);
    color: #fff;
    font-size: clamp(36px, 6vw, 56px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin: 0 0 20px 0;
    text-shadow: 0 2px 24px rgba(0, 0, 0, 0.4);
  }

  &__title::after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background: var(--color-accent);
    margin: 20px auto 0;
    border-radius: 2px;
  }

  &__text {
    color: rgba(255, 255, 255, 0.9);
    font-size: 18px;
    font-weight: 500;
    line-height: 1.6;
    margin: 0;
    text-shadow: 0 1px 12px rgba(0, 0, 0, 0.3);
  }

  &__hero-cta {
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
  }

  &__hero-cta-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    padding: 8px 16px 8px 12px;
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

    @media (max-width: 600px) {
      flex-direction: column;
      gap: 10px;
    }
  }

  &__hero-form-input {
    flex: 1;
    min-width: 0;
    padding: 15px 18px;
    font-size: 15px;
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
    font-size: 15px;
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
    font-size: 17px;
    line-height: 1.65;
    margin: 0 auto 40px;
    max-width: 600px;
  }

  &__section--services {
    background: var(--color-bg-alt);
  }

  &__services {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 20px;
    max-width: 1280px;
    margin: 0 auto;

    @media (max-width: 720px) {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  &__service {
    --service-bg: url('');
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    min-height: 480px;
    background: #1a1a1a;
    background-image: var(--service-bg);
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
    transition: transform 0.35s ease, box-shadow 0.35s ease;

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 56px rgba(0, 0, 0, 0.4);
    }
  }

  &__service-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.82) 0%,
      rgba(0, 0, 0, 0.82) 32%,
      rgba(0, 0, 0, 0.15) 52%,
      rgba(0, 0, 0, 0.72) 72%,
      rgba(0, 0, 0, 0.88) 100%
    );
    pointer-events: none;
  }

  &__service-inner {
    position: absolute;
    inset: 0;
    z-index: 1;
    padding: 28px 28px 28px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__service-top {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  &__service-headline {
    font-size: clamp(22px, 3.5vw, 28px);
    font-weight: 700;
    color: #fff;
    line-height: 1.2;
    letter-spacing: -0.02em;

    span {
      font-weight: 700;
    }
  }

  &__service-label {
    font-size: 13px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.65);
    line-height: 1.3;
    flex-shrink: 0;
    padding-top: 4px;
  }

  &__service-bottom {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__service-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__service-title {
    font-size: 22px;
    font-weight: 800;
    color: #fff;
    line-height: 1.2;
    margin: 0;
    letter-spacing: -0.02em;
  }

  &__service-text {
    color: rgba(255, 255, 255, 0.75);
    font-size: 14px;
    line-height: 1.5;
    margin: 0;
  }

  &__service-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  &__service-btn {
    display: inline-flex;
    align-items: center;
    gap: 0;
    padding: 6px 6px 6px 20px;
    background: rgba(30, 30, 30, 0.8);
    backdrop-filter: blur(10px);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: background 0.2s ease, border-color 0.2s ease;

    &:hover {
      background: rgba(50, 50, 50, 0.95);
      border-color: rgba(255, 255, 255, 0.35);

      .page__service-btn-icon {
        background: var(--color-accent);
      }

      .page__service-btn-icon svg {
        color: #fff;
      }
    }
  }

  &__service-btn-label {
    padding-right: 14px;
  }

  &__service-btn-icon {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.2s ease;

    svg {
      color: #111;
      transition: color 0.2s ease;
    }
  }

  &__service-number {
    font-size: clamp(72px, 10vw, 120px);
    font-weight: 800;
    color: rgba(255, 255, 255, 0.12);
    line-height: 1;
    letter-spacing: -0.06em;
    pointer-events: none;
    flex-shrink: 0;
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
    font-size: 15px;
    line-height: 1.65;
    flex: 1;
  }

  &__card-list {
    color: var(--color-text);
    font-size: 15px;
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

  &__section--sell {
    padding: 80px 24px;

    @media (max-width: 720px) {
      padding: 56px 20px;
    }
    background: var(--color-bg-alt);
  }

  &__sell-wrap {
    max-width: 800px;
    margin: 0 auto;
    text-align: left;
  }

  &__sell-title {
    font-size: clamp(24px, 3.5vw, 32px);
    font-weight: 800;
    color: var(--color-dark);
    letter-spacing: -0.02em;
    margin: 0 0 12px 0;
    line-height: 1.2;
  }

  &__sell-lead {
    font-size: 17px;
    color: var(--color-text-muted);
    line-height: 1.5;
    margin: 0 0 40px 0;
  }

  &__sell-options {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  &__sell-option {
    padding: 24px 0;
    border-bottom: 1px solid var(--color-border);

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
  }

  &__sell-option-head {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }

  &__sell-option-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--color-accent);
    flex-shrink: 0;
  }

  &__sell-option-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--color-dark);
    margin: 0;
    letter-spacing: -0.01em;
  }

  &__sell-option-list {
    margin: 0;
    padding: 0 0 0 26px;
    list-style: none;
    font-size: 15px;
    color: var(--color-text);
    line-height: 1.7;

    li {
      position: relative;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      &::before {
        content: '—';
        position: absolute;
        left: -20px;
        color: var(--color-accent);
        font-weight: 600;
      }
    }
  }

  &__section--gibdd {
    padding: 80px 24px;

    @media (max-width: 720px) {
      padding: 56px 20px;
    }
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
  }

  &__gibdd-wrap {
    max-width: 640px;
    margin: 0 auto;
    text-align: left;
    padding-left: 32px;
    border-left: 3px solid var(--color-accent);

    @media (max-width: 600px) {
      padding-left: 20px;
    }
  }

  &__gibdd-label {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-accent);
    margin: 0 0 12px 0;
  }

  &__gibdd-title {
    font-size: clamp(22px, 3.5vw, 28px);
    font-weight: 800;
    color: var(--color-dark);
    letter-spacing: -0.02em;
    margin: 0 0 12px 0;
    line-height: 1.25;
  }

  &__gibdd-lead {
    font-size: 16px;
    color: var(--color-text-muted);
    line-height: 1.6;
    margin: 0 0 24px 0;
  }

  &__gibdd-list {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 15px;
    color: var(--color-text);
    line-height: 1.65;

    li {
      position: relative;
      padding-left: 20px;
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0.5em;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--color-accent);
      }
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
    font-size: 15px;
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
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 18px 22px;
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 12px;
    transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
  }

  &__korea-block-icon {
    font-family: 'Material Symbols Outlined', sans-serif;
    font-size: 28px;
    font-weight: normal;
    color: var(--color-accent);
    flex-shrink: 0;
    line-height: 1;
  }

  &__korea-block-text {
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    line-height: 1.4;
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
    font-size: clamp(20px, 3vw, 26px);
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.02em;
    margin: 0 0 28px 0;
    line-height: 1.3;
  }

  &__why-tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px 16px;
    max-width: 720px;
    margin: 0 auto;
  }

  &__why-tag {
    display: inline-block;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.95);
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 999px;
    white-space: nowrap;
    transition: background 0.2s ease, border-color 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.14);
      border-color: var(--color-accent);
    }
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
    font-size: 17px;
    line-height: 1.5;
    flex: 1;
  }

  &__section--team {
    padding: 80px 24px;

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
    font-size: 14px;
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
      font-size: 17px;
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
    font-size: 15px;
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
