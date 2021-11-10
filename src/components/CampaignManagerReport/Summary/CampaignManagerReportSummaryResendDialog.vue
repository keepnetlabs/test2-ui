<template>
  <AppDialog
    title-id="text--campaign-manager-report-resend-popup-title"
    subtitle-id="text--campaign-manager-report-resend-popup-subtitle"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :subtitle="phishingScenarioName"
    :status="status"
    @changeStatus="closeModal"
  >
    <template #app-dialog-body>
      <div>
        <div class="mb-3">Resend this campaign to:</div>
        <div>
          <v-checkbox
            v-model="isEmailFailedToSend"
            id="input--campaign-manager-report-email-failed-to-send"
            color="#2196f3"
          >
            <template #label> Email failed to send {{ `(${items.notDelivered || 0})` }}</template>
          </v-checkbox>
          <v-checkbox
            v-model="isOnlyOpened"
            id="input--campaign-manager-report-email-failed-to-send"
            color="#2196f3"
          >
            <template #label> Only opened {{ `(${items.openedEmail || 0})` }}</template>
          </v-checkbox>
          <v-checkbox
            v-model="isOnlyClicked"
            id="input--campaign-manager-report-email-failed-to-send"
            color="#2196f3"
          >
            <template #label> Only clicked {{ `(${items.clickedEmail || 0})` }}</template>
          </v-checkbox>
          <v-checkbox
            v-model="isOnlySubmitted"
            id="input--campaign-manager-report-email-failed-to-send"
            color="#2196f3"
          >
            <template #label> Only submitted {{ `(${items.submittedEmail || 0})` }}</template>
          </v-checkbox>
          <v-checkbox
            v-model="isNoResponse"
            id="input--campaign-manager-report-email-failed-to-send"
            color="#2196f3"
            hide-details
          >
            <template #label> No response {{ `(${items.noResponseEmail || 0})` }}</template>
          </v-checkbox>
        </div>
      </div>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--campaign-manager-report-resend-popup"
        confirm-button-id="btn-delete--campaign-manager-report-resend-popup"
        :action-button-text="labels.Resend"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="closeModal"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import labels from '@/model/constants/labels'
export default {
  name: 'CampaignManagerReportSummaryResendDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    isActionButtonDisabled: {
      type: Boolean
    },
    items: {
      type: Object
    },
    phishingScenarioName: {
      type: String
    }
  },
  data() {
    return {
      CONSTANTS: {
        icon: 'mdi-refresh',
        title: labels.ResendCampaign
      },
      labels,
      isOnlyOpened: false,
      isOnlyClicked: false,
      isEmailFailedToSend: false,
      isOnlySubmitted: false,
      isNoResponse: false
    }
  },
  methods: {
    closeModal() {
      this.$emit('on-close')
    },
    handleConfirm() {
      this.$emit('on-confirm', this.item.resourceId)
    }
  }
}
</script>
