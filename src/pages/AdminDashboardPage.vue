<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Admin Header -->
    <AdminHeader />
    
    <!-- Page Content -->
    <q-page-container>
      <q-page class="admin-dashboard-page">
        <!-- Breadcrumb -->
        <div class="breadcrumb-section q-pa-md">
          <q-breadcrumbs class="text-grey-6">
            <q-breadcrumbs-el icon="admin_panel_settings" label="Admin" />
            <q-breadcrumbs-el icon="dashboard" label="Dashboard" />
          </q-breadcrumbs>
        </div>

        <!-- Main Content -->
        <div class="admin-content">
          <!-- Overview Section -->
          <AdminOverview />
          
          <!-- Additional Admin Features -->
          <div class="row q-col-gutter-lg q-mt-xl">
            <!-- System Health -->
            <div class="col-12 col-md-6">
              <q-card class="lime-glow">
                <q-card-section>
                  <div class="text-h6 text-lime q-mb-md">System Health</div>
                  <div class="row q-col-gutter-md">
                    <div class="col-6">
                      <div class="text-center">
                        <q-circular-progress
                          :value="systemHealth.api"
                          size="80px"
                          :color="getHealthColor(systemHealth.api)"
                          center-color="transparent"
                          track-color="rgba(255,255,255,0.1)"
                        >
                          <div class="text-h6">{{ systemHealth.api }}%</div>
                        </q-circular-progress>
                        <div class="text-caption q-mt-sm">API Status</div>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="text-center">
                        <q-circular-progress
                          :value="systemHealth.database"
                          size="80px"
                          :color="getHealthColor(systemHealth.database)"
                          center-color="transparent"
                          track-color="rgba(255,255,255,0.1)"
                        >
                          <div class="text-h6">{{ systemHealth.database }}%</div>
                        </q-circular-progress>
                        <div class="text-caption q-mt-sm">Database</div>
                      </div>
                    </div>
                  </div>
                  <div class="row q-col-gutter-md q-mt-md">
                    <div class="col-6">
                      <div class="text-center">
                        <q-circular-progress
                          :value="systemHealth.payment_gateway"
                          size="80px"
                          :color="getHealthColor(systemHealth.payment_gateway)"
                          center-color="transparent"
                          track-color="rgba(255,255,255,0.1)"
                        >
                          <div class="text-h6">{{ systemHealth.payment_gateway }}%</div>
                        </q-circular-progress>
                        <div class="text-caption q-mt-sm">Payment Gateway</div>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="text-center">
                        <q-circular-progress
                          :value="systemHealth.uptime"
                          size="80px"
                          :color="getHealthColor(systemHealth.uptime)"
                          center-color="transparent"
                          track-color="rgba(255,255,255,0.1)"
                        >
                          <div class="text-h6">{{ systemHealth.uptime }}%</div>
                        </q-circular-progress>
                        <div class="text-caption q-mt-sm">Uptime</div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Recent Alerts -->
            <div class="col-12 col-md-6">
              <q-card class="lime-glow">
                <q-card-section>
                  <div class="text-h6 text-lime q-mb-md">Recent Alerts</div>
                  <div class="alerts-list">
                    <div v-for="alert in recentAlerts" :key="alert.id" class="alert-item q-mb-md">
                      <div class="row items-center">
                        <div class="col-auto">
                          <q-icon 
                            :name="getAlertIcon(alert.type)" 
                            :color="getAlertColor(alert.type)"
                            size="24px"
                          />
                        </div>
                        <div class="col">
                          <div class="text-body2">{{ alert.message }}</div>
                          <div class="text-caption text-grey">{{ formatTime(alert.timestamp) }}</div>
                        </div>
                        <div class="col-auto">
                          <q-chip 
                            :color="getAlertColor(alert.type)" 
                            text-color="white" 
                            size="sm"
                          >
                            {{ alert.severity }}
                          </q-chip>
                        </div>
                      </div>
                    </div>
                  </div>
                  <q-btn
                    flat
                    color="lime"
                    label="View All Alerts"
                    class="full-width q-mt-md"
                    @click="$router.push('/admin/alerts')"
                  />
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Quick Merchant Management -->
          <div class="row q-col-gutter-lg q-mt-xl">
            <div class="col-12">
              <q-card class="lime-glow">
                <q-card-section>
                  <div class="row items-center q-mb-md">
                    <div class="text-h6 text-lime">Recent Merchant Activity</div>
                    <q-space />
                    <q-btn
                      color="lime"
                      icon="store"
                      label="View All Merchants"
                      @click="$router.push('/admin/merchants')"
                    />
                  </div>
                  
                  <!-- Quick merchant table -->
                  <q-table
                    :rows="recentMerchants"
                    :columns="merchantColumns"
                    :pagination="{ rowsPerPage: 5 }"
                    row-key="id"
                    class="merchant-table"
                  >
                    <!-- Status Column -->
                    <template v-slot:body-cell-status="props">
                      <q-td :props="props">
                        <q-chip
                          :color="getStatusColor(props.value)"
                          text-color="white"
                          :icon="getStatusIcon(props.value)"
                          size="sm"
                        >
                          {{ props.value }}
                        </q-chip>
                      </q-td>
                    </template>

                    <!-- Actions Column -->
                    <template v-slot:body-cell-actions="props">
                      <q-td :props="props">
                        <q-btn
                          flat
                          round
                          dense
                          icon="visibility"
                          color="blue"
                          @click="viewMerchant(props.row)"
                          size="sm"
                        >
                          <q-tooltip>View Details</q-tooltip>
                        </q-btn>
                      </q-td>
                    </template>
                  </q-table>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminHeader from '../components/navigation/AdminHeader.vue'
import AdminOverview from '../components/admin/AdminOverview.vue'
import api from '../boot/axios'

const router = useRouter()

// Reactive data
const systemHealth = ref({
  api: 99.8,
  database: 100,
  payment_gateway: 99.5,
  uptime: 99.9
})

const recentAlerts = ref([])
const recentMerchants = ref([])

// Merchant table columns
const merchantColumns = [
  {
    name: 'business_name',
    label: 'Business Name',
    field: 'business_name',
    align: 'left',
    sortable: true
  },
  {
    name: 'email',
    label: 'Email',
    field: 'email',
    align: 'left',
    sortable: true
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center',
    sortable: true
  },
  {
    name: 'created_at',
    label: 'Registered',
    field: 'created_at',
    align: 'center',
    sortable: true
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center',
    sortable: false
  }
]

// Methods
const loadSystemHealth = async () => {
  try {
    const response = await api.get('/admin/system/health')
    systemHealth.value = response.data
  } catch (error) {
    console.error('Failed to load system health:', error)
  }
}

const loadRecentAlerts = async () => {
  try {
    const response = await api.get('/admin/alerts/recent')
    recentAlerts.value = response.data
  } catch (error) {
    console.error('Failed to load alerts:', error)
    // Demo data
    recentAlerts.value = [
      {
        id: 1,
        type: 'warning',
        severity: 'Medium',
        message: 'High transaction volume detected',
        timestamp: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        id: 2,
        type: 'info',
        severity: 'Low',
        message: 'New merchant registration completed',
        timestamp: new Date(Date.now() - 1000 * 60 * 60)
      },
      {
        id: 3,
        type: 'error',
        severity: 'High',
        message: 'Payment gateway timeout detected',
        timestamp: new Date(Date.now() - 1000 * 60 * 120)
      }
    ]
  }
}

const loadRecentMerchants = async () => {
  try {
    const response = await api.get('/admin/merchants/recent')
    recentMerchants.value = response.data
  } catch (error) {
    console.error('Failed to load recent merchants:', error)
    // Demo data
    recentMerchants.value = [
      {
        id: 1,
        business_name: 'TechCorp Inc',
        email: 'admin@techcorp.com',
        status: 'Verified',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2)
      },
      {
        id: 2,
        business_name: 'FoodExpress',
        email: 'contact@foodexpress.com',
        status: 'Pending',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 4)
      },
      {
        id: 3,
        business_name: 'Digital Solutions',
        email: 'info@digitalsolutions.com',
        status: 'Verified',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 6)
      }
    ]
  }
}

const getHealthColor = (value) => {
  if (value >= 95) return 'green'
  if (value >= 80) return 'orange'
  return 'red'
}

const getAlertColor = (type) => {
  switch (type) {
    case 'error': return 'red'
    case 'warning': return 'orange'
    case 'info': return 'blue'
    default: return 'grey'
  }
}

const getAlertIcon = (type) => {
  switch (type) {
    case 'error': return 'error'
    case 'warning': return 'warning'
    case 'info': return 'info'
    default: return 'notifications'
  }
}

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'verified': return 'green'
    case 'rejected': return 'red'
    case 'suspended': return 'orange'
    case 'pending': return 'orange'
    default: return 'grey'
  }
}

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case 'verified': return 'check_circle'
    case 'rejected': return 'cancel'
    case 'suspended': return 'block'
    case 'pending': return 'pending'
    default: return 'help'
  }
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

const viewMerchant = (merchant) => {
  router.push(`/admin/merchants/${merchant.id}`)
}

// Initialize
onMounted(async () => {
  await loadSystemHealth()
  await loadRecentAlerts()
  await loadRecentMerchants()
})
</script>

<style scoped>
.admin-dashboard-page {
  background: #0a0a0a;
  min-height: 100vh;
}

.breadcrumb-section {
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(189, 240, 0, 0.1);
}

.admin-content {
  padding: 20px;
}

.lime-glow {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
              0 0 0 1px rgba(189, 240, 0, 0.2),
              0 0 20px rgba(189, 240, 0, 15);
  background: #121212;
  border-radius: 12px;
}

.alerts-list {
  max-height: 300px;
  overflow-y: auto;
}

.alert-item {
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.alert-item:last-child {
  border-bottom: none;
}

.merchant-table {
  background: transparent;
}

.text-lime {
  color: #bdf000;
}

.text-grey-6 {
  color: #999;
}
</style>