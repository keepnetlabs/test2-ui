<template>
  <AppDialog
    title-id="text--enrollment-dialog-stop-popup-title"
    subtitle-id="text--enrollment-dialog-stop-popup-subtitle"
    class-name="stop-enrollment-modal"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      Are you sure you want to stop this enrollment? Once stopped, it cannot be restarted.
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        action-button-text="STOP"
        action-button-color="#f56c6c"
        cancel-button-color="#383b41"
        cancel-button-id="btn-cancel--stop-enrollment-dialog-popup"
        confirm-button-id="btn-delete-stop-enrollment-dialog-popup"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="handleClose"
        @handleConfirm="handleDelete"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { EMITS } from '@/components/AwarenessEducator/utils'
import AwarenessEducatorService from '@/api/awarenessEducator'
export default {
  name: 'StopEnrollmentDialog',
  components: { AppDialog, AppDialogFooter },
  props: {
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    }
  },
  data() {
    return {
      CONSTANTS: {
        icon: 'mdi-stop',
        title: 'Stop Enrollment?'
      },
      isActionButtonDisabled: false
    }
  },
  methods: {
    handleClose(forceUpdate = false) {
      this.$emit(EMITS.ON_CLOSE, forceUpdate)
    },
    handleDelete() {
      this.isActionButtonDisabled = true
      AwarenessEducatorService.stopEnrollment(this.selectedRow.enrollmentId)
        .then(() => {
          this.handleClose(true)
        })
        .finally(() => (this.isActionButtonDisabled = false))
    }
  }
}
</script>
