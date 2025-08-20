<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-8">
      <RevenueChart :data="revenue" />
    </div>
    <div class="col-12 col-md-4">
      <MethodsDistributionCharts :data="methods" />
    </div>
    <div class="col-12">
      <TransactionTrendsChart :data="trends" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, toRefs } from 'vue'
import api from '../../boot/axios'
import RevenueChart from './charts/RevenueChart.vue'
import MethodsDistributionCharts from './charts/MethodsDistributionCharts.vue'
import TransactionTrendsChart from './charts/TransactionTrendsChart.vue'

const revenue = ref([])
const methods = ref([])
const trends = ref([])

const props = defineProps({ filters: { type: Object, default: () => ({}) } })
const { filters } = toRefs(props)

const fetchAll = async () => {
  const params = { startDate: filters.value.startDate, endDate: filters.value.endDate, merchantId: filters.value.merchantId }
  const [r, m, t] = await Promise.all([
    api.get('/stats/revenue', { params }),
    api.get('/stats/methods', { params }),
    api.get('/stats/transactions', { params })
  ])
  revenue.value = r.data
  methods.value = m.data
  trends.value = t.data
}

watch(filters, fetchAll, { deep: true, immediate: true })
</script>

<style scoped>
</style>
