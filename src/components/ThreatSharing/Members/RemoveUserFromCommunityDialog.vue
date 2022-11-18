<template>
  <AppDialog
    icon="mdi-account"
    title="Remove user from community?"
    title-id="text--threat-sharing-members-popup-title"
    subtitle-id="text--threat-sharing-members-popup-subtitle"
    :status="status"
    :subtitle="removeFromCommunityUserName"
    :body="`${removeFromCommunityUserName} will be removed and won’t be able to access the community`"
    @changeStatus="$emit('on-close')"
  >
    <template #app-dialog-footer>
      <AppDialogFooter
        type="delete"
        cancel-button-id="threat-sharing-members-remove-community-cancel-button"
        confirm-button-id="threat-sharing-members-remove-community-remove-button"
        action-button-text="REMOVE"
        :confirm-button-disabled="isActionButtonDisabled"
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
  name: 'RemoveUserFromCommunityDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    isActionButtonDisabled: {
      type: Boolean
    },
    removeFromCommunityUserName: {
      type: String
    }
  }
}
</script>
