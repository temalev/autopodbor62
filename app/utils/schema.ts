/**
 * Хелперы для генерации Schema.org JSON-LD разметки.
 * Используются в useHead() на страницах, чтобы выдать поисковикам структурированные данные.
 */

import { SITE_PHONE_RAW } from './site'

/** Базовый URL сайта (для абсолютных ссылок в JSON-LD) */
export const SITE_URL = 'https://xn--62-6kceem3eacgpr.xn--p1ai'

/** Координаты офиса (Рязань, ул. Грибоедова, 8Б) — взяты с виджета Яндекс.Карт в Footer */
const GEO_LAT = 54.627751
const GEO_LON = 39.765055

/**
 * LocalBusiness / AutomotiveBusiness — основная карточка бизнеса.
 * Один и тот же объект подключаем на каждой странице сайта.
 */
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'AutomotiveBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: 'Автоподбор 62',
    alternateName: 'Autopodbor 62',
    description:
      'Профессиональный автоподбор и проверка автомобилей в Рязани. Подбор под ключ, разовая проверка, выкуп и продажа, регистрация в ГИБДД, импорт из Кореи и Китая.',
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    image: `${SITE_URL}/images/logo.png`,
    telephone: `+${SITE_PHONE_RAW}`,
    email: 'info@autopodbor62.ru',
    priceRange: '₽₽',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Грибоедова, 8Б',
      addressLocality: 'Рязань',
      addressRegion: 'Рязанская область',
      postalCode: '390000',
      addressCountry: 'RU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: GEO_LAT,
      longitude: GEO_LON,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '10:00',
        closes: '19:00',
      },
    ],
    areaServed: [
      {
        '@type': 'City',
        name: 'Рязань',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Рязанская область',
      },
    ],
    sameAs: [
      'https://t.me/Autopodbor62',
      'https://www.avito.ru/brands/i17034625',
      'https://yandex.ru/maps/org/autopodbor_62/204442224583/',
    ],
    // Агрегат по отзывам с Авито — это тот же источник, из которого взяты
    // карточки отзывов в HTML главной страницы (массив `reviews` в index.vue),
    // поэтому разметка описывает именно то, что видно на странице.
    // Сверено с профилем 2026-07-27: 136 отзывов, все с оценкой 5.
    // Профиль указан в sameAs — значения проверяемы.
    // Виджет Яндекс.Карт на главной показывает вторую площадку (4,8 / 26)
    // и в этот агрегат намеренно не входит: смешивать источники в одном
    // AggregateRating нельзя.
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      bestRating: '5',
      reviewCount: '136',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+${SITE_PHONE_RAW}`,
      contactType: 'customer service',
      areaServed: 'RU',
      availableLanguage: ['ru'],
    },
  }
}

/**
 * Service — карточка отдельной услуги.
 * Подключается на каждой странице услуги.
 */
export interface ServiceJsonLdParams {
  name: string
  description: string
  url: string
  serviceType: string
  image?: string
  /**
   * Цена услуги в рублях. Для Яндекса цена — прямой коммерческий фактор
   * ранжирования, поэтому дублируем видимый блок цены в разметку.
   * `description` поясняет, за что именно берётся сумма: у нас это
   * вознаграждение компании, а авто, пошлины и доставку клиент платит сам.
   */
  offer?: {
    price: number
    description: string
  }
}

export function serviceJsonLd(params: ServiceJsonLdParams) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${params.url}#service`,
    name: params.name,
    description: params.description,
    url: params.url,
    serviceType: params.serviceType,
    image: params.image || `${SITE_URL}/images/logo.png`,
    provider: {
      '@id': `${SITE_URL}/#organization`,
    },
    areaServed: {
      '@type': 'City',
      name: 'Рязань',
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: params.url,
      servicePhone: `+${SITE_PHONE_RAW}`,
    },
    ...(params.offer
      ? {
          offers: {
            '@type': 'Offer',
            price: params.offer.price,
            priceCurrency: 'RUB',
            description: params.offer.description,
            availability: 'https://schema.org/InStock',
            url: params.url,
            areaServed: {
              '@type': 'City',
              name: 'Рязань',
            },
          },
        }
      : {}),
  }
}

/**
 * BreadcrumbList — хлебные крошки. В выдаче дают иерархию вместо голого URL:
 * «autopodbor62.рф › Подбор автомобиля».
 *
 * Адрес элемента дублируется в двух полях намеренно: Google читает `item`,
 * а Яндекс — `url` (см. справку «Навигационные цепочки»). С одним `item`
 * Яндекс цепочку не формирует и в Вебмастере пишет, что разметки нет.
 * Оба поля допустимы по Schema.org: `url` есть у Thing, от которого наследуется
 * ListItem, так что дубль ничего не ломает.
 */
export interface BreadcrumbItem {
  name: string
  url: string
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
      url: item.url,
    })),
  }
}

/**
 * FAQPage — для блока FAQ на главной.
 * Расширяет сниппет в Google: вопросы выводятся прямо в выдаче.
 */
export interface FaqItem {
  question: string
  answer: string
}

export function faqPageJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

/**
 * Готовит script-объект для useHead({ script: [...] }) из JSON-LD-объекта.
 */
export function jsonLdScript(data: unknown, id?: string) {
  return {
    type: 'application/ld+json',
    innerHTML: JSON.stringify(data),
    ...(id ? { id } : {}),
  }
}

