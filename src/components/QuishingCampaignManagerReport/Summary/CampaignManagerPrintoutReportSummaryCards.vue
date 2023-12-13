<template>
  <div
    id="campaign-manager-report-summary-cards"
    class="campaign-manager-report-summary-cards"
    :style="getMainContainerStyle"
  >
    <div class="campaign-manager-report-summary-cards__left" :style="getFirstContainerStyle">
      <CampaignManagerReportSummaryInfoCard
        v-bind="getNoResponseData"
        background-color="#0198AC"
        :title="labels.NoResponse"
        :is-loading="isLoading"
        :icon-src="noResponseIcon"
      />
      <CampaignManagerReportSummaryInfoCard
        v-bind="getOpenedData"
        background-color="#F56C6C"
        :title="labels.ScannedQRLink"
        :is-loading="isLoading"
        :icon-src="mfaIcon"
      />
      <CampaignManagerReportSummaryInfoCard
        v-if="isCampaignClickOnlyAndMfa || isCampaignDataSubmission"
        v-bind="getThirdCardProps"
        background-color="#B83A3A"
        :title="getThirdCardLabel"
        :is-loading="isLoading"
        :icon-src="getThirdCardIcon"
      />
    </div>
    <div v-if="isCampaignDataSubmissionAndMfa" class="campaign-manager-report-summary-cards__right">
      <CampaignManagerReportSummaryInfoCard
        v-bind="getSubmittedData"
        class="campaign-manager-report-summary-info-card--submitted-data"
        background-color="#B83A3A"
        :title="labels.SubmittedData"
        :is-loading="isLoading"
        :icon-src="submittedDataIcon"
      />
      <CampaignManagerReportSummaryInfoCard
        v-bind="getMfaData"
        background-color="#B83A3A"
        :title="labels.SubmittedMFACode"
        :is-loading="isLoading"
        :icon-src="mfaIcon"
      />
    </div>
  </div>
</template>

<script>
import CampaignManagerReportSummaryInfoCard from '@/components/QuishingCampaignManagerReport/Summary/CampaignManagerReportSummaryInfoCard'
import labels from '@/model/constants/labels'
export default {
  name: 'CampaignManagerPrintoutReportSummaryCards',
  components: { CampaignManagerReportSummaryInfoCard },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    items: {
      type: Object
    },
    method: {
      type: [Number, String]
    },
    multipleType: {
      type: Array
    }
  },
  data() {
    return {
      labels,
      noResponseIcon: require('../../../assets/img/ic-check-box.svg'),
      submittedDataIcon: require('../../../assets/img/enhanced_encryption.png'),
      mfaIcon: require('../../../assets/img/ic-qr-code-report.svg')
    }
  },
  computed: {
    getFirstContainerStyle() {
      return this.isCampaignClickOnly ? { display: 'grid', gridTemplateColumns: '1fr 1fr' } : {}
    },
    getMainContainerStyle() {
      return this.isCampaignClickOnly ? { display: 'grid', gridTemplateColumns: '1fr' } : {}
    },
    getThirdCardProps() {
      if (this.isCampaignDataSubmission) return this.getSubmittedData
      if (this.isCampaignClickOnlyAndMfa) return this.getMfaData
      return this.getSubmittedData
    },
    getThirdCardLabel() {
      if (this.isCampaignDataSubmission) return labels.SubmittedData
      if (this.isCampaignClickOnlyAndMfa) return labels.SubmittedMFACode
      return labels.SubmittedData
    },
    getThirdCardIcon() {
      if (this.isCampaignDataSubmission) return this.submittedDataIcon
      if (this.isCampaignClickOnlyAndMfa) return this.mfaIcon
      return this.submittedDataIcon
    },
    isCampaignClickOnlyAndMfa() {
      return this.multipleType.length && this.multipleType[0] && this.multipleType[3]
    },
    isCampaignClickOnly() {
      return (
        (this.multipleType.length &&
          this.multipleType[0] &&
          !this.multipleType[1] &&
          !this.multipleType[2] &&
          !this.multipleType[3]) ||
        this.method === 1
      )
    },
    isCampaignDataSubmission() {
      return (
        (this.multipleType.length &&
          !this.multipleType[0] &&
          this.multipleType[1] &&
          !this.multipleType[2] &&
          !this.multipleType[3]) ||
        this.method === 2
      )
    },
    isCampaignDataSubmissionAndMfa() {
      return this.multipleType.length && this.multipleType[1] && this.multipleType[3]
    },
    isCampaignMfaClickOnlyAndDataSubmission() {
      return (
        this.multipleType.length &&
        this.multipleType[0] &&
        this.multipleType[1] &&
        this.multipleType[3]
      )
    },
    isCampaignAttachmentAndMfaClickOnly() {
      return (
        this.multipleType.length &&
        this.multipleType[0] &&
        this.multipleType[2] &&
        this.multipleType[3]
      )
    },
    isCampaignAttachmentAndMfaDataSubmission() {
      return (
        this.multipleType.length &&
        this.multipleType[1] &&
        this.multipleType[2] &&
        this.multipleType[3]
      )
    },
    isCampaignClickOnlyAndDataSubmission() {
      return this.multipleType.length && this.multipleType[0] && this.multipleType[1]
    },
    getNoResponseData() {
      const { noResponse } = this.items
      return noResponse ? noResponse : {}
    },
    getOpenedData() {
      const { openedEmail } = this.items
      return openedEmail ? openedEmail : {}
    },
    getOpenedAttachmentData() {
      const { attachmentOpenedEmail } = this.items
      return attachmentOpenedEmail ? attachmentOpenedEmail : {}
    },
    getSubmittedData() {
      const { submittedEmail } = this.items
      return submittedEmail ? submittedEmail : {}
    },
    getClickedData() {
      const { clickedEmail } = this.items
      return clickedEmail ? clickedEmail : {}
    },
    getPhishingReporterData() {
      const { phishingReporter } = this.items
      return phishingReporter ? phishingReporter : {}
    },
    getMfaData() {
      const { mfa } = this.items
      return mfa ? mfa : {}
    }
  }
}
</script>
