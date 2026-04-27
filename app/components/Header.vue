<script setup lang="ts">
import { ref } from 'vue'
import { ElDrawer } from 'element-plus'

const { app: { baseURL } } = useRuntimeConfig()
const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL

const drawerVisible = ref(false)
const dropdownOpen = ref(false)
const mobileServicesOpen = ref(false)

let closeTimer: ReturnType<typeof setTimeout> | null = null

const openDropdown = () => {
  if (closeTimer) clearTimeout(closeTimer)
  dropdownOpen.value = true
}

const scheduleClose = () => {
  closeTimer = setTimeout(() => {
    dropdownOpen.value = false
  }, 120)
}

const toggleDrawer = () => {
  drawerVisible.value = !drawerVisible.value
}

const closeDrawer = () => {
  drawerVisible.value = false
  mobileServicesOpen.value = false
}

const services = [
  { to: '/podbor', label: 'Подбор автомобиля' },
  { to: '/proverka', label: 'Разовая проверка' },
  { to: '/vykup', label: 'Выкуп и комиссионная продажа' },
  { to: '/registraciya-gibdd', label: 'Регистрация в ГИБДД' },
  { to: '/import', label: 'Импорт из-за рубежа' },
  { to: '/proverka-kuzova', label: 'Проверка кузова' },
]
</script>

<template>
  <header class="header">
    <div class="header__container">
      <div class="header__logo">
        <NuxtLink to="/" @click="closeDrawer">
          <img :src="`${base}/images/logo.png`" alt="Автоподбор 62" class="header__logo-img" />
          <span class="header__logo-name">Автоподбор <span class="header__logo-name-accent">62</span></span>
        </NuxtLink>
      </div>

      <!-- Десктопное меню -->
      <nav class="header__nav header__nav--desktop">
        <NuxtLink to="/" class="header__link">Главная</NuxtLink>
        <NuxtLink to="/o-nas" class="header__link">О нас</NuxtLink>
        <div
          class="header__dropdown"
          @mouseenter="openDropdown"
          @mouseleave="scheduleClose"
        >
          <button class="header__link header__dropdown-trigger" :class="{ 'is-open': dropdownOpen }" aria-haspopup="true" :aria-expanded="dropdownOpen">
            Услуги
            <svg class="header__dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <Transition name="dropdown">
            <div v-show="dropdownOpen" class="header__dropdown-menu" @mouseenter="openDropdown" @mouseleave="scheduleClose">
              <NuxtLink
                v-for="service in services"
                :key="service.to"
                :to="service.to"
                class="header__dropdown-item"
                @click="dropdownOpen = false"
              >
                {{ service.label }}
              </NuxtLink>
            </div>
          </Transition>
        </div>
        <!-- <NuxtLink to="/dkp" class="header__link">ДКП онлайн</NuxtLink> -->
      </nav>

      <!-- Бургер-кнопка для мобильной версии -->
      <button
        class="header__burger"
        @click="toggleDrawer"
        aria-label="Открыть меню"
      >
        <span class="header__burger-line"></span>
        <span class="header__burger-line"></span>
        <span class="header__burger-line"></span>
      </button>
    </div>

    <!-- Выдвижное меню -->
    <ClientOnly>
      <ElDrawer
        v-model="drawerVisible"
        title="Меню"
        direction="rtl"
        size="280px"
        :with-header="true"
        :append-to-body="true"
        :modal="true"
        class="header__drawer"
      >
        <nav class="header__nav--mobile">
          <NuxtLink to="/" class="header__link--mobile" @click="closeDrawer">
            Главная
          </NuxtLink>
          <NuxtLink to="/o-nas" class="header__link--mobile" @click="closeDrawer">
            О нас
          </NuxtLink>
          <div class="header__mobile-services">
            <button
              class="header__mobile-services-toggle"
              :class="{ 'is-open': mobileServicesOpen }"
              @click="mobileServicesOpen = !mobileServicesOpen"
            >
              Услуги
              <svg class="header__mobile-services-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <Transition name="accordion">
              <div v-show="mobileServicesOpen" class="header__mobile-services-list">
                <NuxtLink
                  v-for="service in services"
                  :key="service.to"
                  :to="service.to"
                  class="header__link--mobile header__link--sub"
                  @click="closeDrawer"
                >
                  {{ service.label }}
                </NuxtLink>
              </div>
            </Transition>
          </div>
          <!-- <NuxtLink to="/dkp" class="header__link--mobile" @click="closeDrawer">
            ДКП онлайн
          </NuxtLink> -->
        </nav>
      </ElDrawer>
    </ClientOnly>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: linear-gradient(
    135deg,
    rgba(14, 10, 6, 0.88) 0%,
    rgba(24, 14, 4, 0.252) 50%,
    rgba(14, 10, 6, 0.372) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(249, 115, 22, 0.18);
  box-shadow:
    0 4px 32px rgba(0, 0, 0, 0.35),
    inset 0 -1px 0 rgba(249, 115, 22, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  z-index: 100;
}

.header__container {
  max-width: 1580px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 62px;
  padding: 0 24px;
  gap: 40px;

  @media (max-width: 768px) {
    height: 64px;
    padding: 0 20px;
  }
}

.header__logo {
  a {
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

.header__logo-name {
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
  white-space: nowrap;
  line-height: 1;

  @media (max-width: 480px) {
    font-size: 15px;
  }
}

.header__logo-name-accent {
  color: var(--color-accent);
}

.header__logo-img {
  height: 44px;
  width: auto;
  display: block;

  @media (max-width: 768px) {
    height: 40px;
  }
}

.header__nav {
  display: flex;
  gap: 32px;
  align-items: center;

  &--desktop {
    @media (max-width: 768px) {
      display: none;
    }
  }

  &--mobile {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px 0;
  }
}

.header__link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.02em;
  padding: 8px 0;
  transition: color 0.2s ease;

  &:hover {
    color: #fff;
  }

  &.router-link-active {
    color: var(--color-accent);
  }

  &--mobile {
    color: #1a1d23;
    text-decoration: none;
    padding: 14px 24px;
    border-radius: 10px;
    transition: background 0.2s ease, color 0.2s ease;
    font-size: 16px;
    font-weight: 500;
    display: block;

    &:hover {
      background: rgba(249, 115, 22, 0.1);
      color: #f97316;
    }

    &.router-link-active {
      color: #f97316;
    }
  }

  &--sub {
    padding: 11px 24px 11px 40px;
    font-size: 15px;
    font-weight: 400;
  }
}

// Dropdown (десктоп)
.header__dropdown {
  position: relative;
}

.header__dropdown-trigger {
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: inherit;

  &.is-open .header__dropdown-arrow,
  &:hover .header__dropdown-arrow {
    transform: rotate(180deg);
  }
}

.header__dropdown-arrow {
  transition: transform 0.2s ease;
  opacity: 0.7;
  flex-shrink: 0;
}

.header__dropdown-menu {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 220px;
  background: rgba(18, 12, 6, 0.97);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(249, 115, 22, 0.2);
  border-radius: 14px;
  padding: 8px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
  z-index: 200;

  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 12px;
    background: rgba(18, 12, 6, 0.97);
    border-left: 1px solid rgba(249, 115, 22, 0.2);
    border-top: 1px solid rgba(249, 115, 22, 0.2);
    rotate: 45deg;
    border-radius: 2px 0 0 0;
  }
}

.header__dropdown-item {
  display: block;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.15s ease, color 0.15s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(249, 115, 22, 0.15);
    color: #fff;
  }

  &.router-link-active {
    color: var(--color-accent);
    background: rgba(249, 115, 22, 0.08);
  }
}

// Dropdown transition
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-6px);
}

// Mobile services accordion
.header__mobile-services {
  display: flex;
  flex-direction: column;
}

.header__mobile-services-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: none;
  border: none;
  cursor: pointer;
  padding: 14px 24px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  color: #1a1d23;
  font-family: inherit;
  transition: background 0.2s ease, color 0.2s ease;
  text-align: left;

  &:hover,
  &.is-open {
    background: rgba(249, 115, 22, 0.08);
    color: #f97316;
  }

  .header__mobile-services-arrow {
    transition: transform 0.25s ease;
    opacity: 0.6;
    flex-shrink: 0;
  }

  &.is-open .header__mobile-services-arrow {
    transform: rotate(180deg);
    opacity: 1;
  }
}

.header__mobile-services-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow: hidden;
}

// Accordion transition
.accordion-enter-active,
.accordion-leave-active {
  transition: opacity 0.22s ease;
}
.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
}

.header__burger {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;

  @media (max-width: 768px) {
    display: flex;
  }

  &:focus {
    outline: none;
  }
}

.header__burger-line {
  width: 100%;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 2px;
  transition: all 0.3s;
}

.header__drawer {
  :deep(.el-drawer) {
    z-index: 10000;
  }

  :deep(.el-overlay) {
    z-index: 9999;
  }

  :deep(.el-drawer__header) {
    margin-bottom: 16px;
    padding: 24px;
    border-bottom: 1px solid #e8e6e3;
  }

  :deep(.el-drawer__title) {
    font-size: 22px;
    font-weight: 600;
    color: #1a1d23;
  }

  :deep(.el-drawer__body) {
    padding: 0;
  }
}
</style>
