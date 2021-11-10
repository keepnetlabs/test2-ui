<template>
  <CampaignManagerSummaryCard class="ml-4" icon="mdi-cog" :title="labels.Settings" :items="items" />
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
export default {
  name: 'CampaignManagerReportSummarySettings',
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
