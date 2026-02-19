<template>
  <div class="training-report-summary-header">
    <TrainingReportSummaryResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :items="resendDialogItems"
      :trainingName="trainingName"
      :is-action-button-disabled="isActionButtonDisabled"
      :is-survey="isSurvey"
      @on-close="toggleShowResendDialog"
      @on-confirm="handleOnConfirmResend"
    />
    <div class="training-report-summary-header__left">
      <div class="training-report-summary-header__title">
        {{ isSurvey ? labels.SurveySummary : labels.TrainingSummary }}
      </div>
      <div class="training-report-summary-header__subtitle">
        {{ isSurvey ? labels.SurveySummarySub : labels.TrainingSummarySub }}
      </div>
    </div>
    <div class="training-report-summary-header__right">
      <v-btn
        v-if="!isLoading && !isScormProxy"
        class="training-report-summary-header__btn-resend-campaign ml-2"
        rounded
        color="#2196f3"
        @click="toggleShowResendDialog"
        >{{ isSurvey ? labels.ResendSurvey : labels.ResendTraining }}</v-btn
      >
    </div>
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
import TrainingReportSummaryResendDialog from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryResendDialog'
import AwarenessEducatorService from '@/api/awarenessEducator'
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
    isSurvey: {
      type: Boolean
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
            link.download = `${this.isSurvey ? 'Survey' : 'Training'}-Report.xlsx`
            link.click()
          } else if (response.status === 201) {
            this.$store.dispatch('common/createSnackBar', {
              message: `${this.isSurvey ? 'Survey' : 'Training'} report will be generated`,
              ...COMMON_SNACKBAR
            })
          } else if (response.status === 202) {
            this.$store.dispatch('common/createSnackBar', {
              message: `${this.isSurvey ? 'Survey' : 'Training'} report is being generated`,
              ...COMMON_SNACKBAR
            })
          }
        })
        .finally(() => (this.isDownloadReportDisabled = false))
    }
  }
}
</script>
