import axios from 'axios'
import { Notify } from 'quasar'
import { useAuthStore } from '../store/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 20000
})

api.interceptors.request.use((config) => {
  try {
    const auth = useAuthStore()
    if (auth && auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`
      return config
    }
  } catch {
    /* no-op */
  }
  const token = localStorage.getItem('auth_token') || ''
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const message = error?.response?.data?.message || error.message || 'Request failed'
    if (status === 401) {
      try {
        const auth = useAuthStore()
        if (auth) auth.logout()
      } catch {
        localStorage.removeItem('auth_token')
      }
    }
    Notify.create({ type: 'negative', message })
    return Promise.reject(error)
  }
)

export default api

