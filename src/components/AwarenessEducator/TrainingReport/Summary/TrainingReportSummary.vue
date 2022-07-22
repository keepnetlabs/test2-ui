<template>
  <div id="training-report-summary" class="training-report-summary">
    <TrainingReportSummaryHeader
      :trainingName="trainingName"
      :resend-dialog-items="getResendDialogItems"
      :id="id"
    />
    <TrainingReportSummaryCards :items="getCardsData" :is-loading="isLoading" />
    <div class="campaign-manager-report-summary__general-info mt-6">
      <TrainingReportSummaryCampaignInfo
        :items="getCampaignSummaryItems"
        :helper-data="getCampaignSummaryHelperData"
        :is-test-training="isTestTraining"
        :isLoading="isLoading"
      />
      <TrainingReportTrainingDelivery
        class="ml-4"
        :items="getEmailDeliveryData"
        :helper-data="getEmailDeliveryHelperData"
        :isLoading="isLoading"
      />
    </div>
    <div class="training-report-summary__general-info mt-4"></div>
    <!-- <CampaignManagerReportSummaryEmail
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
import TrainingReportSummaryCampaignInfo from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryCampaignInfo'
// import CampaignManagerReportSummaryEmail from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryEmail'
// import CampaignManagerReportSummaryLandingPage from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryLandingPage'
import TrainingReportTrainingDelivery from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportTrainingDelivery'
import { getCampaignJobSummary, getCampaignJobSummaryTargetGroups } from '@/api/phishingsimulator'
import { difficulties, methods } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import { useLoading } from '@/hooks/useLoading'
export default {
  name: 'TrainingReportSummary',
  components: {
    TrainingReportTrainingDelivery,
    // CampaignManagerReportSummaryLandingPage,
    // CampaignManagerReportSummaryEmail,
    TrainingReportSummaryCampaignInfo,
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
      trainingSummary: {},
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
      const { totalTargetUserCount = 0, autoEnroll = 'No', languageShortCode = 'EN' } = this
        .trainingSummary || {
        totalTargetUserCount: 0,
        autoEnroll: 'Enroll new users the same day',
        languageShortCode: 'EN'
      }
      return {
        'Target Users': totalTargetUserCount,
        'Auto-enroll': autoEnroll,
        Languages: languageShortCode
      }
    },
    getCampaignSummaryHelperData() {
      const { targetUsers = {}, campaignInfo = {} } = this.trainingSummary || {}
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
    isTestTraining() {
      const { settings = {} } = this.trainingSummary
      const { excludeFromReports = false } = settings
      return excludeFromReports
    },
    getSettingsItems() {
      const { settings = {} } = this.trainingSummary
      const { duration, excludeFromReports, languages, smtpName = 0 } = settings
      return {
        Languages: languages || 'English',
        'Excluded from reports': excludeFromReports ? 'Yes' : 'No',
        Duration: `${duration || 0} Day(s)`,
        SMTP: smtpName
      }
    },
    getRandomlySelectedUsersCount() {
      const { targetUsers = {} } = this.trainingSummary
      return targetUsers['randomlyUsersCount'] || 0
    },
    getEmailDeliveryData() {
      const { campaignInfo = {} } = this.trainingSummary
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
      const { campaignInfo = {} } = this.trainingSummary
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
      const { scenarioStats = {} } = this.trainingSummary?.scenarioStats
        ? this.trainingSummary
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
      const { campaignInfo = {} } = this.trainingSummary
      return campaignInfo['totalTargetUserCount'] || 0
    },
    getEmailTemplateData() {
      const { emailTemplateInfo = {} } = this.trainingSummary
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
      const { landingPageTemplateInfo = {} } = this.trainingSummary
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
    callForData() {}
  }
}
</script>
