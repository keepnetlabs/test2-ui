<template>
  <div class="campaign-manager-report-summary-header">
    <div class="campaign-manager-report-summary-header__left">
      <div class="campaign-manager-report-summary-header__title">
        {{ labels.CampaignSummary }}
      </div>
      <div class="campaign-manager-report-summary-header__subtitle">{{ labels.ResetPassword }}</div>
    </div>
    <div class="campaign-manager-report-summary-header__right">
      <v-btn
        class="campaign-manager-report-summary-header__btn-download-report"
        rounded
        outlined
        color="#2196f3"
        >{{ labels.DownloadReport }}</v-btn
      >
      <v-btn
        class="campaign-manager-report-summary-header__btn-resend-campaign ml-2"
        rounded
        color="#2196f3"
        >{{ labels.ResendCampaign }}</v-btn
      >
    </div>
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
export default {
  name: 'CampaignManagerReportSummaryHeader',
  data() {
    return {
      labels
    }
  }
}
</script>

<style lang="scss">
.campaign-manager-report-summary-header {
  display: flex;
  justify-content: space-between;
  &__left {
    display: flex;
    flex-direction: column;
  }
  &__right {
    display: flex;
  }
  &__title {
    font-weight: 600;
    font-size: 20px;
    color: #383b41;
    line-height: 24px;
  }
  &__subtitle {
    font-weight: normal;
    font-size: 16px;
    color: #383b41;
    line-height: 22px;
  }
  &__btn {
    &-download-report {
      .v-btn__content {
        font-weight: 600;
        font-size: 14px;
      }
    }
    &-resend-campaign {
      .v-btn__content {
        font-weight: 600;
        font-size: 14px;
        color: #ffffff;
      }
    }
  }
}
</style>
