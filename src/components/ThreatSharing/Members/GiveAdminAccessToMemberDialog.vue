<template>
  <AppDialog
    icon="mdi-lock"
    title="Give admin privileges?"
    :status="status"
    :body="`${appointUserName} will be able to access to all settings such as removing users or deleting the community.`"
    @changeStatus="$emit('on-close')"
  >
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="threat-sharing-members-new-owner-modal-cancel-button"
        confirm-button-id="threat-sharing-members-new-owner-modal-accept-button"
        action-button-text="ACCEPT"
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
  name: 'GiveAdminAccessToMemberDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    appointUserName: {
      type: String
    },
    isActionButtonDisabled: {
      type: Boolean
    }
  }
}
</script>
