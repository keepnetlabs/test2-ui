<template>
  <AppDialog
    :status="status"
    icon="mdi-delete"
    type="delete"
    title="Delete Community?"
    :subtitle="deleteCommunityName"
    :body="`${deleteCommunityName} will be deleted. All posts and data will be lost`"
    @changeStatus="$emit('on-close')"
  >
    <template #app-dialog-footer>
      <AppDialogFooter
        actionButtonText="DELETE"
        type="delete"
        cancel-button-id="threat-sharing-communities-delete-modal-cancel-button"
        confirm-button-id="threat-sharing-communities-delete-modal-confirm-button"
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
  name: 'DeleteCommunityDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    deleteCommunityName: {
      type: String
    }
  }
}
</script>
