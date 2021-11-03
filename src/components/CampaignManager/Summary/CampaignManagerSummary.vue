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
            <span v-if="getOtherSettingsItems.isRandomSelected">
              {{ getTotalRandomlySelectedUserCount }}
            </span>
            <span> {{ getTotalTargetGroupsAndUsersCount }}</span>
          </div>
          <div v-if="isShowTargetUserDetail">
            <CampaignManagerTargetGroupsAndUserSummaryInfo
              :items="formData.targetGroupResourceIds"
            />
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
          <div
            v-if="isFormData && formData.emailTemplateParams && formData.selectedPhishingScenario"
            class="campaign-manager-last-step__email-template-body pb-4"
          >
            <div class="campaign-manager-last-step__email-template-body-header">
              <div class="campaign-manager-last-step__email-template-body-header-left">
                {{ formData.emailTemplateParams.name }}
              </div>
              <div class="campaign-manager-last-step__email-template-body-header-right">
                <v-btn style="display: none;"></v-btn>
                <Badge
                  :color="getBadgeColor(formData.selectedPhishingScenario.difficulty)"
                  :text="getBadgeText(formData.selectedPhishingScenario.difficulty)"
                  :outline="false"
                />
                <Badge
                  color="#E0E0E0"
                  :text="getBadgeText(formData.selectedPhishingScenario.method)"
                  :outline="false"
                />
              </div>
            </div>
            <div class="campaign-manager-last-step__email-template-body-header-sub">
              From: {{ formData.emailTemplateParams.fromName }}
              <span>&#60;</span>
              {{ formData.emailTemplateParams.fromAddress }} <span>&#62;</span>
            </div>
            <div></div>
          </div>
          <div
            v-if="isShowEmailTemplate"
            class="campaign-manager-last-step__email-template-body-preview-container"
          >
            <div class="campaign-manager-last-step__email-template-body-preview">
              <div v-html="formData.emailTemplate"></div>
            </div>
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
          <div
            v-if="isFormData"
            class="campaign-manager-last-step__landing-page-template-body pb-4"
          >
            <div class="campaign-manager-last-step__landing-page-template-body-header">
              <div class="campaign-manager-last-step__landing-page-template-body-header-left">
                <span class="campaign-manager-last-step__landing-page-template-body-header-left-url"
                  >URL:</span
                >
                {{ formData.landingPageParams.urlTemplate }}
              </div>
              <div class="campaign-manager-last-step__landing-page-template-body-header-right">
                <v-btn style="display: none;"></v-btn>
                <Badge
                  :color="getBadgeColor(formData.selectedPhishingScenario.difficulty)"
                  :text="getBadgeText(formData.selectedPhishingScenario.difficulty)"
                  :outline="false"
                />
                <Badge
                  color="#E0E0E0"
                  :text="getBadgeText(formData.selectedPhishingScenario.method)"
                  :outline="false"
                />
              </div>
            </div>
          </div>
          <div
            v-if="isShowLandingPageTemplate"
            class="campaign-manager-last-step__email-template-body-preview-container"
          >
            <div class="campaign-manager-last-step__email-template-body-preview">
              <div v-html="formData.landingPageTemplate"></div>
            </div>
          </div>
        </template>
      </CampaignManagerSummaryCard>
    </div>
  </div>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import CampaignManagerTargetGroupsAndUserSummaryInfo from '@/components/CampaignManager/Summary/CampaignManagerTargetGroupsAndUserSummaryInfo'
import Badge from '@/components/Badge'
export default {
  name: 'CampaignManagerSummary',
  components: { Badge, CampaignManagerTargetGroupsAndUserSummaryInfo, CampaignManagerSummaryCard },
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
    isFormData() {
      return Object.keys(this.formData).length
    },
    getScenarioInfoItems() {
      const { selectedPhishingScenario = {} } = this.formData
      const { name = '', method = '', difficulty = '' } = selectedPhishingScenario
      return { name, method, difficulty }
    },
    getTotalRandomlySelectedUserCount() {
      let text = ''
      if (Object.keys(this.formData).length && this.formData.targetGroupResourceIds) {
        const {
          targetGroupResourceIds,
          sendRandomlyUsersCalculateTypeId,
          sendRandomlyUsersCount
        } = this.formData
        let totalUsers = this.getTotalUsers
        const totalGroupLength = targetGroupResourceIds.length
        if (totalGroupLength && totalUsers === 0) {
          totalUsers = 1
        }
        if (sendRandomlyUsersCalculateTypeId === '1') {
          text = `Randomly selected %${sendRandomlyUsersCount} (${Math.floor(
            totalUsers / Number(sendRandomlyUsersCount)
          )} users) from`
        } else {
          text = `Randomly selected ${Number(sendRandomlyUsersCount)} users from`
        }
      }
      return text
    },
    getTotalTargetGroupsAndUsersCount() {
      let text = ''
      if (Object.keys(this.formData).length && this.formData.targetGroupResourceIds) {
        const { targetGroupResourceIds } = this.formData
        text = `${this.getTotalUsers} user(s) from ${targetGroupResourceIds.length} group(s)`
      }
      return text
    },
    getTotalUsers() {
      const { targetGroupResourceIds } = this.formData
      return targetGroupResourceIds.reduce((acc, item) => {
        acc += item.userCount
        return acc
      }, 0)
    },
    getSettingsItems() {
      const { selectedSmtpSetting = {}, sendingLimit, selectedSchedule } = this.formData
      return {
        Starting: selectedSchedule,
        'Sending Limit': sendingLimit,
        SMTP: selectedSmtpSetting.name
      }
    },
    getOtherSettingsItems() {
      const { excludeFromReports, sendOnlyActiveUsers, sendRandomlyUsers } = this.formData
      let data = {}
      if (excludeFromReports) data.isExcludeFromReports = 'Excluded from reports'
      if (sendOnlyActiveUsers)
        data.isOnlyActiveUsers = 'Send only to active users on phishing reporter add-in'
      if (sendRandomlyUsers) data.isRandomSelected = 'Send this campaign to randomly selected'
      return data
    }
  },
  methods: {
    getBadgeColor(text = '') {
      switch (text.toLowerCase()) {
        case 'easy':
          return '#217124'
        case 'medium':
          return '#2196f3'
        case 'hard':
          return '#f56c6c'
        default:
          return '#2196f3'
      }
    },
    getBadgeText(text = '') {
      return text
    }
  }
}
</script>

<style lang="scss">
.campaign-manager-last-step {
  &__header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
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
      padding: 16px 24px 24px 24px;
      background-color: #fafafa;
      border-radius: 12px;
      &-header {
        display: flex;
        justify-content: space-between;
        .k-badge {
          height: 28px !important;
          border-radius: 18px;
          min-width: 64px !important;
        }
        &-left {
          font-weight: 600;
          font-size: 20px;
          color: #383b41;
        }
        &-right {
          display: flex;
          align-items: center;
          div:last-child .k-badge {
            margin-left: 8px;
            padding: 0;
            max-width: none;
            .v-btn__content {
              color: #383b41;
            }
          }
        }
        &-sub {
        }
      }
      &-preview {
        background: #f2f2f2;
        margin: 24px 0;
        padding: 16px;
        &-container {
          border-top: 1px solid #b3d4fc;
          margin: 24px 24px 0 24px;
        }
      }
    }
  }
  &__landing-page-template {
    &-body {
      padding: 16px 24px 24px 24px;
      background-color: #fafafa;
      border-radius: 12px;
      &-header {
        display: flex;
        justify-content: space-between;
        .k-badge {
          height: 28px !important;
          border-radius: 18px;
          min-width: 64px !important;
        }
        &-left {
          color: #383b41;
          &-url {
            font-weight: 600;
            font-size: 14px;
          }
        }
        &-right {
          display: flex;
          align-items: center;
          div:last-child .k-badge {
            margin-left: 8px;
            max-width: none;
            padding: 0;
            .v-btn__content {
              color: #383b41;
            }
          }
        }
        &-sub {
        }
      }
      &-preview {
        background: #f2f2f2;
        margin: 24px 0;
        padding: 16px;
        &-container {
          border-top: 1px solid #b3d4fc;
          margin: 24px 24px 0 24px;
        }
      }
    }
  }
}
</style>
