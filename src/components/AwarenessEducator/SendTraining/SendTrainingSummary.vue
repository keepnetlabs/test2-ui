<template>
  <div
    class="campaign-manager-last-step__header"
    :style="{
      gridTemplateColumns: '1fr 1fr'
    }"
  >
    <CampaignManagerSummaryCard
      icon="mdi-info"
      :title="labels.TrainingInfo"
      :items="getTrainingInfoItems"
    />
    <CampaignManagerSummaryCard icon="mdi-cog" :title="labels.Settings" :items="getSettingItems" />
  </div>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
export default {
  name: 'SendTrainingSummary',
  components: { CampaignManagerSummaryCard },
  props: {
    formData: {
      type: Object
    }
  },
  data() {
    return {
      labels
    }
  },
  computed: {
    getSettingItems() {
      return this?.formData?.settings
    },
    getTrainingInfoItems() {
      return this?.formData?.trainingInfo
    }
  }
}
</script>
