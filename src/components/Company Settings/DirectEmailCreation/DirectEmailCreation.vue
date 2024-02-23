<template>
  <div id="direct-email-creation">
    <NewDirectMicrosoftEmailCreation
      v-if="isShowDirectMicrosoftEmailCreationModal"
      :status="isShowDirectMicrosoftEmailCreationModal"
      :tenant-id="tenantId"
      :is-initial="isMicrosoftEmailCreationInitial"
      :is-edit="isEdit"
      :selected-row="selectedRow"
      @on-close="toggleNewDirectEmailCreationModal"
    />
    <DeleteDirectEmailCreationDialog
      v-if="isShowDeleteDirectEmailCreationDialog"
      :status="isShowDeleteDirectEmailCreationDialog"
      :selected-row="selectedRow"
      @on-close="toggleDeleteDirectEmailCreationDialog"
    />
    <CompanySettingsHeader
      :title="labels.DirectEmailCreationTitle"
      :sub-title="labels.DirectEmailCreationSubTitle"
    />
    <DirectEmailCreationTable
      ref="refTable"
      @on-add="toggleNewDirectEmailCreationModal"
      @on-edit="handleEditRowClick"
      @on-action-delete="handleDeleteRowClick"
    />
  </div>
</template>

<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import labels from '@/model/constants/labels'
import DirectEmailCreationTable from '@/components/Company Settings/DirectEmailCreation/DirectEmailCreationTable'
import NewDirectMicrosoftEmailCreation from '@/components/Company Settings/DirectEmailCreation/NewDirectMicrosoftEmailCreation'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import DeleteDirectEmailCreationDialog from '@/components/Company Settings/DirectEmailCreation/DeleteDirectEmailCreationDialog'
export default {
  name: 'DirectEmailCreation',
  components: {
    DeleteDirectEmailCreationDialog,
    NewDirectMicrosoftEmailCreation,
    DirectEmailCreationTable,
    CompanySettingsHeader
  },
  data() {
    return {
      labels,
      isEdit: false,
      isShowDirectMicrosoftEmailCreationModal: false,
      isShowDeleteDirectEmailCreationDialog: false,
      isMicrosoftEmailCreationInitial: true,
      selectedRow: null,
      tenantId: ''
    }
  },
  created() {
    this.checkUrlForMicrosoft()
  },
  methods: {
    checkUrlForMicrosoft() {
      const { query = {} } = this.$route
      const {
        tenant = '',
        state = '',
        error = '',
        error_description = '',
        error_subcode = ''
      } = query
      this.isMicrosoftEmailCreationInitial = !tenant
      const errorSubCodeMessage =
        error_subcode === 'cancel' ? labels.ErrorMicrosoftCreationMessage : ''
      const errorMessage = error && (error_description || errorSubCodeMessage)
      if (!this.isMicrosoftEmailCreationInitial || errorMessage) {
        if (errorMessage) {
          this.$store.dispatch('common/createSnackBar', {
            message: errorMessage,
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-alert-circle'
          })
          this.toggleNewDirectEmailCreationModal()
        } else {
          if (state) {
            const newUrl = Buffer.from(state, 'base64') + '?tenant=' + tenant
            window.location = newUrl
            return
          }
          this.tenantId = tenant
          this.toggleNewDirectEmailCreationModal()
          this.$router.replace('/company/company-settings')
        }
      }
    },
    toggleNewDirectEmailCreationModal(forceUpdate = false) {
      if (this.isShowDirectMicrosoftEmailCreationModal) {
        this.isMicrosoftEmailCreationInitial = true
        this.isEdit = false
        this.tenantId = ''
      }
      this.callForTableData(forceUpdate)
      this.isShowDirectMicrosoftEmailCreationModal = !this.isShowDirectMicrosoftEmailCreationModal
    },
    toggleDeleteDirectEmailCreationDialog(forceUpdate = false) {
      this.callForTableData(forceUpdate)
      this.isShowDeleteDirectEmailCreationDialog = !this.isShowDeleteDirectEmailCreationDialog
    },
    callForTableData(forceUpdate = false) {
      if (!forceUpdate) return
      this.$refs.refTable.callForData()
    },
    handleDeleteRowClick(row = null) {
      this.selectedRow = row
      this.toggleDeleteDirectEmailCreationDialog()
    },
    handleEditRowClick(row = null) {
      this.selectedRow = row
      this.isEdit = true
      this.isMicrosoftEmailCreationInitial = false
      this.toggleNewDirectEmailCreationModal()
    }
  }
}
</script>
