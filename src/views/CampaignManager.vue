<template>
  <KContainer tabless class="campaign-manager">
    <CommonCampaignManagerCreateNewInstanceDialog
      v-if="isShowLaunchDialog"
      :status="isShowLaunchDialog"
      :resource-id="launchResourceId"
      @on-close="toggleShowLaunchDialog"
      @on-confirm="handleConfirmLaunchDialog"
    />
    <CommonCampaignManagerCancelCampaignDialog
      v-if="isShowStopDialog"
      :status="isShowStopDialog"
      :is-action-button-disabled="isStopDialogActionButtonDisabled"
      :item="startStopCampaignPayload"
      @on-close="toggleStopCampaignDialog"
      @on-confirm="handleStopCampaign"
    />
    <CommonCampaignManagerLaunchCampaignDialog
      v-if="isShowStartDialog"
      :status="isShowStartDialog"
      :item="startStopCampaignPayload"
      :is-action-button-disabled="isStartDialogActionButtonDisabled"
      @on-close="toggleStartCampaignDialog"
      @on-confirm="handleStartCampaign"
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
      @on-close="toggleShowPreviewDialog"
    />
    <CampaignManagerAddOrEditModal
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
    <CampaignManagerNewInstanceModal
      v-if="isShowNewInstanceModal"
      ref="refCampaignNewInstance"
      :status="isShowNewInstanceModal"
      :resourceId="instanceResourceId"
      :form-details="formDetails"
      :selected-row="selectedRow"
      @on-close="closeNewInstanceModal"
      @on-submit="handleOnSubmitNewInstance"
    />
    <CampaignManagerParentTable
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
    />
    <CampaignManagerItemTable
      v-if="selectedParentItem"
      v-show="isItemTableShowing && !isFrequencyTableShowing"
      ref="campaignManagerItemTable"
      :is-loading="isItemTableLoading"
      :item="selectedParentItem"
      :status-items="getStatusItems"
      @on-stop="handleStop"
      @on-start="handleStart"
      @on-launch="handleLaunch"
      @on-back-click="handleOnBackClick"
      @on-record-button-click="handleItemTableRecordButtonClick"
      @toggle-add-campaign-manager-modal="toggleAddCampaignManagerModal"
    />
    <CampaignManagerFrequencyTable
      v-if="isFrequencyTableShowing"
      ref="campaignManagerFrequencyTable"
      :is-loading="isFrequencyTableShowing"
      :item="selectedInstanceItem"
      :status-items="getStatusItems"
      :parent-resource-id="selectedParentItem.resourceId"
      @on-stop="handleStop"
      @on-start="handleStart"
      @on-launch="handleLaunch"
      @on-back-click="handleOnFrequencyBackClick"
      @toggle-add-campaign-manager-modal="toggleAddCampaignManagerModal"
    />
  </KContainer>
</template>

<script>
import CampaignManagerParentTable from '@/components/CampaignManager/CampaignManagerParentTable'
import CampaignManagerItemTable from '@/components/CampaignManager/CampaignManagerItemTable'
import CampaignManagerAddOrEditModal from '@/components/CampaignManager/CampaignManagerAddOrEditModal'
import {
  bulkDeleteCampaignReports,
  deleteCampaignManager,
  getCampaignManagerFormDetails,
  launchPhishingCampaignInstanceGroup,
  stopPhishingCampaignJob
} from '@/api/phishingsimulator'
import { mapGetters } from 'vuex'
import KContainer from '@/components/KContainer/KContainer'
import CampaignManagerNewInstanceModal from '@/components/CampaignManager/CampaignManagerNewInstanceModal'
import CampaignManagerFrequencyTable from '@/components/CampaignManager/CampaignManagerFrequencyTable'
import CommonCampaignManagerDeleteDialog from '@/components/Common/CampaignManager/CommonCampaignManagerDeleteDialog.vue'
import CommonCampaignManagerCreateNewInstanceDialog from '@/components/Common/CampaignManager/CommonCampaignManagerCreateNewInstanceDialog.vue'
import CommonCampaignManagerPreviewDialog from '@/components/Common/CampaignManager/CommonCampaignManagerPreviewDialog.vue'
import CommonCampaignManagerLaunchCampaignDialog from '@/components/Common/CampaignManager/CommonCampaignManagerLaunchCampaignDialog.vue'
import CommonCampaignManagerCancelCampaignDialog from '@/components/Common/CampaignManager/CommonCampaignManagerCancelCampaignDialog.vue'

export default {
  name: 'CampaignManager',
  components: {
    CommonCampaignManagerCancelCampaignDialog,
    CommonCampaignManagerLaunchCampaignDialog,
    CommonCampaignManagerPreviewDialog,
    CommonCampaignManagerCreateNewInstanceDialog,
    CommonCampaignManagerDeleteDialog,
    KContainer,
    CampaignManagerItemTable,
    CampaignManagerParentTable,
    CampaignManagerAddOrEditModal,
    CampaignManagerNewInstanceModal,
    CampaignManagerFrequencyTable
  },
  data() {
    return {
      instanceResourceId: '',
      launchResourceId: '',
      isMultipleDelete: false,
      multipleDeletedUserCount: 0,
      selectedParentItem: null,
      selectedInstanceItem: null,
      selectedRow: null,
      isShowPreviewDialog: false,
      isEdit: false,
      isParentTableLoading: false,
      isItemTableLoading: false,
      isItemTableShowing: false,
      isDuplicate: false,
      isShowAddOrEditCampaignManagerModal: false,
      isShowNewInstanceModal: false,
      isShowDeleteDialog: false,
      isDeleteDialogActionButtonDisabled: false,
      isShowLaunchDialog: false,
      isShowStopDialog: false,
      isShowStartDialog: false,
      isFrequencyTableShowing: false,
      formDetails: {},
      multipleSystemUserPayload: {},
      startStopCampaignPayload: {},
      isStartDialogActionButtonDisabled: false,
      isStopDialogActionButtonDisabled: false
    }
  },
  computed: {
    ...mapGetters({
      getCampaignManagerParentDeletePermissions:
        'permissions/getCampaignManagerParentDeletePermissions'
    }),
    getStatusItems() {
      return this.formDetails.status
    }
  },
  created() {
    this.callForFormDetails()
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
  watch: {
    '$route.query': {
      handler: function (val) {
        if (val?.status === 'parent') {
          this.selectedParentItem = null
          this.selectedInstanceItem = null
          this.isItemTableShowing = false
          this.isFrequencyTableShowing = false
          this.$router.replace('/phishing-simulator/campaign-manager')
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    toggleShowLaunchDialog() {
      if (this.isShowLaunchDialog) this.launchResourceId = ''
      this.isShowLaunchDialog = !this.isShowLaunchDialog
    },
    handleConfirmLaunchDialog(resourceId) {
      this.instanceResourceId = resourceId
      this.toggleShowLaunchDialog()
      this.showNewInstanceModal()
    },
    callForFormDetails() {
      getCampaignManagerFormDetails().then((response) => {
        const {
          data: { data }
        } = response
        this.formDetails = data
      })
    },
    handleMultipleDelete(payload = {}, totalUserCount = 0) {
      this.multipleSystemUserPayload = payload
      this.multipleDeletedUserCount = totalUserCount
      this.isMultipleDelete = true
      this.toggleShowDeleteDialog()
    },
    handleOnMultipleDelete() {
      this.setDeleteDialogActionButtonDisabled(true)
      bulkDeleteCampaignReports(this.multipleSystemUserPayload)
        .then(() => {
          this.$refs.campaignManagerParentTable.$refs.refTable.resetSelectableParams()
          this.$refs.campaignManagerParentTable.callForData()
          this.toggleShowDeleteDialog()
        })
        .finally(() => {
          this.setDeleteDialogActionButtonDisabled(false)
        })
    },
    handleOnRecordButtonClick(row) {
      this.selectedParentItem = row
      if (this.$refs.campaignManagerItemTable) {
        this.$refs.campaignManagerItemTable.resetTable()
        this.$refs.campaignManagerItemTable.callForData()
      }
      this.toggleItemTableShowing()
    },
    handleItemTableRecordButtonClick(row) {
      this.selectedInstanceItem = row
      this.toggleFrequencyTableShowing()
    },
    handleOnBackClick() {
      if (this.$refs.campaignManagerParentTable) {
        this.$refs.campaignManagerParentTable.callForData()
      }
      this.toggleItemTableShowing()
    },
    handleOnFrequencyBackClick() {
      if (this.$refs.campaignManagerItemTable) {
        this.$refs.campaignManagerItemTable.callForData()
      }
      this.toggleFrequencyTableShowing()
    },
    toggleItemTableShowing() {
      this.isItemTableShowing = !this.isItemTableShowing
    },
    toggleFrequencyTableShowing() {
      this.isFrequencyTableShowing = !this.isFrequencyTableShowing
    },
    toggleAddCampaignManagerModal() {
      if (this.isShowAddOrEditCampaignManagerModal) {
        this.selectedRow = null
        this.isEdit = false
        this.isDuplicate = false
      }
      this.isShowAddOrEditCampaignManagerModal = !this.isShowAddOrEditCampaignManagerModal
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
    handleOnSubmit() {
      this.$refs.campaignManagerParentTable.callForData()
      this.toggleAddCampaignManagerModal()
    },
    handleItemOnEdit(row) {
      this.selectedRow = row
      this.isEdit = true
      this.toggleAddCampaignManagerModal()
    },
    handleItemOnPreview(row) {
      this.selectedRow = row
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
    handleStop(obj = {}) {
      this.startStopCampaignPayload = obj
      this.toggleStopCampaignDialog()
    },
    handleStart(obj = {}) {
      this.startStopCampaignPayload = obj
      this.toggleStartCampaignDialog()
    },
    handleStartCampaign(row) {
      this.isStartDialogActionButtonDisabled = true
      launchPhishingCampaignInstanceGroup(row.resourceId, row.instanceGroup)
        .then(() => {
          if (this.isFrequencyTableShowing) {
            this.$refs.campaignManagerFrequencyTable.callForData()
          } else {
            this.$refs.campaignManagerItemTable.callForData()
          }
          this.toggleStartCampaignDialog()
        })
        .finally(() => {
          this.isStartDialogActionButtonDisabled = false
        })
    },
    handleStopCampaign(row) {
      this.isStopDialogActionButtonDisabled = true
      stopPhishingCampaignJob(row.resourceId, row.instanceGroup)
        .then(() => {
          if (this.isFrequencyTableShowing) {
            this.$refs.campaignManagerFrequencyTable.callForData()
          } else {
            this.$refs.campaignManagerItemTable.callForData()
          }
          this.toggleStopCampaignDialog()
        })
        .finally(() => {
          this.isStopDialogActionButtonDisabled = false
        })
    },
    handleLaunch(row = {}) {
      this.launchResourceId = row.resourceId
      this.selectedRow = row
      this.toggleShowLaunchDialog()
    },
    toggleStartCampaignDialog() {
      this.isShowStartDialog = !this.isShowStartDialog
    },
    toggleStopCampaignDialog() {
      this.isShowStopDialog = !this.isShowStopDialog
    },
    toggleShowPreviewDialog() {
      if (this.isShowPreviewDialog) this.selectedRow = null
      this.isShowPreviewDialog = !this.isShowPreviewDialog
    },
    toggleShowDeleteDialog() {
      if (this.isShowDeleteDialog) {
        this.selectedRow = null
        this.multipleSystemUserPayload = {}
        this.isMultipleDelete = false
      }
      this.isShowDeleteDialog = !this.isShowDeleteDialog
    },
    setDeleteDialogActionButtonDisabled(flag = false) {
      this.isDeleteDialogActionButtonDisabled = flag
    },
    handleOnDelete(item = {}) {
      if (this.getCampaignManagerParentDeletePermissions) {
        this.setDeleteDialogActionButtonDisabled(true)
        deleteCampaignManager(item.resourceId)
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
    }
  }
}
</script>
