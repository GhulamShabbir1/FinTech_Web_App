import { defineStore } from 'pinia'
import api from '../boot/axios'

export const useMerchantStore = defineStore('merchant', {
  state: () => ({
    profile: null,
    status: 'Pending'
  }),
  actions: {
    async register(formData, onUploadProgress) {
      const response = await api.post('/merchants/register', formData, { onUploadProgress })
      this.profile = response.data
      this.status = response.data?.status || 'Pending'
      return response.data
    },
    async fetchById(id) {
      const response = await api.get(`/merchants/${id}`)
      this.profile = response.data
      this.status = response.data?.status || this.status
      return response.data
    },
    async update(id, payload) {
      const response = await api.patch(`/merchants/${id}` , payload)
      this.profile = response.data
      this.status = response.data?.status || this.status
      return response.data
    }
  }
})

