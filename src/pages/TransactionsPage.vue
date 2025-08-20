<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h6">Transactions</div>
      <q-space />
      <q-btn outline label="Export CSV" @click="exportCsv" class="btn-outline-light" />
    </div>
    <TransactionTable @view="open" />
    <TransactionDetailModal v-model="show" :tx="selected" />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import TransactionTable from '../components/transactions/TransactionTable.vue'
import TransactionDetailModal from '../components/transactions/TransactionDetailModal.vue'
import api from '../boot/axios'

const show = ref(false)
const selected = ref(null)
const open = (tx) => { selected.value = tx; show.value = true }

const exportCsv = async () => {
  const { data } = await api.get('/transactions', { params: { format: 'csv' }, responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([data], { type: 'text/csv' }))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'transactions.csv')
  document.body.appendChild(link)
  link.click()
  link.remove()
}
</script>

<style scoped>
</style>
