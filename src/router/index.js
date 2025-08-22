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
import AdminMerchantsPage from '../pages/AdminMerchantsPage.vue'

const routes = [
  // Landing and Authentication
  { path: '/', name: 'home', component: LandingPage, meta: { title: 'FinteckX - Home' } },
  { path: '/login', name: 'login', component: Login, meta: { title: 'Login - FinteckX' } },
  { path: '/register', name: 'register', component: Register, meta: { title: 'Register - FinteckX' } },
  
  // Checkout and Payment Routes
  { path: '/checkout', name: 'checkout', component: Checkout, meta: { title: 'Checkout - FinteckX' } },
  { path: '/checkout/:merchantId', name: 'hosted-checkout', component: HostedCheckout, meta: { title: 'Secure Checkout - FinteckX' } },
  { path: '/payment-status', name: 'payment-status', component: PaymentStatus, meta: { title: 'Payment Status - FinteckX' } },
  { path: '/payments/status/:id', name: 'payment-status-detail', component: PaymentStatus, meta: { title: 'Payment Status - FinteckX' } },
  
  // Merchant Dashboard Routes
  { path: '/dashboard', name: 'dashboard', component: MerchantDashboard, meta: { title: 'Merchant Dashboard - FinteckX', requiresAuth: true, role: 'merchant' } },
  { path: '/transactions', name: 'transactions', component: TransactionsPage, meta: { title: 'Transactions - FinteckX', requiresAuth: true, role: 'merchant' } },
  { path: '/stats', name: 'stats', component: StatsPage, meta: { title: 'Analytics - FinteckX', requiresAuth: true, role: 'merchant' } },
  
  // Admin Dashboard Routes
  { path: '/admin-dashboard', name: 'admin-dashboard', component: AdminDashboardPage, meta: { title: 'Admin Dashboard - FinteckX', requiresAuth: true, role: 'admin' } },
  { path: '/admin/merchants', name: 'admin-merchants', component: AdminMerchantsPage, meta: { title: 'Admin - Merchant Management - FinteckX', requiresAuth: true, role: 'admin' } },
  { path: '/admin/transactions', name: 'admin-transactions', component: TransactionsPage, meta: { title: 'Admin - Transactions - FinteckX', requiresAuth: true, role: 'admin' } },
  { path: '/admin/analytics', name: 'admin-analytics', component: StatsPage, meta: { title: 'Admin - Analytics - FinteckX', requiresAuth: true, role: 'admin' } },
  { path: '/admin/settings', name: 'admin-settings', component: () => import('../pages/AdminSettingsPage.vue'), meta: { title: 'Admin - Settings - FinteckX', requiresAuth: true, role: 'admin' } },
  { path: '/admin/support', name: 'admin-support', component: () => import('../pages/AdminSupportPage.vue'), meta: { title: 'Admin - Support - FinteckX', requiresAuth: true, role: 'admin' } },
  { path: '/admin/alerts', name: 'admin-alerts', component: () => import('../pages/AdminAlertsPage.vue'), meta: { title: 'Admin - Alerts - FinteckX', requiresAuth: true, role: 'admin' } },
  { path: '/admin/activity', name: 'admin-activity', component: () => import('../pages/AdminActivityPage.vue'), meta: { title: 'Admin - Activity - FinteckX', requiresAuth: true, role: 'admin' } },
  { path: '/admin/profile', name: 'admin-profile', component: () => import('../pages/AdminProfilePage.vue'), meta: { title: 'Admin - Profile - FinteckX', requiresAuth: true, role: 'admin' } },
  
  // Additional Checkout Routes
  { path: '/checkout/embedded/:merchantId', name: 'embedded-checkout', component: HostedCheckout, meta: { title: 'Embedded Checkout - FinteckX' } },
  
  // Payment Processing Routes
  { path: '/payment/process', name: 'payment-process', component: () => import('../components/checkout/CheckoutRouter.vue'), meta: { title: 'Processing Payment - FinteckX' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard for authentication and role-based access
/*
router.beforeEach((to, from, next) => {
  // Update page title
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }
    
    // Check role-based access if specified
    if (to.meta.role) {
      const userRole = localStorage.getItem('user_role')
      if (userRole !== to.meta.role) {
        // Redirect based on user role
        if (userRole === 'admin') {
          next({ name: 'admin-dashboard' })
        } else if (userRole === 'merchant') {
          next({ name: 'dashboard' })
        } else {
          next({ name: 'login' })
        }
        return
      }
    }
  }
  
  next()
})
*/

// Navigation guard for checkout routes
/*
router.beforeEach((to, from, next) => {
  if (to.name === 'checkout' || to.name === 'hosted-checkout' || to.name === 'embedded-checkout') {
    // Validate required query parameters for checkout
    if (to.name === 'checkout' && !to.query.amount) {
      next({ name: 'home' })
      return
    }
    if (to.name === 'hosted-checkout' && !to.params.merchantId) {
      next({ name: 'home' })
      return
    }
  }
  next()
})
*/

export default router
