<template>
  <AppDialog
    type="delete"
    title-id="text--training-library-delete-popup-title"
    subtitle-id="text--training-library-delete-popup-subtitle"
    icon="mdi-delete"
    title="Delete Scheduled Report?"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      Are you sure you want to delete this report?
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        type="delete"
        cancel-button-id="btn-cancel--scheduled-report-dialog-popup"
        confirm-button-id="btn-delete-scheduled-report-dialog-popup"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="handleClose"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>
<script>
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter.vue'
import AppDialog from '@/components/AppDialog.vue'
import { deleteReportScheduling } from '@/api/reports'

export default {
  name: 'ScheduledReportsDeleteDialog',
  components: { AppDialog, AppDialogFooter },
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
  methods: {
    handleClose(forceUpdate = false) {
      this.$emit('on-close', null, forceUpdate)
    },
    handleConfirm() {
      this.isActionButtonDisabled = true
      deleteReportScheduling(this.selectedRow.resourceId)
        .then(() => this.handleClose(true))
        .finally(() => {
          this.isActionButtonDisabled = false
        })
    }
  }
}
</script>
