<template>
  <Line :data="chartData" :options="options" />
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const props = defineProps({ data: { type: Array, default: () => [] } })
const labels = computed(() => props.data.map(d => d.date))
const values = computed(() => props.data.map(d => d.count))

const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    { label: 'Transactions', borderColor: '#26a69a', backgroundColor: 'rgba(38,166,154,0.2)', tension: 0.3, fill: true, data: values.value }
  ]
}))

const options = { responsive: true, maintainAspectRatio: false, height: 280 }
</script>

<style scoped>
</style>
