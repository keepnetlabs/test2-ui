<template>
  <CampaignManagerSummaryCard
    class="mt-4"
    detailable
    icon="mdi-email"
    :isLoading="isFetchingSummary"
    :show-body-detail.sync="isShowEmailTemplate"
    :title="labels.EnrollmentEmailTemplate"
  >
    <template #body>
      <div v-if="isFormData" class="training-report-enrollment-template__body pb-4">
        <div class="training-report-enrollment-template__template-name">
          {{ formData.name }}
        </div>
        <div class="training-report-enrollment-template__created-by">
          Training enrollment email template • <span style="font-weight: 400;">by</span>
          {{ formData.createdBy }}
        </div>
        <div class="training-report-enrollment-template__description">
          {{ formData.description }}
        </div>
      </div>
      <div
        v-if="isShowEmailTemplate"
        class="campaign-manager-last-step__email-template-body-preview-container"
      >
        <div class="campaign-manager-last-step__email-template-body-preview">
          <DatatableLoading v-if="isLoading" :loading="isLoading" />
          <KEmailPreview v-else :html="emailTemplate" is-extra-height />
        </div>
      </div>
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import KEmailPreview from '@/components/KEmailPreview'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import { useLoading } from '@/hooks/useLoading'
import { getDefaultEmailTemplate, getEmailTemplate } from '@/api/company'

export default {
  name: 'TrainingReportEnrollmentEmail',
  components: {
    DatatableLoading,
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
    trainingEmailNotificationTemplateTypeResourceId: {
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
  },
  watch: {
    isShowEmailTemplate(val = false) {
      if (val && !this.emailTemplate) {
        this.callForTemplate()
      }
    }
  },
  methods: {
    callForTemplate() {
      if (this.trainingEmailNotificationTemplateTypeResourceId) {
        this.setLoading(true)
        getDefaultEmailTemplate(this.trainingEmailNotificationTemplateTypeResourceId)
          .then((response) => {
            const {
              data: { data }
            } = response
            this.formData = {
              template: data.template.template
            }
          })
          .finally(this.setLoading)
      }
    }
  }
}
</script>
