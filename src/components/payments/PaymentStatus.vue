<template>
  <div class="column items-center q-pa-xl glass-card" style="border-radius:12px;">
    <q-icon :name="isSuccess ? 'check_circle' : 'cancel'" :color="isSuccess ? 'green' : 'red'" size="64px" />
    <div class="text-h6 q-mt-md">{{ isSuccess ? 'Payment Successful' : 'Payment Failed' }}</div>
    <q-btn class="q-mt-md" color="primary" label="Back to Merchant" @click="goBack" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isSuccess = computed(() => (route.query.status || '').toLowerCase() === 'success')
const goBack = () => window.close()
</script>

<style scoped>
</style>
