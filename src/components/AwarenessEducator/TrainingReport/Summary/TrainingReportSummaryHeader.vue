<template>
  <VSkeletonLoader type="list-item" :loading="isLoading">
    <div class="training-report-summary-header">
      <TrainingReportSummaryResendDialog
        v-if="isShowResendDialog"
        :status="isShowResendDialog"
        :items="resendDialogItems"
        :trainingName="trainingName"
        :is-action-button-disabled="isActionButtonDisabled"
        :title="getResendButtonText"
        :training-type="trainingType"
        @on-close="toggleShowResendDialog"
        @on-confirm="handleOnConfirmResend"
      />
      <div class="training-report-summary-header__left">
        <div class="training-report-summary-header__title">
          {{ getTitle }}
        </div>
        <div class="training-report-summary-header__subtitle">
          {{ getSubtitle }}
        </div>
      </div>
      <div class="training-report-summary-header__right">
        <v-btn
          v-if="!isLearningPath"
          class="training-report-summary-header__btn-download-report"
          rounded
          outlined
          color="#2196f3"
          :disabled="isDownloadReportDisabled"
          @click="handleDownloadReport"
          >{{ labels.DownloadReport }}</v-btn
        >
        <v-btn
          v-if="!isLoading && !isScormProxy && !isLearningPath"
          class="training-report-summary-header__btn-resend-campaign ml-2"
          rounded
          color="#2196f3"
          @click="toggleShowResendDialog"
          >{{ getResendButtonText }}</v-btn
        >
      </div>
    </div>
  </VSkeletonLoader>
</template>

<script>
import labels from '@/model/constants/labels'
import TrainingReportSummaryResendDialog from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryResendDialog'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export default {
  name: 'TrainingReportSummaryHeader',
  components: { TrainingReportSummaryResendDialog },
  props: {
    trainingName: {
      type: String
    },
    resendDialogItems: {
      type: Object
    },
    id: {
      type: String
    },
    isLoading: {
      type: Boolean
    },
    isScormProxy: {
      type: Boolean
    },
    trainingType: {
      type: String
    }
  },
  data() {
    return {
      labels,
      isActionButtonDisabled: false,
      isShowResendDialog: false,
      isDownloadReportDisabled: false
    }
  },
  computed: {
    getTitle() {
      if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) return labels.PosterSummary
      else if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC)
        return labels.InfographicSummary
      else if (
        this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
        this.trainingType === TRAINING_LIBRARY_TYPES.LEARNING_PATH
      )
        return labels.LearningPathSummary
      return labels.TrainingSummary
    },
    getSubtitle() {
      if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER)
        return labels.PosterSummarySub
      else if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC)
        return labels.InfographicSummarySub
      else if (
        this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
        this.trainingType === TRAINING_LIBRARY_TYPES.LEARNING_PATH
      )
        return labels.LearningPathSummarySub
      return labels.TrainingSummarySub
    },
    getResendButtonText() {
      if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) return labels.ResendPoster
      else if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC)
        return labels.ResendInfographic
      else if (
        this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
        this.trainingType === TRAINING_LIBRARY_TYPES.LEARNING_PATH
      )
        return labels.ResendLearningPath
      return labels.ResendTraining
    },
    isLearningPath() {
      return (
        this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
        this.trainingType === TRAINING_LIBRARY_TYPES.LEARNING_PATH
      )
    }
  },
  methods: {
    toggleShowResendDialog() {
      this.isShowResendDialog = !this.isShowResendDialog
    },
    handleOnConfirmResend(types) {
      this.isActionButtonDisabled = true
      AwarenessEducatorService.resendTrainingToUsers({ resendTypes: types }, this.id).finally(
        () => {
          this.isActionButtonDisabled = false
          this.toggleShowResendDialog()
        }
      )
    },
    handleDownloadReport() {
      this.isDownloadReportDisabled = true
      AwarenessEducatorService.exportTrainingReport(this.id)
        .then((response) => {
          const { data } = response
          if (response.status === 200) {
            const blob = new Blob([data])
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = `Training-Material.xlsx`
            link.click()
          } else if (response.status === 201) {
            this.$store.dispatch('common/createSnackBar', {
              message: 'Training report will be generated',
              ...COMMON_SNACKBAR
            })
          } else if (response.status === 202) {
            this.$store.dispatch('common/createSnackBar', {
              message: 'Training report is being generated',
              ...COMMON_SNACKBAR
            })
          }
        })
        .finally(() => (this.isDownloadReportDisabled = false))
    }
  }
}
</script>
