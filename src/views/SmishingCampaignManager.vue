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
      v-if="isShowNewInstanceModal"
      ref="refCampaignNewInstance"
      :status="isShowNewInstanceModal"
      :resourceId="instanceResourceId"
      :form-details="formDetails"
      :selectedRow="selectedRow"
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
    <NewScenario
      v-if="isNewScenarioModalVisible"
      ref="newScenarioModal"
      :status="isNewScenarioModalVisible"
      :scenarioDetailsLookup="scenarioDetailsLookup"
      @changeNewScenarioModalStatus="handleCloseNewScenarioModal"
    />
    <CreateNewUserGroupModal
      v-if="isTargetGroupModalVisible"
      :status="isTargetGroupModalVisible"
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
      @on-preview="handleItemOnPreview"
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
import CampaignManagerParentTable from '@/components/SmishingCampaignManager/CampaignManagerParentTable'
import CampaignManagerItemTable from '@/components/SmishingCampaignManager/CampaignManagerItemTable'
import CampaignManagerAddOrEditModal from '@/components/SmishingCampaignManager/CampaignManagerAddOrEditModal'
import SmishingService from '@/api/smishing'
import CampaignManagerFrequencyTable from '@/components/SmishingCampaignManager/CampaignManagerFrequencyTable'
import { createTargetGroup } from '@/api/targetUsers'
import CampaignManagerPreview from '@/components/SmishingCampaignManager/CampaignManagerPreview'
import { mapGetters } from 'vuex'
import KContainer from '@/components/KContainer/KContainer'
import CampaignManagerNewInstanceModal from '@/components/SmishingCampaignManager/CampaignManagerNewInstanceModal'
import NoScenarioModal from '@/components/SmishingCampaignManager/NoScenarioModal'
import NoTargetUserGroupModal from '@/components/SmishingCampaignManager/NoTargetUserGroupModal'
import CreateNewUserGroupModal from '@/components/TargetUsers/CreateNewUserGroupModal'
import NewScenario from '@/components/SmishingScenarios/NewScenario'
import CommonCampaignManagerCreateNewInstanceDialog from '@/components/Common/CampaignManager/CommonCampaignManagerCreateNewInstanceDialog.vue'
import CommonCampaignManagerDeleteDialog from '@/components/Common/CampaignManager/CommonCampaignManagerDeleteDialog.vue'

export default {
  name: 'CampaignManager',
  components: {
    CommonCampaignManagerDeleteDialog,
    CommonCampaignManagerCreateNewInstanceDialog,
    KContainer,
    CampaignManagerPreview,
    CampaignManagerItemTable,
    CampaignManagerParentTable,
    NoScenarioModal,
    NoTargetUserGroupModal,
    CreateNewUserGroupModal,
    NewScenario,
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
      isTargetGroupModalVisible: false,
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
  watch: {
    '$route.query': {
      handler: function (val) {
        if (val?.status === 'parent') {
          this.selectedParentItem = null
          this.selectedInstanceItem = null
          this.isItemTableShowing = false
          this.isFrequencyTableShowing = false
          this.$router.replace('/smishing-simulator/campaign-manager')
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    callForScenarioDetails() {
      SmishingService.getSmishingScenarioFormDetails().then((response) => {
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
    handleOnMultipleDelete() {},
    handleOnRecordButtonClick(row) {
      if (row.total === 1 && row.status !== 'Idle') {
        this.$router.push({
          name: 'Smishing Report',
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
      this.selectedRow = row
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
      this.isTargetGroupModalVisible = false
    },
    handleConfirmTargetGroupModal(group) {
      this.isCreateTargetGroupButtonDisabled = true
      createTargetGroup(group)
        .then(() => {
          this.isTargetGroupModalVisible = false
          this.$refs?.campaignManagerParentTable?.callForData?.()
        })
        .finally(() => (this.isCreateTargetGroupButtonDisabled = false))
    },
    handleShowTargetGroupModal() {
      this.isTargetGroupModalVisible = true
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
      if (row.total === 1 && row.status !== 'Idle') {
        this.$router.push({
          name: 'Smishing Report',
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
