<template>
  <div id="training-report-summary-cards" class="training-report-summary-cards">
    <div class="training-report-summary-cards__left">
      <TrainingReportSummaryInfoCard
        v-bind="getOpenedData"
        background-color="#E6A23C"
        :title="labels.OpenedEmail"
        :is-loading="isLoading"
        :icon-src="clickedLinkIcon"
      />
      <TrainingReportSummaryInfoCard
        v-bind="getInProgressData"
        background-color="#1173C1"
        :title="labels.InProgress"
        :is-loading="isLoading"
        :icon-src="inProgressIcon"
      />
    </div>
    <div class="training-report-summary-cards__right">
      <TrainingReportSummaryInfoCard
        v-bind="getCompletedTrainingData"
        :title="labels.CompletedTraining"
        :is-loading="isLoading"
        :icon-src="noResponseIcon"
      />
      <TrainingReportSummaryInfoCard
        v-bind="getNoResponseData"
        background-color="#B83A3A"
        :title="labels.NoResponse"
        :is-loading="isLoading"
        :icon-src="helpIcon"
      />
    </div>
  </div>
</template>

<script>
import TrainingReportSummaryInfoCard from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryInfoCard'
import labels from '@/model/constants/labels'
export default {
  name: 'TrainingReportSummaryCards',
  components: { TrainingReportSummaryInfoCard },
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
      noResponseIcon: require('../../../../assets/img/ic-check-box.svg'),
      clickedLinkIcon: require('../../../../assets/img/ic-exclude.svg'),
      inProgressIcon: require('../../../../assets/img/hourglass.svg'),
      helpIcon: require('../../../../assets/img/help.svg')
    }
  },
  computed: {
    getOpenedData() {
      const { openedEmail } = this.items
      return openedEmail ? openedEmail : {}
    },
    getInProgressData() {
      const { inProgress } = this.items
      return inProgress ? inProgress : {}
    },
    getCompletedTrainingData() {
      const { completedTraining } = this.items
      return completedTraining ? completedTraining : {}
    },
    getNoResponseData() {
      const { noResponse } = this.items
      return noResponse ? noResponse : {}
    }
  }
}
</script>
