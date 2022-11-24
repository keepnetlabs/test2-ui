<template>
  <AppDialog
    :status="status"
    type="delete"
    icon="mdi-delete"
    title="Delete Community?"
    title-id="text--threat-sharing-right-delete-community-popup-title"
    subtitle-id="text--threat-sharing-right-delete-community-popup-subtitle"
    :subtitle="communityDetails && communityDetails.name"
    :body="`${
      communityDetails && communityDetails.name
    } will be deleted. All posts and data will be lost`"
    @changeStatus="$emit('on-close')"
  >
    <template v-slot:app-dialog-footer>
      <AppDialogFooter
        type="delete"
        cancel-button-id="btn-cancel--threat-sharing-right-column-community"
        confirm-button-id="btn-delete--threat-sharing-right-column-community"
        actionButtonText="DELETE"
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
  name: 'RightColumnDeleteCommunityDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    communityDetails: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
