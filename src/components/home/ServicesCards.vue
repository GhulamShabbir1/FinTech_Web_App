<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-sm-6 col-md-3" v-for="s in services" :key="s.title">
      <q-card class="q-pa-lg service-card tall-card card-with-margins">
        <div class="row items-center">
          <q-icon :name="s.icon" size="md" class="q-mr-sm text-lime" />
          <div class="text-subtitle2 text-darkest">{{ s.title }}</div>
        </div>
        <div class="text-caption q-mt-xs" style="color: rgba(255,255,255,0.75);">{{ s.descLong || s.desc }}</div>
      </q-card>
    </div>
  </div>
</template>

<script setup>
const services = [
  { title: 'Onboarding', desc: 'KYC and merchant verification.', descLong: 'Flexible wizard with file uploads, logo, banking and payout preferences. Admin approval workflow ready.', icon: 'store' },
  { title: 'Checkout', desc: 'Hosted page and SDK.', descLong: 'Brandable hosted checkout with secure inputs and multiple payment methods. Webhook-driven status.', icon: 'credit_card' },
  { title: 'Transactions', desc: 'Search, refund and export.', descLong: 'Filter by date, status, customer and method. Trigger refunds and export CSV for reconciliation.', icon: 'receipt_long' },
  { title: 'Analytics', desc: 'Charts and reports.', descLong: 'Trends by day/week/month, method distribution, success vs failure, geographies and more.', icon: 'insights' }
]
</script>

<style scoped>
</style>
