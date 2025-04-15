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
      >
        <template v-if="isCampaignHasAllTypes" #icon>
          <div class="campaign-manager-report-summary-info-card--submitted-data-icon">
            <img src="../../../assets/img/phonelink_lock.svg" alt="icon" />
          </div>
        </template>
        <template v-else-if="isCampaignAttachmentAndMfaDataSubmission" #icon>
          <div class="campaign-manager-report-summary-info-card--submitted-data-icon">
            <img src="../../../assets/img/attachment-icon.svg" alt="icon" />
          </div>
        </template>
      </CampaignManagerReportSummaryInfoCard>
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
        <template
          v-if="
            isCampaignHasAllTypes ||
            isCampaignDataSubmissionAndMfa ||
            isCampaignAttachmentAndMfaDataSubmission
          "
          #icon
        >
          <div class="campaign-manager-report-summary-info-card--submitted-data-icon">
            <img src="../../../assets/img/enhanced_encryption.png" alt="icon" />
          </div>
        </template>
        <template v-else-if="isCampaignAttachmentAndMfaClickOnly" #icon>
          <div class="campaign-manager-report-summary-info-card--submitted-data-icon">
            <img src="../../../assets/img/phonelink_lock.svg" alt="icon" />
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
          <div
            v-if="
              !isCampaignClickOnlyAndMfa &&
              !isCampaignDataSubmissionAndMfa &&
              !isCampaignAttachmentAndMfaDataSubmission
            "
            class="campaign-manager-report-summary-info-card--submitted-data-icon"
          >
            <img src="../../../assets/img/enhanced_encryption.png" alt="icon" />
          </div>
          <div
            v-else-if="isCampaignAttachmentAndMfaClickOnly"
            class="campaign-manager-report-summary-info-card--submitted-data-icon"
          >
            <img src="../../../assets/img/attachment-icon.svg" alt="icon" />
          </div>
          <div v-else class="campaign-manager-report-summary-info-card--submitted-data-icon">
            <img src="../../../assets/img/phonelink_lock.svg" alt="icon" />
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
      phishingReportersIcon: require('../../../assets/img/phishing-reporters.svg'),
      mfaIcon: require('../../../assets/img/phonelink_lock.svg'),
      attachmentIcon: require('../../../assets/img/attachment-icon.svg')
    }
  },
  computed: {
    getFirstCardProps() {
      if (this.isCampaignHasAllTypes) {
        return this.getClickedData
      }
      if (
        this.isCampaignMfaClickOnlyAndDataSubmission ||
        this.isCampaignHasClickOnlyAndDataSubmissionAndAttachment ||
        this.isCampaignAttachmentAndMfaClickOnly ||
        this.isCampaignAttachmentAndMfaDataSubmission
      )
        return this.getPhishingReporterData
      return this.getNoResponseData
    },
    getFirstCardTitle() {
      if (this.isCampaignHasAllTypes) return labels.ClickedLink
      if (
        this.isCampaignMfaClickOnlyAndDataSubmission ||
        this.isCampaignHasClickOnlyAndDataSubmissionAndAttachment ||
        this.isCampaignAttachmentAndMfaClickOnly ||
        this.isCampaignAttachmentAndMfaDataSubmission
      )
        return labels.PhishingReporter
      return labels.NoResponse
    },
    getFirstCardIcon() {
      if (this.isCampaignHasAllTypes) return this.clickedLinkIcon
      if (
        this.isCampaignMfaClickOnlyAndDataSubmission ||
        this.isCampaignHasClickOnlyAndDataSubmissionAndAttachment ||
        this.isCampaignAttachmentAndMfaClickOnly ||
        this.isCampaignAttachmentAndMfaDataSubmission
      )
        return this.phishingReportersIcon
      return this.noResponseIcon
    },
    getFirstCardColor() {
      if (this.isCampaignHasAllTypes) return '#F56C6C'
      if (
        this.isCampaignMfaClickOnlyAndDataSubmission ||
        this.isCampaignHasClickOnlyAndDataSubmissionAndAttachment ||
        this.isCampaignAttachmentAndMfaClickOnly ||
        this.isCampaignAttachmentAndMfaDataSubmission
      )
        return '#217124'
      return '#0198AC'
    },
    getSecondCardProps() {
      if (this.isCampaignHasAllTypes) return this.getMfaData
      if (
        this.isCampaignMfaClickOnlyAndDataSubmission ||
        this.isCampaignHasClickOnlyAndDataSubmissionAndAttachment ||
        this.isCampaignAttachmentAndMfaClickOnly
      )
        return this.getClickedData
      if (this.isCampaignAttachmentAndMfaDataSubmission) {
        return this.getOpenedAttachmentData
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
      if (this.isCampaignHasAllTypes) return labels.SubmittedMFACode
      if (
        this.isCampaignMfaClickOnlyAndDataSubmission ||
        this.isCampaignHasClickOnlyAndDataSubmissionAndAttachment ||
        this.isCampaignAttachmentAndMfaClickOnly
      )
        return labels.ClickedLink
      if (this.isCampaignAttachmentAndMfaDataSubmission) {
        return labels.OpenedAttachment
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
      if (this.isCampaignHasAllTypes) return this.submittedDataIcon
      if (
        this.isCampaignMfaClickOnlyAndDataSubmission ||
        this.isCampaignHasClickOnlyAndDataSubmissionAndAttachment ||
        this.isCampaignAttachmentAndMfaClickOnly
      )
        return this.clickedLinkIcon
      if (this.isCampaignAttachmentAndMfaDataSubmission) {
        return this.attachmentIcon
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
      if (this.isCampaignHasAllTypes) return '#B83A3A'
      if (
        this.isCampaignMfaClickOnlyAndDataSubmission ||
        this.isCampaignHasClickOnlyAndDataSubmissionAndAttachment ||
        this.isCampaignAttachmentAndMfaClickOnly
      )
        return '#F56C6C'
      if (this.isCampaignAttachmentAndMfaDataSubmission) {
        return '#B83A3A'
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
      if (
        this.isCampaignHasAllTypes ||
        this.isCampaignHasClickOnlyAndDataSubmissionAndAttachment ||
        this.isCampaignDataSubmissionAndMfa ||
        this.isCampaignAttachmentAndMfaDataSubmission
      ) {
        return this.getSubmittedData
      }
      if (this.isCampaignAttachmentAndMfaClickOnly) {
        return this.getMfaData
      }
      if (this.isCampaignHasAttachmentAndDataSubmission) {
        return this.getOpenedAttachmentData
      }
      if (
        this.isCampaignClickOnlyAndAttachment ||
        this.isCampaignClickOnlyAndDataSubmission ||
        this.isCampaignClickOnlyAndMfa ||
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
      if (
        this.isCampaignHasAllTypes ||
        this.isCampaignHasClickOnlyAndDataSubmissionAndAttachment ||
        this.isCampaignDataSubmissionAndMfa ||
        this.isCampaignAttachmentAndMfaDataSubmission
      ) {
        return labels.SubmittedData
      }
      if (
        this.isCampaignAttachmentAndMfaClickOnly ||
        this.isCampaignAttachmentAndMfaDataSubmission
      ) {
        return labels.SubmittedMFACode
      }
      if (this.isCampaignHasAttachmentAndDataSubmission) {
        return labels.OpenedAttachment
      }
      if (
        this.isCampaignClickOnlyAndAttachment ||
        this.isCampaignClickOnlyAndDataSubmission ||
        this.isCampaignClickOnlyAndMfa ||
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
      if (
        this.isCampaignHasAllTypes ||
        this.isCampaignHasAttachmentAndDataSubmission ||
        this.isCampaignHasClickOnlyAndDataSubmissionAndAttachment ||
        this.isCampaignDataSubmissionAndMfa ||
        this.isCampaignAttachmentAndMfaDataSubmission ||
        this.isCampaignAttachmentAndMfaClickOnly
      ) {
        return '#B83A3A'
      }
      if (
        this.isCampaignClickOnlyAndAttachment ||
        this.isCampaignClickOnlyAndDataSubmission ||
        this.isCampaignClickOnlyAndMfa ||
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
      if (
        this.isCampaignHasAllTypes ||
        this.isCampaignHasAttachmentAndDataSubmission ||
        this.isCampaignHasClickOnlyAndDataSubmissionAndAttachment ||
        this.isCampaignDataSubmissionAndMfa ||
        this.isCampaignAttachmentAndMfaDataSubmission
      ) {
        return this.submittedDataIcon
      }
      if (this.isCampaignAttachmentAndMfaClickOnly) {
        return this.mfaIcon
      }
      if (
        this.isCampaignClickOnlyAndAttachment ||
        this.isCampaignClickOnlyAndDataSubmission ||
        this.isCampaignClickOnlyAndMfa ||
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
      if (
        this.isCampaignHasAllTypes ||
        this.isCampaignHasClickOnlyAndDataSubmissionAndAttachment ||
        this.isCampaignDataSubmissionAndMfa ||
        this.isCampaignAttachmentAndMfaClickOnly ||
        this.isCampaignAttachmentAndMfaDataSubmission
      ) {
        return 'campaign-manager-report-summary-info-card--submitted-data'
      }
      return ''
    },
    getFourthCardProps() {
      if (
        this.isCampaignHasAllTypes ||
        this.isCampaignHasClickOnlyAndDataSubmissionAndAttachment ||
        this.isCampaignClickOnlyAndAttachment ||
        this.isCampaignAttachmentAndMfaClickOnly
      ) {
        return this.getOpenedAttachmentData
      }
      if (
        this.isCampaignClickOnlyAndMfa ||
        this.isCampaignDataSubmissionAndMfa ||
        this.isCampaignAttachmentAndMfaDataSubmission
      )
        return this.getMfaData
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
      if (
        this.isCampaignHasAllTypes ||
        this.isCampaignHasClickOnlyAndDataSubmissionAndAttachment ||
        this.isCampaignClickOnlyAndAttachment ||
        this.isCampaignAttachmentAndMfaClickOnly
      ) {
        return labels.OpenedAttachment
      }
      if (
        this.isCampaignClickOnlyAndMfa ||
        this.isCampaignDataSubmissionAndMfa ||
        this.isCampaignAttachmentAndMfaDataSubmission
      )
        return labels.SubmittedMFACode
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
      if (
        this.isCampaignHasClickOnlyAndDataSubmissionAndAttachment ||
        this.isCampaignHasAttachmentAndDataSubmission ||
        this.isCampaignClickOnlyAndAttachment ||
        this.isCampaignClickOnlyAndMfa ||
        this.isCampaignDataSubmissionAndMfa ||
        this.isCampaignAttachmentAndMfaClickOnly ||
        this.isCampaignAttachmentAndMfaDataSubmission
      ) {
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
    isCampaignHasClickOnlyAndDataSubmissionAndAttachment() {
      return (
        this.multipleType.length &&
        this.multipleType[0] &&
        this.multipleType[1] &&
        this.multipleType[2]
      )
    },
    isCampaignHasAttachmentAndDataSubmission() {
      return this.multipleType.length && this.multipleType[1] && this.multipleType[2]
    },
    isCampaignClickOnlyAndAttachment() {
      return this.multipleType.length && this.multipleType[0] && this.multipleType[2]
    },
    isCampaignClickOnlyAndMfa() {
      return this.multipleType.length && this.multipleType[0] && this.multipleType[3]
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
      return this.items?.noResponse ?? {}
    },
    getOpenedData() {
      return this.items?.openedEmail ?? {}
    },
    getOpenedAttachmentData() {
      return this.items?.attachmentOpenedEmail ?? {}
    },
    getSubmittedData() {
      return this.items?.submittedEmail ?? {}
    },
    getClickedData() {
      return this.items?.clickedEmail ?? {}
    },
    getPhishingReporterData() {
      return this.items?.phishingReporter ?? {}
    },
    getMfaData() {
      return this.items?.mfa ?? {}
    }
  }
}
</script>
