<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h6">Merchant Dashboard</div>
      <q-space />
      <q-chip :color="statusColor" text-color="white" icon="verified">
        {{ store.status }}
      </q-chip>
    </div>

    <q-card class="q-pa-md q-mb-lg glass-card elevated-hover">
      <div class="text-subtitle1 q-mb-md">Profile</div>
      <MerchantProfileForm />
    </q-card>

    <q-card class="q-pa-md glass-card elevated-hover">
      <div class="text-subtitle1 q-mb-sm">Quick Stats</div>
      <div class="row text-center">
        <div class="col">
          <div class="text-h6">—</div>
          <div class="text-caption">Total Revenue</div>
        </div>
        <div class="col">
          <div class="text-h6">—</div>
          <div class="text-caption">Transactions</div>
        </div>
        <div class="col">
          <div class="text-h6">—</div>
          <div class="text-caption">Success Rate</div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useMerchantStore } from '../store/merchant'
import MerchantProfileForm from '../components/merchants/MerchantProfileForm.vue'

const store = useMerchantStore()
onMounted(() => {
  if (!store.profile?.id) {
    // optionally fetch current merchant profile if available
  }
})

const statusColor = computed(() => {
  if ((store.status || '').toLowerCase() === 'verified') return 'green'
  if ((store.status || '').toLowerCase() === 'rejected') return 'red'
  return 'orange'
})
</script>

<style scoped>
</style>
