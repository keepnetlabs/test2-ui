<template>
  <div class="campaign-manager-last-step">
    <div class="campaign-manager-last-step__header" :style="getHeaderStyle">
      <CampaignManagerSummaryCard
        class="campaign-manager-last-step__printout-campaign-info"
        icon="mdi-alert-circle"
        :title="labels.CampaignInfo"
        :items="getCampaignInfoItems"
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
                :items="formData.selectedTargetGroups"
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
    <div class="my-6 d-flex justify-space-between align-center">
      <div>
        <span class="campaign-manager-last-step__phishing-scenario-label">{{
          type === SCENARIO_TYPES.PHISHING ? 'Phishing Scenarios' : 'Quishing Scenarios'
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
      <div v-if="showSchedule">
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
    <div class="campaign-manager-last-step__email-template mt-4">
      <CampaignManagerSummaryCard
        detailable
        icon="$pdf-file"
        :show-body-detail.sync="isShowEmailTemplate"
        title="Individual hard copy that will be given to users"
      >
        <template #body>
          <div
            v-if="isFormData && emailTemplateParams && phishingScenarios.length"
            class="campaign-manager-last-step__email-template-body pb-4"
          >
            <div class="campaign-manager-last-step__email-template-body-header">
              <div class="campaign-manager-last-step__email-template-body-header-left">
                {{ emailTemplateParams.name }}
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
                <Badge size="mini" color="#757575" class-name="px-2 py-2" :outline="false">
                  <template #content>
                    <v-icon>mdi-web</v-icon>{{ emailTemplateParams.languageShortCode }}
                  </template>
                </Badge>
              </div>
            </div>
            <div class="campaign-manager-last-step__email-template-body-header-sub">
              From: {{ emailTemplateParams.fromName }}
              <span>&#60;</span>
              {{ emailTemplateParams.fromAddress }}
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
          >
            <div class="campaign-manager-last-step__email-template-body-preview">
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
        v-if="!isAttachmentBasedScenario"
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
import AlertBox from '@/components//AlertBox'
import { SEND_RANDOMLY_USERS_CALCULATE_TYPES } from '@/components/CampaignManager/utils'
import { getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId } from '@/api/phishingsimulator'
import { difficulties, methods } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import CampaignManagerReportSummaryTraining from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryTraining.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import QuishingService from '@/api/quishing'
import { qrCodeString } from '@/components/GrapesJs/Newsletter/mergedTexts/qrCode'
export default {
  name: 'CampaignManagerPrintoutSummary',
  components: {
    CampaignManagerReportSummaryTraining,
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
      SCENARIO_TYPES,
      trainingLanguages: [],
      selectedTrainingLanguages: [],
      labels,
      isShowTargetUserDetail: false,
      isShowEmailTemplate: false,
      isShowLandingPageTemplate: false,
      isScenarioDetailLoading: false,
      selectedScenarioResourceId: '',
      selectedScenarioName: '',
      emailTemplateParams: {},
      landingPageParams: {},
      difficulties,
      methods,
      isShowScheduleDialog: false,
      trainingParams: null,
      selectedTraining: null
    }
  },
  computed: {
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
        gridTemplateColumns: '1fr'
      }
    },
    phishingScenarios() {
      return this.formData?.selectedPhishingScenarios || []
    },
    canRenderAlertbox() {
      return this.getUsersFromUnverifiedDomainsCount > 0 && !this.isVishing
    },
    getUnverifiedDomainsText() {
      return `There are ${this.getUsersFromUnverifiedDomainsCount} active users with unverified domains in the selected groups. Please verify the domains in order to send emails.`
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
      const methodSet = new Set()
      const difficultySet = new Set()
      phishingScenarios.forEach((pScenario) => {
        methodSet.add(pScenario.method)
        difficultySet.add(pScenario.difficulty)
      })
      return {
        name: formData.name,
        'Tracking Duration': formData.duration,
        method: [...methodSet].join(', '),
        Starting: this.getScheduledDate,
        difficulty: [...difficultySet].join(', ')
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
      return (
        userCountDetailResponse?.data.data
          ?.find((row) => row.status === 'Active')
          ?.domainAllowList?.find((row) => row.status === 'Verified')?.count || 0
      )
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
  watch: {
    formData: {
      handler(val) {
        this.selectedScenarioResourceId = val?.selectedPhishingScenarios?.[0]?.resourceId
        this.callForScenarioDetail({ name: this.selectedScenarioResourceId, index: 0 })
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.callForTrainingLanguages()
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
      if (training && training.trainingId) {
        this.selectedTraining = training
        this.callForTrainingDetail(training.trainingId)
      } else this.trainingParams = null
      this.isScenarioDetailLoading = true
      const apiFunc =
        this.type === SCENARIO_TYPES.PHISHING
          ? getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId
          : QuishingService.getQuishingScenarioLandingPageAndEmailTemplate
      apiFunc(resourceId)
        .then((response) => {
          const { data: { data = {} } = {} } = response
          const { emailTemplate, landingPageTemplate } = data
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
            subject
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
            template
          }
          this.emailTemplateParams.languageShortCode = this.languageOptions.find(
            (language) => language.value === this.emailTemplateParams.languageTypeResourceId
          )?.text
          const {
            name: landingPageName = '',
            description,
            landingPages,
            urlTemplate,
            difficultyTypeId,
            languageTypeResourceId,
            methodTypeId
          } = landingPageTemplate || {}
          this.landingPageParams = {
            name: landingPageName,
            description,
            urlTemplate,
            difficulty: difficulties[difficultyTypeId - 1]?.text || '',
            method: methods[methodTypeId - 1]?.text || '',
            languageTypeResourceId,
            landingPageTemplates: landingPages
          }
          this.landingPageParams.languageShortCode = this.languageOptions.find(
            (language) => language.value === this.landingPageParams.languageTypeResourceId
          )?.text
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
    }
  }
}
</script>
