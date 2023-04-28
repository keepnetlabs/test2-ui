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
        class="campaign-manager-last-step__other-settings"
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
            <div v-if="isShowTargetUserDetail" class="mt-4">
              <CampaignManagerTargetGroupsAndUserSummaryInfo
                :items="currentFormData.selectedTargetGroups"
              />
            </div>
            <AlertBox
              v-if="canRenderAlertbox"
              class="mt-4"
              :text="getUnverifiedDomainsText"
              :slots="{ primaryAction: false, secondaryAction: false }"
            />
          </div>
        </template>
      </CampaignManagerSummaryCard>
    </div>
    <div class="my-6">
      <span class="campaign-manager-last-step__phishing-scenario-label">Phishing Scenarios</span>
      <span
        v-if="phishingScenarios.length > 5"
        class="campaign-manager-last-step__phishing-scenario-badge ml-4"
        >Total {{ phishingScenarios.length }} Scenarios</span
      >
    </div>
    <ElTabs
      v-if="phishingScenarios.length"
      v-model="selectedScenario"
      class="k-sub-tab campaign-manager-last-step__phishing-scenario-tab"
    >
      <ElTabPane
        v-for="(template, index) in phishingScenarios"
        :key="index"
        :name="template.resourceId"
        :label="template.name"
      />
    </ElTabs>
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
                  v-if="
                    currentFormData.landingPageParams.method ||
                    currentFormData.emailTemplateParams.method
                  "
                  size="mini"
                  color="#E0E0E0"
                  class-name="badge-middle px-2 py-2"
                  :text="
                    getBadgeText(
                      currentFormData.landingPageParams.method ||
                        currentFormData.emailTemplateParams.method
                    )
                  "
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
              v-if="getAttachments.length"
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
      <CampaignManagerReportSummaryLandingPage
        v-if="!isAttachmentBasedScenario"
        :formData="currentFormData.landingPageParams"
      />
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
import { getDifficultyBadgeColor } from '@/utils/functions'
import { EMAIL_DELIVERY_TYPES } from '@/components/CampaignManager/AdvancedSettings/utils'
import AlertBox from '@/components//AlertBox'
import { SEND_RANDOMLY_USERS_CALCULATE_TYPES } from '@/components/CampaignManager/utils'

export default {
  name: 'CampaignManagerSummary',
  components: {
    KEmailPreview,
    Badge,
    CampaignManagerTargetGroupsAndUserSummaryInfo,
    CampaignManagerSummaryCard,
    AttachmentsPreview,
    CampaignManagerReportSummaryLandingPage,
    AlertBox
  },
  props: {
    formData: {
      type: Object
    },
    isVishing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentFormData: {},
      labels,
      isShowTargetUserDetail: false,
      isShowEmailTemplate: false,
      isShowLandingPageTemplate: false,
      selectedScenario: ''
    }
  },
  watch: {
    formData: {
      handler(val) {
        this.currentFormData = {
          ...val,
          emailTemplateParams: {
            fromName: val?.emailTemplateParams?.fromName || '',
            fromAddress: val?.emailTemplateParams?.fromAddress || '',
            name: val?.emailTemplateParams?.name || '',
            difficulty: val?.emailTemplateParams?.difficulty || '',
            attachments: val?.emailTemplateParams?.attachments || [],
            languageShortCode: val?.emailTemplateParams?.languageShortCode,
            method: val?.emailTemplateParams?.method,
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
        this.selectedScenario = val?.selectedPhishingScenarios?.[0]?.resourceId
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    phishingScenarios() {
      return this.currentFormData?.selectedPhishingScenarios || []
    },
    canRenderAlertbox() {
      return this.getUsersFromUnverifiedDomainsCount > 0 && !this.isVishing
    },
    getUnverifiedDomainsText() {
      return `There are ${this.getUsersFromUnverifiedDomainsCount} active users with unverified domains in the selected groups. Please verify the domains in the next 30 days.`
    },
    getUsersFromUnverifiedDomainsCount() {
      return (
        this.formData.userCountDetailResponse?.data?.data
          ?.find((row) => row.status === 'Active')
          ?.domainAllowList?.find((row) => row.status === 'Unverified')?.count || 0
      )
    },
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
    isAttachmentBasedScenario() {
      return this.formData?.selectedPhishingScenario?.method === 'Attachment' || false
    },
    getScenarioInfoItems() {
      const { selectedPhishingScenario = {} } = this.formData
      const { name = '', method = '', difficulty = '', extraDatas = {} } = selectedPhishingScenario
      if (Object.keys(extraDatas).length > 0) {
        return {
          name: extraDatas?.name || '',
          method: extraDatas?.method || '',
          difficulty: extraDatas?.difficulty || ''
        }
      }
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
        let totalActiveUsers = this.getTotalActiveUsers
        const totalGroupLength = targetGroupResourceIds.length
        if (totalGroupLength && totalActiveUsers === 0) {
          totalActiveUsers = 1
        }

        if (sendRandomlyUsersCalculateTypeId === '1') {
          const total = Math.floor(totalActiveUsers / Number(sendRandomlyUsersCount))
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
        text = `${this.getTotalActiveUsers} active user(s) from ${targetGroupResourceIds.length} group(s)`
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
    getTotalActiveUsers() {
      const { userCountDetailResponse } = this.formData
      return userCountDetailResponse?.data.data?.find((row) => row.status === 'Active')?.count || 0
    },
    getSettingsItems() {
      const { selectedEmailDelivery = {}, sendingLimit, selectedSchedule } = this.formData
      const obj = {
        Starting: selectedSchedule
      }
      if (selectedEmailDelivery.type === EMAIL_DELIVERY_TYPES.SMTP) {
        obj['Sending Limit'] = sendingLimit
      }
      obj['Email Delivery'] = `${
        selectedEmailDelivery.type === EMAIL_DELIVERY_TYPES.SMTP ? 'SMTP' : 'DEC'
      } - ${selectedEmailDelivery.name}`
      return obj
    },
    getOtherSettingsItems() {
      const {
        excludeFromReports,
        sendOnlyActiveUsers,
        sendRandomlyUsers,
        sendRandomlyUsersCount,
        sendRandomlyUsersCalculateTypeId
      } = this.formData
      let data = {}
      if (excludeFromReports) data.isExcludeFromReports = 'Excluded from reports'
      if (sendOnlyActiveUsers) data.isOnlyActiveUsers = 'Only to active users'
      if (sendRandomlyUsers)
        data.isRandomSelected = `Randomly selected ${sendRandomlyUsersCount}${
          sendRandomlyUsersCalculateTypeId === SEND_RANDOMLY_USERS_CALCULATE_TYPES.PERCENTAGE
            ? '%'
            : ' users'
        }`
      return data
    }
  },
  methods: {
    getBadgeColor(text = '') {
      return getDifficultyBadgeColor(text)
    },
    getBadgeText(text = '') {
      return text
    }
  }
}
</script>
