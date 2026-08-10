/**
 * Сорванная загрузка JS-чанка чаще всего лечится перезагрузкой: моргнула сеть
 * либо выкатился новый деплой, и в старом HTML остались ссылки на файлы,
 * которых уже нет. Без этого Nuxt показывает error.vue, а робот Яндекса,
 * который выполняет JS, индексирует страницу ошибки вместо самой страницы.
 *
 * Перезагружаем не чаще одного раза в RETRY_WINDOW_MS: если и вторая попытка
 * упала, чанк недоступен всерьёз (заблокирован расширением, прокси) — тогда
 * лучше показать страницу ошибки, чем крутить бесконечный цикл перезагрузок.
 */
const RETRY_KEY = 'nuxt:chunk-reload-at'
const RETRY_WINDOW_MS = 30_000

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.hook('app:chunkError', () => {
    let lastAttempt = 0
    try {
      lastAttempt = Number(sessionStorage.getItem(RETRY_KEY)) || 0
      sessionStorage.setItem(RETRY_KEY, String(Date.now()))
    } catch {
      // Приватный режим: sessionStorage недоступен, повторять вслепую нельзя
      return
    }

    if (Date.now() - lastAttempt < RETRY_WINDOW_MS) return

    reloadNuxtApp({ persistState: false })
  })
})
