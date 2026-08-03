export const METRIKA_COUNTER_ID = 108781955

type YmFn = (counterId: number, action: string, ...args: unknown[]) => void

/**
 * Отправляет достижение цели в Яндекс.Метрику.
 * Безопасно вызывать где угодно: на сервере и без загруженного счётчика — no-op.
 */
export function reachGoal(goal: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  const ym = (window as { ym?: YmFn }).ym
  if (typeof ym !== 'function') return
  ym(METRIKA_COUNTER_ID, 'reachGoal', goal, params)
}
