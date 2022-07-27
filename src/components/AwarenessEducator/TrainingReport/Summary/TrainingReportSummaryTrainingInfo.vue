<template>
  <CampaignManagerSummaryCard
    :isLoading="isLoading"
    icon="mdi-alert-circle"
    :title="labels.TrainingInfo"
    :items="getItems"
  >
    <template #TargetUsers="{ props:{ key } }">
      <div class="campaign-manager-summary-card__body-item-key">
        {{ key.slice(0, 1).toUpperCase() + key.slice(1) }}
      </div>
      <div class="campaign-manager-summary-card__body-item-value">
        <span>{{ getBodyValue }}</span>
        <span v-if="false" class="datatable-link" @click="handleAudienceClick">
          {{ getAudienceText }}
        </span>
        <v-tooltip v-if="isTooltip" bottom>
          <template #activator="{on}">
            <v-icon v-on="on" small class="ml-2" color="#000000">mdi-alert-circle</v-icon>
          </template>
          <span>{{ getTooltipText }}</span>
        </v-tooltip>
      </div>
    </template>
    <template #Auto-enroll="{ props:{ key } }">
      <div class="campaign-manager-summary-card__body-item-key">
        {{ key.slice(0, 1).toUpperCase() + key.slice(1) }}
      </div>
      <div
        class="campaign-manager-summary-card__body-item-value"
        style="display: flex; align-items: center;"
      >
        <span
          :class="{
            'mr-4': items.isAutoEnrollDisabled.value
          }"
          >{{ items['Auto-enroll'].value }}
        </span>
        <div
          v-if="items.isAutoEnrollDisabled.value"
          class="training-report-training-delivery-ended-badge"
        >
          Disabled
        </div>
      </div>
    </template>
    <template v-if="isTestTraining" #header-right>
      <div class="campaign-manager-report-summary-campaign-info__right-side">
        <v-btn style="display: none;" />
        <Badge color="#B6791D" text="Marked as Test" :outline="false" />
      </div>
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import Badge from '@/components/Badge'
export default {
  name: 'TrainingReportSummaryTrainingInfo',
  components: { Badge, CampaignManagerSummaryCard },
  props: {
    items: {
      type: Object
    },
    helperData: {
      type: Object
    },
    isTestTraining: {
      type: Boolean
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String
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
    isFromUserGroups() {
      return this.type === 'userGroups'
    },
    isFromPhishingCampaign() {
      return this.type === 'phishingCampaign'
    },
    getTooltipText() {
      const { randomlyUsersCount = 0, totalTargetUserCount } = this.helperData
      return (
        this.isTooltip &&
        `(Only active and random ${randomlyUsersCount} of ${totalTargetUserCount} total users)`
      )
    },
    isTooltip() {
      const { sendOnlyActiveUsers = false, sendRandomlyUsers = false } = this.helperData
      return sendOnlyActiveUsers && sendRandomlyUsers
    },
    getBodyValue() {
      return `${this.items['Target Users'].value} users ${
        this.isTooltip ? `of ${this.helperData?.totalTargetUserCount}` : ''
      }`
    },
    getAudienceText() {
      if (this.isFromUserGroups) return `${this.items.targetGroupCount.value} user groups`

      if (this.isFromPhishingCampaign) return `a phishing campaign results`

      return ''
    }
  },
  methods: {
    handleAudienceClick() {
      this.$emit('audienceClick')
    }
  }
}
</script>
