<template>
  <q-btn dense flat color="negative" label="Refund" @click="confirmRefund" :loading="loading" />
</template>

<script setup>
import { ref } from 'vue'
import { Dialog, Notify } from 'quasar'
import api from '../../boot/axios'

const props = defineProps({ transaction: { type: Object, required: true } })
const loading = ref(false)

const confirmRefund = () => {
  Dialog.create({
    title: 'Refund Payment',
    message: 'Are you sure you want to refund this transaction?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      loading.value = true
      await api.post(`/transactions/${props.transaction.id}/refund`)
      Notify.create({ type: 'positive', message: 'Refund initiated' })
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
</style>
