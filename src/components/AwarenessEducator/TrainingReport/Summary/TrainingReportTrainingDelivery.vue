<template>
  <CampaignManagerSummaryCard
    :isLoading="isLoading"
    icon="mdi-send"
    :title="labels.TrainingDelivery"
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
    <template v-if="false" #ReminderOptions="{ props:{ key } }">
      <div class="campaign-manager-summary-card__body-item-key">
        {{ key.slice(0, 1).toUpperCase() + key.slice(1) }}
      </div>
      <div
        class="campaign-manager-summary-card__body-item-value"
        style="display: flex; align-items: center;"
      >
        <span
          :class="{
            'mr-4': items.isEnded.value
          }"
          :style="isNotDelivered && { borderRight: '1px solid #e0e0e0' }"
          >{{ items['Reminder Options'].value }}
        </span>
        <div v-if="items.isEnded.value" class="training-report-training-delivery-ended-badge">
          Ended
        </div>
      </div>
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
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
      Object.keys(this.items).map((key) => {
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
      const { emailNotDeliveredUserCount = '' } = this.helperData
      return `${emailNotDeliveredUserCount} not delivered`
    }
  }
}
</script>
