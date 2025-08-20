<template>
  <q-page class="q-pa-lg">
    <div class="q-mx-auto" style="max-width: 1100px;">
      <div class="row items-center q-col-gutter-xl">
        <div class="col-12 col-md-6">
          <q-banner dense class="text-white q-pa-md rounded-borders animate__animated animate__fadeIn header-gradient">
            <div class="text-h4 q-mb-xs">Fintech System</div>
            <div class="text-subtitle1">Modern payments and merchant tools</div>
          </q-banner>

          <div class="q-mt-lg text-body1 text-grey-8">
            Build, scale and manage payments with ease: onboarding, checkout, analytics and more.
          </div>

          <div class="q-mt-lg row q-gutter-sm">
            <q-btn label="Get Started" @click="goToRegister" class="btn-gradient" />
            <q-btn outline label="Login" @click="goToLogin" class="btn-outline-light" />
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6" v-for="card in cards" :key="card.title">
              <q-card class="q-pa-md animate__animated animate__zoomIn glass-card elevated-hover" :class="card.color">
                <div class="row items-center">
                  <q-icon :name="card.icon" size="md" class="q-mr-sm" />
                  <div class="text-subtitle1 text-weight-medium">{{ card.title }}</div>
                </div>
                <div class="q-mt-sm text-grey-8">{{ card.desc }}</div>
              </q-card>
            </div>
          </div>
        </div>
      </div>

      <div class="q-mt-xl">
        <div class="text-h5 q-mb-md">Benefits & Advantages</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-3" v-for="b in benefits" :key="b.title">
            <q-card class="q-pa-md hover-raise animate__animated animate__fadeInUp">
              <q-icon :name="b.icon" color="primary" size="lg" />
              <div class="text-subtitle2 q-mt-sm">{{ b.title }}</div>
              <div class="text-caption text-grey-7 q-mt-xs">{{ b.desc }}</div>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToRegister = () => router.push('/register')
const goToLogin = () => router.push('/login')

const cards = [
  { title: 'Merchant Onboarding', desc: 'KYC, approval flow and profile management.', icon: 'store', color: 'bg-blue-1' },
  { title: 'Secure Checkout', desc: 'Hosted checkout with cards and wallets.', icon: 'credit_card', color: 'bg-green-1' },
  { title: 'Transactions', desc: 'Filterable history, refunds and CSV export.', icon: 'receipt_long', color: 'bg-orange-1' },
  { title: 'Analytics', desc: 'Revenue trends and method distribution.', icon: 'insights', color: 'bg-purple-1' }
]

const benefits = [
  { title: 'Fast Integration', desc: 'Drop-in components and clear APIs.', icon: 'bolt' },
  { title: 'Reliable', desc: 'Robust infra with retries and alerts.', icon: 'verified' },
  { title: 'Secure', desc: 'PCI-aware flows and JWT auth.', icon: 'shield' },
  { title: 'Scalable', desc: 'Optimized queries and caching.', icon: 'trending_up' }
]
</script>

<style scoped>
.hover-raise:hover { transform: translateY(-4px); transition: transform .2s ease; }
</style>