<template>
  <div class="transaction-table-container">
    <!-- Header with Stats -->
    <div class="table-header">
      <div class="header-left">
        <h3 class="section-title">Transaction History</h3>
        <p class="section-subtitle">Monitor all payment activities and performance</p>
      </div>
      <div class="header-right">
        <q-btn 
          @click="refreshData" 
          :loading="loading"
          icon="refresh" 
          flat 
          round 
          color="lime"
          class="refresh-btn"
        >
          <q-tooltip>Refresh Data</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="stats-cards">
      <div class="stat-card" v-for="stat in quickStats" :key="stat.label">
        <div class="stat-icon" :style="{ background: stat.color }">
          <q-icon :name="stat.icon" color="white" size="sm" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-change" :class="stat.trend">
            <q-icon :name="stat.trend === 'positive' ? 'trending_up' : 'trending_down'" size="xs" />
            {{ stat.change }}
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <q-card class="filters-card lime-glow">
      <div class="filters-content">
        <!-- Search -->
        <div class="search-section">
          <q-input
            v-model="filters.search"
            placeholder="Search transactions..."
            outlined
            dense
            class="search-input"
            @update:model-value="onSearchChange"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="lime" />
            </template>
            <template v-slot:append v-if="filters.search">
              <q-icon name="close" @click="filters.search = ''" class="cursor-pointer" />
            </template>
          </q-input>
        </div>

        <!-- Filter Controls -->
        <div class="filter-controls">
          <div class="filter-group">
            <q-select
              v-model="filters.status"
              :options="statusOptions"
              label="Status"
              outlined
              dense
              clearable
              class="filter-select"
              @update:model-value="onFilterChange"
            />
          </div>
          
          <div class="filter-group">
            <q-select
              v-model="filters.method"
              :options="methodOptions"
              label="Payment Method"
              outlined
              dense
              clearable
              class="filter-select"
              @update:model-value="onFilterChange"
            />
          </div>
          
          <div class="filter-group">
            <q-input
              v-model="filters.dateRange"
              label="Date Range"
              outlined
              dense
              readonly
              class="filter-select"
              @click="showDatePicker = true"
            >
              <template v-slot:prepend>
                <q-icon name="event" color="lime" />
              </template>
            </q-input>
          </div>
          
          <div class="filter-group">
            <q-select
              v-model="filters.merchant"
              :options="merchantOptions"
              label="Merchant"
              outlined
              dense
              clearable
              class="filter-select"
              @update:model-value="onFilterChange"
            />
          </div>
        </div>

        <!-- Clear Filters -->
        <div class="clear-filters" v-if="hasActiveFilters">
          <q-btn 
            @click="clearFilters" 
            flat 
            color="lime" 
            icon="clear_all" 
            label="Clear Filters"
            size="sm"
          />
        </div>
      </div>
    </q-card>

    <!-- Transaction Table -->
    <q-card class="table-card lime-glow">
      <q-table
        :rows="transactions"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        flat
        bordered
        class="transaction-table"
        @request="onRequest"
      >
        <!-- Amount Column -->
        <template #body-cell-amount="props">
          <q-td :props="props">
            <div class="amount-cell">
              <span class="amount-value">{{ formatCurrency(props.value) }}</span>
              <q-chip 
                v-if="props.row.refunded" 
                size="xs" 
                color="orange" 
                text-color="white"
                label="Refunded"
              />
            </div>
          </q-td>
        </template>

        <!-- Status Column -->
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-chip 
              :color="getStatusColor(props.value)" 
              :text-color="getStatusTextColor(props.value)"
              :label="props.value"
              size="sm"
              class="status-chip"
            />
          </q-td>
        </template>

        <!-- Method Column -->
        <template #body-cell-method="props">
          <q-td :props="props">
            <div class="method-cell">
              <q-icon :name="getMethodIcon(props.value)" size="sm" :color="getMethodColor(props.value)" />
              <span class="method-text">{{ props.value }}</span>
            </div>
          </q-td>
        </template>

        <!-- Date Column -->
        <template #body-cell-created_at="props">
          <q-td :props="props">
            <div class="date-cell">
              <div class="date-value">{{ formatDate(props.value) }}</div>
              <div class="time-value">{{ formatTime(props.value) }}</div>
            </div>
          </q-td>
        </template>

        <!-- Actions Column -->
        <template #body-cell-actions="props">
          <q-td :props="props">
            <div class="actions-cell">
              <q-btn
                @click="viewDetails(props.row)"
                flat
                round
                size="sm"
                color="lime"
                icon="visibility"
              >
                <q-tooltip>View Details</q-tooltip>
              </q-btn>
              
              <q-btn
                v-if="props.row.status === 'completed' && !props.row.refunded"
                @click="initiateRefund(props.row)"
                flat
                round
                size="sm"
                color="orange"
                icon="money_off"
              >
                <q-tooltip>Refund</q-tooltip>
              </q-btn>
              
              <q-btn
                @click="downloadReceipt(props.row)"
                flat
                round
                size="sm"
                color="blue"
                icon="download"
              >
                <q-tooltip>Download Receipt</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>

        <!-- Empty State -->
        <template #no-data>
          <div class="empty-state">
            <q-icon name="receipt_long" size="64px" color="grey-6" />
            <div class="empty-text">No transactions found</div>
            <div class="empty-subtext">Try adjusting your filters or search terms</div>
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Date Range Picker Dialog -->
    <q-dialog v-model="showDatePicker" persistent>
      <q-card class="date-picker-card">
        <q-card-section class="row items-center">
          <div class="text-h6">Select Date Range</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="dateRange.start"
                label="Start Date"
                outlined
                dense
                type="date"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="dateRange.end"
                label="End Date"
                outlined
                dense
                type="date"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="lime" label="Apply" @click="applyDateRange" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Transaction Detail Modal -->
    <TransactionDetailModal
      v-model="showDetailModal"
      :transaction="selectedTransaction"
      @refund="handleRefund"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Notify } from 'quasar'
import api from '../../boot/axios'
import TransactionDetailModal from './TransactionDetailModal.vue'

// Reactive data
const loading = ref(false)
const transactions = ref([])
const showDatePicker = ref(false)
const showDetailModal = ref(false)
const selectedTransaction = ref(null)

// Filters
const filters = ref({
  search: '',
  status: null,
  method: null,
  merchant: null,
  dateRange: ''
})

const dateRange = ref({
  start: '',
  end: ''
})

// Pagination
const pagination = ref({
  sortBy: 'created_at',
  descending: true,
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0
})

// Options
const statusOptions = [
  { label: 'Completed', value: 'completed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
  { label: 'Refunded', value: 'refunded' },
  { label: 'Cancelled', value: 'cancelled' }
]

const methodOptions = [
  { label: 'Credit Card', value: 'card' },
  { label: 'Apple Pay', value: 'apple_pay' },
  { label: 'Google Pay', value: 'google_pay' },
  { label: 'PayPal', value: 'paypal' },
  { label: 'Bank Transfer', value: 'bank_transfer' }
]

const merchantOptions = ref([])

// Table columns
const columns = [
  {
    name: 'id',
    label: 'Transaction ID',
    field: 'id',
    sortable: true,
    align: 'left',
    style: 'font-family: monospace; font-size: 0.875rem;'
  },
  {
    name: 'amount',
    label: 'Amount',
    field: 'amount',
    sortable: true,
    align: 'right',
    style: 'font-weight: 600;'
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    sortable: true,
    align: 'center'
  },
  {
    name: 'method',
    label: 'Method',
    field: 'method',
    sortable: true,
    align: 'left'
  },
  {
    name: 'merchant',
    label: 'Merchant',
    field: row => row.merchant?.business_name || 'Unknown',
    sortable: true,
    align: 'left'
  },
  {
    name: 'customer',
    label: 'Customer',
    field: row => row.customer?.email || row.customer?.name || 'Anonymous',
    sortable: true,
    align: 'left'
  },
  {
    name: 'created_at',
    label: 'Date',
    field: 'created_at',
    sortable: true,
    align: 'left'
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center',
    sortable: false
  }
]

// Computed properties
const hasActiveFilters = computed(() => {
  return filters.value.search || 
         filters.value.status || 
         filters.value.method || 
         filters.value.merchant || 
         filters.value.dateRange
})

const quickStats = computed(() => [
  {
    label: 'Total Transactions',
    value: pagination.value.rowsNumber.toLocaleString(),
    icon: 'receipt_long',
    color: 'linear-gradient(135deg, #bdf000, #a0d000)',
    change: '+12.5%',
    trend: 'positive'
  },
  {
    label: 'Revenue',
    value: formatCurrency(calculateTotalRevenue()),
    icon: 'attach_money',
    color: 'linear-gradient(135deg, #22c55e, #16a34a)',
    change: '+8.3%',
    trend: 'positive'
  },
  {
    label: 'Success Rate',
    value: calculateSuccessRate() + '%',
    icon: 'trending_up',
    color: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    change: '+2.1%',
    trend: 'positive'
  },
  {
    label: 'Chargebacks',
    value: calculateChargebacks(),
    icon: 'money_off',
    color: 'linear-gradient(135deg, #ef4444, #dc2626)',
    change: '-5.2%',
    trend: 'positive'
  }
])

// Methods
const fetchTransactions = async () => {
  try {
    loading.value = true
    
    const params = {
      page: pagination.value.page,
      per_page: pagination.value.rowsPerPage,
      sort_by: pagination.value.sortBy,
      sort_desc: pagination.value.descending,
      ...filters.value
    }
    
    const response = await api.get('/transactions', { params })
    
    transactions.value = response.data.transactions
    pagination.value.rowsNumber = response.data.total
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
    Notify.create({ type: 'negative', message: 'Failed to load transactions' })
  } finally {
    loading.value = false
  }
}

const fetchMerchants = async () => {
  try {
    const response = await api.get('/merchants')
    merchantOptions.value = response.data.map(merchant => ({
      label: merchant.business_name,
      value: merchant.id
    }))
  } catch (error) {
    console.error('Failed to fetch merchants:', error)
  }
}

const onRequest = (props) => {
  pagination.value = props.pagination
  fetchTransactions()
}

const onSearchChange = () => {
  pagination.value.page = 1
  fetchTransactions()
}

const onFilterChange = () => {
  pagination.value.page = 1
  fetchTransactions()
}

const clearFilters = () => {
  filters.value = {
    search: '',
    status: null,
    method: null,
    merchant: null,
    dateRange: ''
  }
  dateRange.value = { start: '', end: '' }
  pagination.value.page = 1
  fetchTransactions()
}

const applyDateRange = () => {
  if (dateRange.value.start && dateRange.value.end) {
    filters.value.dateRange = `${dateRange.value.start} to ${dateRange.value.end}`
  } else {
    filters.value.dateRange = ''
  }
  onFilterChange()
}

const viewDetails = (transaction) => {
  selectedTransaction.value = transaction
  showDetailModal.value = true
}

const initiateRefund = (transaction) => {
  selectedTransaction.value = transaction
  showDetailModal.value = true
  // The modal will handle the refund initiation
}

const downloadReceipt = async (transaction) => {
  try {
    const response = await api.get(`/transactions/${transaction.id}/receipt`, {
      responseType: 'blob'
    })
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `receipt-${transaction.id}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    
    Notify.create({ type: 'positive', message: 'Receipt downloaded successfully' })
  } catch (error) {
    Notify.create({ type: 'negative', message: 'Failed to download receipt' })
  }
}

const handleRefund = async (transactionId, amount) => {
  try {
    await api.post(`/transactions/${transactionId}/refund`, { amount })
    Notify.create({ type: 'positive', message: 'Refund initiated successfully' })
    fetchTransactions() // Refresh the table
  } catch (error) {
    Notify.create({ type: 'negative', message: 'Failed to initiate refund' })
  }
}

const refreshData = () => {
  fetchTransactions()
}

// Utility methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount / 100)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status) => {
  const colors = {
    completed: 'green',
    pending: 'orange',
    failed: 'red',
    refunded: 'blue',
    cancelled: 'grey'
  }
  return colors[status] || 'grey'
}

const getStatusTextColor = (status) => {
  return status === 'pending' ? 'black' : 'white'
}

const getMethodIcon = (method) => {
  const icons = {
    card: 'credit_card',
    apple_pay: 'phone_iphone',
    google_pay: 'android',
    paypal: 'payment',
    bank_transfer: 'account_balance'
  }
  return icons[method] || 'payment'
}

const getMethodColor = (method) => {
  const colors = {
    card: 'blue',
    apple_pay: 'black',
    google_pay: 'green',
    paypal: 'blue',
    bank_transfer: 'purple'
  }
  return colors[method] || 'grey'
}

// Calculation methods
const calculateTotalRevenue = () => {
  return transactions.value
    .filter(t => t.status === 'completed' && !t.refunded)
    .reduce((sum, t) => sum + t.amount, 0)
}

const calculateSuccessRate = () => {
  if (transactions.value.length === 0) return 0
  const completed = transactions.value.filter(t => t.status === 'completed').length
  return Math.round((completed / transactions.value.length) * 100)
}

const calculateChargebacks = () => {
  return transactions.value.filter(t => t.status === 'chargeback').length
}

// Lifecycle
onMounted(() => {
  fetchTransactions()
  fetchMerchants()
})

// Watch for filter changes
watch(filters, () => {
  if (!loading.value) {
    onFilterChange()
  }
}, { deep: true })
</script>

<style scoped>
.transaction-table-container {
  padding: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.section-title {
  color: #bdf000;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.section-subtitle {
  color: #a0a0a0;
  margin: 0;
  font-size: 0.875rem;
}

.refresh-btn {
  transition: transform 0.3s ease;
}

.refresh-btn:hover {
  transform: rotate(180deg);
}

/* Stats Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: linear-gradient(135deg, #000000 0%, #121018 100%);
  border: 1px solid rgba(189, 240, 0, 0.2);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: rgba(189, 240, 0, 0.4);
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.875rem;
  color: #a0a0a0;
  margin-bottom: 4px;
}

.stat-change {
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-change.positive {
  color: #22c55e;
}

.stat-change.negative {
  color: #ef4444;
}

/* Filters */
.filters-card {
  margin-bottom: 24px;
  background: linear-gradient(135deg, #000000 0%, #121018 100%);
}

.filters-content {
  padding: 20px;
}

.search-section {
  margin-bottom: 16px;
}

.search-input {
  max-width: 400px;
}

.search-input :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(189, 240, 0, 0.3);
  border-radius: 12px;
}

.search-input :deep(.q-field__control:hover) {
  border-color: rgba(189, 240, 0, 0.5);
}

.search-input :deep(input) {
  color: #ffffff;
}

.filter-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.filter-select {
  width: 100%;
}

.filter-select :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(189, 240, 0, 0.3);
  border-radius: 12px;
}

.filter-select :deep(.q-field__control:hover) {
  border-color: rgba(189, 240, 0, 0.5);
}

.filter-select :deep(input),
.filter-select :deep(.q-field__label) {
  color: #ffffff;
}

.clear-filters {
  text-align: right;
}

/* Table */
.table-card {
  background: linear-gradient(135deg, #000000 0%, #121018 100%);
}

.transaction-table {
  background: transparent;
}

.transaction-table :deep(.q-table__top) {
  background: transparent;
}

.transaction-table :deep(.q-table__bottom) {
  background: transparent;
}

.transaction-table :deep(.q-table thead th) {
  background: rgba(189, 240, 0, 0.1);
  color: #bdf000;
  font-weight: 600;
  border-bottom: 1px solid rgba(189, 240, 0, 0.2);
}

.transaction-table :deep(.q-table tbody tr) {
  background: rgba(255, 255, 255, 0.02);
  transition: background 0.3s ease;
}

.transaction-table :deep(.q-table tbody tr:hover) {
  background: rgba(189, 240, 0, 0.05);
}

.transaction-table :deep(.q-table tbody td) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

/* Cell Styles */
.amount-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.amount-value {
  font-weight: 600;
  color: #bdf000;
}

.method-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.method-text {
  font-size: 0.875rem;
}

.date-cell {
  display: flex;
  flex-direction: column;
}

.date-value {
  font-weight: 500;
}

.time-value {
  font-size: 0.75rem;
  color: #a0a0a0;
}

.actions-cell {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.status-chip {
  font-weight: 600;
  text-transform: capitalize;
}

/* Empty State */
.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #a0a0a0;
}

.empty-text {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 16px 0 8px 0;
}

.empty-subtext {
  font-size: 0.875rem;
}

/* Date Picker */
.date-picker-card {
  background: linear-gradient(135deg, #000000 0%, #121018 100%);
  color: #ffffff;
  border: 1px solid rgba(189, 240, 0, 0.2);
  border-radius: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .transaction-table-container {
    padding: 10px;
  }
  
  .table-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .filter-controls {
    grid-template-columns: 1fr;
  }
  
  .actions-cell {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
