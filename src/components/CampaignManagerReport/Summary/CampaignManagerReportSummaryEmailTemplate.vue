<template>
  <CampaignManagerSummaryCard
    class="mt-4"
    detailable
    icon="mdi-email"
    :show-body-detail.sync="isShowEmailTemplate"
    :title="labels.EmailThatWill"
  >
    <template #body>
      <div
        v-if="isFormData && formData.emailTemplateParams && formData.selectedPhishingScenario"
        class="campaign-manager-last-step__email-template-body pb-4"
      >
        <div class="campaign-manager-last-step__email-template-body-header">
          <div class="campaign-manager-last-step__email-template-body-header-left">
            {{ formData.emailTemplateParams.name }}
          </div>
          <div class="campaign-manager-last-step__email-template-body-header-right">
            <v-btn style="display: none;"></v-btn>
            <Badge
              :color="getBadgeColor(formData.selectedPhishingScenario.difficulty)"
              :text="getBadgeText(formData.selectedPhishingScenario.difficulty)"
              :outline="false"
            />
            <Badge
              color="#E0E0E0"
              :text="getBadgeText(formData.selectedPhishingScenario.method)"
              :outline="false"
            />
          </div>
        </div>
        <div class="campaign-manager-last-step__email-template-body-header-sub">
          From: {{ formData.emailTemplateParams.fromName }}
          <span>&#60;</span>
          {{ formData.emailTemplateParams.fromAddress }} <span>&#62;</span>
        </div>
        <div></div>
      </div>
      <div
        v-if="isShowEmailTemplate"
        class="campaign-manager-last-step__email-template-body-preview-container"
      >
        <div class="campaign-manager-last-step__email-template-body-preview">
          <div v-html="formData.emailTemplate"></div>
        </div>
      </div>
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import Badge from '@/components/Badge'
export default {
  name: 'CampaignManagerReportSummaryEmailTemplate',
  components: { Badge, CampaignManagerSummaryCard },
  data() {
    return {
      isShowEmailTemplate: false,
      labels,
      formData: {}
    }
  },
  computed: {
    isFormData() {
      return false
    }
  },
  methods: {
    getBadgeColor(text = '') {
      switch (text.toLowerCase()) {
        case 'easy':
          return '#217124'
        case 'medium':
          return '#2196f3'
        case 'hard':
          return '#f56c6c'
        default:
          return '#2196f3'
      }
    },
    getBadgeText(text = '') {
      return text
    }
  }
}
</script>
