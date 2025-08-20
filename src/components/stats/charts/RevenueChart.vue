<template>
  <Bar :data="chartData" :options="options" />
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({ data: { type: Array, default: () => [] } })

const labels = computed(() => props.data.map(d => d.date))
const values = computed(() => props.data.map(d => d.amount))
const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    { label: 'Revenue', backgroundColor: '#3f51b5', data: values.value }
  ]
}))

const options = { responsive: true, maintainAspectRatio: false, height: 300 }
</script>

<style scoped>
</style>
