<template>
  <AppDialog
    title-id="text--enrollment-dialog-delete-popup-title"
    subtitle-id="text--enrollment-dialog-delete-popup-subtitle"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      Are you sure you want to delete this training enrollment? All the reports associated with the
      training enrollment will be deleted. This action cannot be undone.
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        type="delete"
        cancel-button-id="btn-cancel--enrollment-dialog-popup"
        confirm-button-id="btn-delete-enrollment-dialog-popup"
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
import { EMITS } from '../utils'
import AwarenessEducatorService from '@/api/awarenessEducator'
export default {
  name: 'DeleteEnrollmentDialog',
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
        icon: 'mdi-delete',
        title: 'Delete Enrollment?'
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
      AwarenessEducatorService.deleteTraining(this.selectedRow.resourceId)
        .then(() => {
          this.handleClose(true)
        })
        .finally(() => (this.isActionButtonDisabled = false))
    }
  }
}
</script>
