<template>
  <div>
    <CompanySettingsHeader :title="CONSTANTS.title" :sub-title="CONSTANTS.subtitle" />
    <SIEMIntegrationDeleteDialog
      v-if="isShowDeleteDialog"
      :status="isShowDeleteDialog"
      :item="selectedRow"
      @on-close="toggleShowDeleteDialog"
      @on-delete="handleDeleteItem"
    />
    <SIEMIntegrationsAddOrEditModal
      v-if="isShowAddOrEditModal"
      :status="isShowAddOrEditModal"
      :selected-item="selectedRow"
      @on-close="toggleShowAddOrEditModal"
      @on-submit="handleSubmit"
    />
    <SIEMIntegrationsTable
      ref="refTable"
      :PERMISSIONS="permissions"
      @on-open-add-or-edit-modal="toggleShowAddOrEditModal"
      @on-delete="handleDeleteTableRowClick"
    />
  </div>
</template>

<script>
import SIEMIntegrationsTable from '@/components/Integrations/SIEMIntegrations/SIEMIntegrationsTable'
import SIEMIntegrationDeleteDialog from '@/components/Integrations/SIEMIntegrations/SIEMIntegrationDeleteDialog'
import SIEMIntegrationsAddOrEditModal from '@/components/Integrations/SIEMIntegrations/SIEMIntegrationsAddOrEditModal'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import { mapGetters } from 'vuex'
export default {
  name: 'SIEMIntegrations',
  components: {
    CompanySettingsHeader,
    SIEMIntegrationsAddOrEditModal,
    SIEMIntegrationDeleteDialog,
    SIEMIntegrationsTable
  },
  data() {
    return {
      CONSTANTS: {
        title: 'SIEM Settings',
        subtitle: 'Manage SIEM Integrations'
      },
      isShowDeleteDialog: false,
      isShowAddOrEditModal: false,
      selectedRow: null
    }
  },
  computed: {
    ...mapGetters({
      permissions: 'permissions/getSIEMIntegrationPermissions'
    })
  },
  methods: {
    callForData() {
      this.$refs.refTable.callForData()
    },
    toggleShowAddOrEditModal(row = null) {
      this.selectedRow = row
      this.isShowAddOrEditModal = !this.isShowAddOrEditModal
    },
    toggleShowDeleteDialog() {
      if (this.isShowDeleteDialog) {
        this.selectedRow = null
      }
      this.isShowDeleteDialog = !this.isShowDeleteDialog
    },
    handleDeleteTableRowClick(row) {
      this.selectedRow = row
      this.toggleShowDeleteDialog()
    },
    handleSubmit() {
      this.toggleShowAddOrEditModal()
      this.callForData()
    },
    handleDeleteItem() {
      this.toggleShowDeleteDialog()
      this.callForData()
    }
  }
}
</script>
