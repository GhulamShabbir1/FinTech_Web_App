<template>
  <Pie :data="chartData" :options="options" />
</template>

<script setup>
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({ data: { type: Array, default: () => [] } })

const labels = computed(() => props.data.map(d => d.method))
const values = computed(() => props.data.map(d => d.count))
const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    { label: 'Methods', backgroundColor: ['#42a5f5','#66bb6a','#ffca28','#ec407a'], data: values.value }
  ]
}))

const options = { responsive: true, maintainAspectRatio: false, height: 260 }
</script>

<style scoped>
</style>
