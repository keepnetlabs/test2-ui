<template>
  <AppDialog
    title-id="text--callback-report-resend-popup-title"
    subtitle-id="text--callback-report-resend-popup-subtitle"
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
            id="input--callback-report-message-failed-to-send"
            color="#2196f3"
            :disabled="!items.notDelivered"
            :value="5"
          >
            <template #label> Email failed to send {{ `(${items.notDelivered || 0})` }}</template>
          </v-checkbox>
          <v-checkbox
            v-model="types"
            id="input--callback-report-opened"
            color="#2196f3"
            :disabled="!items.clickedSms"
            :value="2"
          >
            <template #label> Only opened email {{ `(${items.clickedSms || 0})` }}</template>
          </v-checkbox>
          <v-checkbox
            v-model="types"
            id="input--callback-report-called-back"
            color="#2196f3"
            :disabled="!items.submittedSms"
            :value="3"
          >
            <template #label> Called back {{ `(${items.submittedSms || 0})` }}</template>
          </v-checkbox>
          <v-checkbox
            v-model="types"
            id="input--campaign-manager-report-entered-digits"
            color="#2196f3"
            :disabled="!items.mfaSubmittedSms"
            :value="8"
          >
            <template #label>
              Times entered digits {{ `(${items.mfaSubmittedSms || 0})` }}</template
            >
          </v-checkbox>
          <v-checkbox
            v-model="types"
            id="input--campaign-manager-report-no-response"
            color="#2196f3"
            hide-details
            :disabled="!items.noResponseSms"
            :value="4"
          >
            <template #label> No response {{ `(${items.noResponseSms || 0})` }}</template>
          </v-checkbox>
        </div>
      </div>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--callback-report-resend-popup"
        confirm-button-id="btn-delete--callback-report-resend-popup"
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
  name: 'CallbackReportSummaryResendDialog',
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
