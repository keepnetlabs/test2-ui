<template>
  <div id="campaign-manager-report-summary" class="campaign-manager-report-summary">
    <CampaignManagerReportSummaryHeader
      :phishing-scenario-name="phishingScenarioName"
      :resend-dialog-items="getResendDialogItems"
      :id="id"
      :training-infos="trainingInfos"
      :is-show-training-report-button="!!trainingInfos.length"
      :is-multiple-training-report="trainingInfos.length > 1"
      :instance-group="instanceGroup"
      :training-report-dialog-items="trainingReportDialogItems"
    />
    <CampaignManagerReportSummaryCards :items="getCardsData" :is-loading="isLoading" />
    <div class="campaign-manager-report-summary__general-info mt-6">
      <CampaignManagerReportSummaryCampaignInfo
        :items="getCampaignSummaryItems"
        :helper-data="getCampaignSummaryHelperData"
        :is-test-campaign="isTestCampaign"
        :isLoading="isLoading"
      />
      <CampaignManagerReportEmailDelivery
        class="ml-4"
        :items="getEmailDeliveryData"
        :helper-data="getEmailDeliveryHelperData"
        :isLoading="isLoading"
      />
    </div>
    <div class="my-6">
      <span class="campaign-manager-last-step__phishing-scenario-label">Callback Scenarios</span>
      <VTooltip v-if="phishingScenarios.length > 5" bottom>
        <template #activator="{ on }">
          <span v-on="on" class="campaign-manager-last-step__phishing-scenario-badge ml-4"
            >Total {{ phishingScenarios.length }} Scenarios</span
          >
        </template>
      </VTooltip>
    </div>
    <ElTabs
      v-if="phishingScenarios.length"
      v-model="selectedScenarioTab"
      class="k-sub-tab campaign-manager-last-step__phishing-scenario-tab"
      @tab-click="setScenarioDetail"
    >
      <ElTabPane
        v-for="(template, index) in phishingScenarios"
        :key="customKeys[index]"
        :name="customKeys[index]"
        :label="template.name"
      />
    </ElTabs>
    <CampaignManagerReportSummaryEmail
      :difficulties="difficulties"
      :methods="methods"
      :form-data="getEmailTemplateData"
      :isFetchingSummary="isLoading || !getEmailTemplateData"
    />
    <CallbackCampaignModalSummaryCallbackTemplate
      class="my-4"
      :formValues="getCallbackTemplateData"
      :isFetchingSummary="isFetchingCallbackTemplate || !getCallbackTemplateData"
    />
    <!-- <CampaignManagerReportSummaryTraining
      v-if="getTrainingInfo"
      class="mt-6"
      call-training-preview-api
      :training-params="getTrainingInfo"
      :selected-row="getSelectedRowTrainingInfo"
    /> -->
  </div>
</template>

<script>
import CampaignManagerReportSummaryHeader from '@/components/CallbackReport/Summary/CampaignManagerReportSummaryHeader'
import CampaignManagerReportSummaryCards from '@/components/CallbackReport/Summary/CampaignManagerReportSummaryCards'
import CampaignManagerReportSummaryCampaignInfo from '@/components/CallbackReport/Summary/CampaignManagerReportSummaryCampaignInfo'
import CampaignManagerReportSummaryEmail from '@/components/CallbackReport/Summary/CampaignManagerReportSummaryEmail'
import CallbackService from '@/api/callback'
import { difficulties, methods } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import { useLoading } from '@/hooks/useLoading'
import CampaignManagerReportEmailDelivery from '@/components/CallbackReport/Summary/CampaignManagerReportEmailDelivery'
import { createRandomCryptStringNumber } from '@/utils/functions'
// import CampaignManagerReportSummaryTraining from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryTraining.vue'
import { TrainingReportDialogModel } from '@/components/CampaignManagerReport/Summary/utils'
import CallbackCampaignModalSummaryCallbackTemplate from '@/components/CallbackScenarios/CallbackCampaignModalSummaryCallbackTemplate'
export default {
  name: 'CampaignManagerReportSummary',
  components: {
    // CampaignManagerReportSummaryTraining,
    CampaignManagerReportEmailDelivery,
    CampaignManagerReportSummaryEmail,
    CampaignManagerReportSummaryCampaignInfo,
    CampaignManagerReportSummaryCards,
    CampaignManagerReportSummaryHeader,
    CallbackCampaignModalSummaryCallbackTemplate
  },
  mixins: [useLoading],
  props: {
    id: {
      type: String
    },
    instanceGroup: {
      type: [Number, String]
    },
    phishingScenarioName: {
      type: String
    },
    apiResponse: {
      type: Object
    },
    languageItems: {
      type: Array
    }
  },
  data() {
    return {
      targetGroups: [],
      trainingReportDialogItems: [],
      selectedScenarioTab: '',
      activeScenarioIndex: 0,
      campaignSummary: {},
      chartLabels: [
        'Opened email',
        'Clicked link',
        'Submitted data',
        'No response',
        'Not delivered'
      ],
      customKeys: [],
      emailTemplate: null,
      callbackTemplate: null,
      isFetchingCallbackTemplate: false,
      isFetchingEmailTemplate: false,
      difficulties,
      methods
    }
  },
  computed: {
    phishingScenarios() {
      return this?.campaignSummary?.scenarios || []
    },
    getActiveScenario() {
      return this.phishingScenarios[this.activeScenarioIndex] || {}
    },
    getTrainingInfo() {
      return this?.getActiveScenario?.trainingInfo
    },
    getSelectedRowTrainingInfo() {
      return {
        trainingLanguageIds:
          this.getTrainingInfo?.languageList?.map((lang) => lang.languageId) || [],
        trainingId: this.getTrainingInfo?.trainingId
      }
    },
    trainingInfos() {
      return []
      // return this.phishingScenarios.reduce((acc, pScenario) => {
      //   if (pScenario.trainingInfo) acc.push(pScenario.trainingInfo)
      //   return acc
      // }, [])
    },
    getCampaignSummaryItems() {
      const { endDate = '0', totalTargetUserCount = 0 } = this.campaignSummary?.campaignInfo || {
        endDate: '0',
        totalTargetUserCount: 0
      }
      const languages = new Set()
      this?.phishingScenarios?.forEach((scenario) => {
        languages.add(scenario.languageShortCode)
      })
      const { duration = '0' } = this.campaignSummary?.settings || { duration: '0' }
      return {
        'Target Users': totalTargetUserCount,
        'Campaign Lifetime': `${duration} days (Ends at ${endDate})`,
        Languages: languages.size ? [...languages].join(', ') : ''
      }
    },
    getCampaignSummaryHelperData() {
      const { targetUsers = {}, campaignInfo = {} } = this.campaignSummary || {}
      const { randomlyUsersCount = 0, sendOnlyActiveUsers = false, sendRandomlyUsers = false } =
        targetUsers || {}
      const { totalTargetUserCount = 0 } = campaignInfo
      return {
        randomlyUsersCount,
        sendOnlyActiveUsers,
        sendRandomlyUsers,
        totalTargetUserCount
      }
    },
    isTestCampaign() {
      const { settings = {} } = this.campaignSummary || {}
      const { excludeFromReports = false } = settings || {}
      return excludeFromReports
    },
    getSettingsItems() {
      const { settings = {} } = this.campaignSummary || {}
      const { duration, excludeFromReports, languages, smtpName = 0 } = settings
      return {
        Languages: languages || 'English',
        'Excluded from reports': excludeFromReports ? 'Yes' : 'No',
        Duration: `${duration || 0} Day(s)`,
        SMTP: smtpName
      }
    },
    getEmailDeliveryData() {
      const { campaignInfo = {} } = this.campaignSummary || {}
      const {
        emailDeliveryStartDate,
        emailDeliveryEndDate,
        emailDeliveryDuration = 0,
        scheduledDate,
        frequency = 0,
        scheduleTypeId
      } = campaignInfo
      if (scheduleTypeId !== undefined && scheduleTypeId === 2) {
        return {
          'Delivery Start - End': `Saved for later`,
          Duration: `${emailDeliveryDuration || 0}`,
          'Delivery Status': ''
        }
      }
      if (!emailDeliveryStartDate && !emailDeliveryEndDate) {
        return {
          'Scheduled Date': scheduledDate || '-',
          Duration: `${emailDeliveryDuration || 0}`,
          'Delivery Status': ''
        }
      }
      if (!campaignInfo?.emailDeliveryStartDate && frequency !== 0) {
        return {
          'Scheduled Date': scheduledDate || '-',
          Duration: `${emailDeliveryDuration || 0}`,
          'Delivery Status': ''
        }
      }
      return {
        'Delivery Start - End': `${emailDeliveryStartDate || ''} - ${emailDeliveryEndDate || ''}`,
        Duration: `${emailDeliveryDuration || 0}`,
        'Delivery Status': ''
      }
    },
    getEmailDeliveryHelperData() {
      const { campaignInfo = {} } = this.campaignSummary || {}
      const {
        emailDeliveredUserCount,
        emailNotDeliveredUserCount,
        totalTargetUserCount
      } = campaignInfo
      return {
        emailDeliveredUserCount,
        emailNotDeliveredUserCount,
        totalTargetUserCount
      }
    },
    getResendDialogItems() {
      const [
        openedEmail,
        calledBack,
        enteredDigits,
        reportedEmail,
        noResponseEmail,
        notDelivered,
        failedToSend
      ] = this.getChartData
      return this.getChartData.length
        ? {
            openedEmail,
            calledBack,
            enteredDigits,
            reportedEmail,
            noResponseEmail,
            notDelivered,
            failedToSend
          }
        : {}
    },
    getChartData() {
      const defaultScenarioStatsObject = {
        scenarioStats: {
          openedEmail: 0,
          calledBack: 0,
          enteredDigits: 0,
          reportedEmail: 0,
          noResponseEmail: 0,
          notDelivered: 0,
          failedToSend: 0
        }
      }
      const { stats = {} } = this.campaignSummary?.stats
        ? this.campaignSummary
        : defaultScenarioStatsObject
      const {
        openedEmail = 0,
        calledBack = 0,
        enteredDigits = 0,
        reportedEmail = 0,
        noResponseEmail = 0,
        notDelivered = 0,
        failedToSend = 0
      } = stats
      const dataContainer = [
        openedEmail,
        calledBack,
        enteredDigits,
        reportedEmail,
        noResponseEmail,
        notDelivered,
        failedToSend
      ]
      return dataContainer.every((item) => item === 0) ? [] : dataContainer
    },
    getCardsData() {
      if (!this.getChartData.length) return {}
      const [
        openedEmail = 0,
        calledBack = 0,
        enteredDigits = 0,
        reportedEmail = 0,
        noResponseEmail = 0,
        notDelivered = 0,
        failedToSend = 0
      ] = this.getChartData
      return {
        noResponse: {
          userCount: noResponseEmail,
          userPercent: ((noResponseEmail / this.getTotalUsers) * 100).toFixed()
        },
        openedEmail: {
          userCount: openedEmail,
          userPercent: ((openedEmail / this.getTotalUsers) * 100).toFixed()
        },
        calledBack: {
          userCount: calledBack,
          userPercent: ((calledBack / this.getTotalUsers) * 100).toFixed()
        },
        enteredDigits: {
          userCount: enteredDigits,
          userPercent: ((enteredDigits / this.getTotalUsers) * 100).toFixed()
        },
        phishingReporter: {
          userCount: reportedEmail,
          userPercent: ((reportedEmail / this.getTotalUsers) * 100).toFixed()
        },
        failedToSend: {
          userCount: failedToSend,
          userPercent: ((failedToSend / this.getTotalUsers) * 100).toFixed()
        },
        notDelivered: {
          userCount: notDelivered,
          userPercent: ((notDelivered / this.getTotalUsers) * 100).toFixed()
        }
      }
    },
    getTotalUsers() {
      const { campaignInfo = {} } = this.campaignSummary
      return campaignInfo['totalTargetUserCount'] || 0
    },
    getEmailTemplateData() {
      if (!this.getActiveScenario || !Object.keys(this.getActiveScenario)?.length) {
        return null
      }

      return {
        resourceId: this.getActiveScenario.emailTemplateResourceId,
        languageShortCode: this.getActiveScenario.languageShortCode,
        callbackNumber: this.getActiveScenario.callbackNumber,
        campaignResourceId: this.id,
        instanceGroup: this.instanceGroup
      }
    },
    getCallbackTemplateData() {
      if (!this.callbackTemplate || Object.keys(this.callbackTemplate).length === 0) return null
      return {
        template: this.callbackTemplate
      }
    }
  },
  watch: {
    apiResponse(value = {}) {
      this.setCampaignSummary(value)
      setTimeout(() => {
        this.setLoading(false)
      }, 300)
    },
    getActiveScenario: {
      deep: true,
      handler(val) {
        this.isFetchingCallbackTemplate = true
        CallbackService.getCallbackTemplatePreview(val.callbackTemplateResourceId)
          .then((res) => {
            const languageIndex = this.languageItems.findIndex(
              (language) => language.resourceId === res.data.data.vishingLanguageResourceId
            )
            this.callbackTemplate = {
              ...res.data.data,
              language: this.languageItems[languageIndex]?.language || '',
              voice: this.languageItems[languageIndex]?.name || '',
              difficulty: difficulties[val.difficultyTypeId - 1]?.text || ''
            }
            this.callbackTemplate.invalidDialingNotice = { ...this.callbackTemplate.steps[0] }
            this.callbackTemplate.callGreeting = { ...this.callbackTemplate.steps[1] }
            this.callbackTemplate.steps.splice(0, 2)
          })
          .finally(() => {
            this.isFetchingCallbackTemplate = false
          })
      }
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      if (Object.keys(this.apiResponse)?.length) this.callApis(true)
      else {
        this.setLoading(true)
        this.callForTargetGroups()
      }
    },
    callApis(isUseLoading = false) {
      if (isUseLoading) {
        this.setLoading(true)
      }
      CallbackService.getCampaignSummary(this.id, this.instanceGroup)
        .then((response) => {
          this.setCampaignSummary(response)
        })
        .finally(() => {
          if (isUseLoading) {
            setTimeout(() => {
              this.setLoading(false)
            }, 300)
          }
        })
      this.callForTargetGroups()
    },
    setCampaignSummary(response) {
      this.campaignSummary = response?.data?.data
      const scenarios = this.campaignSummary?.scenarios || []
      const trainingReportDialogItems = []
      if (scenarios.length) {
        scenarios.forEach((scenario) => {
          if (scenario.trainingInfo && scenario.enrollmentInfo) {
            // trainingReportDialogItems.push(
            //   new TrainingReportDialogModel(
            //     scenario.scenarioInfo.name,
            //     scenario.trainingInfo.name,
            //     scenario?.enrollmentInfo?.enrollmentId
            //   )
            // )
          }
          if (scenario.trainingInfo && scenario.trainingInfo.languageList) {
            scenario.trainingInfo.languages = scenario.trainingInfo.languageList
              .map((lang) => lang.languageShortCode)
              .join(' | ')
          }
        })
        this.trainingReportDialogItems = trainingReportDialogItems
        if (!this.customKeys.length) {
          this.customKeys = new Array(this.campaignSummary?.scenarios?.length)
            .fill(0)
            .map(() => `key-${createRandomCryptStringNumber()}`)
        }
        if (!this.selectedScenarioTab) this.selectedScenarioTab = this?.customKeys[0]
      }
      this.$store.dispatch(
        'common/setActivePageRouterName',
        this.campaignSummary?.campaignName || ''
      )
    },
    callForTargetGroups() {
      CallbackService.getCampaignSummaryTargetGroups(this.id, this.instanceGroup).then(
        (response) => {
          this.targetGroups = response?.data?.data?.groups || []
        }
      )
    },
    setScenarioDetail(event = {}) {
      this.activeScenarioIndex = event.index
    }
  }
}
</script>
