<template>
  <div class="bg-wrap">
    <div v-for="n in 12" :key="n" class="bubble" :style="styleFor(n)"></div>
    <div class="grid"></div>
  </div>
</template>

<script setup>
const styleFor = (n) => {
  const size = 40 + (n % 5) * 20
  const left = Math.random() * 100
  const duration = 12 + (n % 7) * 3
  const delay = (n % 5) * 0.7
  return {
    width: size + 'px',
    height: size + 'px',
    left: left + '%',
    animationDuration: duration + 's',
    animationDelay: delay + 's'
  }
}
</script>

<style scoped>
.bg-wrap {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: radial-gradient(80% 120% at 10% 10%, rgba(59,130,246,0.12) 0%, rgba(16,185,129,0.08) 30%, rgba(11,16,32,1) 70%);
}
.grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(circle at center, rgba(0,0,0,0.5), transparent 70%);
}
.bubble {
  position: absolute;
  bottom: -60px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(59,130,246,0.35), rgba(16,185,129,0.25));
  filter: blur(1px);
  animation-name: rise;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
@keyframes rise {
  0% { transform: translateY(0) scale(1); opacity: .6; }
  50% { transform: translateY(-50vh) scale(1.05); opacity: .9; }
  100% { transform: translateY(-100vh) scale(1.1); opacity: 0; }
}
</style>
