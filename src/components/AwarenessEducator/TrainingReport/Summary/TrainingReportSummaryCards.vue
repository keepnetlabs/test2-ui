<template>
  <div id="training-report-summary-cards" class="training-report-summary-cards">
    <div class="training-report-summary-cards__left">
      <CampaignManagerReportSummaryInfoCard
        v-bind="getNoResponseData"
        :title="labels.NoResponse"
        :is-loading="isLoading"
        :icon-src="noResponseIcon"
      />
      <CampaignManagerReportSummaryInfoCard
        v-bind="getOpenedData"
        background-color="#E6A23C"
        :title="labels.OpenedEmail"
        :is-loading="isLoading"
        :icon-src="openedEmailIcon"
      />
    </div>
    <div class="training-report-summary-cards__right">
      <CampaignManagerReportSummaryInfoCard
        v-bind="isAttachment ? getPhishingReporterData : getClickedData"
        background-color="#F56C6C"
        :title="isAttachment ? labels.Reporters : labels.ClickedLink"
        :is-loading="isLoading"
        :icon-src="clickedLinkIcon"
      />
      <CampaignManagerReportSummaryInfoCard
        v-bind="isAttachment ? getOpenedAttachmentData : getSubmittedData"
        :class="
          isAttachment
            ? 'training-report-summary-info-card--opened-attachment-data'
            : 'training-report-summary-info-card--submitted-data'
        "
        background-color="#B83A3A"
        :title="isAttachment ? labels.OpenedAttachment : labels.SubmittedData"
        :is-loading="isLoading"
      >
        <template #icon>
          <div class="training-report-summary-info-card--submitted-data-icon">
            <img src="../../../../assets/img/enhanced_encryption.png" alt="icon" />
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
  name: 'TrainingReportSummaryCards',
  components: { CampaignManagerReportSummaryInfoCard },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    items: {
      type: Object
    },
    isAttachment: {
      type: Boolean
    }
  },
  data() {
    return {
      labels,
      openedEmailIcon: require('../../../../assets/img/ic-opened-email.svg'),
      noResponseIcon: require('../../../../assets/img/ic-check-box.svg'),
      clickedLinkIcon: require('../../../../assets/img/ic-exclude.svg'),
      submittedDataIcon: require('../../../../assets/img/enhanced_encryption.png')
    }
  },
  computed: {
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
