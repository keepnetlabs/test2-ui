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
      title="Sending Report"
      subtitle="Callback email delivery details"
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
import CampaignManagerReportHeader from '@/components/CallbackReport/CampaignManagerReportHeader'
import CampaignManagerReportSendingReportTable from '@/components/CallbackReport/SendingReport/CampaignManagerReportSendingReportTable'
import CampaignManagerReportResendDialog from '@/components/CallbackReport/CampaignManagerReportResendDialog'
import { useResend } from '@/hooks/useCallbackResend'
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
      return this?.formDetails?.userStatuses || []
    }
  },
  methods: {
    handleSelectionChange(selectionCount) {
      this.resendItemCount = selectionCount
    },
    handleOnDetail(row = {}) {
      this.selectedRow = row
      this.toggleShowDetailDialog()
    }
  }
}
</script>
