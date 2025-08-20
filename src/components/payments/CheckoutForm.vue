<template>
  <q-form @submit.prevent="submit" class="q-gutter-md">
    <q-input v-model="card.name" label="Name on Card" outlined dense required />
    <q-input v-model="card.number" label="Card Number" mask="#### #### #### ####" outlined dense required />
    <div class="row q-col-gutter-sm">
      <div class="col-6">
        <q-input v-model="card.exp" label="MM/YY" mask="##/##" outlined dense required />
      </div>
      <div class="col-6">
        <q-input v-model="card.cvc" label="CVC" mask="###" outlined dense required />
      </div>
    </div>
    <PaymentMethodSelector v-model="method" />
    <q-btn type="submit" label="Pay" :loading="loading" class="btn-gradient" />
  </q-form>
</template>

<script setup>
import { ref } from 'vue'
import PaymentMethodSelector from './PaymentMethodSelector.vue'
import api from '../../boot/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const method = ref('card')
const card = ref({ name: '', number: '', exp: '', cvc: '' })

const submit = async () => {
  try {
    loading.value = true
    const response = await api.post('/payments/checkout', { method: method.value, card: card.value })
    const { paymentId, status } = response.data
    router.push(`/payments/status/${paymentId}?status=${status}`)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
</style>
