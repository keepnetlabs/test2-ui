<template>
  <div class="campaign-manager-last-step">
    <CampaignManagerScheduleDialog
      v-if="showSchedule && isShowScheduleDialog"
      :status="isShowScheduleDialog"
      :campaign-name="formData.name"
      :selected-frequency="getSelectedFrequency"
      :frequency-id="getSelectedFrequencyId"
      :schedule-type-id="getScheduleTypeId"
      :phishing-scenarios="getPhishingScenarios"
      :scheduled-date-time-zone-id="getScheduledDateTimeZoneId"
      :scheduled-date="getScheduledDate"
      :items="getScheduledDialogItems"
      :scenario-type="type"
      :isCategoryBasedDistribution="isDistributionNotManual"
      @on-close="toggleScheduleDialog"
    />
    <div class="campaign-manager-last-step__header" :style="getHeaderStyle">
      <CampaignManagerSummaryCard
        icon="mdi-alert-circle"
        :title="labels.CampaignInfo"
        :items="getCampaignInfoItems"
      >
        <template #ScenarioDistribution="{ props: { key, val } }">
          <div class="campaign-manager-summary-card__body-item-key">
            {{ key.slice(0, 1).toUpperCase() + key.slice(1) }}
          </div>
          <div class="campaign-manager-summary-card__body-item-value">
            <VIcon v-if="val === SCENARIO_DISTRIBUTION_TEXTS[3]" color="#2196F3" class="mr-2" small
              >mdi-creation</VIcon
            >
            {{ val }}
          </div>
        </template>
      </CampaignManagerSummaryCard>
      <CampaignManagerSummaryCard
        icon="mdi-cog"
        :title="labels.Settings"
        :items="getSettingsItems"
      />
      <CampaignManagerSummaryCard
        v-if="canRenderOtherSettingsCard"
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
                :items="getTargetGroupItems"
                :isPhoneNumber="isMFAScenarioSelected || isVishing"
              />
            </div>
            <AlertBox
              v-if="canRenderAlertbox"
              class="mt-4"
              :text="getUnverifiedDomainsText"
              :slots="{ primaryAction: false, secondaryAction: false }"
            />
            <AlertBox
              v-if="canRenderPhoneNumberAlertBox"
              class="mt-4"
              :text="getPhoneNumberWarningText"
              :slots="{ primaryAction: false, secondaryAction: false }"
            />
            <AlertBox
              v-if="canRenderNoPhoneNumberAlertBox"
              class="mt-4"
              icon-color="#B83A3A"
              style="background-color: #f56c6c33;"
              text="There are 0 target users with phone numbers in the selected groups. MFA scenario(s) in the campaign won’t be able to launched."
              :slots="{ primaryAction: false, secondaryAction: false }"
            />
            <AlertBox
              v-if="canRenderTimeZoneAlertBox"
              class="mt-4 bg-aqua-light"
              icon-color="#2196f3"
              :text="getTimeZoneWarningText"
              :slots="{ primaryAction: false, secondaryAction: false }"
            />
            <AlertBox
              v-if="canRenderAlertboxLanguage"
              class="mt-4"
              :text="getPreferredLanguageText"
              :slots="{ primaryAction: false, secondaryAction: false }"
            />
          </div>
        </template>
      </CampaignManagerSummaryCard>
    </div>
    <div class="my-6 d-flex justify-space-between align-center">
      <div>
        <span class="campaign-manager-last-step__phishing-scenario-label">{{
          type === SCENARIO_TYPES.PHISHING ? getPhishingScenariosText : 'Quishing Scenarios'
        }}</span>
        <VTooltip v-if="phishingScenarios.length > 5" bottom>
          <template #activator="{ on }">
            <span v-on="on" class="campaign-manager-last-step__phishing-scenario-badge ml-4"
              >Total {{ phishingScenarios.length }} Scenarios</span
            >
          </template>
          <div v-for="(methodWrapper, index) in getMethodDetail" :key="index">
            {{ methodWrapper.method }} ({{ methodWrapper.count }})
          </div>
        </VTooltip>
      </div>
      <div v-if="showSchedule && isDistributionManually">
        <v-btn
          class="campaign-manager-summary-card__button pr-4 mr-6"
          rounded
          outlined
          color="#2196f3"
          @click="handleSchedule"
        >
          <v-icon style="font-size: 20px; margin-right: 4px;">mdi-calendar-range</v-icon>
          Schedule
        </v-btn>
      </div>
    </div>
    <CampaignManagerSummaryScenarioInfoTable
      v-if="isDistributionNotManual"
      :axios-payload="getScenarioInfoTableFilterPayload"
    />
    <ElTabs
      v-if="phishingScenarios.length"
      v-model="selectedScenarioResourceId"
      class="k-sub-tab campaign-manager-last-step__phishing-scenario-tab"
      @tab-click="callForScenarioDetail($event)"
    >
      <ElTabPane
        v-for="(template, index) in phishingScenarios"
        :key="index"
        :name="template.resourceId"
        :label="template.name"
      />
    </ElTabs>
    <CampaignManagerReportSummaryCategory
      v-if="type === SCENARIO_TYPES.PHISHING && isDistributionManually"
      class="mt-4"
      :category="category"
    />
    <div class="campaign-manager-last-step__email-template mt-4">
      <CampaignManagerSummaryCard
        v-if="isDistributionManually"
        detailable
        icon="mdi-email"
        :show-body-detail.sync="isShowEmailTemplate"
        :title="labels.EmailThatWill"
      >
        <template #body>
          <div
            v-if="isFormData && emailTemplateParams && phishingScenarios.length"
            class="campaign-manager-last-step__email-template-body pb-4"
          >
            <div class="campaign-manager-last-step__email-template-body-header">
              <div class="campaign-manager-last-step__email-template-body-header-left">
                <span>{{ emailTemplateParams.name }}</span>
                <VTooltip v-if="emailTemplateParams.isAssistedByAI" bottom>
                  <template #activator="{ on }">
                    <VIcon v-on="on" class="ml-1" style="margin-top: -2px;" color="#2196F3" small
                      >mdi-creation</VIcon
                    >
                  </template>
                  <span>This template was generated with AI</span>
                </VTooltip>
              </div>
              <div class="campaign-manager-last-step__email-template-body-header-right">
                <v-btn style="display: none;"></v-btn>
                <Badge
                  size="mini"
                  :color="getBadgeColor(emailTemplateParams.difficulty)"
                  :text="getBadgeText(emailTemplateParams.difficulty)"
                  :outline="false"
                />
                <Badge
                  v-if="landingPageParams.method || emailTemplateParams.method"
                  size="mini"
                  color="#E0E0E0"
                  class-name="badge-middle px-2 py-2"
                  :text="getBadgeText(landingPageParams.method || emailTemplateParams.method)"
                  :outline="false"
                />
                <EmailTemplateListPreviewLanguages
                  v-if="emailTemplateParams && isPhishing"
                  :languageShortCode="
                    typeof emailTemplateParams.languageShortCode === 'string'
                      ? [emailTemplateParams.languageShortCode]
                      : emailTemplateParams.languageShortCode
                  "
                />
                <Badge v-else size="mini" color="#757575" class-name="px-2 py-2" :outline="false">
                  <template #content>
                    <v-icon>mdi-web</v-icon>
                    {{ emailTemplateParams.languageShortCode }}
                  </template>
                </Badge>
              </div>
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
                      <template #activator="{ on }">
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
            style="background: #fafafa;"
          >
            <div class="mb-3">
              <InputLanguagePreview
                v-model="languagePreview"
                persistent-hint
                class="max-w-554"
                :hint="getEmailTemplatePreviewLanguageHint"
                :items="selectedTemplateLanguages"
                @input="handleEmailTemplatePreviewLanguageChange"
              />
              <div class="mb-2">
                <span class="fw-600 text-primary-color">Subject: </span>
                <span class="fw-400 text-primary-color">{{
                  emailTemplateParams && emailTemplateParams.subject
                }}</span>
              </div>
              <div class="mb-2">
                <span class="fw-600 text-primary-color">From Name: </span>
                <span class="fw-400 text-primary-color">{{
                  emailTemplateParams && emailTemplateParams.fromName
                }}</span>
              </div>
              <div class="mb-2">
                <span class="fw-600 text-primary-color">From Email Address:</span>
                <span class="fw-400 text-primary-color">{{
                  emailTemplateParams && emailTemplateParams.fromAddress
                }}</span>
              </div>
              <div>
                <span class="fw-600 text-primary-color">CC:</span>
                <span class="fw-400 text-primary-color">{{
                  emailTemplateParams && emailTemplateParams.cc
                }}</span>
              </div>
            </div>
            <div
              class="campaign-manager-last-step__email-template-body-preview"
              style="background: #fafafa; padding: 0;"
            >
              <KEmailPreview
                v-if="!!emailTemplateParams.template"
                ref="refPreview"
                :html="emailTemplateParams.template"
                :key="emailTemplateParams.template"
                is-extra-height
              />
            </div>
          </div>
        </template>
      </CampaignManagerSummaryCard>
    </div>
    <div class="campaign-manager-last-step__landing-page-template mt-4">
      <CampaignManagerReportSummaryLandingPage
        v-if="!isAttachmentBasedScenario && isDistributionManually"
        :type="type"
        :difficulties="difficulties"
        :methods="methods"
        :form-data="landingPageParams"
      />
    </div>
    <div class="campaign-manager-last-step__landing-page-template mt-4">
      <CampaignManagerReportSummaryTraining
        v-if="isRenderTrainingCard"
        :selected-row="selectedTraining"
        :training-params="trainingParams"
        :selected-training-languages="selectedTrainingLanguages"
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
import { getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId } from '@/api/phishingsimulator'
import { difficulties, methods } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import CampaignManagerScheduleDialog from '@/components/CampaignManager/CampaignManagerScheduleDialog'
import CampaignManagerReportSummaryTraining from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryTraining.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import QuishingService from '@/api/quishing'
import { qrCodeString } from '@/components/GrapesJs/Newsletter/mergedTexts/qrCode'
import { mapGetters } from 'vuex'
import CampaignManagerReportSummaryCategory from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryCategory.vue'
import {
  SCENARIO_DISTRIBUTION,
  SCENARIO_DISTRIBUTION_TEXTS,
  SEND_RANDOMLY_USERS_CALCULATE_TYPES
} from '@/components/CampaignManager/utils'
import CampaignManagerSummaryScenarioInfoTable from '@/components/CampaignManager/Summary/CampaignManagerSummaryScenarioInfoTable'
import InputLanguagePreview from '../../Common/Inputs/InputLanguagePreview.vue'
import EmailTemplateListPreviewLanguages from '@/components/workshop/EmailTemplateListPreviewLanguages.vue'
export default {
  name: 'CampaignManagerSummary',
  components: {
    InputLanguagePreview,
    CampaignManagerReportSummaryTraining,
    CampaignManagerSummaryScenarioInfoTable,
    KEmailPreview,
    Badge,
    CampaignManagerTargetGroupsAndUserSummaryInfo,
    CampaignManagerSummaryCard,
    AttachmentsPreview,
    CampaignManagerReportSummaryLandingPage,
    CampaignManagerReportSummaryCategory,
    AlertBox,
    CampaignManagerScheduleDialog,
    EmailTemplateListPreviewLanguages
  },
  props: {
    formData: {
      type: Object
    },
    isVishing: {
      type: Boolean,
      default: false
    },
    isMFAScenarioSelected: {
      type: Boolean,
      default: false
    },
    languageOptions: {
      type: Array,
      default: () => []
    },
    showSchedule: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: SCENARIO_TYPES.PHISHING
    }
  },
  data() {
    return {
      userFromPreferredLanguage: 0,
      userFromCompanyLanguage: 0,
      SCENARIO_DISTRIBUTION_TEXTS,
      SCENARIO_DISTRIBUTION,
      SCENARIO_TYPES,
      trainingLanguages: [],
      selectedTrainingLanguages: [],
      labels,
      languagePreview: '',
      selectedTemplateLanguages: [],
      isShowTargetUserDetail: false,
      isShowEmailTemplate: false,
      isShowLandingPageTemplate: false,
      isScenarioDetailLoading: false,
      selectedScenarioResourceId: '',
      selectedScenarioName: '',
      emailTemplateParams: {},
      landingPageParams: {},
      category: '',
      difficulties,
      methods,
      isShowScheduleDialog: false,
      trainingParams: null,
      selectedTraining: null,
      phishingEmailTemplates: []
    }
  },
  computed: {
    ...mapGetters({
      getTrainingSearchPermission: 'permissions/getTrainingSearchPermission',
      getSelectedTimeZoneName: 'common/getSelectedTimeZoneName'
    }),
    getEmailTemplatePreviewLanguageHint() {
      return `This template is available in ${this.selectedTemplateLanguages.length} language${
        this.selectedTemplateLanguages.length > 1 ? 's' : ''
      }.`
    },
    canRenderOtherSettingsCard() {
      return Object.keys(this.getOtherSettingsItems).length
    },
    getScenarioInfoTableFilterPayload() {
      return this?.formData?.categoryFilter || null
    },
    getPhishingScenariosText() {
      if (this.isDistributionNotManual) {
        return `Scenario Info`
      }
      return `Phishing Scenarios`
    },
    isDistributionManually() {
      return this.formData?.scenarioDistribution === SCENARIO_DISTRIBUTION.MANUALLY
    },
    isDistributionNotManual() {
      return this.formData?.scenarioDistribution !== SCENARIO_DISTRIBUTION.MANUALLY
    },
    getTargetGroupItems() {
      const activeItems =
        this.formData?.userCountDetailResponse?.data?.data?.filter?.(
          (row) => row.status === 'Active'
        ) || []
      return activeItems
    },
    canRenderAlertboxLanguage() {
      return (
        parseInt(this.formData?.sendUserPreferredLanguage) === 1 &&
        !this.isVishing &&
        !this.isSmishing &&
        !this.isAwareness
      )
    },
    getUserFromCompanyLanguage() {
      const activeData = this.formData?.userCountDetailResponse?.data?.data?.filter(
        (row) => row.status === 'Active'
      )
      return activeData.reduce((acc, row) => {
        const yesStatusItem = row?.hasCompanyPreferredLanguage?.find((r) => r.status === 'Yes')
        return acc + yesStatusItem?.count || 0
      }, 0)
    },
    getUserFromPreferredLanguage() {
      const activeData = this.formData?.userCountDetailResponse?.data?.data?.filter(
        (row) => row.status === 'Active'
      )
      return activeData.reduce((acc, row) => {
        const yesStatusItem = row?.hasPreferredLanguage?.find((r) => r.status === 'Yes')
        return acc + yesStatusItem?.count || 0
      }, 0)
    },
    getPreferredLanguageText() {
      return `${this.getUserFromPreferredLanguage} user${
        this.getUserFromPreferredLanguage > 1 ? 's' : ''
      } get the scenario in their preferred language; ${this.getUserFromCompanyLanguage} other${
        this.getUserFromCompanyLanguage > 1 ? 's' : ''
      } in the company language.`
    },
    isRenderTrainingCard() {
      return this.trainingParams
    },
    getScheduledDialogItems() {
      return this?.formData?.scheduleItems || []
    },
    getSelectedFrequency() {
      return this?.formData?.frequency || ''
    },
    getSelectedFrequencyId() {
      return this?.formData?.frequencyId || ''
    },
    getScheduleTypeId() {
      return this?.formData?.selectedScheduleId || ''
    },
    getPhishingScenarios() {
      return this?.formData?.selectedPhishingScenarios || []
    },
    getScheduledDateTimeZoneId() {
      return this?.formData?.scheduledDateTimeZoneId || ''
    },
    getScheduledDate() {
      return this?.formData?.scheduledDate || ''
    },
    getMethodDetail() {
      const mappedObj = this.phishingScenarios.reduce(
        (acc, pScenario) => {
          acc[pScenario.method] += 1
          return acc
        },
        {
          'Click-Only': 0,
          'Data Submission': 0,
          Attachment: 0
        }
      )
      const mappedArr = []
      Object.keys(mappedObj).forEach((key) => {
        if (mappedObj[key] > 0) {
          mappedArr.push({
            method: key,
            count: mappedObj[key]
          })
        }
      })
      return mappedArr
    },
    getHeaderStyle() {
      return {
        gridTemplateColumns: Object.keys(this.getOtherSettingsItems).length
          ? '1fr 1fr 1fr'
          : '1fr 1fr'
      }
    },
    phishingScenarios() {
      return this.formData?.selectedPhishingScenarios || []
    },
    canRenderAlertbox() {
      return this.getUsersFromUnverifiedDomainsCount > 0 && !this.isVishing
    },
    canRenderPhoneNumberAlertBox() {
      return (
        this.getActiveUsersWithoutPhoneNumberCount > 0 &&
        (this.isMFAScenarioSelected || this.getCampaignInfoItems.method.includes('MFA'))
      )
    },
    canRenderNoPhoneNumberAlertBox() {
      return (
        this.getActiveUsersWithPhoneNumberCount === 0 &&
        (this.isMFAScenarioSelected || this.getCampaignInfoItems.method.includes('MFA'))
      )
    },
    canRenderTimeZoneAlertBox() {
      return this.getActiveUsersWithoutTimeZoneCount > 0 && this.formData?.useTargetUserTimeZone
    },
    getUnverifiedDomainsText() {
      return `There are ${this.getUsersFromUnverifiedDomainsCount} active users with unverified domains in the selected groups. Please verify the domains in order to send emails.`
    },
    getPhoneNumberWarningText() {
      return `There ${this.getActiveUsersWithPhoneNumberCount > 1 ? 'are' : 'is'} ${
        this.getActiveUsersWithPhoneNumberCount
      } active user${this.getActiveUsersWithPhoneNumberCount > 1 ? 's' : ''} with phone number${
        this.getActiveUsersWithPhoneNumberCount > 1 ? 's' : ''
      } and ${this.getActiveUsersWithoutPhoneNumberCount} active user${
        this.getActiveUsersWithoutPhoneNumberCount > 1 ? 's' : ''
      } without phone number${
        this.getActiveUsersWithoutPhoneNumberCount > 1 ? 's' : ''
      } in this group. Only the ${this.getActiveUsersWithPhoneNumberCount} user${
        this.getActiveUsersWithPhoneNumberCount > 1 ? 's' : ''
      } with phone number${
        this.getActiveUsersWithPhoneNumberCount > 1 ? 's' : ''
      } will receive MFA scenario.`
    },
    getTimeZoneWarningText() {
      return `There ${this.getActiveUsersWithoutTimeZoneCount > 1 ? 'are' : 'is'} ${
        this.getActiveUsersWithoutTimeZoneCount
      } active user${
        this.getActiveUsersWithoutTimeZoneCount > 1 ? 's' : ''
      } without time zone information in the selected groups. They will receive the campaign based on the your own time zone (${
        this.getSelectedTimeZoneName
      }).`
    },
    getUsersFromUnverifiedDomainsCount() {
      return this.formData.userCountDetailResponse?.data?.data?.reduce((acc, row) => {
        if (row.status !== 'Active') return acc
        const unverifiedUserCount =
          row?.domainAllowList?.find((r) => r.status === 'Unverified')?.count || 0
        return acc + unverifiedUserCount
      }, 0)
    },
    getActiveUsersWithoutTimeZoneCount() {
      return this.formData.userCountDetailResponse?.data?.data?.reduce((acc, row) => {
        if (row.status !== 'Active') return acc
        const withoutTimeZoneCount = row?.timeZone?.find((r) => r.status === 'No')?.count || 0
        return acc + withoutTimeZoneCount
      }, 0)
    },
    getActiveUsersWithPhoneNumberCount() {
      return this.formData.userCountDetailResponse?.data?.data?.reduce((acc, row) => {
        if (row.status !== 'Active') return acc
        const phoneNumberCount = row?.hasPhoneNumber?.find((r) => r.status === 'Yes')?.count || 0
        return acc + phoneNumberCount
      }, 0)
    },
    getActiveUsersWithoutPhoneNumberCount() {
      return this.formData.userCountDetailResponse?.data?.data?.reduce((acc, row) => {
        if (row.status !== 'Active') return acc
        const withoutPhoneNumberCount =
          row?.hasPhoneNumber?.find((r) => r.status === 'No')?.count || 0
        return acc + withoutPhoneNumberCount
      }, 0)
    },
    isFormData() {
      return Object.keys(this.formData).length
    },
    getPhishingFile() {
      return this?.emailTemplateParams?.phishingFileName
        ? {
            name: this?.emailTemplateParams?.phishingFileName
          }
        : null
    },
    getAttachments() {
      return this?.emailTemplateParams?.attachments || []
    },
    isAttachmentBasedScenario() {
      return this.emailTemplateParams?.method === 'Attachment' || false
    },
    getCampaignInfoItems() {
      const { formData, phishingScenarios } = this
      if (
        formData?.scenarioDistribution &&
        formData.scenarioDistribution !== SCENARIO_DISTRIBUTION.MANUALLY
      ) {
        const methodSet = new Set()
        const difficultySet = new Set()
        formData.phishingScenarioItems.forEach((pScenario) => {
          methodSet.add(pScenario.method)
          difficultySet.add(pScenario.difficulty)
        })
        return {
          name: formData.name,
          'Hyper-Personalization':
            parseInt(formData.sendUserPreferredLanguage) === 1 ? 'Preferred Language' : 'Manually',
          'Smart Grouping': formData?.smartGroup?.name || 'Disabled',
          method: [...methodSet].join(', '),
          difficulty: [...difficultySet].join(', '),
          'Tracking Duration': formData.duration,
          'Scenario Distribution': SCENARIO_DISTRIBUTION_TEXTS[formData.scenarioDistribution],
          'Reply Tracking': formData.emailReplySettings?.isEnabled ? 'On' : 'Off'
        }
      }
      const methodSet = new Set()
      const difficultySet = new Set()
      phishingScenarios.forEach((pScenario) => {
        methodSet.add(pScenario.method)
        difficultySet.add(pScenario.difficulty)
      })
      return {
        name: formData.name,
        'Hyper-Personalization':
          parseInt(formData.sendUserPreferredLanguage) === 1 ? 'Preferred Language' : 'Manually',
        'Smart Grouping': formData?.smartGroup?.name || 'Disabled',
        method: [...methodSet].join(', '),
        difficulty: [...difficultySet].join(', '),
        'Tracking Duration': formData.duration,
        'Scenario Distribution': SCENARIO_DISTRIBUTION_TEXTS[formData.scenarioDistribution],
        'Reply Tracking': formData.emailReplySettings?.isEnabled ? 'On' : 'Off'
      }
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
          const total = Math.round((totalActiveUsers / 100) * Number(sendRandomlyUsersCount))
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
        text = `${this.getTotalActiveUsers} active user(s) with verified domain(s) from ${targetGroupResourceIds.length} group(s)`
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
      return userCountDetailResponse?.data?.data?.reduce((acc, row) => {
        if (row.status !== 'Active') return acc
        const verifiedUserCount =
          row?.domainAllowList?.find((r) => r.status === 'Verified')?.count || 0
        return acc + verifiedUserCount
      }, 0)
    },
    getSettingsItems() {
      const {
        selectedEmailDelivery = {},
        sendingLimit,
        selectedSchedule,
        useTargetUserTimeZone
      } = this.formData
      const obj = {
        Starting: selectedSchedule
      }
      if (selectedSchedule !== 'Later' && useTargetUserTimeZone) {
        obj['Starting'] = `${selectedSchedule} - Target users’ time zones`
      }
      obj['Sending Limit'] = sendingLimit
      obj['Email Delivery'] = `${
        selectedEmailDelivery.type === EMAIL_DELIVERY_TYPES.SMTP ? 'SMTP' : 'DEC'
      } - ${selectedEmailDelivery.name}`
      obj.frequency = this.formData.frequency
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
    },
    isPhishing() {
      return this.type === SCENARIO_TYPES.PHISHING
    }
  },
  watch: {
    formData: {
      handler(val) {
        if (this.formData.scenarioDistribution !== SCENARIO_DISTRIBUTION.MANUALLY) {
          if (this.formData.trainingForCategory?.trainingId) {
            this.selectedTraining = this.formData.trainingForCategory
            this.callForTrainingDetail(this.formData.trainingForCategory.trainingId)
          }
        } else {
          this.selectedScenarioResourceId = val?.selectedPhishingScenarios?.[0]?.resourceId
          this.callForScenarioDetail({
            name: this.selectedScenarioResourceId,
            index: 0
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    if (this.getTrainingSearchPermission) this.callForTrainingLanguages()
  },
  methods: {
    callForTrainingLanguages() {
      AwarenessEducatorService.getLanguages().then((res) => {
        this.trainingLanguages = res?.data?.data || []
      })
    },
    callForScenarioDetail(event = {}) {
      const resourceId = event?.name || ''
      if (!resourceId) return
      const training = this?.formData?.trainings?.[resourceId]
      if (training?.trainingId) {
        this.selectedTraining = training
        this.callForTrainingDetail(training.trainingId)
      } else this.trainingParams = null
      if (this.isPhishing) {
        this.phishingEmailTemplates = []
        this.selectedTemplateLanguages = []
      }
      this.isScenarioDetailLoading = true
      const apiFunc = this.isPhishing
        ? getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId
        : QuishingService.getQuishingScenarioLandingPageAndEmailTemplate
      apiFunc(resourceId)
        .then((response) => {
          const { data: { data = {} } = {} } = response
          const { emailTemplate, landingPageTemplate, category = '' } = data
          let {
            template,
            fromName,
            fromAddress,
            name,
            categoryResourceId,
            difficultyResourceId,
            attachments,
            languageTypeResourceId: languageOfEmailTemplate,
            phishingFileName,
            subject,
            isAssistedByAI
          } = emailTemplate || {}
          if (this.type === SCENARIO_TYPES.QUISHING)
            template = template?.replaceAll('{QRCODEURLIMAGE}', qrCodeString)
          this.emailTemplateParams = {
            fromName,
            fromAddress,
            name,
            subject,
            method: methods.find((item) => item.value === categoryResourceId)?.text || '',
            difficulty:
              difficulties.find((item) => item.value === difficultyResourceId)?.text || '',
            attachments,
            languageTypeResourceId: languageOfEmailTemplate,
            phishingFileName,
            template,
            isAssistedByAI
          }
          this.emailTemplateParams.languageShortCode = this.languageOptions.find(
            (language) => language.value === this.emailTemplateParams.languageTypeResourceId
          )?.text
          if (this.isPhishing) {
            this.selectedTemplateLanguages.push({
              text: emailTemplate?.languageTypeName,
              value: emailTemplate?.languageTypeResourceId
            })
            this.languagePreview = this.selectedTemplateLanguages[0].value
            this.phishingEmailTemplates.push({
              fromName,
              fromAddress,
              subject,
              template,
              languageTypeResourceId: languageOfEmailTemplate,
              languageTypeName: emailTemplate?.languageTypeName,
              ccAddresses: emailTemplate?.ccAddresses,
              languageShortCode: this.languageOptions.find(
                (language) => language.value === this.emailTemplateParams.languageTypeResourceId
              )?.description
            })
            if (emailTemplate?.languages?.length) {
              emailTemplate?.languages?.forEach((item) => {
                this.selectedTemplateLanguages.push({
                  text: item.languageTypeName,
                  value: item.languageTypeResourceId
                })
              })
            }
            this.phishingEmailTemplates.push(
              ...emailTemplate?.languages.map((item) => {
                return {
                  fromName: item.fromName,
                  fromAddress: item.fromAddress,
                  subject: item.subject,
                  template: item.template,
                  languageTypeResourceId: item.languageTypeResourceId,
                  languageTypeName: item.languageTypeName,
                  ccAddresses: item.ccAddresses,
                  languageShortCode: this.languageOptions.find(
                    (language) => language.value === item.languageTypeResourceId
                  )?.description
                }
              })
            )
            this.emailTemplateParams.languageShortCode = [
              ...this.phishingEmailTemplates.map((item) => item.languageShortCode)
            ]
          }
          const {
            name: landingPageName = '',
            description,
            landingPages,
            urlTemplate,
            difficultyTypeId,
            languageTypeResourceId,
            methodTypeId,
            isAssistedByAI: isAssistedByAILandingPage,
            isAssistedbyAI: isAssistedByAILower
          } = landingPageTemplate || {}
          this.landingPageParams = {
            name: landingPageName,
            description,
            urlTemplate,
            difficulty: difficulties[difficultyTypeId - 1]?.text || '',
            method: methods[methodTypeId - 1]?.text || '',
            languageTypeResourceId,
            landingPageTemplates: landingPages,
            isAssistedByAI: isAssistedByAILandingPage || isAssistedByAILower
          }
          this.landingPageParams.languageShortCode = this.languageOptions.find(
            (language) => language.value === this.landingPageParams.languageTypeResourceId
          )?.[this.isPhishing ? 'description' : 'text']
          this.category = category
        })
        .finally(() => (this.isScenarioDetailLoading = false))
    },
    callForTrainingDetail(trainingId = '') {
      AwarenessEducatorService.getTraining(trainingId).then((response) => {
        const {
          data: { data }
        } = response
        this.trainingParams = { ...data }
        let selectedLanguages = []
        this.selectedTraining.trainingLanguageIds.forEach((lang) => {
          const language = this.trainingLanguages.find((item) => item.id === lang)
          if (language)
            selectedLanguages.push({
              text: language.name,
              value: language.id,
              code: language.code
            })
        })
        this.selectedTrainingLanguages = selectedLanguages
        this.trainingParams.languages = this.selectedTrainingLanguages
          .map((lang) => lang.code)
          .join(' | ')
      })
    },
    getBadgeColor(text = '') {
      return getDifficultyBadgeColor(text)
    },
    getBadgeText(text = '') {
      return text
    },
    handleSchedule() {
      this.toggleScheduleDialog()
    },
    toggleScheduleDialog() {
      this.isShowScheduleDialog = !this.isShowScheduleDialog
    },
    handleEmailTemplatePreviewLanguageChange(val) {
      const findedTemplate = this.phishingEmailTemplates.find(
        (item) => item.languageTypeResourceId === val
      )
      if (findedTemplate) {
        this.emailTemplateParams = {
          ...this.emailTemplateParams,
          cc: findedTemplate.ccAddresses,
          fromName: findedTemplate.fromName,
          fromAddress: findedTemplate.fromAddress,
          subject: findedTemplate.subject,
          template: findedTemplate.template
        }
      }
    }
  }
}
</script>
