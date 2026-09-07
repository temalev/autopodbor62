<script setup lang="ts">
import {
  SITE_URL,
  breadcrumbJsonLd,
  faqPageJsonLd,
  jsonLdScript,
} from '../../utils/schema'
import { REGION_TAX, TAX_YEARS, groupsFor, rateFor, type TaxYear } from '../../utils/transportTax'

/**
 * Транспортный налог — региональный. Единой ставки по стране нет: НК РФ задаёт
 * базовые, а субъект вправе поднять их до десяти раз, и почти все подняли.
 * Поэтому считаем по таблице выбранного региона, а не по одной шкале.
 *
 * Регионы устроены по-разному: у большинства пять диапазонов по мощности,
 * но часть различает ставку по возрасту автомобиля или стране изготовления.
 * Такие условия лежат в данных отдельными группами и выбираются в форме —
 * подставлять их автоматически нельзя, формулировки у регионов свои.
 */
const LUXURY_MULTIPLIER = 3

const regions = REGION_TAX.slice().sort((a, b) => a[1].localeCompare(b[1], 'ru'))

const regionCode = ref('62')
const year = ref<TaxYear>(2025)
const groupIdx = ref(0)
const power = ref(150)
const months = ref(12)
const luxury = ref(false)

const num = (v: unknown) => {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? n : 0
}

const region = computed(() => regions.find((r) => r[0] === regionCode.value) ?? regions[0])
const groups = computed(() => groupsFor(region.value, year.value))
const hasChoice = computed(() => (groups.value?.length ?? 0) > 1)
const group = computed(() => groups.value?.[Math.min(groupIdx.value, (groups.value?.length ?? 1) - 1)] ?? null)

/** Год, за который у региона нет таблицы, в переключателе не показываем. */
const availableYears = computed(() => TAX_YEARS.filter((y) => groupsFor(region.value, y)))

watch([regionCode, year], () => { groupIdx.value = 0 })
watch(availableYears, (list) => {
  if (list.length && !list.includes(year.value)) year.value = list[0]
})

const condLabel = (c: string) => c || 'Основная ставка'

const monthsUsed = computed(() => Math.min(12, Math.max(1, Math.round(num(months.value) || 12))))
const rate = computed(() => (group.value ? rateFor(group.value, num(power.value)) : 0))

const tax = computed(() => {
  const hp = num(power.value)
  if (!hp || !group.value) return 0
  const base = rate.value * hp * (monthsUsed.value / 12)
  return luxury.value ? base * LUXURY_MULTIPLIER : base
})

/** Сумма за оба года — видно, менял ли регион ставку. */
const byYear = computed(() =>
  availableYears.value.map((y) => {
    const gs = groupsFor(region.value, y)
    const g = gs?.[Math.min(groupIdx.value, gs.length - 1)]
    const r = g ? rateFor(g, num(power.value)) : 0
    const base = r * num(power.value) * (monthsUsed.value / 12)
    return { year: y, rate: r, sum: luxury.value ? base * LUXURY_MULTIPLIER : base }
  }),
)

const dueBy = (y: number) => `до 1 декабря ${y + 1} года`

const bandLabel = (to: number, i: number, bands: readonly (readonly [number, number])[]) => {
  const f = (n: number) => n.toLocaleString('ru-RU')
  if (i === 0) return `до ${f(to)} л.с.`
  const prev = bands[i - 1][0]
  return to === 0 ? `свыше ${f(prev)} л.с.` : `свыше ${f(prev)} до ${f(to)} л.с.`
}

function fmtRub(v: number) {
  return Math.round(v).toLocaleString('ru-RU')
}

const faqItems = [
  {
    question: 'Почему нельзя посчитать транспортный налог по единой ставке для всей России?',
    answer:
      'Потому что налог региональный. Налоговый кодекс задаёт базовые ставки — 2,5 ₽ за л.с. до 100 л.с. и так далее, — но статья 361 разрешает субъектам увеличивать или уменьшать их до десяти раз. Почти все регионы этим воспользовались, поэтому одна и та же машина в разных субъектах облагается по-разному. Калькулятор считает по таблице выбранного региона.',
  },
  {
    question: 'Как считается транспортный налог на автомобиль?',
    answer:
      'Ставка за одну лошадиную силу умножается на мощность двигателя и на долю года, которую вы владели машиной. Для автомобилей средней стоимостью от 10 млн рублей из перечня Минпромторга результат умножается ещё на 3. Ставка зависит от региона регистрации, мощности, а в части регионов — ещё и от возраста автомобиля.',
  },
  {
    question: 'Почему в некоторых регионах нужно выбирать возраст автомобиля?',
    answer:
      'Часть субъектов различает ставку не только по мощности, но и по возрасту машины: например, в Приморском крае, Бурятии и Пермском крае для машин до трёх или до пяти лет ставка одна, а для более старых другая. Есть регионы, где отдельная ставка действует для автомобилей, произведённых в России и СССР. Если у выбранного региона такие условия есть, в форме появляется дополнительный переключатель.',
  },
  {
    question: 'Я купил машину в середине года — за сколько месяцев платить?',
    answer:
      'За те месяцы, когда автомобиль был зарегистрирован на вас. Месяц считается полным, если машину поставили на учёт до 15 числа включительно или сняли с учёта после 15 числа. Если поставили после 15-го, этот месяц не учитывается. Продавец платит за свою часть года, покупатель за свою.',
  },
  {
    question: 'Когда платить транспортный налог?',
    answer:
      'Физические лица платят не позднее 1 декабря года, следующего за отчётным: за 2025 год — до 1 декабря 2026 года, за 2026-й — до 1 декабря 2027-го. Считать самому не нужно, налоговая присылает уведомление с готовой суммой.',
  },
]

const relatedServices = [
  {
    to: '/registraciya-gibdd',
    title: 'Регистрация в ГИБДД',
    description: 'Поставим машину на учёт без очередей — документы, МРЭО, осмотр и номера.',
  },
  {
    to: '/dkp',
    title: 'Договор купли-продажи',
    description: 'Заполним бланк ДКП без ошибок — чтобы налог не пришёл за проданную машину.',
  },
  {
    to: '/podbor',
    title: 'Подбор автомобиля под ключ',
    description: 'Подберём машину под ваш бюджет — с учётом того, во что обойдётся содержание.',
  },
]

const PAGE_URL = `${SITE_URL}/registraciya-gibdd/transportnyy-nalog/`
const PAGE_TITLE = 'Калькулятор транспортного налога 2026 по регионам'
const PAGE_DESCRIPTION =
  'Расчёт транспортного налога на автомобиль по ставкам вашего региона за 2025 и 2026 годы: мощность, возраст, месяцы владения и повышающий коэффициент.'
const PAGE_OG_IMAGE = `${SITE_URL}/images/services/1.jpeg`

useHead({
  title: PAGE_TITLE,
  meta: [
    { name: 'description', content: PAGE_DESCRIPTION },
    { property: 'og:url', content: PAGE_URL },
    { property: 'og:title', content: PAGE_TITLE },
    { property: 'og:description', content: PAGE_DESCRIPTION },
    { property: 'og:image', content: PAGE_OG_IMAGE },
    { name: 'twitter:image', content: PAGE_OG_IMAGE },
  ],
  link: [{ rel: 'canonical', href: PAGE_URL }],
  script: [
    jsonLdScript(
      breadcrumbJsonLd([
        { name: 'Главная', url: `${SITE_URL}/` },
        { name: 'Регистрация в ГИБДД', url: `${SITE_URL}/registraciya-gibdd/` },
        { name: 'Калькулятор транспортного налога', url: PAGE_URL },
      ]),
      'ld-tax-breadcrumbs',
    ),
    jsonLdScript(faqPageJsonLd(faqItems), 'ld-tax-faq'),
  ],
})
</script>

<template>
  <div class="tax-page">

    <div class="tax-page__hero">
      <div class="tax-page__container">
        <NuxtLink to="/registraciya-gibdd" class="tax-page__back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Регистрация в ГИБДД
        </NuxtLink>
        <p class="tax-page__label">Расчёт налога</p>
        <h1 class="tax-page__title">Калькулятор транспортного налога по регионам России</h1>
        <p class="tax-page__lead">Единой ставки по стране нет: налог региональный, и субъект вправе поднять базовую ставку до десяти раз. Выберите регион — калькулятор посчитает по его таблице за 2025 и 2026 годы, с учётом мощности, возраста и месяцев владения.</p>
      </div>
    </div>

    <section class="tax-page__section">
      <div class="tax-page__container">
        <div class="calc">

          <form class="calc__form" @submit.prevent>
            <h2 class="calc__form-title">Автомобиль и регион</h2>

            <div class="calc__field">
              <label class="calc__label" for="tax-region">Регион регистрации</label>
              <select id="tax-region" v-model="regionCode" class="calc__input">
                <option v-for="r in regions" :key="r[0]" :value="r[0]">{{ r[1] }}</option>
              </select>
              <p class="calc__hint">Налог платится по месту регистрации автомобиля, а не по месту покупки.</p>
            </div>

            <div class="calc__field">
              <label class="calc__label" for="tax-power">Мощность двигателя, л.с.</label>
              <input id="tax-power" v-model.number="power" type="number" min="1" step="1" inputmode="numeric" class="calc__input calc__input--narrow">
              <p class="calc__hint">Берётся из СТС или ПТС. Если мощность указана в киловаттах, умножьте на 1,36.</p>
            </div>

            <div v-if="hasChoice" class="calc__field">
              <span class="calc__label">Условие в этом регионе</span>
              <div class="calc__radios">
                <label v-for="(g, i) in groups" :key="i" class="calc__radio" :class="{ 'calc__radio--on': groupIdx === i }">
                  <input v-model="groupIdx" type="radio" name="cond" :value="i">
                  <span>{{ condLabel(g[0]) }}</span>
                </label>
              </div>
              <p class="calc__hint">{{ region[1] }} различает ставку не только по мощности — выберите то, что подходит вашей машине.</p>
            </div>

            <div class="calc__field">
              <span class="calc__label">Налоговый период</span>
              <div class="calc__radios">
                <label v-for="y in availableYears" :key="y" class="calc__radio" :class="{ 'calc__radio--on': year === y }">
                  <input v-model="year" type="radio" name="year" :value="y">
                  <span>За {{ y }} год</span>
                </label>
              </div>
              <p class="calc__hint">Налог платится в следующем году: за {{ year }}-й — {{ dueBy(year) }}.</p>
            </div>

            <div class="calc__field">
              <label class="calc__label" for="tax-months">Месяцев владения в году</label>
              <input id="tax-months" v-model.number="months" type="number" min="1" max="12" step="1" inputmode="numeric" class="calc__input calc__input--narrow">
              <p class="calc__hint">Месяц считается полным, когда автомобиль поставлен на учёт до 15 числа включительно или снят с учёта после 15-го.</p>
            </div>

            <div class="calc__field">
              <label class="calc__check" :class="{ 'calc__check--on': luxury }">
                <input v-model="luxury" type="checkbox">
                <span>Автомобиль из перечня Минпромторга — от 10 млн ₽</span>
              </label>
              <p class="calc__hint">Перечень публикуется на сайте Минпромторга и обновляется каждый год. Для машин из него налог умножается на 3.</p>
            </div>
          </form>

          <div class="calc__result">
            <h2 class="calc__result-title">Налог за {{ year }} год</h2>

            <div class="calc__total">
              <span class="calc__total-sum">{{ fmtRub(tax) }} ₽</span>
              <span class="calc__total-due">заплатить {{ dueBy(year) }}</span>
            </div>

            <div class="calc__rows">
              <div class="calc__row">
                <div class="calc__row-head">
                  <span class="calc__row-name">Ставка в вашем диапазоне</span>
                  <span class="calc__row-sum">{{ rate }} ₽ за л.с.</span>
                </div>
                <p class="calc__row-note">{{ region[1] }}<span v-if="group && group[0]">, {{ condLabel(group[0]).toLowerCase() }}</span>.</p>
              </div>

              <div class="calc__row">
                <div class="calc__row-head">
                  <span class="calc__row-name">Расчёт</span>
                </div>
                <p class="calc__row-note">
                  {{ rate }} ₽ × {{ num(power) }} л.с.<span v-if="monthsUsed !== 12"> × {{ monthsUsed }}/12 месяцев</span><span v-if="luxury"> × 3 за дорогой автомобиль</span>
                </p>
              </div>
            </div>

            <div v-if="byYear.length > 1" class="calc__compare">
              <p class="calc__compare-title">Как менялась сумма</p>
              <div v-for="row in byYear" :key="row.year" class="calc__compare-row" :class="{ 'calc__compare-row--on': row.year === year }">
                <span>За {{ row.year }} год</span>
                <span class="calc__compare-rate">{{ row.rate }} ₽ за л.с.</span>
                <span class="calc__compare-sum">{{ fmtRub(row.sum) }} ₽</span>
              </div>
            </div>

            <p class="calc__disclaimer">Расчёт справочный. Итоговую сумму считает налоговая и присылает в уведомлении — самому декларировать транспортный налог не нужно. Льготы здесь не учитываются: их состав и условия регион задаёт отдельно, проверить своё право можно в личном кабинете на сайте ФНС.</p>
          </div>

        </div>
      </div>
    </section>

    <section class="tax-page__section tax-page__section--alt">
      <div class="tax-page__container">
        <h2 class="tax-page__h2">Ставки: {{ region[1] }}, {{ year }} год</h2>
        <p class="tax-page__intro">Полная шкала для легковых автомобилей в выбранном регионе. У большинства субъектов это пять диапазонов по мощности, но встречаются шкалы с шагом в 25 л.с. и отдельными ставками по возрасту машины.</p>

        <div v-for="(g, gi) in groups" :key="gi" class="tax-page__tablewrap">
          <table class="tax-page__table">
            <caption v-if="hasChoice">{{ condLabel(g[0]) }}</caption>
            <thead>
              <tr><th>Мощность двигателя</th><th>Ставка за л.с.</th></tr>
            </thead>
            <tbody>
              <tr v-for="(b, bi) in g[1]" :key="bi">
                <td>{{ bandLabel(b[0], bi, g[1]) }}</td>
                <td>{{ b[1] }} ₽</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="tax-page__source">Ставки за 2025 и 2026 годы по сводным таблицам, сверенным с законом Рязанской области № 76-ОЗ: 10/20/45/75/150 за 2025 год и 15/25/45/75/150 за 2026-й — совпало точно. Данные по региону и льготы стоит проверять в <a href="https://www.nalog.gov.ru/rn62/service/tax/" target="_blank" rel="noopener noreferrer">справочнике ФНС</a>.</p>
      </div>
    </section>

    <section class="tax-page__section">
      <div class="tax-page__container">
        <h2 class="tax-page__h2">Что стоит знать про этот налог</h2>
        <ul class="tax-page__list">
          <li><strong>Считать самому не нужно.</strong> Налоговая присылает уведомление с готовой суммой. Калькулятор нужен, чтобы понимать сумму заранее — например, когда выбираете между двумя машинами.</li>
          <li><strong>Мощность решает больше, чем кажется.</strong> Диапазоны не плавные: в Рязанской области 150 л.с. это 25 ₽ за силу, а 151 л.с. уже 45 ₽ — 3 750 ₽ против 6 795 ₽ в год на одной лошадиной силе.</li>
          <li><strong>Регион имеет значение.</strong> Одна и та же машина в разных субъектах облагается по-разному, потому что ставку устанавливает регион. Переключите регион в форме и сравните.</li>
          <li><strong>Налог привязан к учёту, а не к владению.</strong> Пока машина числится на вас в ГИБДД, налог идёт вам, даже если автомобиль давно продан по договору. Поэтому важно, чтобы покупатель поставил её на учёт.</li>
        </ul>
      </div>
    </section>

    <section class="tax-page__section tax-page__section--alt">
      <div class="tax-page__container">
        <h2 class="tax-page__h2">Частые вопросы</h2>
        <div class="tax-page__faq">
          <details v-for="item in faqItems" :key="item.question" class="tax-page__faq-item">
            <summary class="tax-page__faq-q">{{ item.question }}</summary>
            <p class="tax-page__faq-a">{{ item.answer }}</p>
          </details>
        </div>
      </div>
    </section>

    <RelatedServices :items="relatedServices" subheading="Пригодится тем, кто покупает или продаёт машину" />
  </div>
</template>

<style scoped lang="scss">
.tax-page {
  min-height: 100vh;
}

.tax-page__hero {
  background: var(--color-dark);
  color: #fff;
  padding: 128px 24px 56px;

  @media (max-width: 768px) {
    padding: 112px 20px 48px;
  }
}

.tax-page__container {
  max-width: 900px;
  margin: 0 auto;
}

.tax-page__back {
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

.tax-page__label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-accent);
  margin: 0 0 12px;
}

.tax-page__title {
  font-size: clamp(28px, 4.6vw, 44px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.12;
  margin: 0 0 16px;
}

.tax-page__lead {
  font-size: 17px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  max-width: 640px;
}

.tax-page__section {
  padding: 56px 24px;

  @media (max-width: 720px) {
    padding: 44px 20px;
  }

  &--alt {
    background: var(--color-bg-alt);
  }
}

.tax-page__h2 {
  font-size: clamp(22px, 3.5vw, 28px);
  font-weight: 800;
  color: var(--color-dark);
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin: 0 0 20px;
}

.tax-page__intro {
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-text);
  margin: 0 0 24px;
  max-width: 68ch;
}

.tax-page__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 14px;

  li {
    position: relative;
    padding-left: 22px;
    font-size: 16px;
    line-height: 1.7;
    color: var(--color-text);

    &::before {
      content: '';
      position: absolute;
      left: 4px;
      top: 11px;
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
  margin-bottom: 22px;

  &:last-child {
    margin-bottom: 0;
  }
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

.calc__check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.45;

  input {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin: 1px 0 0;
    accent-color: var(--color-accent);
    cursor: pointer;
  }

  &--on {
    color: var(--color-dark);
  }
}

.calc__hint {
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-text-muted);
  margin: 8px 0 0;
}

.calc__total {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
}

.calc__total-sum {
  font-size: clamp(30px, 5vw, 42px);
  font-weight: 800;
  color: var(--color-dark);
  letter-spacing: -0.03em;
  line-height: 1.05;
  font-variant-numeric: tabular-nums;
}

.calc__total-due {
  font-size: 14px;
  color: var(--color-text-muted);
}

.calc__rows {
  display: grid;
  gap: 14px;
  padding: 20px 0;
  border-bottom: 1px solid var(--color-border);
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
  font-size: 15px;
  font-weight: 700;
  color: var(--color-dark);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.calc__row-note {
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-text-muted);
  margin: 5px 0 0;
  font-variant-numeric: tabular-nums;
}

.calc__compare {
  padding: 18px 0 0;
}

.calc__compare-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--color-text-muted);
  margin: 0 0 10px;
}

.calc__compare-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 12px;
  align-items: baseline;
  padding: 7px 10px;
  border-radius: 8px;
  font-size: 14px;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;

  &--on {
    background: var(--color-accent-bg);
    color: var(--color-dark);
    font-weight: 600;
  }
}

.calc__compare-rate {
  color: var(--color-text-muted);
  font-size: 13px;
  white-space: nowrap;
}

.calc__compare-sum {
  font-weight: 700;
  color: var(--color-dark);
  white-space: nowrap;
}

.calc__disclaimer {
  font-size: 12.5px;
  line-height: 1.55;
  color: var(--color-text-muted);
  margin: 18px 0 0;
}

/* ---------- таблица ставок ---------- */

.tax-page__tablewrap {
  overflow-x: auto;
  margin: 0 0 14px;
}

.tax-page__table {
  width: 100%;
  min-width: 460px;
  border-collapse: collapse;
  font-size: 15px;

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
    padding: 11px 12px;
    border-bottom: 1px solid var(--color-border);
    color: var(--color-text);
    font-variant-numeric: tabular-nums;
  }

  td:first-child {
    color: var(--color-dark);
    font-weight: 600;
  }
}

.tax-page__up {
  color: var(--color-dark) !important;
  font-weight: 700;
}

.tax-page__up-mark {
  display: inline-block;
  margin-left: 9px;
  padding: 1px 7px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-accent);
  background: var(--color-accent-bg);
  border-radius: 4px;
  vertical-align: 1px;
}

.tax-page__source a {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.tax-page__source {
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text-muted);
  margin: 0;
  max-width: 68ch;
}

/* ---------- FAQ ---------- */

.tax-page__faq {
  display: grid;
  gap: 10px;
}

.tax-page__faq-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
}

.tax-page__faq-q {
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

.tax-page__faq-item[open] .tax-page__faq-q::after {
  content: '−';
}

.tax-page__faq-a {
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-text);
  margin: 12px 0 0;
}
</style>
