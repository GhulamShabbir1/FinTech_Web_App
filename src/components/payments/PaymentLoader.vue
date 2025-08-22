<template>
  <div class="payment-loader-container">
    <!-- Main Loader Animation -->
    <div class="loader-main">
      <div class="pulse-circle">
        <div class="pulse-ring" v-for="n in 3" :key="n" :style="{ animationDelay: `${n * 0.5}s` }"></div>
        <div class="loader-center">
          <q-icon name="lock" size="32px" color="lime" class="lock-icon" />
        </div>
      </div>
    </div>

    <!-- Processing Steps -->
    <div class="processing-steps">
      <div 
        v-for="(step, index) in steps" 
        :key="step.id"
        :class="['step-item', { 
          active: currentStep >= index, 
          completed: currentStep > index 
        }]"
      >
        <div class="step-icon">
          <q-icon 
            :name="currentStep > index ? 'check_circle' : step.icon" 
            :color="currentStep > index ? 'green' : (currentStep >= index ? 'lime' : 'grey')"
            size="sm"
          />
        </div>
        <div class="step-text">{{ step.label }}</div>
      </div>
    </div>

    <!-- Processing Message -->
    <div class="processing-message">
      <div class="message-text">{{ message }}</div>
      <div class="progress-dots">
        <span v-for="n in 3" :key="n" class="dot" :style="{ animationDelay: `${n * 0.3}s` }"></span>
      </div>
    </div>

    <!-- Security Indicators -->
    <div class="security-indicators">
      <div class="security-item">
        <q-icon name="security" color="green" size="sm" />
        <span>SSL Encrypted</span>
      </div>
      <div class="security-item">
        <q-icon name="verified_user" color="blue" size="sm" />
        <span>PCI Compliant</span>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="progress-container">
      <q-linear-progress 
        :value="progressValue" 
        color="lime" 
        track-color="rgba(255,255,255,0.1)"
        size="4px" 
        rounded
        animation-speed="200"
      />
      <div class="progress-text">{{ Math.round(progressValue * 100) }}% Complete</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  message: { type: String, default: 'Processing payment...' },
  type: { type: String, default: 'payment' }, // payment, redirect, verification
  duration: { type: Number, default: 5000 } // milliseconds
})

// Reactive data
const currentStep = ref(0)
const progressValue = ref(0)
const startTime = ref(Date.now())
let progressInterval = null

// Processing steps based on type
const steps = computed(() => {
  if (props.type === 'payment') {
    return [
      { id: 'validate', label: 'Validating Details', icon: 'verified' },
      { id: 'process', label: 'Processing Payment', icon: 'payment' },
      { id: 'confirm', label: 'Confirming Transaction', icon: 'check_circle' },
      { id: 'complete', label: 'Redirecting...', icon: 'launch' }
    ]
  } else if (props.type === 'redirect') {
    return [
      { id: 'prepare', label: 'Preparing Redirect', icon: 'link' },
      { id: 'secure', label: 'Securing Connection', icon: 'security' },
      { id: 'redirect', label: 'Redirecting...', icon: 'launch' }
    ]
  } else {
    return [
      { id: 'verify', label: 'Verifying Information', icon: 'verified' },
      { id: 'process', label: 'Processing Request', icon: 'hourglass_empty' },
      { id: 'complete', label: 'Almost Done...', icon: 'check_circle' }
    ]
  }
})

// Methods
const updateProgress = () => {
  const elapsed = Date.now() - startTime.value
  const progress = Math.min(elapsed / props.duration, 1)
  progressValue.value = progress
  
  // Update current step based on progress
  const stepProgress = progress * steps.value.length
  currentStep.value = Math.floor(stepProgress)
  
  if (progress >= 1) {
    clearInterval(progressInterval)
  }
}

// Lifecycle
onMounted(() => {
  startTime.value = Date.now()
  progressInterval = setInterval(updateProgress, 100)
})

onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})

// Watch for message changes to reset if needed
watch(() => props.message, () => {
  // Reset progress if message indicates a new phase
  if (props.message.includes('Validating')) {
    currentStep.value = 0
    progressValue.value = 0
    startTime.value = Date.now()
  }
})
</script>

<style scoped>
.payment-loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #ffffff;
  min-height: 400px;
}

/* Main Loader Animation */
.loader-main {
  margin-bottom: 40px;
}

.pulse-circle {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid #bdf000;
  border-radius: 50%;
  animation: pulse 2s ease-out infinite;
  opacity: 0;
}

.loader-center {
  position: relative;
  z-index: 10;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #bdf000, #a0d000);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(189, 240, 0, 0.4);
}

.lock-icon {
  color: #000000;
  animation: lockPulse 2s ease-in-out infinite;
}

/* Processing Steps */
.processing-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 30px;
  min-width: 200px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
}

.step-item.active {
  background: rgba(189, 240, 0, 0.1);
  border-left: 3px solid #bdf000;
}

.step-item.completed {
  background: rgba(34, 197, 94, 0.1);
  border-left: 3px solid #22c55e;
}

.step-icon {
  flex-shrink: 0;
}

.step-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #ffffff;
}

/* Processing Message */
.processing-message {
  margin-bottom: 30px;
}

.message-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: #bdf000;
  margin-bottom: 8px;
}

.progress-dots {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.dot {
  width: 6px;
  height: 6px;
  background-color: #bdf000;
  border-radius: 50%;
  animation: dotPulse 1.5s ease-in-out infinite;
}

/* Security Indicators */
.security-indicators {
  display: flex;
  gap: 24px;
  margin-bottom: 30px;
}

.security-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #a0a0a0;
}

/* Progress Bar */
.progress-container {
  width: 100%;
  max-width: 300px;
}

.progress-text {
  font-size: 0.75rem;
  color: #a0a0a0;
  margin-top: 8px;
}

/* Animations */
@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

@keyframes lockPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes dotPulse {
  0%, 60%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  30% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Responsive */
@media (max-width: 600px) {
  .payment-loader-container {
    padding: 20px 10px;
    min-height: 300px;
  }
  
  .pulse-circle {
    width: 100px;
    height: 100px;
  }
  
  .loader-center {
    width: 50px;
    height: 50px;
  }
  
  .lock-icon {
    font-size: 24px;
  }
  
  .security-indicators {
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }
  
  .processing-steps {
    min-width: auto;
    width: 100%;
  }
}
</style>