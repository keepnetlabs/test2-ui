<template>
  <KContainer tabless id="training-list">
    <NewTrainingModal
      v-if="isShowNewTrainingModal"
      :status="isShowNewTrainingModal"
      :is-edit="isEdit"
      :selected-row="selectedRow"
      @on-close="toggleShowNewTrainingModal"
    />
    <TrainingPreviewDialog
      v-if="isShowPreviewDialog"
      :status="isShowPreviewDialog"
      :selected-row="selectedRow"
      :languages="languages"
      @on-close="toggleShowPreviewDialog"
    />
    <SendTrainingModal
      v-if="isShowSendTrainingModal"
      :status="isShowSendTrainingModal"
      :selected-row="selectedRow"
      :certificate-email-notification-template-type-resource-id="
        certificateEmailNotificationTemplateTypeResourceId
      "
      :reminder-email-notification-template-type-resource-id="
        reminderEmailNotificationTemplateTypeResourceId
      "
      :training-email-notification-template-type-resource-id="
        trainingEmailNotificationTemplateTypeResourceId
      "
      :enum-types="enumTypes"
      :distributionDelayTimeTypes="distributionDelayTimeTypes"
      @on-close="toggleShowSendTrainingModal"
      @on-show-training-summary="handlePreviewRowClick(selectedRow)"
    />
    <DeleteTrainingDialog
      v-if="isShowDeleteTrainingDialog"
      :status="isShowDeleteTrainingDialog"
      :selected-row="selectedRow"
      @on-close="toggleShowDeleteTrainingDialog"
    />
    <TrainingListTable
      ref="refTable"
      :categories="categories"
      :languages="tableLanguageFilter"
      :target-audiences="targetAudiences"
      :scorm-types="scormTypes"
      @on-action-delete="handleDeleteRowClick"
      @on-preview="handlePreviewRowClick"
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
import useAwarenessHelperCalls from '@/hooks/awareness-educator/useAwarenessHelperCalls'
import AwarenessEducatorService from '@/api/awarenessEducator'
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
  mixins: [useAwarenessHelperCalls],
  provide() {
    return {
      getCategories: () => this.categories,
      getScormTypes: () => this.scormTypes,
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
      enumTypes: {},
      distributionEmailOverTimeTypes: [],
      distributionSmtpDelayTimeTypes: [],
      distributionDelayTimeTypes: [],
      certificateEmailNotificationTemplateTypeResourceId: '',
      reminderEmailNotificationTemplateTypeResourceId: '',
      trainingEmailNotificationTemplateTypeResourceId: ''
    }
  },
  created() {
    this.callForFormDetails()
  },
  methods: {
    callForFormDetails() {
      AwarenessEducatorService.getEnrollmentFormDetails().then((response) => {
        const {
          certificateEmailNotificationTemplateTypeResourceId = '',
          reminderEmailNotificationTemplateTypeResourceId = '',
          trainingEmailNotificationTemplateTypeResourceId = '',
          enumNameValuePairs = {}
        } = response?.data?.data || {}
        // TODO: Fetch distributionDelayTimeTypes
        this.distributionDelayTimeTypes = [
          {
            text: 'seconds',
            value: '1'
          },
          {
            text: 'minutes',
            value: '2'
          },
          {
            text: 'hours',
            value: '3'
          }
        ]
        this.enumTypes = enumNameValuePairs
        this.certificateEmailNotificationTemplateTypeResourceId = certificateEmailNotificationTemplateTypeResourceId
        this.reminderEmailNotificationTemplateTypeResourceId = reminderEmailNotificationTemplateTypeResourceId
        this.trainingEmailNotificationTemplateTypeResourceId = trainingEmailNotificationTemplateTypeResourceId
      })
    },
    toggleShowDeleteTrainingDialog(forceUpdate = false) {
      this.getDataAndReRenderTable(forceUpdate)
      if (forceUpdate) this.$refs.refTable.$refs.refTable.unSelectRow(this.selectedRow)
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
    },
    handlePreviewRowClick(row) {
      this.selectedRow = row
      this.toggleShowPreviewDialog()
    }
  }
}
</script>
