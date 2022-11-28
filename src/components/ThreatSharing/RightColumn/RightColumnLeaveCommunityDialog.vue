<template>
  <AppDialog
    :status="status"
    icon="mdi-exit-to-app"
    title="Leave Community?"
    title-id="text--threat-sharing-right-column-leave-community-popup-title"
    subtitle-id="text--threat-sharing-right-column-leave-community-popup-subtitle"
    :subtitle="communityDetails && communityDetails.name"
    :body="`You are leaving ${
      communityDetails && communityDetails.name
    }. You won’t be able to post incidents to this community`"
    @changeStatus="$emit('on-close')"
  >
    <template #app-dialog-footer>
      <AppDialogFooter
        :confirm-button-disabled="isActionButtonDisabled"
        cancel-button-id="btn-cancel--threat-sharing-right-column-leave-community-popup"
        confirm-button-id="btn-leave--threat-sharing-right-column-leave-community-popup"
        actionButtonText="LEAVE"
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
  name: 'RightColumnLeaveCommunityDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    communityDetails: {
      type: Object,
      default: () => {}
    },
    status: {
      type: Boolean,
      default: false
    },
    isActionButtonDisabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['on-close', 'on-confirm']
}
</script>
