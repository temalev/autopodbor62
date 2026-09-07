<script setup lang="ts">
import {
  SITE_URL,
  breadcrumbJsonLd,
  faqPageJsonLd,
  jsonLdScript,
} from '../../utils/schema'

/**
 * Калькулятор считает только то, что платится государству при ввозе:
 * пошлину, утилизационный сбор и сбор за таможенные операции.
 * Логистика, СБКТС, ЭРА-ГЛОНАСС и наше вознаграждение сюда намеренно
 * не входят — их размер зависит от маршрута и конкретной машины,
 * а смешивать проверяемые ставки с оценочными суммами нельзя.
 */

/** Курсы ЦБ РФ. Дата зашита рядом с числами, чтобы на странице не было курса без даты. */
const CBR_DATE = '5 сентября 2026 года'
const CBR_RATES: Record<string, number> = {
  RUB: 1,
  EUR: 100.5693,
  USD: 86.5857,
  KRW: 63.6894 / 1000, // ЦБ котирует вону за 1000 единиц
  CNY: 12.8849,
}

const CURRENCIES = [
  { code: 'KRW', label: '₩ вона' },
  { code: 'CNY', label: '¥ юань' },
  { code: 'USD', label: '$ доллар' },
  { code: 'EUR', label: '€ евро' },
  { code: 'RUB', label: '₽ рубль' },
]

/**
 * Единые ставки таможенных пошлин для физлиц — приложение 2 к решению
 * Совета ЕЭК от 20.12.2017 № 107. Для машин моложе трёх лет ставка считается
 * от таможенной стоимости в евро, но не может быть ниже ставки за кубический
 * сантиметр: таможня берёт большее из двух значений.
 */
const DUTY_UNDER_3 = [
  { upTo: 8_500, share: 0.54, minPerCc: 2.5 },
  { upTo: 16_700, share: 0.48, minPerCc: 3.5 },
  { upTo: 42_300, share: 0.48, minPerCc: 5.5 },
  { upTo: 84_500, share: 0.48, minPerCc: 7.5 },
  { upTo: 169_000, share: 0.48, minPerCc: 15 },
  { upTo: Infinity, share: 0.48, minPerCc: 20 },
]

/** Для машин старше трёх лет стоимость не важна — считают только по объёму, евро за см³. */
const DUTY_3_TO_5 = [
  { upTo: 1000, perCc: 1.5 },
  { upTo: 1500, perCc: 1.7 },
  { upTo: 1800, perCc: 2.5 },
  { upTo: 2300, perCc: 2.7 },
  { upTo: 3000, perCc: 3.0 },
  { upTo: Infinity, perCc: 3.6 },
]

const DUTY_OVER_5 = [
  { upTo: 1000, perCc: 3.0 },
  { upTo: 1500, perCc: 3.2 },
  { upTo: 1800, perCc: 3.5 },
  { upTo: 2300, perCc: 4.8 },
  { upTo: 3000, perCc: 5.0 },
  { upTo: Infinity, perCc: 5.7 },
]

/**
 * Утилизационный сбор. Базовая ставка для легковых — 20 000 ₽, льготные
 * коэффициенты для личного пользования — 0,17 и 0,26. С 1 декабря 2025 года
 * льгота действует только до 160 л.с.: выше порога сбор считается по
 * коммерческим коэффициентам и вырастает на порядки.
 */
const UTIL_PRIVILEGED_NEW = 3_400
const UTIL_PRIVILEGED_USED = 5_200
const UTIL_BASE = 20_000
const UTIL_POWER_LIMIT = 160
const UTIL_VOLUME_LIMIT = 3_000
const HP_PER_KW = 1.35962

/**
 * Коммерческие коэффициенты утильсбора — раздел I перечня к ПП № 1291
 * в редакции постановления от 01.11.2025 № 1713 (официальный текст —
 * PDF на government.ru). В перечне колонки идут парами «новые / старше
 * 3 лет» по годам индексации; здесь взята пара 2026 года.
 *
 * Сверено с опубликованными суммами: для 1–2 л и 160–190 л.с. пресса
 * приводит 900 000 и 1 492 800 ₽ — это ровно 45 и 74,64 от базовых
 * 20 000 ₽, то есть третья и четвёртая числовые колонки перечня.
 * Вторая проверка на другой ячейке (800 800 и 1 408 800 ₽ → 40,04 и
 * 70,44) попала в те же колонки.
 *
 * Границы мощности заданы в киловаттах, как в постановлении: 117,68 кВт
 * это ровно 160 л.с., то есть порог льготы совпадает с границей строки.
 */
const UTIL_KW_BANDS = [
  51.48, 73.55, 95.61, 117.68, 139.75, 161.81, 183.88, 205.94,
  228, 250.07, 272.13, 294.2, 316.26, 338.33, 367.75, Infinity,
]

const UTIL_COMMERCIAL: { volumeUpTo: number, pairs: [number, number][] }[] = [
  {
    volumeUpTo: 1000,
    pairs: [
      [14.88, 27.6], [14.88, 27.6], [14.88, 27.6], [14.88, 27.6],
      [15.36, 28.43], [15.84, 29.28], [16.2, 30.12], [17.28, 30.12],
      [17.28, 30.12], [17.28, 30.12], [17.28, 30.12], [17.28, 30.12],
      [17.28, 30.12], [17.28, 30.12], [17.28, 30.12], [17.28, 30.12],
    ],
  },
  {
    volumeUpTo: 2000,
    pairs: [
      [40.04, 70.44], [40.04, 70.44], [40.04, 70.44], [40.04, 70.44],
      [45, 74.64], [47.64, 79.2], [50.52, 83.88], [57.12, 91.92],
      [64.56, 100.56], [72.96, 110.16], [83.16, 120.6], [94.8, 132],
      [108, 144.6], [123.24, 158.4], [140.4, 173.4], [160.08, 189.84],
    ],
  },
  {
    volumeUpTo: 3000,
    pairs: [
      [112.52, 170.36], [112.52, 170.36], [112.52, 170.36], [112.52, 170.36],
      [115.34, 172.8], [118.2, 175.08], [120.12, 177.6], [126, 183],
      [131.04, 188.52], [136.32, 193.68], [141.72, 199.08], [147.48, 204.72],
      [153.36, 210.48], [159.48, 216.36], [165.84, 222.36], [172.44, 228.6],
    ],
  },
]

/** Сбор за таможенные операции — постановление № 1637 в редакции № 1638, с 1 января 2026 года. */
const CLEARANCE_FEE = [
  { upTo: 200_000, fee: 1_231 },
  { upTo: 450_000, fee: 2_462 },
  { upTo: 1_200_000, fee: 4_924 },
  { upTo: 2_700_000, fee: 13_541 },
  { upTo: 4_200_000, fee: 18_465 },
  { upTo: 5_500_000, fee: 21_344 },
  { upTo: 10_000_000, fee: 49_240 },
  { upTo: Infinity, fee: 73_860 },
]

const AGES = [
  { code: 'under3', label: 'До 3 лет' },
  { code: 'from3to5', label: 'От 3 до 5 лет' },
  { code: 'over5', label: 'Старше 5 лет' },
]

// Значения по умолчанию — типовая корейская машина: так страница открывается
// с живым расчётом, а не с пустой формой.
const price = ref(30_000_000)
const currency = ref('KRW')
const age = ref('from3to5')
const volume = ref(1998)
const power = ref(150)
const eurRate = ref(CBR_RATES.EUR)

const num = (v: unknown) => {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? n : 0
}

const priceRub = computed(() => num(price.value) * (CBR_RATES[currency.value] ?? 1))
const priceEur = computed(() => (num(eurRate.value) ? priceRub.value / num(eurRate.value) : 0))

/** Пошлина. Для молодых машин возвращаем ещё и способ расчёта — по стоимости или по объёму. */
const duty = computed(() => {
  const cc = num(volume.value)
  const rate = num(eurRate.value)
  if (!cc || !rate) return { rub: 0, note: '' }

  if (age.value === 'under3') {
    const band = DUTY_UNDER_3.find((b) => priceEur.value <= b.upTo) ?? DUTY_UNDER_3[DUTY_UNDER_3.length - 1]
    const byValue = priceEur.value * band.share
    const byVolume = band.minPerCc * cc
    const eur = Math.max(byValue, byVolume)
    return {
      rub: eur * rate,
      note:
        byVolume > byValue
          ? `Сработал минимум ${fmtRate(band.minPerCc)} € за см³: он оказался выше, чем ${Math.round(band.share * 100)}% от стоимости.`
          : `${Math.round(band.share * 100)}% от таможенной стоимости — это выше минимума в ${fmtRate(band.minPerCc)} € за см³.`,
    }
  }

  const table = age.value === 'from3to5' ? DUTY_3_TO_5 : DUTY_OVER_5
  const band = table.find((b) => cc <= b.upTo) ?? table[table.length - 1]
  return {
    rub: band.perCc * cc * rate,
    note: `${fmtRate(band.perCc)} € за см³ × ${cc} см³. Для машин старше трёх лет стоимость автомобиля на пошлину не влияет.`,
  }
})

/**
 * Утильсбор. До 160 л.с. и меньше 3 000 см³ — льготная ставка для личного
 * пользования. Выше порога считаем по коммерческому коэффициенту из перечня.
 * Для объёма от 3 000 см³ коэффициентов здесь нет: такие машины в импорте
 * редки, а публиковать половину таблицы хуже, чем честно сказать об этом.
 */
const util = computed(() => {
  const cc = num(volume.value)
  const hp = num(power.value)
  if (!cc || !hp) return { rub: 0, note: '', privileged: true, unknown: false }

  if (hp <= UTIL_POWER_LIMIT && cc < UTIL_VOLUME_LIMIT) {
    return {
      rub: age.value === 'under3' ? UTIL_PRIVILEGED_NEW : UTIL_PRIVILEGED_USED,
      note: `Льготная ставка для личного пользования: ${age.value === 'under3' ? 'до 3 лет' : 'старше 3 лет'}, до ${UTIL_POWER_LIMIT} л.с., объём меньше ${UTIL_VOLUME_LIMIT.toLocaleString('ru-RU')} см³.`,
      privileged: true,
      unknown: false,
    }
  }

  const group = UTIL_COMMERCIAL.find((g) => cc <= g.volumeUpTo)
  if (!group) {
    return {
      rub: null,
      note: `Объём от ${UTIL_VOLUME_LIMIT.toLocaleString('ru-RU')} см³ — коэффициент по такой машине посчитаем вручную.`,
      privileged: false,
      unknown: true,
    }
  }

  const kw = hp / HP_PER_KW
  const i = UTIL_KW_BANDS.findIndex((b) => kw <= b)
  const pair = group.pairs[i < 0 ? group.pairs.length - 1 : i]
  const coef = age.value === 'under3' ? pair[0] : pair[1]

  return {
    rub: coef * UTIL_BASE,
    note: `Льгота не действует: ${hp > UTIL_POWER_LIMIT ? `мощность выше ${UTIL_POWER_LIMIT} л.с.` : `объём от ${UTIL_VOLUME_LIMIT.toLocaleString('ru-RU')} см³`}. Коммерческий коэффициент ${coef.toLocaleString('ru-RU')} × базовая ставка ${UTIL_BASE.toLocaleString('ru-RU')} ₽.`,
    privileged: false,
    unknown: false,
  }
})

const fee = computed(() => {
  const band = CLEARANCE_FEE.find((b) => priceRub.value <= b.upTo) ?? CLEARANCE_FEE[CLEARANCE_FEE.length - 1]
  return band.fee
})

const total = computed(() =>
  util.value.rub === null ? null : duty.value.rub + util.value.rub + fee.value,
)

function fmtRate(v: number) {
  return v.toLocaleString('ru-RU', { maximumFractionDigits: 1 })
}
function fmtCourse(v: number) {
  return v.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}
function fmtRub(v: number) {
  return Math.round(v).toLocaleString('ru-RU')
}

/**
 * Таблицы ставок рендерятся из тех же констант, по которым идёт расчёт, —
 * иначе опубликованные цифры однажды разойдутся с формулой.
 * Закон задаёт ставки в евро, а платит человек рублями, поэтому рядом с
 * каждой ставкой показываем рублёвый эквивалент по курсу из формы.
 */
function bandLabel(list: { upTo: number }[], i: number, unit: string) {
  const f = (n: number) => n.toLocaleString('ru-RU')
  const cur = list[i].upTo
  if (i === 0) return `до ${f(cur)} ${unit}`
  const prev = list[i - 1].upTo
  if (!Number.isFinite(cur)) return `свыше ${f(prev)} ${unit}`
  return `${f(prev)} — ${f(cur)} ${unit}`
}

const under3Rows = computed(() => {
  const rate = num(eurRate.value)
  const inRub = DUTY_UNDER_3.map((b) => ({
    upTo: Number.isFinite(b.upTo) ? Math.round(b.upTo * rate) : Infinity,
  }))
  return DUTY_UNDER_3.map((b, i) => ({
    range: bandLabel(DUTY_UNDER_3, i, '€'),
    rangeRub: bandLabel(inRub, i, '₽'),
    share: `${Math.round(b.share * 100)}%`,
    min: `${fmtRate(b.minPerCc)} € за см³`,
    minRub: `${fmtRub(b.minPerCc * rate)} ₽ за см³`,
  }))
})

const volumeRows = computed(() =>
  DUTY_3_TO_5.map((b, i) => ({
    range: bandLabel(DUTY_3_TO_5, i, 'см³'),
    mid: `${fmtRate(b.perCc)} €`,
    midRub: `${fmtRub(b.perCc * num(eurRate.value))} ₽`,
    old: `${fmtRate(DUTY_OVER_5[i].perCc)} €`,
    oldRub: `${fmtRub(DUTY_OVER_5[i].perCc * num(eurRate.value))} ₽`,
  })),
)

const feeRows = computed(() =>
  CLEARANCE_FEE.map((b, i) => ({
    range: bandLabel(CLEARANCE_FEE, i, '₽'),
    fee: `${fmtRub(b.fee)} ₽`,
  })),
)

const faqItems = [
  {
    question: 'Из чего складываются таможенные платежи за автомобиль?',
    answer:
      'Из трёх платежей. Таможенная пошлина по единой ставке — основная сумма, зависит от возраста и объёма двигателя, а для машин моложе трёх лет ещё и от стоимости. Утилизационный сбор — для личного пользования это 3 400 ₽ на машину до трёх лет и 5 200 ₽ на машину старше. Сбор за таможенные операции — от 1 231 до 73 860 ₽ в зависимости от стоимости автомобиля.',
  },
  {
    question: 'Почему выгоднее везти автомобиль возрастом от трёх до пяти лет?',
    answer:
      'Для этой возрастной группы установлены самые низкие ставки во всей шкале — от 1,5 до 3,6 евро за кубический сантиметр, и стоимость автомобиля на пошлину уже не влияет. Машина моложе трёх лет облагается по ставке 48–54% от стоимости, а старше пяти — по ставке от 3,0 до 5,7 евро за кубический сантиметр.',
  },
  {
    question: 'Что изменилось с утилизационным сбором для мощных автомобилей?',
    answer:
      'С 1 декабря 2025 года льготная ставка утилизационного сбора для личного пользования действует только для автомобилей мощностью до 160 л.с. и объёмом двигателя меньше 3 литров. Если машина мощнее, сбор считается по коммерческим коэффициентам из перечня к постановлению № 1291 и вырастает с нескольких тысяч рублей до сотен тысяч и миллионов. Например, для двигателя 1,6–2 литра мощностью от 160 до 190 л.с. это 900 000 ₽ на машину до трёх лет и 1 492 800 ₽ на машину старше. Калькулятор считает эти суммы автоматически.',
  },
  {
    question: 'Входят ли в расчёт доставка, СБКТС и услуги компании?',
    answer:
      'Нет. Калькулятор считает только платежи государству. Стоимость самого автомобиля, фрахт и доставку до Рязани, оформление СБКТС и установку ЭРА-ГЛОНАСС, услуги брокера и наше вознаграждение он не учитывает — эти суммы зависят от маршрута и конкретной машины, мы считаем их отдельно и фиксируем до старта работы.',
  },
  {
    question: 'По какому курсу считается таможенная стоимость?',
    answer:
      'По курсу Центрального банка на дату регистрации таможенной декларации. В калькуляторе подставлен курс ЦБ на дату последнего обновления страницы, его можно заменить на актуальный — итоговая сумма пересчитается.',
  },
]

const relatedServices = [
  {
    to: '/import',
    title: 'Импорт под ключ',
    description: 'Подбор на аукционе, логистика, таможня и номера в Рязани — весь цикл на нас.',
  },
  {
    to: '/registraciya-gibdd',
    title: 'Регистрация в ГИБДД',
    description: 'Поставим ввезённый автомобиль на учёт — входит в стоимость импорта под ключ.',
  },
  {
    to: '/proverka',
    title: 'Разовая проверка',
    description: 'Уже привезли машину сами? Проведём полную диагностику перед эксплуатацией.',
  },
]

const PAGE_URL = `${SITE_URL}/import/kalkulyator/`
const PAGE_TITLE = 'Калькулятор растаможки авто 2026 — пошлина и утильсбор'
const PAGE_DESCRIPTION =
  'Расчёт таможенных платежей за ввоз автомобиля из Кореи и Китая: пошлина по единой ставке, утилизационный сбор и сбор за оформление. Ставки 2026 года.'
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
      breadcrumbJsonLd([
        { name: 'Главная', url: `${SITE_URL}/` },
        { name: 'Импорт из Кореи и Китая', url: `${SITE_URL}/import/` },
        { name: 'Калькулятор растаможки', url: PAGE_URL },
      ]),
      'ld-calc-breadcrumbs',
    ),
    jsonLdScript(faqPageJsonLd(faqItems), 'ld-calc-faq'),
  ],
})
</script>

<template>
  <div class="calc-page">

    <div class="calc-page__hero">
      <div class="calc-page__container">
        <NuxtLink to="/import" class="calc-page__back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Импорт из Кореи и Китая
        </NuxtLink>
        <p class="calc-page__label">Расчёт платежей</p>
        <h1 class="calc-page__title">Калькулятор растаможки автомобиля в 2026 году</h1>
        <p class="calc-page__lead">Считает три платежа государству: таможенную пошлину по единой ставке, утилизационный сбор и сбор за таможенные операции. Ставки действующие, для физического лица, которое ввозит машину для личного пользования.</p>
      </div>
    </div>

    <section class="calc-page__section">
      <div class="calc-page__container">
        <div class="calc">

          <form class="calc__form" @submit.prevent>
            <h2 class="calc__form-title">Параметры автомобиля</h2>

            <div class="calc__field calc__field--split">
              <div>
                <label class="calc__label" for="calc-price">Стоимость автомобиля</label>
                <input id="calc-price" v-model.number="price" type="number" min="0" step="1000" inputmode="numeric" class="calc__input">
              </div>
              <div>
                <label class="calc__label" for="calc-currency">Валюта</label>
                <select id="calc-currency" v-model="currency" class="calc__input">
                  <option v-for="c in CURRENCIES" :key="c.code" :value="c.code">{{ c.label }}</option>
                </select>
              </div>
            </div>

            <div class="calc__field">
              <span class="calc__label">Возраст автомобиля</span>
              <div class="calc__radios">
                <label v-for="a in AGES" :key="a.code" class="calc__radio" :class="{ 'calc__radio--on': age === a.code }">
                  <input v-model="age" type="radio" name="age" :value="a.code">
                  <span>{{ a.label }}</span>
                </label>
              </div>
              <p class="calc__hint">Возраст считают с даты выпуска, а не с даты покупки.</p>
            </div>

            <div class="calc__field calc__field--split">
              <div>
                <label class="calc__label" for="calc-volume">Объём двигателя, см³</label>
                <input id="calc-volume" v-model.number="volume" type="number" min="0" step="1" inputmode="numeric" class="calc__input">
              </div>
              <div>
                <label class="calc__label" for="calc-power">Мощность, л.с.</label>
                <input id="calc-power" v-model.number="power" type="number" min="0" step="1" inputmode="numeric" class="calc__input">
              </div>
            </div>

            <div class="calc__field">
              <label class="calc__label" for="calc-rate">Курс евро ЦБ, ₽</label>
              <input id="calc-rate" v-model.number="eurRate" type="number" min="0" step="0.0001" inputmode="decimal" class="calc__input calc__input--narrow">
              <p class="calc__hint">Подставлен курс ЦБ на {{ CBR_DATE }}. Таможня считает по курсу на дату регистрации декларации — если она известна, поставьте её курс.</p>
            </div>
          </form>

          <div class="calc__result">
            <h2 class="calc__result-title">Платежи на таможне</h2>

            <div class="calc__value">
              <p class="calc__value-label">Таможенная стоимость</p>
              <p class="calc__value-sum">{{ fmtRub(priceRub) }} ₽</p>
              <p class="calc__value-note">≈ {{ fmtRub(priceEur) }} € по курсу {{ fmtCourse(Number(eurRate)) }} ₽</p>
            </div>

            <div class="calc__rows">
              <div class="calc__row">
                <div class="calc__row-head">
                  <span class="calc__row-name">Таможенная пошлина</span>
                  <span class="calc__row-sum">{{ fmtRub(duty.rub) }} ₽</span>
                </div>
                <p class="calc__row-note">{{ duty.note }}</p>
              </div>

              <div class="calc__row">
                <div class="calc__row-head">
                  <span class="calc__row-name">Утилизационный сбор</span>
                  <span v-if="util.rub !== null" class="calc__row-sum">{{ fmtRub(util.rub) }} ₽</span>
                  <span v-else class="calc__row-sum calc__row-sum--alert">считаем вручную</span>
                </div>
                <p class="calc__row-note">{{ util.note }}</p>
              </div>

              <div class="calc__row">
                <div class="calc__row-head">
                  <span class="calc__row-name">Сбор за таможенные операции</span>
                  <span class="calc__row-sum">{{ fmtRub(fee) }} ₽</span>
                </div>
                <p class="calc__row-note">Ставка привязана к таможенной стоимости, шкала действует с 1 января 2026 года.</p>
              </div>
            </div>

            <div v-if="total !== null" class="calc__total">
              <span class="calc__total-label">Итого на таможне</span>
              <span class="calc__total-sum">{{ fmtRub(total) }} ₽</span>
            </div>
            <div v-else class="calc__alert">
              <p class="calc__alert-title">Утильсбор по этой машине посчитаем вручную</p>
              <p>Для двигателей от 3 000 см³ коэффициент берётся из отдельной части перечня — такие машины в импорте редки, и мы не стали публиковать эту часть таблицы, не проверив её целиком. Пошлина и сбор за оформление выше посчитаны верно, остался только утильсбор. Позвоните — назовём точную сумму.</p>
              <a :href="SITE_PHONE_HREF" class="calc__alert-link">{{ SITE_PHONE_DISPLAY }}</a>
            </div>

            <p class="calc__disclaimer">Расчёт справочный и не является офертой. Итоговые суммы определяет таможенный орган по документам на конкретный автомобиль.</p>
          </div>

        </div>
      </div>
    </section>

    <section class="calc-page__section calc-page__section--alt">
      <div class="calc-page__container">
        <h2 class="calc-page__h2">Что калькулятор не считает</h2>
        <p class="calc-page__intro">Платежи на таможне — это лишь часть итоговой суммы. Чтобы машина доехала до Рязани и встала на учёт, к ним добавляется ещё несколько статей. Их размер зависит от маршрута, площадки и конкретного автомобиля, поэтому мы считаем и фиксируем их отдельно до начала работы.</p>
        <ul class="calc-page__list">
          <li><strong>Стоимость самого автомобиля</strong> на аукционе или у продавца.</li>
          <li><strong>Логистика</strong> — доставка от площадки до границы и от границы до Рязани.</li>
          <li><strong>СБКТС и ЭРА-ГЛОНАСС</strong> — без них машину не поставить на учёт.</li>
          <li><strong>Услуги таможенного брокера</strong> и оформление документов.</li>
          <li><strong>Наше вознаграждение</strong> за импорт под ключ — фиксируется до старта сделки.</li>
          <li><strong>Регистрация в ГИБДД</strong> — входит в стоимость импорта под ключ.</li>
        </ul>
      </div>
    </section>

    <section class="calc-page__section">
      <div class="calc-page__container">
        <h2 class="calc-page__h2">Ставки, по которым идёт расчёт</h2>

        <h3 class="calc-page__h3">Таможенная пошлина, единая ставка для физических лиц</h3>
        <p class="calc-page__intro">Для машин моложе трёх лет таможня берёт большее из двух значений — долю от стоимости или ставку за кубический сантиметр. Для машин старше трёх лет стоимость не учитывается вовсе.</p>

        <div class="calc-page__tablewrap">
          <table class="calc-page__table">
            <caption>Автомобили до 3 лет</caption>
            <thead>
              <tr><th>Таможенная стоимость</th><th>Ставка</th><th>Но не менее</th></tr>
            </thead>
            <tbody>
              <tr v-for="row in under3Rows" :key="row.range">
                <td>{{ row.range }}<span class="calc-page__rub">{{ row.rangeRub }}</span></td>
                <td>{{ row.share }}</td>
                <td>{{ row.min }}<span class="calc-page__rub">{{ row.minRub }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="calc-page__tablewrap">
          <table class="calc-page__table">
            <caption>Автомобили старше 3 лет — ставка за см³ объёма</caption>
            <thead>
              <tr><th>Объём двигателя</th><th>От 3 до 5 лет</th><th>Старше 5 лет</th></tr>
            </thead>
            <tbody>
              <tr v-for="row in volumeRows" :key="row.range">
                <td>{{ row.range }}</td>
                <td>{{ row.mid }}<span class="calc-page__rub">{{ row.midRub }}</span></td>
                <td>{{ row.old }}<span class="calc-page__rub">{{ row.oldRub }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="calc-page__rate-note">Рублёвые суммы в таблицах пересчитаны по курсу {{ fmtCourse(Number(eurRate)) }} ₽ за евро — тому, что стоит в форме выше. Поставите другой курс — пересчитаются и они.</p>

        <h3 class="calc-page__h3">Утилизационный сбор</h3>
        <p class="calc-page__intro">Базовая ставка для легковых автомобилей — 20 000 ₽, к ней применяется коэффициент. Для личного пользования коэффициенты льготные: 0,17 и 0,26. С 1 декабря 2025 года льгота работает только до 160 л.с. и при объёме меньше 3 000 см³ — выше порога сбор считается по коммерческим коэффициентам и вырастает на порядки.</p>

        <div class="calc-page__tablewrap">
          <table class="calc-page__table">
            <thead>
              <tr><th>Условия</th><th>До 3 лет</th><th>Старше 3 лет</th></tr>
            </thead>
            <tbody>
              <tr><td>Личное пользование, до 160 л.с., объём меньше 3 000 см³</td><td>3 400 ₽</td><td>5 200 ₽</td></tr>
              <tr><td>1 000 — 2 000 см³, 160—190 л.с.</td><td>900 000 ₽</td><td>1 492 800 ₽</td></tr>
              <tr><td>1 000 — 2 000 см³, 190—220 л.с.</td><td>952 800 ₽</td><td>1 584 000 ₽</td></tr>
              <tr><td>2 000 — 3 000 см³, 160—190 л.с.</td><td>2 306 800 ₽</td><td>3 456 000 ₽</td></tr>
              <tr><td>Объём от 3 000 см³</td><td colspan="2">Считаем вручную — эта часть перечня не проверена целиком</td></tr>
            </tbody>
          </table>
        </div>
        <p class="calc-page__rate-note">Коммерческие коэффициенты — раздел I перечня к постановлению № 1291 в редакции постановления от 1 ноября 2025 года № 1713, пара колонок 2026 года. Базовая ставка 20 000 ₽. Полную сетку по мощности калькулятор знает целиком для объёмов до 3 000 см³; в таблице показаны только опорные строки.</p>

        <h3 class="calc-page__h3">Сбор за таможенные операции</h3>
        <p class="calc-page__intro">Плата за то, что таможня приняла и оформила декларацию. Зависит только от таможенной стоимости, шкала действует с 1 января 2026 года.</p>

        <div class="calc-page__tablewrap">
          <table class="calc-page__table">
            <thead>
              <tr><th>Таможенная стоимость</th><th>Сбор</th></tr>
            </thead>
            <tbody>
              <tr v-for="row in feeRows" :key="row.range">
                <td>{{ row.range }}</td>
                <td>{{ row.fee }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="calc-page__section calc-page__section--alt">
      <div class="calc-page__container">
        <h2 class="calc-page__h2">Частые вопросы</h2>
        <div class="calc-page__faq">
          <details v-for="item in faqItems" :key="item.question" class="calc-page__faq-item">
            <summary class="calc-page__faq-q">{{ item.question }}</summary>
            <p class="calc-page__faq-a">{{ item.answer }}</p>
          </details>
        </div>
      </div>
    </section>

    <RelatedServices :items="relatedServices" subheading="Если планируете везти машину из-за рубежа" />
  </div>
</template>

<style scoped lang="scss">
.calc-page {
  min-height: 100vh;
}

.calc-page__hero {
  background: var(--color-dark);
  color: #fff;
  padding: 128px 24px 56px;

  @media (max-width: 768px) {
    padding: 112px 20px 48px;
  }
}

.calc-page__container {
  max-width: 900px;
  margin: 0 auto;
}

.calc-page__back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  margin-bottom: 28px;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-accent);
  }
}

.calc-page__label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-accent);
  margin: 0 0 12px;
}

.calc-page__title {
  font-size: clamp(28px, 4.6vw, 44px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.12;
  margin: 0 0 16px;
}

.calc-page__lead {
  font-size: 17px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  max-width: 640px;
}

.calc-page__section {
  padding: 56px 24px;

  @media (max-width: 720px) {
    padding: 44px 20px;
  }

  &--alt {
    background: var(--color-bg-alt);
  }
}

.calc-page__h2 {
  font-size: clamp(22px, 3.5vw, 28px);
  font-weight: 800;
  color: var(--color-dark);
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin: 0 0 20px;
}

.calc-page__h3 {
  font-size: clamp(17px, 2.6vw, 20px);
  font-weight: 700;
  color: var(--color-dark);
  line-height: 1.3;
  margin: 36px 0 12px;
}

.calc-page__intro {
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-text);
  margin: 0 0 20px;
  max-width: 68ch;
}

.calc-page__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;

  li {
    position: relative;
    padding-left: 22px;
    font-size: 16px;
    line-height: 1.65;
    color: var(--color-text);

    &::before {
      content: '';
      position: absolute;
      left: 4px;
      top: 10px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--color-accent);
    }
  }

  strong {
    color: var(--color-dark);
    font-weight: 700;
  }
}

/* ---------- калькулятор ---------- */

.calc {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 24px;
  align-items: start;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
}

.calc__form,
.calc__result {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 28px;

  @media (max-width: 720px) {
    padding: 22px;
  }
}

.calc__result {
  background: var(--color-bg-alt);
  position: sticky;
  top: 96px;

  @media (max-width: 860px) {
    position: static;
  }
}

.calc__form-title,
.calc__result-title {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  margin: 0 0 20px;
}

.calc__field {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  &--split {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
  }
}

.calc__field--split > div:last-child {
  min-width: 130px;
}

.calc__label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-muted);
  margin: 0 0 7px;
}

.calc__input {
  width: 100%;
  font: inherit;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-dark);
  padding: 11px 13px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-accent-bg);
  }

  &--narrow {
    max-width: 200px;
  }
}

.calc__radios {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.calc__radio {
  cursor: pointer;

  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    display: inline-block;
    padding: 9px 14px;
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
  }

  input:focus-visible + span {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  &--on span {
    color: #fff;
    background: var(--color-accent);
    border-color: var(--color-accent);
  }
}

.calc__hint {
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-text-muted);
  margin: 8px 0 0;
}

.calc__value {
  padding-bottom: 18px;
  border-bottom: 1px solid var(--color-border);
}

.calc__value-label {
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 0 0 4px;
}

.calc__value-sum {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-dark);
  letter-spacing: -0.02em;
  margin: 0;
  font-variant-numeric: tabular-nums;
}

.calc__value-note {
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 4px 0 0;
  font-variant-numeric: tabular-nums;
}

.calc__rows {
  display: grid;
  gap: 16px;
  padding: 18px 0;
}

.calc__row-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 14px;
}

.calc__row-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-dark);
}

.calc__row-sum {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-dark);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;

  &--alert {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-accent);
  }
}

.calc__row-note {
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-text-muted);
  margin: 5px 0 0;
}

.calc__total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 14px;
  padding-top: 18px;
  border-top: 2px solid var(--color-dark);
}

.calc__total-label {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-dark);
}

.calc__total-sum {
  font-size: clamp(22px, 3.6vw, 30px);
  font-weight: 800;
  color: var(--color-dark);
  letter-spacing: -0.02em;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.calc__alert {
  padding: 18px;
  background: var(--color-accent-bg);
  border-radius: 12px;

  p {
    font-size: 14px;
    line-height: 1.6;
    color: var(--color-text);
    margin: 0 0 8px;
  }
}

.calc__alert-title {
  font-weight: 700;
  color: var(--color-dark) !important;
}

.calc__alert-link {
  display: inline-block;
  font-size: 17px;
  font-weight: 700;
  color: var(--color-accent);
  text-decoration: none;
}

.calc__disclaimer {
  font-size: 12.5px;
  line-height: 1.55;
  color: var(--color-text-muted);
  margin: 16px 0 0;
}

/* ---------- таблицы ставок ---------- */

.calc-page__tablewrap {
  overflow-x: auto;
  margin: 0 0 20px;
}

.calc-page__table {
  width: 100%;
  min-width: 460px;
  border-collapse: collapse;
  font-size: 15px;

  caption {
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-text-muted);
    padding-bottom: 10px;
  }

  th {
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: var(--color-text-muted);
    padding: 10px 12px;
    border-bottom: 1px solid var(--color-border-strong);
    white-space: nowrap;
  }

  td {
    padding: 10px 12px;
    border-bottom: 1px solid var(--color-border);
    color: var(--color-text);
    font-variant-numeric: tabular-nums;
  }

  td:first-child {
    color: var(--color-dark);
    font-weight: 600;
  }
}

/* ---------- FAQ ---------- */

.calc-page__rub {
  display: block;
  font-size: 13px;
  font-weight: 400;
  color: var(--color-text-muted);
  margin-top: 2px;
  white-space: nowrap;
}

.calc-page__rate-note {
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--color-text-muted);
  margin: 0 0 20px;
  max-width: 68ch;
}

.calc-page__faq {
  display: grid;
  gap: 10px;
}

.calc-page__faq-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
}

.calc-page__faq-q {
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-dark);
  line-height: 1.4;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }

  &::after {
    content: '+';
    float: right;
    margin-left: 14px;
    color: var(--color-accent);
    font-weight: 700;
  }
}

.calc-page__faq-item[open] .calc-page__faq-q::after {
  content: '−';
}

.calc-page__faq-a {
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-text);
  margin: 12px 0 0;
}
</style>
