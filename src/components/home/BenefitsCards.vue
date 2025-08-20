<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-sm-6 col-md-3" v-for="b in benefits" :key="b.title">
      <q-card class="q-pa-md">
        <q-icon :name="b.icon" size="md" color="primary" />
        <div class="text-subtitle2 q-mt-sm">{{ b.title }}</div>
        <div class="text-caption text-grey-7 q-mt-xs">{{ b.desc }}</div>
      </q-card>
    </div>
  </div>
</template>

<script setup>
const benefits = [
  { title: 'Secure', desc: 'JWT auth and interceptor-based error handling.', icon: 'shield' },
  { title: 'Fast', desc: 'Optimized UX and responsive components.', icon: 'bolt' },
  { title: 'Reliable', desc: 'Robust flows and retry-ready client.', icon: 'verified' },
  { title: 'Scalable', desc: 'Modular architecture, stats & filters.', icon: 'trending_up' }
]
</script>

<style scoped>
</style>
