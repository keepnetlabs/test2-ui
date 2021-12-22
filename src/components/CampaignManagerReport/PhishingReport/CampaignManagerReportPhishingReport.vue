<template>
  <div id="campaign-manager-report-phishing-report" class="campaign-manager-report-phishing-report">
    <CampaignManagerReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      @on-close="toggleIsShowResendDialog"
      @on-confirm="resendItem"
    />
    <CampaignManagerReportHeader :title="labels.UserWhoReported" :subtitle="phishingScenarioName" />
    <CampaignManagerReportPhishingReporterItemDetailDialog
      v-if="isShowDetailDialog"
      :status="isShowDetailDialog"
      :item="selectedRow"
      @on-close="toggleShowDetailDialog"
    />
    <CampaignManagerReportPhishingReportTable
      ref="refTable"
      class="mt-6"
      :id="id"
      @on-resend="handleOnResend"
      @on-detail="handleOnDetail"
    />
  </div>
</template>

<script>
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import labels from '@/model/constants/labels'
import CampaignManagerReportPhishingReportTable from '@/components/CampaignManagerReport/PhishingReport/CampaignManagerReportPhishingReportTable'
import { resendPhishingCampaignToUserList } from '@/api/phishingsimulator'
import CampaignManagerReportPhishingReporterItemDetailDialog from '@/components/CampaignManagerReport/PhishingReport/CampaignManagerReportPhishingReporterItemDetailDialog'
import { useResend } from '@/hooks/useResend'
import CampaignManagerReportResendDialog from '@/components/CampaignManagerReport/CampaignManagerReportResendDialog'
export default {
  name: 'CampaignManagerReportPhishingReport',
  components: {
    CampaignManagerReportResendDialog,
    CampaignManagerReportPhishingReporterItemDetailDialog,
    CampaignManagerReportPhishingReportTable,
    CampaignManagerReportHeader
  },
  mixins: [useResend],
  props: {
    id: {
      type: String
    },
    phishingScenarioName: {
      type: String
    }
  },
  data() {
    return {
      labels,
      selectedRow: {},
      isShowDetailDialog: false
    }
  },
  methods: {
    handleOnDetail(row = {}) {
      this.selectedRow = row
      this.toggleShowDetailDialog()
    },
    toggleShowDetailDialog() {
      if (this.isShowDetailDialog) this.selectedRow = null
      this.isShowDetailDialog = !this.isShowDetailDialog
    }
  }
}
</script>
