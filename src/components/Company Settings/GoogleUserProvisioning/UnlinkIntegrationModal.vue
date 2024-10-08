<template>
  <AppDialog
    icon="mdi-link-off"
    title="Unlink Integration?"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      Unlinking will stop syncing users from Google Workspace. New or updated user data will no
      longer be imported. Do you want to proceed?
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        type="delete"
        isForceActionButtonText
        :confirm-button-disabled="isActionButtonDisabled"
        actionButtonText="Unlink Integration"
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
  name: 'UnlinkIntegrationModal',
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
