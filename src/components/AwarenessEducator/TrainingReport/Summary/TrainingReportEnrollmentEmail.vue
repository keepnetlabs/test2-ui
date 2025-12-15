<template>
  <div>
    <NotificationTemplatesPreviewDialog
      v-if="isShowEmailTemplateDialog"
      :status="isShowEmailTemplateDialog"
      :template-data="formData"
      :is-nested="false"
      @on-close="isShowEmailTemplateDialog = false"
    />
    <CampaignManagerSummaryCard
      class="mt-4"
      detailable
      is-training
      icon="mdi-email"
      detailable-button-id="btn--preview-training-report-enrollment"
      :isLoading="isFetchingSummary"
      :show-body-detail.sync="isShowEmailTemplateDialog"
      :title="labels.EnrollmentEmailTemplate"
    />
  </div>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import NotificationTemplatesPreviewDialog from '@/components/Company Settings/NotificationTemplatesPreviewDialog.vue'
import { useLoading } from '@/hooks/useLoading'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
export default {
  name: 'TrainingReportEnrollmentEmail',
  components: {
    CampaignManagerSummaryCard,
    NotificationTemplatesPreviewDialog
  },
  mixins: [useLoading],
  props: {
    formData: {
      type: Object
    },
    isFetchingSummary: {
      type: Boolean
    },
    trainingEmailNotificationTemplateTypeResourceId: {
      type: String
    },
    trainingType: {
      type: String,
      default: ''
    },
    isSurvey: {
      type: Boolean
    }
  },
  data() {
    return {
      isShowEmailTemplateDialog: false,
      labels
    }
  },
  computed: {
    isFormData() {
      return Object.keys(this.formData).length
    },
    getEnrollmentTextByTrainingType() {
      if (this.isSurvey) return labels.Survey
      if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) return 'Poster'
      else if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC)
        return 'Infographic'
      else if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING) return 'Training'
      else if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER)
        return 'Screensaver'
      return 'Learning Path'
    }
  }
}
</script>
