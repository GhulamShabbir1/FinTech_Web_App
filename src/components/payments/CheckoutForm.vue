<template>
  <div class="checkout-container">
    <q-card class="payment-card lime-glow">
      <!-- Header -->
      <q-card-section class="payment-header">
        <div class="row items-center q-col-gutter-md">
          <div class="col-auto">
            <q-avatar size="48px" class="merchant-avatar">
              <img :src="merchantInfo.logo || placeholderLogo" />
            </q-avatar>
          </div>
          <div class="col">
            <div class="text-h6 text-lime">{{ merchantInfo.business_name || 'FinteckX Store' }}</div>
            <div class="text-caption text-grey-5">Secure Payment Portal</div>
          </div>
          <div class="col-auto">
            <q-chip color="green" text-color="white" icon="security" size="sm">
              SSL Secured
            </q-chip>
          </div>
        </div>
      </q-card-section>

      <!-- Payment Amount -->
      <q-card-section class="payment-amount">
        <div class="text-center">
          <div class="amount-display">
            <span class="currency">{{ currency }}</span>
            <span class="amount">{{ formatAmount(amount) }}</span>
          </div>
          <div class="text-caption text-grey-6" v-if="description">{{ description }}</div>
        </div>
      </q-card-section>

      <!-- Payment Methods Tabs -->
      <q-card-section class="payment-methods">
        <q-tabs v-model="selectedMethod" class="payment-tabs" indicator-color="lime" align="justify">
          <q-tab name="card" icon="credit_card" label="Card" class="payment-tab" />
          <q-tab name="wallet" icon="account_balance_wallet" label="Wallet" class="payment-tab" />
          <q-tab name="bank" icon="account_balance" label="Bank" class="payment-tab" />
        </q-tabs>

        <q-separator class="q-my-md" />

        <!-- Card Payment Form -->
        <q-tab-panels v-model="selectedMethod" animated>
          <q-tab-panel name="card" class="q-pa-none">
            <q-form @submit.prevent="processPayment" class="card-form">
              <!-- Card Number -->
              <div class="form-group">
                <label class="field-label">Card Number</label>
                <div class="card-input-container">
                  <q-input
                    v-model="cardForm.number"
                    mask="#### #### #### ####"
                    placeholder="1234 5678 9012 3456"
                    outlined
                    dense
                    class="card-input"
                    :error="errors.number"
                    :error-message="errors.number"
                    @input="validateCardNumber"
                  >
                    <template v-slot:append>
                      <q-icon :name="cardBrandIcon" :color="cardBrandColor" size="sm" />
                    </template>
                  </q-input>
                </div>
              </div>

              <!-- Card Holder Name -->
              <div class="form-group">
                <label class="field-label">Cardholder Name</label>
                <q-input
                  v-model="cardForm.name"
                  placeholder="John Doe"
                  outlined
                  dense
                  class="card-input"
                  :error="errors.name"
                  :error-message="errors.name"
                  @input="validateCardName"
                />
              </div>

              <!-- Expiry and CVC -->
              <div class="row q-col-gutter-md">
                <div class="col-6">
                  <div class="form-group">
                    <label class="field-label">Expiry Date</label>
                    <q-input
                      v-model="cardForm.expiry"
                      mask="##/##"
                      placeholder="MM/YY"
                      outlined
                      dense
                      class="card-input"
                      :error="errors.expiry"
                      :error-message="errors.expiry"
                      @input="validateExpiry"
                    />
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-group">
                    <label class="field-label">CVC</label>
                    <q-input
                      v-model="cardForm.cvc"
                      mask="####"
                      placeholder="123"
                      outlined
                      dense
                      class="card-input"
                      :error="errors.cvc"
                      :error-message="errors.cvc"
                      @input="validateCVC"
                    >
                      <template v-slot:append>
                        <q-icon name="help_outline" color="grey-6" size="xs">
                          <q-tooltip>3-4 digit security code on back of card</q-tooltip>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <!-- Save Card Option -->
              <div class="form-group">
                <q-checkbox v-model="saveCard" label="Save card for future payments" color="lime" />
              </div>
            </q-form>
          </q-tab-panel>

          <!-- Digital Wallet Panel -->
          <q-tab-panel name="wallet" class="q-pa-none">
            <div class="wallet-options">
              <div class="wallet-grid">
                <q-btn
                  v-for="wallet in walletMethods"
                  :key="wallet.id"
                  :class="['wallet-btn', { active: selectedWallet === wallet.id }]"
                  @click="selectWallet(wallet.id)"
                  flat
                >
                  <div class="wallet-content">
                    <q-icon :name="wallet.icon" size="md" :color="wallet.color" />
                    <div class="wallet-name">{{ wallet.name }}</div>
                  </div>
                </q-btn>
              </div>
              <div v-if="selectedWallet" class="wallet-info q-mt-md">
                <q-card class="bg-grey-1 q-pa-md">
                  <div class="text-body2">You will be redirected to {{ getWalletName(selectedWallet) }} to complete your payment.</div>
                </q-card>
              </div>
            </div>
          </q-tab-panel>

          <!-- Bank Transfer Panel -->
          <q-tab-panel name="bank" class="q-pa-none">
            <div class="bank-transfer-form">
              <q-select
                v-model="selectedBank"
                :options="bankOptions"
                label="Select Your Bank"
                outlined
                dense
                emit-value
                map-options
                class="q-mb-md"
              />
              <q-card class="bg-grey-1 q-pa-md">
                <div class="text-body2 q-mb-sm">Bank Transfer Details:</div>
                <div class="text-caption">• You will be redirected to your bank's secure portal</div>
                <div class="text-caption">• Payment will be processed instantly</div>
                <div class="text-caption">• No additional fees apply</div>
              </q-card>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <!-- Payment Summary -->
      <q-card-section class="payment-summary bg-grey-1">
        <div class="row items-center justify-between">
          <div class="col">
            <div class="text-body2">Total Amount</div>
            <div class="text-h6 text-lime">{{ currency }}{{ formatAmount(amount) }}</div>
          </div>
          <div class="col-auto">
            <div class="security-badges">
              <q-chip color="green" text-color="white" size="sm" icon="verified_user">
                PCI DSS
              </q-chip>
              <q-chip color="blue" text-color="white" size="sm" icon="lock">
                256-bit SSL
              </q-chip>
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- Action Buttons -->
      <q-card-actions class="payment-actions q-pa-md">
        <q-btn
          @click="processPayment"
          :loading="processing"
          :disable="!isFormValid"
          class="pay-button full-width"
          size="lg"
          no-caps
        >
          <q-icon name="lock" class="q-mr-sm" />
          Pay {{ currency }}{{ formatAmount(amount) }}
        </q-btn>
        
        <div class="powered-by q-mt-sm text-center">
          <div class="text-caption text-grey-6">
            Powered by <span class="text-lime text-weight-bold">FinteckX</span>
          </div>
        </div>
      </q-card-actions>
    </q-card>

    <!-- Loading Overlay -->
    <q-inner-loading :showing="processing" class="payment-loader">
      <PaymentLoader :message="processingMessage" />
    </q-inner-loading>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../boot/axios'
import PaymentLoader from './PaymentLoader.vue'

const router = useRouter()

// Props
const props = defineProps({
  merchantId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: '$' },
  description: { type: String, default: '' }
})

// Reactive data
const processing = ref(false)
const processingMessage = ref('Processing your payment...')
const selectedMethod = ref('card')
const selectedWallet = ref(null)
const selectedBank = ref(null)
const saveCard = ref(false)

const merchantInfo = ref({
  business_name: '',
  logo: '',
  website: ''
})

const cardForm = ref({
  number: '',
  name: '',
  expiry: '',
  cvc: ''
})

const errors = ref({
  number: '',
  name: '',
  expiry: '',
  cvc: ''
})

// Constants
const placeholderLogo = 'https://placehold.co/48x48/121018/bdf000?text=FX'

const walletMethods = [
  { id: 'apple_pay', name: 'Apple Pay', icon: 'phone_iphone', color: 'black' },
  { id: 'google_pay', name: 'Google Pay', icon: 'android', color: 'green' },
  { id: 'paypal', name: 'PayPal', icon: 'payment', color: 'blue' },
  { id: 'samsung_pay', name: 'Samsung Pay', icon: 'smartphone', color: 'blue-grey' }
]

const bankOptions = [
  { label: 'Chase Bank', value: 'chase' },
  { label: 'Bank of America', value: 'bofa' },
  { label: 'Wells Fargo', value: 'wells_fargo' },
  { label: 'Citibank', value: 'citi' },
  { label: 'Other', value: 'other' }
]

// Computed properties
const cardBrandIcon = computed(() => {
  const number = cardForm.value.number.replace(/\s/g, '')
  if (number.startsWith('4')) return 'credit_card' // Visa
  if (number.startsWith('5') || number.startsWith('2')) return 'credit_card' // Mastercard
  if (number.startsWith('3')) return 'credit_card' // Amex
  return 'credit_card'
})

const cardBrandColor = computed(() => {
  const number = cardForm.value.number.replace(/\s/g, '')
  if (number.startsWith('4')) return 'blue' // Visa
  if (number.startsWith('5') || number.startsWith('2')) return 'red' // Mastercard
  if (number.startsWith('3')) return 'green' // Amex
  return 'grey'
})

const isFormValid = computed(() => {
  if (selectedMethod.value === 'card') {
    return cardForm.value.number && 
           cardForm.value.name && 
           cardForm.value.expiry && 
           cardForm.value.cvc &&
           !Object.values(errors.value).some(error => error)
  } else if (selectedMethod.value === 'wallet') {
    return selectedWallet.value
  } else if (selectedMethod.value === 'bank') {
    return selectedBank.value
  }
  return false
})

// Methods
const formatAmount = (amount) => {
  return (amount / 100).toFixed(2)
}

const validateCardNumber = () => {
  const number = cardForm.value.number.replace(/\s/g, '')
  if (!number) {
    errors.value.number = 'Card number is required'
  } else if (number.length < 15) {
    errors.value.number = 'Invalid card number'
  } else if (!luhnCheck(number)) {
    errors.value.number = 'Invalid card number'
  } else {
    errors.value.number = ''
  }
}

const validateCardName = () => {
  if (!cardForm.value.name.trim()) {
    errors.value.name = 'Cardholder name is required'
  } else if (cardForm.value.name.trim().length < 2) {
    errors.value.name = 'Name must be at least 2 characters'
  } else {
    errors.value.name = ''
  }
}

const validateExpiry = () => {
  const expiry = cardForm.value.expiry
  if (!expiry) {
    errors.value.expiry = 'Expiry date is required'
  } else if (expiry.length !== 5) {
    errors.value.expiry = 'Invalid expiry date'
  } else {
    const [month, year] = expiry.split('/')
    const currentYear = new Date().getFullYear() % 100
    const currentMonth = new Date().getMonth() + 1
    
    if (parseInt(month) < 1 || parseInt(month) > 12) {
      errors.value.expiry = 'Invalid month'
    } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      errors.value.expiry = 'Card has expired'
    } else {
      errors.value.expiry = ''
    }
  }
}

const validateCVC = () => {
  const cvc = cardForm.value.cvc
  if (!cvc) {
    errors.value.cvc = 'CVC is required'
  } else if (cvc.length < 3) {
    errors.value.cvc = 'Invalid CVC'
  } else {
    errors.value.cvc = ''
  }
}

// Luhn algorithm for card validation
const luhnCheck = (cardNumber) => {
  let sum = 0
  let alternate = false
  
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let n = parseInt(cardNumber.charAt(i), 10)
    
    if (alternate) {
      n *= 2
      if (n > 9) {
        n = (n % 10) + 1
      }
    }
    
    sum += n
    alternate = !alternate
  }
  
  return (sum % 10) === 0
}

const selectWallet = (walletId) => {
  selectedWallet.value = walletId
}

const getWalletName = (walletId) => {
  return walletMethods.find(w => w.id === walletId)?.name || ''
}

const fetchMerchantInfo = async () => {
  try {
    const response = await api.get(`/merchants/${props.merchantId}`)
    merchantInfo.value = response.data
  } catch (error) {
    console.error('Failed to fetch merchant info:', error)
  }
}

const processPayment = async () => {
  try {
    processing.value = true
    processingMessage.value = 'Validating payment details...'
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const paymentData = {
      merchant_id: props.merchantId,
      amount: props.amount,
      currency: props.currency.replace('$', 'USD'),
      method: selectedMethod.value,
      description: props.description
    }

    if (selectedMethod.value === 'card') {
      paymentData.card = {
        number: cardForm.value.number.replace(/\s/g, ''),
        name: cardForm.value.name,
        expiry_month: cardForm.value.expiry.split('/')[0],
        expiry_year: cardForm.value.expiry.split('/')[1],
        cvc: cardForm.value.cvc,
        save_card: saveCard.value
      }
      processingMessage.value = 'Processing card payment...'
    } else if (selectedMethod.value === 'wallet') {
      paymentData.wallet = { provider: selectedWallet.value }
      processingMessage.value = `Redirecting to ${getWalletName(selectedWallet.value)}...`
    } else if (selectedMethod.value === 'bank') {
      paymentData.bank = { provider: selectedBank.value }
      processingMessage.value = 'Preparing bank transfer...'
    }

    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const response = await api.post('/payments/process', paymentData)
    
    if (response.data.status === 'success') {
      processingMessage.value = 'Payment successful! Redirecting...'
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      router.push({
        name: 'payment-status',
        params: { id: response.data.payment_id },
        query: { status: 'success', amount: props.amount, merchant: props.merchantId }
      })
    } else {
      throw new Error(response.data.message || 'Payment failed')
    }
  } catch (error) {
    console.error('Payment error:', error)
    processingMessage.value = 'Payment failed. Redirecting...'
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    router.push({
      name: 'payment-status',
      params: { id: 'failed' },
      query: { status: 'failed', error: error.message, amount: props.amount }
    })
  } finally {
    processing.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchMerchantInfo()
})

// Watch for input changes to validate in real-time
watch(() => cardForm.value.number, validateCardNumber)
watch(() => cardForm.value.name, validateCardName)
watch(() => cardForm.value.expiry, validateExpiry)
watch(() => cardForm.value.cvc, validateCVC)
</script>

<style scoped>
.checkout-container {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.payment-card {
  background: linear-gradient(135deg, #000000 0%, #121018 100%);
  color: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.lime-glow {
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(189, 240, 0, 0.2),
    0 0 30px rgba(189, 240, 0, 0.1);
}

.payment-header {
  background: linear-gradient(90deg, rgba(189, 240, 0, 0.1), transparent);
  border-bottom: 1px solid rgba(189, 240, 0, 0.2);
}

.merchant-avatar {
  border: 2px solid rgba(189, 240, 0, 0.3);
}

.payment-amount {
  text-align: center;
  padding: 30px 20px;
}

.amount-display {
  font-size: 2.5rem;
  font-weight: 700;
  color: #bdf000;
  text-shadow: 0 0 20px rgba(189, 240, 0, 0.3);
}

.currency {
  font-size: 1.8rem;
  margin-right: 4px;
}

.payment-tabs {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
}

.payment-tab {
  color: #ffffff;
  transition: all 0.3s ease;
}

.payment-tab.q-tab--active {
  background: linear-gradient(135deg, #bdf000, #a0d000);
  color: #000000;
}

.form-group {
  margin-bottom: 20px;
}

.field-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #bdf000;
  margin-bottom: 8px;
}

.card-input :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(189, 240, 0, 0.3);
  border-radius: 12px;
  color: #ffffff;
}

.card-input :deep(.q-field__control:hover) {
  border-color: rgba(189, 240, 0, 0.5);
}

.card-input :deep(.q-field__control.q-field__control--focused) {
  border-color: #bdf000;
  box-shadow: 0 0 0 2px rgba(189, 240, 0, 0.2);
}

.card-input :deep(input) {
  color: #ffffff;
}

.card-input :deep(.q-field__label) {
  color: #bdf000;
}

.wallet-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.wallet-btn {
  padding: 20px 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.wallet-btn:hover {
  border-color: rgba(189, 240, 0, 0.5);
  background: rgba(189, 240, 0, 0.1);
}

.wallet-btn.active {
  border-color: #bdf000;
  background: rgba(189, 240, 0, 0.2);
}

.wallet-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.wallet-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffffff;
}

.payment-summary {
  border-top: 1px solid rgba(189, 240, 0, 0.2);
  background: rgba(189, 240, 0, 0.05);
}

.security-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pay-button {
  background: linear-gradient(135deg, #bdf000, #a0d000);
  color: #000000;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 12px;
  height: 56px;
  box-shadow: 0 8px 24px rgba(189, 240, 0, 0.3);
  transition: all 0.3s ease;
}

.pay-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(189, 240, 0, 0.4);
}

.pay-button:disabled {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  transform: none;
  box-shadow: none;
}

.powered-by {
  width: 100%;
}

.payment-loader {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
}

/* Animations */
.checkout-container {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 600px) {
  .checkout-container {
    padding: 10px;
  }
  
  .payment-card {
    border-radius: 16px;
  }
  
  .amount-display {
    font-size: 2rem;
  }
  
  .wallet-grid {
    grid-template-columns: 1fr;
  }
}
</style>
