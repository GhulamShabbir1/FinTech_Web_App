<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Admin Header -->
    <AdminHeader />
    
    <!-- Page Content -->
    <q-page-container>
      <q-page class="admin-merchants-page">
        <!-- Breadcrumb -->
        <div class="breadcrumb-section q-pa-md">
          <q-breadcrumbs class="text-grey-6">
            <q-breadcrumbs-el icon="admin_panel_settings" label="Admin" />
            <q-breadcrumbs-el icon="store" label="Merchants" />
          </q-breadcrumbs>
        </div>

        <!-- Main Content -->
        <div class="admin-content">
          <MerchantManagement />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import AdminHeader from '../components/navigation/AdminHeader.vue'
import MerchantManagement from '../components/admin/MerchantManagement.vue'
</script>

<style scoped>
.admin-merchants-page {
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
</style>