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
    <CampaignManagerReportSummaryCards
      :multiple-type="multipleType"
      :method="getScenarioMethod"
      :items="getCardsData"
      :is-loading="isLoading || !getScenarioMethod"
    />
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
      <span class="campaign-manager-last-step__phishing-scenario-label">Phishing Scenarios</span>
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
    <CampaignManagerReportSummaryEmail
      :difficulties="difficulties"
      :methods="methods"
      :form-data="getEmailTemplateData"
      :isFetchingSummary="isLoading"
    />
    <CallbackCampaignModalSummaryCallbackTemplate
      class="my-4"
      :formValues="getCallbackTemplateData"
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
import CampaignManagerReportSummaryHeader from '@/components/CallbackReport/Summary/CampaignManagerReportSummaryHeader'
import CampaignManagerReportSummaryCards from '@/components/CallbackReport/Summary/CampaignManagerReportSummaryCards'
import CampaignManagerReportSummaryCampaignInfo from '@/components/CallbackReport/Summary/CampaignManagerReportSummaryCampaignInfo'
import CampaignManagerReportSummaryEmail from '@/components/CallbackReport/Summary/CampaignManagerReportSummaryEmail'
// TODO: Change api endpoint
import { getCampaignJobSummary, getCampaignJobSummaryTargetGroups } from '@/api/phishingsimulator'
import { difficulties, methods } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import { useLoading } from '@/hooks/useLoading'
import CampaignManagerReportEmailDelivery from '@/components/CallbackReport/Summary/CampaignManagerReportEmailDelivery'
import { createRandomCryptStringNumber } from '@/utils/functions'
import CampaignManagerReportSummaryTraining from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryTraining.vue'
import { TrainingReportDialogModel } from '@/components/CampaignManagerReport/Summary/utils'
import CallbackCampaignModalSummaryCallbackTemplate from '@/components/CallbackScenarios/CallbackCampaignModalSummaryCallbackTemplate'
export default {
  name: 'CampaignManagerReportSummary',
  components: {
    CampaignManagerReportSummaryTraining,
    CampaignManagerReportEmailDelivery,
    CampaignManagerReportSummaryEmail,
    CampaignManagerReportSummaryCampaignInfo,
    CampaignManagerReportSummaryCards,
    CampaignManagerReportSummaryHeader,
    CallbackCampaignModalSummaryCallbackTemplate,
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
    multipleType: {
      type: Array
    },
    apiResponse: {
      type: Object
    }
  },
  data() {
    return {
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
      methods
    }
  },
  computed: {
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
        trainingId: this.getTrainingInfo?.trainingId
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
        languages.add(scenario.scenarioInfo.languageShortCode)
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
        clickedEmail,
        submittedEmail,
        noResponseEmail,
        notDelivered,
        attachmentOpenedEmail,
        reportedEmail,
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
      const { emailTemplateInfo = {}, scenarioInfo = {} } = this.getActiveScenario || {
        emailTemplateInfo: {}
      }
      if (!Object.keys(emailTemplateInfo)?.length) {
        return {}
      }
      const { resourceId, phishingFileName } = emailTemplateInfo || {}

      return Object.keys(emailTemplateInfo)?.length
        ? {
            resourceId,
            languageShortCode: scenarioInfo?.languageShortCode,
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
    getCallbackTemplateData() {
      // TODO: Change here with callback template data
      return {
        template: {
          name: 'Template Name',
          language: 'English',
          voice: 'Female',
          difficulty: 'Medium',
          steps: [
            {
              inputType: 'TextToSpeech',
              inputText:
                'Lorem ipsum dolor sit amet consectetur. Integer cras nisi fermentum ullamcorper cursus risus id risus consequat. Et sollicitudin est eu in. Consequat ultrices quis malesuada auctor etiam sagittis et amet. Purus sed suspendisse diam donec. Ornare odio tempor sollicitudin aliquet tempus facilisis arcu.',
              inputDigit: 6,
              duration: 0,
              isVishingStep: true,
              content: null,
              inputUrl: null,
              isExpanded: true
            },
            {
              inputType: 'FileUpload',
              inputText: '',
              inputDigit: 5,
              content: null,
              duration: 0,
              isVishingStep: false,
              inputUrl: `https://keepnetlabsvishing.s3.eu-west-2.amazonaws.com/VishingTEST/X7AE3NtBgV1B-2.mp3`,
              isExpanded: true
            },
            {
              inputType: 'Pause',
              inputText: '',
              inputDigit: 0,
              content: null,
              duration: 3,
              isVishingStep: false,
              inputUrl: null,
              isExpanded: true
            }
          ],
          callGreeting: {
            inputType: 'TextToSpeech',
            inputText:
              'Lorem ipsum dolor sit amet consectetur. Integer cras nisi fermentum ullamcorper cursus risus id risus consequat. Et sollicitudin est eu in. Consequat ultrices quis malesuada auctor etiam sagittis et amet. Purus sed suspendisse diam donec. Ornare odio tempor sollicitudin aliquet tempus facilisis arcu.',
            content: null,
            duration: 0,
            phishingCodeDigits: 6,
            isVishingStep: false,
            inputUrl: null
          },
          invalidDialingNotice: {
            inputType: 'TextToSpeech',
            inputText:
              'Lorem ipsum dolor sit amet consectetur. Integer cras nisi fermentum ullamcorper cursus risus id risus consequat. Et sollicitudin est eu in. Consequat ultrices quis malesuada auctor etiam sagittis et amet. Purus sed suspendisse diam donec. Ornare odio tempor sollicitudin aliquet tempus facilisis arcu.',
            inputDigit: 0,
            content: null,
            duration: 0,
            isVishingStep: false,
            inputUrl: null
          }
        }
      }
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
      if (isUseLoading) {
        this.setLoading(true)
      }
      getCampaignJobSummary(this.id, this.instanceGroup)
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
        this.campaignSummary?.phishingCampaignName || ''
      )
    },
    callForTargetGroups() {
      getCampaignJobSummaryTargetGroups(this.id, this.instanceGroup).then((response) => {
        this.targetGroups = response?.data?.data?.groups || []
      })
    },
    setScenarioDetail(event = {}) {
      this.activeScenarioIndex = event.index
    }
  }
}
</script>
