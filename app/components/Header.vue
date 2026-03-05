<script setup lang="ts">
import { ref } from 'vue'
import { ElDrawer } from 'element-plus'

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
          <img src="/images/logo.png" alt="Автоподбор 62" class="header__logo-img" />
        </NuxtLink>
      </div>
      
      <!-- Десктопное меню -->
      <nav class="header__nav header__nav--desktop">
        <NuxtLink to="/" class="header__link">Главная</NuxtLink>
        <NuxtLink to="/" class="header__link">Подбор автомобиля</NuxtLink>
        <NuxtLink to="/" class="header__link">Импорт</NuxtLink>
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
          <NuxtLink to="/" class="header__link--mobile" @click="closeDrawer">
            Подбор автомобиля
          </NuxtLink>
          <NuxtLink to="/" class="header__link--mobile" @click="closeDrawer">
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
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(17, 17, 17, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  height: 64px;
  width: auto;
  z-index: 100;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    width: calc(100% - 32px);
    max-width: 400px;
    top: 12px;
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 0 24px;
    gap: 40px;
  }

  &__logo {
    a {
      text-decoration: none;
      display: block;
    }
  }

  &__logo-img {
    height: 48px;
    width: auto;
    display: block;
  }

  &__nav {
    display: flex;
    gap: 36px;
    align-items: center;
    margin: 0 16px;

    &--desktop {
      @media (max-width: 768px) {
        display: none;
      }
    }

    &--mobile {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 16px 0;
    }
  }

  &__link {
    color: rgba(255, 255, 255, 0.92);
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.02em;
    transition: color 0.25s ease;

    &:hover {
      color: #fff;
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

  &__burger {
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 28px;
    height: 28px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 101;

    @media (max-width: 768px) {
      display: flex;
    }

    &:focus {
      outline: none;
    }
  }

  &__burger-line {
    width: 100%;
    height: 2px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 2px;
    transition: all 0.3s;
  }

  &__drawer {
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
}
</style>
