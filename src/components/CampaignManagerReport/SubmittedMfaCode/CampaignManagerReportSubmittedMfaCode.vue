<template>
  <div id="campaign-manager-report-submitted-data" class="campaign-manager-report-submitted-data">
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
      :title="labels.UsersWhoSubmittedTheMfaCode"
      :subtitle="labels.UsersWhoSubmittedTheMfaCodeSub"
    />
    <CampaignManagerReportSubmittedMfaCodeDetailDialog
      v-if="isShowDetailDialog"
      :status="isShowDetailDialog"
      :item="selectedRow"
      @on-close="toggleShowDetailDialog"
    />
    <CampaignManagerReportSubmittedMfaCodeTable
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
import CampaignManagerReportResendDialog from '@/components/CampaignManagerReport/CampaignManagerReportResendDialog'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import CampaignManagerReportSubmittedMfaCodeTable from '@/components/CampaignManagerReport/SubmittedMfaCode/CampaignManagerReportSubmittedMfaCodeTable'
import CampaignManagerReportSubmittedMfaCodeDetailDialog from '@/components/CampaignManagerReport/SubmittedMfaCode/CampaignManagerReportSubmittedMfaCodeDetailDialog'
import { useResend } from '@/hooks/useResend'
import labels from '@/model/constants/labels'

export default {
  name: 'CampaignManagerReportSubmittedMfaCode',
  components: {
    CampaignManagerReportResendDialog,
    CampaignManagerReportHeader,
    CampaignManagerReportSubmittedMfaCodeTable,
    CampaignManagerReportSubmittedMfaCodeDetailDialog
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
      isShowDetailDialog: false,
      selectedRow: {}
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
