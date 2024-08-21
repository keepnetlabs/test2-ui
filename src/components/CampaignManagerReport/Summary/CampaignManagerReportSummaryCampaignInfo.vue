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
      icon="mdi-alert-circle"
      :title="labels.CampaignInfo"
      :items="items"
    >
      <template #body="{ items }">
        <div class="campaign-manager-summary-card__body">
          <div class="campaign-manager-summary-card__body-container">
            <div
              v-for="(val, key) in items"
              :key="key"
              class="campaign-manager-summary-card__body-item"
            >
              <div
                v-if="key === 'Target Groups'"
                class="campaign-manager-summary-card__body-item-key"
              >
                Target Groups
              </div>
              <div v-else class="campaign-manager-summary-card__body-item-key">
                {{ key.slice(0, 1).toUpperCase() + key.slice(1) }}
              </div>
              <div v-if="key === 'Target Groups'">
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
              </div>
              <div v-else-if="key === 'Target Users'">
                <div class="campaign-manager-summary-card__body-item-value">
                  <span>{{ getBodyValue }}</span>
                  <v-tooltip v-if="isTooltip" bottom>
                    <template #activator="{ on }">
                      <v-icon v-on="on" small class="ml-2" color="#000000">mdi-alert-circle</v-icon>
                    </template>
                    <span>{{ getTooltipText }}</span>
                  </v-tooltip>
                </div>
              </div>
              <div v-else class="campaign-manager-summary-card__body-item-value">
                {{ val }}
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="isTestCampaign" #header-right>
        <div class="campaign-manager-report-summary-campaign-info__right-side">
          <v-btn style="display: none;" />
          <Badge color="#B6791D" text="Test Campaign" :outline="false" />
        </div>
      </template>
    </CampaignManagerSummaryCard>
  </Fragment>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import Badge from '@/components/Badge'
import CommonReportViewTargetGroupsModal from '@/components/Common/Report/CommonReportViewTargetGroupsModal'
import { Fragment } from 'vue-frag'
export default {
  name: 'CampaignManagerReportSummaryCampaignInfo',
  components: { Badge, CampaignManagerSummaryCard, CommonReportViewTargetGroupsModal, Fragment },
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
      labels,
      isTargetGroupsModalVisible: false
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
    },
    getTargetGroups() {
      return this.helperData?.targetGroups || []
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
