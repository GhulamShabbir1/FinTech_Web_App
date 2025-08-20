<template>
  <q-table
    :rows="rows"
    :columns="columns"
    row-key="id"
    flat
    bordered
    :loading="loading"
    :filter="filter"
  >
    <template #top>
      <div class="row items-center q-col-gutter-sm full-width">
        <div class="col-12 col-md-3">
          <q-input v-model="filter" dense outlined placeholder="Search..." clearable />
        </div>
        <div class="col-12 col-md-3">
          <q-select v-model="status" :options="statusOptions" dense outlined label="Status" />
        </div>
        <div class="col-12 col-md-6">
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input v-model="from" type="date" dense outlined label="From" />
            </div>
            <div class="col-6">
              <q-input v-model="to" type="date" dense outlined label="To" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #body-cell-actions="props">
      <q-td :props="props">
        <q-btn dense flat icon="visibility" @click="$emit('view', props.row)" />
        <RefundButton :transaction="props.row" class="q-ml-xs" />
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import api from '../../boot/axios'
import RefundButton from './RefundButton.vue'

const rows = ref([])
const loading = ref(false)
const filter = ref('')
const status = ref('')
const from = ref('')
const to = ref('')

const statusOptions = ['', 'pending', 'success', 'failed', 'refunded']
const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'customer', label: 'Customer', field: 'customer', align: 'left' },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'right', sortable: true },
  { name: 'method', label: 'Method', field: 'method', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'createdAt', label: 'Date', field: 'createdAt', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
]

watchEffect(async () => {
  loading.value = true
  try {
    const { data } = await api.get('/transactions', { params: { q: filter.value, status: status.value, from: from.value, to: to.value } })
    rows.value = data
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
</style>
