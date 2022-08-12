<template>
  <div id="campaign-manager-report-summary-cards" class="campaign-manager-report-summary-cards">
    <div class="campaign-manager-report-summary-cards__left">
      <CampaignManagerReportSummaryInfoCard
        v-bind="getNoResponseData"
        :title="labels.NoResponse"
        :is-loading="isLoading"
        :icon-src="noResponseIcon"
        background-color="#0198AC"
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
      />
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
      type: Number
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
    getSecondCardProps() {
      if (this.method === 3 || this.method === 1) {
        return this.getPhishingReporterData
      }

      return this.getOpenedData
    },
    getSecondCardLabel() {
      if (this.method === 3 || this.method === 1) {
        return labels.PhishingReporters
      }

      return labels.OpenedEmail
    },
    getSecondCardIcon() {
      if (this.method === 3 || this.method === 1) {
        return this.phishingReportersIcon
      }

      return this.openedEmailIcon
    },
    getSecondCardColor() {
      if (this.method === 3 || this.method === 1) {
        return '#217124'
      }

      return '#B6791D'
    },
    getThirdCardProps() {
      if (this.method === 2) {
        return this.getClickedData
      }

      if (this.method === 3 || this.method === 1) {
        return this.getOpenedData
      }

      return this.getOpenedData
    },
    getThirdCardLabel() {
      if (this.method === 2) {
        return labels.ClickedLink
      }

      if (this.method === 3 || this.method === 1) {
        return labels.OpenedEmail
      }

      return labels.OpenedEmail
    },
    getThirdCardColor() {
      if (this.method === 2) {
        return '#F56C6C'
      }

      if (this.method === 3 || this.method === 1) {
        return '#B6791D'
      }

      return '#B6791D'
    },
    getThirdCardIcon() {
      if (this.method === 2) {
        return this.clickedLinkIcon
      }

      if (this.method === 3 || this.method === 1) {
        return this.openedEmailIcon
      }

      return this.openedEmailIcon
    },
    getFourthCardProps() {
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
      if (this.method === 1) {
        return 'campaign-manager-report-summary-info-card--clicked-link'
      }

      if (this.method === 2) {
        return 'campaign-manager-report-summary-info-card--submitted-data'
      }

      if (this.method === 3) {
        return 'campaign-manager-report-summary-info-card--opened-attachment-data'
      }

      return 'campaign-manager-report-summary-info-card--submitted-data'
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
