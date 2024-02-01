import SmishingService from '@/api/smishing'

export const useSmishingResend = {
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
      SmishingService.resendSmishingCampaignToUserList(
        this.resendPayload,
        this.id,
        this.instanceGroup
      )
        .then(() => {
          this.toggleIsShowResendDialog()
          this.$refs.refTable.$refs?.refTable?.resetSelectableParams?.()
          this.$refs.refTable.callForData()
        })
        .finally(() => {
          this.isResendActionButtonDisabled = false
        })
    }
  }
}
