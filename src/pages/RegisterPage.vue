<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="q-pa-lg shadow-2 lime-glow rounded-borders" style="width:980px; max-width:95%;">
      <div class="row items-stretch">
        <div class="col-12 col-md-5 bg-dark q-pa-md flex flex-center">
          <q-img :src="illustration" fit="contain" ratio="4/3" class="floating" @error="onImgError" />
        </div>
        <div class="col-12 col-md-7 q-pa-md">
          <div class="text-h6 text-center text-lime">Merchant Onboarding</div>
          <div class="text-subtitle2 text-center q-mb-lg">Create your account and complete verification</div>
          <OnBoardingWizard />
          <div class="q-mt-md text-center">
            <q-btn flat label="Already have an account? Login" @click="$router.push('/login')" />
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import OnBoardingWizard from '../components/onboarding/OnBoardingWizard.vue'

const illustration = 'https://source.unsplash.com/900x700/?fintech,3d,banking'
const onImgError = (e) => {
  e.target.src = 'https://placehold.co/900x700/121018/bdf000?text=FinteckX'
}
</script>

<style scoped>
.text-lime {
  color: #bdf000;
}

.lime-glow {
  border-radius: 14px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.35), 0 0 0 1px rgba(189,240,0,0.28), 0 0 24px rgba(189,240,0,0.18);
}

.bg-dark {
  background: #000;
}

.floating {
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) }
  50% { transform: translateY(-12px) }
}
</style>
