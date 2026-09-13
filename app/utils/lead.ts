import { useRuntimeConfig } from '#imports'
import { reachGoal } from './metrika'

export type LeadPayload = {
  name?: string
  phone?: string
  car?: string
  page?: string
  source?: string
}

export type LeadSendResult =
  | { ok: true }
  | { ok: false; error: string }

function normalizePhone(phone: string | undefined | null): string {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')
  if (!digits) return ''
  // Приводим к 7XXXXXXXXXX, если это РФ номер
  if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) return `7${digits.slice(1)}`
  return digits
}

/**
 * Проверка заявки перед отправкой. Живёт здесь, а не в страницах: форм на
 * сайте восемь, и правило, продублированное восемь раз, рано или поздно
 * разъедется. Любая страница, которая зовёт sendLead, получает проверку
 * автоматически — пустую заявку отправить нельзя в принципе.
 *
 * Возвращает текст ошибки для показа пользователю или null, если всё в порядке.
 */
export function validateLead(payload: LeadPayload): string | null {
  const name = (payload.name || '').trim()
  const phone = normalizePhone(payload.phone)

  if (!name && !phone) return 'Заполните имя и телефон — иначе мы не сможем перезвонить.'
  if (!name) return 'Напишите, как к вам обращаться.'
  if (name.length < 2) return 'Имя слишком короткое.'
  if (!phone) return 'Укажите телефон — без него заявку не принять.'

  // После normalizePhone российский номер — это 11 цифр, начинающихся с 7.
  // Десять цифр тоже принимаем: человек мог набрать без кода страны.
  const digits = phone.startsWith('7') && phone.length === 11 ? phone.slice(1) : phone
  if (digits.length !== 10) return 'Телефон неполный — нужно 10 цифр после +7.'

  return null
}

export async function sendLead(payload: LeadPayload): Promise<LeadSendResult> {
  const invalid = validateLead(payload)
  if (invalid) return { ok: false, error: invalid }

  const { public: pub } = useRuntimeConfig()
  const endpoint = String((pub as any).formspreeEndpoint || '').trim()

  if (!endpoint) {
    return { ok: false, error: 'Не настроен endpoint для отправки заявки' }
  }

  const body: LeadPayload = {
    ...payload,
    phone: normalizePhone(payload.phone),
    page: payload.page || (typeof window !== 'undefined' ? window.location.href : undefined),
  }

  try {
    // Отправляем как обычную HTML-форму (x-www-form-urlencoded),
    // чтобы избежать CORS-preflight и работало на статическом хостинге.
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries(body)) {
      if (v == null) continue
      const s = String(v).trim()
      if (!s) continue
      params.set(k, s)
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: params.toString(),
    })

    if (!res.ok) {
      let msg = `HTTP ${res.status}`
      try {
        const data = await res.json()
        if (data?.error) msg = String(data.error)
      } catch {
        // ignore
      }
      return { ok: false, error: msg }
    }

    reachGoal('lead_success', { source: body.source || 'unknown', page: body.page })

    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Ошибка сети' }
  }
}
