<template>
  <q-page class="q-pa-md">
    <div class="q-mx-auto" style="max-width: 500px;">
      <q-card class="glass-card elevated-hover">
        <q-card-section>
          <div class="text-h6">Checkout</div>
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
import CheckoutForm from '../components/payments/CheckoutForm.vue'
</script>

<style scoped>
</style>
