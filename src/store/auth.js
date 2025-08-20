import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    user: null
  }),
  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('auth_token', token)
    },
    loadToken() {
      const existing = localStorage.getItem('auth_token')
      if (existing) this.token = existing
    },
    setUser(user) {
      this.user = user
    },
    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('auth_token')
    }
  }
})

