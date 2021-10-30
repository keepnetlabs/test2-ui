<template>
  <div class="campaign-manager" id="campaign-manager">
    <div class="campaign-manager__content">
      <CampaignManagerDeleteDialog
        v-if="isShowDeleteDialog"
        :status="isShowDeleteDialog"
        :item="selectedRow"
        :is-action-button-disabled="isDeleteDialogActionButtonDisabled"
        @on-close="toggleShowDeleteDialog"
        @on-delete="handleOnDelete"
      />
      <CampaignManagerPreview
        v-if="isShowPreviewDialog"
        :status="isShowPreviewDialog"
        :selectedRow="selectedRow"
        @on-close="toggleShowPreviewDialog"
      />
      <CampaignManagerAddOrEditModal
        v-if="isShowAddOrEditCampaignManagerModal"
        :status="isShowAddOrEditCampaignManagerModal"
        :is-edit="isEdit"
        :selected-row="selectedRow"
        :form-details="formDetails"
        @on-close="toggleAddCampaignManagerModal"
        @on-submit="handleOnSubmit"
      />
      <CampaignManagerParentTable
        v-show="!isItemTableShowing"
        ref="campaignManagerParentTable"
        :axios-payload.sync="axiosPayloadOfParent"
        :is-loading.sync="isParentTableLoading"
        :PERMISSIONS="PERMISSIONS['CAMPAIGN_MANAGER_PARENT']"
        :status-items="getStatusItems"
        @on-record-button-click="handleOnRecordButtonClick"
        @toggle-add-campaign-manager-modal="toggleAddCampaignManagerModal"
        @reset-axios-payload="handleResetAxiosPayloadOfParent"
        @on-edit="handleItemOnEdit"
        @on-preview="handleItemOnPreview"
        @on-delete="handleItemOnDelete"
        @on-duplicate="handleItemOnDuplicate"
      />
      <CampaignManagerItemTable
        v-if="isItemTableShowing"
        :axios-payload="axiosPayloadOfItem"
        :is-loading="isItemTableLoading"
        :item="selectedParentItem"
        @on-back-click="handleOnBackClick"
        @toggle-add-campaign-manager-modal="toggleAddCampaignManagerModal"
      />
    </div>
  </div>
</template>

<script>
import CampaignManagerParentTable from '@/components/CampaignManager/CampaignManagerParentTable'
import { axiosPayload } from '@/components/CampaignManager/utils'
import CampaignManagerItemTable from '@/components/CampaignManager/CampaignManagerItemTable'
import CampaignManagerAddOrEditModal from '@/components/CampaignManager/CampaignManagerAddOrEditModal'
import PERMISSIONS from '@/permissions'
import { getPermissionsOfAllItems } from '@/utils/functions'
import CampaignManagerDeleteDialog from '@/components/CampaignManager/CampaignManagerDeleteDialog'
import { deleteCampaignManager, getCampaignManagerFormDetails } from '@/api/phishingsimulator'
import CampaignManagerPreview from '@/components/CampaignManager/CampaignManagerPreview'
export default {
  name: 'CampaignManager',
  components: {
    CampaignManagerPreview,
    CampaignManagerDeleteDialog,
    CampaignManagerItemTable,
    CampaignManagerParentTable,
    CampaignManagerAddOrEditModal
  },
  data() {
    return {
      axiosPayloadOfParent: JSON.parse(JSON.stringify(axiosPayload)),
      axiosPayloadOfItem: JSON.parse(JSON.stringify(axiosPayload)),
      selectedParentItem: null,
      selectedRow: null,
      isShowPreviewDialog: false,
      isEdit: false,
      isParentTableLoading: false,
      isItemTableLoading: false,
      isItemTableShowing: false,
      isShowAddOrEditCampaignManagerModal: false,
      isShowDeleteDialog: false,
      isDeleteDialogActionButtonDisabled: false,
      PERMISSIONS: {
        CAMPAIGN_MANAGER_PARENT: {}
      },
      formDetails: {}
    }
  },
  computed: {
    getStatusItems() {
      return this.formDetails.status
    }
  },
  created() {
    this.getPermissions()
    this.callForFormDetails()
  },
  methods: {
    callForFormDetails() {
      getCampaignManagerFormDetails().then((response) => {
        const {
          data: { data }
        } = response
        this.formDetails = data
        console.log('this.formDetails', this.formDetails)
      })
    },
    getPermissions() {
      const { CAMPAIGN_MANAGER_PARENT } = PERMISSIONS
      this.$set(
        this.PERMISSIONS,
        'CAMPAIGN_MANAGER_PARENT',
        getPermissionsOfAllItems(CAMPAIGN_MANAGER_PARENT)
      )
    },
    handleOnRecordButtonClick(row) {
      this.selectedParentItem = row
      this.toggleItemTableShowing()
    },
    handleOnBackClick() {
      this.toggleItemTableShowing()
    },
    toggleItemTableShowing() {
      this.isItemTableShowing = !this.isItemTableShowing
    },
    toggleAddCampaignManagerModal() {
      if (this.isShowAddOrEditCampaignManagerModal) {
        this.selectedRow = null
        this.isEdit = false
      }
      this.isShowAddOrEditCampaignManagerModal = !this.isShowAddOrEditCampaignManagerModal
    },
    handleOnSubmit() {
      this.$refs.campaignManagerParentTable.callForData()
      this.toggleAddCampaignManagerModal()
    },
    handleResetAxiosPayloadOfParent() {
      this.axiosPayloadOfParent = JSON.parse(JSON.stringify(axiosPayload))
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
      this.toggleAddCampaignManagerModal()
    },
    toggleShowPreviewDialog() {
      this.isShowPreviewDialog = !this.isShowPreviewDialog
    },
    toggleShowDeleteDialog() {
      if (this.isShowDeleteDialog) {
        this.selectedRow = null
      }
      this.isShowDeleteDialog = !this.isShowDeleteDialog
    },
    setDeleteDialogActionButtonDisabled(flag = false) {
      this.isDeleteDialogActionButtonDisabled = flag
    },
    handleOnDelete(resourceId = '') {
      const { CAMPAIGN_MANAGER_PARENT } = this.PERMISSIONS
      if (CAMPAIGN_MANAGER_PARENT.DELETE.hasPermission) {
        this.setDeleteDialogActionButtonDisabled(true)
        deleteCampaignManager(resourceId)
          .then(() => {
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

<style lang="scss">
.campaign-manager {
  min-height: 80vh;
  padding: 11px 16px 16px 16px;
  &__content {
    background: white;
    box-shadow: 0 10px 15px -5px hsla(0, 0%, 80.4%, 0.5) !important;
    padding: 24px 24px 0 24px !important;
    border-radius: 20px !important;
  }
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
