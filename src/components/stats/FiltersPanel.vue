<template>
  <div class="row q-col-gutter-sm items-end">
    <div class="col-12 col-sm-4">
      <q-input v-model="local.startDate" type="date" label="Start Date" dense outlined />
    </div>
    <div class="col-12 col-sm-4">
      <q-input v-model="local.endDate" type="date" label="End Date" dense outlined />
    </div>
    <div class="col-12 col-sm-4">
      <q-input v-model="local.merchantId" label="Merchant ID (optional)" dense outlined />
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({ startDate: '', endDate: '', merchantId: '' }) }
})
const emit = defineEmits(['update:modelValue'])

const local = reactive({ ...props.modelValue })

watch(local, () => emit('update:modelValue', { ...local }), { deep: true })
</script>

<style scoped>
</style>
