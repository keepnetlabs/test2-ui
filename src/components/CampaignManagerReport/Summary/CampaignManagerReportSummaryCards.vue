<template>
  <div id="campaign-manager-report-summary-cards" class="campaign-manager-report-summary-cards">
    <div class="campaign-manager-report-summary-cards__left">
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
    <div class="campaign-manager-report-summary-cards__right">
      <CampaignManagerReportSummaryInfoCard
        v-bind="getClickedData"
        background-color="#F56C6C"
        :title="labels.ClickedLink"
        :is-loading="isLoading"
        :icon-src="clickedLinkIcon"
      />
      <CampaignManagerReportSummaryInfoCard
        v-bind="isAttachment ? getOpenedAttachmentData : getSubmittedData"
        :class="
          isAttachment
            ? 'campaign-manager-report-summary-info-card--opened-attachment-data'
            : 'campaign-manager-report-summary-info-card--submitted-data'
        "
        background-color="#B83A3A"
        :title="isAttachment ? labels.OpenedAttachment : labels.SubmittedData"
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
    isAttachment: {
      type: Boolean
    }
  },
  data() {
    return {
      labels,
      openedEmailIcon: require('../../../assets/img/ic-opened-email.svg'),
      noResponseIcon: require('../../../assets/img/ic-check-box.svg'),
      clickedLinkIcon: require('../../../assets/img/ic-exclude.svg'),
      submittedDataIcon: require('../../../assets/img/enhanced_encryption.png')
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
    }
  }
}
</script>
