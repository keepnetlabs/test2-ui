<template>
  <div id="training-report-users" class="training-report-users">
    <TrainingReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      @on-close="toggleIsShowResendDialog"
      @on-confirm="resendItem"
    />
    <ElTabs v-model="tab" class="k-sub-tab">
      <ElTabPane label="Enrollment Emails" name="enrollment" id="enrollment-emails-content">
        <CampaignManagerReportHeader
          class="mb-6"
          title="Training Enrollment Sending Report"
          subtitle="Training enrollment email delivery details"
        />
        <TrainingReportEnrollmentEmailsTable
          v-if="tab === 'enrollment'"
          class="mt-6"
          :isScormProxy="isScormProxy"
          :id="id"
          :form-details="formDetails"
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
          class="mt-6"
          :id="id"
          :form-details="formDetails"
        />
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script>
import TrainingReportResendDialog from '@/components/AwarenessEducator/TrainingReport/TrainingReportResendDialog'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import AwarenessEducatorService from '@/api/awarenessEducator'
import TrainingReportEnrollmentEmailsTable from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportEnrollmentEmailsTable'
import TrainingReportReminderEmailsTable from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportReminderEmailsTable'

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
  methods: {
    resendItem() {
      this.isResendActionButtonDisabled = true
      AwarenessEducatorService.resendTrainingSendingReportList(this.resendPayload, this.id)
        .then(() => {
          this.toggleIsShowResendDialog()
          this.$refs.refTable.callForData()
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
