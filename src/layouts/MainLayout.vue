<template>
  <q-layout view="hHh LpR fFf">
    <AnimateBackground />

    <!-- Header -->
    <q-header elevated class="text-white header-gradient">
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="drawerOpen = !drawerOpen"
          class="q-mr-sm"
        />
        <q-toolbar-title class="row items-center no-wrap">
          <q-icon name="payments" class="q-mr-sm" />
          <span class="text-weight-medium">Fintech System</span>
        </q-toolbar-title>
        <q-input
          dense
          standout="bg-white text-dark"
          v-model="q"
          placeholder="Search..."
          class="q-mr-md"
          rounded
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn flat round dense icon="notifications" class="q-mr-xs" />
        <q-avatar size="32px">
          <img src="https://i.pravatar.cc/64?img=5" alt="user" />
        </q-avatar>
      </q-toolbar>
    </q-header>

    <!-- Drawer -->
    <q-drawer
      v-model="drawerOpen"
      show-if-above
      :overlay="$q.screen.lt.md"
      class="glass-card"
    >
      <q-list padding>
        <q-item clickable v-ripple to="/" exact class="nav-item">
          <q-item-section avatar><q-icon name="home" /></q-item-section>
          <q-item-section>Home</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/dashboard" class="nav-item">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/transactions" class="nav-item">
          <q-item-section avatar><q-icon name="receipt_long" /></q-item-section>
          <q-item-section>Transactions</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/stats" class="nav-item">
          <q-item-section avatar><q-icon name="stacked_bar_chart" /></q-item-section>
          <q-item-section>Analytics</q-item-section>
        </q-item>

        <q-separator spaced />

        <q-item clickable v-ripple to="/checkout/merchant-123" class="nav-item">
          <q-item-section avatar><q-icon name="shopping_cart" /></q-item-section>
          <q-item-section>Checkout</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/login" class="nav-item">
          <q-item-section avatar><q-icon name="login" /></q-item-section>
          <q-item-section>Login</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/register" class="nav-item">
          <q-item-section avatar><q-icon name="person_add" /></q-item-section>
          <q-item-section>Register</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Page Content with Transition -->
    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>

    <!-- Footer -->
    <q-footer class="bg-grey-1 text-grey-8">
      <div class="q-pa-sm text-center">
        © {{ new Date().getFullYear() }} Fintech System
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from "vue"
import AnimateBackground from "../components/common/AnimateBackground.vue"

const drawerOpen = ref(true)
const q = ref("")
</script>

<style scoped>
.nav-item.q-router-link--active {
  background: rgba(255, 255, 255, 0.08);
}

/* Page transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
