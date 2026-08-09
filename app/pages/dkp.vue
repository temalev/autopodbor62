<script setup lang="ts">
import { SITE_URL, breadcrumbJsonLd, jsonLdScript } from '../utils/schema'

const PAGE_URL = `${SITE_URL}/dkp`
const PAGE_TITLE = 'Договор купли-продажи автомобиля онлайн — бесплатный шаблон ДКП в PDF | Автоподбор 62'
const PAGE_DESCRIPTION =
  'Бесплатный онлайн-конструктор договора купли-продажи автомобиля (ДКП). Заполните данные продавца, покупателя и авто — скачайте готовый договор в PDF. Актуальный бланк, без регистрации.'
const PAGE_OG_IMAGE = `${SITE_URL}/images/bg.webp`

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
        { name: 'Договор купли-продажи (ДКП)', url: PAGE_URL },
      ]),
      'ld-dkp-breadcrumbs',
    ),
  ],
})

const form = reactive({
  city: 'Рязань',
  date: new Date().toLocaleDateString('ru-RU'),

  sellerName: '',
  sellerBirthDate: '',
  sellerBirthPlace: '',
  sellerAddress: '',
  sellerPassportSeries: '',
  sellerPassportNumber: '',
  sellerPassportIssuedBy: '',
  sellerPassportIssuedDate: '',

  buyerName: '',
  buyerBirthDate: '',
  buyerBirthPlace: '',
  buyerAddress: '',
  buyerPassportSeries: '',
  buyerPassportNumber: '',
  buyerPassportIssuedBy: '',
  buyerPassportIssuedDate: '',

  carMakeModel: '',
  carType: '',
  carYear: '',
  vin: '',
  secondVin: '',
  power: '',
  engineVolume: '',
  color: '',
  plateNumber: '',

  engineModelNumber: '',
  chassisNumber: '',
  bodyNumber: '',

  ptsSeriesNumber: '',
  ptsIssuedBy: '',
  ptsIssuedDate: '',

  stsSeriesNumber: '',
  stsIssuedBy: '',
  stsIssuedDate: '',

  price: '',
})

/**
 * Тумблер «дополнительный VIN» переключает бланк: `dkp_full.pdf` со строкой под
 * второй VIN либо `dkp.pdf` без неё. Оба бланка в остальном идентичны — те же
 * поля и те же пункты договора, включая 3.4 и 3.5.
 */
const hasSecondVin = ref(false)

const previewUrl = ref<string | null>(null)

const joinCsv = (parts: Array<string | undefined | null>) =>
  parts
    .map(p => (p ?? '').trim())
    .filter(Boolean)
    .join(', ')

const RU_ONES_M = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять']
const RU_ONES_F = ['', 'одна', 'две', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять']
const RU_TEENS = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать']
const RU_TENS = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто']
const RU_HUNDREDS = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот']

/** Выбор падежной формы: 1 тысяча, 2 тысячи, 5 тысяч */
const pluralRu = (n: number, forms: [string, string, string]) => {
  const n10 = n % 10
  const n100 = n % 100
  if (n10 === 1 && n100 !== 11) return forms[0]
  if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return forms[1]
  return forms[2]
}

const tripleToWordsRu = (n: number, feminine: boolean) => {
  const out: string[] = []
  const h = Math.floor(n / 100)
  const t = Math.floor((n % 100) / 10)
  const o = n % 10
  if (h) out.push(RU_HUNDREDS[h] ?? '')
  if (t === 1) {
    out.push(RU_TEENS[o] ?? '')
  } else {
    if (t) out.push(RU_TENS[t] ?? '')
    if (o) out.push((feminine ? RU_ONES_F : RU_ONES_M)[o] ?? '')
  }
  return out.filter(Boolean).join(' ')
}

/**
 * Сумма прописью для поля `price_word` — в бланке рядом уже напечатано
 * «рублей», поэтому возвращаем только числительное.
 */
const amountInWordsRu = (raw: string) => {
  const digits = (raw || '').replace(/[^\d]/g, '')
  if (!digits) return ''
  const total = Number(digits)
  if (!Number.isFinite(total) || total === 0) return 'Ноль'

  const chunks: number[] = []
  let rest = total
  while (rest > 0) {
    chunks.push(rest % 1000)
    rest = Math.floor(rest / 1000)
  }

  const scales: Array<{ forms: [string, string, string], feminine: boolean } | null> = [
    null,
    { forms: ['тысяча', 'тысячи', 'тысяч'], feminine: true },
    { forms: ['миллион', 'миллиона', 'миллионов'], feminine: false },
    { forms: ['миллиард', 'миллиарда', 'миллиардов'], feminine: false },
  ]

  const parts: string[] = []
  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunk = chunks[i] ?? 0
    if (!chunk) continue
    const scale = scales[i]
    parts.push(tripleToWordsRu(chunk, scale?.feminine ?? false))
    if (scale) parts.push(pluralRu(chunk, scale.forms))
  }

  const text = parts.filter(Boolean).join(' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** Подсказка под полем цены — та же строка, что уходит в поле `price_word` */
const priceInWords = computed(() => amountInWordsRu(form.price))

const splitToFitField = (text: string, maxWidth: number, font: any, fontSize: number) => {
  const cleaned = text.trim()
  if (!cleaned) return { first: '', second: '' }

  const width = font.widthOfTextAtSize(cleaned, fontSize)
  if (width <= maxWidth) return { first: cleaned, second: '' }

  // Пытаемся резать по запятым
  const parts = cleaned.split(',').map(p => p.trim()).filter(Boolean)
  if (parts.length <= 1) {
    // Фолбэк: режем по словам
    const words = cleaned.split(/\s+/).filter(Boolean)
    let left = ''
    let i = 0
    for (; i < words.length; i++) {
      const w = words[i] ?? ''
      const next = left ? `${left} ${w}` : w
      if (font.widthOfTextAtSize(next, fontSize) > maxWidth) break
      left = next
    }
    const right = words.slice(i).join(' ')
    return { first: left, second: right }
  }

  let leftParts: string[] = []
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i] ?? ''
    const candidate = [...leftParts, part].join(', ')
    if (font.widthOfTextAtSize(candidate, fontSize) > maxWidth) break
    leftParts.push(part)
  }

  if (leftParts.length === 0) {
    // Даже первый элемент не влез — режем по словам
    const words = cleaned.split(/\s+/).filter(Boolean)
    let left = ''
    let i = 0
    for (; i < words.length; i++) {
      const w = words[i] ?? ''
      const next = left ? `${left} ${w}` : w
      if (font.widthOfTextAtSize(next, fontSize) > maxWidth) break
      left = next
    }
    const right = words.slice(i).join(' ')
    return { first: left, second: right }
  }

  const left = leftParts.join(', ')
  const right = parts.slice(leftParts.length).join(', ')
  return { first: left, second: right }
}

/**
 * Подбирает кегль так, чтобы текст влез в ширину поля по одной строке.
 * Ниже 6pt не опускаемся — дальше уже нечитаемо, пусть лучше обрежется.
 */
const fitFontSize = (text: string, field: any, font: any, startSize: number) => {
  const widget = field.acroField.getWidgets()[0]
  if (!widget || !text) return startSize
  const maxWidth = widget.getRectangle().width - 4
  let size = startSize
  while (size > 6 && font.widthOfTextAtSize(text, size) > maxWidth) size -= 0.5
  return size
}

const handleDownloadPdf = async () => {
  if (typeof window === 'undefined') return

  const { PDFDocument, rgb } = await import('pdf-lib')
  const fontkit = (await import('@pdf-lib/fontkit')).default

  const templateUrl = hasSecondVin.value ? '/dkp_full.pdf' : '/dkp.pdf'
  const existingPdfBytes = await fetch(templateUrl).then(res => res.arrayBuffer())
  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  pdfDoc.registerFontkit(fontkit)
  const [firstPage] = pdfDoc.getPages()
  if (!firstPage) return

  // ВАЖНО: нужен шрифт с поддержкой кириллицы, мы используем
  // `public/fonts/Arial.ttf`. При необходимости можно поменять путь.
  const fontBytes = await fetch('/fonts/Arial.ttf').then(res => res.arrayBuffer())
  const font = await pdfDoc.embedFont(fontBytes)

  // Работаем через поля формы (AcroForm), чтобы не возиться с координатами.
  // В PDF-редакторе нужно добавить текстовые поля с нужными именами.
  try {
    const formApi = pdfDoc.getForm()
    const fontSize = 12

    const cityField = formApi.getTextField('city')
    cityField.setFontSize(fontSize)
    cityField.setText(form.city || '')

    const dateField = formApi.getTextField('date')
    dateField.setFontSize(fontSize)
    dateField.setText(form.date || '')

    const sellerText = joinCsv([
      form.sellerName,
      form.sellerBirthDate,
      form.sellerBirthPlace,
      form.sellerAddress,
      joinCsv([form.sellerPassportSeries, form.sellerPassportNumber]),
      form.sellerPassportIssuedBy,
      form.sellerPassportIssuedDate,
    ])

    const seller1Field = formApi.getTextField('seller1')
    const seller2Field = formApi.getTextField('seller2')
    const seller3Field = formApi.getTextField('seller3')
    const seller4Field = formApi.getTextField('seller4')

    seller1Field.setFontSize(fontSize)
    seller2Field.setFontSize(fontSize)
    seller3Field.setFontSize(fontSize)
    seller4Field.setFontSize(fontSize)

    // Ширину берём по первому полю (предполагаем одинаковую)
    const seller1Widget = seller1Field.acroField.getWidgets()[0]
    if (!seller1Widget) return
    const sellerRect = seller1Widget.getRectangle()
    const sellerWidth = sellerRect.width - 4

    const sellerPart1 = splitToFitField(sellerText, sellerWidth, font, fontSize)
    seller1Field.setText(sellerPart1.first)

    let remainingSeller = sellerPart1.second
    let sellerSecond = { first: '', second: '' }
    let sellerThird = { first: '', second: '' }

    if (remainingSeller) {
      sellerSecond = splitToFitField(remainingSeller, sellerWidth, font, fontSize)
      seller2Field.setText(sellerSecond.first)
      remainingSeller = sellerSecond.second
    } else {
      seller2Field.setText('')
    }

    if (remainingSeller) {
      sellerThird = splitToFitField(remainingSeller, sellerWidth, font, fontSize)
      seller3Field.setText(sellerThird.first)
      remainingSeller = sellerThird.second
    } else {
      seller3Field.setText('')
    }

    seller4Field.setText(remainingSeller || '')

    const buyerText = joinCsv([
      form.buyerName,
      form.buyerBirthDate,
      form.buyerBirthPlace,
      form.buyerAddress,
      joinCsv([form.buyerPassportSeries, form.buyerPassportNumber]),
      form.buyerPassportIssuedBy,
      form.buyerPassportIssuedDate,
    ])

    const buyer1Field = formApi.getTextField('buyer1')
    const buyer2Field = formApi.getTextField('buyer2')
    const buyer3Field = formApi.getTextField('buyer3')
    const buyer4Field = formApi.getTextField('buyer4')

    buyer1Field.setFontSize(fontSize)
    buyer2Field.setFontSize(fontSize)
    buyer3Field.setFontSize(fontSize)
    buyer4Field.setFontSize(fontSize)

    // Ширину берём по первому полю (предполагаем одинаковую)
    const buyer1Widget = buyer1Field.acroField.getWidgets()[0]
    if (!buyer1Widget) return
    const buyerRect = buyer1Widget.getRectangle()
    const buyerWidth = buyerRect.width - 4 // небольшой паддинг

    const buyerPart1 = splitToFitField(buyerText, buyerWidth, font, fontSize)
    buyer1Field.setText(buyerPart1.first)

    let remainingBuyer = buyerPart1.second
    let buyerSecond = { first: '', second: '' }
    let buyerThird = { first: '', second: '' }

    if (remainingBuyer) {
      buyerSecond = splitToFitField(remainingBuyer, buyerWidth, font, fontSize)
      buyer2Field.setText(buyerSecond.first)
      remainingBuyer = buyerSecond.second
    } else {
      buyer2Field.setText('')
    }

    if (remainingBuyer) {
      buyerThird = splitToFitField(remainingBuyer, buyerWidth, font, fontSize)
      buyer3Field.setText(buyerThird.first)
      remainingBuyer = buyerThird.second
    } else {
      buyer3Field.setText('')
    }

    buyer4Field.setText(remainingBuyer || '')

    // Раздел «Автомобиль», ПТС/СТС и стоимость.
    // Заполняем по одному полю: если в шаблоне какого-то не окажется,
    // потеряем только его, а не весь блок.
    const simpleFields: Array<[string, string, number?]> = [
      ['model', form.carMakeModel],
      ['vin', form.vin],
      ['type', form.carType],
      ['create_year', form.carYear],
      ['value', form.power],
      ['value_cub', form.engineVolume],
      ['color', form.color],
      ['motor_number', form.engineModelNumber],
      ['nomer_shasi', form.chassisNumber],
      ['body_number', form.bodyNumber],
      ['passport_auto', form.ptsSeriesNumber],
      ['kem_vidan', form.ptsIssuedBy, 8],
      ['date_vidachi', form.ptsIssuedDate, 8],
      ['gos_nomer', form.plateNumber, 9],
      ['Number_sts', form.stsSeriesNumber, 9],
      ['sts_vidano', form.stsIssuedBy, 8],
      ['date_sts', form.stsIssuedDate, 9],
      ['price', form.price, 10],
      ['price_word', amountInWordsRu(form.price), 8],
    ]

    // Строка под дополнительный VIN есть только в полном бланке
    if (hasSecondVin.value) simpleFields.push(['second_vin', form.secondVin])

    for (const [name, value, size] of simpleFields) {
      try {
        const field = formApi.getTextField(name)
        field.setFontSize(fitFontSize(value || '', field, font, size ?? fontSize))
        field.setText(value || '')
      } catch {
        // поля нет в шаблоне — пропускаем
      }
    }

    // Перестраиваем внешность полей, чтобы использовать наш шрифт с кириллицей
    formApi.updateFieldAppearances(font)
  } catch {
    // Если формы нет или поле названо иначе — просто не заполняем, без ошибки
  }

  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }

  previewUrl.value = url
}
</script>

<template>
  <div class="pdf-page">
    <div class="pdf-page__hero">
      <div class="pdf-page__hero-inner">
        <NuxtLink to="/" class="pdf-page__back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          На главную
        </NuxtLink>
        <h1 class="pdf-page__title">Договор купли-продажи автомобиля</h1>
        <p class="pdf-page__lead">
          Заполните данные продавца, покупателя и автомобиля — договор соберётся на актуальном бланке
          и откроется готовым к печати PDF. Бесплатно и без регистрации.
        </p>
      </div>
    </div>

    <div class="pdf-page__section">
      <div class="pdf-page__card">
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Город</label>
            <input v-model="form.city" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Дата</label>
            <input v-model="form.date" type="text" class="pdf-page__input" />
          </div>
        </div>

        <h2 class="pdf-page__section-title">Продавец</h2>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">ФИО</label>
            <input v-model="form.sellerName" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Дата рождения</label>
            <input v-model="form.sellerBirthDate" type="text" class="pdf-page__input" />
          </div>
        </div>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Место рождения</label>
            <input v-model="form.sellerBirthPlace" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Адрес регистрации</label>
            <input v-model="form.sellerAddress" type="text" class="pdf-page__input" />
          </div>
        </div>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Паспорт: серия и номер</label>
            <input v-model="form.sellerPassportSeries" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Кем и когда выдан</label>
            <input v-model="form.sellerPassportIssuedBy" type="text" class="pdf-page__input" />
          </div>
        </div>

        <h2 class="pdf-page__section-title">Покупатель</h2>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">ФИО</label>
            <input v-model="form.buyerName" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Дата рождения</label>
            <input v-model="form.buyerBirthDate" type="text" class="pdf-page__input" />
          </div>
        </div>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Место рождения</label>
            <input v-model="form.buyerBirthPlace" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Адрес регистрации</label>
            <input v-model="form.buyerAddress" type="text" class="pdf-page__input" />
          </div>
        </div>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Паспорт: серия и номер</label>
            <input v-model="form.buyerPassportSeries" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Кем и когда выдан</label>
            <input v-model="form.buyerPassportIssuedBy" type="text" class="pdf-page__input" />
          </div>
        </div>

        <h2 class="pdf-page__section-title">Автомобиль</h2>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Марка, модель</label>
            <input v-model="form.carMakeModel" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Тип ТС (легковой, грузовой и т.п.)</label>
            <input v-model="form.carType" type="text" class="pdf-page__input" />
          </div>
        </div>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Год выпуска</label>
            <input v-model="form.carYear" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">VIN</label>
            <input v-model="form.vin" type="text" class="pdf-page__input" />
          </div>
        </div>
        <label class="pdf-page__toggle">
          <input v-model="hasSecondVin" type="checkbox" class="pdf-page__toggle-input" />
          <span class="pdf-page__toggle-track" aria-hidden="true"><span class="pdf-page__toggle-thumb" /></span>
          <span class="pdf-page__toggle-text">Есть дополнительный идентификационный номер (VIN)</span>
        </label>
        <div v-if="hasSecondVin" class="pdf-page__form-group">
          <label class="pdf-page__label">Дополнительный VIN</label>
          <input v-model="form.secondVin" type="text" class="pdf-page__input" />
        </div>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Мощность, л.с.</label>
            <input v-model="form.power" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Рабочий объём двигателя, куб. см</label>
            <input v-model="form.engineVolume" type="text" class="pdf-page__input" />
          </div>
        </div>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Цвет кузова</label>
            <input v-model="form.color" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Гос. номер</label>
            <input v-model="form.plateNumber" type="text" class="pdf-page__input" />
          </div>
        </div>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Модель и номер двигателя</label>
            <input v-model="form.engineModelNumber" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Номер шасси, рамы</label>
            <input v-model="form.chassisNumber" type="text" class="pdf-page__input" />
          </div>
        </div>
        <div class="pdf-page__form-group">
          <label class="pdf-page__label">Номер кузова</label>
          <input v-model="form.bodyNumber" type="text" class="pdf-page__input" />
        </div>

        <h2 class="pdf-page__section-title">Документы на автомобиль</h2>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">ПТС, серия и номер</label>
            <input v-model="form.ptsSeriesNumber" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">ПТС, дата выдачи</label>
            <input v-model="form.ptsIssuedDate" type="text" class="pdf-page__input" placeholder="12.05.2020" />
          </div>
        </div>
        <div class="pdf-page__form-group">
          <label class="pdf-page__label">ПТС, кем выдан</label>
          <input v-model="form.ptsIssuedBy" type="text" class="pdf-page__input" />
        </div>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">СТС, серия и номер</label>
            <input v-model="form.stsSeriesNumber" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">СТС, дата выдачи</label>
            <input v-model="form.stsIssuedDate" type="text" class="pdf-page__input" placeholder="12.05.2020" />
          </div>
        </div>
        <div class="pdf-page__form-group">
          <label class="pdf-page__label">СТС, кем выдано</label>
          <input v-model="form.stsIssuedBy" type="text" class="pdf-page__input" />
        </div>

        <h2 class="pdf-page__section-title">Стоимость</h2>
        <div class="pdf-page__form-group">
          <label class="pdf-page__label">Цена (₽)</label>
          <input v-model="form.price" type="text" class="pdf-page__input" />
          <p v-if="priceInWords" class="pdf-page__hint">Прописью: {{ priceInWords }} рублей</p>
        </div>

        <button type="button" class="pdf-page__btn" @click="handleDownloadPdf">
          Сформировать договор
        </button>
        <p class="pdf-page__note">
          Договор откроется ниже — оттуда его можно сохранить или сразу распечатать.
        </p>
      </div>

      <iframe
        v-if="previewUrl"
        :src="previewUrl"
        class="pdf-preview"
        title="Готовый договор купли-продажи"
      />
    </div>

    <!-- Макет договора оставляем только для печати -->
    <div class="pdf-doc pdf-doc--print">
      <h1 class="pdf-doc__title">Договор купли-продажи транспортного средства</h1>

      <p class="pdf-doc__row">
        Место составления: {{ form.city || '________________' }}<br>
        Дата составления: {{ form.date || '«___» __________ 20___ г.' }}
      </p>

      <p class="pdf-doc__paragraph">
        Гражданин(ка) {{ form.sellerName || '________________' }}, {{ form.sellerBirthDate || 'дата рождения' }},
        место рождения: {{ form.sellerBirthPlace || '________________' }}, адрес места жительства:
        {{ form.sellerAddress || '________________' }}, паспорт: {{ form.sellerPassportSeries || 'серия и номер' }},
        выдан {{ form.sellerPassportIssuedBy || 'кем и когда выдан' }}, именуемый(ая) в дальнейшем «Продавец», с
        одной стороны, и гражданин(ка) {{ form.buyerName || '________________' }},
        {{ form.buyerBirthDate || 'дата рождения' }}, место рождения:
        {{ form.buyerBirthPlace || '________________' }}, адрес места жительства:
        {{ form.buyerAddress || '________________' }}, паспорт:
        {{ form.buyerPassportSeries || 'серия и номер' }}, выдан
        {{ form.buyerPassportIssuedBy || 'кем и когда выдан' }}, именуемый(ая) в дальнейшем «Покупатель», с другой
        стороны, совместно именуемые «Стороны», заключили настоящий договор купли-продажи транспортного средства
        (далее — «Договор») о нижеследующем:
      </p>

      <h2 class="pdf-doc__subtitle">1. Предмет договора</h2>
      <p class="pdf-doc__paragraph">
        1.1. Продавец обязуется передать в собственность Покупателя, а Покупатель принять и
        оплатить следующее транспортное средство (далее — «ТС»):
      </p>
      <ul class="pdf-doc__list">
        <li>Марка и модель ТС: {{ form.carMakeModel || '________________' }}</li>
        <li>Тип ТС: {{ form.carType || '________________' }}</li>
        <li>Год изготовления ТС: {{ form.carYear || '____' }}</li>
        <li>Идентификационный номер (VIN): {{ form.vin || '________________' }}</li>
        <li v-if="hasSecondVin">Дополнительный идентификационный номер (VIN): {{ form.secondVin || '________________' }}</li>
        <li>Мощность двигателя, л.с.: {{ form.power || '________________' }}</li>
        <li>Рабочий объём двигателя, куб. см: {{ form.engineVolume || '________________' }}</li>
        <li>Цвет кузова: {{ form.color || '________________' }}</li>
        <li>Государственный регистрационный знак: {{ form.plateNumber || '________________' }}</li>
      </ul>

      <p class="pdf-doc__paragraph">
        1.2. Собственником ТС до передачи его Покупателю является Продавец.
      </p>
      <p class="pdf-doc__paragraph">
        1.3. Право собственности на ТС переходит к Покупателю с момента подписания настоящего
        Договора Сторонами и фактической передачи ТС.
      </p>

      <h2 class="pdf-doc__subtitle">2. Цена и порядок расчётов</h2>
      <p class="pdf-doc__paragraph">
        2.1. Стоимость ТС по настоящему Договору составляет
        {{ form.price ? form.price + ' (рублей).' : '________________ (рублей).' }}
      </p>
      <p class="pdf-doc__paragraph">
        2.2. Расчёты между Сторонами производятся единовременно в день подписания настоящего
        Договора наличными денежными средствами или иным согласованным Сторонами способом.
      </p>

      <h2 class="pdf-doc__subtitle">3. Гарантии Продавца</h2>
      <p class="pdf-doc__paragraph">
        3.1. Продавец гарантирует, что на момент заключения настоящего Договора:
      </p>
      <ul class="pdf-doc__list">
        <li>ТС принадлежит Продавцу на праве собственности;</li>
        <li>ТС не находится в залоге, под арестом, не является предметом спора;</li>
        <li>в отношении ТС не наложен запрет на регистрационные действия;</li>
        <li>ТС не числится в розыске и не имеет иных скрытых обременений.</li>
      </ul>

      <h2 class="pdf-doc__subtitle">4. Дополнительные условия</h2>
      <p class="pdf-doc__paragraph">
        Дополнительные условия отсутствуют либо будут согласованы Сторонами отдельно и оформлены
        дополнительным документом.
      </p>

      <h2 class="pdf-doc__subtitle">5. Заключительные положения</h2>
      <p class="pdf-doc__paragraph">
        5.1. Настоящий Договор вступает в силу с момента его подписания Сторонами и действует до
        полного исполнения Сторонами своих обязательств.
      </p>
      <p class="pdf-doc__paragraph">
        5.2. Договор составлен в двух экземплярах, имеющих равную юридическую силу, по одному для
        каждой из Сторон.
      </p>

      <h2 class="pdf-doc__subtitle">6. Подписи сторон</h2>
      <div class="pdf-doc__sign-row">
        <div class="pdf-doc__sign-col">
          <div class="pdf-doc__sign-label">Продавец</div>
          <div class="pdf-doc__sign-line" />
          <div class="pdf-doc__sign-name">{{ form.sellerName || '________________' }}</div>
        </div>
        <div class="pdf-doc__sign-col">
          <div class="pdf-doc__sign-label">Покупатель</div>
          <div class="pdf-doc__sign-line" />
          <div class="pdf-doc__sign-name">{{ form.buyerName || '________________' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pdf-page {
  padding-top: 96px;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding-top: 88px;
  }
}

.pdf-page__hero {
  background: var(--color-dark);
  color: #fff;
  padding: 64px 24px 56px;
  text-align: center;
}

.pdf-page__hero-inner {
  max-width: 760px;
  margin: 0 auto;
}

.pdf-page__back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  margin-bottom: 32px;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-accent);
  }
}

.pdf-page__title {
  font-size: clamp(28px, 4.5vw, 42px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin: 0 0 16px;
}

.pdf-page__lead {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.55;
  margin: 0;
}

.pdf-page__section {
  padding: 56px 24px 80px;

  @media (max-width: 720px) {
    padding: 40px 20px 56px;
  }
}

.pdf-page__card {
  max-width: 820px;
  margin: 0 auto;
  padding: 36px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);

  @media (max-width: 720px) {
    padding: 24px 20px;
  }
}

.pdf-page__section-title {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin: 32px 0 14px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
  color: var(--color-dark);

  &:first-child {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
  }
}

.pdf-page__form-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

.pdf-page__form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.pdf-page__form-grid .pdf-page__form-group {
  margin-bottom: 0;
}

.pdf-page__label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.pdf-page__hint {
  margin: 2px 0 0;
  font-size: 13px;
  line-height: 1.45;
  color: var(--color-text-muted);
}

.pdf-page__input {
  width: 100%;
  padding: 13px 16px;
  font-size: 15px;
  font-family: inherit;
  color: var(--color-dark);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  &::placeholder {
    color: var(--color-text-muted);
  }

  &:focus {
    outline: none;
    background: var(--color-surface);
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-accent-soft);
  }
}

.pdf-page__toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 16px;
  padding: 14px 16px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: var(--color-border-strong);
  }
}

.pdf-page__toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.pdf-page__toggle-track {
  flex: 0 0 auto;
  width: 42px;
  height: 24px;
  border-radius: 999px;
  background: var(--color-border-strong);
  padding: 3px;
  box-sizing: border-box;
  transition: background 0.2s ease;
}

.pdf-page__toggle-thumb {
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease;
}

.pdf-page__toggle-input:checked + .pdf-page__toggle-track {
  background: var(--color-accent);
}

.pdf-page__toggle-input:checked + .pdf-page__toggle-track .pdf-page__toggle-thumb {
  transform: translateX(18px);
}

.pdf-page__toggle-input:focus-visible + .pdf-page__toggle-track {
  box-shadow: 0 0 0 3px var(--color-accent-soft);
}

.pdf-page__toggle-text {
  font-size: 15px;
  color: var(--color-text);
  line-height: 1.45;
}

.pdf-page__btn {
  width: 100%;
  margin-top: 8px;
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
  box-shadow: var(--shadow-orange);

  &:hover {
    background: var(--color-accent-hover);
    box-shadow: 0 6px 24px rgba(249, 115, 22, 0.45);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

.pdf-page__note {
  margin: 12px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-text-muted);
  text-align: center;
}

.pdf-preview {
  display: block;
  width: 100%;
  max-width: 820px;
  height: 900px;
  margin: 24px auto 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  background: var(--color-surface);

  @media (max-width: 720px) {
    height: 620px;
  }
}

.pdf-doc {
  width: 100%;
  max-width: 794px;
  min-height: 1123px;
  background: #ffffff;
  color: #111827;
  padding: 28px 32px;
  box-sizing: border-box;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.1);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 13px;
  line-height: 1.5;
}

.pdf-doc--print {
  display: none;
  margin: 0 auto;
}

.pdf-doc__title {
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 12px;
}

.pdf-doc__center-title {
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 12px;
}

.pdf-doc__row {
  font-size: 13px;
  margin: 0 0 12px;
  text-align: right;
}

.pdf-doc__paragraph {
  margin: 0 0 10px;
  text-align: justify;
}

.pdf-doc__subtitle {
  font-size: 14px;
  font-weight: 700;
  margin: 12px 0 6px;
}

.pdf-doc__list {
  margin: 0 0 10px 18px;
  padding: 0;
}

.pdf-doc__sign-row {
  display: flex;
  gap: 40px;
  margin-top: 18px;
}

.pdf-doc__sign-col {
  flex: 1;
}

.pdf-doc__sign-label {
  font-size: 13px;
  margin-bottom: 4px;
}

.pdf-doc__sign-line {
  border-bottom: 1px solid #111827;
  height: 24px;
  margin-bottom: 4px;
}

.pdf-doc__sign-name {
  font-size: 13px;
}

@media (max-width: 960px) {
  .pdf-doc {
    min-height: auto;
  }
}

/* Скрываем интерфейс при печати, оставляем только макет договора */
@media print {
  /* Скрываем глобальные хедер/футер сайта при печати договора */
  :global(header),
  :global(footer),
  :global(.header),
  :global(.footer) {
    display: none !important;
  }

  .pdf-page {
    padding: 0;
    background: #ffffff;
  }

  .pdf-page__hero,
  .pdf-page__section,
  .pdf-preview {
    display: none !important;
  }

  .pdf-doc {
    box-shadow: none;
    padding: 0;
    margin: 0;
    max-width: 100%;
    width: 100%;
  }

  .pdf-doc--print {
    display: block;
  }

  .pdf-doc {
    page-break-after: avoid;
  }
}
</style>

