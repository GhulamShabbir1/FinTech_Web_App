<template>
  <div class="admin-overview">
    <!-- Platform Stats -->
    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card lime-glow">
          <q-card-section class="text-center">
            <q-icon name="store" size="48px" color="lime" class="q-mb-md" />
            <div class="text-h4 text-lime">{{ stats.totalMerchants }}</div>
            <div class="text-caption">Total Merchants</div>
            <div class="text-caption text-green q-mt-xs">
              <q-icon name="trending_up" size="16px" />
              +{{ stats.newMerchantsThisMonth }} this month
            </div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card lime-glow">
          <q-card-section class="text-center">
            <q-icon name="receipt_long" size="48px" color="lime" class="q-mb-md" />
            <div class="text-h4 text-lime">{{ formatCurrency(stats.totalRevenue) }}</div>
            <div class="text-caption">Total Revenue</div>
            <div class="text-caption text-green q-mt-xs">
              <q-icon name="trending_up" size="16px" />
              +{{ stats.revenueGrowth }}% vs last month
            </div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card lime-glow">
          <q-card-section class="text-center">
            <q-icon name="payments" size="48px" color="lime" class="q-mb-md" />
            <div class="text-h4 text-lime">{{ stats.totalTransactions }}</div>
            <div class="text-caption">Transactions</div>
            <div class="text-caption text-green q-mt-xs">
              <q-icon name="trending_up" size="16px" />
              {{ stats.successRate }}% success rate
            </div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card lime-glow">
          <q-card-section class="text-center">
            <q-icon name="pending_actions" size="48px" color="orange" class="q-mb-md" />
            <div class="text-h4 text-orange">{{ stats.pendingApprovals }}</div>
            <div class="text-caption">Pending Approvals</div>
            <div class="text-caption text-grey q-mt-xs">
              <q-icon name="schedule" size="16px" />
              Requires attention
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-12 col-md-8">
        <q-card class="lime-glow">
          <q-card-section>
            <div class="text-h6 text-lime q-mb-md">Quick Actions</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-btn
                  color="lime"
                  icon="store"
                  label="Review Merchants"
                  class="full-width q-mb-sm"
                  @click="$router.push('/admin/merchants?status=pending')"
                />
                <q-btn
                  color="blue"
                  icon="analytics"
                  label="View Analytics"
                  class="full-width q-mb-sm"
                  @click="$router.push('/admin/analytics')"
                />
                <q-btn
                  color="purple"
                  icon="receipt_long"
                  label="Transaction Report"
                  class="full-width q-mb-sm"
                  @click="$router.push('/admin/transactions')"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-btn
                  color="orange"
                  icon="support_agent"
                  label="Support Tickets"
                  class="full-width q-mb-sm"
                  @click="$router.push('/admin/support')"
                />
                <q-btn
                  color="teal"
                  icon="settings"
                  label="System Settings"
                  class="full-width q-mb-sm"
                  @click="$router.push('/admin/settings')"
                />
                <q-btn
                  color="grey"
                  icon="download"
                  label="Export Data"
                  class="full-width q-mb-sm"
                  @click="exportData"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-md-4">
        <q-card class="lime-glow">
          <q-card-section>
            <div class="text-h6 text-lime q-mb-md">Recent Activity</div>
            <div class="activity-list">
              <div v-for="activity in recentActivity" :key="activity.id" class="activity-item q-mb-md">
                <div class="row items-center">
                  <div class="col-auto">
                    <q-avatar size="32px" :color="getActivityColor(activity.type)">
                      <q-icon :name="getActivityIcon(activity.type)" color="white" />
                    </q-avatar>
                  </div>
                  <div class="col">
                    <div class="text-body2">{{ activity.message }}</div>
                    <div class="text-caption text-grey">{{ formatTime(activity.timestamp) }}</div>
                  </div>
                </div>
              </div>
            </div>
            <q-btn
              flat
              color="lime"
              label="View All Activity"
              class="full-width q-mt-md"
              @click="$router.push('/admin/activity')"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-8">
        <q-card class="lime-glow">
          <q-card-section>
            <div class="text-h6 text-lime q-mb-md">Revenue Trend</div>
            <div class="chart-container">
              <canvas ref="revenueChart" height="300"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-md-4">
        <q-card class="lime-glow">
          <q-card-section>
            <div class="text-h6 text-lime q-mb-md">Merchant Status</div>
            <div class="chart-container">
              <canvas ref="merchantChart" height="300"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
import { Chart, registerables } from 'chart.js'
import api from '../../boot/axios'

Chart.register(...registerables)

const $q = useQuasar()

// Reactive data
const stats = ref({
  totalMerchants: 0,
  newMerchantsThisMonth: 0,
  totalRevenue: 0,
  revenueGrowth: 0,
  totalTransactions: 0,
  successRate: 0,
  pendingApprovals: 0
})

const recentActivity = ref([])
const revenueChart = ref(null)
const merchantChart = ref(null)

let revenueChartInstance = null
let merchantChartInstance = null

// Methods
const loadStats = async () => {
  try {
    const response = await api.get('/admin/stats/overview')
    stats.value = response.data
  } catch (error) {
    console.error('Failed to load stats:', error)
    // Demo data
    stats.value = {
      totalMerchants: 1247,
      newMerchantsThisMonth: 23,
      totalRevenue: 2847500,
      revenueGrowth: 12.5,
      totalTransactions: 45678,
      successRate: 98.7,
      pendingApprovals: 3
    }
  }
}

const loadRecentActivity = async () => {
  try {
    const response = await api.get('/admin/activity/recent')
    recentActivity.value = response.data
  } catch (error) {
    console.error('Failed to load activity:', error)
    // Demo data
    recentActivity.value = [
      {
        id: 1,
        type: 'merchant_approved',
        message: 'Merchant "TechCorp Inc" approved',
        timestamp: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        id: 2,
        type: 'transaction',
        message: 'Large transaction: $15,000 processed',
        timestamp: new Date(Date.now() - 1000 * 60 * 60)
      },
      {
        id: 3,
        type: 'merchant_registered',
        message: 'New merchant "FoodExpress" registered',
        timestamp: new Date(Date.now() - 1000 * 60 * 120)
      },
      {
        id: 4,
        type: 'support_ticket',
        message: 'Support ticket #1234 resolved',
        timestamp: new Date(Date.now() - 1000 * 60 * 180)
      }
    ]
  }
}

const createRevenueChart = () => {
  const ctx = revenueChart.value.getContext('2d')
  
  revenueChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Revenue',
        data: [1200000, 1350000, 1420000, 1580000, 1650000, 1847500],
        borderColor: '#bdf000',
        backgroundColor: 'rgba(189, 240, 0, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#ccc',
            callback: function(value) {
              return '$' + (value / 1000000).toFixed(1) + 'M'
            }
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#ccc'
          }
        }
      }
    }
  })
}

const createMerchantChart = () => {
  const ctx = merchantChart.value.getContext('2d')
  
  merchantChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Verified', 'Pending', 'Rejected', 'Suspended'],
      datasets: [{
        data: [1180, 45, 12, 10],
        backgroundColor: [
          '#4CAF50',
          '#FF9800',
          '#F44336',
          '#9E9E9E'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#ccc',
            padding: 20
          }
        }
      }
    }
  })
}

const exportData = () => {
  $q.dialog({
    title: 'Export Data',
    message: 'What would you like to export?',
    options: {
      type: 'radio',
      model: 'merchants',
      items: [
        { label: 'Merchants List', value: 'merchants' },
        { label: 'Transaction Report', value: 'transactions' },
        { label: 'Revenue Report', value: 'revenue' },
        { label: 'All Data', value: 'all' }
      ]
    },
    cancel: true,
    persistent: true
  }).onOk(async (value) => {
    try {
      const response = await api.get(`/admin/export/${value}`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${value}_export_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      $q.notify({
        type: 'positive',
        message: 'Export completed successfully'
      })
    } catch (error) {
      console.error('Export failed:', error)
      $q.notify({
        type: 'negative',
        message: 'Export failed'
      })
    }
  })
}

const getActivityColor = (type) => {
  switch (type) {
    case 'merchant_approved': return 'green'
    case 'merchant_registered': return 'blue'
    case 'transaction': return 'purple'
    case 'support_ticket': return 'orange'
    default: return 'grey'
  }
}

const getActivityIcon = (type) => {
  switch (type) {
    case 'merchant_approved': return 'check_circle'
    case 'merchant_registered': return 'store'
    case 'transaction': return 'payments'
    case 'support_ticket': return 'support_agent'
    default: return 'info'
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatTime = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diff = now - time
  
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return time.toLocaleDateString()
}

// Lifecycle
onMounted(async () => {
  await loadStats()
  await loadRecentActivity()
  
  // Create charts after data is loaded
  createRevenueChart()
  createMerchantChart()
})

onBeforeUnmount(() => {
  if (revenueChartInstance) {
    revenueChartInstance.destroy()
  }
  if (merchantChartInstance) {
    merchantChartInstance.destroy()
  }
})
</script>

<style scoped>
.admin-overview {
  padding: 20px;
}

.stat-card {
  background: #121212;
  border-radius: 12px;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.lime-glow {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
              0 0 0 1px rgba(189, 240, 0, 0.2),
              0 0 20px rgba(189, 240, 0, 15);
}

.chart-container {
  position: relative;
  height: 300px;
}

.activity-list {
  max-height: 300px;
  overflow-y: auto;
}

.activity-item {
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.activity-item:last-child {
  border-bottom: none;
}

.text-lime {
  color: #bdf000;
}

.text-green {
  color: #4CAF50;
}

.text-grey {
  color: #999;
}
</style>