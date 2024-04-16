<template>
  <AppDialog
    type="delete"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      Are you sure you want to stop the auto-enroll? Once stopped, it cannot be restarted.
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        type="delete"
        isForceActionButtonText
        actionButtonText="STOP"
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
export default {
  name: 'StopAutoEnrollDialog',
  components: { AppDialog, AppDialogFooter },
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
        icon: 'mdi-delete',
        title: 'Stop Auto-enroll?'
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleConfirm() {
      this.$emit('confirm')
    }
  }
}
</script>
