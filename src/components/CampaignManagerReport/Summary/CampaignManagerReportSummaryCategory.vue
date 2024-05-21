<template>
  <CampaignManagerSummaryCard hideHeader class="mt-4" :isLoading="isFetchingSummary">
    <template #header> </template>
    <template #body>
      <div v-if="!isFetchingSummary" class="campaign-manager-last-step__email-template-body pb-4">
        <div
          class="campaign-manager-last-step__email-template-body-header-sub"
          style="font-size: 20px;"
        >
          <span style="font-weight: 600;">Category:</span> {{ category }}
        </div>
      </div>
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import { useLoading } from '@/hooks/useLoading'

export default {
  name: 'CampaignManagerReportSummaryEmail',
  components: {
    CampaignManagerSummaryCard
  },
  mixins: [useLoading],
  props: {
    category: {
      type: String
    },
    isFetchingSummary: {
      type: Boolean
    }
  }
}
</script>
