import { mdiConsoleNetworkOutline } from '@mdi/js'
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
    <div class="campaign-manager-report-summary-header__left">
      <div class="campaign-manager-report-summary-header__title">
        {{ labels.CampaignSummary }}
      </div>
      <div class="campaign-manager-report-summary-header__subtitle">
        Summary of this callback campaign
      </div>
    </div>
    <div class="campaign-manager-report-summary-header__right">
      <v-btn
        id="btn-download-report--campaign-reports"
        class="campaign-manager-report-summary-header__btn-download-report"
        rounded
        outlined
        color="#2196f3"
        :disabled="isDownloadReportDisabled"
        @click="handleDownloadReport"
        >{{ labels.DownloadReport }}</v-btn
      >
      <v-tooltip :disabled="!campaignDurationExpired()" nudge-top="16" bottom opacity="1">
        <template #activator="{ on }">
          <div v-on="on">
            <v-btn
              id="btn-resend-campaign--campaign-reports"
              class="campaign-manager-report-summary-header__btn-resend-campaign ml-2"
              rounded
              color="#2196f3"
              @click="toggleShowResendDialog"
              :disabled="campaignDurationExpired()"
              >{{ labels.ResendCampaign }}</v-btn
            >
          </div>
        </template>
        <span class="tooltip-span">
          You cannot resend this campaign because its lifetime has expired
        </span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
import CampaignManagerReportSummaryResendDialog from '@/components/CallbackReport/Summary/CampaignManagerReportSummaryResendDialog'
import CallbackService from '@/api/callback'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export default {
  name: 'CampaignManagerReportSummaryHeader',
  components: { CampaignManagerReportSummaryResendDialog },
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
    }
  },
  inject: {
    campaignDurationExpired: {
      type: Function
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
      CallbackService.resendCampaignToUsersList(this.id, this.instanceGroup, {
        Types: types
      }).finally(() => {
        this.isActionButtonDisabled = false
        this.toggleShowResendDialog()
      })
    },
    handleDownloadReport() {
      this.isDownloadReportDisabled = true
      CallbackService.exportCampaignReport(this.id, this.instanceGroup)
        .then((response) => {
          const { data } = response
          if (response.status === 200) {
            const blob = new Blob([data])
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = `Callback-Report.xlsx`
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
    }
  }
}
</script>
