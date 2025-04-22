<template>
  <div id="vishing-report-summary-cards" class="vishing-report-summary-cards mt-6">
    <VishingReportSummaryInfoCard
      v-bind="getAnsweredData"
      background-color="#E6A23C"
      :title="labels.Answered"
      :is-loading="isLoading"
      :icon-src="answeredIcon"
    />
    <VishingReportSummaryInfoCard
      v-bind="getVishedData"
      background-color="#B83A3A"
      :title="labels.Vished"
      :is-loading="isLoading"
      :icon-src="vishedIcon"
    />
    <VishingReportSummaryInfoCard
      v-bind="getNoResponseData"
      background-color="#1173C1"
      :title="labels.NoResponse"
      :is-loading="isLoading"
      :icon-src="noResponseIcon"
    />
  </div>
</template>

<script>
import TrainingReportSummaryInfoCard from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryInfoCard'
import labels from '@/model/constants/labels'
export default {
  name: 'VishingReportSummaryCards',
  components: { VishingReportSummaryInfoCard: TrainingReportSummaryInfoCard },
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
      vishedIcon: require('../../assets/img/ic-dialed.svg'),
      answeredIcon: require('../../assets/img/ic-answered.svg'),
      noResponseIcon: require('../../assets/img/ic-vishing-no-response.svg')
    }
  },
  computed: {
    getAnsweredData() {
      const { answered } = this.items
      return answered ?? { userCount: 0, userPercent: 0 }
    },
    getVishedData() {
      const { vished } = this.items
      return vished ?? { userCount: 0, userPercent: 0 }
    },
    getNoResponseData() {
      const { noResponse } = this.items
      return noResponse ?? { userCount: 0, userPercent: 0 }
    }
  }
}
</script>
