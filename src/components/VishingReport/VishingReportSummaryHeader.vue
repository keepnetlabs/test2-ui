<template>
  <div class="training-report-summary-header">
    <VishingReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isActionButtonDisabled"
      :items="vishingReportItems"
      @on-close="toggleShowResendDialog"
      @on-confirm="handleOnConfirmResend"
    />
    <div class="training-report-summary-header__left">
      <div class="training-report-summary-header__title">
        {{ labels.CampaignSummary }}
      </div>
      <div class="training-report-summary-header__subtitle">
        Summary of this vishing campaign
      </div>
    </div>
    <div class="training-report-summary-header__right">
      <v-btn
        class="training-report-summary-header__btn-download-report"
        rounded
        outlined
        color="#2196f3"
        :disabled="isDownloadReportDisabled"
        @click="handleDownloadReport"
        >{{ labels.DownloadReport }}</v-btn
      >
      <v-btn
        class="training-report-summary-header__btn-resend-campaign ml-2"
        rounded
        color="#2196f3"
        @click="toggleShowResendDialog"
        >{{ labels.ResendCampaign }}</v-btn
      >
    </div>
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
import VishingReportResendDialog from '@/components/VishingReport/VishingReportResendDialog'
import { exportVishingReportSummary, resendVishingReport } from '@/api/vishing'

export default {
  name: 'VishingReportSummaryHeader',
  components: { VishingReportResendDialog },
  props: {
    vishingName: {
      type: String
    },
    id: {
      type: String
    },
    vishingReportItems: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      labels,
      isActionButtonDisabled: false,
      isShowResendDialog: false,
      isDownloadReportDisabled: false
    }
  },
  methods: {
    toggleShowResendDialog() {
      this.isShowResendDialog = !this.isShowResendDialog
    },
    handleOnConfirmResend(types) {
      this.isActionButtonDisabled = true
      resendVishingReport(this.id, { types })
        .then(() => {
          this.$emit('on-resend')
        })
        .finally(() => {
          this.isActionButtonDisabled = false
          this.toggleShowResendDialog()
        })
    },
    handleDownloadReport() {
      this.isDownloadReportDisabled = true
      exportVishingReportSummary(this.id)
        .then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `Vishing-Report.xlsx`
          link.click()
        })
        .finally(() => {
          this.isDownloadReportDisabled = false
        })
    }
  }
}
</script>
