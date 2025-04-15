<template>
  <AppDialog
    title-id="text--campaign-manager-delete-popup-title"
    subtitle-id="text--campaign-manager-delete-popup-subtitle"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :subtitle="CONSTANTS.subtitle"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      {{ getResendText }}
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        style="justify-content: space-between !important;"
        cancel-button-id="btn-cancel--campaign-manager-popup-resend"
        confirm-button-id="btn-confirm--campaign-manager-popup-resend"
        action-button-text="RESEND"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="handleClose"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { useResend } from '@/hooks/useResend'
export default {
  name: 'CampaignManagerReportResendDialog',
  components: { AppDialogFooter, AppDialog },
  mixins: [useResend],
  props: {
    status: {
      type: Boolean
    },
    isActionButtonDisabled: {
      type: Boolean
    },
    payload: {
      type: Object
    },
    resendItemCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      CONSTANTS: {
        icon: 'mdi-alert-circle',
        id: 'campaign-manager-report-resend-dialog',
        ascending: 'ascending',
        title: 'Resend the campaign?'
      }
    }
  },
  computed: {
    getResendText() {
      if (this.resendItemCount) {
        return `You are about to re-send this campaign to ${this.resendItemCount} user${
          this.resendItemCount > 1 ? 's' : ''
        } you’ve selected. Are you sure?`
      }
      if (this.payload?.items.length) {
        return `You are about to re-send this campaign to ${this.payload.items.length} user${
          this.payload.items.length > 1 ? 's' : ''
        } you’ve selected. Are you sure?`
      }

      return `You are about to re-send this campaign to the users you selected. Are you sure?`
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    handleConfirm() {
      this.$emit('on-confirm')
    }
  }
}
</script>
