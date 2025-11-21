<template>
  <CampaignManagerSummaryCard
    class="mt-4"
    detailable
    icon="mdi-email"
    detailable-button-id="btn--preview-training-report-enrollment"
    :isLoading="isFetchingSummary"
    :show-body-detail.sync="isShowEmailTemplate"
    :title="labels.EnrollmentEmailTemplate"
  >
    <template #body>
      <div v-if="isFormData" class="training-report-enrollment-template__body pb-4">
        <div class="training-report-enrollment-template__template-name">
          {{ formData.name }}
        </div>
        <div class="training-report-enrollment-template__created-by" style="margin-bottom: 0;">
          {{ getEnrollmentTextByTrainingType }} enrollment email template •
          <span style="font-weight: 400;">by</span>
          {{ formData.createdBy }}
        </div>
      </div>
      <div
        v-if="isShowEmailTemplate && formData.languages?.length > 0"
        style="display: flex; justify-content: flex-start; padding: 12px 0; margin-left: 24px;"
      >
        <InputLanguagePreview
          :value="formData.selectedLanguageResourceId"
          style="max-width: 240px;"
          hide-details
          :label="templateLanguageLabel"
          :items="getLanguageItems"
          @input="handleLanguageChange"
        />
      </div>
      <div
        v-if="isShowEmailTemplate"
        class="campaign-manager-last-step__email-template-body-preview-container"
      >
        <div class="campaign-manager-last-step__email-template-body-preview">
          <KEmailPreview :html="formData.template" is-extra-height />
        </div>
      </div>
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import KEmailPreview from '@/components/KEmailPreview'
import InputLanguagePreview from '@/components/Common/Inputs/InputLanguagePreview.vue'
import { useLoading } from '@/hooks/useLoading'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
export default {
  name: 'TrainingReportEnrollmentEmail',
  components: {
    KEmailPreview,
    CampaignManagerSummaryCard,
    InputLanguagePreview
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
      isShowEmailTemplate: false,
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
    },
    templateLanguageLabel() {
      const count = this.formData.languages?.length || 0
      return `Template Language${count > 1 ? 's' : ''} (${count})`
    },
    getLanguageItems() {
      return this.formData?.languages?.map((lang) => ({
        text: lang.languageTypeName,
        value: lang.languageTypeResourceId
      })) || []
    }
  },
  methods: {
    handleLanguageChange(languageResourceId) {
      this.formData.selectedLanguageResourceId = languageResourceId
      const selectedLanguage = this.formData.languages.find(
        (lang) => lang.languageTypeResourceId === languageResourceId
      )
      if (selectedLanguage) {
        this.formData.selectedLanguageName = selectedLanguage.languageTypeName
        this.formData.template = selectedLanguage.template
      }
    }
  }
}
</script>
