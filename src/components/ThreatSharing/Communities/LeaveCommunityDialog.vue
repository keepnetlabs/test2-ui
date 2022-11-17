<template>
  <AppDialog
    :status="status"
    icon="mdi-exit-to-app"
    title="Leave Community?"
    :subtitle="leaveCommunityName"
    :body="`You are leaving ${leaveCommunityName}. You won’t be able to post incidents to this community`"
    @changeStatus="$emit('on-close')"
  >
    <template #app-dialog-footer>
      <AppDialogFooter
        actionButtonText="LEAVE"
        cancel-button-id="threat-sharing-communities-leave-modal-cancel-button"
        confirm-button-id="threat-sharing-communities-leave-modal-confirm-button"
        @handleClose="$emit('on-close')"
        @handleConfirm="$emit('on-confirm')"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
export default {
  name: 'LeaveCommunityDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    leaveCommunityName: {
      type: String
    }
  }
}
</script>
