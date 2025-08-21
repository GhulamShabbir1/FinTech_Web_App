<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-md">
      <div class="text-h5 text-lime">Admin Dashboard</div>
    </div>

    <q-card class="q-pa-lg lime-glow q-mb-lg">
      <div>Manage merchants, transactions, and settings.</div>
    </q-card>

    <q-card class="q-pa-lg lime-glow">
      <div class="text-subtitle1 q-mb-md">Platform Stats</div>
      <StatsDashboard />
    </q-card>
  </q-page>
</template>

<script setup>
import StatsDashboard from '../components/stats/StatsDashboard.vue'
</script>

<style scoped>
.text-lime { color: #bdf000; }
.lime-glow {
  border-radius: 14px;
  box-shadow:
    0 10px 28px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(189, 240, 0, 0.28),
    0 0 24px rgba(189, 240, 0, 0.18);
}
</style>