<template>
  <q-layout view="lHh Lpr lFf">
    <AdminHeader />
    <q-page-container>
      <q-page class="admin-activity-page">
        <div class="breadcrumb-section q-pa-md">
          <q-breadcrumbs class="text-grey-6">
            <q-breadcrumbs-el icon="admin_panel_settings" label="Admin" />
            <q-breadcrumbs-el icon="timeline" label="Activity" />
          </q-breadcrumbs>
        </div>
        <div class="admin-content">
          <q-card class="lime-glow">
            <q-card-section>
              <div class="text-h6 text-lime">Activity Log</div>
              <div class="text-caption text-grey-6 q-mb-lg">View system activity and audit logs</div>
              <div class="text-center q-pa-xl">
                <q-icon name="timeline" size="64px" color="lime" class="q-mb-md" />
                <div class="text-h6">Activity Page</div>
                <div class="text-caption text-grey-6">This page is under development</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import AdminHeader from '../components/navigation/AdminHeader.vue'
</script>

<style scoped>
.admin-activity-page {
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
.text-lime {
  color: #bdf000;
}
.text-grey-6 {
  color: #999;
}
</style>