<template>
  <div id="campaign-manager-report-phishing-report" class="campaign-manager-report-phishing-report">
    <CampaignManagerReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      @on-close="toggleIsShowResendDialog"
      @on-confirm="resendItem"
    />
    <CampaignManagerReportHeader
      title="Users who reported the email"
      subtitle="List of users who reported the callback email via Phishing Reporter add-in"
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
    />
  </div>
</template>

<script>
import CampaignManagerReportHeader from '@/components/CallbackReport/CampaignManagerReportHeader'
import labels from '@/model/constants/labels'
import CampaignManagerReportPhishingReportTable from '@/components/CallbackReport/PhishingReport/CampaignManagerReportPhishingReportTable'
import CampaignManagerReportPhishingReporterItemDetailDialog from '@/components/CallbackReport/PhishingReport/CampaignManagerReportPhishingReporterItemDetailDialog'
import { useResend } from '@/hooks/useCallbackResend'
import CampaignManagerReportResendDialog from '@/components/CallbackReport/CampaignManagerReportResendDialog'
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
