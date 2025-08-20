<template>
  <q-dialog v-model="modelValueLocal">
    <q-card class="glass-card" style="max-width:600px; width: 95vw;">
      <q-card-section class="text-h6">Transaction Details</q-card-section>
      <q-separator />
      <q-card-section>
        <div class="q-gutter-sm">
          <div><b>ID:</b> {{ tx?.id }}</div>
          <div><b>Customer:</b> {{ tx?.customer }}</div>
          <div><b>Amount:</b> {{ tx?.amount }}</div>
          <div><b>Method:</b> {{ tx?.method }}</div>
          <div><b>Status:</b> {{ tx?.status }}</div>
          <div><b>Created:</b> {{ tx?.createdAt }}</div>
          <div><b>Metadata:</b> <pre>{{ tx?.metadata }}</pre></div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Close" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  tx: { type: Object, default: null }
})
const emit = defineEmits(['update:modelValue'])

const modelValueLocal = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style scoped>
pre { white-space: pre-wrap; word-break: break-word; }
</style>
