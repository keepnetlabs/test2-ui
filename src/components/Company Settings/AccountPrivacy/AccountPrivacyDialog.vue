<template>
  <AppDialog
    title-id="text--certificate-dialog-delete-popup-title"
    subtitle-id="text--certificate-dialog-delete-popup-subtitle"
    icon="mdi-lock"
    title="Account Privacy"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <div>
        Are you sure you want to change how long the company officials can access your account?
      </div>
      <div class="mt-2">Time allowed for the access: {{ timeAllowed }}</div>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--account-privacy-dialog-popup"
        confirm-button-id="btn-confirm-account-privacy-dialog-popup"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="handleClose"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>
<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { updateCompanyPrivacy } from '@/api/company'

export default {
  components: {
    AppDialog,
    AppDialogFooter
  },
  props: {
    status: {
      type: Boolean
    },
    timeAllowed: {
      type: String
    },
    privacyDurationId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isActionButtonDisabled: false
    }
  },
  methods: {
    handleClose(forceUpdate = false) {
      this.$emit('on-close', forceUpdate)
    },
    handleConfirm() {
      this.isActionButtonDisabled = true
      updateCompanyPrivacy({ privacyDurationId: this.privacyDurationId })
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
