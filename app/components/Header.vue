<template>
  <header class="header">
    <div class="header__container">
      <div class="header__logo">
        <NuxtLink to="/">
          <img src="/images/logo.png" alt="Автоподбор 62" class="header__logo-img" />
        </NuxtLink>
      </div>
      <nav class="header__nav">
        <NuxtLink to="/" class="header__link">Главная</NuxtLink>
        <NuxtLink to="/" class="header__link">Подбор автомобиля</NuxtLink>
        <NuxtLink to="/" class="header__link">Пригон из-за рубежа</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translate(-50%, 0%);
  background: rgba(56, 56, 56, 0.436);
  backdrop-filter: blur(10px);
  border-radius: 60px;
  height: 62px;
  width: auto;
  z-index: 100;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 0 10px;
    gap: 40px;
  }

  &__logo {
    a {
      text-decoration: none;
      display: block;
    }
  }

  &__logo-img {
    height: 50px;
    width: auto;
    display: block;
  }

  &__nav {
    display: flex;
    gap: 30px;
    align-items: center;
    margin: 0 20px;
  }

  &__link {
    color: #fff;
    text-decoration: none;
    transition: opacity 0.3s;

    &:hover {
      opacity: 0.7;
    }
  }
}
</style>
