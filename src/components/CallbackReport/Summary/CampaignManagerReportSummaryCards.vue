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
      v-bind="getThirdCardProps"
      :background-color="getThirdCardColor"
      :title="getThirdCardLabel"
      :is-loading="isLoading"
      :icon-src="getThirdCardIcon"
      :class="getThirdCardClass"
    />
    <CampaignManagerReportSummaryInfoCard
      v-bind="getFourthCardProps"
      :class="getFourthCardClass"
      background-color="#B83A3A"
      :title="getFourthCardLabel"
      :is-loading="isLoading"
      :icon-src="enteredDigitsIcon"
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
      // TODO: Change called back icon
      calledBackIcon: require('../../../assets/img/ic-exclude.svg'),
      enteredDigitsIcon: require('../../../assets/img/ic-dialed.svg')
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
      return this.getOpenedData
    },
    getSecondCardLabel() {
      return labels.OpenedEmail
    },
    getSecondCardIcon() {
      return this.openedEmailIcon
    },
    getSecondCardColor() {
      return '#B6791D'
    },
    getThirdCardProps() {
      return this.getCalledBackData
    },
    getThirdCardLabel() {
      return `Called Back`
    },
    getThirdCardColor() {
      return '#F56C6C'
    },
    getThirdCardIcon() {
      return this.calledBackIcon
    },
    getThirdCardClass() {
      return 'campaign-manager-report-summary-info-card--submitted-data'
    },
    getFourthCardProps() {
      return this.getEnteredDigitsData
    },
    getFourthCardLabel() {
      return `Entered Digits`
    },
    getFourthCardClass() {
      return 'campaign-manager-report-summary-info-card--submitted-mfa-data'
    },
    getNoResponseData() {
      const { noResponse } = this.items
      return noResponse ? noResponse : {}
    },
    getOpenedData() {
      const { openedEmail } = this.items
      return openedEmail ? openedEmail : {}
    },
    getCalledBackData() {
      const { calledBack } = this.items
      return calledBack ? calledBack : {}
    },
    getEnteredDigitsData() {
      const { enteredDigits } = this.items
      return enteredDigits ? enteredDigits : {}
    }
  }
}
</script>
