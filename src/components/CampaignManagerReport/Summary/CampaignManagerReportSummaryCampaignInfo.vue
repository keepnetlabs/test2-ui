<template>
  <CampaignManagerSummaryCard icon="mdi-alert-circle" :title="labels.CampaignInfo" :items="items">
    <template #NotDelivered="{ props:{ key, val } }">
      <div class="campaign-manager-summary-card__body-item-key">
        {{ key.slice(0, 1).toUpperCase() + key.slice(1) }}
        <v-icon small class="ml-2" color="#F56C6C">mdi-alert-circle</v-icon>
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
  data() {
    return {
      labels,
      items: {
        'Start Date': '28.05.2021 16:29:00',
        'End Date': '29.05.2021 16:29:00',
        'Total Target Users': 145,
        'Not Delivered': 4
      }
    }
  }
}
</script>

<style lang="scss"></style>
