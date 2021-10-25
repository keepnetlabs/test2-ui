<template>
  <div class="campaign-manager-last-step">
    <div class="campaign-manager-last-step__header">
      <CampaignManagerSummaryCard
        icon="mdi-alert-circle"
        :title="labels.ScenarioInfo"
        :items="getScenarioInfoItems"
      />
      <CampaignManagerSummaryCard
        icon="mdi-cog"
        :title="labels.Settings"
        :items="getSettingsItems"
      />
      <CampaignManagerSummaryCard
        v-if="Object.keys(getOtherSettingsItems).length"
        icon="mdi-memory"
        hide-label
        :title="labels.Other"
        :items="getOtherSettingsItems"
      />
    </div>
    <div class="campaign-manager-last-step__target-users mt-4">
      <CampaignManagerSummaryCard
        detailable
        icon="mdi-account-multiple"
        :show-body-detail.sync="isShowTargetUserDetail"
        :title="labels.TargetUsers"
      >
        <template #body>
          <div class="campaign-manager-last-step__target-users-body pb-4">
            <span> Randomly selected %10 (9 users) from </span>
            <span> 420 users from 19 groups </span>
          </div>
          <div v-if="isShowTargetUserDetail">
            I need api
          </div>
        </template>
      </CampaignManagerSummaryCard>
    </div>
    <div class="campaign-manager-last-step__email-template mt-4">
      <CampaignManagerSummaryCard
        detailable
        icon="mdi-email"
        :show-body-detail.sync="isShowEmailTemplate"
        :title="labels.EmailThatWill"
      >
        <template #body>
          <div class="campaign-manager-last-step__email-template-body pb-4"></div>
          <div v-if="isShowEmailTemplate">
            I need api
          </div>
        </template>
      </CampaignManagerSummaryCard>
    </div>
    <div class="campaign-manager-last-step__landing-page-template mt-4">
      <CampaignManagerSummaryCard
        detailable
        icon="mdi-application"
        :show-body-detail.sync="isShowLandingPageTemplate"
        :title="labels.LandingPageWhoUsers"
      >
        <template #body>
          <div class="campaign-manager-last-step__email-template-body pb-4"></div>
          <div v-if="isShowLandingPageTemplate">
            I need api
          </div>
        </template>
      </CampaignManagerSummaryCard>
    </div>
  </div>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
export default {
  name: 'CampaignManagerSummary',
  components: { CampaignManagerSummaryCard },
  props: {
    formData: {
      type: Object
    }
  },
  data() {
    return {
      labels,
      isShowTargetUserDetail: false,
      isShowEmailTemplate: false,
      isShowLandingPageTemplate: false
    }
  },
  computed: {
    getScenarioInfoItems() {
      const { selectedPhishingScenario = {} } = this.formData

      const { name = '', method = '', difficulty = '' } = selectedPhishingScenario
      return { name, method, difficulty }
    },
    getSettingsItems() {
      const { selectedSmtpSetting = {}, sendingLimit } = this.formData
      return { Starting: 'Now', 'Sending Limit': sendingLimit, SMTP: selectedSmtpSetting.name }
    },
    getOtherSettingsItems() {
      const { isExcludeFromReports, isOnlyActiveUsers, isRandomSelected } = this.formData
      let data = {}
      if (isExcludeFromReports)
        data.isExcludeFromReports = 'Send this campaign to randomly selected'
      if (isOnlyActiveUsers)
        data.isOnlyActiveUsers = 'Send only to active users on phishing reporter add-in'
      if (isRandomSelected) data.isRandomSelected = 'Send this campaign to randomly selected'
      return data
    }
  }
}
</script>

<style lang="scss">
.campaign-manager-last-step {
  &__header {
    display: flex;
    flex-wrap: wrap;
    .campaign-manager-summary-card {
      min-width: 400px;
      margin-top: 24px;
      &:not(:last-child) {
        margin-right: 20px;
      }
    }
  }
  &__target-users {
    &-body {
      padding-left: 24px;
      padding-top: 16px;
      background-color: #fafafa;
      border-radius: 12px;
      span {
        display: inline-block;
        font-weight: 600;
        font-size: 14px;
        line-height: 21px;
        border-radius: 4px;
        margin-right: 4px;
        padding: 1px 8px;
        &:first-child {
          color: #ffffff;
          background: #383b41;
        }
        &:last-child {
          color: #383b41;
          background-color: #e0e0e0;
        }
      }
    }
  }
  &__email-template {
    &-body {
      padding-left: 24px;
      padding-top: 16px;
      background-color: #fafafa;
      border-radius: 12px;
    }
  }
  &__landing-page-template {
    &-body {
      padding-left: 24px;
      padding-top: 16px;
      background-color: #fafafa;
      border-radius: 12px;
    }
  }
}
</style>
