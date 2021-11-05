<template>
  <CampaignManagerSummaryCard icon="mdi-alert-circle" :title="labels.ScenarioInfo" :items="items" />
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
export default {
  name: 'CampaignManagerReportSummaryScenarioInfo',
  components: { CampaignManagerSummaryCard },
  data() {
    return {
      labels,
      items: {
        Name: 'Reset Password',
        Method: 'Data Submission',
        Difficulty: 'Medium',
        Languages: 'Turkish, English'
      }
    }
  }
}
</script>
