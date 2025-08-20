<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="q-pa-lg glass-card elevated-hover" style="width:420px; max-width:95%;">
      <q-card-section>
        <div class="text-h6 text-center">Merchant Login</div>
      </q-card-section>
      <q-form @submit.prevent="login" class="q-gutter-md">
        <q-input v-model="email" type="email" label="Email" dense outlined required />
        <q-input v-model="password" type="password" label="Password" dense outlined required />
        <q-btn type="submit" label="Login" class="full-width btn-gradient" :loading="loading" />
      </q-form>
      <q-card-actions align="center">
        <q-btn flat label="Create account" @click="$router.push('/register')" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from '../boot/axios'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const loading = ref(false)

const login = async () => {
  try {
    loading.value = true
    const { data } = await api.post('/merchants/login', { email: email.value, password: password.value })
    if (data?.token) {
      auth.setToken(data.token)
      auth.setUser(data.user || null)
      Notify.create({ type: 'positive', message: 'Welcome back!' })
      router.push('/dashboard')
    }
  } finally {
    loading.value = false
  }
}
</script>