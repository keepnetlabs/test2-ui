<template>
  <AppDialog
    title-id="text--vishing-report-resend-popup-title"
    subtitle-id="text--vishing-report-resend-popup-subtitle"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :subtitle="vishingName"
    :status="status"
    @changeStatus="closeModal"
  >
    <template #app-dialog-body>
      <div>
        <div class="mb-3">Resend this campaign to:</div>
        <div>
          <v-checkbox
            v-model="types"
            id="input--vishing-resend-answered"
            color="#2196f3"
            :disabled="!items.answered"
            :value="1"
          >
            <template #label> Answered {{ `(${items.answered || 0})` }}</template>
          </v-checkbox>
          <v-checkbox
            v-model="types"
            id="input--vishing-resend-no-response"
            color="#2196f3"
            :disabled="!items.noResponse"
            :value="2"
          >
            <template #label> No response {{ `(${items.noResponse || 0})` }}</template>
          </v-checkbox>
          <v-checkbox
            v-model="types"
            id="input--vishing-resend-calling-error"
            color="#2196f3"
            :disabled="!items.callingError"
            :value="3"
          >
            <template #label> Calling Error {{ `(${items.callingError || 0})` }}</template>
          </v-checkbox>
        </div>
      </div>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--vishing-report-resend-popup"
        confirm-button-id="btn-delete--vishing-report-resend-popup"
        :action-button-text="labels.Resend"
        :confirm-button-disabled="getActionButtonDisabled"
        @handleClose="closeModal"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import AppDialog from '@/components/AppDialog'
import labels from '@/model/constants/labels'

export default {
  name: 'VishingReportResendDialog',
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
    vishingName: {
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
