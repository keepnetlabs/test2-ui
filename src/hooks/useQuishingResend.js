import QuishingService from '@/api/quishing'

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
      QuishingService.resendQuishingCampaignToUserList(
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
