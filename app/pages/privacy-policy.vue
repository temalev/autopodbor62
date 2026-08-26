<script setup lang="ts">
import { SITE_PHONE_DISPLAY, SITE_PHONE_HREF, SITE_ADDRESS } from '../utils/site'
import { SITE_URL, breadcrumbJsonLd, jsonLdScript } from '../utils/schema'

const PAGE_URL = `${SITE_URL}/privacy-policy/`
const PAGE_TITLE = 'Политика конфиденциальности — Автоподбор 62'
const PAGE_DESCRIPTION =
  'Политика обработки персональных данных Автоподбор 62: какие данные мы собираем при заявках, как храним и используем, ваши права как субъекта персональных данных.'

useHead({
  title: PAGE_TITLE,
  meta: [
    { name: 'description', content: PAGE_DESCRIPTION },
    { property: 'og:url', content: PAGE_URL },
    { property: 'og:title', content: PAGE_TITLE },
    { property: 'og:description', content: PAGE_DESCRIPTION },
  ],
  link: [{ rel: 'canonical', href: PAGE_URL }],
  script: [
    jsonLdScript(
      breadcrumbJsonLd([
        { name: 'Главная', url: `${SITE_URL}/` },
        { name: 'Политика конфиденциальности', url: PAGE_URL },
      ]),
      'ld-privacy-breadcrumbs',
    ),
  ],
})

const EFFECTIVE_DATE = '15 мая 2026 г.'
</script>

<template>
  <div class="legal">
    <div class="legal__hero">
      <div class="legal__hero-inner">
        <NuxtLink to="/" class="legal__back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          На главную
        </NuxtLink>
        <h1 class="legal__title">Политика конфиденциальности</h1>
        <p class="legal__lead">Как мы обрабатываем и защищаем ваши персональные данные на сайте автоподбор62.рф</p>
        <p class="legal__effective">Действует с {{ EFFECTIVE_DATE }}</p>
      </div>
    </div>

    <div class="legal__section">
      <div class="legal__container">
        <section class="legal__block">
          <h2 class="legal__h2">1. Общие положения</h2>
          <p>
            Настоящая Политика обработки персональных данных (далее — «Политика») определяет порядок обработки и защиты персональных данных пользователей сайта <strong>автоподбор62.рф</strong> (далее — «Сайт»), оператором которого является сервис «Автоподбор 62» (далее — «Оператор», «мы»).
          </p>
          <p>
            Политика разработана в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных» и иными нормативными правовыми актами Российской Федерации.
          </p>
          <p>
            Используя Сайт и/или отправляя через него заявки, вы подтверждаете, что ознакомлены с настоящей Политикой и принимаете её условия.
          </p>
        </section>

        <section class="legal__block">
          <h2 class="legal__h2">2. Контакты оператора</h2>
          <ul class="legal__list">
            <li>Наименование: Автоподбор 62</li>
            <li>Адрес: {{ SITE_ADDRESS }}</li>
            <li>Телефон: <a :href="SITE_PHONE_HREF" class="legal__link">{{ SITE_PHONE_DISPLAY }}</a></li>
            <li>Email для запросов по персональным данным: <a href="mailto:info@autopodbor62.ru" class="legal__link">info@autopodbor62.ru</a></li>
          </ul>
        </section>

        <section class="legal__block">
          <h2 class="legal__h2">3. Какие данные мы обрабатываем</h2>
          <p>При взаимодействии с Сайтом мы можем собирать следующие персональные данные:</p>
          <ul class="legal__list">
            <li>имя (или то, как вы хотите, чтобы к вам обращались);</li>
            <li>номер телефона для связи;</li>
            <li>текст сообщения, если вы указываете его в заявке;</li>
            <li>информацию о посещении Сайта (IP-адрес, тип браузера и устройства, источник перехода, посещённые страницы, время визита) — собирается автоматически с помощью систем веб-аналитики (см. п. 7).</li>
          </ul>
        </section>

        <section class="legal__block">
          <h2 class="legal__h2">4. Цели обработки персональных данных</h2>
          <p>Мы обрабатываем персональные данные для:</p>
          <ul class="legal__list">
            <li>обработки заявок, отправленных через формы на Сайте;</li>
            <li>обратной связи с вами по телефону, в мессенджерах или по электронной почте по существу заявки;</li>
            <li>консультаций, согласования условий оказания услуг и заключения договора;</li>
            <li>информирования об услугах, акциях и предложениях Оператора — только при наличии явного согласия;</li>
            <li>анализа поведения пользователей и улучшения работы Сайта;</li>
            <li>выполнения требований законодательства Российской Федерации.</li>
          </ul>
        </section>

        <section class="legal__block">
          <h2 class="legal__h2">5. Правовые основания обработки</h2>
          <p>Обработка персональных данных осуществляется на следующих основаниях:</p>
          <ul class="legal__list">
            <li>согласие субъекта персональных данных, выраженное путём заполнения и отправки формы на Сайте;</li>
            <li>необходимость исполнения договора, стороной которого является субъект, либо принятия мер по его заключению по инициативе субъекта;</li>
            <li>требования действующего законодательства Российской Федерации.</li>
          </ul>
        </section>

        <section class="legal__block">
          <h2 class="legal__h2">6. Способы и сроки хранения</h2>
          <p>
            Персональные данные обрабатываются с использованием автоматизированных и неавтоматизированных средств. Хранение осуществляется на защищённых серверах сервисов приёма заявок (например, Formspree) и в рабочих системах Оператора.
          </p>
          <p>
            Срок хранения — не дольше, чем требуется для достижения целей обработки, либо до отзыва согласия субъекта персональных данных, либо в течение сроков, установленных законодательством.
          </p>
        </section>

        <section class="legal__block">
          <h2 class="legal__h2">7. Использование cookies и систем аналитики</h2>
          <p>
            На Сайте применяется сервис веб-аналитики <strong>Яндекс.Метрика</strong> (ООО «Яндекс»), который собирает обезличенные данные о поведении посетителей, включая cookies, IP-адреса, технические параметры устройств и факт совершения целевых действий. Данные используются для оценки эффективности Сайта и улучшения пользовательского опыта.
          </p>
          <p>
            Вы можете отключить cookies в настройках браузера; в этом случае отдельные функции Сайта могут работать некорректно.
          </p>
        </section>

        <section class="legal__block">
          <h2 class="legal__h2">8. Передача данных третьим лицам</h2>
          <p>
            Мы не продаём ваши персональные данные и не передаём их третьим лицам в маркетинговых целях. Передача допускается только:
          </p>
          <ul class="legal__list">
            <li>сервисам, обеспечивающим работу Сайта и приём заявок (Formspree, Яндекс.Метрика), — в пределах их функциональности и в соответствии с их собственными политиками;</li>
            <li>в случаях, прямо предусмотренных законодательством Российской Федерации (например, по запросам уполномоченных государственных органов).</li>
          </ul>
        </section>

        <section class="legal__block">
          <h2 class="legal__h2">9. Права субъекта персональных данных</h2>
          <p>Вы имеете право:</p>
          <ul class="legal__list">
            <li>получить информацию о том, какие данные о вас обрабатываются;</li>
            <li>требовать уточнения, блокирования или уничтожения своих персональных данных, если они неполны, устарели, неточны, незаконно получены или не являются необходимыми для заявленной цели обработки;</li>
            <li>отозвать согласие на обработку персональных данных;</li>
            <li>обжаловать действия или бездействие Оператора в уполномоченном органе по защите прав субъектов персональных данных или в судебном порядке.</li>
          </ul>
          <p>
            Для реализации своих прав направьте запрос на <a href="mailto:info@autopodbor62.ru" class="legal__link">info@autopodbor62.ru</a> или позвоните по номеру <a :href="SITE_PHONE_HREF" class="legal__link">{{ SITE_PHONE_DISPLAY }}</a>.
          </p>
        </section>

        <section class="legal__block">
          <h2 class="legal__h2">10. Меры защиты данных</h2>
          <p>
            Оператор принимает разумные технические и организационные меры для защиты персональных данных от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования, распространения, а также иных неправомерных действий.
          </p>
        </section>

        <section class="legal__block">
          <h2 class="legal__h2">11. Изменения Политики</h2>
          <p>
            Оператор вправе вносить изменения в настоящую Политику. Актуальная редакция всегда доступна по адресу <a :href="PAGE_URL" class="legal__link">{{ PAGE_URL }}</a>. Дата вступления в силу действующей редакции указана в начале документа.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.legal {
  // Отступа сверху нет намеренно: тёмный герой уходит под фиксированную шапку,
  // как на страницах услуг. Иначе над ним оставалась светлая полоса.
  padding-top: 0;
  min-height: 100vh;
}

.legal__hero {
  background: var(--color-dark);
  color: #fff;
  // Верхний отступ учитывает высоту шапки, поверх которой лежит герой
  padding: 120px 24px 56px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 100px 20px 48px;
  }
}

.legal__hero-inner {
  max-width: 760px;
  margin: 0 auto;
}

.legal__back {
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

.legal__title {
  font-size: clamp(28px, 4.5vw, 42px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin: 0 0 16px;
}

.legal__lead {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.55;
  margin: 0 0 12px;
}

.legal__effective {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  margin: 0;
}

.legal__section {
  padding: 56px 24px 80px;

  @media (max-width: 720px) {
    padding: 40px 20px 56px;
  }
}

.legal__container {
  max-width: 820px;
  margin: 0 auto;
}

.legal__block {
  margin-bottom: 36px;

  &:last-child {
    margin-bottom: 0;
  }
}

.legal__h2 {
  font-size: clamp(19px, 2.8vw, 22px);
  font-weight: 700;
  color: var(--color-dark);
  letter-spacing: -0.01em;
  line-height: 1.3;
  margin: 0 0 14px;
}

.legal__block p {
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-text);
  margin: 0 0 12px;

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    color: var(--color-dark);
    font-weight: 600;
  }
}

.legal__list {
  margin: 0 0 12px;
  padding-left: 22px;
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-text);

  li {
    margin-bottom: 6px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.legal__link {
  color: var(--color-accent);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-accent-hover);
    text-decoration: underline;
  }
}
</style>
