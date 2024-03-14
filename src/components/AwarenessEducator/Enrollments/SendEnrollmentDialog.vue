<template>
  <AppDialog
    title-id="text--campaign-manager-create-new-instance-popup-title"
    subtitle-id="text--campaign-manager-create-new-instance-delete-popup-subtitle"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :status="status"
    @changeStatus="handleClose()"
  >
    <template #app-dialog-body> {{ CONSTANTS.content }} </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--campaign-manager-create-new-instance-popup"
        confirm-button-id="btn-confirm--campaign-manager-create-new-instance-popup"
        action-button-text="SEND NOW"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="handleClose()"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import AwarenessEducatorService from '@/api/awarenessEducator'
export default {
  name: 'SendEnrollmentDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isActionButtonDisabled: false,
      CONSTANTS: {
        icon: 'mdi-send',
        title: 'Send Now?',
        content: 'Do you want to enroll users now?'
      }
    }
  },
  methods: {
    handleClose(forceUpdate = false) {
      this.$emit('on-close', forceUpdate)
    },
    handleConfirm() {
      this.isActionButtonDisabled = true
      AwarenessEducatorService.sendEnrollment(this.selectedRow.enrollmentId)
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
