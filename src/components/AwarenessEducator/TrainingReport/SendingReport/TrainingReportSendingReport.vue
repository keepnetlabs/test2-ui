<template>
  <div id="training-report-users" class="training-report-users">
    <TrainingReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      :payload="resendPayload"
      :title="getResendDialogTitle"
      :body-training-type="getBodyTrainingType"
      @on-close="toggleIsShowResendDialog"
      @on-confirm="resendItem"
    />
    <ElTabs v-if="isTypeTrainingOrInfographic" v-model="tab" class="k-sub-tab">
      <ElTabPane label="Enrollment Emails" name="enrollment" id="enrollment-emails-content">
        <CampaignManagerReportHeader
          class="mb-6"
          title="Training Enrollment Sending Report"
          subtitle="Training enrollment email delivery details"
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
          @on-resend="handleOnResend"
        />
      </ElTabPane>
      <ElTabPane label="Reminder Emails" name="reminder" id="reminder-emails-content">
        <CampaignManagerReportHeader
          class="mb-6"
          title="Training Reminder Sending Report"
          subtitle="Training reminder email delivery details"
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
    </ElTabs>
    <div v-else>
      <CampaignManagerReportHeader
        class="mb-6"
        title="Sending Report"
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
        :training-summary="trainingSummary"
        @on-resend="handleOnResend"
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
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import labels from '@/model/constants/labels'

export default {
  name: 'TrainingReportSendingReport',
  components: {
    TrainingReportResendDialog,
    CampaignManagerReportHeader,
    TrainingReportEnrollmentEmailsTable,
    TrainingReportReminderEmailsTable
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
    }
  },
  data() {
    return {
      tab: 'enrollment',
      isShowResendDialog: false,
      isResendActionButtonDisabled: false,
      resendPayload: null
    }
  },
  computed: {
    getResendDialogTitle() {
      if (this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER)
        return labels.ResendPoster
      else if (
        this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
      )
        return labels.ResendInfographic
      return labels.ResendTraining
    },
    getBodyTrainingType() {
      if (this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER)
        return labels.Poster.toLowerCase()
      else if (
        this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
      )
        return labels.Infographic.toLowerCase()
      return labels.Training.toLowerCase()
    },
    isTypeTrainingOrInfographic() {
      return (
        this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING ||
        (this.isLearningPath &&
          this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC)
      )
    },
    isTypePoster() {
      return this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER
    },
    getFirstCardSubtitle() {
      return this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER
        ? 'Poster email delivery details'
        : 'Infographic email delivery details'
    }
  },
  methods: {
    resendItem() {
      this.isResendActionButtonDisabled = true
      AwarenessEducatorService.resendTrainingSendingReportList(this.resendPayload, this.id)
        .then(() => {
          this.toggleIsShowResendDialog()
          this.$refs?.refEnrollmentTable?.$refs?.refTable?.resetSelectableParams?.()
          this.$refs?.refReminderTable?.$refs?.refTable?.resetSelectableParams?.()
          this.$refs?.refEnrollmentTable?.callForData?.()
          this.$refs?.refReminderTable?.callForData?.()
        })
        .finally(() => {
          this.isResendActionButtonDisabled = false
          this.isShowResendDialog = false
        })
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
