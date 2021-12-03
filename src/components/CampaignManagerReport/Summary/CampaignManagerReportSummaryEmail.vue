<template>
  <CampaignManagerSummaryCard
    class="mt-4"
    detailable
    icon="mdi-email"
    :show-body-detail.sync="isShowEmailTemplate"
    :title="labels.EmailThatWill"
  >
    <template #body>
      <div v-if="isFormData" class="campaign-manager-last-step__email-template-body pb-4">
        <div class="campaign-manager-last-step__email-template-body-header">
          <div class="campaign-manager-last-step__email-template-body-header-left">
            {{ formData.name }}
          </div>
          <div class="campaign-manager-last-step__email-template-body-header-right">
            <v-btn style="display: none;"></v-btn>
            <Badge
              :color="getBadgeColor(formData.difficulty)"
              :text="getBadgeText(formData.difficulty)"
              :outline="false"
            />
            <Badge color="#E0E0E0" :text="getBadgeText(formData.method)" :outline="false" />
          </div>
        </div>
        <div class="campaign-manager-last-step__email-template-body-header-sub">
          From: {{ formData.fromName }}
          <span>&#60;</span>
          {{ formData.fromAddress }} <span>&#62;</span>
        </div>
        <div></div>
      </div>
      <div
        v-if="isShowEmailTemplate"
        class="campaign-manager-last-step__email-template-body-preview-container"
      >
        <div class="campaign-manager-last-step__email-template-body-preview">
          <KEmailPreview
            v-if="!!formData.emailTemplate"
            :html="formData.emailTemplate"
            is-extra-height
          />
        </div>
      </div>
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import Badge from '@/components/Badge'
import KEmailPreview from '@/components/KEmailPreview'
export default {
  name: 'CampaignManagerReportSummaryEmail',
  components: { KEmailPreview, Badge, CampaignManagerSummaryCard },
  props: {
    formData: {
      type: Object
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
