<template>
  <KContainer tabless id="training-list">
    <NewTrainingModal
      v-if="isShowNewTrainingModal"
      :status="isShowNewTrainingModal"
      :is-edit="isEdit"
      :selected-row="selectedRow"
      @on-close="toggleShowNewTrainingModal"
    />
    <NewPosterModal
      v-if="isShowNewPosterModal"
      :status="isShowNewPosterModal"
      :is-edit="isEdit"
      :selected-row="selectedRow"
      @on-close="toggleShowNewPosterModal"
    />
    <TrainingPreviewDialog
      v-if="isShowPreviewDialog"
      :status="isShowPreviewDialog"
      :selected-row="selectedRow"
      :languages="languages"
      @on-close="toggleShowPreviewDialog"
    />
    <PosterPreviewDialog
      v-if="isShowPosterPreviewDialog"
      :status="isShowPosterPreviewDialog"
      :selected-row="selectedRow"
      :languages="languages"
      :title="getPosterPreviewDialogTitle"
      :subtitle="getPosterPreviewDialogSubtitle"
      :type="posterPreviewDialogType"
      :show-details="posterPreviewDialogType === 'poster'"
      :show-tabs="posterPreviewDialogType === 'poster'"
      :show-poster-name="posterPreviewDialogType === 'poster'"
      :icon="posterPreviewDialogType === 'poster' ? 'mdi-eye' : 'mdi-download'"
      @on-close="toggleShowPosterPreviewDialog"
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
      @on-add-poster="toggleShowNewPosterModal"
      @on-download-poster="toggleShowPosterDownloadDialog"
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
import { TRAINING_TYPES } from '@/components/AwarenessEducator/utils'
import PosterPreviewDialog from '@/components/AwarenessEducator/Poster/PosterPreviewDialog.vue'
import labels from '@/model/constants/labels'
import NewPosterModal from '@/components/AwarenessEducator/NewPoster/NewPosterModal.vue'
export default {
  name: 'TrainingList',
  components: {
    NewPosterModal,
    PosterPreviewDialog,
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
      isShowNewPosterModal: false,
      isShowPosterPreviewDialog: false,
      posterPreviewDialogType: 'poster',
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
  computed: {
    getPosterPreviewDialogTitle() {
      return this.posterPreviewDialogType === 'poster'
        ? labels.PosterPreview
        : labels.DownloadPoster
    },
    getPosterPreviewDialogSubtitle() {
      return this.posterPreviewDialogType === 'poster' ? '' : this.selectedRow.trainingName
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
    toggleShowPosterPreviewDialog() {
      if (this.isShowPosterPreviewDialog) this.posterPreviewDialogType = 'poster'
      this.isShowPosterPreviewDialog = !this.isShowPosterPreviewDialog
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
    toggleShowPosterDownloadDialog() {
      this.posterPreviewDialogType = 'download'
      this.toggleShowPosterPreviewDialog()
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
      if (row.type.toLowerCase() === TRAINING_TYPES.POSTER.toLowerCase()) {
        return this.toggleShowNewPosterModal()
      }
      this.toggleShowNewTrainingModal()
    },
    handleSendTrainingRowClick(row) {
      this.selectedRow = row
      this.toggleShowSendTrainingModal()
    },
    handlePreviewRowClick(row) {
      this.selectedRow = row
      if (row.type === TRAINING_TYPES.SCORM) this.toggleShowPreviewDialog()
      else this.toggleShowPosterPreviewDialog()
    },
    toggleShowNewPosterModal(forceUpdate = false) {
      this.getDataAndReRenderTable(forceUpdate)
      if (this.isShowNewPosterModal) {
        this.selectedRow = null
        this.isEdit = false
      }
      this.isShowNewPosterModal = !this.isShowNewPosterModal
    }
  }
}
</script>
