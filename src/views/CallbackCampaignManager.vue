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
      :availableNumbers="availableNumbers"
      :languages="languages"
      @on-close="toggleAddCampaignManagerModal"
      @on-submit="handleOnSubmit"
    />
    <CampaignManagerNewInstanceModal
      ref="refCampaignNewInstance"
      v-if="isShowNewInstanceModal"
      :status="isShowNewInstanceModal"
      :resourceId="instanceResourceId"
      :form-details="formDetails"
      @on-close="closeNewInstanceModal"
      @on-submit="handleOnSubmitNewInstance"
    />
    <CommonCampaignManagerCreateNewInstanceDialog
      v-if="isShowLaunchDialog"
      :status="isShowLaunchDialog"
      :resource-id="launchResourceId"
      @on-close="toggleShowLaunchDialog"
      @on-confirm="handleConfirmLaunchDialog"
    />
    <v-overlay
      v-if="isNewScenarioModalVisible"
      id="add-new-community-overlay"
      :value="isNewScenarioModalVisible"
      :opacity="1"
      :z-index="99"
      color="white"
    >
      <CallbackScenarioModal
        v-if="isNewScenarioModalVisible"
        ref="newScenarioModal"
        :status="isNewScenarioModalVisible"
        :scenarioDetailsLookup="scenarioDetailsLookup"
        :languages="languages"
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
    <CampaignPreviewModal
      v-if="isShowPreviewDialog"
      :status="isShowPreviewDialog"
      :selectedRow="selectedRow"
      :languages="languages"
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
    <CampaignManagerParentTable
      v-show="!isItemTableShowing && !isFrequencyTableShowing"
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
import CampaignManagerParentTable from '@/components/CallbackCampaignManager/CampaignManagerParentTable'
import CampaignManagerItemTable from '@/components/CallbackCampaignManager/CampaignManagerItemTable'
import CampaignManagerAddOrEditModal from '@/components/CallbackCampaignManager/CampaignManagerAddOrEditModal'
import CommonCampaignManagerDeleteDialog from '@/components/Common/CampaignManager/CommonCampaignManagerDeleteDialog'
import CallbackService from '@/api/callback'
import CampaignManagerFrequencyTable from '@/components/CallbackCampaignManager/CampaignManagerFrequencyTable'
import { createTargetGroup } from '@/api/targetUsers'
import CampaignPreviewModal from '@/components/CallbackCampaignManager/CampaignPreviewModal'
import CommonCampaignManagerCreateNewInstanceDialog from '@/components/Common/CampaignManager/CommonCampaignManagerCreateNewInstanceDialog'
import { mapGetters } from 'vuex'
import KContainer from '@/components/KContainer/KContainer'
import CampaignManagerNewInstanceModal from '@/components/CallbackCampaignManager/CampaignManagerNewInstanceModal'
import NoScenarioModal from '@/components/CallbackCampaignManager/NoScenarioModal'
import NoTargetUserGroupModal from '@/components/CallbackCampaignManager/NoTargetUserGroupModal'
import CreateNewUserGroupModal from '@/components/TargetUsers/CreateNewUserGroupModal'
import CallbackScenarioModal from '@/components/CallbackScenarios/CallbackScenarioModal'
import { callbackScenariosDifficultyTypes } from '@/components/CallbackScenarios/utils'
export default {
  name: 'CallbackCampaignManager',
  components: {
    KContainer,
    CommonCampaignManagerCreateNewInstanceDialog,
    CampaignPreviewModal,
    CommonCampaignManagerDeleteDialog,
    CampaignManagerItemTable,
    CampaignManagerParentTable,
    NoScenarioModal,
    NoTargetUserGroupModal,
    CreateNewUserGroupModal,
    CallbackScenarioModal,
    CampaignManagerNewInstanceModal,
    CampaignManagerAddOrEditModal,
    CampaignManagerFrequencyTable
  },
  data() {
    return {
      instanceResourceId: '',
      launchResourceId: '',
      isMultipleDelete: false,
      multipleDeletedUserCount: 0,
      selectedParentItem: null,
      selectedRow: null,
      selectedInstanceItem: null,
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
      isFrequencyTableShowing: false,
      formDetails: {},
      multipleSystemUserPayload: {},
      languages: [],
      availableNumbers: 0,
      scenarioDetailsLookup: {
        difficultyTypes: callbackScenariosDifficultyTypes
      }
    }
  },
  computed: {
    ...mapGetters({
      getCallbackCampaignDeletePermissions: 'permissions/getCallbackCampaignDeletePermissions'
    }),
    getStatusItems() {
      return this.formDetails.status
    }
  },
  created() {
    this.callForLanguages()
    this.callForFormDetails()
    this.callForAvailableNumbers()
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
          this.$router.replace('/callback-simulator/campaign-manager')
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    callForAvailableNumbers() {
      CallbackService.getUsedCallbackNumbers().then((res) => {
        const { companyCount = 0, usedCount = 0 } = res.data.data
        this.availableNumbers = companyCount - usedCount
      })
    },
    callForLanguages() {
      CallbackService.getCallbackTemplateLanguages().then((response) => {
        this.languages = response?.data?.data || []
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
      CallbackService.getCampaignManagerFormDetails().then((response) => {
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
          this.$refs.campaignManagerParentTable.callForNumbers()
          this.toggleShowDeleteDialog()
        })
        .finally(() => {
          this.setDeleteDialogActionButtonDisabled(false)
        })
    },
    handleOnRecordButtonClick(row) {
      const isOneTime = row.frequency == null || row.frequency === 0
      if (row.total === 1 && row.status !== 'Idle' && isOneTime) {
        this.$router.push({
          name: 'Callback Report',
          params: {
            id: row.resourceId,
            instanceGroup: row.mostRecentInstanceGroup ?? 1
          }
        })
        return
      }
      this.selectedParentItem = row
      if (this.$refs.campaignManagerItemTable) {
        this.$refs.campaignManagerItemTable.resetTable()
        this.$refs.campaignManagerItemTable.callForData()
      }
      this.toggleItemTableShowing()
    },
    handleOnBackClick() {
      if (this.$refs.campaignManagerParentTable) {
        this.$refs.campaignManagerParentTable.callForNumbers()
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
      this.$refs.campaignManagerParentTable.callForNumbers()
      this.closeNewInstanceModal()
    },
    handleOnSubmit() {
      this.callForAvailableNumbers()
      this.$refs.campaignManagerParentTable.callForNumbers()
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
      if (this.getCallbackCampaignDeletePermissions) {
        this.setDeleteDialogActionButtonDisabled(true)
        CallbackService.deleteCallbackCampaign(item.resourceId)
          .then(() => {
            this.$refs?.campaignManagerParentTable?.$refs?.refTable?.unSelectRow(item)
            this.$refs?.campaignManagerParentTable?.$refs?.refTable?.changeServerSideSelectionCount(
              -1
            )
            this.$refs.campaignManagerParentTable.callForNumbers()
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
          this.$refs?.campaignManagerParentTable?.callForNumbers?.()
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
    },
    handleItemTableRecordButtonClick(row) {
      const parentFrequency = this.selectedParentItem?.frequency
      const isParentOneTime = parentFrequency == null || parentFrequency === 0
      if (row.total === 1 && row.status !== 'Idle' && isParentOneTime) {
        this.$router.push({
          name: 'Callback Report',
          params: {
            id: this.selectedParentItem.resourceId,
            instanceGroup: row.instanceGroup
          }
        })
        return
      }
      this.selectedInstanceItem = row
      this.toggleFrequencyTableShowing()
    },
    toggleFrequencyTableShowing() {
      this.isFrequencyTableShowing = !this.isFrequencyTableShowing
    },
    handleOnFrequencyBackClick() {
      this.selectedInstanceItem = null
      this.toggleFrequencyTableShowing()
    }
  }
}
</script>
