import CallbackServıce from '@/api/callback'

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
      CallbackServıce.resendCampaignToUsers(this.id, this.instanceGroup, this.resendPayload)
        .then(() => {
          this.toggleIsShowResendDialog()
          this.$refs.refTable.callForData()
        })
        .finally(() => {
          this.isResendActionButtonDisabled = false
        })
    }
  }
}
