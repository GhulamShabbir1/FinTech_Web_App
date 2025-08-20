<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-sm-6 col-md-3" v-for="s in services" :key="s.title">
      <q-card class="q-pa-md service-card">
        <div class="row items-center">
          <q-icon :name="s.icon" size="md" class="q-mr-sm text-lime" />
          <div class="text-subtitle2 text-darkest">{{ s.title }}</div>
        </div>
        <div class="text-caption text-grey-7 q-mt-xs">{{ s.desc }}</div>
      </q-card>
    </div>
  </div>
</template>

<script setup>
const services = [
  { title: 'Onboarding', desc: 'KYC and merchant verification.', icon: 'store' },
  { title: 'Checkout', desc: 'Hosted page and SDK.', icon: 'credit_card' },
  { title: 'Transactions', desc: 'Search, refund and export.', icon: 'receipt_long' },
  { title: 'Analytics', desc: 'Charts and reports.', icon: 'insights' }
]
</script>

<style scoped>
</style>
