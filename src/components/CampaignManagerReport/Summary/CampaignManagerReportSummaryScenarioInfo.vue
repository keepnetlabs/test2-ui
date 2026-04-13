<template>
  <div style="display: contents;">
    <CampaignManagerReportSummaryCategoriesPopup
      :status="isCategoriesPopupVisible"
      :categories="categories"
      :campaignName="campaignName"
      @close="handleCloseCategoriesPopuup"
    />
    <CampaignManagerSummaryCardOneLine
      :isLoading="isLoading"
      class="training-report-summary__sms"
      icon="mdi-alert-circle"
      title="Scenario Info"
      :items="items"
    >
      <template #NumberOfCategories="{ props: { key } }">
        <div class="campaign-manager-summary-card__body-item-key">
          Number of Categories
        </div>
        <div class="campaign-manager-summary-card__body-item-value">
          <div class="d-flex align-center">
            <span>{{ items[key] }}</span>
            <v-icon class="ml-4" color="#2196F3" style="cursor: pointer;" @click="handleCategoriesClick">mdi-eye</v-icon>
          </div>
        </div>
      </template>
      <template #Languages="{ props: { val } }">
        <div class="campaign-manager-summary-card__body-item-key">
          Languages
        </div>
        <div class="campaign-manager-summary-card__body-item-value">
          <CampaignInfoLanguages :value="val" />
        </div>
      </template>
    </CampaignManagerSummaryCardOneLine>
  </div>
</template>

<script>
import CampaignManagerSummaryCardOneLine from '@/components/CampaignManager/Summary/CampaignManagerSummaryCardOneLine'
import CampaignInfoLanguages from '@/components/Common/Report/CampaignInfoLanguages.vue'
import CampaignManagerReportSummaryCategoriesPopup from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryCategoriesPopup.vue'
export default {
  name: 'CampaignManagerReportSummaryScenarioInfo',
  components: {
    CampaignManagerSummaryCardOneLine,
    CampaignInfoLanguages,
    CampaignManagerReportSummaryCategoriesPopup
  },
  props: {
    items: {
      type: Object
    },
    campaignName: {
      type: String
    },
    categories: {
      type: Array
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCategoriesPopupVisible: false
    }
  },
  methods: {
    handleCategoriesClick() {
      this.isCategoriesPopupVisible = true
    },
    handleCloseCategoriesPopuup() {
      this.isCategoriesPopupVisible = false
    }
  }
}
</script>
