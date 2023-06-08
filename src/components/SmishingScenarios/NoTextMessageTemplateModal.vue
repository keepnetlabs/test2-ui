<template>
  <AppDialog
    icon="mdi-alert"
    title="You do not have any smishing text message templates"
    title-id="text--no-text-message-template-popup-title"
    :status="status"
    @changeStatus="closeModal"
  >
    <template #app-dialog-body>
      You need a smishing text message template to start a smishing campaign.
    </template>
    <template #app-dialog-footer>
      <app-dialog-footer
        justify="space-between"
        cancel-button-id="btn-cancel--no-text-message-template-popup"
        confirm-button-id="btn-confirm--no-text-message-template-popup"
        actionButtonText="Create Text Message Template"
        @handleClose="closeModal"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
export default {
  name: 'NoTextMessageTemplateModal',
  components: {
    AppDialog,
    AppDialogFooter
  },
  props: {
    status: {
      type: Boolean
    }
  },
  methods: {
    closeModal() {
      this.$emit('handleCloseModal')
    },
    handleConfirm() {
      this.$emit('handleConfirm')
    }
  }
}
</script>
