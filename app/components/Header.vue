<script setup lang="ts">
import { ref } from 'vue'
import { ElDrawer } from 'element-plus'

const { app: { baseURL } } = useRuntimeConfig()
const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL

const drawerVisible = ref(false)

const toggleDrawer = () => {
  drawerVisible.value = !drawerVisible.value
}

const closeDrawer = () => {
  drawerVisible.value = false
}
</script>

<template>
  <header class="header">
    <div class="header__container">
      <div class="header__logo">
        <NuxtLink to="/" @click="closeDrawer">
          <img :src="`${base}/images/logo.png`" alt="Автоподбор 62" class="header__logo-img" />
        </NuxtLink>
      </div>
      
      <!-- Десктопное меню -->
      <nav class="header__nav header__nav--desktop">
        <NuxtLink to="/" class="header__link">Главная</NuxtLink>
        <NuxtLink to="/o-nas" class="header__link">О нас</NuxtLink>
        <NuxtLink to="/podbor" class="header__link">Подбор автомобиля</NuxtLink>
        <NuxtLink to="/proverka" class="header__link">Разовая проверка</NuxtLink>
        <NuxtLink to="/import" class="header__link">Импорт</NuxtLink>
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
          <NuxtLink to="/podbor" class="header__link--mobile" @click="closeDrawer">
            Подбор автомобиля
          </NuxtLink>
          <NuxtLink to="/proverka" class="header__link--mobile" @click="closeDrawer">
            Разовая проверка
          </NuxtLink>
          <NuxtLink to="/import" class="header__link--mobile" @click="closeDrawer">
            Импорт
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
  background: var(--color-dark, #111);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 100;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
}

.header__container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 72px;
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
    display: block;
  }
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
  font-size: 15px;
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
    font-size: 17px;
    font-weight: 500;

    &:hover {
      background: rgba(249, 115, 22, 0.1);
      color: #f97316;
    }
  }
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
