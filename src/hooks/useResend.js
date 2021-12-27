import { resendPhishingCampaignToUserList } from '@/api/phishingsimulator'

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
      resendPhishingCampaignToUserList(this.resendPayload, this.id)
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
