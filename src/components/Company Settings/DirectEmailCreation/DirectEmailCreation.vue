<template>
  <div id="direct-email-creation">
    <NewMicrosoft365DEC
      v-if="isShowMicrosoft365DECCreationModal"
      :status="isShowMicrosoft365DECCreationModal"
      :tenant-id="tenantId"
      :is-initial="isMicrosoftEmailCreationInitial"
      :is-edit="isEdit"
      :selected-row="selectedRow"
      @on-close="toggleNewMicrosoft365DECModal"
    />
    <NewGoogleWorkspaceDEC
      v-if="isShowGoogleWorkspaceDECCreationModal"
      :status="isShowGoogleWorkspaceDECCreationModal"
      :is-edit="isEdit"
      :selected-row="selectedRow"
      @on-close="toggleNewGoogleWorkspaceDECModal"
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
      @on-add-microsoft-365="toggleNewMicrosoft365DECModal"
      @on-add-google-workspace="toggleNewGoogleWorkspaceDECModal"
      @on-edit="handleEditRowClick"
      @on-action-delete="handleDeleteRowClick"
    />
  </div>
</template>

<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import labels from '@/model/constants/labels'
import DirectEmailCreationTable from '@/components/Company Settings/DirectEmailCreation/DirectEmailCreationTable'
import NewMicrosoft365DEC from '@/components/Company Settings/DirectEmailCreation/NewMicrosoft365DEC'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import DeleteDirectEmailCreationDialog from '@/components/Company Settings/DirectEmailCreation/DeleteDirectEmailCreationDialog'
import { DEC_PLATFORMS } from '@/components/Company Settings/DirectEmailCreation/utils'
import NewGoogleWorkspaceDEC from '@/components/Company Settings/DirectEmailCreation/NewGoogleWorkspaceDEC'
export default {
  name: 'DirectEmailCreation',
  components: {
    DeleteDirectEmailCreationDialog,
    NewMicrosoft365DEC,
    DirectEmailCreationTable,
    CompanySettingsHeader,
    NewGoogleWorkspaceDEC
  },
  data() {
    return {
      labels,
      isEdit: false,
      isShowMicrosoft365DECCreationModal: false,
      isShowGoogleWorkspaceDECCreationModal: false,
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
      const { tenant = '', error = '', error_description = '', error_subcode = '' } = query
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
          this.toggleNewMicrosoft365DECModal()
        } else {
          this.tenantId = tenant
          this.toggleNewMicrosoft365DECModal()
          this.$router.replace('/company/company-settings')
        }
      }
    },
    toggleNewMicrosoft365DECModal(forceUpdate = false) {
      if (this.isShowMicrosoft365DECCreationModal) {
        this.isMicrosoftEmailCreationInitial = true
        this.isEdit = false
        this.tenantId = ''
      }
      this.callForTableData(forceUpdate)
      this.isShowMicrosoft365DECCreationModal = !this.isShowMicrosoft365DECCreationModal
    },
    toggleNewGoogleWorkspaceDECModal(forceUpdate = false) {
      if (this.isShowGoogleWorkspaceDECCreationModal) {
        this.isEdit = false
      }
      this.callForTableData(forceUpdate)
      this.isShowGoogleWorkspaceDECCreationModal = !this.isShowGoogleWorkspaceDECCreationModal
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
      if (row.type === DEC_PLATFORMS.MICROSOFT_365) {
        this.isMicrosoftEmailCreationInitial = false
        this.toggleNewMicrosoft365DECModal()
      }
      if (row.type === DEC_PLATFORMS.GOOGLE_WORKSPACE) {
        this.toggleNewGoogleWorkspaceDECModal()
      }
    }
  }
}
</script>
