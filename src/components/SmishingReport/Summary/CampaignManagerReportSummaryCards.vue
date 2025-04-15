<template>
  <div
    id="campaign-manager-report-summary-cards"
    class="smishing-campaign-manager-report-summary-cards"
  >
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
    <CampaignManagerReportSummaryInfoCard
      v-if="isCampaignDataSubmissionOrSubmittedMFA"
      v-bind="getThirdCardProps"
      :background-color="getThirdCardColor"
      :title="getThirdCardLabel"
      :is-loading="isLoading"
      :icon-src="getThirdCardIcon"
      :class="getThirdCardClass"
    />
    <CampaignManagerReportSummaryInfoCard
      v-if="isCampaignHasAllTypes || isCampaignDataSubmissionAndSubmittedMFA"
      v-bind="getFourthCardProps"
      :class="getFourthCardClass"
      background-color="#B83A3A"
      :title="getFourthCardLabel"
      :is-loading="isLoading"
      :icon-src="mfaIcon"
    />
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
      noResponseIcon: require('../../../assets/img/smishing-report-no-response-icon.svg'),
      clickedLinkIcon: require('../../../assets/img/ic-exclude.svg'),
      submittedDataIcon: require('../../../assets/img/smishing-report-submitted-data-icon.svg'),
      phishingReportersIcon: require('../../../assets/img/phishing-reporters.svg'),
      mfaIcon: require('../../../assets/img/smishing-report-submitted-mfa-code-icon.svg')
    }
  },
  computed: {
    getFirstCardProps() {
      return this.getNoResponseData
    },
    getFirstCardTitle() {
      return labels.NoResponse
    },
    getFirstCardColor() {
      return '#0198AC'
    },
    getFirstCardIcon() {
      return this.noResponseIcon
    },
    getSecondCardProps() {
      return this.getClickedData
    },
    getSecondCardLabel() {
      return labels.ClickedLink
    },
    getSecondCardIcon() {
      return this.clickedLinkIcon
    },
    getSecondCardColor() {
      return '#F56C6C'
    },
    getThirdCardProps() {
      if (
        this.isCampaignClickOnlyAndDataSubmission ||
        this.isCampaignDataSubmissionAndSubmittedMFA
      ) {
        return this.getSubmittedData
      }
      if (this.isCampaignOnlySubmittedMFA || this.isCampaignClickOnlyAndSubmittedMFA) {
        return this.getSubmittedMFAData
      }
      return this.getSubmittedData
    },
    getThirdCardLabel() {
      if (
        this.isCampaignClickOnlyAndDataSubmission ||
        this.isCampaignDataSubmissionAndSubmittedMFA
      ) {
        return labels.SubmittedData
      }
      if (this.isCampaignOnlySubmittedMFA || this.isCampaignClickOnlyAndSubmittedMFA) {
        return labels.SubmittedMFACode
      }
      return labels.SubmittedData
    },
    getThirdCardColor() {
      return '#B83A3A'
    },
    getThirdCardIcon() {
      if (
        this.isCampaignClickOnlyAndDataSubmission ||
        this.isCampaignDataSubmissionAndSubmittedMFA
      ) {
        return this.submittedDataIcon
      }
      if (this.isCampaignOnlySubmittedMFA || this.isCampaignClickOnlyAndSubmittedMFA) {
        return this.mfaIcon
      }
      return this.submittedDataIcon
    },
    getThirdCardClass() {
      if (
        this.isCampaignClickOnlyAndDataSubmission ||
        this.isCampaignDataSubmissionAndSubmittedMFA
      ) {
        return 'campaign-manager-report-summary-info-card--submitted-data'
      }
      if (this.isCampaignOnlySubmittedMFA || this.isCampaignClickOnlyAndSubmittedMFA) {
        return 'campaign-manager-report-summary-info-card--submitted-mfa-data'
      }
      return 'campaign-manager-report-summary-info-card--submitted-data'
    },
    getFourthCardProps() {
      return this.getSubmittedMFAData
    },
    getFourthCardLabel() {
      return labels.SubmittedMFACode
    },
    getFourthCardClass() {
      return 'campaign-manager-report-summary-info-card--submitted-mfa-data'
    },
    isCampaignOnlyClickOnly() {
      return (
        this.multipleType.length &&
        this.multipleType[0] &&
        !this.multipleType[1] &&
        !this.multipleType[2]
      )
    },
    isCampaignOnlyDataSubmission() {
      return (
        this.multipleType.length &&
        this.multipleType[1] &&
        !this.multipleType[0] &&
        !this.multipleType[2]
      )
    },
    isCampaignOnlySubmittedMFA() {
      return (
        this.multipleType.length &&
        this.multipleType[2] &&
        !this.multipleType[0] &&
        !this.multipleType[1]
      )
    },
    isCampaignHasAllTypes() {
      return this.multipleType.length && this.multipleType.every(Boolean)
    },
    isCampaignDataSubmissionOrSubmittedMFA() {
      return this.multipleType.length && (this.multipleType[1] || this.multipleType[2])
    },
    isCampaignDataSubmissionAndSubmittedMFA() {
      return this.multipleType.length && this.multipleType[1] && this.multipleType[2]
    },
    isCampaignClickOnlyAndSubmittedMFA() {
      return this.multipleType.length && this.multipleType[0] && this.multipleType[2]
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
    getSubmittedData() {
      return this.items?.submitted ?? {}
    },
    getSubmittedMFAData() {
      return this.items?.submittedMFA ?? {}
    },
    getClickedData() {
      return this.items?.clicked ?? {}
    }
  }
}
</script>
