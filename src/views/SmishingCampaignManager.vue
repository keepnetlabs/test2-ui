<template>
  <KContainer tabless class="campaign-manager">
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
      ref="refCampaignNewInstance"
      v-if="isShowNewInstanceModal"
      :status="isShowNewInstanceModal"
      :resourceId="instanceResourceId"
      @on-close="closeNewInstanceModal"
      @on-submit="handleOnSubmitNewInstance"
    />
    <CampaignManagerCreateNewInstanceDialog
      v-if="isShowLaunchDialog"
      :status="isShowLaunchDialog"
      :resource-id="launchResourceId"
      @on-close="toggleShowLaunchDialog"
      @on-confirm="handleConfirmLaunchDialog"
    />
    <v-overlay
      v-if="isNewScenarioModalVisible"
      id="new-smishing-scenario-overlay"
      :value="isNewScenarioModalVisible"
      :opacity="1"
      :z-index="99"
      color="white"
    >
      <NewScenario
        ref="newScenarioModal"
        :status="isNewScenarioModalVisible"
        :scenarioDetailsLookup="scenarioDetailsLookup"
        @changeNewScenarioModalStatus="handleCloseNewScenarioModal"
      />
    </v-overlay>
    <CreateNewUserGroupModal
      v-if="isTargeGroupModalVisible"
      :status="isTargeGroupModalVisible"
      :is-create-button-disabled="isCreateTargetGroupButtonDisabled"
      @changeNewUserGroupStatus="handleCloseTargetGroupModal"
      @handleSave="handleConfirmTargetGroupModal"
    />
    <CampaignManagerPreview
      v-if="isShowPreviewDialog"
      :status="isShowPreviewDialog"
      :selectedRow="selectedRow"
      @on-close="toggleShowPreviewDialog"
    />
    <NoScenarioModal
      v-if="isNoScenarioModalVisible"
      :status="isNoScenarioModalVisible"
      @on-close="handleCloseNoScenarioModal"
      @on-confirm="handleConfirmNoScenarioModal"
    />
    <NoTargetUserGroupModal
      v-if="isNoTargetUserGroupModalVisible"
      :status="isNoTargetUserGroupModalVisible"
      @on-close="handleCloseNoTargetUserGroupModal"
      @on-confirm="handleConfirmNoTargetUserGroupModal"
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
    <CampaignManagerParentTable
      v-show="!isItemTableShowing"
      ref="campaignManagerParentTable"
      :is-loading.sync="isParentTableLoading"
      :status-items="getStatusItems"
      @no-scenario="handleShowNoScenarioModal"
      @no-target-group="handleShowNoTargetUserGroupModal"
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
import CampaignManagerParentTable from '@/components/SmishingCampaignManager/CampaignManagerParentTable'
import CampaignManagerItemTable from '@/components/SmishingCampaignManager/CampaignManagerItemTable'
import CampaignManagerAddOrEditModal from '@/components/SmishingCampaignManager/CampaignManagerAddOrEditModal'
import CampaignManagerDeleteDialog from '@/components/SmishingCampaignManager/CampaignManagerDeleteDialog'
import SmishingService from '@/api/smishing'
import { getScenarioDataDetails } from '@/api/scenarios'
import { createTargetGroup } from '@/api/targetUsers'
import CampaignManagerPreview from '@/components/SmishingCampaignManager/CampaignManagerPreview'
import CampaignManagerCreateNewInstanceDialog from '@/components/SmishingCampaignManager/CampaignManagerCreateNewInstanceDialog'
import { mapGetters } from 'vuex'
import KContainer from '@/components/KContainer/KContainer'
import CampaignManagerNewInstanceModal from '@/components/SmishingCampaignManager/CampaignManagerNewInstanceModal'
import NoScenarioModal from '@/components/SmishingCampaignManager/NoScenarioModal'
import NoTargetUserGroupModal from '@/components/SmishingCampaignManager/NoTargetUserGroupModal'
import CreateNewUserGroupModal from '@/components/TargetUsers/CreateNewUserGroupModal'
import NewScenario from '@/components/SmishingScenarios/NewScenario'

export default {
  name: 'CampaignManager',
  components: {
    KContainer,
    CampaignManagerCreateNewInstanceDialog,
    CampaignManagerPreview,
    CampaignManagerDeleteDialog,
    CampaignManagerItemTable,
    CampaignManagerParentTable,
    NoScenarioModal,
    NoTargetUserGroupModal,
    CreateNewUserGroupModal,
    NewScenario,
    CampaignManagerNewInstanceModal,
    CampaignManagerAddOrEditModal
  },
  data() {
    return {
      instanceResourceId: '',
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
      isNoScenarioModalVisible: false,
      isNoTargetUserGroupModalVisible: false,
      isTargeGroupModalVisible: false,
      isNewScenarioModalVisible: false,
      isCreateTargetGroupButtonDisabled: false,
      isDuplicate: false,
      isShowAddOrEditCampaignManagerModal: false,
      isShowNewInstanceModal: false,
      isShowDeleteDialog: false,
      isDeleteDialogActionButtonDisabled: false,
      isShowLaunchDialog: false,
      formDetails: {},
      multipleSystemUserPayload: {},
      scenarioDetailsLookup: {}
    }
  },
  computed: {
    ...mapGetters({
      getSmishingCampaignManagerDeletePermissions:
        'permissions/getSmishingCampaignManagerDeletePermissions'
    }),
    getStatusItems() {
      return this.formDetails.status
    }
  },
  created() {
    this.callForFormDetails()
    this.callForScenarioDetails()
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
    callForScenarioDetails() {
      getScenarioDataDetails().then((response) => {
        this.scenarioDetailsLookup = response?.data?.data || {
          methodTypes: [],
          difficultyTypes: []
        }
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
    callForFormDetails() {
      SmishingService.getCampaignManagerFormDetails().then((response) => {
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
      if (this.getSmishingCampaignManagerDeletePermissions) {
        this.setDeleteDialogActionButtonDisabled(true)
        SmishingService.deleteSmishingCampaign(item.resourceId)
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
    handleCloseTargetGroupModal() {
      this.isTargeGroupModalVisible = false
    },
    handleConfirmTargetGroupModal(group) {
      this.isCreateTargetGroupButtonDisabled = true
      createTargetGroup(group)
        .then(() => {
          this.isTargeGroupModalVisible = false
          this.$refs?.campaignManagerParentTable?.callForData?.()
        })
        .finally(() => (this.isCreateTargetGroupButtonDisabled = false))
    },
    handleShowTargetGroupModal() {
      this.isTargeGroupModalVisible = true
    },
    handleCloseNoScenarioModal() {
      this.isNoScenarioModalVisible = false
    },
    handleConfirmNoScenarioModal() {
      this.isNoScenarioModalVisible = false
      this.handleShowNewScenarioModal()
    },
    handleShowNoScenarioModal() {
      this.isNoScenarioModalVisible = true
    },
    handleShowNewScenarioModal() {
      this.isNewScenarioModalVisible = true
    },
    handleCloseNewScenarioModal() {
      this.isNewScenarioModalVisible = false
    },
    handleCloseNoTargetUserGroupModal() {
      this.isNoTargetUserGroupModalVisible = false
    },
    handleConfirmNoTargetUserGroupModal() {
      this.isNoTargetUserGroupModalVisible = false
      this.handleShowTargetGroupModal()
    },
    handleShowNoTargetUserGroupModal() {
      this.isNoTargetUserGroupModalVisible = true
    }
  }
}
</script>
