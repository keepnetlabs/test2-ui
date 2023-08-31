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
import CampaignManagerDeleteDialog from '@/components/CampaignManager/CampaignManagerDeleteDialog'
import {
  bulkDeleteCampaignReports,
  deleteCampaignManager,
  getCampaignManagerFormDetails
} from '@/api/phishingsimulator'
import CampaignManagerPreview from '@/components/CampaignManager/CampaignManagerPreview'
import CampaignManagerCreateNewInstanceDialog from '@/components/CampaignManager/CampaignManagerCreateNewInstanceDialog'
import { mapGetters } from 'vuex'
import KContainer from '@/components/KContainer/KContainer'
import CampaignManagerNewInstanceModal from '@/components/CampaignManager/CampaignManagerNewInstanceModal'
import CampaignManagerFrequencyTable from '@/components/CampaignManager/CampaignManagerFrequencyTable'
import { getDefaultAxiosPayload } from '@/utils/functions'
export default {
  name: 'CampaignManager',
  components: {
    KContainer,
    CampaignManagerCreateNewInstanceDialog,
    CampaignManagerPreview,
    CampaignManagerDeleteDialog,
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
      isFrequencyTableShowing: false,
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
  beforeRouteLeave(to, from, next) {
    const { refCampaignModal } = this.$refs
    if (refCampaignModal && refCampaignModal.status) {
      refCampaignModal.closeOverlay()
      next(false)
    } else {
      next()
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
    handleLaunch(row = {}) {
      this.launchResourceId = row.resourceId
      this.toggleShowLaunchDialog()
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
