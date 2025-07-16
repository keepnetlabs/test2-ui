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
      :title="getCardTitle"
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
      <template #TargetGroups="{ props: { key, val } }">
        <div class="campaign-manager-summary-card__body-item-key">Target Groups</div>
        <div class="campaign-manager-summary-card__body-item-value">
          <div
            class="mt-n2 cursor-pointer"
            style="max-height: 19px;"
            @click="handleViewTargetGroupsClick"
          >
            <v-btn class="mr-1" style="margin-top: -1px;" icon>
              <v-icon center size="20" color="#2196F3">mdi-eye</v-icon>
            </v-btn>
            <span style="color: #2196f3; font-weight: 600;"
              >{{ getTargetGroups.length }}
              {{ getTargetGroups.length > 1 ? 'groups' : 'group' }}</span
            >
          </div>
        </div>
      </template>
      <template v-if="false" #Auto-enroll="{ props: { key } }">
        <div class="campaign-manager-summary-card__body-item-key">
          {{ key.slice(0, 1).toUpperCase() + key.slice(1) }}
        </div>
        <div
          v-if="false"
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
  </Fragment>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import Badge from '@/components/Badge'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
import CommonReportViewTargetGroupsModal from '@/components/Common/Report/CommonReportViewTargetGroupsModal'
import { Fragment } from 'vue-frag'
export default {
  name: 'TrainingReportSummaryTrainingInfo',
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
    },
    trainingType: {
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
    getCardTitle() {
      if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER)
        return labels.PosterEnrollmentInfo
      else if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC)
        return labels.InfographicEnrollmentInfo
      else if (
        this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
        this.trainingType === TRAINING_LIBRARY_TYPES.LEARNING_PATH
      )
        return labels.LearningPathEnrollmentInfo
      return labels.TrainingEnrollmentInfo
    },
    getItems() {
      const newItems = { ...this.items }
      Object.keys(this.items).forEach((key) => {
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
    getAudienceText() {
      if (this.isFromUserGroups) return `${this.items.targetGroupCount.value} user groups`
      if (this.isFromPhishingCampaign) return `a phishing campaign results`
      return ''
    },
    getBodyValue() {
      const targetUsers = this.items['Target Users']?.value || 0
      return `${targetUsers} ${targetUsers > 1 ? 'users' : 'user'}`
    },
    getTargetGroups() {
      return this.items?.['Target Groups']?.value || []
    }
  },
  methods: {
    handleAudienceClick() {
      this.$emit('audienceClick')
    },
    handleViewTargetGroupsClick() {
      this.isTargetGroupsModalVisible = true
    },
    handleCloseTargetGroupsModal() {
      this.isTargetGroupsModalVisible = false
    }
  }
}
</script>
