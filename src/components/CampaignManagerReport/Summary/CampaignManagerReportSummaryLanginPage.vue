<template>
  <CampaignManagerSummaryCard
    class="mt-4"
    detailable
    icon="mdi-application"
    :show-body-detail.sync="isShowLandingPageTemplate"
    :title="labels.LandingPageWhoUsers"
  >
    <template #body>
      <div v-if="isFormData" class="campaign-manager-last-step__landing-page-template-body pb-4">
        <div class="campaign-manager-last-step__landing-page-template-body-header">
          <div class="campaign-manager-last-step__landing-page-template-body-header-left">
            <span class="campaign-manager-last-step__landing-page-template-body-header-left-url"
              >URL:</span
            >
            {{ formData.urlTemplate }}
          </div>
          <div class="campaign-manager-last-step__landing-page-template-body-header-right">
            <v-btn style="display: none;"></v-btn>
            <Badge
              :color="getBadgeColor(formData.difficulty)"
              :text="getBadgeText(formData.difficulty)"
              :outline="false"
            />
            <Badge color="#E0E0E0" :text="getBadgeText(formData.method)" :outline="false" />
          </div>
        </div>
      </div>
      <div
        v-if="isShowLandingPageTemplate"
        class="campaign-manager-last-step__email-template-body-preview-container"
      >
        <div class="campaign-manager-last-step__email-template-body-preview">
          <div
            v-html="formData.landingPageTemplate"
            class="grapesjs-reset-css"
            style="pointer-events: none;"
          ></div>
        </div>
      </div>
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import Badge from '@/components/Badge'
import labels from '@/model/constants/labels'
export default {
  name: 'CampaignManagerReportSummaryLanginPage',
  components: { Badge, CampaignManagerSummaryCard },
  props: {
    formData: {
      type: Object
    }
  },
  data() {
    return {
      labels,
      isShowLandingPageTemplate: false
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
