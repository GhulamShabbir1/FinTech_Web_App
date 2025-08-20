<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="q-pa-lg shadow-2 rounded-borders glass-card elevated-hover" style="width:800px; max-width:95%;">
      <q-card-section>
        <div class="text-h6 text-center">Merchant Registration</div>
      </q-card-section>

      <MerchantSignupForm />

      <q-card-actions align="center">
        <q-btn
          flat
          label="Already have an account? Login"
          @click="$router.push('/login')"
        />
      </q-card-actions>
    </q-card>
  </q-page>
  
</template>

<script setup>
import MerchantSignupForm from '../components/merchants/MerchantSignupForm.vue'
</script>
