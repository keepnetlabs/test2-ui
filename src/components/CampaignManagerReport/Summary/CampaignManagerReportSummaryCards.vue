<template>
  <div id="campaign-manager-report-summary-cards" class="campaign-manager-report-summary-cards">
    <div class="campaign-manager-report-summary-cards__left">
      <CampaignManagerReportSummaryInfoCard
        v-bind="getFirstCardProps"
        :title="getFirstCardTitle"
        :is-loading="isLoading"
        :icon-src="getFirstCardIcon"
        :background-color="getFirstCardColor"
      />
      <CampaignManagerReportSummaryInfoCard
        v-bind="getSecondCardProps"
        :background-color="getSecondCardColor"
        :title="getSecondCardLabel"
        :is-loading="isLoading"
        :icon-src="getSecondCardIcon"
      />
    </div>
    <div class="campaign-manager-report-summary-cards__right">
      <CampaignManagerReportSummaryInfoCard
        v-bind="getThirdCardProps"
        :background-color="getThirdCardColor"
        :title="getThirdCardLabel"
        :is-loading="isLoading"
        :icon-src="getThirdCardIcon"
        :class="getThirdCardClass"
      >
        <template v-if="isCampaignHasAllTypes" #icon>
          <div class="campaign-manager-report-summary-info-card--submitted-data-icon">
            <img src="../../../assets/img/enhanced_encryption.png" alt="icon" />
          </div>
        </template>
      </CampaignManagerReportSummaryInfoCard>
      <CampaignManagerReportSummaryInfoCard
        v-bind="getFourthCardProps"
        :class="getFourthCardClass"
        background-color="#B83A3A"
        :title="getFourthCardLabel"
        :is-loading="isLoading"
      >
        <template #icon>
          <div class="campaign-manager-report-summary-info-card--submitted-data-icon">
            <img src="../../../assets/img/enhanced_encryption.png" alt="icon" />
          </div>
        </template>
      </CampaignManagerReportSummaryInfoCard>
    </div>
  </div>
</template>

<script>
import CampaignManagerReportSummaryInfoCard from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryInfoCard'
import labels from '@/model/constants/labels'
export default {
  name: 'CampaignManagerReportSummaryCards',
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
      openedEmailIcon: require('../../../assets/img/ic-opened-email.svg'),
      noResponseIcon: require('../../../assets/img/ic-check-box.svg'),
      clickedLinkIcon: require('../../../assets/img/ic-exclude.svg'),
      submittedDataIcon: require('../../../assets/img/enhanced_encryption.png'),
      phishingReportersIcon: require('../../../assets/img/phishing-reporters.svg')
    }
  },
  computed: {
    getFirstCardProps() {
      if (this.isCampaignHasAllTypes) {
        return this.getPhishingReporterData
      }
      return this.getNoResponseData
    },
    getFirstCardTitle() {
      if (this.isCampaignHasAllTypes) {
        return labels.PhishingReporter
      }
      return labels.NoResponse
    },
    getFirstCardColor() {
      if (this.isCampaignHasAllTypes) {
        return '#217124'
      }
      return '#0198AC'
    },
    getFirstCardIcon() {
      if (this.isCampaignHasAllTypes) {
        return this.phishingReportersIcon
      }
      return this.noResponseIcon
    },
    getSecondCardProps() {
      if (this.isCampaignHasAllTypes) {
        return this.getClickedData
      }

      if (
        this.isCampaignHasAttachmentAndDataSubmission ||
        this.isCampaignClickOnlyAndAttachment ||
        this.isCampaignClickOnlyAndDataSubmission ||
        this.method === 3 ||
        this.method === 1
      ) {
        return this.getPhishingReporterData
      }

      return this.getOpenedData
    },
    getSecondCardLabel() {
      if (this.isCampaignHasAllTypes) {
        return labels.ClickedLink
      }
      if (
        this.isCampaignHasAttachmentAndDataSubmission ||
        this.isCampaignClickOnlyAndAttachment ||
        this.isCampaignClickOnlyAndDataSubmission ||
        this.method === 3 ||
        this.method === 1
      ) {
        return labels.PhishingReporters
      }

      return labels.OpenedEmail
    },
    getSecondCardIcon() {
      if (this.isCampaignHasAllTypes) {
        return this.clickedLinkIcon
      }
      if (
        this.isCampaignHasAttachmentAndDataSubmission ||
        this.isCampaignClickOnlyAndAttachment ||
        this.isCampaignClickOnlyAndDataSubmission ||
        this.method === 3 ||
        this.method === 1
      ) {
        return this.phishingReportersIcon
      }

      return this.openedEmailIcon
    },
    getSecondCardColor() {
      if (this.isCampaignHasAllTypes) {
        return '#F56C6C'
      }
      if (
        this.isCampaignHasAttachmentAndDataSubmission ||
        this.isCampaignClickOnlyAndAttachment ||
        this.isCampaignClickOnlyAndDataSubmission ||
        this.method === 3 ||
        this.method === 1
      ) {
        return '#217124'
      }

      return '#B6791D'
    },
    getThirdCardProps() {
      if (this.isCampaignHasAllTypes) {
        return this.getSubmittedData
      }
      if (this.isCampaignHasAttachmentAndDataSubmission) {
        return this.getOpenedAttachmentData
      }
      if (
        this.isCampaignClickOnlyAndAttachment ||
        this.isCampaignClickOnlyAndDataSubmission ||
        this.method === 2
      ) {
        return this.getClickedData
      }

      if (this.method === 3 || this.method === 1) {
        return this.getOpenedData
      }

      return this.getOpenedData
    },
    getThirdCardLabel() {
      if (this.isCampaignHasAllTypes) {
        return labels.SubmittedData
      }
      if (this.isCampaignHasAttachmentAndDataSubmission) {
        return labels.OpenedAttachment
      }
      if (
        this.isCampaignClickOnlyAndAttachment ||
        this.isCampaignClickOnlyAndDataSubmission ||
        this.method === 2
      ) {
        return labels.ClickedLink
      }

      if (this.method === 3 || this.method === 1) {
        return labels.OpenedEmail
      }

      return labels.OpenedEmail
    },
    getThirdCardColor() {
      if (this.isCampaignHasAllTypes || this.isCampaignHasAttachmentAndDataSubmission) {
        return '#B83A3A'
      }
      if (
        this.isCampaignClickOnlyAndAttachment ||
        this.isCampaignClickOnlyAndDataSubmission ||
        this.method === 2
      ) {
        return '#F56C6C'
      }
      if (this.method === 3 || this.method === 1) {
        return '#B6791D'
      }

      return '#B6791D'
    },
    getThirdCardIcon() {
      if (this.isCampaignHasAllTypes || this.isCampaignHasAttachmentAndDataSubmission) {
        return this.submittedDataIcon
      }
      if (
        this.isCampaignClickOnlyAndAttachment ||
        this.isCampaignClickOnlyAndDataSubmission ||
        this.method === 2
      ) {
        return this.clickedLinkIcon
      }

      if (this.method === 3 || this.method === 1) {
        return this.openedEmailIcon
      }

      return this.openedEmailIcon
    },
    getThirdCardClass() {
      if (this.isCampaignHasAllTypes) {
        return 'campaign-manager-report-summary-info-card--submitted-data'
      }
      return ''
    },
    getFourthCardProps() {
      if (this.isCampaignHasAllTypes || this.isCampaignClickOnlyAndAttachment) {
        return this.getOpenedAttachmentData
      }
      if (
        this.isCampaignHasAttachmentAndDataSubmission ||
        this.isCampaignClickOnlyAndDataSubmission
      ) {
        return this.getSubmittedData
      }
      if (this.method === 1) {
        return this.getClickedData
      }

      if (this.method === 2) {
        return this.getSubmittedData
      }

      if (this.method === 3) {
        return this.getOpenedAttachmentData
      }

      return this.getSubmittedData
    },
    getFourthCardLabel() {
      if (this.isCampaignHasAllTypes || this.isCampaignClickOnlyAndAttachment) {
        return labels.OpenedAttachment
      }
      if (
        this.isCampaignHasAttachmentAndDataSubmission ||
        this.isCampaignClickOnlyAndDataSubmission
      ) {
        return labels.SubmittedData
      }
      if (this.method === 1) {
        return labels.ClickedLink
      }

      if (this.method === 2) {
        return labels.SubmittedData
      }
      if (this.method === 3) {
        return labels.OpenedAttachment
      }

      return labels.SubmittedData
    },
    getFourthCardClass() {
      if (this.isCampaignHasAttachmentAndDataSubmission || this.isCampaignClickOnlyAndAttachment) {
        return 'campaign-manager-report-summary-info-card--opened-attachment-data'
      }
      if (this.method === 1) {
        return 'campaign-manager-report-summary-info-card--clicked-link'
      }

      if (this.method === 2 || this.isCampaignClickOnlyAndDataSubmission) {
        return 'campaign-manager-report-summary-info-card--submitted-data'
      }

      if (this.method === 3) {
        return 'campaign-manager-report-summary-info-card--opened-attachment-data'
      }

      return 'campaign-manager-report-summary-info-card--submitted-data'
    },
    isCampaignHasAllTypes() {
      return this.multipleType.length && this.multipleType.every(Boolean)
    },
    isCampaignHasAttachmentAndDataSubmission() {
      return this.multipleType.length && this.multipleType[1] && this.multipleType[2]
    },
    isCampaignClickOnlyAndAttachment() {
      return this.multipleType.length && this.multipleType[0] && this.multipleType[2]
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
    }
  }
}
</script>
