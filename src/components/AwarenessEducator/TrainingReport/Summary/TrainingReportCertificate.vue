<template>
  <CampaignManagerSummaryCard
    class="mt-4"
    detailable
    icon="mdi-book-open"
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
        v-if="isShowEmailTemplate"
        class="campaign-manager-last-step__email-template-body-preview-container"
        style="max-height: 800px !important;"
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
import { useLoading } from '@/hooks/useLoading'
export default {
  name: 'TrainingReportCertificate',
  components: {
    KEmailPreview,
    CampaignManagerSummaryCard
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
      emailTemplate: null
    }
  },
  computed: {
    isFormData() {
      return Object.keys(this.formData).length
    }
  }
}
</script>
