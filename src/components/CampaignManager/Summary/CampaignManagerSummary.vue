<template>
  <div class="campaign-manager-last-step">
    <div
      class="campaign-manager-last-step__header"
      :style="{
        gridTemplateColumns: Object.keys(getOtherSettingsItems).length ? '1fr 1fr 1fr' : '1fr 1fr'
      }"
    >
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
              :items="currentFormData.selectedTargetGroups"
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
            v-if="
              isFormData &&
              currentFormData.emailTemplateParams &&
              currentFormData.selectedPhishingScenario
            "
            class="campaign-manager-last-step__email-template-body pb-4"
          >
            <div class="campaign-manager-last-step__email-template-body-header">
              <div class="campaign-manager-last-step__email-template-body-header-left">
                {{ currentFormData.emailTemplateParams.name }}
              </div>
              <div class="campaign-manager-last-step__email-template-body-header-right">
                <v-btn style="display: none;"></v-btn>
                <Badge
                  size="mini"
                  :color="getBadgeColor(currentFormData.emailTemplateParams.difficulty)"
                  :text="getBadgeText(currentFormData.emailTemplateParams.difficulty)"
                  :outline="false"
                />
                <Badge
                  size="mini"
                  color="#E0E0E0"
                  class-name="badge-middle px-2 py-2"
                  :text="getBadgeText(currentFormData.landingPageParams.method)"
                  :outline="false"
                />
                <Badge size="mini" color="#757575" class-name="px-2 py-2" :outline="false">
                  <template #content>
                    <v-icon>mdi-web</v-icon
                    >{{ currentFormData.emailTemplateParams.languageShortCode }}
                  </template>
                </Badge>
              </div>
            </div>
            <div class="campaign-manager-last-step__email-template-body-header-sub">
              From: {{ currentFormData.emailTemplateParams.fromName }}
              <span>&#60;</span>
              {{ currentFormData.emailTemplateParams.fromAddress }}
              <span>&#62;</span>
            </div>
            <div
              v-if="!!getPhishingFile"
              class="attachment-wrapper mt-2 mb-0"
              style="position: relative;"
            >
              <div class="attachment blue-attach mb-0">
                <AttachmentsPreview
                  :deletable="false"
                  :att="getPhishingFile"
                  :isEmailTemplate="true"
                />
              </div>
            </div>
            <div
              class="campaign-manager-last-step__email-template-body-attachments"
              style="border: none;"
            >
              <div
                v-for="(att, ind) of getAttachments"
                :key="ind + att.name"
                class="preview-attch-wrapper"
              >
                <div class="attachment-wrapper">
                  <div class="attachment blue-attach" :id="'single-post-attachments-' + att.name">
                    <v-tooltip bottom opacity="1" z-index="9999">
                      <template v-slot:activator="{ on }">
                        <div
                          v-on="on"
                          id="text--attachment-preview-no-flaged"
                          class="attach-icon blue-icon"
                        >
                          <v-icon color="white" style="font-size: 20px;">mdi-paperclip</v-icon>
                        </div>
                        <div
                          v-on="on"
                          id="text--attachment-preview-name"
                          class="file-name safari-hide-tooltip max-char pl-2"
                        >
                          {{ att.fileName }}
                        </div>
                      </template>
                      <span id="text--attachment-preview-tooltip-email-template">{{
                        att.fileName
                      }}</span>
                    </v-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="isShowEmailTemplate"
            class="campaign-manager-last-step__email-template-body-preview-container"
          >
            <div class="campaign-manager-last-step__email-template-body-preview">
              <KEmailPreview
                v-if="!!currentFormData.emailTemplate"
                ref="refPreview"
                :html="currentFormData.emailTemplate"
                is-extra-height
              />
            </div>
          </div>
        </template>
      </CampaignManagerSummaryCard>
    </div>
    <div class="campaign-manager-last-step__landing-page-template mt-4">
      <CampaignManagerReportSummaryLandingPage :formData="currentFormData.landingPageParams" />
    </div>
  </div>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import CampaignManagerTargetGroupsAndUserSummaryInfo from '@/components/CampaignManager/Summary/CampaignManagerTargetGroupsAndUserSummaryInfo'
import Badge from '@/components/Badge'
import KEmailPreview from '@/components/KEmailPreview'
import AttachmentsPreview from '@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview'
import CampaignManagerReportSummaryLandingPage from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryLandingPage'
export default {
  name: 'CampaignManagerSummary',
  components: {
    KEmailPreview,
    Badge,
    CampaignManagerTargetGroupsAndUserSummaryInfo,
    CampaignManagerSummaryCard,
    AttachmentsPreview,
    CampaignManagerReportSummaryLandingPage
  },
  props: {
    formData: {
      type: Object
    }
  },
  data() {
    return {
      currentFormData: {},
      labels,
      isShowTargetUserDetail: false,
      isShowEmailTemplate: false,
      isShowLandingPageTemplate: false
    }
  },
  watch: {
    formData(val) {
      this.currentFormData = {
        ...val,
        emailTemplateParams: {
          fromName: val?.emailTemplateParams?.fromName || '',
          fromAddress: val?.emailTemplateParams?.fromAddress || '',
          name: val?.emailTemplateParams?.name || '',
          difficulty: val?.emailTemplateParams?.difficulty || '',
          attachments: val?.emailTemplateParams?.attachments || [],
          languageShortCode: val?.emailTemplateParams?.languageShortCode,
          phishingFileName: val?.emailTemplateParams?.phishingFileName || null
        },
        landingPageParams: {
          landingPageTemplates: val?.landingPageTemplates || null,
          name: val?.landingPageParams?.name || '',
          description: val?.landingPageParams?.description || '',
          urlTemplate: val?.landingPageParams?.urlTemplate || '',
          difficulty: val?.landingPageParams?.difficulty || '',
          method: val?.landingPageParams?.method || '',
          languageShortCode: val?.landingPageParams?.languageShortCode
        },
        landingPageTemplate: val?.landingPageTemplate || ''
      }
    }
  },
  computed: {
    isFormData() {
      return Object.keys(this.formData).length
    },
    getPhishingFile() {
      return this?.currentFormData?.emailTemplateParams?.phishingFileName
        ? {
            name: this?.currentFormData?.emailTemplateParams?.phishingFileName
          }
        : null
    },
    getAttachments() {
      return this?.currentFormData?.emailTemplateParams?.attachments || []
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
          const total = Math.floor(totalUsers / Number(sendRandomlyUsersCount))
          text = `Randomly selected %${sendRandomlyUsersCount} (${total || 1} users) from`
        } else {
          text = `Randomly selected ${Number(sendRandomlyUsersCount)} users from`
        }
      }
      return text
    },
    getTotalTargetGroupsAndUsersCount() {
      let text = ''
      if (Object.keys(this.formData)?.length && this.formData.targetGroupResourceIds) {
        const { targetGroupResourceIds } = this.formData
        text = `${this.getTotalUsers} user(s) from ${targetGroupResourceIds.length} group(s)`
      }
      return text
    },
    getTotalUsers() {
      const { selectedTargetGroups } = this.formData
      return selectedTargetGroups.reduce((acc, item) => {
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
  padding-right: 71px;
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
      &-attachments {
        display: flex;
        margin-top: 24px;
      }
      &-header {
        display: flex;
        justify-content: space-between;
        .k-badge {
          height: 24px !important;
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
          .badge-middle {
            margin-left: 8px;
            padding: 8px;
            max-width: 300px;
            .v-btn__content {
              color: #383b41;
            }
          }
          div:last-child {
            margin-left: 8px !important;
            .k-badge {
              margin-left: 8px;
              max-width: none;
              padding: 0;
              i:before {
                font-size: 18px;
              }
            }
          }
        }
        &-sub {
        }
      }
      &-preview {
        background: #f2f2f2;
        padding: 16px;
        &-container {
          border-top: 1px solid #b3d4fc;
          padding: 24px;
          max-height: 480px;
          overflow-y: auto;
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
          height: 24px !important;
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
          .badge-middle {
            margin-left: 8px;
            padding: 8px;
            max-width: 300px;
            .v-btn__content {
              color: #383b41;
            }
          }
          div:last-child {
            margin-left: 8px;
            .k-badge {
              margin-left: 8px;
              max-width: none;
              padding: 0;
              i:before {
                font-size: 18px;
              }
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
