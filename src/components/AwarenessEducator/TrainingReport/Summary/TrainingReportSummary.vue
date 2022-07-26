<template>
  <div id="training-report-summary" class="training-report-summary">
    <TrainingReportSummaryAudienceDetails
      v-if="isAudienceModalVisible"
      :status="isAudienceModalVisible"
      :type="getAudienceDetailsType"
      :userGroups="getUserGroups"
      :phishingCampaign="getPhishingCampaign"
      @close="hideAudienceDetailsModal"
    />
    <TrainingReportSummaryHeader
      :trainingName="trainingName"
      :resend-dialog-items="getResendDialogItems"
      :id="id"
    />
    <TrainingReportSummaryCards :items="getCardsData" :is-loading="isLoading" />
    <div class="campaign-manager-report-summary__general-info mt-6">
      <TrainingReportSummaryTrainingInfo
        :items="getCampaignSummaryItems"
        :helper-data="getCampaignSummaryHelperData"
        :is-test-training="isTestTraining"
        :type="getAudienceDetailsType"
        :isLoading="isLoading"
        @audienceClick="showAudienceDetailsModal"
      />
      <TrainingReportTrainingDelivery
        class="ml-4"
        :items="getEmailDeliveryData"
        :helper-data="getEmailDeliveryHelperData"
        :isLoading="isLoading"
      />
    </div>
    <div class="training-report-summary__general-info mt-4"></div>
    <TrainingReportEnrollmentEmail
      :form-data="getEnrollmentTemplateData"
      :isFetchingSummary="isLoading"
    />

    <TrainingReportTrainingMaterial
      :form-data="getTrainingMaterialData"
      :isFetchingSummary="isLoading"
    />
    <TrainingReportCertificate :form-data="getCertificateData" :isFetchingSummary="isLoading" />
  </div>
</template>

<script>
import TrainingReportSummaryHeader from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryHeader'
import TrainingReportSummaryCards from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryCards'
import TrainingReportSummaryTrainingInfo from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryTrainingInfo'
import TrainingReportEnrollmentEmail from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportEnrollmentEmail'
import TrainingReportCertificate from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportCertificate'
import TrainingReportTrainingMaterial from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportTrainingMaterial'
import TrainingReportTrainingDelivery from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportTrainingDelivery'
import TrainingReportSummaryAudienceDetails from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryAudienceDetails'
import { getCampaignJobSummary, getCampaignJobSummaryTargetGroups } from '@/api/phishingsimulator'
import { difficulties, methods } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import { useLoading } from '@/hooks/useLoading'
export default {
  name: 'TrainingReportSummary',
  components: {
    TrainingReportTrainingDelivery,
    TrainingReportTrainingMaterial,
    TrainingReportEnrollmentEmail,
    TrainingReportSummaryTrainingInfo,
    TrainingReportSummaryCards,
    TrainingReportSummaryHeader,
    TrainingReportSummaryAudienceDetails,
    TrainingReportCertificate
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
      isAudienceModalVisible: false,
      targetGroups: [],
      trainingSummary: {},
      interval: null
    }
  },
  computed: {
    getAudienceDetailsType() {
      return this.isFromPhishingCampaign ? 'phishingCampaign' : 'userGroups'
    },
    isFromPhishingCampaign() {
      return this.trainingSummary?.isFromPhishingCampaign || false
    },
    isFromUserGroups() {
      return this.trainingSummary?.isFromUserGroups || false
    },
    getPhishingCampaign() {
      return this.trainingSummary?.phishingCampaign || {}
    },
    getUserGroups() {
      return this.trainingSummary?.userGroups || {}
    },
    getCampaignSummaryItems() {
      const {
        phishingCampaign = {},
        totalTargetUserCount = 0,
        targetGroupCount = 0,
        autoEnroll = 'No',
        languageShortCode = 'EN'
      } = this.trainingSummary || {
        totalTargetUserCount: 0,
        autoEnroll: 'Enroll new users the same day',
        languageShortCode: 'EN',
        targetGroupCount: null,
        phishingCampaign: null
      }
      return {
        'Target Users': {
          show: true,
          value: totalTargetUserCount
        },
        targetGroupCount: {
          show: false,
          value: targetGroupCount
        },
        phishingCampaign: {
          show: false,
          value: phishingCampaign
        },
        'Auto-enroll': {
          show: true,
          value: autoEnroll
        },
        Languages: { show: true, value: languageShortCode }
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
    getEmailDeliveryData() {
      const { campaignInfo = {} } = this.trainingSummary
      const {
        emailDeliveryStartDate = '01/01/1970',
        emailDeliveryEndDate = '01/01/1970',
        emailDeliveryDuration = 0,
        reminderOptions = 'Every 2 months, ends when user completes the training',
        isEnded = false
      } = campaignInfo
      return {
        'Delivery Start - End': {
          show: true,
          value: `${emailDeliveryStartDate} - ${emailDeliveryEndDate}`
        },
        'Reminder Options': {
          show: true,
          value: reminderOptions
        },
        isEnded: {
          show: false,
          value: isEnded
        },
        'Delivery Status': {
          show: true,
          value: ''
        }
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
    getEnrollmentTemplateData() {
      const { enrollmentTemplateInfo = {} } = this.trainingSummary
      const { name, createdBy, description } = enrollmentTemplateInfo

      return {
        name: 'Training Enrollment Email',
        createdBy: 'Company Name',
        description: 'Default training enrollment email bla bla enrollment email description'
      }
    },
    getCertificateData() {
      const { certificateInfo = {} } = this.trainingSummary
      const { name, createdBy, description } = certificateInfo

      return {
        name: 'Certificate Name',
        createdBy: 'Company Name',
        description: 'Certificate description'
      }
    },
    getTrainingMaterialData() {
      const { trainingMaterial = {} } = this.trainingSummary
      const { name, createdBy, category, description, languageShortCode } = trainingMaterial
      return {
        name: 'Training Name',
        createdBy: 'Company Name',
        category: 'Information security (category)',
        description: 'Training content’s description',
        languageShortCode: 'EN'
      }
    }
  },
  created() {
    this.callForData()
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    callForData() {},
    showAudienceDetailsModal() {
      this.isAudienceModalVisible = true
    },
    hideAudienceDetailsModal() {
      this.isAudienceModalVisible = false
    }
  }
}
</script>
