<template>
  <AppDialog
    :status="status"
    body="You are changing the privacy settings for community from private to public. All member requests will be accepted?"
    icon="mdi-account-plus"
    title="Accept all requests?"
    title-id="text--threat-sharing-community-privacy-settings-popup-title"
    subtitle-id="text--threat-sharing-community-privacy-settings-popup-subtitle"
    @changeStatus="$emit('on-close')"
  >
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="threat-sharing-new-community-accept-modal-cancel-button"
        confirm-button-id="threat-sharing-new-community-accept-modal-accept-all-button"
        action-button-text="Accept All"
        @handleClose="$emit('on-close')"
        @handleConfirm="$emit('on-confirm')"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import labels from '@/model/constants/labels'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
export default {
  name: 'PrivacySettingsDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean
    }
  },
  data() {
    return labels
  }
}
</script>
