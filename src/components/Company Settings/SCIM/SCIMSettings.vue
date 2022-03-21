<template>
  <div class="scim-settings">
    <CompanySettingsHeader :title="CONSTANTS.title" :sub-title="CONSTANTS.subtitle" />
    <DeleteSCIMDialog
      v-if="isShowDeleteDialog"
      :status="isShowDeleteDialog"
      @on-close="toggleDeleteDialog"
    />
    <AddOrEditSCIMModal
      v-if="isShowAddOrEditModal"
      :status="isShowAddOrEditModal"
      :is-edit="isEdit"
      :selected-row="selectedRow"
      @on-close="toggleAddOrEditModal"
    />
    <SCIMSettingsTable
      :PERMISSIONS="PERMISSIONS"
      @on-add="toggleAddOrEditModal"
      @on-edit="toggleAddOrEditModal"
      @on-revoke="toggleRevokeDialog"
    />
  </div>
</template>

<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import SCIMSettingsTable from '@/components/Company Settings/SCIM/SCIMSettingsTable'
import AddOrEditSCIMModal from '@/components/Company Settings/SCIM/AddOrEditSCIMModal'
import DeleteSCIMDialog from '@/components/Company Settings/SCIM/DeleteSCIMDialog'
export default {
  name: 'SCIMSettings',
  components: { DeleteSCIMDialog, AddOrEditSCIMModal, SCIMSettingsTable, CompanySettingsHeader },
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
    toggleDeleteDialog() {
      if (this.isShowDeleteDialog) this.setSelectedRowToNull()
      this.isShowDeleteDialog = !this.isShowDeleteDialog
    },
    setSelectedRowToNull() {
      this.selectedRow = null
    },
    toggleRevokeDialog() {
      if (this.isShowRevokeDialog) this.setSelectedRowToNull()
      this.isShowRevokeDialog = !this.isShowRevokeDialog
    }
  }
}
</script>
