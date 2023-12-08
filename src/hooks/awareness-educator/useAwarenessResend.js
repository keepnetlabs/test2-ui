import AwarenessEducatorService from '@/api/awarenessEducator'

export const useResend = {
  data() {
    return {
      isShowResendDialog: false,
      resendPayload: null,
      isResendActionButtonDisabled: false
    }
  },
  methods: {
    handleOnResend(payload) {
      this.resendPayload = payload
      this.toggleIsShowResendDialog()
    },
    toggleIsShowResendDialog() {
      this.isShowResendDialog = !this.isShowResendDialog
    },
    resendItem() {
      this.isResendActionButtonDisabled = true
      AwarenessEducatorService.resendTrainingToUserList(this.resendPayload, this.id)
        .then(() => {
          this.toggleIsShowResendDialog()
          this.$refs.refTable.callForData()
        })
        .finally(() => {
          this.isResendActionButtonDisabled = false
          this.isShowResendDialog = false
        })
    }
  }
}
