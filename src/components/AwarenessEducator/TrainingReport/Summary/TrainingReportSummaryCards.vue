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
        v-bind="getDownloadedData"
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
    <template v-else-if="isTrainingTypeLearningPath">
      <TrainingReportSummaryInfoCard
        v-bind="getOpenedData"
        background-color="#1173C1"
        :title="labels.StartedLearningPath"
        :is-loading="isLoading"
        :icon-src="learningPathStartingIcon"
      >
        <template #userCount>
          <div class="training-report-summary-info-card-body__content mt-4 mb-7">
            <span>{{ getOpenedData.userCount }}</span>
            <span class="ml-1">of {{ totalUserCount }} target users</span>
          </div>
        </template>
        <template #icon>
          <div class="training-report-summary-info-card-body__icon--file-download">
            <img :src="learningPathStartingIcon" alt="icon" />
          </div>
        </template>
      </TrainingReportSummaryInfoCard>
      <TrainingReportSummaryInfoCard
        v-bind="getCompletedTrainingData"
        background-color="#43A047"
        :title="labels.CompletedLearningPath"
        :is-loading="isLoading"
        :icon-src="noResponseIcon"
      >
        <template #userCount>
          <div class="training-report-summary-info-card-body__content mt-4 mb-7">
            <span>{{ getCompletedTrainingData.userCount }}</span>
            <span class="ml-1">of {{ totalUserCount }} target users</span>
          </div>
        </template>
        <template #icon>
          <div style="margin-bottom: -11px; margin-right: -10px;">
            <img :src="noResponseIcon" alt="icon" />
          </div>
        </template>
      </TrainingReportSummaryInfoCard>
    </template>
  </div>
</template>

<script>
import TrainingReportSummaryInfoCard from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryInfoCard'
import labels from '@/model/constants/labels'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
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
    },
    totalUserCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      labels,
      noResponseIcon: require('../../../../assets/img/ic-check-box.svg'),
      openedEmailIcon: require('../../../../assets/img/ic-opened-email.svg'),
      inProgressIcon: require('../../../../assets/img/hourglass.svg'),
      helpIcon: require('../../../../assets/img/help.svg'),
      fileDownloadIcon: require('../../../../assets/img/ic-file-download.svg'),
      learningPathStartingIcon: require('../../../../assets/img/ic-school.svg')
    }
  },
  computed: {
    isTrainingTypePosterOrInfographic() {
      return (
        this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER ||
        this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
      )
    },
    isTrainingTypeLearningPath() {
      return (
        this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
        this.trainingType === TRAINING_LIBRARY_TYPES.LEARNING_PATH
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
    getDownloadedData() {
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
