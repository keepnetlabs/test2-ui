<template>
  <div
    id="training-report-summary-cards"
    :class="[
      'training-report-summary-cards',
      isTrainingTypePosterOrInfographic ? 'training-report-summary-cards--poster' : ''
    ]"
  >
    <template v-if="isTrainingLibraryTypeTraining">
      <div class="training-report-summary-cards__left">
        <TrainingReportSummaryInfoCard
          v-bind="getOpenedData"
          background-color="#B6791D"
          :title="labels.OpenedEmail"
          :is-loading="isLoading"
          :icon-src="openedEmailIcon"
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
          background-color="#43A047"
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
    </template>
    <template v-else-if="isTrainingTypePosterOrInfographic">
      <TrainingReportSummaryInfoCard
        v-bind="getOpenedData"
        background-color="#B6791D"
        :title="labels.OpenedEmail"
        :is-loading="isLoading"
        :icon-src="openedEmailIcon"
      />
      <TrainingReportSummaryInfoCard
        v-bind="getCompletedTrainingData"
        background-color="#43A047"
        :title="labels.Downloaded"
        :is-loading="isLoading"
      >
        <template #icon>
          <div class="training-report-summary-info-card-body__icon--file-download">
            <img :src="fileDownloadIcon" alt="icon" />
          </div>
        </template>
      </TrainingReportSummaryInfoCard>
      <TrainingReportSummaryInfoCard
        v-bind="getNoResponseData"
        background-color="#B83A3A"
        :title="labels.NoResponse"
        :is-loading="isLoading"
        :icon-src="helpIcon"
      />
    </template>
  </div>
</template>

<script>
import TrainingReportSummaryInfoCard from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryInfoCard'
import labels from '@/model/constants/labels'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
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
    trainingType: {
      type: String
    }
  },
  data() {
    return {
      labels,
      noResponseIcon: require('../../../../assets/img/ic-check-box.svg'),
      openedEmailIcon: require('../../../../assets/img/ic-opened-email.svg'),
      inProgressIcon: require('../../../../assets/img/hourglass.svg'),
      helpIcon: require('../../../../assets/img/help.svg'),
      fileDownloadIcon: require('../../../../assets/img/ic-file-download.svg')
    }
  },
  computed: {
    isTrainingTypePosterOrInfographic() {
      return (
        this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER ||
        this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
      )
    },
    isTrainingLibraryTypeTraining() {
      return this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING
    },
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
