<template>
  <q-page class="q-pa-lg">
    <div class="q-mx-auto" style="max-width: 1200px;">
      <!-- Hero -->
      <div class="column items-center text-center q-my-xl animate__animated animate__fadeIn">
        <div class="text-h3 text-white">Fintech System</div>
        <div class="text-subtitle1 text-grey-4 q-mt-sm" style="max-width: 760px;">
          Build, scale and manage payments with ease: merchant onboarding, secure checkout, transactions and analytics.
        </div>
        <div class="q-mt-lg row q-gutter-sm">
          <q-btn label="Get Started" @click="goToRegister" class="btn-gradient" />
          <q-btn outline label="Access Account" @click="goToLogin" class="btn-outline-light" />
        </div>
      </div>

      <!-- Feature Cards -->
      <div class="row q-col-gutter-md q-mb-xl">
        <div class="col-12 col-sm-6 col-md-3" v-for="card in cards" :key="card.title">
          <q-card class="q-pa-md glass-card elevated-hover animate__animated animate__zoomIn">
            <div class="row items-center">
              <q-icon :name="card.icon" size="md" class="q-mr-sm" />
              <div class="text-subtitle1 text-weight-medium">{{ card.title }}</div>
            </div>
            <div class="q-mt-sm text-grey-6">{{ card.desc }}</div>
          </q-card>
        </div>
      </div>

      <!-- Benefits -->
      <div id="benefits" class="q-mt-xl">
        <div class="text-h5 text-white q-mb-md text-center">Benefits & Advantages</div>
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

      <!-- Services -->
      <div id="services" class="q-mt-xl">
        <div class="text-h5 text-white q-mb-md text-center">Our Services</div>
        <ServicesCards />
      </div>

      <!-- Partners -->
      <div id="partners" class="q-mt-xl">
        <div class="text-h6 text-grey-5 q-mb-md text-center">Official Partners</div>
        <div class="row items-center justify-around q-gutter-md">
          <q-img src="https://upload.wikimedia.org/wikipedia/commons/5/57/Binance_Logo.png" style="height:28px; width: auto; filter: grayscale(100%); opacity: .9;"/>
          <q-img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" style="height:28px; width: auto; filter: grayscale(100%); opacity: .9;"/>
          <q-img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" style="height:28px; width: auto; filter: grayscale(100%); opacity: .9;"/>
          <q-img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Stripe_Logo%2C_revised_2016.svg" style="height:28px; width: auto; filter: grayscale(100%); opacity: .9;"/>
        </div>
      </div>

      <!-- Metrics -->
      <div class="q-mt-xl">
        <div class="row text-center glass-card q-pa-md animate__animated animate__fadeInUp">
          <div class="col">
            <div class="text-h5 text-white">120K+</div>
            <div class="text-caption text-grey-6">Users</div>
          </div>
          <div class="col">
            <div class="text-h5 text-white">48</div>
            <div class="text-caption text-grey-6">Countries</div>
          </div>
          <div class="col">
            <div class="text-h5 text-white">$2.3B</div>
            <div class="text-caption text-grey-6">Processed</div>
          </div>
          <div class="col">
            <div class="text-h5 text-white">99.98%</div>
            <div class="text-caption text-grey-6">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import ServicesCards from '../components/home/ServicesCards.vue'

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