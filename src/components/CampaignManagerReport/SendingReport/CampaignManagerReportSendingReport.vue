<template>
  <div id="campaign-manager-report-sending-report" class="campaign-manager-report-sending-report">
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
      :title="labels.EmailSendingReport"
      subtitle="Phishing email delivery details"
    />
    <CampaignManagerReportSendingReportTable
      ref="refTable"
      class="mt-6"
      :id="id"
      :instance-group="instanceGroup"
      :custom-fields="customFields"
      :last-sending-status-items="getLastSendingStatusItems"
      @on-resend="handleOnResend"
      @on-selection-text-change="handleSelectionChange"
    />
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import CampaignManagerReportSendingReportTable from '@/components/CampaignManagerReport/SendingReport/CampaignManagerReportSendingReportTable'
import CampaignManagerReportResendDialog from '@/components/CampaignManagerReport/CampaignManagerReportResendDialog'
import { useResend } from '@/hooks/useResend'
export default {
  name: 'CampaignManagerReportSendingReport',
  components: {
    CampaignManagerReportResendDialog,
    CampaignManagerReportSendingReportTable,
    CampaignManagerReportHeader
  },
  mixins: [useResend],
  props: {
    id: {
      type: String
    },
    phishingScenarioName: {
      type: String
    },
    instanceGroup: {
      type: [String, Number]
    },
    formDetails: {
      type: Object
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
      selectedRow: null
    }
  },
  computed: {
    getLastSendingStatusItems() {
      return (this.formDetails && this.formDetails.userStatuses) || []
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
    }
  }
}
</script>
