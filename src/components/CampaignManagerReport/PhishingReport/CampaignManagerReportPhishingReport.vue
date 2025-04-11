<template>
  <div id="campaign-manager-report-phishing-report" class="campaign-manager-report-phishing-report">
    <CampaignManagerReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      :payload="resendPayload"
      :resendItemCount="resendItemCount"
      @on-close="toggleIsShowResendDialog"
      @on-confirm="resendItem"
    />
    <CampaignManagerReportHeader
      :title="labels.UserWhoReported"
      subtitle="List of users who reported the phishing email via Phishing Reporter add-in"
    />
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
      :instance-group="instanceGroup"
      :custom-fields="customFields"
      @on-resend="handleOnResend"
      @on-detail="handleOnDetail"
      @on-selection-text-change="handleSelectionChange"
    />
  </div>
</template>

<script>
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import labels from '@/model/constants/labels'
import CampaignManagerReportPhishingReportTable from '@/components/CampaignManagerReport/PhishingReport/CampaignManagerReportPhishingReportTable'
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
    instanceGroup: {
      type: [String, Number]
    },
    phishingScenarioName: {
      type: String
    },
    customFields: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      resendItemCount: 0,
      labels,
      selectedRow: {},
      isShowDetailDialog: false
    }
  },
  methods: {
    handleSelectionChange(selectionCount) {
      this.resendItemCount = selectionCount
    },
    handleOnResend(payload) {
      this.resendPayload = payload
      this.toggleIsShowResendDialog()
    },
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
