<template>
  <div class="q-gutter-lg">
    <!-- Header and status -->
    <div class="row items-center">
      <div class="text-h6 text-lime">Merchant Dashboard</div>
      <q-space />
      <q-chip :color="statusColor" text-color="white" icon="verified">
        {{ store.status }}
      </q-chip>
    </div>

    <!-- Profile + Status Card -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-7">
        <q-card class="q-pa-md lime-glow">
          <div class="text-subtitle1 q-mb-md">Profile Overview</div>
          <div class="row items-center q-col-gutter-md">
            <div class="col-auto">
              <q-avatar size="64px" square>
                <img :src="store.profile?.logo_url || placeholderLogo" />
              </q-avatar>
            </div>
            <div class="col">
              <div class="text-body1 text-weight-medium">{{ store.profile?.business_name || '—' }}</div>
              <div class="text-caption">{{ store.profile?.email || '—' }}</div>
              <div class="text-caption">{{ store.profile?.website || '—' }}</div>
            </div>
          </div>
          <div class="q-mt-md">
            <q-btn label="Edit Profile" flat class="btn-outline-light" @click="editing = !editing" />
          </div>
          <div v-if="editing" class="q-mt-md">
            <MerchantProfileForm />
          </div>
        </q-card>
      </div>
      <div class="col-12 col-md-5">
        <q-card class="q-pa-md lime-glow">
          <div class="text-subtitle1 q-mb-sm">Status</div>
          <div class="row items-center q-col-gutter-md">
            <div class="col-auto">
              <q-icon :name="statusIcon" :color="statusColor" size="md" />
            </div>
            <div class="col">
              <div class="text-body1">{{ store.status }}</div>
              <div class="text-caption">Current onboarding state</div>
            </div>
          </div>
          <div class="q-mt-md">
            <q-linear-progress :value="progressValue" color="green" rounded size="10px" stripe />
            <div class="text-caption q-mt-xs">Onboarding progress</div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Stats -->
    <q-card class="q-pa-md lime-glow">
      <div class="row items-center q-mb-md">
        <div class="text-subtitle1">Performance</div>
        <q-space />
        <FiltersPanel v-model="filters" />
      </div>
      <StatsDashboard :filters="filters" />
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMerchantStore } from '../../store/merchant'
import { pinia } from '../../store/pinia'
import MerchantProfileForm from './MerchantProfileForm.vue'
import StatsDashboard from '../stats/StatsDashboard.vue'
import FiltersPanel from '../stats/FiltersPanel.vue'

const store = useMerchantStore(pinia)
const editing = ref(false)
const placeholderLogo = 'https://placehold.co/80x80/121018/bdf000?text=FX'

onMounted(async () => {
  if (!store.profile?.id) {
    // optionally fetch current profile here if endpoint available
  }
})

const statusColor = computed(() => {
  const s = (store.status || '').toLowerCase()
  if (s === 'verified') return 'green'
  if (s === 'rejected') return 'red'
  return 'orange'
})
const statusIcon = computed(() => {
  const s = (store.status || '').toLowerCase()
  if (s === 'verified') return 'verified'
  if (s === 'rejected') return 'cancel'
  return 'hourglass_empty'
})

// Simple progress heuristic: 25% per filled section
const progressValue = computed(() => {
  const p = store.profile || {}
  let c = 0
  if (p.business_name && p.email) c += 1
  if (p.logo_url) c += 1
  if (p.bank_account_number && p.bank_ifsc_swift) c += 1
  if (Array.isArray(p.payout_preferences) && p.payout_preferences.length) c += 1
  return c / 4
})

const filters = ref({ startDate: null, endDate: null, merchantId: null })
</script>

<style scoped>
.text-lime { color: #bdf000; }
.lime-glow {
  border-radius: 14px;
  box-shadow:
    0 10px 28px rgba(0,0,0,0.35),
    0 0 0 1px rgba(189,240,0,0.28),
    0 0 24px rgba(189,240,0,0.18);
}
.btn-outline-light { border: 1px solid #fff; color: #fff; }
</style>