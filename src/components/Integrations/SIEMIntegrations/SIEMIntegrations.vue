<template>
  <div>
    <SIEMIntegrationDeleteDialog
      v-if="isShowDeleteDialog"
      :status="isShowDeleteDialog"
      :item="selectedRow"
    />
    <SIEMIntegrationsAddOrEditModal
      :selected-item="selectedRow"
      @on-close="toggleShowAddOrEditModal"
    />
    <SIEMIntegrationsTable @on-open-add-or-edit-modal="toggleShowAddOrEditModal" />
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
  data() {
    return {
      isShowDeleteDialog: false,
      selectedRow: null
    }
  },
  methods: {
    toggleShowAddOrEditModal(row = null) {
      this.selectedRow = row
      this.isShowAddOrEditModal = !this.isShowAddOrEditModal
    }
  }
}
</script>
