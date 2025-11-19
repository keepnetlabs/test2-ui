<template>
  <div id="campaign-manager-report-summary" class="campaign-manager-report-summary">
    <CampaignManagerReportSummaryHeader
      :phishing-scenario-name="phishingScenarioName"
      :resend-dialog-items="getResendDialogItems"
      :id="id"
      :training-infos="trainingInfos"
      :is-show-training-report-button="!!trainingInfos.length"
      :is-show-resend-dialog-button="isShowResendDialogButton"
      :is-multiple-training-report="trainingInfos.length > 1"
      :instance-group="instanceGroup"
      :training-report-dialog-items="trainingReportDialogItems"
    />
    <CampaignManagerReportSummaryCards
      v-if="!isQuishingTypePrintout"
      :multiple-type="multipleType"
      :method="getScenarioMethod"
      :items="getCardsData"
      :is-loading="isLoading || !getScenarioMethod"
    />
    <CampaignManagerPrintoutReportSummaryCards
      v-else
      :multiple-type="multipleType"
      :method="getScenarioMethod"
      :items="getCardsData"
      :is-loading="isLoading || !getScenarioMethod"
    />
    <div
      :class="[
        isQuishingTypePrintout
          ? 'quishing-report-inidividual-printout-campaign-info'
          : 'campaign-manager-report-summary__general-info',
        'mt-6'
      ]"
    >
      <CampaignManagerReportSummaryCampaignInfo
        :items="getCampaignSummaryItems"
        :helper-data="getCampaignSummaryHelperData"
        :is-test-campaign="isTestCampaign"
        :isLoading="isLoading"
      />
      <CampaignManagerReportEmailDelivery
        v-if="!isQuishingTypePrintout"
        class="ml-4"
        :items="getEmailDeliveryData"
        :helper-data="getEmailDeliveryHelperData"
        :isLoading="isLoading"
      />
    </div>
    <div v-if="!isQuishingTypePrintout" class="my-6">
      <span class="campaign-manager-last-step__phishing-scenario-label">Quishing Scenarios</span>
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
    <ElTabs
      v-if="phishingScenarios.length && !isQuishingTypePrintout"
      v-model="selectedScenarioTab"
      class="k-sub-tab campaign-manager-last-step__phishing-scenario-tab"
      @tab-click="setScenarioDetail"
    >
      <ElTabPane
        v-for="(template, index) in phishingScenarios"
        :key="customKeys[index]"
        :name="customKeys[index]"
        :label="template.scenarioInfo.name"
      />
    </ElTabs>
    <CampaignManagerReportSummaryEmail
      :is-quishing-printout="isQuishingTypePrintout"
      :difficulties="difficulties"
      :methods="methods"
      :form-data="getEmailTemplateData"
      :isFetchingSummary="isLoading"
      :type="SCENARIO_TYPES.QUISHING"
    />
    <CampaignManagerReportSummaryLandingPage
      v-if="!isAttachment"
      :difficulties="difficulties"
      :methods="methods"
      :form-data="getLandingPageTemplateData"
      :isFetchingSummary="isLoading"
      :type="SCENARIO_TYPES.QUISHING"
    />
    <CampaignManagerReportSummaryTraining
      v-if="getTrainingInfo"
      class="mt-6"
      call-training-preview-api
      :training-params="getTrainingInfo"
      :selected-row="getSelectedRowTrainingInfo"
    />
  </div>
</template>

<script>
import CampaignManagerReportSummaryHeader from '@/components/QuishingCampaignManagerReport/Summary/CampaignManagerReportSummaryHeader'
import CampaignManagerReportSummaryCards from '@/components/QuishingCampaignManagerReport/Summary/CampaignManagerReportSummaryCards'
import CampaignManagerReportSummaryCampaignInfo from '@/components/QuishingCampaignManagerReport/Summary/CampaignManagerReportSummaryCampaignInfo'
import CampaignManagerReportSummaryEmail from '@/components/QuishingCampaignManagerReport/Summary/CampaignManagerReportSummaryEmail'
import CampaignManagerReportSummaryLandingPage from '@/components/QuishingCampaignManagerReport/Summary/CampaignManagerReportSummaryLandingPage'
import { difficulties, methods } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import { useLoading } from '@/hooks/useLoading'
import CampaignManagerReportEmailDelivery from '@/components/QuishingCampaignManagerReport/Summary/CampaignManagerReportEmailDelivery'
import { createRandomCryptStringNumber } from '@/utils/functions'
import CampaignManagerReportSummaryTraining from '@/components/QuishingCampaignManagerReport/Summary/CampaignManagerReportSummaryTraining.vue'
import { TrainingReportDialogModel } from '@/components/QuishingCampaignManagerReport/Summary/utils'
import QuishingService from '@/api/quishing'
import CampaignManagerPrintoutReportSummaryCards from '@/components/QuishingCampaignManagerReport/Summary/CampaignManagerPrintoutReportSummaryCards.vue'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
export default {
  name: 'CampaignManagerReportSummary',
  components: {
    CampaignManagerPrintoutReportSummaryCards,
    CampaignManagerReportSummaryTraining,
    CampaignManagerReportEmailDelivery,
    CampaignManagerReportSummaryLandingPage,
    CampaignManagerReportSummaryEmail,
    CampaignManagerReportSummaryCampaignInfo,
    CampaignManagerReportSummaryCards,
    CampaignManagerReportSummaryHeader
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
    multipleType: {
      type: Array
    },
    apiResponse: {
      type: Object
    }
  },
  data() {
    return {
      SCENARIO_TYPES,
      targetGroups: [],
      trainingReportDialogItems: [],
      selectedScenarioTab: '',
      activeScenarioIndex: 0,
      campaignSummary: {},
      interval: null,
      chartLabels: [
        'Opened email',
        'Clicked link',
        'Submitted data',
        'No response',
        'Not delivered'
      ],
      customKeys: [],
      difficulties,
      methods,
      languageOptions: []
    }
  },
  computed: {
    isQuishingTypePrintout() {
      if (this?.getActiveScenario?.scenarioInfo?.templateType === undefined) return false
      return (
        this?.getActiveScenario?.scenarioInfo?.templateType?.toString().toLowerCase() ===
        QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
      )
    },
    isShowResendDialogButton() {
      if (this?.getActiveScenario?.scenarioInfo?.templateType === undefined) return false
      return !this.isQuishingTypePrintout
    },
    getMethodDetail() {
      const mappedObj = this.phishingScenarios.reduce(
        (acc, pScenario) => {
          const method = methods[pScenario.scenarioInfo.methodTypeId - 1]?.text
          acc[method] += 1
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
    phishingScenarios() {
      return this?.campaignSummary?.scenarios || []
    },
    getActiveScenario() {
      return this.phishingScenarios[this.activeScenarioIndex] || {}
    },
    getScenarioMethod() {
      return this.getActiveScenario?.scenarioInfo?.methodTypeId || ''
    },
    getTrainingInfo() {
      return this?.getActiveScenario?.trainingInfo
    },
    getSelectedRowTrainingInfo() {
      return {
        trainingLanguageIds:
          this.getTrainingInfo?.languageList?.map((lang) => lang.languageId) || [],
        trainingId: this.getTrainingInfo?.trainingId,
        trainingName: this.getTrainingInfo?.name
      }
    },
    trainingInfos() {
      return this.phishingScenarios.reduce((acc, pScenario) => {
        if (pScenario.trainingInfo) acc.push(pScenario.trainingInfo)
        return acc
      }, [])
    },
    isAttachment() {
      return this.getScenarioMethod.toString() === '3' || false
    },
    getCampaignSummaryItems() {
      const { endDate = '0', totalTargetUserCount = 0 } = this.campaignSummary?.campaignInfo || {
        endDate: '0',
        totalTargetUserCount: 0
      }
      const languages = new Set()
      this?.phishingScenarios?.forEach((scenario) => {
        const languageCode = scenario.scenarioInfo.languageShortCode
        const language = this.languageOptions.find(
          (lang) => lang.languageShortCode === languageCode
        )
        languages.add(language?.text || languageCode)
      })
      const { duration = '0' } = this.campaignSummary?.settings || { duration: '0' }
      return {
        'Target Groups': this?.targetGroups || [],
        'Target Users': totalTargetUserCount,
        Languages: languages.size ? [...languages].join(', ') : '',
        'Campaign Lifetime': `${duration} days (Ends at ${endDate})`,
        Duration: duration
      }
    },
    getCampaignSummaryHelperData() {
      const { targetUsers = {}, campaignInfo = {} } = this.campaignSummary || {}
      const { randomlyUsersCount = 0, sendOnlyActiveUsers = false, sendRandomlyUsers = false } =
        targetUsers || {}
      const { totalTargetUserCount = 0 } = campaignInfo
      return {
        targetGroups: this?.targetGroups || [],
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
        clickedEmail,
        submittedEmail,
        noResponseEmail,
        notDelivered,
        attachmentOpenedEmail,
        ,
        mfa
      ] = this.getChartData
      return this.getChartData.length
        ? {
            clickedEmail,
            noResponseEmail,
            notDelivered,
            openedEmail,
            submittedEmail,
            attachmentOpenedEmail,
            mfa
          }
        : {}
    },
    getChartData() {
      const defaultScenarioStatsObject = {
        scenarioStats: {
          clickedEmail: 0,
          noResponseEmail: 0,
          notDelivered: 0,
          openedEmail: 0,
          submittedEmail: 0,
          attachmentOpenedEmail: 0,
          reportedEmail: 0,
          mfa: 0
        }
      }
      const { scenarioStats = {} } = this.campaignSummary?.scenarioStats
        ? this.campaignSummary
        : defaultScenarioStatsObject
      const {
        clickedEmail = 0,
        noResponseEmail = 0,
        notDelivered = 0,
        openedEmail = 0,
        submittedEmail = 0,
        attachmentOpenedEmail = 0,
        reportedEmail = 0,
        mfa = 0
      } = scenarioStats
      const dataContainer = [
        openedEmail,
        clickedEmail,
        submittedEmail,
        noResponseEmail,
        notDelivered,
        attachmentOpenedEmail,
        reportedEmail,
        mfa
      ]
      return dataContainer.every((item) => item === 0) ? [] : dataContainer
    },
    getCardsData() {
      if (!this.getChartData.length) return {}
      const [
        openedEmail = 0,
        clickedEmail = 0,
        submittedEmail = 0,
        noResponseEmail = 0,
        notDelivered = 0,
        attachmentOpenedEmail = 0,
        reportedEmail = 0,
        mfa = 0
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
        attachmentOpenedEmail: {
          userCount: attachmentOpenedEmail,
          userPercent: ((attachmentOpenedEmail / this.getTotalUsers) * 100).toFixed()
        },
        clickedEmail: {
          userCount: clickedEmail,
          userPercent: ((clickedEmail / this.getTotalUsers) * 100).toFixed()
        },
        submittedEmail: {
          userCount: submittedEmail,
          userPercent: ((submittedEmail / this.getTotalUsers) * 100).toFixed()
        },
        notDelivered: {
          userCount: notDelivered,
          userPercent: ((notDelivered / this.getTotalUsers) * 100).toFixed()
        },
        phishingReporter: {
          userCount: reportedEmail,
          userPercent: ((reportedEmail / this.getTotalUsers) * 100).toFixed()
        },
        mfa: {
          userCount: mfa,
          userPercent: ((mfa / this.getTotalUsers) * 100).toFixed()
        }
      }
    },
    getTotalUsers() {
      const { campaignInfo = {} } = this.campaignSummary
      return campaignInfo['totalTargetUserCount'] || 0
    },
    getEmailTemplateData() {
      let { emailTemplateInfo = {}, scenarioInfo = {}, quishingTemplateInfo = {} } = this
        .getActiveScenario || {
        emailTemplateInfo: {}
      }
      if (this.isQuishingTypePrintout) emailTemplateInfo = quishingTemplateInfo
      if (!Object.keys(emailTemplateInfo)?.length) {
        return {}
      }
      const { resourceId, phishingFileName } = emailTemplateInfo || {}
      const languageCode = scenarioInfo?.languageShortCode
      const language = this.languageOptions.find((lang) => lang.languageShortCode === languageCode)

      return Object.keys(emailTemplateInfo)?.length
        ? {
            resourceId,
            name: emailTemplateInfo?.name,
            languageShortCode: language?.text || languageCode,
            attachment: phishingFileName
              ? {
                  name: phishingFileName
                }
              : null,
            campaignResourceId: this.id,
            instanceGroup: this.instanceGroup
          }
        : {}
    },
    getLandingPageTemplateData() {
      const { landingPageTemplateInfo = {}, scenarioInfo = {} } = this.getActiveScenario || {}
      const { resourceId, name } = landingPageTemplateInfo
      const languageCode = scenarioInfo?.languageShortCode
      const language = this.languageOptions.find((lang) => lang.languageShortCode === languageCode)
      return Object.keys(landingPageTemplateInfo).length
        ? {
            languageShortCode: language?.text || languageCode,
            resourceId,
            name,
            jobResourceId: this.id,
            instanceGroup: this.instanceGroup
          }
        : {}
    }
  },
  watch: {
    apiResponse(value = {}) {
      this.setCampaignSummary(value)
      setTimeout(() => {
        this.setLoading(false)
      }, 300)
    }
  },
  created() {
    this.callForLanguages()
    this.callForData()
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    callForLanguages() {
      LookupLocalStorage.getSingle(21).then((response) => {
        this.languageOptions =
          response?.map((language) => ({
            text: language.isoFriendlyName,
            languageTypeName: language.name,
            languageShortCode: language.description,
            value: language.resourceId
          })) || []
      })
    },
    callForData() {
      if (Object.keys(this.apiResponse)?.length) this.callApis(true)
      else {
        this.setLoading(true)
        this.callForTargetGroups()
      }
      this.interval = setInterval(() => {
        this.callApis()
      }, 15000)
    },
    callApis(isUseLoading = false) {
      if (isUseLoading) {
        this.setLoading(true)
      }
      QuishingService.getCampaignJobSummary(this.id, this.instanceGroup)
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
            trainingReportDialogItems.push(
              new TrainingReportDialogModel(
                scenario.scenarioInfo.name,
                scenario.trainingInfo.name,
                scenario?.enrollmentInfo?.enrollmentId
              )
            )
          }
          if (scenario.trainingInfo && scenario.trainingInfo.languageList) {
            scenario.trainingInfo.languages = scenario.trainingInfo.languageList
              .map((lang) => {
                const language = this.languageOptions.find(
                  (opt) => opt.languageShortCode === lang.languageShortCode
                )
                return language?.text || lang.languageShortCode
              })
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
        this.campaignSummary?.quishingCampaignName || ''
      )
    },
    callForTargetGroups() {
      QuishingService.getCampaignJobSummaryTargetGroups(this.id, this.instanceGroup).then(
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
