<template>
  <AppDialog
    v-if="status"
    title="Error"
    icon="mdi-alert"
    className="integration-error-message-popup"
    :status="status"
    :body="message"
    @changeStatus="handleClose"
  >
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--campaign-manager-smtp-error-popup"
        confirm-button-id="btn-delete--campaign-manager-smtp-error-popup"
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
  name: 'CampaignManagerSmtpErrorDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    message: {
      type: String
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
