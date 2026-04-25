import axios from 'axios'

export const TOKEN_STORAGE_KEY = 'ideaTechAccessToken'
export const USER_STORAGE_KEY = 'ideaTechUserData'

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
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      localStorage.removeItem(USER_STORAGE_KEY)
    }

    return Promise.reject(error)
  },
)
