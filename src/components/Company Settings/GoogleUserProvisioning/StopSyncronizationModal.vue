<template>
  <AppDialog
    icon="mdi-sync"
    title="Stop Synchronization?"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body
      >Are you sure you want to stop syncing users? This will pause user provisioning and updates
      from your Google Workspace until you start syncing again.
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        type="delete"
        isForceActionButtonText
        :confirm-button-disabled="isActionButtonDisabled"
        actionButtonText="STOP SYNC"
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
  name: 'StopSyncronizationModal',
  components: {
    AppDialog,
    AppDialogFooter
  },
  props: {
    status: {
      type: Boolean
    },
    isActionButtonDisabled: {
      type: Boolean
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
