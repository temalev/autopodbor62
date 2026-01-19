<template>
  <div class="page">
    <div class="page__content">
      <h1 class="page__title">
        Автоподбор 62 — покупка
        и&nbsp;продажа&nbsp;автомобиля без&nbsp;риска
        и&nbsp;потери времени
      </h1>
      <p class="page__text">
        Мы берём на себя все сложные и рискованные этапы, чтобы вы получили честный автомобиль по реальной цене — без обмана, сюрпризов и лишних затрат.
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
  background-image: url('/images/bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;

  &__content {
    margin-top: 80px;
    max-width: 800px;
  }

  &__title {
    color: #fff;
    font-size: 38px;
    font-weight: bold;
    line-height: 1.2;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    margin: 100px 0 30px 0;
  }

  &__text {
    color: #fff;
    font-size: 18px;
    font-weight: normal;
    line-height: 1.6;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    margin: 0;
  }
}
</style>
