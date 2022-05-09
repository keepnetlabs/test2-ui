<template>
  <div>
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
      :PERMISSIONS="PERMISSIONS"
      @on-open-add-or-edit-modal="toggleShowAddOrEditModal"
      @on-delete="handleDeleteTableRowClick"
    />
  </div>
</template>

<script>
import SIEMIntegrationsTable from '@/components/Integrations/SIEMIntegrations/SIEMIntegrationsTable'
import SIEMIntegrationDeleteDialog from '@/components/Integrations/SIEMIntegrations/SIEMIntegrationDeleteDialog'
import SIEMIntegrationsAddOrEditModal from '@/components/Integrations/SIEMIntegrations/SIEMIntegrationsAddOrEditModal'
export default {
  name: 'SIEMIntegrations',
  components: {
    SIEMIntegrationsAddOrEditModal,
    SIEMIntegrationDeleteDialog,
    SIEMIntegrationsTable
  },
  props: {
    PERMISSIONS: {
      type: Object
    }
  },
  data() {
    return {
      isShowDeleteDialog: false,
      isShowAddOrEditModal: false,
      selectedRow: null
    }
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
