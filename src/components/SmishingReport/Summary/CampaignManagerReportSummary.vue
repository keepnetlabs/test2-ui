<template>
  <div id="campaign-manager-report-summary" class="smishing-campaign-manager-report-summary">
    <CampaignManagerReportSummaryHeader
      :phishing-scenario-name="phishingScenarioName"
      :resend-dialog-items="getResendDialogItems"
      :id="id"
      :instance-group="instanceGroup"
      :training-infos="trainingInfos"
      :is-show-training-report-button="!!trainingInfos.length"
      :is-multiple-training-report="trainingInfos.length > 1"
      :training-report-dialog-items="trainingReportDialogItems"
    />
    <CampaignManagerReportSummaryCards
      :multiple-type="getCampaignMethodTypes"
      :method="getScenarioMethod"
      :items="getCardsData"
      :is-loading="isLoading"
    />
    <div class="campaign-manager-report-summary__general-info mt-6">
      <CampaignManagerReportSummaryCampaignInfo
        :items="getCampaignSummaryItems"
        :helper-data="getCampaignSummaryHelperData"
        :is-test-campaign="isTestCampaign"
        :isLoading="isLoading"
      />
      <CampaignManagerReportSMSDelivery
        :items="getSMSDeliveryData"
        :helper-data="getSMSDeliveryHelperData"
        :isLoading="isLoading"
      />
    </div>
    <div class="my-6">
      <span class="campaign-manager-last-step__phishing-scenario-label">Smishing Scenarios</span>
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
      v-if="phishingScenarios.length"
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
    <CampaignManagerReportSummaryTextTemplate
      :form-data="getTextTemplateData"
      :difficulties="difficulties"
      :methods="methods"
      :isFetchingSummary="isLoading"
    />
    <CampaignManagerReportSummaryLandingPage
      :form-data="getLandingPageTemplateData"
      :isFetchingSummary="isLoading"
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
import CampaignManagerReportSummaryHeader from '@/components/SmishingReport/Summary/CampaignManagerReportSummaryHeader'
import CampaignManagerReportSummaryCards from '@/components/SmishingReport/Summary/CampaignManagerReportSummaryCards'
import CampaignManagerReportSummaryCampaignInfo from '@/components/SmishingReport/Summary/CampaignManagerReportSummaryCampaignInfo'
import CampaignManagerReportSummaryTextTemplate from '@/components/SmishingReport/Summary/CampaignManagerReportSummaryTextTemplate'
import CampaignManagerReportSummaryLandingPage from '@/components/SmishingReport/Summary/CampaignManagerReportSummaryLandingPage'
import SmishingService from '@/api/smishing'
import { difficulties, methods } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import { useLoading } from '@/hooks/useLoading'
import CampaignManagerReportSMSDelivery from '@/components/SmishingReport/Summary/CampaignManagerReportSMSDelivery'
import { createRandomCryptStringNumber } from '@/utils/functions'
import PhoneNumber from 'awesome-phonenumber'
import { TrainingReportDialogModel } from '@/components/CampaignManagerReport/Summary/utils'
import CampaignManagerReportSummaryTraining from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryTraining.vue'

export default {
  name: 'CampaignManagerReportSummary',
  components: {
    CampaignManagerReportSummaryTraining,
    CampaignManagerReportSMSDelivery,
    CampaignManagerReportSummaryLandingPage,
    CampaignManagerReportSummaryTextTemplate,
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
    apiResponse: {
      type: Object
    }
  },
  data() {
    return {
      isSenderPhoneNumbersModalVisible: false,
      trainingReportDialogItems: [],
      targetGroups: [],
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
      methods
    }
  },
  computed: {
    // isMethodMfa() {
    //   return this.phishingScenarios?.[this.activeScenarioIndex]?.scenarioInfo?.methodTypeId === 4
    // },
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
    getCampaignSummaryItems() {
      const { endDate = '0', totalTargetUserCount = 0 } = this.campaignSummary?.campaignInfo || {
        endDate: '0',
        totalTargetUserCount: 0
      }
      const languages = new Set()
      this?.phishingScenarios?.forEach((scenario) => {
        languages.add(scenario.scenarioInfo.languageShortCode)
      })
      const { duration = '0' } = this.campaignSummary?.settings || {
        duration: '0'
      }
      return {
        'Target Groups': this?.targetGroups || [],
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
    getSMSDeliveryData() {
      const { campaignInfo = {}, settings = {} } = this.campaignSummary || {}
      const {
        smsDeliveryStartDate,
        smsDeliveryEndDate,
        scheduledDate,
        scheduleTypeId
      } = campaignInfo
      let senderPhoneNumbers = []
      if (Array.isArray(settings?.smsProviderNumbers)) {
        senderPhoneNumbers.push(
          ...settings?.smsProviderNumbers?.map(
            (pn) => new PhoneNumber(pn?.toString() || '')?.g?.number?.international
          )
        )
      } else {
        senderPhoneNumbers.push(
          new PhoneNumber(settings?.smsProviderNumbers?.toString() || '')?.g?.number?.international
        )
      }
      if (scheduleTypeId !== undefined && scheduleTypeId === 2) {
        return {
          'Sending Start - End': `Saved for later`,
          'Sending Status': '',
          'Sender Phone Number': senderPhoneNumbers
        }
      }
      if (!smsDeliveryStartDate && !smsDeliveryEndDate) {
        return {
          'Scheduled Date': scheduledDate || '-',
          'Sending Status': '',
          'Sender Phone Number': senderPhoneNumbers
        }
      }
      return {
        'Sending Start - End': `${smsDeliveryStartDate || ''} - ${smsDeliveryEndDate || ''}`,
        'Sending Status': '',
        'Sender Phone Number': senderPhoneNumbers
      }
    },
    getSMSDeliveryHelperData() {
      const { campaignInfo = {}, settings = {} } = this.campaignSummary || {}
      const { smsDeliveredUserCount, smsNotDeliveredUserCount, totalTargetUserCount } = campaignInfo
      const { smsProviderNumbers } = settings
      return {
        smsDeliveredUserCount,
        smsNotDeliveredUserCount,
        totalTargetUserCount,
        phoneNumbers: Array.isArray(smsProviderNumbers) ? smsProviderNumbers : [smsProviderNumbers]
      }
    },
    getResendDialogItems() {
      const [
        notDelivered,
        clickedSms,
        submittedSms,
        mfaSubmittedSms,
        noResponseSms
      ] = this.getChartData
      return this.getChartData.length
        ? {
            notDelivered,
            clickedSms,
            submittedSms,
            mfaSubmittedSms,
            noResponseSms
          }
        : {}
    },
    getChartData() {
      const defaultScenarioStatsObject = {
        scenarioStats: {
          attachmentOpenedSms: 0,
          clickedSms: 0,
          noResponseSms: 0,
          notDelivered: 0,
          openedSms: 0,
          submittedSms: 0,
          mfaSubmittedSms: 0,
          reportedSms: 0
        }
      }
      const { scenarioStats = {} } = this.campaignSummary?.scenarioStats
        ? this.campaignSummary
        : defaultScenarioStatsObject
      const {
        clickedSms = 0,
        noResponseSms = 0,
        notDelivered = 0,
        submittedSms = 0,
        mfaSubmittedSms = 0
      } = scenarioStats
      const dataContainer = [notDelivered, clickedSms, submittedSms, mfaSubmittedSms, noResponseSms]
      return dataContainer.every((item) => item === 0) ? [] : dataContainer
    },
    getCardsData() {
      if (!this.getChartData.length) return {}
      const [
        notDelivered,
        clickedSms,
        submittedSms,
        mfaSubmittedSms,
        noResponseSms
      ] = this.getChartData
      return {
        noResponse: {
          userCount: noResponseSms,
          userPercent: ((noResponseSms / this.getTotalUsers) * 100).toFixed()
        },
        clicked: {
          userCount: clickedSms,
          userPercent: ((clickedSms / this.getTotalUsers) * 100).toFixed()
        },
        submitted: {
          userCount: submittedSms,
          userPercent: ((submittedSms / this.getTotalUsers) * 100).toFixed()
        },
        submittedMFA: {
          userCount: mfaSubmittedSms,
          userPercent: ((mfaSubmittedSms / this.getTotalUsers) * 100).toFixed()
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
    getTextTemplateData() {
      const { textTemplateInfo = {} } = this.getActiveScenario || {
        textTemplateInfo: {}
      }
      if (!Object.keys(textTemplateInfo)?.length) {
        return {}
      }
      const { resourceId, name, difficultyResourceId, categoryResourceId, languageShortCode } =
        textTemplateInfo || {}

      return Object.keys(textTemplateInfo)?.length
        ? {
            difficulty: difficulties.find((item) => item.value === difficultyResourceId)?.text,
            method: methods.find((item) => item.value === categoryResourceId)?.text,
            name,
            resourceId,
            languageShortCode,
            campaignResourceId: this.id,
            instanceGroup: this.instanceGroup
          }
        : {}
    },
    getLandingPageTemplateData() {
      const { landingPageTemplateInfo = {} } = this.getActiveScenario || {}
      const {
        name,
        difficultyTypeId = 1,
        methodTypeId = 1,
        resourceId,
        languageShortCode
      } = landingPageTemplateInfo
      return Object.keys(landingPageTemplateInfo).length
        ? {
            languageShortCode,
            name,
            method: methods[methodTypeId - 1].text,
            difficulty: difficulties[difficultyTypeId - 1].text,
            resourceId,
            jobResourceId: this.id,
            instanceGroup: this.instanceGroup
          }
        : {}
    },
    getCampaignMethodTypes() {
      return this.phishingScenarios.length
        ? [
            this.phishingScenarios.some(
              (scenario) => scenario.landingPageTemplateInfo.methodTypeId.toString() === '1'
            ),
            this.phishingScenarios.some(
              (scenario) => scenario.landingPageTemplateInfo.methodTypeId.toString() === '2'
            ),
            this.phishingScenarios.some(
              (scenario) => scenario.scenarioInfo.methodTypeId.toString() === '4'
            )
          ]
        : []
    }
  },
  watch: {
    apiResponse(value = {}) {
      this.setCampaignSummary(value)
      this.setLoading(false)
    }
  },
  created() {
    this.callForData()
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
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
      if (isUseLoading) this.setLoading(true)
      SmishingService.getCampaignJobSummary(this.id, this.instanceGroup)
        .then((response) => {
          this.setCampaignSummary(response)
        })
        .finally(() => {
          if (isUseLoading) this.setLoading(false)
        })
      this.callForTargetGroups()
    },
    setCampaignSummary(response = {}) {
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
        this.campaignSummary?.smishingCampaignName || ''
      )
    },
    callForTargetGroups() {
      SmishingService.getCampaignJobSummaryTargetGroups(this.id, this.instanceGroup).then(
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
