<template>
  <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
    <q-stepper v-model="step" header-nav color="primary" animated flat>
      <!-- Step 1: Account Setup -->
      <q-step :name="1" title="Account" icon="person" :done="step > 1">
        <div class="q-gutter-md">
          <q-input v-model="account.name" label="Full Name" filled dense required />
          <q-input v-model="account.email" label="Email" type="email" filled dense required />
          <q-input v-model="account.password" label="Password" type="password" filled dense required />
          <q-input v-model="account.confirmPassword" label="Confirm Password" type="password" filled dense required />
          <q-select v-model="account.role" :options="roleOptions" label="Role" filled dense required />
        </div>
      </q-step>

      <!-- Step 2: Merchant Details (only if merchant) -->
      <q-step v-if="isMerchant" :name="2" title="Merchant Details" icon="store" :done="step > 2">
        <div class="q-gutter-md">
          <q-input v-model="merchant.business_name" label="Business Name" filled dense required />
          <q-input v-model="merchant.website" label="Website" filled dense />
          <q-file v-model="logoFile" label="Upload Logo" filled dense accept="image/*" @rejected="onReject">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
          <q-linear-progress v-if="uploadProgress > 0" stripe rounded size="10px" :value="uploadProgress / 100" color="green" class="q-mt-md" />
          <div v-if="logoPreview" class="text-center q-mt-md">
            <q-img :src="logoPreview" style="max-width: 120px; max-height: 120px;" />
          </div>
        </div>
      </q-step>

      <!-- Step 3: Bank Details (only if merchant) -->
      <q-step v-if="isMerchant" :name="3" title="Bank Details" icon="account_balance" :done="step > 3">
        <div class="q-gutter-md">
          <q-input v-model="merchant.bank_account_name" label="Account Holder Name" filled dense />
          <q-input v-model="merchant.bank_account_number" label="Account Number" filled dense />
          <q-input v-model="merchant.bank_ifsc_swift" label="IFSC / SWIFT" filled dense />
          <q-select v-model="merchant.payout_preferences" :options="payoutOptions" label="Payout Preferences" multiple filled dense />
        </div>
      </q-step>

      <!-- Step 4: Review (only if merchant) -->
      <q-step v-if="isMerchant" :name="4" title="Review" icon="check_circle">
        <div class="q-gutter-md">
          <q-card class="q-pa-md bg-grey-1">
            <div class="text-subtitle1 q-mb-md">Account Details</div>
            <div><strong>Name:</strong> {{ account.name }}</div>
            <div><strong>Email:</strong> {{ account.email }}</div>
            <div><strong>Role:</strong> {{ account.role }}</div>
          </q-card>
          <q-card class="q-pa-md bg-grey-1">
            <div class="text-subtitle1 q-mb-md">Business Details</div>
            <div><strong>Business Name:</strong> {{ merchant.business_name }}</div>
            <div><strong>Website:</strong> {{ merchant.website || 'Not provided' }}</div>
            <div><strong>Bank Account:</strong> {{ merchant.bank_account_name || 'Not provided' }}</div>
          </q-card>
          <div class="text-caption text-grey">
            Your account will be reviewed and approved within 24-48 hours.
          </div>
        </div>
      </q-step>

      <template #navigation>
        <q-stepper-navigation>
          <q-btn :label="primaryCta" class="btn-gradient" :loading="submitting" @click="handleSubmit" />
          <q-btn v-if="step > 1" flat class="q-ml-sm btn-outline-light" label="Back" @click="prev" />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Notify } from 'quasar'
import api from '../../boot/axios'
import { useMerchantStore } from '../../store/merchant'
import { pinia } from '../../store/pinia'

const store = useMerchantStore(pinia)
const step = ref(1)
const submitting = ref(false)
const uploadProgress = ref(0)
const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Merchant', value: 'merchant' }
]
const payoutOptions = ['daily', 'weekly', 'monthly']

const account = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'merchant'
})

const merchant = ref({
  business_name: '',
  website: '',
  bank_account_name: '',
  bank_account_number: '',
  bank_ifsc_swift: '',
  payout_preferences: []
})

const logoFile = ref(null)
const logoPreview = ref('')

const isMerchant = computed(() => (account.value.role || '').toLowerCase() === 'merchant')

const primaryCta = computed(() => {
  if (step.value === 1) return 'Next'
  if (step.value === 4) return 'Submit Registration'
  return 'Next'
})

// Watch for role changes to reset step if needed
watch(() => account.value.role, (newRole) => {
  if (newRole === 'admin' && step.value > 1) {
    step.value = 1
  }
})

// Watch for logo file changes
watch(logoFile, (file) => {
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      logoPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    logoPreview.value = ''
  }
})

const next = () => {
  if (step.value < (isMerchant.value ? 4 : 1)) {
    step.value += 1
  }
}

const prev = () => {
  if (step.value > 1) {
    step.value -= 1
  }
}

const onReject = () => {
  Notify.create({ type: 'warning', message: 'Only image files allowed' })
}

const validateForm = () => {
  if (!account.value.name || !account.value.email || !account.value.password) {
    Notify.create({ type: 'negative', message: 'Please fill in all required fields' })
    return false
  }
  
  if (account.value.password !== account.value.confirmPassword) {
    Notify.create({ type: 'negative', message: 'Passwords do not match' })
    return false
  }
  
  if (isMerchant.value && !merchant.value.business_name) {
    Notify.create({ type: 'negative', message: 'Business name is required for merchants' })
    return false
  }
  
  return true
}

const handleSubmit = async () => {
  if (step.value < (isMerchant.value ? 4 : 1)) {
    next()
    return
  }
  
  if (!validateForm()) return
  
  try {
    submitting.value = true
    
    if (account.value.role === 'admin') {
      // Simple admin registration
      await api.post('/auth/register', {
        name: account.value.name,
        email: account.value.email,
        password: account.value.password,
        role: 'admin'
      })
      Notify.create({ type: 'positive', message: 'Admin account created successfully!' })
    } else {
      // Merchant registration with additional details
      const formData = new FormData()
      formData.append('name', account.value.name)
      formData.append('email', account.value.email)
      formData.append('password', account.value.password)
      formData.append('role', 'merchant')
      
      // Add merchant-specific fields
      Object.entries(merchant.value).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(val => formData.append(`${key}[]`, val))
        } else if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value)
        }
      })
      
      if (logoFile.value) {
        formData.append('logo', logoFile.value)
      }
      
      await store.register(formData, (e) => {
        if (!e || !e.total) return
        uploadProgress.value = Math.round((e.loaded * 100) / e.total)
      })
      
      Notify.create({ type: 'positive', message: 'Merchant registration submitted for approval' })
    }
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Registration failed. Please try again.' })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.btn-gradient {
  background: linear-gradient(135deg, #bdf000, #ffffff);
  color: #09050d;
  font-weight: 700;
  border: 1px solid rgba(189, 240, 0, 0.5);
}

.btn-outline-light {
  border: 1px solid #fff;
  color: #fff;
}
</style>