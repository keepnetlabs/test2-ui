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
            v-model="types"
            id="input--campaign-manager-report-email-failed-to-send"
            color="#2196f3"
            :disabled="!items.notDelivered"
            :value="5"
          >
            <template #label> Email failed to send {{ `(${items.notDelivered || 0})` }}</template>
          </v-checkbox>
          <v-checkbox
            v-model="types"
            id="input--campaign-manager-report-email-failed-to-send"
            color="#2196f3"
            :disabled="!items.openedEmail"
            :value="1"
          >
            <template #label> Only opened email {{ `(${items.openedEmail || 0})` }}</template>
          </v-checkbox>
          <v-checkbox
            v-model="types"
            id="input--campaign-manager-report-email-failed-to-send"
            color="#2196f3"
            :disabled="!items.clickedEmail"
            :value="2"
          >
            <template #label> Scanned QR link {{ `(${items.clickedEmail || 0})` }}</template>
          </v-checkbox>
          <v-checkbox
            v-model="types"
            id="input--campaign-manager-report-email-failed-to-send"
            color="#2196f3"
            :disabled="!items.submittedEmail"
            :value="3"
          >
            <template #label> Submitted data {{ `(${items.submittedEmail || 0})` }}</template>
          </v-checkbox>
          <v-checkbox
            v-model="types"
            id="input--campaign-manager-report-email-failed-to-send"
            color="#2196f3"
            :disabled="!items.mfa"
            :value="8"
          >
            <template #label> Submitted MFA code {{ `(${items.mfa || 0})` }}</template>
          </v-checkbox>
          <v-checkbox
            v-model="types"
            id="input--campaign-manager-report-email-failed-to-send"
            color="#2196f3"
            hide-details
            :disabled="!items.noResponseEmail"
            :value="4"
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
        :confirm-button-disabled="getActionButtonDisabled"
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
      types: []
    }
  },
  computed: {
    getActionButtonDisabled() {
      return this.isActionButtonDisabled || !this.types.length
    }
  },
  methods: {
    closeModal() {
      this.$emit('on-close')
    },
    handleConfirm() {
      this.$emit('on-confirm', this.types)
    }
  }
}
</script>
