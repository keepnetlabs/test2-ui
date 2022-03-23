<template>
  <div class="scim-settings">
    <CompanySettingsHeader :title="CONSTANTS.title" :sub-title="CONSTANTS.subtitle" />
    <DeleteSCIMDialog
      v-if="isShowDeleteDialog"
      :status="isShowDeleteDialog"
      :selected-row="selectedRow"
      @on-close="toggleDeleteDialog"
    />
    <RevokeSCIMDialog
      v-if="isShowRevokeDialog"
      :status="isShowRevokeDialog"
      :selected-row="selectedRow"
      @on-close="toggleRevokeDialog"
    />
    <AddOrEditSCIMModal
      v-if="isShowAddOrEditModal"
      :status="isShowAddOrEditModal"
      :is-edit="isEdit"
      :selected-row="selectedRow"
      @on-close="toggleAddOrEditModal"
      @on-close-with-update="handleCloseWithUpdate"
    />
    <SCIMSettingsTable
      ref="refTable"
      :PERMISSIONS="PERMISSIONS"
      @on-add="toggleAddOrEditModal"
      @on-edit="toggleAddOrEditModal"
      @on-revoke="toggleRevokeDialog"
      @on-delete="toggleDeleteDialog"
    />
  </div>
</template>

<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import SCIMSettingsTable from '@/components/Company Settings/SCIM/SCIMSettingsTable'
import AddOrEditSCIMModal from '@/components/Company Settings/SCIM/AddOrEditSCIMModal'
import DeleteSCIMDialog from '@/components/Company Settings/SCIM/DeleteSCIMDialog'
import RevokeSCIMDialog from '@/components/Company Settings/SCIM/RevokeSCIMDialog'
export default {
  name: 'SCIMSettings',
  components: {
    RevokeSCIMDialog,
    DeleteSCIMDialog,
    AddOrEditSCIMModal,
    SCIMSettingsTable,
    CompanySettingsHeader
  },
  props: {
    PERMISSIONS: {
      type: Object
    }
  },
  data() {
    return {
      CONSTANTS: {
        title: 'SCIM Settings',
        subtitle: 'Manage SCIM Integrations'
      },
      isShowAddOrEditModal: false,
      isShowDeleteDialog: false,
      isShowRevokeDialog: false,
      selectedRow: null,
      isEdit: false
    }
  },
  methods: {
    toggleAddOrEditModal(row) {
      if (row) {
        this.selectedRow = row
        this.isEdit = true
      }
      if (this.isShowAddOrEditModal) {
        this.setSelectedRowToNull()
        this.isEdit = false
      }
      this.isShowAddOrEditModal = !this.isShowAddOrEditModal
    },
    toggleDeleteDialog(row) {
      if (row) this.selectedRow = row
      if (this.isShowDeleteDialog) this.setSelectedRowToNull()
      this.isShowDeleteDialog = !this.isShowDeleteDialog
    },
    setSelectedRowToNull() {
      this.selectedRow = null
    },
    toggleRevokeDialog(row) {
      if (row) this.selectedRow = row
      if (this.isShowRevokeDialog) this.setSelectedRowToNull()
      this.isShowRevokeDialog = !this.isShowRevokeDialog
    },
    handleCloseWithUpdate() {
      this.$refs.refTable.callForData()
      this.toggleAddOrEditModal()
    }
  }
}
</script>
