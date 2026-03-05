<template>
  <footer class="footer">
    <div class="footer__container">
      <p class="footer__text">&copy; 2025 Автоподбор 62. Все права защищены.</p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  width: 100%;
  background: #111;
  border-top: 3px solid var(--color-accent);
  margin-top: auto;
  padding: 28px 24px;
}

.footer__container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.footer__text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  letter-spacing: 0.02em;
  margin: 0;
}
</style>
