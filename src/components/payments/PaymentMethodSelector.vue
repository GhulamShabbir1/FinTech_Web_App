<template>
  <q-option-group
    v-model="modelValueLocal"
    :options="options"
    color="primary"
    inline
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ modelValue: { type: String, default: 'card' } })
const emit = defineEmits(['update:modelValue'])

const options = [
  { label: 'Card', value: 'card' },
  { label: 'Wallet', value: 'wallet' },
  { label: 'Bank Transfer', value: 'bank' }
]

const modelValueLocal = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style scoped>
</style>
