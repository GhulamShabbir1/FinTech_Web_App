<template>
  <div class="merchant-management">
    <!-- Header with actions -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <div class="text-h6 text-lime">Merchant Management</div>
        <div class="text-caption text-grey-6">Manage merchant registrations and approvals</div>
      </div>
      <div class="col-auto">
        <q-btn color="lime" icon="add" label="Add Merchant" @click="showAddDialog = true" />
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card lime-glow">
          <q-card-section class="text-center">
            <div class="text-h4 text-lime">{{ stats.total }}</div>
            <div class="text-caption">Total Merchants</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card lime-glow">
          <q-card-section class="text-center">
            <div class="text-h4 text-orange">{{ stats.pending }}</div>
            <div class="text-caption">Pending Approval</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card lime-glow">
          <q-card-section class="text-center">
            <div class="text-h4 text-green">{{ stats.verified }}</div>
            <div class="text-caption">Verified</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card lime-glow">
          <q-card-section class="text-center">
            <div class="text-h4 text-red">{{ stats.rejected }}</div>
            <div class="text-caption">Rejected</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Filters and Search -->
    <q-card class="q-mb-md lime-glow">
      <q-card-section>
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-md-4">
            <q-input
              v-model="filters.search"
              placeholder="Search merchants..."
              dense
              outlined
              clearable
              @update:model-value="onSearch"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filters.status"
              :options="statusOptions"
              label="Status"
              dense
              outlined
              clearable
              @update:model-value="onFilter"
            />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filters.sortBy"
              :options="sortOptions"
              label="Sort By"
              dense
              outlined
              @update:model-value="onSort"
            />
          </div>
          <div class="col-12 col-md-2">
            <q-btn
              color="grey"
              icon="refresh"
              label="Refresh"
              @click="loadMerchants"
              :loading="loading"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Merchants Table -->
    <q-card class="lime-glow">
      <q-card-section>
        <q-table
          :rows="merchants"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
          row-key="id"
          @request="onRequest"
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
              <div class="row q-gutter-xs">
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
                
                <q-btn
                  v-if="props.row.status === 'Pending'"
                  flat
                  round
                  dense
                  icon="check"
                  color="green"
                  @click="approveMerchant(props.row)"
                  size="sm"
                >
                  <q-tooltip>Approve</q-tooltip>
                </q-btn>
                
                <q-btn
                  v-if="props.row.status === 'Pending'"
                  flat
                  round
                  dense
                  icon="close"
                  color="red"
                  @click="rejectMerchant(props.row)"
                  size="sm"
                >
                  <q-tooltip>Reject</q-tooltip>
                </q-btn>
                
                <q-btn
                  flat
                  round
                  dense
                  icon="more_vert"
                  color="grey"
                  @click="showMerchantMenu(props.row, $event)"
                  size="sm"
                >
                  <q-tooltip>More Actions</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>

          <!-- Logo Column -->
          <template v-slot:body-cell-logo="props">
            <q-td :props="props">
              <q-avatar size="32px" square>
                <img :src="props.value || 'https://placehold.co/32x32/121018/bdf000?text=M'" />
              </q-avatar>
            </q-td>
          </template>

          <!-- Registration Date Column -->
          <template v-slot:body-cell-created_at="props">
            <q-td :props="props">
              {{ formatDate(props.value) }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Merchant Detail Dialog -->
    <q-dialog v-model="showDetailDialog" maximized>
      <q-card class="merchant-detail-dialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Merchant Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedMerchant">
          <div class="row q-col-gutter-lg">
            <!-- Basic Info -->
            <div class="col-12 col-md-6">
              <q-card class="q-pa-md">
                <div class="text-subtitle1 q-mb-md">Basic Information</div>
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <div class="text-caption">Business Name</div>
                    <div class="text-body1">{{ selectedMerchant.business_name }}</div>
                  </div>
                  <div class="col-12">
                    <div class="text-caption">Email</div>
                    <div class="text-body1">{{ selectedMerchant.email }}</div>
                  </div>
                  <div class="col-12">
                    <div class="text-caption">Website</div>
                    <div class="text-body1">{{ selectedMerchant.website || 'N/A' }}</div>
                  </div>
                  <div class="col-12">
                    <div class="text-caption">Status</div>
                    <q-chip
                      :color="getStatusColor(selectedMerchant.status)"
                      text-color="white"
                      :icon="getStatusIcon(selectedMerchant.status)"
                    >
                      {{ selectedMerchant.status }}
                    </q-chip>
                  </div>
                </div>
              </q-card>
            </div>

            <!-- Bank Details -->
            <div class="col-12 col-md-6">
              <q-card class="q-pa-md">
                <div class="text-subtitle1 q-mb-md">Bank Information</div>
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <div class="text-caption">Account Number</div>
                    <div class="text-body1">{{ selectedMerchant.bank_account_number || 'N/A' }}</div>
                  </div>
                  <div class="col-12">
                    <div class="text-caption">IFSC/SWIFT</div>
                    <div class="text-body1">{{ selectedMerchant.bank_ifsc_swift || 'N/A' }}</div>
                  </div>
                  <div class="col-12">
                    <div class="text-caption">Bank Name</div>
                    <div class="text-body1">{{ selectedMerchant.bank_name || 'N/A' }}</div>
                  </div>
                </div>
              </q-card>
            </div>

            <!-- Documents -->
            <div class="col-12">
              <q-card class="q-pa-md">
                <div class="text-subtitle1 q-mb-md">Documents</div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-4" v-if="selectedMerchant.business_license">
                    <q-card flat bordered>
                      <q-card-section class="text-center">
                        <q-icon name="description" size="48px" color="lime" />
                        <div class="text-subtitle2 q-mt-sm">Business License</div>
                        <q-btn flat color="lime" label="View" @click="viewDocument(selectedMerchant.business_license)" />
                      </q-card-section>
                    </q-card>
                  </div>
                  <div class="col-12 col-md-4" v-if="selectedMerchant.id_proof">
                    <q-card flat bordered>
                      <q-card-section class="text-center">
                        <q-icon name="badge" size="48px" color="lime" />
                        <div class="text-subtitle2 q-mt-sm">ID Proof</div>
                        <q-btn flat color="lime" label="View" @click="viewDocument(selectedMerchant.id_proof)" />
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </q-card>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" v-close-popup />
          <q-btn
            v-if="selectedMerchant.status === 'Pending'"
            color="green"
            label="Approve"
            @click="approveMerchant(selectedMerchant)"
          />
          <q-btn
            v-if="selectedMerchant.status === 'Pending'"
            color="red"
            label="Reject"
            @click="rejectMerchant(selectedMerchant)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Merchant Menu -->
    <q-menu ref="merchantMenu">
      <q-list style="min-width: 150px">
        <q-item clickable v-close-popup @click="viewMerchant(menuMerchant)">
          <q-item-section avatar>
            <q-icon name="visibility" />
          </q-item-section>
          <q-item-section>View Details</q-item-section>
        </q-item>
        
        <q-item clickable v-close-popup @click="editMerchant(menuMerchant)">
          <q-item-section avatar>
            <q-icon name="edit" />
          </q-item-section>
          <q-item-section>Edit</q-item-section>
        </q-item>
        
        <q-item clickable v-close-popup @click="suspendMerchant(menuMerchant)">
          <q-item-section avatar>
            <q-icon name="block" />
          </q-item-section>
          <q-item-section>Suspend</q-item-section>
        </q-item>
        
        <q-separator />
        
        <q-item clickable v-close-popup @click="deleteMerchant(menuMerchant)">
          <q-item-section avatar>
            <q-icon name="delete" color="red" />
          </q-item-section>
          <q-item-section class="text-red">Delete</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import api from '../../boot/axios'

const $q = useQuasar()

// Reactive data
const loading = ref(false)
const merchants = ref([])
const selectedMerchant = ref(null)
const menuMerchant = ref(null)
const showDetailDialog = ref(false)
const showAddDialog = ref(false)

// Filters and pagination
const filters = ref({
  search: '',
  status: null,
  sortBy: 'created_at'
})

const pagination = ref({
  sortBy: 'created_at',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

// Stats
const stats = ref({
  total: 0,
  pending: 0,
  verified: 0,
  rejected: 0
})

// Options
const statusOptions = [
  { label: 'All', value: null },
  { label: 'Pending', value: 'pending' },
  { label: 'Verified', value: 'verified' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Suspended', value: 'suspended' }
]

const sortOptions = [
  { label: 'Registration Date', value: 'created_at' },
  { label: 'Business Name', value: 'business_name' },
  { label: 'Status', value: 'status' },
  { label: 'Email', value: 'email' }
]

// Table columns
const columns = [
  {
    name: 'logo',
    label: 'Logo',
    field: 'logo_url',
    align: 'center',
    sortable: false
  },
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
const loadMerchants = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.value.page,
      limit: pagination.value.rowsPerPage,
      sortBy: pagination.value.sortBy,
      descending: pagination.value.descending,
      search: filters.value.search,
      status: filters.value.status
    }
    
    const response = await api.get('/admin/merchants', { params })
    merchants.value = response.data.merchants
    pagination.value.rowsNumber = response.data.total
    
    // Update stats
    stats.value = response.data.stats
  } catch (error) {
    console.error('Failed to load merchants:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to load merchants'
    })
  } finally {
    loading.value = false
  }
}

const onRequest = (props) => {
  pagination.value = props.pagination
  loadMerchants()
}

const onSearch = () => {
  pagination.value.page = 1
  loadMerchants()
}

const onFilter = () => {
  pagination.value.page = 1
  loadMerchants()
}

const onSort = () => {
  pagination.value.sortBy = filters.value.sortBy
  loadMerchants()
}

const viewMerchant = (merchant) => {
  selectedMerchant.value = merchant
  showDetailDialog.value = true
}

const approveMerchant = async (merchant) => {
  try {
    await api.post(`/admin/merchants/${merchant.id}/approve`)
    $q.notify({
      type: 'positive',
      message: 'Merchant approved successfully'
    })
    loadMerchants()
    showDetailDialog.value = false
  } catch (error) {
    console.error('Failed to approve merchant:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to approve merchant'
    })
  }
}

const rejectMerchant = async (merchant) => {
  $q.dialog({
    title: 'Reject Merchant',
    message: 'Are you sure you want to reject this merchant?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.post(`/admin/merchants/${merchant.id}/reject`)
      $q.notify({
        type: 'positive',
        message: 'Merchant rejected'
      })
      loadMerchants()
      showDetailDialog.value = false
    } catch (error) {
      console.error('Failed to reject merchant:', error)
      $q.notify({
        type: 'negative',
        message: 'Failed to reject merchant'
      })
    }
  })
}

const showMerchantMenu = (merchant, event) => {
  menuMerchant.value = merchant
  $refs.merchantMenu.show(event)
}

const editMerchant = (merchant) => {
  // Implement edit functionality
  console.log('Edit merchant:', merchant)
}

const suspendMerchant = async (merchant) => {
  try {
    await api.post(`/admin/merchants/${merchant.id}/suspend`)
    $q.notify({
      type: 'positive',
      message: 'Merchant suspended'
    })
    loadMerchants()
  } catch (error) {
    console.error('Failed to suspend merchant:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to suspend merchant'
    })
  }
}

const deleteMerchant = async (merchant) => {
  $q.dialog({
    title: 'Delete Merchant',
    message: 'Are you sure you want to delete this merchant? This action cannot be undone.',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/admin/merchants/${merchant.id}`)
      $q.notify({
        type: 'positive',
        message: 'Merchant deleted'
      })
      loadMerchants()
    } catch (error) {
      console.error('Failed to delete merchant:', error)
      $q.notify({
        type: 'negative',
        message: 'Failed to delete merchant'
      })
    }
  })
}

const viewDocument = (url) => {
  window.open(url, '_blank')
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

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

// Initialize
onMounted(() => {
  loadMerchants()
})
</script>

<style scoped>
.merchant-management {
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

.merchant-table {
  background: transparent;
}

.merchant-detail-dialog {
  background: #0a0a0a;
  color: #fff;
}

.text-lime {
  color: #bdf000;
}

.text-grey-6 {
  color: #999;
}
</style>