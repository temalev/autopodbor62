<template>
  <footer class="footer">
    <div class="footer__container">
      <p class="footer__text">&copy; 2025 Все права защищены</p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: auto;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
  }

  &__text {
    color: #fff;
    margin: 0;
  }
}
</style>
