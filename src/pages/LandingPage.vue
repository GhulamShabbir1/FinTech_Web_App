<template>
  <q-page class="q-pa-lg">
    <div class="q-mx-auto" style="max-width: 1200px;">
      <!-- Hero -->
      <div class="column items-center text-center q-my-xl animate__animated animate__fadeIn">
        <div class="text-h2 text-lime" style="font-weight:800; letter-spacing:.2px;">Fintech System</div>
        <div class="text-subtitle1 text-grey-4 q-mt-sm" style="max-width: 760px; font-size:18px;">
          Build, scale and manage payments with ease: merchant onboarding, secure checkout, transactions and analytics.
        </div>
        <div class="q-mt-lg row q-gutter-sm">
          <q-btn label="Get Started" @click="goToRegister" class="btn-gradient" size="lg" />
          <q-btn outline label="Access Account" @click="goToLogin" class="btn-outline-light" size="lg" />
        </div>
      </div>

      <!-- Feature Cards -->
      <div class="row q-col-gutter-md q-mb-xl">
        <div class="col-12 col-sm-6 col-md-3" v-for="card in cards" :key="card.title">
          <q-card class="q-pa-lg service-card tall-card card-with-margins elevated-hover animate__animated animate__zoomIn">
            <div class="row items-center">
              <q-icon :name="card.icon" size="lg" class="q-mr-sm text-lime" />
              <div class="text-subtitle1 text-weight-medium" style="color:#fff;">{{ card.title }}</div>
            </div>
            <div class="q-mt-sm" style="color: rgba(255,255,255,0.75);">{{ card.descLong || card.desc }}</div>
          </q-card>
        </div>
      </div>

      <!-- Benefits -->
      <div id="benefits" class="q-mt-xl">
        <div class="text-h4 text-lime q-mb-md text-center" style="font-weight:700;">Benefits & Advantages</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-3" v-for="b in benefits" :key="b.title">
            <q-card class="q-pa-lg card-dark tall-card card-with-margins hover-raise animate__animated animate__fadeInUp">
              <q-icon :name="b.icon" class="text-lime" size="lg" />
              <div class="text-subtitle2 q-mt-sm" style="color:#fff;">{{ b.title }}</div>
              <div class="text-caption q-mt-xs" style="color: rgba(255,255,255,0.75);">{{ b.descLong || b.desc }}</div>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Services -->
      <div id="services" class="q-mt-xl">
        <div class="text-h4 text-lime q-mb-md text-center" style="font-weight:700;">Our Services</div>
        <ServicesCards />
      </div>

      <!-- Partners -->
      <div id="partners" class="q-mt-xl">
        <div class="text-h5 text-lime q-mb-md text-center" style="font-weight:700;">Official Partners</div>
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
  { title: 'Merchant Onboarding', desc: 'KYC, approval flow and profile management.', descLong: 'Streamlined multi-step onboarding with branding, documents, and bank details captured securely. Admin approval workflow included.', icon: 'store' },
  { title: 'Secure Checkout', desc: 'Hosted checkout with cards and wallets.', descLong: 'Hosted checkout with PCI-aware flows, card and alternative methods, and real-time status updates via webhooks.', icon: 'credit_card' },
  { title: 'Transactions', desc: 'Filterable history, refunds and CSV export.', descLong: 'Complete transaction history with advanced filtering, sorting, refund initiation, and export to CSV for accounting.', icon: 'receipt_long' },
  { title: 'Analytics', desc: 'Revenue trends and method distribution.', descLong: 'Rich dashboards with revenue trends, method split, success rates, and performance across geographies and customers.', icon: 'insights' }
]

const benefits = [
  { title: 'Fast Integration', desc: 'Drop-in components and clear APIs.', descLong: 'Developer-friendly SDKs and examples reduce time-to-first-payment. Configure branding and methods in minutes.', icon: 'bolt' },
  { title: 'Reliable', desc: 'Robust infra with retries and alerts.', descLong: 'Resilient processing with retries, observability, and alerting ensures payments keep flowing.', icon: 'verified' },
  { title: 'Secure', desc: 'PCI-aware flows and JWT auth.', descLong: 'Modern security across the stack: tokenized cards, HTTPS, JWT-based auth and scoped API keys.', icon: 'shield' },
  { title: 'Scalable', desc: 'Optimized queries and caching.', descLong: 'Efficient storage and indexed queries power dashboards and exports at any scale.', icon: 'trending_up' }
]
</script>

<style scoped>
.hover-raise:hover { transform: translateY(-4px); transition: transform .2s ease; }
</style>