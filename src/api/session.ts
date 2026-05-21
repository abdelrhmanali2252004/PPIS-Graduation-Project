import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './storageKeys'

export const SESSION_EXPIRED_MESSAGE =
  'Your session has expired. Please log in again.'

const LOGIN_PATH = '/login'

function getResponseMessage(data: unknown): string | null {
  if (!data || typeof data !== 'object') {
    return null
  }

  const record = data as Record<string, unknown>
  if (typeof record.message === 'string') {
    return record.message
  }
  if (typeof record.error === 'string') {
    return record.error
  }
  if (typeof record.msg === 'string') {
    return record.msg
  }

  return null
}

export function isSessionExpiredMessage(message: string | null | undefined): boolean {
  return message === SESSION_EXPIRED_MESSAGE
}

export function isSessionExpiredPayload(data: unknown): boolean {
  return isSessionExpiredMessage(getResponseMessage(data))
}

let handlingSessionExpiry = false

export function clearAuthStorage(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(USER_STORAGE_KEY)
}

export function handleSessionExpired(): void {
  if (handlingSessionExpiry) {
    return
  }

  handlingSessionExpiry = true
  clearAuthStorage()

  const onLoginPage =
    window.location.pathname === LOGIN_PATH ||
    window.location.pathname.startsWith(`${LOGIN_PATH}/`)

  if (!onLoginPage) {
    window.location.replace(LOGIN_PATH)
  } else {
    handlingSessionExpiry = false
  }
}
