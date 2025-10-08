<template>
  <KContainer tabless class="campaign-manager">
    <CommonCampaignManagerCreateNewInstanceDialog
      v-if="isShowLaunchDialog"
      :status="isShowLaunchDialog"
      :resource-id="launchResourceId"
      @on-close="toggleShowLaunchDialog"
      @on-confirm="handleConfirmLaunchDialog"
    />
    <CommonCampaignManagerDeleteDialog
      v-if="isShowDeleteDialog"
      :status="isShowDeleteDialog"
      :item="selectedRow"
      :is-action-button-disabled="isDeleteDialogActionButtonDisabled"
      :is-multiple="isMultipleDelete"
      :user-count="multipleDeletedUserCount"
      @on-close="toggleShowDeleteDialog"
      @on-delete="handleOnDelete"
      @on-multiple-delete="handleOnMultipleDelete"
    />
    <CommonCampaignManagerPreviewDialog
      v-if="isShowPreviewDialog"
      :status="isShowPreviewDialog"
      :selected-row="selectedRow"
      :type="PREVIEW_DIALOG_TYPES.QUISHING"
      :api-func="getCampaignManagerPreview"
      @on-close="toggleShowPreviewDialog"
    />
    <QuishingCampaignManagerAddOrEditModal
      v-if="isShowAddOrEditCampaignManagerModal"
      ref="refCampaignModal"
      :status="isShowAddOrEditCampaignManagerModal"
      :is-edit="isEdit"
      :selected-row="selectedRow"
      :form-details="formDetails"
      :is-duplicate="isDuplicate"
      @on-close="toggleAddCampaignManagerModal"
      @on-submit="handleOnSubmit"
    />
    <QuishingCampaignManagerPrintoutAddOrEditModal
      v-if="isShowIndividualPrintoutTemplateModal"
      ref="refPrintoutCampaignModal"
      :status="isShowIndividualPrintoutTemplateModal"
      :is-edit="isEdit"
      :selected-row="selectedRow"
      :form-details="formDetails"
      :is-duplicate="isDuplicate"
      @on-close="toggleAddIndividualPrintoutCampaignModal"
      @on-submit="handleOnSubmitPrintout"
    />
    <QuishingCampaignManagerNewInstanceModal
      v-if="isShowNewInstanceModal"
      ref="refCampaignNewInstance"
      :status="isShowNewInstanceModal"
      :resourceId="instanceResourceId"
      :form-details="formDetails"
      :selected-row="selectedRow"
      @on-close="closeNewInstanceModal"
      @on-submit="handleOnSubmitNewInstance"
    />
    <QuishingCampaignManagerParentTable
      v-show="!isItemTableShowing && !isFrequencyTableShowing"
      ref="campaignManagerParentTable"
      :is-loading.sync="isParentTableLoading"
      :status-items="getStatusItems"
      @on-record-button-click="handleOnRecordButtonClick"
      @toggle-add-campaign-manager-modal="toggleAddCampaignManagerModal"
      @on-edit="handleItemOnEdit"
      @on-preview="handleItemOnPreview"
      @on-delete="handleItemOnDelete"
      @on-duplicate="handleItemOnDuplicate"
      @on-launch="handleLaunch"
      @on-multiple-delete="handleMultipleDelete"
      @on-add-individual-printout-campaign="toggleAddIndividualPrintoutCampaignModal"
    />
    <QuishingCampaignManagerItemTable
      v-if="selectedParentItem"
      v-show="isItemTableShowing && !isFrequencyTableShowing"
      ref="campaignManagerItemTable"
      :is-loading="isItemTableLoading"
      :item="selectedParentItem"
      :status-items="getStatusItems"
      :is-quishing-type-printout="isSelectedItemQuishingPrintout"
      @on-launch="handleLaunch"
      @on-preview="handleItemOnPreview"
      @on-back-click="handleOnBackClick"
      @on-record-button-click="handleItemTableRecordButtonClick"
      @toggle-add-campaign-manager-modal="toggleAddCampaignManagerModal"
    />
    <QuishingCampaignManagerFrequencyTable
      v-if="isFrequencyTableShowing"
      ref="campaignManagerFrequencyTable"
      :is-loading="isFrequencyTableShowing"
      :item="selectedInstanceItem"
      :status-items="getStatusItems"
      :parent-resource-id="selectedParentItem.resourceId"
      @on-launch="handleLaunch"
      @on-back-click="handleOnFrequencyBackClick"
      @toggle-add-campaign-manager-modal="toggleAddCampaignManagerModal"
    />
  </KContainer>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer.vue'
import QuishingService from '@/api/quishing'
import CommonCampaignManagerCreateNewInstanceDialog from '@/components/Common/CampaignManager/CommonCampaignManagerCreateNewInstanceDialog.vue'
import CommonCampaignManagerDeleteDialog from '@/components/Common/CampaignManager/CommonCampaignManagerDeleteDialog.vue'
import QuishingCampaignManagerParentTable from '@/components/QuishingCampaignManager/QuishingCampaignManagerParentTable.vue'
import QuishingCampaignManagerItemTable from '@/components/QuishingCampaignManager/QuishingCampaignManagerItemTable.vue'
import QuishingCampaignManagerFrequencyTable from '@/components/QuishingCampaignManager/QuishingCampaignManagerFrequencyTable.vue'
import CommonCampaignManagerPreviewDialog from '@/components/Common/CampaignManager/CommonCampaignManagerPreviewDialog.vue'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'
import QuishingCampaignManagerAddOrEditModal from '@/components/QuishingCampaignManager/QuishingCampaignManagerAddOrEditModal.vue'
import QuishingCampaignManagerNewInstanceModal from '@/components/QuishingCampaignManager/QuishingCampaignManagerNewInstanceModal.vue'
import { mapGetters } from 'vuex'
import QuishingCampaignManagerPrintoutAddOrEditModal from '@/components/QuishingCampaignManager/QuishingCampaignManagerPrintoutAddOrEditModal.vue'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
export default {
  name: 'QuishingCampaignManager',
  components: {
    QuishingCampaignManagerPrintoutAddOrEditModal,
    QuishingCampaignManagerAddOrEditModal,
    CommonCampaignManagerPreviewDialog,
    QuishingCampaignManagerFrequencyTable,
    QuishingCampaignManagerItemTable,
    QuishingCampaignManagerParentTable,
    CommonCampaignManagerDeleteDialog,
    CommonCampaignManagerCreateNewInstanceDialog,
    QuishingCampaignManagerNewInstanceModal,
    KContainer
  },
  data() {
    return {
      PREVIEW_DIALOG_TYPES,
      isShowIndividualPrintoutTemplateModal: false,
      selectedParentItem: null,
      selectedInstanceItem: null,
      instanceResourceId: '',
      selectedRow: null,
      isEdit: false,
      isShowLaunchDialog: false,
      launchResourceId: '',
      isShowDeleteDialog: false,
      isDeleteDialogActionButtonDisabled: false,
      isMultipleDelete: false,
      isShowPreviewDialog: false,
      multipleDeletedUserCount: 0,
      isShowAddOrEditCampaignManagerModal: false,
      isShowNewInstanceModal: false,
      isDuplicate: false,
      isParentTableLoading: false,
      isItemTableLoading: false,
      isItemTableShowing: false,
      isFrequencyTableShowing: false,
      multipleSystemUserPayload: {},
      formDetails: {}
    }
  },
  computed: {
    ...mapGetters({
      getQuishingCampaignManagerDeletePermissions:
        'permissions/getQuishingCampaignManagerParentDeletePermissions'
    }),
    getStatusItems() {
      return this.formDetails.status || []
    },
    isSelectedItemQuishingPrintout() {
      return (
        this.selectedParentItem?.templateType.toLowerCase() ===
        QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT.toLowerCase()
      )
    }
  },
  watch: {
    '$route.query': {
      handler: function (val) {
        if (val?.status === 'parent') {
          this.selectedParentItem = null
          this.selectedInstanceItem = null
          this.isItemTableShowing = false
          this.isFrequencyTableShowing = false
          this.$router.replace('/quishing-simulator/campaign-manager')
        }
      },
      deep: true,
      immediate: true
    }
  },
  beforeRouteLeave(to, from, next) {
    const { refCampaignModal } = this.$refs
    if (refCampaignModal && refCampaignModal.status) {
      refCampaignModal.closeOverlay()
      next(false)
    } else {
      next()
    }
  },
  created() {
    this.callForFormDetails()
  },
  methods: {
    getCampaignManagerPreview: QuishingService.getCampaignManagerPreview,
    callForFormDetails() {
      QuishingService.getCampaignManagerFormDetails().then((response) => {
        const {
          data: { data }
        } = response
        this.formDetails = data
      })
    },
    toggleShowLaunchDialog() {
      if (this.isShowLaunchDialog) this.launchResourceId = ''
      this.isShowLaunchDialog = !this.isShowLaunchDialog
    },
    handleConfirmLaunchDialog(resourceId) {
      this.instanceResourceId = resourceId
      this.toggleShowLaunchDialog()
      this.showNewInstanceModal()
    },
    toggleShowDeleteDialog() {
      if (this.isShowDeleteDialog) {
        this.selectedRow = null
        this.multipleSystemUserPayload = {}
        this.isMultipleDelete = false
      }
      this.isShowDeleteDialog = !this.isShowDeleteDialog
    },
    handleOnDelete(item = {}) {
      if (this.getQuishingCampaignManagerDeletePermissions) {
        this.setDeleteDialogActionButtonDisabled(true)
        QuishingService.deleteCampaign(item.resourceId)
          .then(() => {
            this.$refs?.campaignManagerParentTable?.$refs?.refTable?.unSelectRow(item)
            this.$refs?.campaignManagerParentTable?.$refs?.refTable?.changeServerSideSelectionCount(
              -1
            )
            this.$refs.campaignManagerParentTable.callForData()
          })
          .finally(() => {
            this.toggleShowDeleteDialog()
            this.setDeleteDialogActionButtonDisabled()
          })
      }
    },
    handleOnMultipleDelete() {
      this.setDeleteDialogActionButtonDisabled(true)
      QuishingService.deleteBulkCampaigns(this.multipleSystemUserPayload)
        .then(() => {
          this.$refs.campaignManagerParentTable.$refs.refTable.resetSelectableParams()
          this.$refs.campaignManagerParentTable.callForData()
          this.toggleShowDeleteDialog()
        })
        .finally(this.setDeleteDialogActionButtonDisabled)
    },
    setDeleteDialogActionButtonDisabled(flag = false) {
      this.isDeleteDialogActionButtonDisabled = flag
    },
    handleOnRecordButtonClick(row) {
      this.selectedParentItem = row
      if (this.$refs.campaignManagerItemTable) {
        this.$refs.campaignManagerItemTable.resetTable()
        this.$refs.campaignManagerItemTable.callForData()
      }
      this.toggleItemTableShowing()
    },
    toggleAddCampaignManagerModal() {
      if (this.isShowAddOrEditCampaignManagerModal) {
        this.selectedRow = null
        this.isEdit = false
        this.isDuplicate = false
      }
      this.isShowAddOrEditCampaignManagerModal = !this.isShowAddOrEditCampaignManagerModal
    },
    handleOnSubmit() {
      this.$refs.campaignManagerParentTable.callForData()
      this.toggleAddCampaignManagerModal()
    },
    handleOnSubmitPrintout() {
      this.$refs.campaignManagerParentTable.callForData()
      this.toggleAddIndividualPrintoutCampaignModal()
    },
    handleItemOnEdit(row) {
      this.selectedRow = row
      this.isEdit = true
      if (row?.templateType?.toLowerCase() === QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT) {
        return this.toggleAddIndividualPrintoutCampaignModal()
      }

      this.toggleAddCampaignManagerModal()
    },
    handleItemOnPreview(row) {
      this.selectedRow = this.selectedParentItem || row
      this.toggleShowPreviewDialog()
    },
    handleItemOnDelete(row) {
      this.selectedRow = row
      this.toggleShowDeleteDialog()
    },
    handleItemOnDuplicate(row) {
      this.selectedRow = row
      this.isDuplicate = true
      this.toggleAddCampaignManagerModal()
    },
    handleLaunch(row = {}) {
      this.launchResourceId = row.resourceId
      this.toggleShowLaunchDialog()
    },
    handleMultipleDelete(payload = {}, totalUserCount = 0) {
      this.multipleSystemUserPayload = payload
      this.multipleDeletedUserCount = totalUserCount
      this.isMultipleDelete = true
      this.toggleShowDeleteDialog()
    },
    toggleShowPreviewDialog() {
      if (this.isShowPreviewDialog) this.selectedRow = null
      this.isShowPreviewDialog = !this.isShowPreviewDialog
    },
    showNewInstanceModal() {
      this.isShowNewInstanceModal = true
    },
    closeNewInstanceModal() {
      this.instanceResourceId = ''
      this.isShowNewInstanceModal = false
    },
    handleOnSubmitNewInstance() {
      if (this.isItemTableShowing) {
        this.$refs.campaignManagerItemTable.callForData()
      }
      this.$refs.campaignManagerParentTable.callForData()
      this.closeNewInstanceModal()
    },
    handleOnBackClick() {
      if (this.$refs.campaignManagerParentTable) {
        this.$refs.campaignManagerParentTable.callForData()
      }
      this.toggleItemTableShowing()
    },
    toggleItemTableShowing() {
      this.isItemTableShowing = !this.isItemTableShowing
    },
    handleItemTableRecordButtonClick(row) {
      this.selectedInstanceItem = row
      this.toggleFrequencyTableShowing()
    },
    handleOnFrequencyBackClick() {
      if (this.$refs.campaignManagerItemTable) {
        this.$refs.campaignManagerItemTable.callForData()
      }
      this.toggleFrequencyTableShowing()
    },
    toggleFrequencyTableShowing() {
      this.isFrequencyTableShowing = !this.isFrequencyTableShowing
    },
    toggleAddIndividualPrintoutCampaignModal() {
      this.isShowIndividualPrintoutTemplateModal = !this.isShowIndividualPrintoutTemplateModal
    }
  }
}
</script>
