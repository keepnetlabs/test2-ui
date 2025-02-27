<template>
  <AppDialog
    title="Unlink Microsoft Outlook Access?"
    icon="mdi-link-off"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      Unlinking will disconnect the connection between Microsoft and the platform. However, access
      will still remain on the Microsoft side.
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--unlink-microsoft-access-modal"
        confirm-button-id="btn-save--unlink-microsoft-access-modal"
        action-button-color="#F56C6C"
        cancel-button-color="#383B41"
        action-button-text="UNLINK"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="handleClose"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter.vue'
import AppDialog from '@/components/AppDialog.vue'
import { deleteGraphAccount } from '@/api/phishingReporter'

export default {
  name: 'UnlinkMicrosoftAccessDialog',
  components: { AppDialog, AppDialogFooter },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isActionButtonDisabled: false
    }
  },
  methods: {
    handleClose(forceUpdate = false) {
      this.$emit('close', forceUpdate)
    },
    handleConfirm() {
      this.isActionButtonDisabled = true
      deleteGraphAccount()
        .then(() => {
          this.handleClose(true)
        })
        .finally(() => {
          this.isActionButtonDisabled = false
        })
    }
  }
}
</script>
