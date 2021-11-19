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
        v-bind="getSubmittedData"
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

<style lang="scss">
.campaign-manager-report-summary-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media (max-width: 1300px) {
    grid-template-columns: 1fr;
    .campaign-manager-report-summary-info-card {
      max-width: 300px;
    }
    &__right {
      margin-left: 0 !important;
    }
    @media (max-width: 620px) {
      &__left,
      &__right {
        flex-direction: column;
        margin-left: 0 !important;
      }
      .campaign-manager-report-summary-info-card {
        margin-left: 0 !important;
      }
    }
  }
  &__left {
    display: flex;
    .campaign-manager-report-summary-info-card:last-child {
      margin-left: 16px;
    }
    @media (min-width: 1201px) {
      flex-basis: 50%;
    }
    .campaign-manager-report-summary-info-card {
      flex-basis: 50%;
    }
  }
  &__right {
    display: flex;
    margin-left: 16px;
    & > div:last-child {
      margin-left: 16px;
    }
    & > .campaign-manager-report-summary-info-card:first-child {
      .campaign-manager-report-summary-info-card-body__icon {
        right: -2px !important;
        bottom: -2px !important;
      }
    }
    @media (min-width: 1201px) {
      flex-basis: 50%;
    }
    .campaign-manager-report-summary-info-card {
      flex-basis: 50%;
    }
  }
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
