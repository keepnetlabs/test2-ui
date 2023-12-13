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
    <CampaignManagerReportTrainingReportsDialog
      v-if="isShowTrainingReportsDialog"
      :status="isShowTrainingReportsDialog"
      :table-data="trainingReportDialogItems"
      @on-close="toggleShowTrainingReportsDialog"
    />
    <div class="campaign-manager-report-summary-header__left">
      <div class="campaign-manager-report-summary-header__title">
        {{ labels.CampaignSummary }}
      </div>
      <div class="campaign-manager-report-summary-header__subtitle">
        Summary of this quishing campaign
      </div>
    </div>
    <div class="campaign-manager-report-summary-header__right">
      <VBtn
        id="btn-download-report--campaign-reports"
        class="campaign-manager-report-summary-header__btn-download-report"
        rounded
        outlined
        color="#2196f3"
        :disabled="isDownloadReportDisabled"
        @click="handleDownloadReport"
        >{{ labels.DownloadReport }}</VBtn
      >
      <VBtn
        v-if="isShowResendDialogButton"
        id="btn-resend-campaign--campaign-reports"
        class="campaign-manager-report-summary-header__btn-resend-campaign ml-2"
        rounded
        color="#2196f3"
        @click="toggleShowResendDialog"
        >{{ labels.ResendCampaign }}</VBtn
      >
      <VBtn
        v-if="isShowTrainingReportButton"
        id="btn-training-report--campaign-reports"
        class="campaign-manager-report-summary-header__btn-resend-campaign ml-2"
        rounded
        color="#2196f3"
        @click="handleTrainingReport"
        >{{ getTrainingReportLabel }}
        <VIcon v-if="!isMultipleTrainingReport" class="ml-2" style="font-size: 20px;"
          >mdi-open-in-new</VIcon
        >
      </VBtn>
    </div>
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
import CampaignManagerReportSummaryResendDialog from '@/components/QuishingCampaignManagerReport/Summary/CampaignManagerReportSummaryResendDialog'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import CampaignManagerReportTrainingReportsDialog from '@/components/QuishingCampaignManagerReport/CampaignManagerReportTrainingReportsDialog.vue'
import QuishingService from '@/api/quishing'
export default {
  name: 'CampaignManagerReportSummaryHeader',
  components: {
    CampaignManagerReportTrainingReportsDialog,
    CampaignManagerReportSummaryResendDialog
  },
  props: {
    phishingScenarioName: {
      type: String
    },
    resendDialogItems: {
      type: Object
    },
    id: {
      type: String
    },
    instanceGroup: {
      type: [String, Number]
    },
    isMultipleTrainingReport: {
      type: Boolean,
      default: false
    },
    isShowTrainingReportButton: {
      type: Boolean,
      default: true
    },
    isShowResendDialogButton: {
      type: Boolean,
      default: true
    },
    trainingInfos: {
      type: Array,
      default: () => []
    },
    trainingReportDialogItems: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      labels,
      isActionButtonDisabled: false,
      isShowResendDialog: false,
      isShowTrainingReportsDialog: false,
      isDownloadReportDisabled: false
    }
  },
  computed: {
    getTrainingReportLabel() {
      return this.isMultipleTrainingReport ? labels.TrainingReports : labels.TrainingReport
    }
  },
  methods: {
    toggleShowResendDialog() {
      this.isShowResendDialog = !this.isShowResendDialog
    },
    handleOnConfirmResend(types) {
      this.isActionButtonDisabled = true
      QuishingService.resendQuishingCampaignToUsers(
        { Types: types },
        this.id,
        this.instanceGroup
      ).finally(() => {
        this.isActionButtonDisabled = false
        this.toggleShowResendDialog()
      })
    },
    handleDownloadReport() {
      this.isDownloadReportDisabled = true
      QuishingService.exportQuishingCampaignJob(this.id, this.instanceGroup)
        .then((response) => {
          const { data } = response
          if (response.status === 200) {
            const blob = new Blob([data])
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = `Campaign-Manager-Report.xlsx`
            link.click()
          } else if (response.status === 201) {
            this.$store.dispatch('common/createSnackBar', {
              message: 'Campaign report will be generated',
              ...COMMON_SNACKBAR
            })
          } else if (response.status === 202) {
            this.$store.dispatch('common/createSnackBar', {
              message: 'Campaign report is being generated',
              ...COMMON_SNACKBAR
            })
          }
        })
        .finally(() => (this.isDownloadReportDisabled = false))
    },
    handleTrainingReport() {
      if (this.isMultipleTrainingReport) this.toggleShowTrainingReportsDialog()
      else
        window.open(
          `/awareness-educator/enrollments/training-report/${this.trainingReportDialogItems[0].enrollmentId}`
        )
    },
    toggleShowTrainingReportsDialog() {
      this.isShowTrainingReportsDialog = !this.isShowTrainingReportsDialog
    }
  }
}
</script>
