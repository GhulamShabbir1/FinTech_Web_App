<template>
  <q-form @submit.prevent="submit" class="q-gutter-md">
    <q-stepper v-model="step" header-nav color="primary" animated>
      <q-step :name="1" title="Business Details" icon="store" :done="step > 1">
        <q-input v-model="form.business_name" label="Business Name" outlined dense required />
        <q-input v-model="form.email" label="Business Email" type="email" outlined dense required />
        <q-input v-model="form.website" label="Website" outlined dense />
      </q-step>

      <q-step :name="2" title="Branding" icon="image" :done="step > 2">
        <q-file v-model="logoFile" label="Upload Logo" outlined dense accept="image/*" @rejected="onReject" />
        <q-linear-progress v-if="uploadProgress > 0" stripe rounded size="10px" :value="uploadProgress / 100"
          color="green" class="q-mt-md" />
      </q-step>

      <q-step :name="3" title="Bank Details" icon="account_balance" :done="step > 3">
        <q-input v-model="form.bank_account_name" label="Account Holder Name" outlined dense />
        <q-input v-model="form.bank_account_number" label="Account Number" outlined dense />
        <q-input v-model="form.bank_ifsc_swift" label="IFSC / SWIFT" outlined dense />
        <q-select v-model="form.payout_preferences" :options="['daily', 'weekly', 'monthly']" label="Payout Preferences"
          multiple outlined dense />
      </q-step>

      <q-step :name="4" title="Security" icon="lock">
        <q-input v-model="form.password" type="password" label="Password" outlined dense required />
        <q-input v-model="form.password_confirmation" type="password" label="Confirm Password" outlined dense
          required />
      </q-step>

      <template #navigation>
        <q-stepper-navigation>
          <q-btn @click="next" :label="step < 4 ? 'Next' : 'Submit'" :loading="submitting" class="btn-gradient" />
          <q-btn v-if="step > 1" flat @click="prev" label="Back" class="q-ml-sm btn-outline-light" />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-form>
</template>

<script setup>
import { ref } from 'vue'
import { Notify } from 'quasar'
import { useMerchantStore } from '../../store/merchant'

const step = ref(1)
const submitting = ref(false)
const uploadProgress = ref(0)

const form = ref({
  business_name: '',
  email: '',
  website: '',
  bank_account_name: '',
  bank_account_number: '',
  bank_ifsc_swift: '',
  payout_preferences: [],
  password: '',
  password_confirmation: ''
})

const logoFile = ref(null)
const store = useMerchantStore()

const next = async () => {
  if (step.value < 4) {
    step.value += 1
  } else {
    await submit()
  }
}

const prev = () => { if (step.value > 1) step.value -= 1 }

const onReject = () => Notify.create({ type: 'warning', message: 'Only image files allowed' })

const submit = async () => {
  try {
    submitting.value = true
    const fd = new FormData()
    Object.entries(form.value).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach((val) => fd.append(`${k}[]`, val))
      } else if (v !== undefined && v !== null) {
        fd.append(k, v)
      }
    })
    if (logoFile.value) fd.append('logo', logoFile.value)

    await store.register(fd, (e) => {
      if (!e || !e.total) return
      uploadProgress.value = Math.round((e.loaded * 100) / e.total)
    })

    Notify.create({ type: 'positive', message: 'Registration submitted for approval' })
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Registration failed. Please try again.' })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped></style>
