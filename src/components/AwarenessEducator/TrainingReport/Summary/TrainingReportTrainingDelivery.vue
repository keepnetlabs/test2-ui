<template>
  <CampaignManagerSummaryCard
    :isLoading="isLoading"
    icon="mdi-send"
    :title="getCardTitle"
    :items="getItems"
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
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '../../../TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
export default {
  name: 'TrainingReportTrainingDelivery',
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
    },
    trainingType: {
      type: String
    }
  },
  data() {
    return {
      labels
    }
  },
  computed: {
    getCardTitle() {
      if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) return labels.PosterDelivery
      else if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC)
        return labels.InfographicDelivery
      else if (
        this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
        this.trainingType === TRAINING_LIBRARY_TYPES.LEARNING_PATH
      )
        return labels.LearningPathDelivery
      return labels.TrainingDelivery
    },
    getItems() {
      const newItems = { ...this.items }
      Object.keys(this.items).forEach((key) => {
        if (!newItems[key].show) delete newItems[key]
        else newItems[key] = newItems[key].value
      })
      return newItems
    },
    isNotDelivered() {
      return !!(this.helperData?.emailErrorUserCount || 0)
    },
    getDeliveryValue() {
      const { emailDeliveredUserCount = 0, totalTargetUserCount = 0 } = this.helperData
      return `${emailDeliveredUserCount} / ${totalTargetUserCount} sent`
    },
    getNotDeliveredValue() {
      const { emailErrorUserCount = '' } = this.helperData
      return `${emailErrorUserCount} not delivered`
    }
  }
}
</script>
