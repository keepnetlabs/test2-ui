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
        Summary of this phishing campaign
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
      <v-tooltip :disabled="!campaignDurationExpired()" nudge-top="16" bottom opacity="1">
        <template #activator="{ on }">
          <div v-on="on">
            <VBtn
              id="btn-resend-campaign--campaign-reports"
              class="campaign-manager-report-summary-header__btn-resend-campaign btn-resend-campaign ml-2"
              rounded
              color="#2196f3"
              @click="toggleShowResendDialog"
              :disabled="campaignDurationExpired()"
              >{{ labels.ResendCampaign }}</VBtn
            >
          </div>
        </template>
        <span class="tooltip-span">
          You cannot resend this campaign because its lifetime has expired
        </span>
      </v-tooltip>
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
import CampaignManagerReportSummaryResendDialog from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryResendDialog'
import { exportPhishingCampaignJob, resendPhishingCampaignToUsers } from '@/api/phishingsimulator'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import CampaignManagerReportTrainingReportsDialog from '@/components/CampaignManagerReport/CampaignManagerReportTrainingReportsDialog.vue'

export default {
  name: 'CampaignManagerReportSummaryHeader',
  components: {
    CampaignManagerReportTrainingReportsDialog,
    CampaignManagerReportSummaryResendDialog
  },
  inject: {
    campaignDurationExpired: {
      type: Function
    }
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
      resendPhishingCampaignToUsers({ Types: types }, this.id, this.instanceGroup).finally(() => {
        this.isActionButtonDisabled = false
        this.toggleShowResendDialog()
      })
    },
    handleDownloadReport() {
      this.isDownloadReportDisabled = true
      exportPhishingCampaignJob(this.id, this.instanceGroup)
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
      else {
        if (!this.trainingReportDialogItems.length) return
        window.open(
          `/awareness-educator/enrollments/training-report/${this.trainingReportDialogItems[0].enrollmentId}`
        )
      }
    },
    toggleShowTrainingReportsDialog() {
      this.isShowTrainingReportsDialog = !this.isShowTrainingReportsDialog
    }
  }
}
</script>
