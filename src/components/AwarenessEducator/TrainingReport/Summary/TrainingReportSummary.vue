<template>
  <div id="training-report-summary" class="training-report-summary">
    <TrainingReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      :payload="resendPayload"
      :title="labels.ResendTheCertificate"
      :body-training-type="labels.Certificate.toLowerCase()"
      :resendItemCount="resendItemCount"
      :is-certification="true"
      @on-close="toggleIsShowResendDialog"
      @on-confirm="resendItem"
    />
    <ElTabs v-if="isTrainingTypeLearningPath" v-model="tab" class="k-sub-tab">
      <ElTabPane label="Summary" name="summary" id="summary-content" />
      <ElTabPane label="Users" name="users" id="users-content" />
      <ElTabPane
        v-if="awardCertificateEnrollmentId"
        label="Certificate Emails"
        name="certificate-emails"
        id="certificate-emails-content"
      />
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
        :is-survey="getIsSurvey"
        :is-scorm-proxy="isScormProxy"
        :training-name="trainingName"
        :resend-dialog-items="getResendDialogItems"
        :is-loading="isLoading"
        :id="id"
        :training-type="getTrainingType"
      />
      <TrainingReportSummaryCards
        :items="getCardsData"
        :is-survey="getIsSurvey"
        :is-loading="isLoading"
        :total-user-count="getTotalUsers"
        :training-type="getTrainingType"
      />
      <div class="campaign-manager-report-summary__general-info mt-6">
        <TrainingReportSummaryTrainingInfo
          :is-survey="getIsSurvey"
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
          :is-survey="getIsSurvey"
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
      <TrainingReportTrainingMaterial
        :form-data="getTrainingMaterialData"
        :isFetchingSummary="isLoading"
        :is-survey="getIsSurvey"
        :selected-row="getTrainingMaterialRow"
        :languages="languages"
        :training-type="getTrainingType"
      />
      <TrainingReportEnrollmentEmail
        :is-survey="getIsSurvey"
        :form-data="getEnrollmentTemplateData"
        :isFetchingSummary="isLoading"
        :training-email-notification-template-type-resource-id="
          getTrainingEmailNotificationTemplateTypeResourceId
        "
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
    <div v-else-if="tab === 'users'">
      <TrainingReportUsers
        is-add-training-type-key-to-payload
        :is-survey="getIsSurvey"
        :id="id"
        :is-loading="isLoading"
        :custom-fields="customFields"
        :training-type="getTrainingType"
        :training-summary="trainingSummary"
        :is-scorm-proxy="isScormProxy"
        :form-details="formDetails"
      />
    </div>
    <div v-else-if="tab === 'certificate-emails' && awardCertificateEnrollmentId">
      <TrainingReportCertificateEmailsTable
        ref="refCertificateTable"
        :is-learning-path="isTrainingTypeLearningPath"
        :form-details="formDetails"
        :custom-fields="customFields"
        :id="id"
        :award-certificate-enrollment-id="awardCertificateEnrollmentId"
        @on-resend="handleOnResend"
        @on-selection-text-change="handleSelectionChange"
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
import TrainingReportCertificateEmailsTable from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportCertificateEmailsTable'
import labels from '@/model/constants/labels'
import TrainingReportResendDialog from '@/components/AwarenessEducator/TrainingReport/TrainingReportResendDialog'
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
    TrainingReportCertificate,
    TrainingReportCertificateEmailsTable,
    TrainingReportResendDialog
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
    },
    awardCertificateEnrollmentId: {
      type: String
    },
    isSurvey: {
      type: Boolean
    }
  },
  data() {
    return {
      labels,
      tab: 'summary',
      isShowResendDialog: false,
      isAudienceModalVisible: false,
      isResendActionButtonDisabled: false,
      resendPayload: null,
      targetGroups: [],
      resendItemCount: 0,
      interval: null,
      enrollmentEmailData: {},
      certificateEmailData: {}
    }
  },
  computed: {
    ...mapGetters({
      languages: 'trainingLibraryHelpers/getLanguages'
    }),
    getIsSurvey() {
      return this.trainingSummary?.trainingDetails?.hasQuiz || this.isSurvey
    },
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
        targetGroupNames = [],
        sendTemplatesInPreferredLanguage = false
      } = this.trainingSummary || {
        autoEnrollDescription: 'Enroll new users the same day',
        languages: ['EN'],
        targetGroupNames: []
      }

      // Map language codes to friendly names
      const languageNames = languages.map((langCode) => {
        const lang = this.languages.find(
          (l) => l.code === langCode || l.shortCode === langCode || l.languageShortCode === langCode
        )
        return lang?.isoFriendlyName || lang?.name || langCode
      })

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
          value: languageNames?.join(', ')
        },
        'Preferred Language': {
          show: true,
          value: sendTemplatesInPreferredLanguage ? "User's Preferred Language" : 'Company Language'
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
      const { reminderDescription = 'No', startDate = '', deliveryMethod = '' } = this
        .trainingSummary || {
        reminderDescription: 'No',
        startDate: '',
        deliveryMethod: ''
      }
      const dateKey = this.isTrainingTypeLearningPath ? 'Delivery Start' : 'Start Date'
      const obj = {
        'Delivery Method': {
          show: true,
          value: deliveryMethod
        },
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
        onlyOpenedCount = 0,
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
            onlyOpenedCount,
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
        onlyOpenedCount: 0,
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
        onlyOpenedCount = 0,
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
        onlyOpenedCount,
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
        totalUserOpenedCount = 0,
        noResponseCount = 0
      } = reportDetail
      return {
        downloaded: {
          userCount: completedCount,
          userPercent:
            totalTargetUserCount === 0
              ? '0'
              : ((completedCount / totalTargetUserCount) * 100).toFixed()
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
      const {
        name = '',
        description = '',
        template = '',
        languages = [],
        selectedLanguageResourceId = '',
        selectedLanguageName = ''
      } = this.enrollmentEmailData || {}
      return {
        name,
        createdBy: companyName,
        description: description || trainingDescription,
        template,
        languages,
        selectedLanguageResourceId,
        selectedLanguageName
      }
    },
    getCertificateData() {
      const {
        name = '',
        companyName = '',
        description = '',
        template = '',
        languages = [],
        selectedLanguageResourceId = '',
        selectedLanguageName = ''
      } = this.certificateEmailData || {}
      return {
        name,
        createdBy: companyName,
        description,
        template,
        languages,
        selectedLanguageResourceId,
        selectedLanguageName
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
            const emailTemplateData = data?.template || {}
            const companyLogoUrl = this?.$store?.state?.whitelabel.emailTemplateLogoUrl || ''
            const languages = emailTemplateData.languages || []
            const mainTemplate = emailTemplateData.template?.replace(/{COMPANYLOGO}/g, companyLogoUrl) || ''

            if (emailTemplateData.languageTypeResourceId && emailTemplateData.languageTypeName) {
              languages.unshift({
                languageTypeResourceId: emailTemplateData.languageTypeResourceId,
                languageTypeName: emailTemplateData.languageTypeName,
                template: mainTemplate
              })
            }

            languages.forEach((lang) => {
              if (lang.template) {
                lang.template = lang.template.replace(/{COMPANYLOGO}/g, companyLogoUrl)
              }
            })

            this.enrollmentEmailData = {
              ...emailTemplateData,
              template: mainTemplate,
              languages,
              selectedLanguageResourceId: emailTemplateData.languageTypeResourceId || (languages[0]?.languageTypeResourceId || ''),
              selectedLanguageName: emailTemplateData.languageTypeName || (languages[0]?.languageTypeName || '')
            }
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
          const companyLogoUrl = this?.$store?.state?.whitelabel.emailTemplateLogoUrl || ''
          const languages = data.languages || []
          const mainTemplate = data.template?.replace(/{COMPANYLOGO}/g, companyLogoUrl) || ''

          if (data.languageTypeResourceId && data.languageTypeName) {
            languages.unshift({
              languageTypeResourceId: data.languageTypeResourceId,
              languageTypeName: data.languageTypeName,
              template: mainTemplate
            })
          }

          languages.forEach((lang) => {
            if (lang.template) {
              lang.template = lang.template.replace(/{COMPANYLOGO}/g, companyLogoUrl)
            }
          })

          this.certificateEmailData = {
            ...data,
            template: mainTemplate,
            languages,
            selectedLanguageResourceId: data.languageTypeResourceId || (languages[0]?.languageTypeResourceId || ''),
            selectedLanguageName: data.languageTypeName || (languages[0]?.languageTypeName || '')
          }
        })
      }
    },
    showAudienceDetailsModal() {
      this.isAudienceModalVisible = true
    },
    hideAudienceDetailsModal() {
      this.isAudienceModalVisible = false
    },
    handleOnResend(items, excludedResourceIdList, isSelectedAllEver, filter) {
      this.resendPayload = {
        selectedItems: Array.isArray(items)
          ? items.map((item) => item.targetUserResourceId)
          : [items.targetUserResourceId],
        excludedItems: excludedResourceIdList || [],
        selectAll: !!isSelectedAllEver,
        filter
      }
      this.toggleIsShowResendDialog()
    },
    handleSelectionChange(selectionCount) {
      this.resendItemCount = selectionCount
    },
    toggleIsShowResendDialog() {
      if (this.isShowResendDialog) {
        this.selectedRow = null
      }
      this.isShowResendDialog = !this.isShowResendDialog
    },
    resendItem() {
      this.isResendActionButtonDisabled = true
      const payload = [
        ...this.resendPayload.selectedItems.map((item) => ({
          targetUserResourceId: item,
          enrollmentId: this.awardCertificateEnrollmentId
        }))
      ]
      AwarenessEducatorService.resendCertificateToUserList(payload)
        .then(() => {
          this.toggleIsShowResendDialog()
          this.$refs?.refCertificateTable?.$refs?.refTable?.resetSelectableParams?.()
          this.$refs?.refCertificateTable?.callForData?.()
        })
        .finally(() => {
          this.isResendActionButtonDisabled = false
          this.isShowResendDialog = false
        })
    }
  }
}
</script>
