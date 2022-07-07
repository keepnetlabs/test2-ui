<template>
  <div class="campaign-manager-last-step__header" style="grid-template-columns: '1fr 1fr';">
    <CampaignManagerSummaryCard
      icon="mdi-info"
      :title="labels.TrainingInfo"
      :items="getTrainingItems"
    />
    <CampaignManagerSummaryCard icon="mdi-cog" :title="labels.Settings" :items="getSettingsItems" />
  </div>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
export default {
  name: 'SendTrainingSummary',
  components: { CampaignManagerSummaryCard },
  data() {
    labels
  },
  computed: {
    getTrainingItems() {
      return {}
    }
  }
}
</script>
