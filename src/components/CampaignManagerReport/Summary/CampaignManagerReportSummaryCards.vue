<template>
  <div id="campaign-manager-report-summary-cards" class="campaign-manager-report-summary-cards">
    <CampaignManagerReportSummaryInfoCard
      :title="labels.NoResponse"
      :is-loading="isLoading"
      :icon-src="noResponseIcon"
    />
    <CampaignManagerReportSummaryInfoCard
      background-color="#E6A23C"
      :title="labels.OpenedEmail"
      :is-loading="isLoading"
      :icon-src="openedEmailIcon"
    />
    <CampaignManagerReportSummaryInfoCard
      background-color="#F56C6C"
      :title="labels.ClickedLink"
      :is-loading="isLoading"
      :icon-src="clickedLinkIcon"
    />
    <CampaignManagerReportSummaryInfoCard
      class="campaign-manager-report-summary-info-card--submitted-data"
      background-color="#B83A3A"
      :title="labels.SubmittedData"
      :is-loading="isLoading"
    >
      <template #icon>
        <div class="campaign-manager-report-summary-info-card--submitted-data-icon">
          <img src="../../../assets/img/enhanced_encryption.png" alt="icon" />
        </div>
      </template>
    </CampaignManagerReportSummaryInfoCard>
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
  }
}
</script>

<style lang="scss">
.campaign-manager-report-summary-cards {
  display: flex;
  flex-wrap: wrap;
  .campaign-manager-report-summary-info-card {
    margin-top: 24px;
    margin-left: 16px;
    &:first-child {
      margin-left: 0 !important;
      .campaign-manager-report-summary-info-card-body__icon {
        right: -10px;
        bottom: -12px;
        img {
          max-height: 80px;
          max-width: 80px;
        }
      }
    }
    &:nth-child(3) {
      @media (max-width: 1024px) {
        margin-left: 0;
      }
      margin-right: 16px;
    }
    &:last-child {
      margin-left: 0 !important;
    }

    &--submitted-data {
      &-icon {
        background-color: #ffffff;
        mix-blend-mode: normal;
        opacity: 0.3;
        border-radius: 6px;
        height: 64px;
        width: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .campaign-manager-report-summary-info-card-body__icon {
        bottom: 4px;
      }
    }
  }
}
</style>
