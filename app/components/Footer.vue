<template>
  <footer class="footer">
    <div class="footer__map">
      <iframe
        src="https://yandex.ru/map-widget/v1/?ll=39.765055%2C54.627751&mode=search&oid=204442224583&ol=biz&sll=39.756816%2C54.627749&source=serp_navig&text=%D0%B0%D0%B2%D1%82%D0%BE%D0%BF%D0%BE%D0%B4%D0%B1%D0%BE%D1%8062&z=15"
        width="100%"
        height="360"
        frameborder="0"
        allowfullscreen
        title="Autopodbor_62 на карте"
        loading="lazy"
      />
    </div>

    <div class="footer__body">
      <div class="footer__container">

        <div class="footer__brand">
          <p class="footer__logo">Автоподбор 62</p>
          <p class="footer__slogan">Покупка и продажа автомобиля без риска и потери времени</p>
          <div class="footer__social">
            <a href="https://t.me/Autopodbor62" target="_blank" rel="noopener noreferrer" class="footer__social-link" aria-label="Telegram">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
            <a href="https://www.avito.ru/brands/i17034625" target="_blank" rel="noopener noreferrer" class="footer__social-link" aria-label="Avito">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                <path d="M8.85 12.17a2.85 2.85 0 1 1 5.7 0 2.85 2.85 0 0 1-5.7 0zm8.15 0a5.3 5.3 0 1 0-10.6 0 5.3 5.3 0 0 0 10.6 0zM5.06 5.74a1.68 1.68 0 1 0 0-3.36 1.68 1.68 0 0 0 0 3.36z"/>
              </svg>
            </a>
          </div>
        </div>

        <nav class="footer__nav" aria-label="Навигация по сайту">
          <p class="footer__nav-title">Услуги</p>
          <ul class="footer__nav-list">
            <li><NuxtLink to="/podbor" class="footer__nav-link">Автоподбор под ключ</NuxtLink></li>
            <li><NuxtLink to="/proverka" class="footer__nav-link">Разовая проверка</NuxtLink></li>
            <li><NuxtLink to="/vykup" class="footer__nav-link">Выкуп и комиссионная продажа</NuxtLink></li>
            <li><NuxtLink to="/registraciya-gibdd" class="footer__nav-link">Регистрация в ГИБДД</NuxtLink></li>
            <li><NuxtLink to="/import" class="footer__nav-link">Импорт из Кореи и Китая</NuxtLink></li>
            <li><NuxtLink to="/proverka-kuzova" class="footer__nav-link">Проверка кузовного ремонта</NuxtLink></li>
          </ul>
        </nav>

        <nav class="footer__nav" aria-label="Разделы сайта">
          <p class="footer__nav-title">Разделы</p>
          <ul class="footer__nav-list">
            <li><NuxtLink to="/o-nas" class="footer__nav-link">О нас</NuxtLink></li>
            <li><NuxtLink to="/dkp" class="footer__nav-link">ДКП</NuxtLink></li>
            <li><a href="/#how" class="footer__nav-link">Как мы работаем</a></li>
            <li><a href="/#team" class="footer__nav-link">Команда</a></li>
            <li><a href="/#reviews" class="footer__nav-link">Отзывы</a></li>
            <li><a href="/#faq" class="footer__nav-link">FAQ</a></li>
            <li><a href="/#contact" class="footer__nav-link">Контакты</a></li>
          </ul>
        </nav>

        <div class="footer__contacts">
          <p class="footer__nav-title">Контакты</p>
          <ul class="footer__contacts-list">
            <li class="footer__contacts-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.5 11.5 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.5 11.5 0 0 0 .57 3.6 1 1 0 0 1-.25 1.02l-2.2 2.17z"/></svg>
              <a :href="SITE_PHONE_HREF" class="footer__contacts-link">{{ SITE_PHONE_DISPLAY }}</a>
            </li>
            <li class="footer__contacts-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              <a href="https://t.me/Autopodbor62" target="_blank" rel="noopener noreferrer" class="footer__contacts-link">@Autopodbor62</a>
            </li>
            <li class="footer__contacts-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>
              <span class="footer__contacts-text">{{ SITE_ADDRESS }}</span>
            </li>
            <li class="footer__contacts-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 14.93V17a1 1 0 0 0-2 0v-.07A8 8 0 0 1 4.07 11H5a1 1 0 0 0 0-2h-.93A8 8 0 0 1 11 4.07V5a1 1 0 0 0 2 0v-.93A8 8 0 0 1 19.93 11H19a1 1 0 0 0 0 2h.93A8 8 0 0 1 13 16.93z"/></svg>
              <span class="footer__contacts-text">{{ SITE_HOURS }}</span>
            </li>
          </ul>
        </div>

      </div>
    </div>

    <div class="footer__bottom">
      <div class="footer__bottom-inner">
        <p class="footer__copy">&copy; 2025 Автоподбор 62. Все права защищены.</p>
        <a href="https://www.avito.ru/brands/i17034625#open-reviews-list" target="_blank" rel="noopener noreferrer" class="footer__avito">
          Отзывы на Авито
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  width: 100%;
  background: #111;
  border-top: 3px solid var(--color-accent);
  margin-top: auto;

  &__map {
    width: 100%;
    line-height: 0;
    overflow: hidden;

    iframe {
      display: block;
      width: 100%;
      height: 360px;
      border: none;
      filter: grayscale(20%);

      @media (max-width: 720px) {
        height: 260px;
      }
    }
  }

  &__body {
    padding: 56px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);

    @media (max-width: 720px) {
      padding: 40px 20px;
    }
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
    gap: 40px 48px;

    @media (max-width: 960px) {
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 560px) {
      grid-template-columns: 1fr;
      gap: 32px;
    }
  }

  &__logo {
    font-size: 20px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.02em;
    margin: 0 0 10px;
  }

  &__slogan {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.45);
    line-height: 1.55;
    margin: 0 0 24px;
  }

  &__social {
    display: flex;
    gap: 12px;
  }

  &__social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
    transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;

    &:hover {
      background: var(--color-accent);
      color: #fff;
      border-color: var(--color-accent);
    }
  }

  &__nav-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(255, 255, 255, 0.35);
    margin: 0 0 16px;
  }

  &__nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__nav-link {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    transition: color 0.2s ease;
    line-height: 1.4;

    &:hover {
      color: #fff;
    }
  }

  &__contacts-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  &__contacts-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    color: rgba(255, 255, 255, 0.45);

    svg {
      flex-shrink: 0;
      margin-top: 1px;
      color: var(--color-accent);
    }
  }

  &__contacts-link {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.75);
    text-decoration: none;
    transition: color 0.2s ease;
    line-height: 1.4;

    &:hover {
      color: #fff;
    }
  }

  &__contacts-text {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.55);
    line-height: 1.4;
  }

  &__bottom {
    padding: 20px 24px;
  }

  &__bottom-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    @media (max-width: 560px) {
      flex-direction: column;
      text-align: center;
    }
  }

  &__copy {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.3);
    margin: 0;
  }

  &__avito {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.4);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: rgba(255, 255, 255, 0.8);
    }
  }
}
</style>
