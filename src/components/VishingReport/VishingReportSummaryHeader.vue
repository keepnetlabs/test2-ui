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
    <div v-if="false" class="training-report-summary-header__right">
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
        >{{ labels.ResendTraining }}</v-btn
      >
    </div>
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
import VishingReportResendDialog from '@/components/VishingReport/VishingReportResendDialog'

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
      type: Object
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
    handleOnConfirmResend(types) {},
    handleDownloadReport() {}
  }
}
</script>
