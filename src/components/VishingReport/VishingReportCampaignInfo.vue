<template>
  <Fragment>
    <CommonReportViewTargetGroupsModal
      v-if="isTargetGroupsModalVisible"
      :status="isTargetGroupsModalVisible"
      :targetGroups="getTargetGroups"
      @on-close="handleCloseTargetGroupsModal"
    />
    <CampaignManagerSummaryCard
      :isLoading="isLoading"
      icon="mdi-information"
      :title="labels.CampaignInfo"
      :items="getItems"
    >
      <template #TargetUsers="{ props: { key } }">
        <div class="campaign-manager-summary-card__body-item-key">
          {{ key.slice(0, 1).toUpperCase() + key.slice(1) }}
        </div>
        <div class="campaign-manager-summary-card__body-item-value">
          <span>{{ getBodyValue }}</span>
        </div>
      </template>
      <template #TargetGroups="{ props: { val } }">
        <div class="campaign-manager-summary-card__body-item-key">
          {{ val.length > 1 ? 'Target Groups' : 'Target Group' }}
        </div>
        <div class="campaign-manager-summary-card__body-item-value">
          <div class="d-flex align-center">
            <v-btn class="mr-1" icon @click="handleViewTargetGroupsClick">
              <v-icon center size="20" color="#2196F3">mdi-eye</v-icon>
            </v-btn>
            <span style="color: #2196f3; font-weight: 600;"
              >{{ getTargetGroups.length }}
              {{ getTargetGroups.length > 1 ? 'groups' : 'group' }}</span
            >
          </div>
        </div>
      </template>
      <template v-if="isTestTraining" #header-right>
        <div class="campaign-manager-report-summary-campaign-info__right-side">
          <v-btn style="display: none;" />
          <Badge color="#B6791D" text="Test Campaign" :outline="false" />
        </div>
      </template>
    </CampaignManagerSummaryCard>
  </Fragment>
</template>

<script>
import Badge from '@/components/Badge'
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import CommonReportViewTargetGroupsModal from '@/components/Common/Report/CommonReportViewTargetGroupsModal'
import { Fragment } from 'vue-frag'

export default {
  name: 'VishingReportCampaignInfo',
  components: {
    Badge,
    CampaignManagerSummaryCard,
    CommonReportViewTargetGroupsModal,
    Fragment
  },
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
      labels,
      isTargetGroupsModalVisible: false
    }
  },
  computed: {
    getItems() {
      const newItems = { ...this.items }
      Object.keys(this.items).forEach((key) => {
        if (!newItems[key].show) delete newItems[key]
        else newItems[key] = newItems[key].value
      })
      return newItems
    },
    getBodyValue() {
      return `${this.items['Target Users']?.value} users`
    },
    getTargetGroups() {
      return this.items?.['Target Groups']?.value || []
    }
  },
  methods: {
    handleViewTargetGroupsClick() {
      this.isTargetGroupsModalVisible = true
    },
    handleCloseTargetGroupsModal() {
      this.isTargetGroupsModalVisible = false
    }
  }
}
</script>
