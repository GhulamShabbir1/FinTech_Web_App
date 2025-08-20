<template>
  <div class="row items-center">
    <q-avatar square size="42px" class="q-mr-sm">
      <img :src="branding.logo_url || 'https://via.placeholder.com/80x80'" />
    </q-avatar>
    <div>
      <div class="text-subtitle1">{{ branding.name || 'Merchant' }}</div>
      <div class="text-caption text-grey">{{ branding.subtitle || 'Secure Checkout' }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({ branding: { type: Object, default: () => ({}) } })
</script>

<style scoped>
</style>
