import { createRouter, createWebHistory } from 'vue-router'

// Correct way to import pages
import LandingPage from '../pages/LandingPage.vue'
import Login from '../pages/LoginPage.vue'
import Register from '../pages/RegisterPage.vue'
import Checkout from '../pages/CheckoutPage.vue'
import MerchantDashboard from '../pages/MerchantDashboardPage.vue'
import PaymentStatus from '../pages/PaymentStatus.vue'
import HostedCheckout from '../pages/HostedCheckout.vue'
import TransactionsPage from '../pages/TransactionsPage.vue'
import StatsPage from '../pages/StatsPage.vue'
import AdminDashboardPage from '../pages/AdminDashboardPage.vue'

const routes = [
  { path: '/', name: 'home', component: LandingPage },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/checkout', name: 'checkout', component: Checkout },
  { path: '/dashboard', name: 'dashboard', component: MerchantDashboard },
  { path: '/admin-dashboard', name: 'admin-dashboard', component: AdminDashboardPage },
  { path: '/payments/status/:id', name: 'payment-status', component: PaymentStatus },
  { path: '/checkout/:merchantId', name: 'hosted-checkout', component: HostedCheckout },
  { path: '/transactions', name: 'transactions', component: TransactionsPage },
  { path: '/stats', name: 'stats', component: StatsPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
