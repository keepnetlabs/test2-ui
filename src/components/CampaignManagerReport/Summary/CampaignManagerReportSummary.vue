<template>
  <div id="campaign-manager-report-summary" class="campaign-manager-report-summary">
    <CampaignManagerReportSummaryHeader
      :phishing-scenario-name="phishingScenarioName"
      :resend-dialog-items="getResendDialogItems"
      :id="id"
      :instance-group="instanceGroup"
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
        :key="index"
        :name="template.customKey"
        :label="template.scenarioInfo.name"
      />
    </ElTabs>
    <CampaignManagerReportSummaryEmail
      :form-data="getEmailTemplateData"
      :isFetchingSummary="isLoading"
    />
    <CampaignManagerReportSummaryLandingPage
      v-if="!isAttachment"
      :form-data="getLandingPageTemplateData"
      :isFetchingSummary="isLoading"
    />
  </div>
</template>

<script>
import CampaignManagerReportSummaryHeader from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryHeader'
import CampaignManagerReportSummaryCards from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryCards'
import CampaignManagerReportSummaryCampaignInfo from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryCampaignInfo'
import CampaignManagerReportSummaryEmail from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryEmail'
import CampaignManagerReportSummaryLandingPage from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryLandingPage'
import { getCampaignJobSummary, getCampaignJobSummaryTargetGroups } from '@/api/phishingsimulator'
import { difficulties, methods } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import { useLoading } from '@/hooks/useLoading'
import CampaignManagerReportEmailDelivery from '@/components/CampaignManagerReport/Summary/CampaignManagerReportEmailDelivery'
import { createRandomCryptStringNumber } from '@/utils/functions'
export default {
  name: 'CampaignManagerReportSummary',
  components: {
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
    }
  },
  data() {
    return {
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
      ]
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
    isAttachment() {
      return this.getScenarioMethod.toString() === '3' || false
    },
    getCampaignSummaryItems() {
      const { endDate = '0', totalTargetUserCount = 0 } = this.campaignSummary?.campaignInfo || {
        endDate: '0',
        totalTargetUserCount: 0
      }
      const { languageShortCode = 'EN' } = this.getActiveScenario?.scenarioInfo || {
        languageShortCode: 'EN'
      }
      const { duration = '0' } = this.campaignSummary?.settings || { duration: '0' }
      return {
        'Target Users': totalTargetUserCount,
        'Campaign Lifetime': `${duration} days (Ends at ${endDate})`,
        Languages: languageShortCode
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
        startDate = '01/01/1970',
        endDate = '01/01/1970',
        emailDeliveryDuration = 0
      } = campaignInfo
      return {
        'Delivery Start - End': `${startDate} - ${endDate}`,
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
        openedEmail = 0,
        clickedEmail = 0,
        submittedEmail = 0,
        noResponseEmail = 0,
        notDelivered = 0,
        attachmentOpenedEmail = 0
      ] = this.getChartData
      return this.getChartData.length
        ? {
            clickedEmail,
            noResponseEmail,
            notDelivered,
            openedEmail,
            submittedEmail,
            attachmentOpenedEmail
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
          reportedEmail: 0
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
        reportedEmail = 0
      } = scenarioStats
      const dataContainer = [
        openedEmail,
        clickedEmail,
        submittedEmail,
        noResponseEmail,
        notDelivered,
        attachmentOpenedEmail,
        reportedEmail
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
        reportedEmail = 0
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
        }
      }
    },
    getTotalUsers() {
      const { campaignInfo = {} } = this.campaignSummary
      return campaignInfo['totalTargetUserCount'] || 0
    },
    getEmailTemplateData() {
      const { emailTemplateInfo = {} } = this.getActiveScenario || {
        emailTemplateInfo: {}
      }
      if (!Object.keys(emailTemplateInfo)?.length) {
        return {}
      }
      const {
        name,
        difficultyResourceId,
        categoryResourceId,
        fromName,
        fromAddress,
        resourceId,
        languageShortCode,
        phishingFileName
      } = emailTemplateInfo || {}

      return Object.keys(emailTemplateInfo)?.length
        ? {
            difficulty: difficulties.find((item) => item.value === difficultyResourceId)?.text,
            method: methods.find((item) => item.value === categoryResourceId)?.text,
            fromName,
            fromAddress,
            name,
            resourceId,
            languageShortCode,
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
      const { landingPageTemplateInfo = {} } = this.getActiveScenario || {}
      const {
        name,
        urlTemplate,
        difficultyTypeId = 1,
        methodTypeId = 1,
        resourceId,
        languageShortCode
      } = landingPageTemplateInfo
      return Object.keys(landingPageTemplateInfo).length
        ? {
            languageShortCode,
            name,
            urlTemplate,
            method: methods[methodTypeId - 1].text,
            difficulty: difficulties[difficultyTypeId - 1].text,
            resourceId,
            jobResourceId: this.id,
            instanceGroup: this.instanceGroup
          }
        : {}
    },
    getCampaignMethodTypes() {
      return this.phishingScenarios.length > 1
        ? [
            this.phishingScenarios.some(
              (scenario) => scenario.scenarioInfo.methodTypeId.toString() === '1'
            ),
            this.phishingScenarios.some(
              (scenario) => scenario.scenarioInfo.methodTypeId.toString() === '2'
            ),
            this.phishingScenarios.some(
              (scenario) => scenario.scenarioInfo.methodTypeId.toString() === '3'
            )
          ]
        : []
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
      this.callApis(true)
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
          this.campaignSummary = response?.data?.data
          if (this?.campaignSummary?.scenarios?.length) {
            this.campaignSummary.scenarios = this.campaignSummary.scenarios.map((pScenario) => ({
              ...pScenario,
              customKey: `key-${createRandomCryptStringNumber()}`
            }))
            this.selectedScenarioTab = this?.campaignSummary?.scenarios[0].customKey
          }
          this.$store.dispatch(
            'common/setActivePageRouterName',
            this.campaignSummary?.phishingCampaignName || ''
          )
        })
        .finally(() => {
          if (isUseLoading) {
            this.setLoading(false)
          }
        })
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
