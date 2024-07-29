<template>
  <AppDialog
    title-id="text--scheduled-reports-activation-popup-title"
    subtitle-id="text--scheduled-reports-activation-popup-subtitle"
    :icon="getIcon"
    :title="getTitle"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      {{ getBody }}
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--scheduled-reports-activation-popup-resend"
        confirm-button-id="btn-confirm--scheduled-reports-activation-popup-resend"
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
import { setSchedulingReportStatus } from '../api/reports'
export default {
  name: 'ScheduledReportsActivationDialog',
  components: { AppDialogFooter, AppDialog },
  mixins: [useResend],
  props: {
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isActionButtonDisabled: false
    }
  },
  computed: {
    getTitle() {
      if (this.selectedRow.status) return 'Confirm Inactivation'
      return 'Confirm Activation'
    },
    getIcon() {
      if (this.selectedRow.status) return 'mdi-close-circle'
      return 'mdi-check-circle'
    },
    getBody() {
      if (this.selectedRow.status)
        return 'This action will inactive the scheduled report, making it unavailable for further scheduling. You can reactivate it at any time.'
      return 'This action will activate the scheduled report, making it available for scheduling.'
    }
  },
  methods: {
    handleClose(forceUpdate = false) {
      this.$emit('on-close', null, forceUpdate)
    },
    handleConfirm() {
      this.isActionButtonDisabled = true
      setSchedulingReportStatus(this.selectedRow.resourceId, Number(!this.selectedRow.status))
        .then(() => {
          this.handleClose(true)
        })
        .finally(() => {
          this.isActionButtonDisabled = false
        })
    }
  }
}
</script>
