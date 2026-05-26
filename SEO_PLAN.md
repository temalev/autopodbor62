# SEO‑план развития сайта Автоподбор 62

Домен: `xn--62-6kceem3eacgpr.xn--p1ai` (автоподбор62.рф)
Стек: Nuxt 3 (SSG), Element Plus, Яндекс.Метрика 108781955

Цель плана — повысить органический трафик из Яндекса и Google по запросам, связанным с автоподбором, проверкой и выкупом авто в Рязани.

Идём по приоритетам сверху вниз. Каждую задачу отмечаем галочкой по мере выполнения.

---

## 🔥 АУДИТ 2026‑05‑26 — что нашёл при повторной проверке

Прогнал свежий аудит по всем 10 страницам, `.output/public/*.html`, `robots.txt`, sitemap, JSON‑LD, alt‑текстам, размерам картинок. Что выплыло (отсортировано по приоритету):

### КРИТИЧНО — починить в первую очередь

1. **`<html lang>` отсутствует** — в [nuxt.config.ts](nuxt.config.ts) не задан `app.head.htmlAttrs.lang`, в собранном HTML `<html>` идёт без атрибута. И Google, и Яндекс используют lang для определения языка страницы и связывания с регионом. Фикс — одна строка: `htmlAttrs: { lang: 'ru' }` в `app.head` в [nuxt.config.ts](nuxt.config.ts).
2. **Два `<h1>` на /dkp** — [app/pages/dkp.vue:284](app/pages/dkp.vue#L284) («Договор купли‑продажи (ДКП)») и [app/pages/dkp.vue:438](app/pages/dkp.vue#L438) («Договор купли‑продажи транспортного средства»). Второй — это печатный шаблон в `.pdf-doc--print` с `display: none` на экране, но он всё равно в DOM. Googlebot его видит. Поменять второй на `<h2>` (или `<div class="pdf-doc__title">` без изменения класса‑стиля).
3. **`og:image` отсутствует на /privacy-policy** — [app/pages/privacy-policy.vue:11‑18](app/pages/privacy-policy.vue#L11) — в `useHead.meta` нет ни `og:image`, ни `twitter:image`. Превью в Telegram/мессенджерах будет пустым. Подставить общий брендовый баннер: `${SITE_URL}/images/bg.webp` (как на /dkp).
4. **Service JSON‑LD на главной использует logo вместо хиро** — `index.vue` не передаёт `image` в `serviceJsonLd`, дефолт в [app/utils/schema.ts:114](app/utils/schema.ts#L114) подставляет логотип. Логотип 1684×1684 и квадратный — не подходит для Service image. Передавать `image: ${SITE_URL}/images/bg.webp`.
5. **Service-картинки до сих пор `.jpeg`, 784/704/353 КБ** — пункт #10 плана не сделан. Это самый жирный косяк по Core Web Vitals и единственное серьёзное замечание PageSpeed. Файлы: [public/images/services/1.jpeg](public/images/services/1.jpeg), [public/images/services/2.jpeg](public/images/services/2.jpeg), [public/images/services/3.jpeg](public/images/services/3.jpeg). Конвертить в `.webp` (команда — в пункте #10 ниже) и заменить ссылки на 5 страницах услуг.
6. **logo.png 125 КБ при размере 1684×1684** — пункт #10 плана не сделан. Логотип в шапке отображается 44×44, а грузится 1684×1684. Ресайз до 256×256 + дополнительная конвертация в `.webp` снимет ~120 КБ. Файл [public/images/logo.png](public/images/logo.png) используется в `<img>` хедера и в JSON‑LD `logo`/`image`.

### ВЫСОКИЙ ПРИОРИТЕТ — поправить вскоре

7. **Title слишком длинные** — Google режет ~60 символов кириллицей. Текущие:
   - `/` — 80 симв. (брэнд в конце обрежется)
   - `/dkp` — 85 симв.
   - `/vykup` — 85 симв.

   Остальные — 51‑62 симв., в норме. Урезать индекс/дкп/выкуп: убрать `| Автоподбор 62` из самых длинных (бренд и так в `og:site_name` и в title-конце видно).
8. **Description слишком длинные на 4 страницах** — Google режет ~160 симв.:
   - `/` — 232 симв.
   - `/dkp` — 184 симв.
   - `/o-nas` — 173 симв.
   - `/registraciya-gibdd` — 176 симв.
   - `/podbor` — 165 симв.

   Урезать до 150‑160 симв., перенося хвост в текст страницы.
9. **FAQ — 2 вопроса всё ещё закомментированы** — [app/pages/index.vue:805‑822](app/pages/index.vue#L805). Пункт #11 плана: расскоментировать «Что такое Автоподбор62» и «Какие автомобили подбираете» + добавить в `faqPageJsonLd()` тоже.
10. **`<meta name="robots">` нигде не выставлен** — по умолчанию краулеры считают `index, follow`, но явное указание защитит от случайной де‑индексации. Добавить в [nuxt.config.ts](nuxt.config.ts) `{ name: 'robots', content: 'index, follow' }` (исключая `/privacy-policy` и `error.vue`, где уже `noindex`).
11. **robots.txt без Clean‑param** — Яндекс по умолчанию считает `/?utm_source=...` отдельной страницей. Добавить:
    ```
    Clean-param: utm_source&utm_medium&utm_campaign&utm_term&utm_content&yclid&gclid&fbclid&_openstat&from
    ```
    Это убирает дубликаты в индексе Яндекса. Google использует `?gclid` тоже, но он сам нормализует.

### СРЕДНИЙ — приятные мелочи

12. **Нет JSON‑LD `WebSite` с `SearchAction`** — Google может показывать поисковое окно в SERP под брендовой выдачей. Добавить в `app.vue` рядом с LocalBusiness. Хелпер написать в [app/utils/schema.ts](app/utils/schema.ts). Без реального `/search?q=` работает лимитированно (без действия), но `WebSite` сам по себе полезен для @id‑связок.
13. **Нет `theme-color`** — мобильные браузеры окрашивают строку в цвет акцента. `{ name: 'theme-color', content: '#0a0a0a' }` в `nuxt.config.ts`.
14. **Нет `format-detection`** — iOS Safari иногда автоматически линкует цифры в текст как телефоны. `{ name: 'format-detection', content: 'telephone=no' }` (у нас всё нужное и так в `<a href="tel:">`).
15. **`@nuxt/image` не используется (решение по плану)** — подтверждаю, что для статичных хиро‑картинок ручной webp ок. Если в будущем появятся пользовательские загрузки или responsive‑галерея — `@nuxt/image` стоит подключить.
16. **`@element-plus/icons-vue` всё ещё в package.json** — мёртвая зависимость, в коде не используется. Удалить из [package.json](package.json) → меньше `node_modules`, чище ауд‑отчёт.

### ЧТО ХОРОШО (не трогать)

- ✅ JSON‑LD LocalBusiness глобально — данные полные, координаты есть, рейтинг, sameAs.
- ✅ Canonical на каждой странице.
- ✅ BreadcrumbList на всех внутренних.
- ✅ Service JSON‑LD на 6 услугах (только image на главной фиксануть).
- ✅ Sitemap автогенерируется, lastmod, priority, changefreq — всё на месте.
- ✅ RelatedServices на каждой странице услуги — 3 кросс‑линка × 6 = 18 внутренних ссылок, ок.
- ✅ Семантический `<address>` с `<time datetime>` в футере.
- ✅ Alt‑тексты на хиро‑картинках и галерее импорта — все запросно‑ориентированные.
- ✅ Element Plus tree‑shaking — ~316 КБ CSS убрано.
- ✅ Material Symbols с `display=swap`.
- ✅ Яндекс‑верификация в meta + DNS.

---

## Раздел 0. Быстрые правки одной коммитой (1 час работы, дают сразу 5+ баллов в аудитах)

Объединить в один атомарный коммит «SEO quick wins» (по находкам 1‑4, 10, 13, 14):

- [ ] `htmlAttrs: { lang: 'ru' }` в [nuxt.config.ts](nuxt.config.ts)
- [ ] второй `<h1>` в [dkp.vue:438](app/pages/dkp.vue#L438) → `<h2>`
- [ ] `og:image` + `twitter:image` в [privacy-policy.vue:11](app/pages/privacy-policy.vue#L11) (использовать `bg.webp`)
- [ ] `image: ${SITE_URL}/images/bg.webp` в `serviceJsonLd()` вызове в [index.vue:38](app/pages/index.vue#L38)
- [ ] Глобальный `{ name: 'robots', content: 'index, follow' }` в `nuxt.config.ts`
- [ ] `{ name: 'theme-color', content: '#0a0a0a' }` (или акцентный)
- [ ] `{ name: 'format-detection', content: 'telephone=no' }`
- [ ] Урезать title `/`, `/dkp`, `/vykup` до ≤65 симв.
- [ ] Урезать description до 150‑160 симв. на `/`, `/dkp`, `/o-nas`, `/podbor`, `/registraciya-gibdd`

Проверка после: `npx nuxt generate`, открыть `.output/public/index.html`, найти `lang="ru"`, искомые meta, новые title’ы. По 1 url прогнать через https://search.google.com/test/rich-results и https://webmaster.yandex.ru/tools/microtest/.

---

## БЛОК 1. КРИТИЧНОЕ (фундамент SEO)

### ✅ 1. JSON‑LD разметка Schema.org — ВЫПОЛНЕНО (2026‑05‑15)

Что сделано:
- ✅ **LocalBusiness / AutomotiveBusiness** — подключается глобально через [app/app.vue](app/app.vue), на каждой странице. Включает адрес, телефон, часы, гео (54.627751, 39.765055), `aggregateRating` 5.0, `sameAs` на Telegram и Авито.
- ✅ **Service** — на 6 страницах услуг: `/podbor`, `/proverka`, `/proverka-kuzova`, `/vykup`, `/import`, `/registraciya-gibdd`. Со ссылкой на provider через `@id` LocalBusiness.
- ✅ **FAQPage** — на главной, 6 вопросов из существующего блока FAQ.
- ✅ **BreadcrumbList** — на всех внутренних страницах (включая `/o-nas`).

Файлы:
- [app/utils/schema.ts](app/utils/schema.ts) — хелперы (`localBusinessJsonLd`, `serviceJsonLd`, `breadcrumbJsonLd`, `faqPageJsonLd`, `jsonLdScript`).
- [app/app.vue](app/app.vue) — глобальный `LocalBusiness`.
- [app/pages/index.vue](app/pages/index.vue) — главная + FAQPage.
- `app/pages/{podbor,proverka,proverka-kuzova,vykup,import,registraciya-gibdd}.vue` — Service + BreadcrumbList.
- [app/pages/o-nas.vue](app/pages/o-nas.vue) — BreadcrumbList.

Параллельно с микроразметкой закрыли:
- ✅ Уникальный `title` + `description` на главной (пункт 2).
- ✅ `og:url` / `og:title` / `og:description` на всех страницах услуг и главной (пункт 3).
- ✅ `rel="canonical"` на всех страницах с описанием.

Проверка: `npx nuxt generate` собирается без ошибок, JSON‑LD виден в `.output/public/*/index.html`.

После деплоя обязательно прогнать главную и одну страницу услуги через:
- https://search.google.com/test/rich-results
- https://webmaster.yandex.ru/tools/microtest/

---

### ✅ 2. Уникальные meta‑теги на главной и /dkp — ВЫПОЛНЕНО (2026‑05‑15)

Что сделано:
- ✅ [app/pages/index.vue](app/pages/index.vue) — добавлен `useHead()` с уникальным title «Автоподбор в Рязани под ключ — проверка, выкуп, регистрация авто | Автоподбор 62», расширенным description, OG‑тегами и canonical (сделано в пункте 1).
- ✅ [app/pages/dkp.vue](app/pages/dkp.vue) — добавлен `useHead()` с заголовком «Договор купли-продажи автомобиля онлайн — бесплатный шаблон ДКП в PDF | Автоподбор 62». Это даст шанс ранжироваться по запросам «ДКП авто онлайн», «договор купли продажи автомобиля скачать», «бланк ДКП авто».

Проверка: `npx nuxt generate` собрался, теги выводятся в `.output/public/{index,dkp}/index.html`.

---

### ✅ 3. Open Graph на внутренних страницах — ВЫПОЛНЕНО (2026‑05‑15)

Что сделано:
- ✅ Текстовые OG (`og:url`, `og:title`, `og:description`) уникальны на каждой странице (сделано в пункте 1 заодно с canonical).
- ✅ `og:image` и `twitter:image` теперь индивидуальные:
  - `/` → `/images/bg.webp`
  - `/podbor` → `/images/services/1.jpeg`
  - `/proverka` → `/images/services/2.jpeg`
  - `/proverka-kuzova` → `/images/services/3.jpeg`
  - `/vykup` → `/images/services/3.jpeg`
  - `/import` → `/images/korea.webp`
  - `/registraciya-gibdd` → `/images/services/1.jpeg`
  - `/o-nas` → `/images/team/ivan.webp`
  - `/dkp` → `/images/bg.webp`
- ✅ Глобальные дефолты `og:image`/`og:image:type`/`twitter:image`/`twitter:title`/`twitter:description` убраны из [nuxt.config.ts](nuxt.config.ts) — они мешали per-page override.
- ✅ Service JSON-LD на каждой странице услуги тоже использует тот же `image` (поле `image` в Schema).

**На потом (дизайн-задача, не код):** нарисовать брендированные баннеры 1200×630 со слоганом, логотипом и фоном — отдельный для каждой страницы. Сейчас используются hero-изображения нативных пропорций (~1.33:1, не идеал для Facebook/Telegram-предпросмотра). Когда баннеры будут готовы, заменить URL в `useHead` — путь к файлу один, остальная разметка останется.

Проверка: после `rm -rf .output .nuxt && npx nuxt generate` все 9 страниц имеют свой `og:image` и `twitter:image` (verified в `.output/public/*/index.html`).

---

### ✅ 4. Страница «Политика конфиденциальности» и 404 — ВЫПОЛНЕНО (2026‑05‑15)

Что сделано:
- ✅ [app/pages/privacy-policy.vue](app/pages/privacy-policy.vue) — Политика конфиденциальности по 152‑ФЗ (11 разделов): общие положения, контакты оператора, состав данных, цели и основания обработки, способы и сроки хранения, Яндекс.Метрика и cookies, передача третьим лицам, права субъекта, меры защиты, изменения политики. Оператор указан как «Автоподбор 62» без юрлица — по решению владельца. Когда появится ИП/ООО — добавишь ИНН/ОГРН в раздел 2.
- ✅ Ссылка добавлена в [app/components/Footer.vue](app/components/Footer.vue) в нижнюю строку рядом с копирайтом.
- ✅ Страница добавлена в [public/sitemap.xml](public/sitemap.xml).
- ✅ [app/error.vue](app/error.vue) — кастомная страница ошибок (404/500). Для 404: «Страница не найдена» + краткое объяснение + кнопки «На главную» и «Позвонить» + плитки со всеми 6 услугами (Подбор / Проверка / Выкуп / Импорт / Регистрация / Проверка кузова) — чтобы не терять трафик с битых ссылок. Стоит `<meta name="robots" content="noindex, follow">`.

**Технический нюанс по 404:** Nuxt SSG генерирует `404.html` как общий SPA-fallback — DOM error.vue туда не запекается, страница ошибки рендерится клиентским кодом после гидратации. Для пользователя это «мерцание» неуловимо, статус HTTP 404 от хостинга отдаётся правильно, краулеры HTTP-статус видят и не индексируют. Если в будущем захочется чистый pre-rendered 404 — настроить `nitro.prerender.routes: ['/404']` и кастомный template.

Проверка: `npx nuxt generate` собирает 22 маршрута, `/privacy-policy/index.html` содержит весь legal-текст, ссылка из футера работает.

---

## БЛОК 2. ВЫСОКИЙ ПРИОРИТЕТ

### ✅ 5. Автогенерация sitemap.xml — ВЫПОЛНЕНО (2026‑05‑16)

Что сделано:
- ✅ Установлен `@nuxtjs/sitemap` v8.0.15 (поддержка Nuxt 4).
- ✅ Подключён в [nuxt.config.ts](nuxt.config.ts) как модуль, выставлен `site.url`.
- ✅ Удалён ручной `public/sitemap.xml`.
- ✅ Прописаны priority и changefreq per-route:
  - `/` → 1.0 / weekly
  - `/podbor`, `/proverka`, `/vykup`, `/import` → 0.9 / monthly
  - `/proverka-kuzova`, `/registraciya-gibdd` → 0.8 / monthly
  - `/o-nas`, `/dkp` → 0.6 / yearly
  - `/privacy-policy` → 0.3 / yearly
- ✅ Включён `autoLastmod: true` — поле `<lastmod>` ставится на каждый URL (Яндекс использует его, чтобы понимать, что переобходить).
- ✅ Отключён `discoverImages: false` — иначе модуль автоматически тащил в sitemap внешние картинки с Авито (аватарки и фото из отзывов).

`/sitemap.xml` теперь автогенерируется при `npx nuxt generate`. `robots.txt` уже на него ссылается, отдельной правки не нужно.

Проверка: 10 URL в sitemap, у каждого есть `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>`.

---

### ✅ 6. Микроразметка контактов в Footer — ВЫПОЛНЕНО (2026‑05‑16)

Что сделано в [app/components/Footer.vue](app/components/Footer.vue):
- ✅ Обернули контактный блок в семантический тег `<address>` — правильный HTML5-элемент для контактов владельца сайта.
- ✅ Часы работы (`SITE_HOURS`) теперь в `<time datetime="Mo-Su 10:00-19:00">` — машиночитаемый формат расписания.
- ✅ Телефонной ссылке добавлен `aria-label="Позвонить в Автоподбор 62"` для скрин-ридеров.
- ✅ Telegram-ссылке добавлен `rel="me"` (microformats) — лёгкий сигнал поисковикам, что этот канал принадлежит нам.
- ✅ Стили `.footer__address { font-style: normal; margin: 0; }` — снимаем браузерный курсив у `<address>`, визуально ничего не меняется.

**Почему НЕ добавляли `itemprop` Microdata**: JSON-LD `LocalBusiness` из пункта 1 уже передаёт Google и Яндексу всю контактную информацию в структурированном виде. Дублировать через Microdata не нужно (и иногда Google ругается на дубли). Семантические HTML5-теги — это «доступность + SEO», без избыточности.

Проверка: `npx nuxt generate` собрался, в `index.html` видно `<address class="footer__address">`, `<time datetime="...">`, `aria-label`, `rel="noopener noreferrer me"`.

---

### ✅ 7. Перекрёстные ссылки между услугами — ВЫПОЛНЕНО (2026‑05‑16)

Что сделано:
- ✅ Создан переиспользуемый компонент [app/components/RelatedServices.vue](app/components/RelatedServices.vue) — сетка карточек с заголовком, описанием и стрелкой; стиль совпадает с error.vue.
- ✅ Подключён на все 6 страниц услуг с уникальной подборкой из 3 сопутствующих услуг + контекстный subheading:

| Страница | Сопутствующие | Контекст subheading |
|----------|---------------|--------------------|
| `/podbor` | проверка / выкуп / ГИБДД | «Часто берут вместе с подбором» |
| `/proverka` | подбор / кузов / выкуп | «Часто берут вместе с проверкой» |
| `/proverka-kuzova` | проверка / подбор / выкуп | «Часто берут вместе» |
| `/vykup` | подбор / проверка / импорт | «Часто берут вместе с выкупом» |
| `/import` | подбор / проверка / ГИБДД | «Часто берут вместе с импортом» |
| `/registraciya-gibdd` | подбор / импорт / выкуп | «Часто берут вместе» |

Блок ставится в самом низу страницы — после CTA-формы, перед footer. Это улучшает и UX (даём альтернативы тем, кто ещё не готов оставить заявку), и распределение PageRank между страницами услуг (каждая теперь получает 5 входящих внутренних ссылок: 3 из других услуг + Header + Footer).

Проверка: `npx nuxt generate` собрал 24 маршрута, на каждой странице услуги в HTML видно блок `.related` с 3 карточками.

---

### ✅ 8. Уточнить alt‑тексты на изображениях — ВЫПОЛНЕНО (2026‑05‑16)

Что сделано (все alt-ы стали запросно-ориентированными с упоминанием Рязани и услуги):

**Hero-картинки 6 страниц услуг:**
- `/podbor` → «Подбор автомобиля под ключ в Рязани — Автоподбор 62»
- `/proverka` → «Проверка автомобиля перед покупкой в Рязани — Автоподбор 62»
- `/proverka-kuzova` → «Приёмка автомобиля после кузовного ремонта в Рязани — Автоподбор 62»
- `/vykup` → «Срочный выкуп и комиссионная продажа автомобиля в Рязани — Автоподбор 62»
- `/registraciya-gibdd` → «Регистрация автомобиля в ГИБДД в Рязани — Автоподбор 62»
- `/import` → «Импорт автомобилей из Кореи и Китая под ключ в Рязань — Автоподбор 62»

**Главная** ([app/pages/index.vue](app/pages/index.vue)):
- Блок Корея/Китай → «Импорт автомобилей из Кореи и Китая под ключ в Рязань — Автоподбор 62»
- Фото команды (3 человека) — теперь содержат имя, роль и упоминание бренда (а не только имя).

**Галерея импорта** ([app/pages/import.vue](app/pages/import.vue)) — 13 картинок. Каждая получила уникальный alt с упоминанием страны (Корея/Китай) и контекста (доставка, проверка, регистрация, бюджет, под ключ, Рязань) — больше нет повторяющихся «Импортный автомобиль из Кореи». Google не любит идентичные alt-массивы.

Не трогали: логотип в Header (`Автоподбор 62` — короткое название бренда, корректно для лого), динамические alt на фото отзывов (имя клиента подставляется из данных).

Проверка: `npx nuxt generate` собрал 22 маршрута, alt-тексты в HTML верифицированы.

---

## БЛОК 3. СРЕДНИЙ ПРИОРИТЕТ

### ✅ 9. Оптимизация шрифтов и Element Plus — ВЫПОЛНЕНО (2026‑05‑16)

Что сделано:

**Material Symbols** ([nuxt.config.ts:31](nuxt.config.ts#L31)) — добавлен `&display=swap`. Текст вокруг иконок больше не «висит» в ожидании шрифта; иконки появляются сразу как загрузятся, без блокировки FCP.

**Element Plus** — глобальная регистрация заменена на точечную:
- Раньше [plugins/element-plus.client.ts](plugins/element-plus.client.ts) делал `app.use(ElementPlus)` (регистрирует ВСЕ ~80 компонентов) + загружал `element-plus/dist/index.css` (~344 КБ) + регистрировал каждую иконку из `@element-plus/icons-vue` (но они нигде не используются).
- Теперь регистрирует только три компонента, реально используемые в проекте: `ElCollapse`, `ElCollapseItem`, `ElDrawer`.
- Глобальный `element-plus/dist/index.css` удалён, в [nuxt.config.ts](nuxt.config.ts) теперь подключаются только 6 точечных CSS-файлов: `base.css`, `el-collapse.css`, `el-collapse-item.css`, `el-collapse-transition.css`, `el-drawer.css`, `el-overlay.css`. Суммарно ~28 КБ вместо 344 КБ.
- Регистрация всех иконок удалена — они нигде не используются.

**Экономия**: ~316 КБ CSS убрано с критического пути загрузки + меньше JS-кода Element Plus в бандле благодаря tree-shaking (полный `app.use(ElementPlus)` плохо шейкается).

Зависимость `@element-plus/icons-vue` теперь не нужна — можно удалить из [package.json](package.json) (но не обязательно, она просто лежит мёртвым грузом на диске).

Проверка: `npx nuxt generate` собрался, в готовых CSS-файлах присутствуют все нужные селекторы (`.el-collapse`, `.el-collapse-item__*`, `.el-drawer__*`, `.el-overlay.is-drawer`). **Перед деплоем стоит вручную проверить, что FAQ-аккордеон на главной раскрывается, а мобильное меню (drawer) выезжает.**

---

### ☐ 10. Webp/AVIF и `<NuxtImg>` для hero‑картинок — НЕ СДЕЛАНО, ВЫСОКИЙ ПРИОРИТЕТ

⚠ Подтверждено на 2026‑05‑26: services/*.jpeg всё ещё 784/704/353 КБ, logo.png 125 КБ @ 1684×1684. Это самый жирный единичный косяк PageSpeed на сайте.

**Замеры (на 2026‑05‑16):**

| Файл | Размер | Вес сейчас |
|---|---|---|
| `public/images/services/1.jpeg` | 1024×1024 | **802 КБ** |
| `public/images/services/2.jpeg` | 1024×1024 | **720 КБ** |
| `public/images/services/3.jpeg` | 1024×1024 | **361 КБ** |
| `public/images/logo.png` | **1684×1684** | 128 КБ (огромный для логотипа) |
| `public/images/bg.webp` | 1232×928 | 64 КБ ✅ ок |
| `public/images/korea.webp` | 1344×896 | 108 КБ ✅ ок |
| `public/images/team/*.webp` | — | ~90 КБ каждая ✅ ок |
| `public/images/import/*.webp` | — | 100‑350 КБ, грузятся `loading="lazy"` ✅ ок |

**Решено идти ручным путём** (без `@nuxt/image`): картинки 1024×1024 — не настолько большие, чтобы `srcset` дал заметный выигрыш сверх простой конвертации формата. Экономия от ручной webp-конвертации ~75% от того, что бы дал `@nuxt/image`, но без новой зависимости и без усложнения билда.

**Шаги:**

1. Сконвертировать `services/*.jpeg` → `.webp`:
   ```bash
   cd public/images/services
   for f in *.jpeg; do cwebp -q 82 "$f" -o "${f%.jpeg}.webp"; done
   # (опционально, ещё компактнее) avifenc -s 6 -q 60 "$f" "${f%.jpeg}.avif"
   rm *.jpeg
   ```
2. Заменить ссылки `.jpeg` → `.webp` в коде:
   - [app/pages/podbor.vue:35](app/pages/podbor.vue#L35) (`PAGE_OG_IMAGE`) и [app/pages/podbor.vue:147](app/pages/podbor.vue#L147) (hero `<img>`)
   - [app/pages/proverka.vue:35](app/pages/proverka.vue#L35) и [app/pages/proverka.vue:148](app/pages/proverka.vue#L148)
   - [app/pages/vykup.vue:35](app/pages/vykup.vue#L35) и [app/pages/vykup.vue:161](app/pages/vykup.vue#L161)
   - [app/pages/proverka-kuzova.vue:35](app/pages/proverka-kuzova.vue#L35) и [app/pages/proverka-kuzova.vue:163](app/pages/proverka-kuzova.vue#L163) (там 3.jpeg для OG и 2.jpeg для hero — оба заменить)
   - [app/pages/registraciya-gibdd.vue:35](app/pages/registraciya-gibdd.vue#L35) и [app/pages/registraciya-gibdd.vue:161](app/pages/registraciya-gibdd.vue#L161)
3. Ресайзить `public/images/logo.png` с 1684×1684 до ~400×400 (или сделать SVG-версию).
4. Проверить: `npx nuxt generate`, открыть все 5 страниц-услуг, главную, дёрнуть DevTools → Network → отфильтровать «Img», убедиться, что отдаются `.webp`, ничего не битое.

---

### ☐ 11. Расширить FAQ‑блок и продублировать в каждую услугу — НЕ СДЕЛАНО

⚠ Подтверждено на 2026‑05‑26: в [app/pages/index.vue:805‑822](app/pages/index.vue#L805) 2 `<el-collapse-item>` так и закомментированы.

Что сделать:
- Раскомментировать вопросы про «Что такое Автоподбор62» и «Какие автомобили подбираете» — заодно в `faqPageJsonLd()` тоже добавить эти 2 вопроса/ответа.
- Добавить FAQ на каждую страницу услуги (3–5 вопросов, связанных именно с этой услугой) + FAQPage Schema через `faqPageJsonLd()` хелпер из `schema.ts`.

---

### ✅ 12. Подключить Яндекс.Вебмастер и Google Search Console — ВЫПОЛНЕНО (2026‑05‑16)

Верификация прав на сайт уже сделана через DNS TXT-записи для обоих сервисов. Как страховка в [nuxt.config.ts:38](nuxt.config.ts#L38) также стоит `yandex-verification` мета-тег.

**Что важно делать дальше (регулярно, не одноразово):**
- Загрузить sitemap в Яндекс.Вебмастер: «Индексирование» → «Файлы Sitemap» → добавить `https://автоподбор62.рф/sitemap.xml`. То же в Google Search Console: «Файлы Sitemap».
- Использовать [routes-for-webmaster.txt](routes-for-webmaster.txt) (готовый список из 10 URL) для ручного переобхода после правок.
- В Яндекс.Вебмастер включить уведомления на email при появлении ошибок сканирования и фатальных проблем.
- Раз в неделю смотреть «Запросы» в Вебмастере и Search Console — это первичный источник идей, по каким ключам ранжируемся, где низкий CTR, где можно докрутить title/description.
- Реагировать на 404 в отчётах «Страницы в поиске → исключённые» (Я.Вебмастер) и «Indexing → Pages» (GSC) — кастомная error.vue уже даёт fallback с услугами, но если есть массовые 404 на конкретный URL — надо понять, откуда битые ссылки приходят и сделать 301-редирект.

---

## БЛОК 4. ДОЛГОСРОЧНОЕ (рост контентной базы)

### ☐ 13. Завести блог / раздел «Полезное»

Главная и страницы услуг — это коммерческие лендинги. Чтобы расти по информационным запросам («как проверить авто перед покупкой», «признаки скрученного пробега», «как растаможить авто из Кореи»), нужен контентный раздел.

Что сделать:
- `/blog/` или `/poleznoe/` с 1–2 статьями в месяц по 3–5 тысяч знаков.
- Темы: чек‑листы, гайды, разбор реальных кейсов с фото.
- В каждой статье CTA на услугу.

---

### ☐ 14. Региональные посадочные

Для расширения географии (если есть готовность работать с пригородом):
- `/podbor-ryazan/` (основная)
- `/podbor-skopin/`, `/podbor-kasimov/` — соседние города области, если работаете там.

---

### ☐ 15. Отзывы и работа с репутацией

- Подгрузить отзывы с Авито/Яндекса прямо на страницы услуг (а не только на главной).
- Разметить отзывы Schema.org `Review` / `AggregateRating`.
- Регулярный сбор новых отзывов.

---

## Контрольные показатели

Через 2–3 месяца после выполнения Блока 1–2 ожидаем:
- Рост органического трафика на 30–50 %.
- Появление сайта в локальной выдаче «автоподбор Рязань», «проверка авто Рязань».
- Расширенные сниппеты в Google (FAQ‑аккордеоны прямо в SERP).
- Богатые карточки локального бизнеса в Яндекс/Google Картах.

---

_Последнее обновление: 2026‑05‑26_ — добавлен свежий аудит (раздел вверху файла), обновлены статусы #10 и #11.

### Использованные методы аудита

- Прочитан весь `app/pages/*.vue` и `app/utils/*.ts`, проверен `useHead` на каждой странице.
- Сравнено с собранным HTML в `.output/public/*/index.html` (что **реально** уходит краулеру).
- Подсчёт длин title/description с UTF‑8‑aware питоновским `len()`.
- Проверены OG / Twitter / canonical / JSON‑LD / `<h1>` на каждой странице.
- Внутреннее линкование: grep по `to="..."` + анализ `RelatedServices.vue`.
- Размер картинок: `find -size +200k`, инвентарь `public/images/`.
- `robots.txt`, `sitemap.xml` (собранный), `app.head` в `nuxt.config.ts`.
- Семантика: грубый структурный осмотр `<address>`, `<time>`, alt‑текстов.

### Что ещё стоит запустить после деплоя (не локально)

- https://search.google.com/test/rich-results — JSON‑LD валидность для Google.
- https://webmaster.yandex.ru/tools/microtest/ — то же для Яндекса.
- https://pagespeed.web.dev/ — Core Web Vitals (LCP/CLS/INP) на главной и одной услуге. После конвертации services/*.jpeg в webp LCP должен заметно упасть.
- https://search.google.com/test/mobile-friendly — мобильная пригодность.
- Lighthouse в Chrome DevTools — отдельный взгляд на SEO‑аудит (Lighthouse конкретно ловит lang="ru", двойной h1, alt'ы — все 3 находки из критичного блока выше).
