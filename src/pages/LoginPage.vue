<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="shadow-2 lime-glow rounded-borders" style="width: 900px; max-width: 95%;">
      <div class="row items-stretch">
        <!-- Left: Illustration -->
        <div class="col-12 col-md-6 q-pa-md bg-dark pane-left">
          <q-img :src="illustration" ratio="4/3" fit="contain" class="floating login-illustration" @error="onImgError" />
        </div>
        <!-- Right: Form -->
        <div class="col-12 col-md-6 q-pa-lg form-pane">
          <!-- Title -->
          <div class="text-h6 text-center text-lime">Merchant Login</div>
          <div class="text-subtitle2 text-center q-mb-md">Welcome back</div>
          <!-- Form -->
          <q-form @submit.prevent="login" class="q-gutter-md">
            <q-input v-model="email" type="email" label="Email" filled dense required />
            <q-input v-model="password" type="password" label="Password" filled dense required />
            <q-btn type="submit" label="Login" class="btn-gradient full-width q-mt-sm" :loading="loading" />
          </q-form>
          <!-- Links -->
          <div class="q-mt-md text-center">
            <q-btn flat label="Create account" color="secondary" @click="$router.push('/register')" />
          </div>
          <div class="q-mt-xs text-center">
            <q-btn flat label="Back to Home" color="secondary" @click="goHome" />
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from '../boot/axios'
import { useAuthStore } from '../store/auth'
import { pinia } from '../store/pinia'

const router = useRouter()
const auth = useAuthStore(pinia)
const email = ref('')
const password = ref('')
const loading = ref(false)
const illustration = ref('https://source.unsplash.com/800x600/?fintech,3d,payments')
const onImgError = (e) => {
  e.target.src = 'https://placehold.co/800x600/121018/bdf000?text=FinteckX'
}

const login = async () => {
  try {
    loading.value = true
    const { data } = await api.post('/merchants/login', { email: email.value, password: password.value })
    if (!data?.token) { 
      Notify.create({ type: 'negative', message: 'Invalid credentials' })
      return 
    }
    auth.setToken(data.token)
    auth.setUser(data.user || null)
    const role = (data.user?.role || data.role || '').toString().toLowerCase()
    const target = role === 'admin' ? '/admin-dashboard' : '/dashboard'
    Notify.create({ type: 'positive', message: 'Welcome back!' })
    router.push(target)
  } catch {
    Notify.create({ type: 'negative', message: 'Login failed. Please try again.' })
  } finally {
    loading.value = false
  }
}

const goHome = () => router.push('/')
</script>

<style scoped>
.text-lime {
  color: #bdf000;
}

.lime-glow {
  border-radius: 14px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(189, 240, 0, 0.28), 0 0 24px rgba(189, 240, 0, 0.18);
}

.btn-gradient {
  background: linear-gradient(135deg, #bdf000, #ffffff);
  color: #09050d;
  font-weight: 700;
  border: 1px solid rgba(189, 240, 0, 0.5);
}

.full-width {
  width: 100%;
}

.bg-dark {
  background: #000;
}

.pane-left {
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating {
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) }
  50% { transform: translateY(-12px) }
}

.login-illustration {
  border-radius: 12px;
}

/* Make inputs readable on dark */
.form-pane :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.06);
}
</style>