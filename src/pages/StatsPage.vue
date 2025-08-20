<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="col-grow">
        <div class="text-h6">Analytics</div>
      </div>
    </div>
    <q-card class="q-pa-md q-mb-md">
      <FiltersPanel v-model="filters" />
    </q-card>
    <StatsDashboard :filters="filters" />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import StatsDashboard from '../components/stats/StatsDashboard.vue'
import FiltersPanel from '../components/stats/FiltersPanel.vue'

const filters = ref({ startDate: '', endDate: '', merchantId: '' })
</script>

<style scoped>
</style>
