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
            :value="REPORT_TABS.FAILED"
          >
            <template #label> Email failed to send {{ `(${items.notDelivered || 0})` }}</template>
          </v-checkbox>
          <v-checkbox
            v-model="types"
            id="input--callback-report-opened"
            color="#2196f3"
            :disabled="!items.openedEmail"
            :value="REPORT_TABS.OPENED"
          >
            <template #label> Only opened email {{ `(${items.openedEmail || 0})` }}</template>
          </v-checkbox>
          <v-checkbox
            v-model="types"
            id="input--callback-report-called-back"
            color="#2196f3"
            :disabled="!items.calledBack"
            :value="REPORT_TABS.CALLBACK"
          >
            <template #label> Called back {{ `(${items.calledBack || 0})` }}</template>
          </v-checkbox>
          <v-checkbox
            v-model="types"
            id="input--campaign-manager-report-entered-digits"
            color="#2196f3"
            :disabled="!items.enteredDigits"
            :value="REPORT_TABS.ENTERED_DIGITS"
          >
            <template #label> Times entered digits {{ `(${items.enteredDigits || 0})` }}</template>
          </v-checkbox>
          <v-checkbox
            v-model="types"
            id="input--campaign-manager-report-no-response"
            color="#2196f3"
            hide-details
            :disabled="!items.noResponseEmail"
            :value="REPORT_TABS.NO_RESPONSE"
          >
            <template #label> No response {{ `(${items.noResponseEmail || 0})` }}</template>
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
import { REPORT_TABS } from '@/components/CallbackReport/Opened/utils'
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
      REPORT_TABS,
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
