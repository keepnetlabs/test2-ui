<template>
  <AppDialog
    title-id="text--training-report-resend-popup-title"
    subtitle-id="text--training-report-resend-popup-subtitle"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :subtitle="CONSTANTS.subtitle"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      You are about to re-send this training to the users you selected. Are you sure?
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
    }
  },
  data() {
    return {
      CONSTANTS: {
        icon: 'mdi-alert-circle',
        id: 'training-report-resend-dialog',
        ascending: 'ascending',
        title: 'Resend the training?'
      }
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
