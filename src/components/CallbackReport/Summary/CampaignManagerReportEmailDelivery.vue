<template>
  <CampaignManagerSummaryCard
    :isLoading="isLoading"
    icon="mdi-send"
    title="Email Delivery"
    :items="items"
  >
    <template #DeliveryStatus="{ props:{ key } }">
      <div class="campaign-manager-summary-card__body-item-key">
        {{ key.slice(0, 1).toUpperCase() + key.slice(1) }}
      </div>
      <div
        class="campaign-manager-summary-card__body-item-value"
        style="display: flex; align-items: center;"
      >
        <span :style="isNotDelivered && { borderRight: '1px solid #e0e0e0' }"
          >{{ getDeliveryValue }}
        </span>
        <template v-if="isNotDelivered">
          <span style="color: #b83a3a; font-weight: 600; font-size: 14px;">
            <v-icon style="margin-top: -2px;" small class="ml-2" color="#B83A3A"
              >mdi-alert-circle</v-icon
            >
            <span>
              {{ getNotDeliveredValue }}
            </span>
          </span>
        </template>
      </div>
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
export default {
  name: 'CampaignManagerReportEmailDelivery',
  components: { CampaignManagerSummaryCard },
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
    isNotDelivered() {
      return !!(this.helperData?.emailNotDeliveredUserCount || 0)
    },
    getDeliveryValue() {
      const { emailDeliveredUserCount = 0, totalTargetUserCount = 0 } = this.helperData
      return `${emailDeliveredUserCount} / ${totalTargetUserCount} sent`
    },
    getNotDeliveredValue() {
      const { emailNotDeliveredUserCount = '' } = this.helperData
      return `${emailNotDeliveredUserCount} not delivered`
    }
  }
}
</script>
