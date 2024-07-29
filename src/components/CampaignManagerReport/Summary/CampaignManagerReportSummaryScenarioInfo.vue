<template>
  <Fragment>
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
            <v-btn class="ml-4" icon @click="handleCategoriesClick">
              <v-icon center color="#2196F3">mdi-eye</v-icon>
            </v-btn>
          </div>
        </div>
      </template>
    </CampaignManagerSummaryCardOneLine>
  </Fragment>
</template>

<script>
import CampaignManagerSummaryCardOneLine from '@/components/CampaignManager/Summary/CampaignManagerSummaryCardOneLine'
import { Fragment } from 'vue-frag'
import CampaignManagerReportSummaryCategoriesPopup from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryCategoriesPopup.vue'
export default {
  name: 'CampaignManagerReportSummaryScenarioInfo',
  components: {
    CampaignManagerSummaryCardOneLine,
    Fragment,
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
