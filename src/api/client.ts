import axios, { type AxiosError } from 'axios'
import {
  handleSessionExpired,
  isSessionExpiredPayload,
  SESSION_EXPIRED_MESSAGE,
} from './session'
import { TOKEN_STORAGE_KEY } from './storageKeys'

export { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './storageKeys'

const fallbackBaseUrl = 'http://localhost:8090/api'


export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? fallbackBaseUrl,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (isFormData) {
    delete config.headers['Content-Type']
  } else if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json'
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => {
    if (isSessionExpiredPayload(response.data)) {
      handleSessionExpired()
      return Promise.reject(
        new axios.AxiosError(
          SESSION_EXPIRED_MESSAGE,
          'ERR_SESSION_EXPIRED',
          response.config,
          response,
        ),
      )
    }

    return response
  },
  (error: AxiosError) => {
    if (isSessionExpiredPayload(error.response?.data)) {
      handleSessionExpired()
    }

    return Promise.reject(error)
  },
)
