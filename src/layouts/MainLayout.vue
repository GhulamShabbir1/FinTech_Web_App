<template>
  <q-layout view="hHh LpR fFf">

    <!-- Header -->
    <q-header elevated class="text-white header-gradient">
      <q-toolbar class="q-py-sm">
        <q-btn
          v-if="isAuthed"
          flat
          round
          dense
          icon="menu"
          @click="drawerOpen = !drawerOpen"
          class="q-mr-sm lt-md"
        />
        <q-toolbar-title class="row items-center no-wrap">
          <q-icon name="payments" class="q-mr-sm" />
          <span class="text-weight-medium">Fintech System</span>
        </q-toolbar-title>
        <div class="gt-sm">
          <q-btn flat label="Home" to="/" class="q-mx-xs" />
          <q-btn flat label="Benefits" to="/" @click.prevent="scrollTo('benefits')" class="q-mx-xs" />
          <q-btn flat label="Services" to="/" @click.prevent="scrollTo('services')" class="q-mx-xs" />
          <q-btn flat label="Partners" to="/" @click.prevent="scrollTo('partners')" class="q-mx-xs" />
          <q-btn flat label="Insights" to="/stats" class="q-mx-xs" />
          <q-btn flat label="Transactions" to="/transactions" class="q-mx-xs" />
        </div>
        <q-space />
        <q-btn dense flat icon="search" @click="searchOpen = !searchOpen" class="q-mr-sm" />
        <q-btn flat rounded class="btn-gradient" to="/register" label="Get Started" />
        <q-btn flat class="q-ml-sm btn-outline-light" to="/login" label="Access Account" />
      </q-toolbar>
      <q-slide-transition>
        <div v-show="searchOpen" class="q-pa-sm bg-white text-dark">
          <q-input dense outlined v-model="q" placeholder="Search...">
            <template #prepend><q-icon name="search" /></template>
          </q-input>
        </div>
      </q-slide-transition>
    </q-header>

    <!-- Drawer -->
    <q-drawer
      v-if="isAuthed"
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

        <q-item clickable v-ripple to="/transactions" class="nav-item">
          <q-item-section avatar><q-icon name="receipt_long" /></q-item-section>
          <q-item-section>Transactions</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/stats" class="nav-item">
          <q-item-section avatar><q-icon name="stacked_bar_chart" /></q-item-section>
          <q-item-section>Analytics</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/checkout/merchant-123" class="nav-item">
          <q-item-section avatar><q-icon name="shopping_cart" /></q-item-section>
          <q-item-section>Checkout</q-item-section>
        </q-item>

        <q-separator spaced />

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
      <div class="q-pa-lg q-px-xl">
        <div class="row items-start q-col-gutter-xl">
          <div class="col-12 col-md-4 q-mb-md">
            <div class="text-subtitle1 text-dark">Fintech System</div>
            <div class="text-caption">Modern payment infrastructure for merchants.</div>
          </div>
          <div class="col-6 col-md-2">
            <div class="text-caption text-weight-medium q-mb-sm">Company</div>
            <q-list dense>
              <q-item clickable v-ripple to="/" class="q-pa-xs"><q-item-section>Home</q-item-section></q-item>
              <q-item clickable v-ripple to="/stats" class="q-pa-xs"><q-item-section>Insights</q-item-section></q-item>
              <q-item clickable v-ripple to="/transactions" class="q-pa-xs"><q-item-section>Transactions</q-item-section></q-item>
            </q-list>
          </div>
          <div class="col-6 col-md-2">
            <div class="text-caption text-weight-medium q-mb-sm">Legal</div>
            <q-list dense>
              <q-item clickable class="q-pa-xs"><q-item-section>Privacy</q-item-section></q-item>
              <q-item clickable class="q-pa-xs"><q-item-section>Terms</q-item-section></q-item>
              <q-item clickable class="q-pa-xs"><q-item-section>Policy</q-item-section></q-item>
            </q-list>
          </div>
          <div class="col-12 col-md-4">
            <div class="text-caption text-weight-medium q-mb-sm">Follow us</div>
            <div class="row q-gutter-sm">
              <q-btn round flat icon="public" href="#" />
              <q-btn round flat icon="business" href="#" />
              <q-btn round flat icon="code" href="#" />
            </div>
          </div>
        </div>
        <div class="text-center q-mt-lg text-caption">© {{ new Date().getFullYear() }} Fintech System</div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue"
import { useAuthStore } from "../store/auth"

const auth = useAuthStore()
const isAuthed = computed(() => !!auth.token)

const drawerOpen = ref(false)
const q = ref("")
const searchOpen = ref(false)

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
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
