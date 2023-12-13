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
      :isScormProxy="isScormProxy"
      :trainingName="trainingName"
      :resend-dialog-items="getResendDialogItems"
      :isLoading="isLoading"
      :id="id"
    />
    <TrainingReportSummaryCards :items="getCardsData" :is-loading="isLoading" />
    <div class="mt-6 training-report-scorm-info">
      <TrainingReportScormEnrollmentInfo
        :items="getTrainingInfoData"
        :helper-data="getTrainingInfoHelperData"
        :is-test-training="isTestTraining"
        :type="getAudienceDetailsType"
        :isLoading="isLoading"
        @audienceClick="showAudienceDetailsModal"
      />
    </div>
    <div class="training-report-summary__general-info mt-4"></div>
    <TrainingReportTrainingMaterial
      :form-data="getTrainingMaterialData"
      :isFetchingSummary="isLoading"
      :selected-row="getTrainingMaterialRow"
      :languages="languages"
    />
  </div>
</template>

<script>
import TrainingReportSummaryHeader from '@/components/ScormProxyReport/Summary/TrainingReportSummaryHeader'
import TrainingReportSummaryCards from '@/components/ScormProxyReport/Summary/TrainingReportSummaryCards'
import TrainingReportTrainingMaterial from '@/components/ScormProxyReport/Summary/TrainingReportTrainingMaterial'
import TrainingReportSummaryAudienceDetails from '@/components/ScormProxyReport/Summary/TrainingReportSummaryAudienceDetails'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { getDefaultEmailTemplate } from '@/api/company'
import TrainingReportScormEnrollmentInfo from '@/components/ScormProxyReport/Summary/TrainingReportScormEnrollmentInfo.vue'
export default {
  name: 'TrainingReportSummary',
  components: {
    TrainingReportScormEnrollmentInfo,
    TrainingReportTrainingMaterial,
    TrainingReportSummaryCards,
    TrainingReportSummaryHeader,
    TrainingReportSummaryAudienceDetails
  },
  props: {
    id: {
      type: String
    },
    trainingName: {
      type: String
    },
    trainingSummary: {
      type: Object
    },
    scormTrainingSummary: {
      type: Object
    },
    isLoading: {
      type: Boolean
    }
  },
  data() {
    return {
      isAudienceModalVisible: false,
      targetGroups: [],
      interval: null,
      languages: [],
      enrollmentEmailData: {},
      certificateEmailData: {}
    }
  },
  computed: {
    isScormProxy() {
      console.log('this.trainingSummary', this.trainingSummary)
      return this.trainingSummary?.isScormProxy || false
    },
    getTrainingMaterialRow() {
      const { languages = [], trainingDetails = {} } = this.trainingSummary || {}
      return {
        languages,
        trainingId: trainingDetails?.id,
        trainingName: trainingDetails?.name
      }
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
      const { totalTargetUser = 0, totalNonTargetUser = 0 } = this.scormTrainingSummary || {}
      const { startDate = '' } = this?.trainingSummary || {}
      const { targetGroupCount = 0, languages = ['EN'] } = this.trainingSummary || {
        autoEnrollDescription: 'Enroll new users the same day',
        languages: ['EN']
      }
      return {
        'Target Users': {
          show: true,
          value: totalTargetUser
        },
        Languages: {
          show: true,
          value: languages?.join(', ')
        },
        targetGroupCount: {
          show: false,
          value: targetGroupCount
        },
        'Non-Target Users': {
          show: true,
          value: totalNonTargetUser
        },
        'Training Proxy Package Download Date': {
          show: true,
          value: startDate
        }
      }
    },
    getSMSSummaryHelperData() {
      const { sentCount } = this?.trainingSummary?.smsSummary || {}
      return {
        sentCount
      }
    },
    getTrainingInfoHelperData() {
      const { groupCount } = this?.trainingSummary || {}
      return {
        groupCount
      }
    },
    isTestTraining() {
      const { isTest = false } = this.trainingSummary || {}
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
      const { reminderDescription = 'No', startDate = '' } = this.trainingSummary || {
        reminderDescription: 'No',
        startDate: ''
      }
      return {
        'Start Date': {
          show: true,
          value: startDate
        },
        'Reminder Options': {
          show: true,
          value: reminderDescription || 'No'
        },
        'Delivery Status': {
          show: true,
          value: ''
        }
      }
    },
    getResendDialogItems() {
      const [
        totalUserOpenedCount = 0,
        totalUserClickedCount = 0,
        totalTargetUserCount = 0,
        emailDeliveredUserCount = 0,
        emailErrorUserCount = 0,
        didNotCompleteTrainingCount = 0,
        didNotCompleteExamCount = 0,
        failedExamCount = 0,
        noResponseCount = 0
      ] = this.getChartData
      return this.getChartData.length
        ? {
            totalUserOpenedCount,
            totalUserClickedCount,
            totalTargetUserCount,
            emailDeliveredUserCount,
            emailErrorUserCount,
            didNotCompleteTrainingCount,
            didNotCompleteExamCount,
            failedExamCount,
            noResponseCount
          }
        : {}
    },
    getChartData() {
      const defaultScenarioStatsObject = {
        totalUserOpenedCount: 0,
        totalUserClickedCount: 0,
        totalTargetUserCount: 0,
        emailDeliveredUserCount: 0,
        emailErrorUserCount: 0,
        didNotCompleteTrainingCount: 0,
        didNotCompleteExamCount: 0,
        failedExamCount: 0,
        noResponseCount: 0
      }
      const { reportDetail = {} } = this.trainingSummary
        ? this.trainingSummary
        : defaultScenarioStatsObject
      const {
        totalUserOpenedCount = 0,
        totalUserClickedCount = 0,
        totalTargetUserCount = 0,
        emailDeliveredUserCount = 0,
        emailErrorUserCount = 0,
        didNotCompleteTrainingCount = 0,
        didNotCompleteExamCount = 0,
        failedExamCount = 0,
        noResponseCount = 0
      } = reportDetail
      const dataContainer = [
        totalUserOpenedCount,
        totalUserClickedCount,
        totalTargetUserCount,
        emailDeliveredUserCount,
        emailErrorUserCount,
        didNotCompleteTrainingCount,
        didNotCompleteExamCount,
        failedExamCount,
        noResponseCount
      ]
      return dataContainer.every((item) => item === 0) ? [] : dataContainer
    },
    getCardsData() {
      const {
        totalTargetUser = 0,
        totalNonTargetUser = 0,
        totalInProgress = 0,
        totalCompleteds = 0
      } = this.scormTrainingSummary || {}
      const totalUsers = totalTargetUser + totalNonTargetUser
      return {
        inProgress: {
          userCount: totalInProgress,
          userPercent: totalUsers === 0 ? '0' : ((totalInProgress / totalUsers) * 100).toFixed()
        },
        completedTraining: {
          userCount: totalCompleteds,
          userPercent: totalUsers === 0 ? '0' : ((totalCompleteds / totalUsers) * 100).toFixed()
        }
      }
    },
    getTrainingEmailNotificationTemplateTypeResourceId() {
      const { trainingEmailNotificationTemplateTypeResourceId = '' } = this.trainingSummary || {}
      return trainingEmailNotificationTemplateTypeResourceId
    },
    getTrainingMaterialData() {
      const { trainingDetails = {}, languages = [] } = this.trainingSummary || {}
      const { name = '', companyName = '', category = '', description = '' } = trainingDetails
      return {
        name,
        createdBy: companyName,
        category,
        description,
        languages
      }
    },
    getCertificateEmailNotificationTemplateTypeResourceId() {
      const { certificateAttachmentResourceId = '' } = this.trainingSummary || {}
      return certificateAttachmentResourceId
    }
  },
  created() {
    this.callForLanguages()
    // this.callForEnrollmentEmail()
    // this.callForCertificate()
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  watch: {
    getCertificateEmailNotificationTemplateTypeResourceId(val) {
      if (val) {
        this.callForCertificate()
      }
    },
    getTrainingEmailNotificationTemplateTypeResourceId(val) {
      if (val) {
        this.callForEnrollmentEmail()
      }
    }
  },
  methods: {
    callForEnrollmentEmail() {
      if (this.getTrainingEmailNotificationTemplateTypeResourceId) {
        getDefaultEmailTemplate(this.getTrainingEmailNotificationTemplateTypeResourceId).then(
          (response) => {
            const {
              data: { data }
            } = response
            this.enrollmentEmailData = data?.template || {}
          }
        )
      }
    },
    callForCertificate() {
      if (this.getCertificateEmailNotificationTemplateTypeResourceId) {
        AwarenessEducatorService.getCertificateHtml(
          this.getCertificateEmailNotificationTemplateTypeResourceId
        ).then((response) => {
          const {
            data: { data }
          } = response
          this.certificateEmailData = data
        })
      }
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
