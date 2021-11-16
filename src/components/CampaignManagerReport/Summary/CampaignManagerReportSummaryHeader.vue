<template>
  <div class="campaign-manager-report-summary-header">
    <CampaignManagerReportSummaryResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :items="resendDialogItems"
      :phishing-scenario-name="phishingScenarioName"
      :is-action-button-disabled="isActionButtonDisabled"
      @on-close="toggleShowResendDialog"
      @on-confirm="handleOnConfirmResend"
    />
    <div class="campaign-manager-report-summary-header__left">
      <div class="campaign-manager-report-summary-header__title">
        {{ labels.CampaignSummary }}
      </div>
      <div class="campaign-manager-report-summary-header__subtitle">{{ phishingScenarioName }}</div>
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
        @click="toggleShowResendDialog"
        >{{ labels.ResendCampaign }}</v-btn
      >
    </div>
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
import CampaignManagerReportSummaryResendDialog from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryResendDialog'
import { resendPhishingCampaignToUsers } from '@/api/phishingsimulator'
export default {
  name: 'CampaignManagerReportSummaryHeader',
  components: { CampaignManagerReportSummaryResendDialog },
  props: {
    phishingScenarioName: {
      type: String
    },
    resendDialogItems: {
      type: Object
    },
    id: {
      type: String
    }
  },
  data() {
    return {
      labels,
      isActionButtonDisabled: false,
      isShowResendDialog: false
    }
  },
  methods: {
    toggleShowResendDialog() {
      this.isShowResendDialog = !this.isShowResendDialog
    },
    handleOnConfirmResend(types) {
      this.isActionButtonDisabled = true
      debugger
      resendPhishingCampaignToUsers({ Types: types }, this.id)
        .then((response) => {})
        .finally(() => (this.isActionButtonDisabled = false))
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
      &,
      &:focus,
      &:active {
        box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.08);
        filter: drop-shadow(0px 1px 4px rgba(17, 115, 193, 0.25));
      }
      .v-btn__content {
        font-weight: 600;
        font-size: 14px;
        color: #ffffff;
      }
    }
  }
}
</style>
