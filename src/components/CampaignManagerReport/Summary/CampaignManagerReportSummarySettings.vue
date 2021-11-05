<template>
  <CampaignManagerSummaryCard class="ml-4" icon="mdi-cog" :title="labels.Settings" :items="items" />
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
export default {
  name: 'CampaignManagerReportSummarySettings',
  components: { CampaignManagerSummaryCard },
  data() {
    return {
      labels,
      items: {
        Languages: 'Turkish,English,German,French',
        'Excluded from reports': 'Yes',
        Duration: '3 Days',
        SMTP: 'default_smtp_name'
      }
    }
  }
}
</script>
