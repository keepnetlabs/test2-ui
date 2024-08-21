<template>
  <div id="training-report-summary" class="training-report-summary">
    <ElTabs v-if="isTrainingTypeLearningPath" v-model="tab" class="k-sub-tab">
      <ElTabPane label="Summary" name="summary" id="summary-content" />
      <ElTabPane label="Users" name="users" id="users-content" />
    </ElTabs>
    <div v-if="tab === 'summary'">
      <TrainingReportSummaryAudienceDetails
        v-if="isAudienceModalVisible"
        :status="isAudienceModalVisible"
        :type="getAudienceDetailsType"
        :userGroups="getUserGroups"
        :phishingCampaign="getPhishingCampaign"
        @close="hideAudienceDetailsModal"
      />
      <TrainingReportSummaryHeader
        :is-scorm-proxy="isScormProxy"
        :training-name="trainingName"
        :resend-dialog-items="getResendDialogItems"
        :is-loading="isLoading"
        :id="id"
        :training-type="getTrainingType"
      />
      <TrainingReportSummaryCards
        :items="getCardsData"
        :is-loading="isLoading"
        :total-user-count="getTotalUsers"
        :training-type="getTrainingType"
      />
      <div class="campaign-manager-report-summary__general-info mt-6">
        <TrainingReportSummaryTrainingInfo
          :items="getTrainingInfoData"
          :helper-data="getTrainingInfoHelperData"
          :is-test-training="isTestTraining"
          :type="getAudienceDetailsType"
          :is-loading="isLoading"
          :training-type="getTrainingType"
          @audienceClick="showAudienceDetailsModal"
        />
        <TrainingReportTrainingDelivery
          class="ml-4"
          :items="getTrainingDeliveryData"
          :helper-data="getTrainingDeliveryHelperData"
          :isLoading="isLoading"
          :training-type="getTrainingType"
        />
      </div>
      <div class="training-report-summary__general-info mt-4"></div>
      <TrainingReportSMSSummary
        v-if="isSMSSummaryExist"
        :isLoading="isLoading"
        :items="getSMSSummaryData"
        :helper-data="getSMSSummaryHelperData"
      />
      <TrainingReportEnrollmentEmail
        :form-data="getEnrollmentTemplateData"
        :isFetchingSummary="isLoading"
        :training-email-notification-template-type-resource-id="
          getTrainingEmailNotificationTemplateTypeResourceId
        "
        :training-type="getTrainingType"
      />
      <TrainingReportTrainingMaterial
        :form-data="getTrainingMaterialData"
        :isFetchingSummary="isLoading"
        :selected-row="getTrainingMaterialRow"
        :languages="languages"
        :training-type="getTrainingType"
      />
      <TrainingReportCertificate
        v-if="getCertificateEmailNotificationTemplateTypeResourceId"
        :form-data="getCertificateData"
        :isFetchingSummary="isLoading"
        :certificate-email-notification-template-type-resource-id="
          getCertificateEmailNotificationTemplateTypeResourceId
        "
      />
    </div>
    <div v-else>
      <TrainingReportUsers
        is-add-training-type-key-to-payload
        :id="id"
        :is-loading="isLoading"
        :custom-fields="customFields"
        :training-type="getTrainingType"
        :training-summary="trainingSummary"
        :is-scorm-proxy="isScormProxy"
        :form-details="formDetails"
      />
    </div>
  </div>
</template>

<script>
import TrainingReportSummaryHeader from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryHeader'
import TrainingReportSummaryCards from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryCards'
import TrainingReportSummaryTrainingInfo from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryTrainingInfo'
import TrainingReportEnrollmentEmail from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportEnrollmentEmail'
import TrainingReportSMSSummary from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSMSSummary'
import TrainingReportCertificate from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportCertificate'
import TrainingReportTrainingMaterial from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportTrainingMaterial'
import TrainingReportTrainingDelivery from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportTrainingDelivery'
import TrainingReportSummaryAudienceDetails from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryAudienceDetails'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { getDefaultEmailTemplate } from '@/api/company'
import TrainingReportUsers from '@/components/AwarenessEducator/TrainingReport/Users/TrainingReportUsers'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'TrainingReportSummary',
  components: {
    TrainingReportUsers,
    TrainingReportTrainingDelivery,
    TrainingReportTrainingMaterial,
    TrainingReportSMSSummary,
    TrainingReportEnrollmentEmail,
    TrainingReportSummaryTrainingInfo,
    TrainingReportSummaryCards,
    TrainingReportSummaryHeader,
    TrainingReportSummaryAudienceDetails,
    TrainingReportCertificate
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
    isLoading: {
      type: Boolean
    },
    formDetails: {
      type: Object,
      default: () => ({})
    },
    customFields: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tab: 'summary',
      isAudienceModalVisible: false,
      targetGroups: [],
      interval: null,
      enrollmentEmailData: {},
      certificateEmailData: {}
    }
  },
  computed: {
    ...mapGetters({
      languages: 'trainingLibraryHelpers/getLanguages'
    }),
    isTrainingTypeLearningPath() {
      return (
        this.getTrainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
        this.getTrainingType === TRAINING_LIBRARY_TYPES.LEARNING_PATH
      )
    },
    isSMSSummaryExist() {
      return !!this.trainingSummary?.smsSummary
    },
    isScormProxy() {
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
    getTrainingType() {
      return this.trainingSummary?.trainingTypeName
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
    getSMSSummaryData() {
      const { smsPhoneNumber, template } = this?.trainingSummary?.smsSummary || {}
      return {
        'Sender Phone Number': { show: true, value: smsPhoneNumber },
        'SMS Text': { show: true, value: template },
        'Delivery Status': { show: true, value: '' }
      }
    },
    getTrainingInfoData() {
      const { totalTargetUserCount = 0 } = this?.trainingSummary?.reportDetail || {}
      const {
        targetGroupCount = 0,
        autoEnrollDescription = 'No',
        languages = ['EN'],
        targetGroupNames = []
      } = this.trainingSummary || {
        autoEnrollDescription: 'Enroll new users the same day',
        languages: ['EN'],
        targetGroupNames: []
      }
      return {
        'Target Groups': {
          show: true,
          value: targetGroupNames?.map?.((tg) => ({ name: tg })) || []
        },
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
          value: autoEnrollDescription || 'No'
        },
        Languages: {
          show: true,
          value: languages?.join(', ')
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
      const dateKey = this.isTrainingTypeLearningPath ? 'Delivery Start' : 'Start Date'
      const obj = {
        [dateKey]: {
          show: true,
          value: startDate
        },
        'Reminder Options': {
          show: true,
          value: reminderDescription || 'No'
        }
      }
      if (!this.isTrainingTypeLearningPath) {
        obj['Delivery Status'] = {
          show: true,
          value: ''
        }
      }
      return obj
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
      const { reportDetail = {}, completedCount = 0, inProgressCount } = this.trainingSummary || {}
      const {
        totalTargetUserCount = 0,
        totalUserClickedCount = 0,
        totalUserOpenedCount = 0,
        noResponseCount = 0
      } = reportDetail
      return {
        downloaded: {
          userCount: totalUserClickedCount,
          userPercent:
            totalTargetUserCount === 0
              ? '0'
              : ((totalUserClickedCount / totalTargetUserCount) * 100).toFixed()
        },
        openedEmail: {
          userCount: totalUserOpenedCount,
          userPercent:
            totalTargetUserCount === 0
              ? '0'
              : ((totalUserOpenedCount / totalTargetUserCount) * 100).toFixed()
        },
        inProgress: {
          userCount: inProgressCount,
          userPercent:
            totalTargetUserCount === 0
              ? '0'
              : ((inProgressCount / totalTargetUserCount) * 100).toFixed()
        },
        completedTraining: {
          userCount: completedCount,
          userPercent:
            totalTargetUserCount === 0
              ? '0'
              : ((completedCount / totalTargetUserCount) * 100).toFixed()
        },
        noResponse: {
          userCount: noResponseCount,
          userPercent:
            totalTargetUserCount === 0
              ? '0'
              : ((noResponseCount / totalTargetUserCount) * 100).toFixed()
        }
      }
    },
    getTrainingEmailNotificationTemplateTypeResourceId() {
      const { trainingEmailNotificationTemplateTypeResourceId = '' } = this.trainingSummary || {}
      return trainingEmailNotificationTemplateTypeResourceId
    },
    getTotalUsers() {
      const { reportDetail = {} } = this.trainingSummary || {}
      return reportDetail['totalTargetUserCount'] || 0
    },
    getEnrollmentTemplateData() {
      const { trainingDetails = {} } = this.trainingSummary || {}
      const { companyName = '', description: trainingDescription = '' } = trainingDetails
      const { name = '', description = '', template = '' } = this.enrollmentEmailData || {}
      return {
        name,
        createdBy: companyName,
        description: description || trainingDescription,
        template
      }
    },
    getCertificateData() {
      const { name = '', companyName = '', description = '', template = '' } =
        this.certificateEmailData || {}
      return {
        name,
        createdBy: companyName,
        description,
        template:
          template?.replace(/{COMPANYLOGO}/g, this?.$store?.state?.whitelabel.mainLogoUrl || '') ||
          ''
      }
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
  beforeDestroy() {
    clearInterval(this.interval)
  },
  watch: {
    getCertificateEmailNotificationTemplateTypeResourceId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.callForCertificate()
        }
      }
    },
    getTrainingEmailNotificationTemplateTypeResourceId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.callForEnrollmentEmail()
        }
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
    showAudienceDetailsModal() {
      this.isAudienceModalVisible = true
    },
    hideAudienceDetailsModal() {
      this.isAudienceModalVisible = false
    }
  }
}
</script>
