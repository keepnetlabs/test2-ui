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
        :items="getTrainingInfoData"
        :helper-data="getTrainingInfoHelperData"
        :is-test-training="isTestTraining"
        :type="getAudienceDetailsType"
        :isLoading="isLoading"
        @audienceClick="showAudienceDetailsModal"
      />
      <TrainingReportTrainingDelivery
        class="ml-4"
        :items="getTrainingDeliveryData"
        :helper-data="getTrainingDeliveryHelperData"
        :isLoading="isLoading"
      />
    </div>
    <div class="training-report-summary__general-info mt-4"></div>
    <TrainingReportEnrollmentEmail
      :form-data="getEnrollmentTemplateData"
      :isFetchingSummary="isLoading"
      :training-email-notification-template-type-resource-id="
        getTrainingEmailNotificationTemplateTypeResourceId
      "
    />
    <TrainingReportTrainingMaterial
      :form-data="getTrainingMaterialData"
      :isFetchingSummary="isLoading"
      :selected-row="getTrainingMaterialRow"
      :languages="languages"
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
import AwarenessEducatorService from '@/api/awarenessEducator'
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
      interval: null,
      languages: []
    }
  },
  computed: {
    getTrainingMaterialRow() {
      const { languages = [], trainingDetails = {} } = this.trainingSummary || {}
      return { languages, trainingId: trainingDetails?.id }
    },
    getAudienceDetailsType() {
      return this.isFromPhishingCampaign ? 'phishingCampaign' : 'userGroups'
    },
    isFromPhishingCampaign() {
      return this.trainingSummary?.isFromPhishingCampaign || true
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
    getTrainingInfoData() {
      const { totalTargetUserCount = 0 } = this?.trainingSummary?.reportDetail || {}
      const { targetGroupCount = 0, autoEnrollDescription = '', languages = ['EN'] } = this
        .trainingSummary || {
        autoEnrollDescription: 'Enroll new users the same day',
        languages: ['EN']
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
        'Auto-enroll': {
          show: true,
          value: autoEnrollDescription
        },
        Languages: {
          show: true,
          value: languages?.join(',')
        }
      }
    },
    getTrainingInfoHelperData() {
      const { groupCount } = this?.trainingSummary || {}
      return {
        groupCount
      }
    },
    isTestTraining() {
      const { isTest = false } = this.trainingSummary
      return isTest
    },
    getTrainingDeliveryHelperData() {
      const { reportDetail = {} } = this.trainingSummary || {}
      const {
        emailDeliveredUserCount = 0,
        emailErrorUserCount = 0,
        totalTargetUserCount = 0
      } = reportDetail
      return {
        emailDeliveredUserCount,
        emailErrorUserCount,
        totalTargetUserCount
      }
    },
    getTrainingDeliveryData() {
      const { reminderDescription = '' } = this.trainingSummary
      return {
        'Reminder Options': {
          show: true,
          value: reminderDescription
        },
        'Delivery Status': {
          show: true,
          value: ''
        }
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
      const { reportDetail = {} } = this.trainingSummary || {}
      const {
        totalTargetUserCount = 0,
        totalUserClickedCount = 0,
        totalUserOpenedCount = 0,
        noResponseCount = 0,
        completedCount = 0,
        inProgressCount = 0
      } = reportDetail
      const inProgress = inProgressCount ? inProgressCount : completedCount - totalUserClickedCount
      return {
        openedEmail: {
          userCount: totalUserOpenedCount,
          userPercent: ((totalUserOpenedCount / totalTargetUserCount) * 100).toFixed()
        },
        inProgress: {
          userCount: inProgress,
          userPercent: ((inProgress / totalTargetUserCount) * 100).toFixed()
        },
        completedTraining: {
          userCount: completedCount,
          userPercent: ((completedCount / totalTargetUserCount) * 100).toFixed()
        },
        noResponse: {
          userCount: noResponseCount,
          userPercent: ((noResponseCount / totalTargetUserCount) * 100).toFixed()
        }
      }
    },
    getTrainingEmailNotificationTemplateTypeResourceId() {
      const { trainingEmailNotificationTemplateTypeResourceId = '' } = this.trainingSummary || {}
      return trainingEmailNotificationTemplateTypeResourceId
    },
    getTotalUsers() {
      const { campaignInfo = {} } = this.trainingSummary
      return campaignInfo['totalTargetUserCount'] || 0
    },
    getEnrollmentTemplateData() {
      const { trainingDetails = {} } = this.trainingSummary || {}
      const {
        name = 'Training Enrollment Email',
        createdBy = '',
        description = 'Default training enrollment email'
      } = trainingDetails

      return {
        name,
        createdBy,
        description
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
      const { trainingDetails = {}, languages = [] } = this.trainingSummary || {}
      const { name = '', createdBy = '', trainingCategory = '', description = '' } = trainingDetails
      return {
        name,
        createdBy,
        category: trainingCategory,
        description,
        languages
      }
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
      AwarenessEducatorService.getTrainingReportSummary(this.id)
        .then((response) => {
          this.trainingSummary = response?.data?.data
          this.$store.dispatch(
            'common/setActivePageRouterName',
            this.trainingSummary?.trainingName || ''
          )
        })
        .finally(() => {
          if (isUseLoading) {
            this.setLoading(false)
          }
        })
    },
    callForLanguages() {
      AwarenessEducatorService.getLanguages().then((response) => {
        this.languages = response?.data?.data
      })
    },
    showAudienceDetailsModal() {
      this.isAudienceModalVisible = true
    },
    hideAudienceDetailsModal() {
      this.isAudienceModalVisible = false
    }
  }
}
</script>
