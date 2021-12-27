<template>
  <CampaignManagerSummaryCard icon="mdi-alert-circle" :title="labels.CampaignInfo" :items="items">
    <template #NotDelivered="{ props:{ key, val } }">
      <div class="campaign-manager-summary-card__body-item-key">
        {{ key.slice(0, 1).toUpperCase() + key.slice(1) }}
        <v-icon v-if="val !== 0" small class="ml-2" color="#F56C6C">mdi-alert-circle</v-icon>
      </div>
      <div class="campaign-manager-summary-card__body-item-value">{{ val }}</div>
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
export default {
  name: 'CampaignManagerReportSummaryCampaignInfo',
  components: { CampaignManagerSummaryCard },
  props: {
    items: {
      type: Object
    }
  },
  data() {
    return {
      labels
    }
  }
}
</script>

<style lang="scss"></style>
