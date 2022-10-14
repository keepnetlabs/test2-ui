<template>
  <div id="vishing-report-summary-cards" class="training-report-summary-cards">
    <div class="training-report-summary-cards__left">
      <VishingReportSummaryInfoCard
        v-bind="getAnsweredData"
        background-color="#B6791D"
        :title="labels.Answered"
        :is-loading="isLoading"
        :icon-src="answeredIcon"
      />
      <VishingReportSummaryInfoCard
        v-bind="getVishedData"
        background-color="#1173C1"
        :title="labels.Vished"
        :is-loading="isLoading"
        :icon-src="vishedIcon"
      />
      <div class="training-report-summary-cards__right">
        <VishingReportSummaryInfoCard
          v-bind="getNoResponseData"
          background-color="#43A047"
          :title="labels.CompletedTraining"
          :is-loading="isLoading"
          :icon-src="noResponseIcon"
        />
      </div>
    </div>
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
      vishedIcon: require('../../assets/img/ic-check-box.svg'),
      answeredIcon: require('../../assets/img/ic-opened-email.svg'),
      noResponseIcon: require('../../assets/img/ic-check-box.svg')
    }
  },
  computed: {
    getAnsweredData() {
      const { answered } = this.items
      return answered ? answered : { userCount: 6, userPercent: 40 }
    },
    getVishedData() {
      const { vished } = this.items
      return vished ? vished : { userCount: 1, userPercent: 7 }
    },
    getNoResponseData() {
      const { noResponse } = this.items
      return noResponse ? noResponse : { userCount: 2, userPercent: 13 }
    }
  }
}
</script>
