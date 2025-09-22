<template>
  <div
    id="training-report-summary-cards"
    class="training-report-summary-cards scorm-proxy-report-summary-cards"
  >
    <TrainingReportSummaryInfoCard
      v-bind="getInProgressData"
      background-color="#1173C1"
      :title="labels.InProgress"
      :is-loading="isLoading"
      :icon-src="inProgressIcon"
    />
    <TrainingReportSummaryInfoCard
      v-bind="getCompletedTrainingData"
      background-color="#43A047"
      :title="isSurvey ? labels.CompletedSurvey : labels.CompletedTraining"
      :is-loading="isLoading"
      :icon-src="noResponseIcon"
    />
  </div>
</template>

<script>
import TrainingReportSummaryInfoCard from '@/components/ScormProxyReport/Summary/TrainingReportSummaryInfoCard'
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
    },
    isSurvey: {
      type: Boolean
    }
  },
  data() {
    return {
      labels,
      noResponseIcon: require('../../../assets/img/ic-check-box.svg'),
      inProgressIcon: require('../../../assets/img/hourglass.svg')
    }
  },
  computed: {
    getInProgressData() {
      return this?.items?.inProgress ?? {}
    },
    getCompletedTrainingData() {
      return this?.items?.completedTraining ?? {}
    }
  }
}
</script>
