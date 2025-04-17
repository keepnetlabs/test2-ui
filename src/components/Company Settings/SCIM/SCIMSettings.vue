<template>
  <div class="scim-settings">
    <CompanySettingsHeader :title="CONSTANTS.title" :sub-title="CONSTANTS.subtitle" />
    <SCIMSuccessDialog
      v-if="isShowSuccessDialog"
      :status="isShowSuccessDialog"
      :api-key="successApiKey"
      :title="successDialogTitle"
      @on-close="handleCloseSuccessDialog"
    />
    <DeleteSCIMDialog
      v-if="isShowDeleteDialog"
      :status="isShowDeleteDialog"
      :selected-row="selectedRow"
      @on-close="toggleDeleteDialog"
      @on-close-with-update="handleCloseWithUpdate"
    />
    <RevokeSCIMDialog
      v-if="isShowRevokeDialog"
      :status="isShowRevokeDialog"
      :selected-row="selectedRow"
      @on-close="toggleRevokeDialog"
      @on-success-revoke="handleSuccessRevoke"
    />
    <AddOrEditSCIMModal
      v-if="isShowAddOrEditModal"
      ref="refScimAddOrEditModal"
      :status="isShowAddOrEditModal"
      :is-edit="isEdit"
      :selected-row="selectedRow"
      @on-success-create="handleSuccessCreate"
      @on-close="toggleAddOrEditModal"
      @on-close-with-update="handleCloseWithUpdate"
    />
    <SCIMSettingsTable
      ref="refTable"
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
import SCIMSuccessDialog from '@/components/Company Settings/SCIM/SCIMSuccessDialog'
export default {
  name: 'SCIMSettings',
  components: {
    SCIMSuccessDialog,
    RevokeSCIMDialog,
    DeleteSCIMDialog,
    AddOrEditSCIMModal,
    SCIMSettingsTable,
    CompanySettingsHeader
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
      isShowSuccessDialog: false,
      successApiKey: '',
      successDialogTitle: 'Successfully created SCIM Integration',
      selectedRow: null,
      isEdit: false
    }
  },
  watch: {
    '$route.query': {
      deep: true,
      handler(val) {
        if (val?.showModal) {
          this.toggleAddOrEditModal()
          this.$router.replace('/company/company-settings')
        }
      }
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
    handleCloseWithUpdate(row) {
      this.$refs.refTable.$refs.refTable.unSelectRow(row)
      this.$refs.refTable.callForData()
    },
    handleCloseSuccessDialog() {
      this.successApiKey = ''
      this.isShowSuccessDialog = false
      if (this.isShowAddOrEditModal) {
        this.isShowAddOrEditModal = false
        this.handleCloseWithUpdate()
      }
    },
    handleSuccessCreate(key) {
      this.successDialogTitle = 'Successfully created SCIM Integration'
      this.successApiKey = key
      this.isShowSuccessDialog = true
    },
    handleSuccessRevoke(key) {
      this.successDialogTitle = 'Successfully revoked SCIM Integration'
      this.successApiKey = key
      this.isShowSuccessDialog = true
    },
    checkIfCanCloseScimAddOrEditModal() {
      if (this?.$refs?.refScimAddOrEditModal) this.$refs.refScimAddOrEditModal.handleClose()
    }
  }
}
</script>
