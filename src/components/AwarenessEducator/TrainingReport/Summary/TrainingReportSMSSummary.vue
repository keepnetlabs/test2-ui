<template>
  <CampaignManagerSummaryCardOneLine
    :isLoading="isLoading"
    icon="mdi-message-processing"
    :title="labels.SMSInfo"
    :items="getItems"
  >
    <template #DeliveryStatus>
      <div class="campaign-manager-summary-card__body-item-key">
        Number Of SMS Has Been Sent
      </div>
      <div
        class="campaign-manager-summary-card__body-item-value"
        style="display: flex; align-items: center;"
      >
        <span>
          {{ getDeliveryValue }}
        </span>
        <v-icon small class="ml-2" color="#383B41">mdi-alert-circle</v-icon>
      </div>
    </template>
  </CampaignManagerSummaryCardOneLine>
</template>

<script>
import CampaignManagerSummaryCardOneLine from '@/components/CampaignManager/Summary/CampaignManagerSummaryCardOneLine'
import labels from '@/model/constants/labels'
export default {
  name: 'TrainingReportSMSSummary',
  components: { CampaignManagerSummaryCardOneLine },
  props: {
    items: {
      type: Object
    },
    helperData: {
      type: Object
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      labels
    }
  },
  computed: {
    getItems() {
      const newItems = { ...this.items }
      Object.keys(this.items).forEach((key) => {
        if (!newItems[key].show) delete newItems[key]
        else newItems[key] = newItems[key].value
      })
      return newItems
    },
    getDeliveryValue() {
      return `${this.helperData?.sentCount || 0} sent`
    }
  }
}
</script>
