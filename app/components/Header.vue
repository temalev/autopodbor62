<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ElDrawer } from 'element-plus'

const { app: { baseURL } } = useRuntimeConfig()
const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL

const drawerVisible = ref(false)
const dropdownOpen = ref(false)
const mobileServicesOpen = ref(false)

const dropdownRoot = ref<HTMLElement | null>(null)
const dropdownTrigger = ref<HTMLButtonElement | null>(null)

const openDropdown = () => {
  dropdownOpen.value = true
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const onDocumentClick = (event: MouseEvent) => {
  if (!dropdownOpen.value) return
  const root = dropdownRoot.value
  if (root && !root.contains(event.target as Node)) closeDropdown()
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || !dropdownOpen.value) return
  closeDropdown()
  dropdownTrigger.value?.focus()
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})

const toggleDrawer = () => {
  drawerVisible.value = !drawerVisible.value
}

const closeDrawer = () => {
  drawerVisible.value = false
  mobileServicesOpen.value = false
}

const services = [
  {
    to: '/podbor',
    label: 'Подбор автомобиля',
    description: 'Найдём и проверим авто под ключ',
    icon: 'podbor',
  },
  {
    to: '/proverka',
    label: 'Разовая проверка',
    description: 'Выезд к машине и заключение эксперта',
    icon: 'proverka',
  },
  {
    to: '/vykup',
    label: 'Выкуп и комиссия',
    description: 'Продадим ваше авто выгодно и быстро',
    icon: 'vykup',
  },
  {
    to: '/registraciya-gibdd',
    label: 'Регистрация в ГИБДД',
    description: 'Учёт и номера без очередей',
    icon: 'gibdd',
  },
  {
    to: '/import',
    label: 'Импорт из-за рубежа',
    description: 'Авто из Кореи, Китая и Европы',
    icon: 'import',
  },
  {
    to: '/proverka-kuzova',
    label: 'Проверка кузова',
    description: 'Толщиномер, ЛКП и качество ремонта',
    icon: 'kuzov',
  },
] as const
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
          ref="dropdownRoot"
          class="header__dropdown"
          @mouseenter="openDropdown"
          @mouseleave="closeDropdown"
        >
          <button
            ref="dropdownTrigger"
            type="button"
            class="header__link header__dropdown-trigger"
            :class="{ 'is-open': dropdownOpen }"
            aria-haspopup="true"
            :aria-expanded="dropdownOpen"
            @click="toggleDropdown"
          >
            Услуги
            <svg class="header__dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <Transition name="dropdown">
            <div v-show="dropdownOpen" class="header__dropdown-panel">
              <div class="header__dropdown-menu">
                <NuxtLink
                  v-for="service in services"
                  :key="service.to"
                  :to="service.to"
                  class="header__dropdown-item"
                  @click="closeDropdown"
                >
                  <span class="header__dropdown-icon" aria-hidden="true">
                    <ServiceIcon :name="service.icon" :size="21" />
                  </span>
                  <span class="header__dropdown-text">
                    <span class="header__dropdown-title">{{ service.label }}</span>
                    <span class="header__dropdown-desc">{{ service.description }}</span>
                  </span>
                </NuxtLink>
              </div>
            </div>
          </Transition>
        </div>
        <NuxtLink to="/dkp" class="header__link">ДКП онлайн</NuxtLink>
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
        size="300px"
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
              type="button"
              class="header__mobile-services-toggle"
              :class="{ 'is-open': mobileServicesOpen }"
              :aria-expanded="mobileServicesOpen"
              @click="mobileServicesOpen = !mobileServicesOpen"
            >
              Услуги
              <svg class="header__mobile-services-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
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
                  <span class="header__mobile-sub-icon" aria-hidden="true">
                    <ServiceIcon :name="service.icon" :size="18" />
                  </span>
                  {{ service.label }}
                </NuxtLink>
              </div>
            </Transition>
          </div>
          <NuxtLink to="/dkp" class="header__link--mobile" @click="closeDrawer">
            ДКП онлайн
          </NuxtLink>
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
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 100%),
    rgba(18, 12, 6, 0.42);
  backdrop-filter: saturate(180%) blur(24px);
  -webkit-backdrop-filter: saturate(180%) blur(24px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(255, 255, 255, 0.04);
  z-index: 100;
}

@supports not (backdrop-filter: blur(1px)) {
  .header {
    background: rgba(18, 12, 6, 0.92);
  }
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
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 24px 11px 34px;
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

  &.is-open {
    color: #fff;
  }

  &.is-open .header__dropdown-arrow {
    transform: rotate(180deg);
    opacity: 1;
  }
}

.header__dropdown-arrow {
  transition: transform 0.22s ease, opacity 0.22s ease;
  opacity: 0.6;
  flex-shrink: 0;
}

// Обёртка держит «мостик» между триггером и панелью,
// чтобы курсор не терял ховер по пути вниз.
.header__dropdown-panel {
  // Прижимаем панель к правому краю триггера: меню в хедере стоит справа,
  // поэтому центрирование по кнопке выносило панель за экран.
  position: absolute;
  top: 100%;
  right: -14px;
  left: auto;
  padding-top: 14px;
  z-index: 200;
}

.header__dropdown-menu {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2px;
  width: min(600px, calc(100vw - 48px));
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 60%),
    rgba(16, 11, 6, 0.86);
  backdrop-filter: saturate(180%) blur(28px);
  -webkit-backdrop-filter: saturate(180%) blur(28px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 10px;
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);
    width: min(330px, calc(100vw - 40px));
  }
}

@supports not (backdrop-filter: blur(1px)) {
  .header__dropdown-menu {
    background: rgba(16, 11, 6, 0.98);
  }
}

.header__dropdown-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  text-decoration: none;
  transition: background 0.16s ease;

  &:hover,
  &:focus-visible {
    background: rgba(255, 255, 255, 0.07);
    outline: none;
  }

  &:hover .header__dropdown-icon,
  &:focus-visible .header__dropdown-icon {
    background:
      linear-gradient(160deg, rgba(249, 115, 22, 0.42) 0%, rgba(249, 115, 22, 0.2) 100%),
      rgba(255, 255, 255, 0.04);
    border-color: rgba(249, 115, 22, 0.5);
    color: #fff;
    transform: translateY(-1px);
  }

  &:hover .header__dropdown-title,
  &:focus-visible .header__dropdown-title {
    color: #fff;
  }

  &.router-link-active {
    background: rgba(249, 115, 22, 0.12);

    .header__dropdown-title {
      color: var(--color-accent);
    }

    .header__dropdown-icon {
      background:
        linear-gradient(160deg, rgba(249, 115, 22, 0.34) 0%, rgba(249, 115, 22, 0.14) 100%),
        rgba(255, 255, 255, 0.04);
      border-color: rgba(249, 115, 22, 0.45);
      color: var(--color-accent);
    }
  }
}

.header__dropdown-icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background:
    linear-gradient(160deg, rgba(249, 115, 22, 0.16) 0%, rgba(249, 115, 22, 0.05) 100%),
    rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: var(--color-accent);
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease, transform 0.18s ease;

  svg {
    display: block;
  }
}

.header__dropdown-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.header__dropdown-title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  letter-spacing: -0.01em;
  line-height: 1.25;
  transition: color 0.16s ease;
}

.header__dropdown-desc {
  font-size: 12.5px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.35;
}

// Dropdown transition
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (prefers-reduced-motion: reduce) {
  .header__dropdown-item:hover .header__dropdown-icon,
  .header__dropdown-item:focus-visible .header__dropdown-icon {
    transform: none;
  }

  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: opacity 0.12s ease;
  }
  .dropdown-enter-from,
  .dropdown-leave-to {
    transform: none;
  }
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
  width: 100%;
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

.header__mobile-sub-icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  color: #f97316;
  opacity: 0.85;

  svg {
    display: block;
  }
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
