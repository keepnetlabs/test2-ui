<template>
  <div id="training-report-users" class="training-report-users">
    <TrainingReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      :payload="resendPayload"
      :title="getResendDialogTitle"
      :body-training-type="getBodyTrainingType"
      :resendItemCount="resendItemCount"
      :is-certification="isCertification"
      @on-close="toggleIsShowResendDialog"
      @on-confirm="resendItem"
    />
    <ElTabs v-if="isTypeTraining || isSurvey" v-model="tab" class="k-sub-tab">
      <ElTabPane
        v-if="isMicrosoftTeams"
        label="Microsoft Teams Notifications"
        name="teams-notifications"
        id="teams-notifications-content"
      >
        <CampaignManagerReportHeader
          class="mb-6"
          :title="
            isSurvey
              ? 'Survey Notification Sending Report (Microsoft Teams)'
              : 'Training Notification Sending Report (Microsoft Teams)'
          "
          :subtitle="`Details of ${
            isSurvey ? 'survey' : 'training'
          } notification delivery in Microsoft Teams`"
        />
        <TrainingReportMicrosoftTeamsTable
          v-if="tab === 'teams-notifications'"
          ref="refTeamsTable"
          class="mt-6"
          :customFields="customFields"
          :isScormProxy="isScormProxy"
          :id="id"
          :form-details="formDetails"
          :training-summary="trainingSummary"
          :isSurvey="isSurvey"
          @on-resend="handleOnResend"
          @on-selection-text-change="handleSelectionChange"
        />
      </ElTabPane>
      <ElTabPane label="Enrollment Emails" name="enrollment" id="enrollment-emails-content">
        <CampaignManagerReportHeader
          class="mb-6"
          :title="
            isSurvey ? 'Survey Enrollment Sending Report' : 'Training Enrollment Sending Report'
          "
          :subtitle="
            isSurvey
              ? 'Survey enrollment email delivery details'
              : 'Training enrollment email delivery details'
          "
        />
        <TrainingReportEnrollmentEmailsTable
          v-if="tab === 'enrollment'"
          ref="refEnrollmentTable"
          class="mt-6"
          :customFields="customFields"
          :isScormProxy="isScormProxy"
          :id="id"
          :form-details="formDetails"
          :training-summary="trainingSummary"
          :isSurvey="isSurvey"
          @on-resend="handleOnResend"
          @on-selection-text-change="handleSelectionChange"
        />
      </ElTabPane>
      <ElTabPane label="Reminder Emails" name="reminder" id="reminder-emails-content">
        <CampaignManagerReportHeader
          class="mb-6"
          :title="isSurvey ? 'Survey Reminder Sending Report' : 'Training Reminder Sending Report'"
          :subtitle="
            isSurvey
              ? 'Survey reminder email delivery details'
              : 'Training reminder email delivery details'
          "
        />
        <TrainingReportReminderEmailsTable
          v-if="tab === 'reminder'"
          ref="refReminderTable"
          class="mt-6"
          :customFields="customFields"
          :id="id"
          :form-details="formDetails"
        />
      </ElTabPane>
      <ElTabPane
        v-if="!isLearningPath"
        label="Certificate Emails"
        name="certificate"
        id="certificate-emails-content"
      >
        <CampaignManagerReportHeader
          class="mb-6"
          :title="
            isSurvey ? 'Survey Certificate Sending Report' : 'Training Certificate Sending Report'
          "
          :subtitle="
            isSurvey
              ? 'Survey certificate email delivery details'
              : 'Training certificate email delivery details'
          "
        />
        <TrainingReportCertificateEmailsTable
          v-if="tab === 'certificate'"
          ref="refCertificateTable"
          class="mt-6"
          :customFields="customFields"
          :id="id"
          :form-details="formDetails"
          :award-certificate-enrollment-id="awardCertificateEnrollmentId"
          :isSurvey="isSurvey"
          @on-resend="handleOnResend"
          @on-selection-text-change="handleSelectionChange"
        />
      </ElTabPane>
    </ElTabs>
    <div v-else>
      <CampaignManagerReportHeader
        class="mb-6"
        :title="isSurvey ? 'Survey Sending Report' : 'Training Sending Report'"
        :subtitle="getFirstCardSubtitle"
      />
      <TrainingReportEnrollmentEmailsTable
        v-if="tab === 'enrollment'"
        ref="refEnrollmentTable"
        class="mt-6"
        :customFields="customFields"
        :isScormProxy="isScormProxy"
        :id="id"
        :form-details="formDetails"
        :isSurvey="isSurvey"
        :training-summary="trainingSummary"
        @on-resend="handleOnResend"
        @on-selection-text-change="handleSelectionChange"
      />
    </div>
  </div>
</template>

<script>
import TrainingReportResendDialog from '@/components/AwarenessEducator/TrainingReport/TrainingReportResendDialog'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import AwarenessEducatorService from '@/api/awarenessEducator'
import TrainingReportEnrollmentEmailsTable from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportEnrollmentEmailsTable'
import TrainingReportReminderEmailsTable from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportReminderEmailsTable'
import TrainingReportCertificateEmailsTable from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportCertificateEmailsTable'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import TrainingReportMicrosoftTeamsTable from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportMicrosoftTeamsTable'
import labels from '@/model/constants/labels'

export default {
  name: 'TrainingReportSendingReport',
  components: {
    TrainingReportResendDialog,
    CampaignManagerReportHeader,
    TrainingReportEnrollmentEmailsTable,
    TrainingReportReminderEmailsTable,
    TrainingReportCertificateEmailsTable,
    TrainingReportMicrosoftTeamsTable
  },
  props: {
    id: {
      type: String
    },
    formDetails: {
      type: Object
    },
    isScormProxy: {
      type: Boolean
    },
    trainingSummary: {
      type: Object
    },
    isLearningPath: {
      type: Boolean
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
    },
    isMicrosoftTeams: {
      type: Boolean
    }
  },
  data() {
    return {
      resendItemCount: 0,
      tab: this.isMicrosoftTeams ? 'teams-notifications' : 'enrollment',
      isShowResendDialog: false,
      isResendActionButtonDisabled: false,
      resendPayload: null
    }
  },
  computed: {
    getResendDialogTitle() {
      if (this.isSurvey) {
        return labels.ResendSurvey
      }
      if (this.isCertification) {
        return labels.ResendTheCertificate
      }
      if (this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER)
        return labels.ResendPoster
      else if (
        this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
      )
        return labels.ResendInfographic
      return labels.ResendTraining
    },
    getBodyTrainingType() {
      if (this.isCertification) {
        return labels.Certificate.toLowerCase()
      }
      if (this.isSurvey) {
        return labels.Survey.toLowerCase()
      }
      if (this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER)
        return labels.Poster.toLowerCase()
      else if (
        this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
      )
        return labels.Infographic.toLowerCase()
      return labels.Training.toLowerCase()
    },
    isTypeTraining() {
      return this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING
    },
    isTypePoster() {
      return this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER
    },
    getFirstCardSubtitle() {
      return this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER
        ? 'Poster email delivery details'
        : 'Infographic email delivery details'
    },
    isCertification() {
      return this.tab === 'certificate'
    }
  },
  methods: {
    handleSelectionChange(selectionCount) {
      this.resendItemCount = selectionCount
    },
    resendItem() {
      this.isResendActionButtonDisabled = true
      if (this.isCertification) {
        const payload = [
          ...this.resendPayload.selectedItems.map((item) => ({
            targetUserResourceId: item,
            enrollmentId: this.id
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
      } else {
        AwarenessEducatorService.resendTrainingSendingReportList(this.resendPayload, this.id)
          .then(() => {
            this.toggleIsShowResendDialog()
            if (this.tab === 'enrollment') {
              this.$refs?.refEnrollmentTable?.$refs?.refTable?.resetSelectableParams?.()
              this.$refs?.refReminderTable?.$refs?.refTable?.resetSelectableParams?.()
              this.$refs?.refEnrollmentTable?.callForData?.()
              this.$refs?.refReminderTable?.callForData?.()
            } else if (this.tab === 'teams-notifications') {
              this.$refs?.refTeamsTable?.$refs?.refTable?.resetSelectableParams?.()
              this.$refs?.refTeamsTable?.callForData?.()
            }
          })
          .finally(() => {
            this.isResendActionButtonDisabled = false
            this.isShowResendDialog = false
          })
      }
    },
    toggleIsShowResendDialog() {
      if (this.isShowResendDialog) {
        this.selectedRow = null
      }
      this.isShowResendDialog = !this.isShowResendDialog
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
    }
  }
}
</script>
