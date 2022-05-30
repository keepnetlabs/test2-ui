<template>
  <KContainer tabless class="campaign-manager">
    <CampaignManagerCreateNewInstanceDialog
      v-if="isShowLaunchDialog"
      :status="isShowLaunchDialog"
      :resource-id="launchResourceId"
      @on-close="toggleShowLaunchDialog"
      @on-confirm="handleConfirmLaunchDialog"
    />
    <CampaignManagerDeleteDialog
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
    <CampaignManagerPreview
      v-if="isShowPreviewDialog"
      :status="isShowPreviewDialog"
      :selectedRow="selectedRow"
      @on-close="toggleShowPreviewDialog"
    />
    <CampaignManagerAddOrEditModal
      ref="refCampaignModal"
      v-if="isShowAddOrEditCampaignManagerModal"
      :status="isShowAddOrEditCampaignManagerModal"
      :is-edit="isEdit"
      :selected-row="selectedRow"
      :form-details="formDetails"
      :is-duplicate="isDuplicate"
      @on-close="toggleAddCampaignManagerModal"
      @on-submit="handleOnSubmit"
    />
    <CampaignManagerParentTable
      v-show="!isItemTableShowing"
      ref="campaignManagerParentTable"
      :is-loading.sync="isParentTableLoading"
      :status-items="getStatusItems"
      @on-record-button-click="handleOnRecordButtonClick"
      @toggle-add-campaign-manager-modal="toggleAddCampaignManagerModal"
      @on-edit="handleItemOnEdit"
      @on-preview="handleItemOnPreview"
      @on-delete="handleItemOnDelete"
      @on-duplicate="handleItemOnDuplicate"
      @on-pause="handleOnPause"
      @on-run="handleOnRun"
      @on-stop="handleStop"
      @on-launch="handleLaunch"
      @on-multiple-delete="handleMultipleDelete"
    />
    <CampaignManagerItemTable
      v-if="isItemTableShowing"
      ref="campaignManagerItemTable"
      :is-loading="isItemTableLoading"
      :item="selectedParentItem"
      :status-items="getStatusItems"
      @on-launch="handleLaunch"
      @on-back-click="handleOnBackClick"
      @toggle-add-campaign-manager-modal="toggleAddCampaignManagerModal"
    />
  </KContainer>
</template>

<script>
import CampaignManagerParentTable from '@/components/CampaignManager/CampaignManagerParentTable'
import CampaignManagerItemTable from '@/components/CampaignManager/CampaignManagerItemTable'
import CampaignManagerAddOrEditModal from '@/components/CampaignManager/CampaignManagerAddOrEditModal'
import { getDefaultAxiosPayload } from '@/utils/functions'
import CampaignManagerDeleteDialog from '@/components/CampaignManager/CampaignManagerDeleteDialog'
import {
  bulkDeleteCampaignReports,
  deleteCampaignManager,
  getCampaignManagerFormDetails,
  pausePhishingCampaignJob,
  resumePhishingCampaignJob,
  stopPhishingCampaignJob
} from '@/api/phishingsimulator'
import CampaignManagerPreview from '@/components/CampaignManager/CampaignManagerPreview'
import CampaignManagerCreateNewInstanceDialog from '@/components/CampaignManager/CampaignManagerCreateNewInstanceDialog'
import { mapGetters } from 'vuex'
import KContainer from '@/components/KContainer/KContainer'
export default {
  name: 'CampaignManager',
  components: {
    KContainer,
    CampaignManagerCreateNewInstanceDialog,
    CampaignManagerPreview,
    CampaignManagerDeleteDialog,
    CampaignManagerItemTable,
    CampaignManagerParentTable,
    CampaignManagerAddOrEditModal
  },
  data() {
    return {
      launchResourceId: '',
      isMultipleDelete: false,
      multipleDeletedUserCount: 0,
      selectedParentItem: null,
      selectedRow: null,
      isShowPreviewDialog: false,
      isEdit: false,
      isParentTableLoading: false,
      isItemTableLoading: false,
      isItemTableShowing: false,
      isDuplicate: false,
      isShowAddOrEditCampaignManagerModal: false,
      isShowDeleteDialog: false,
      isDeleteDialogActionButtonDisabled: false,
      isShowLaunchDialog: false,
      formDetails: {},
      multipleSystemUserPayload: {}
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
  methods: {
    toggleShowLaunchDialog() {
      if (this.isShowLaunchDialog) this.launchResourceId = ''
      this.isShowLaunchDialog = !this.isShowLaunchDialog
    },
    handleConfirmLaunchDialog() {
      const objRef = this.isItemTableShowing
        ? 'campaignManagerItemTable'
        : 'campaignManagerParentTable'
      this.$refs[objRef].callForData()
      this.toggleShowLaunchDialog()
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
      this.toggleItemTableShowing()
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
    handleOnPause(row = {}) {
      pausePhishingCampaignJob(row.resourceId).then(() => {
        this.$refs.campaignManagerParentTable.callForData()
      })
    },
    handleOnRun(row = {}) {
      resumePhishingCampaignJob(row.resourceId).then(() => {
        this.$refs.campaignManagerParentTable.callForData()
      })
    },
    handleStop(row = {}) {
      stopPhishingCampaignJob(row.resourceId).then(() => {
        this.$refs.campaignManagerParentTable.callForData()
      })
    },
    handleLaunch(row = {}) {
      this.launchResourceId = row.resourceId
      this.toggleShowLaunchDialog()
    },
    toggleShowPreviewDialog() {
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
  },
  beforeRouteLeave(to, from, next) {
    const { refCampaignModal } = this.$refs
    if (refCampaignModal && refCampaignModal.status) {
      refCampaignModal.closeOverlay()
      next(false)
    } else {
      next()
    }
  }
}
</script>

<style lang="scss">
.campaign-manager {
  &__table-all-records {
    color: #2196f3;
    font-weight: 600;
    font-size: 18px;
    line-height: 25px;
    margin-left: 24px;
    margin-bottom: 24px;
  }
  &__target-groups {
    max-width: 1100px;
    .k-form-group__content {
      display: flex;
    }
  }
  &__close-advanced-search {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    padding: 0 8px !important;
    margin-left: 24px;
    align-self: center;
    margin-top: -24px;
  }
  &__advanced-search-container {
  }
  .k-stepper {
    overflow: visible;
    &__items {
      overflow: visible;
    }
  }
}
</style>
