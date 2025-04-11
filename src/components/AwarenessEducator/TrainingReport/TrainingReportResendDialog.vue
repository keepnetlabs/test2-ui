<template>
  <AppDialog
    title-id="text--training-report-resend-popup-title"
    subtitle-id="text--training-report-resend-popup-subtitle"
    :icon="CONSTANTS.icon"
    :title="title"
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
        cancel-button-id="btn-cancel--training-report-popup-resend"
        confirm-button-id="btn-confirm--training-report-popup-resend"
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
  name: 'TrainingReportResendDialog',
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
    title: {
      type: String,
      default: 'Resend the training?'
    },
    bodyTrainingType: {
      type: String,
      default: 'campaign'
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
        id: 'training-report-resend-dialog',
        ascending: 'ascending'
      }
    }
  },
  computed: {
    getResendText() {
      // if (this.payload?.selectAll) {
      //   return `You are about to re-send this ${this.bodyTrainingType} to all users. Are you sure?`
      // }
      if (this.resendItemCount) {
        return `You are about to re-send this ${this.bodyTrainingType} to ${
          this.resendItemCount
        } user${this.resendItemCount > 1 ? 's' : ''} you’ve selected. Are you sure?`
      }
      if (this.payload?.selectedItems.length) {
        return `You are about to re-send this ${this.bodyTrainingType} to ${
          this.payload.selectedItems.length
        } user${this.payload.selectedItems.length > 1 ? 's' : ''} you’ve selected. Are you sure?`
      }

      return `You are about to re-send this ${this.bodyTrainingType} to the users you selected. Are you sure?`
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
