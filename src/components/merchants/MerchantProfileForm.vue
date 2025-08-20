<template>
  <q-form @submit.prevent="save" class="q-gutter-md">
    <q-input v-model="profile.business_name" label="Business Name" outlined dense />
    <q-input v-model="profile.email" label="Email" outlined dense />
    <q-input v-model="profile.website" label="Website" outlined dense />
    <q-input v-model="profile.bank_account_name" label="Account Holder Name" outlined dense />
    <q-input v-model="profile.bank_account_number" label="Account Number" outlined dense />
    <q-input v-model="profile.bank_ifsc_swift" label="IFSC / SWIFT" outlined dense />
    <q-select v-model="profile.payout_preferences" :options="['daily','weekly','monthly']" label="Payout Preferences" multiple outlined dense />
    <div class="row items-center q-col-gutter-sm">
      <div class="col-auto">
        <q-avatar size="56px" square>
          <img :src="profile.logo_url || 'https://via.placeholder.com/80x80'">
        </q-avatar>
      </div>
      <div class="col">
        <q-file v-model="logo" dense outlined label="Replace Logo" accept="image/*" />
      </div>
    </div>
    <q-btn type="submit" color="primary" label="Save Changes" :loading="saving" />
  </q-form>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { Notify } from 'quasar'
import { useMerchantStore } from '../../store/merchant'

const store = useMerchantStore()
const profile = ref({})
const logo = ref(null)
const saving = ref(false)

watchEffect(() => { if (store.profile) profile.value = { ...store.profile } })

const save = async () => {
  try {
    saving.value = true
    const payload = { ...profile.value }
    if (logo.value) {
      const fd = new FormData()
      Object.entries(payload).forEach(([k, v]) => fd.append(k, v))
      fd.append('logo', logo.value)
      await store.update(payload.id, fd)
    } else {
      await store.update(payload.id, payload)
    }
    Notify.create({ type: 'positive', message: 'Profile updated' })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
</style>
