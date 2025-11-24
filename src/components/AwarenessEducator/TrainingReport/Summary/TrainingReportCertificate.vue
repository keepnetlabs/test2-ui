<template>
  <CampaignManagerSummaryCard
    class="mt-4"
    detailable
    icon="mdi-book-open"
    detailable-button-id="btn--preview-training-report-certificate"
    :isLoading="isFetchingSummary"
    :show-body-detail.sync="isShowEmailTemplate"
    :title="labels.CertificateTemplate"
  >
    <template #body>
      <div v-if="isFormData" class="training-report-enrollment-template__body pb-4">
        <div class="training-report-enrollment-template__template-name">
          {{ formData.name }}
        </div>
        <div class="training-report-enrollment-template__created-by">
          Certificate email template • <span style="font-weight: 400;">by</span>
          {{ formData.createdBy }}
        </div>
        <div class="training-report-enrollment-template__description">
          {{ formData.description }}
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
        style="max-height: 800px !important;"
      >
        <div class="campaign-manager-last-step__email-template-body-preview">
          <KEmailPreview :html="selectedTemplate" is-extra-height />
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
export default {
  name: 'TrainingReportCertificate',
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
    certificateEmailNotificationTemplateTypeResourceId: {
      type: String
    }
  },
  data() {
    return {
      isShowEmailTemplate: false,
      labels,
      emailTemplate: null,
      selectedTemplate: ''
    }
  },
  computed: {
    isFormData() {
      return Object.keys(this.formData).length
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
  watch: {
    'formData.selectedLanguageResourceId': {
      immediate: true,
      handler(val) {
        this.updateSelectedTemplate()
      }
    },
    'formData.languages': {
      deep: true,
      handler() {
        this.updateSelectedTemplate()
      }
    }
  },
  methods: {
    updateSelectedTemplate() {
      const selectedLanguage = this.formData.languages?.find(
        (lang) => lang.languageTypeResourceId === this.formData.selectedLanguageResourceId
      )
      this.selectedTemplate = selectedLanguage?.template || this.formData.template || ''
    },
    handleLanguageChange(languageResourceId) {
      const selectedLanguage = this.formData.languages.find(
        (lang) => lang.languageTypeResourceId === languageResourceId
      )
      if (selectedLanguage) {
        this.$set(this.formData, 'selectedLanguageResourceId', languageResourceId)
        this.$set(this.formData, 'selectedLanguageName', selectedLanguage.languageTypeName)
        this.selectedTemplate = selectedLanguage.template
      }
    }
  }
}
</script>
