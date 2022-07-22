<template>
  <div id="training-report-summary" class="training-report-summary">
    <TrainingReportSummaryHeader
      :trainingName="trainingName"
      :resend-dialog-items="getResendDialogItems"
      :id="id"
    />
    <TrainingReportSummaryCards :items="getCardsData" :is-loading="isLoading" />
    <!--
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
    <div class="campaign-manager-report-summary__general-info mt-4"></div>
    <CampaignManagerReportSummaryEmail
      :form-data="getEmailTemplateData"
      :isFetchingSummary="isLoading"
    />
    <CampaignManagerReportSummaryLandingPage
      v-if="!isAttachment"
      :form-data="getLandingPageTemplateData"
      :isFetchingSummary="isLoading"
    /> -->
  </div>
</template>

<script>
import TrainingReportSummaryHeader from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryHeader'
import TrainingReportSummaryCards from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryCards'
// import CampaignManagerReportSummaryCampaignInfo from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryCampaignInfo'
// import CampaignManagerReportSummaryEmail from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryEmail'
// import CampaignManagerReportSummaryLandingPage from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryLandingPage'
// import CampaignManagerReportEmailDelivery from '@/components/CampaignManagerReport/Summary/CampaignManagerReportEmailDelivery'
import { getCampaignJobSummary, getCampaignJobSummaryTargetGroups } from '@/api/phishingsimulator'
import { difficulties, methods } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import { useLoading } from '@/hooks/useLoading'
export default {
  name: 'TrainingReportSummary',
  components: {
    // CampaignManagerReportEmailDelivery,
    // CampaignManagerReportSummaryLandingPage,
    // CampaignManagerReportSummaryEmail,
    // CampaignManagerReportSummaryCampaignInfo,
    TrainingReportSummaryCards,
    TrainingReportSummaryHeader
  },
  mixins: [useLoading],
  props: {
    id: {
      type: String
    },
    trainingName: {
      type: String
    }
  },
  data() {
    return {
      targetGroups: [],
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
    getCampaignSummaryItems() {
      const { endDate = '0', totalTargetUserCount = 0 } = this.campaignSummary?.campaignInfo || {
        endDate: '0',
        totalTargetUserCount: 0
      }
      const { languageShortCode = 'EN' } = this.campaignSummary?.scenarioInfo || {
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
      const { settings = {} } = this.campaignSummary
      const { excludeFromReports = false } = settings
      return excludeFromReports
    },
    getSettingsItems() {
      const { settings = {} } = this.campaignSummary
      const { duration, excludeFromReports, languages, smtpName = 0 } = settings
      return {
        Languages: languages || 'English',
        'Excluded from reports': excludeFromReports ? 'Yes' : 'No',
        Duration: `${duration || 0} Day(s)`,
        SMTP: smtpName
      }
    },
    getRandomlySelectedUsersCount() {
      const { targetUsers = {} } = this.campaignSummary
      return targetUsers['randomlyUsersCount'] || 0
    },
    getEmailDeliveryData() {
      const { campaignInfo = {} } = this.campaignSummary
      const {
        emailDeliveryStartDate = '01/01/1970',
        emailDeliveryEndDate = '01/01/1970',
        emailDeliveryDuration = 0
      } = campaignInfo
      return {
        'Delivery Start - End': `${emailDeliveryStartDate} - ${emailDeliveryEndDate}`,
        Duration: `${emailDeliveryDuration}`,
        'Delivery Status': ''
      }
    },
    getEmailDeliveryHelperData() {
      const { campaignInfo = {} } = this.campaignSummary
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
        noResponseEmail = 0,
        notDelivered = 0,
        notCompletedTraining = 0,
        notCompletedExam = 0,
        failedExam = 0
      ] = this.getChartData
      return this.getChartData.length
        ? {
            openedEmail,
            clickedEmail,
            noResponseEmail,
            notDelivered,
            notCompletedTraining,
            notCompletedExam,
            failedExam
          }
        : {}
    },
    getChartData() {
      const defaultScenarioStatsObject = {
        scenarioStats: {
          openedEmail: 0,
          clickedEmail: 0,
          noResponseEmail: 0,
          notDelivered: 0,
          notCompletedTraining: 0,
          notCompletedExam: 0,
          failedExam: 0,
          inProgress: 0,
          completedTraining: 0
        }
      }
      const { scenarioStats = {} } = this.campaignSummary?.scenarioStats
        ? this.campaignSummary
        : defaultScenarioStatsObject
      const {
        openedEmail = 0,
        clickedEmail = 0,
        noResponseEmail = 0,
        notDelivered = 0,
        notCompletedTraining = 0,
        notCompletedExam = 0,
        failedExam = 0,
        inProgress = 0,
        completedTraining = 0
      } = scenarioStats
      const dataContainer = [
        openedEmail,
        clickedEmail,
        noResponseEmail,
        notDelivered,
        notCompletedTraining,
        notCompletedExam,
        failedExam,
        inProgress,
        completedTraining
      ]
      return dataContainer.every((item) => item === 0) ? [] : dataContainer
    },
    getCardsData() {
      if (!this.getChartData.length) return {}
      const [
        openedEmail = 0,
        noResponseEmail = 0,
        inProgress = 0,
        completedTraining = 0
      ] = this.getChartData
      return {
        openedEmail: {
          userCount: openedEmail,
          userPercent: ((openedEmail / this.getTotalUsers) * 100).toFixed()
        },
        inProgress: {
          userCount: inProgress,
          userPercent: ((inProgress / this.getTotalUsers) * 100).toFixed()
        },
        completedTraining: {
          userCount: completedTraining,
          userPercent: ((completedTraining / this.getTotalUsers) * 100).toFixed()
        },
        noResponse: {
          userCount: noResponseEmail,
          userPercent: ((noResponseEmail / this.getTotalUsers) * 100).toFixed()
        }
      }
    },
    getTotalUsers() {
      const { campaignInfo = {} } = this.campaignSummary
      return campaignInfo['totalTargetUserCount'] || 0
    },
    getEmailTemplateData() {
      const { emailTemplateInfo = {} } = this.campaignSummary
      const {
        name,
        difficultyResourceId,
        categoryResourceId,
        fromName,
        fromAddress,
        resourceId,
        languageShortCode,
        phishingFileName
      } = emailTemplateInfo

      return Object.keys(emailTemplateInfo).length
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
            jobResourceId: this.id
          }
        : {}
    },
    getLandingPageTemplateData() {
      const { landingPageTemplateInfo = {} } = this.campaignSummary
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
            jobResourceId: this.id
          }
        : {}
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
      getCampaignJobSummary(this.id)
        .then((response) => {
          this.campaignSummary = response?.data?.data
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
      getCampaignJobSummaryTargetGroups(this.id).then((response) => {
        this.targetGroups = response?.data?.data?.groups || []
      })
    }
  }
}
</script>
