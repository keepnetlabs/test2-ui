<template>
  <CampaignManagerSummaryCard
    :isLoading="isLoading"
    icon="mdi-information"
    :title="labels.EnrollmentInfo"
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
      </div>
    </template>
    <template #Non-TargetUsers="{ props:{ key } }">
      <div class="campaign-manager-summary-card__body-item-key">
        {{ key.slice(0, 1).toUpperCase() + key.slice(1) }}
      </div>
      <div class="campaign-manager-summary-card__body-item-value">
        <span>{{ getNonTargetUsersValue }}</span>
      </div>
    </template>
    <template v-if="false" #Auto-enroll="{ props:{ key } }">
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
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import Badge from '@/components/Badge'
export default {
  name: 'TrainingReportScormEnrollmentInfo',
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
    },
    isSurvey: {
      type: Boolean
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
    getNonTargetUsersValue() {
      const nonTargetUsers = this.items['Non-Target Users']?.value || 0
      return `${nonTargetUsers} ${nonTargetUsers > 1 ? 'users' : 'user'}`
    }
  },
  methods: {
    handleAudienceClick() {
      this.$emit('audienceClick')
    }
  }
}
</script>
