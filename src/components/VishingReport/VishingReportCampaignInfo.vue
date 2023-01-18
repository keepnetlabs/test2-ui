<template>
  <CampaignManagerSummaryCard
    :isLoading="isLoading"
    icon="mdi-information"
    :title="labels.CampaignInfo"
    :items="getItems"
  >
    <template #TargetUsers="{ props:{ key } }">
      <div class="campaign-manager-summary-card__body-item-key">
        {{ key.slice(0, 1).toUpperCase() + key.slice(1) }}
      </div>
      <div class="campaign-manager-summary-card__body-item-value">
        <span>{{ getBodyValue }}</span>
      </div>
    </template>
    <template v-if="isTestTraining" #header-right>
      <div class="campaign-manager-report-summary-campaign-info__right-side">
        <v-btn style="display: none;" />
        <Badge color="#B6791D" text="Test Campaign" :outline="false" />
      </div>
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import Badge from '@/components/Badge'
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'

export default {
  name: 'VishingReportCampaignInfo',
  components: { Badge, CampaignManagerSummaryCard },
  props: {
    items: {
      type: Object
    },
    helperData: {
      type: Object
    },
    isTestTraining: {
      type: Boolean
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String
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
    getBodyValue() {
      return `${this.items['Target Users']?.value} users`
    }
  }
}
</script>
