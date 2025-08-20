<template>
  <q-page class="q-pa-md">
    <div class="q-mx-auto" style="max-width: 520px;">
      <q-card class="glass-card elevated-hover">
        <q-card-section class="row items-center">
          <q-avatar square size="42px" class="q-mr-sm">
            <img :src="branding.logo_url || 'https://via.placeholder.com/80x80'" />
          </q-avatar>
          <div>
            <div class="text-subtitle1">{{ branding.name || 'Merchant' }}</div>
            <div class="text-caption text-grey">Secure Checkout</div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <CheckoutForm />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../boot/axios'
import CheckoutForm from '../components/payments/CheckoutForm.vue'

const route = useRoute()
const branding = ref({})

onMounted(async () => {
  const id = route.params.merchantId
  const { data } = await api.get(`/checkout/${id}`)
  branding.value = data
})
</script>

<style scoped>
</style>
