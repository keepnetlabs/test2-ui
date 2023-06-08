<template>
  <CampaignManagerSummaryCard
    :isLoading="isLoading"
    icon="mdi-alert-circle"
    :title="labels.CampaignInfo"
    :items="items"
  >
    <template #TargetUsers="{ props:{ key } }">
      <div class="campaign-manager-summary-card__body-item-key">
        {{ key.slice(0, 1).toUpperCase() + key.slice(1) }}
      </div>
      <div class="campaign-manager-summary-card__body-item-value">
        <span>{{ getBodyValue }}</span>
        <v-tooltip v-if="isTooltip" bottom>
          <template #activator="{on}">
            <v-icon v-on="on" small class="ml-2" color="#000000">mdi-alert-circle</v-icon>
          </template>
          <span>{{ getTooltipText }}</span>
        </v-tooltip>
      </div>
    </template>
    <template v-if="isTestCampaign" #header-right>
      <div class="campaign-manager-report-summary-campaign-info__right-side">
        <v-btn style="display: none;" />
        <Badge color="#B6791D" text="Test Campaign" :outline="false" />
      </div>
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import Badge from '@/components/Badge'
export default {
  name: 'CampaignManagerReportSummaryCampaignInfo',
  components: { Badge, CampaignManagerSummaryCard },
  props: {
    items: {
      type: Object
    },
    helperData: {
      type: Object
    },
    isTestCampaign: {
      type: Boolean
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
    getTooltipText() {
      const { randomlyUsersCount = 0, totalTargetUserCount = 0 } = this.helperData || {}
      return (
        this.isTooltip &&
        `(Only active and random ${randomlyUsersCount} of ${totalTargetUserCount} total users)`
      )
    },
    isTooltip() {
      const { sendOnlyActiveUsers = false, sendRandomlyUsers = false } = this.helperData || {}
      return sendOnlyActiveUsers && sendRandomlyUsers
    },
    getBodyValue() {
      return `${this.items['Target Users']} users ${
        this.isTooltip ? `of ${this.helperData?.totalTargetUserCount}` : ''
      }`
    }
  }
}
</script>
