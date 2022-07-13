<template>
  <KContainer tabless id="training-list">
    <NewTrainingModal
      v-if="isShowNewTrainingModal"
      :status="isShowNewTrainingModal"
      :is-edit="isEdit"
      :selected-row="selectedRow"
      @on-close="toggleShowNewTrainingModal"
    />
    <SendTrainingModal
      v-if="isShowSendTrainingModal"
      :status="isShowSendTrainingModal"
      :selected-row="selectedRow"
      @on-close="toggleShowSendTrainingModal"
    />
    <DeleteTrainingDialog
      v-if="isShowDeleteTrainingDialog"
      :status="isShowDeleteTrainingDialog"
      :selected-row="selectedRow"
      @on-close="toggleShowDeleteTrainingDialog"
    />
    <TrainingPreviewDialog
      v-if="isShowPreviewDialog"
      :status="isShowPreviewDialog"
      :selected-row="selectedRow"
      @on-close="toggleShowPreviewDialog"
    />
    <TrainingListTable
      ref="refTable"
      :categories="categories"
      :languages="tableLanguageFilter"
      :target-audiences="targetAudiences"
      @on-action-delete="handleDeleteRowClick"
      @on-preview="toggleShowPreviewDialog"
      @on-add="toggleShowNewTrainingModal"
      @on-edit="handleEditRowClick"
      @on-training="handleSendTrainingRowClick"
    />
  </KContainer>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer'
import TrainingListTable from '@/components/AwarenessEducator/TrainingList/TrainingListTable'
import DeleteTrainingDialog from '@/components/AwarenessEducator/TrainingList/DeleteTrainingDialog'
import TrainingPreviewDialog from '@/components/AwarenessEducator/TrainingPreviewDialog'
import NewTrainingModal from '@/components/AwarenessEducator/NewTraining/NewTrainingModal'
import SendTrainingModal from '@/components/AwarenessEducator/SendTraining/SendTrainingModal'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { getCampaignManagerFormDetails } from '@/api/phishingsimulator'
export default {
  name: 'TrainingList',
  components: {
    SendTrainingModal,
    NewTrainingModal,
    DeleteTrainingDialog,
    TrainingListTable,
    KContainer,
    TrainingPreviewDialog
  },
  provide() {
    return {
      getCategories: () => this.categories,
      getTargetAudiences: () => this.targetAudiences,
      getLanguages: () => this.languages,
      getDistributionSmtpDelayTimeTypes: () => this.distributionSmtpDelayTimeTypes,
      getDistributionEmailOverTimeTypes: () => this.distributionEmailOverTimeTypes
    }
  },
  data() {
    return {
      isShowPreviewDialog: false,
      isShowDeleteTrainingDialog: false,
      isShowNewTrainingModal: false,
      isShowSendTrainingModal: false,
      selectedRow: null,
      isEdit: false,
      categories: [],
      languages: [],
      tableLanguageFilter: [],
      targetAudiences: [],
      distributionEmailOverTimeTypes: [],
      distributionSmtpDelayTimeTypes: []
    }
  },
  created() {
    this.callForCategories()
    this.callForLanguages()
    this.callForTargetAudiences()
    this.callForFormDetails()
  },
  methods: {
    callForCategories() {
      AwarenessEducatorService.getCategories().then((response) => {
        this.categories =
          response?.data?.data?.map((category) => ({ text: category.name, value: category.id })) ||
          []
      })
    },
    callForLanguages() {
      AwarenessEducatorService.getLanguages().then((response) => {
        this.languages =
          response?.data?.data?.map((language) => ({
            text: language.name,
            value: language.id
          })) || []
        this.tableLanguageFilter =
          response?.data?.data?.map((language) => ({
            text: language.name,
            value: language.code
          })) || []
      })
    },
    callForTargetAudiences() {
      AwarenessEducatorService.getTargetAudiences().then((response) => {
        this.targetAudiences =
          response?.data?.data?.map((targetAudience) => ({
            text: targetAudience.name,
            value: targetAudience.id
          })) || []
      })
    },
    callForFormDetails() {
      getCampaignManagerFormDetails().then((response) => {
        const {
          data: { data }
        } = response
        this.distributionEmailOverTimeTypes = data?.distributionEmailOverTimeTypes || []
        this.distributionSmtpDelayTimeTypes = data?.distributionSmtpDelayTimeTypes || []
      })
    },
    toggleShowDeleteTrainingDialog(forceUpdate = false) {
      this.getDataAndReRenderTable(forceUpdate)
      if (this.isShowDeleteTrainingDialog) this.selectedRow = null
      this.isShowDeleteTrainingDialog = !this.isShowDeleteTrainingDialog
    },
    toggleShowPreviewDialog() {
      this.isShowPreviewDialog = !this.isShowPreviewDialog
    },
    toggleShowNewTrainingModal(forceUpdate = false) {
      this.getDataAndReRenderTable(forceUpdate)
      if (this.isShowNewTrainingModal) {
        this.selectedRow = null
        this.isEdit = false
      }
      this.isShowNewTrainingModal = !this.isShowNewTrainingModal
    },
    toggleShowSendTrainingModal(forceUpdate = false) {
      this.getDataAndReRenderTable(forceUpdate)
      if (this.isShowSendTrainingModal) {
        this.selectedRow = null
      }
      this.isShowSendTrainingModal = !this.isShowSendTrainingModal
    },
    getDataAndReRenderTable(forceUpdate = false) {
      if (forceUpdate) this.$refs.refTable.callForData()
    },
    handleDeleteRowClick(row) {
      this.selectedRow = row
      this.toggleShowDeleteTrainingDialog()
    },
    handleEditRowClick(row) {
      this.selectedRow = row
      this.isEdit = true
      this.toggleShowNewTrainingModal()
    },
    handleSendTrainingRowClick(row) {
      this.selectedRow = row
      this.toggleShowSendTrainingModal()
    }
  }
}
</script>
