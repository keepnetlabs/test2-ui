<template>
  <div id="campaign-manager-report-clicked" class="clicked">
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
      :title="labels.UserWhoClicked"
      subtitle="List of users who clicked the smishing link"
    />
    <CampaignManagerReportClickedItemDetailDialog
      v-if="isShowDetailDialog"
      :item="selectedRow"
      :status="isShowDetailDialog"
      :is-show-sandbox-from-parent="isShowSandboxFromParent"
      @on-close="toggleShowDetailDialog"
    />
    <CampaignManagerReportClickedTable
      ref="refTable"
      class="mt-6"
      :id="id"
      :instance-group="instanceGroup"
      :custom-fields="customFields"
      :is-show-sandbox-from-parent.sync="isShowSandboxFromParent"
      @on-resend="handleOnResend"
      @on-detail="handleOnDetail"
      @on-selection-text-change="handleSelectionChange"
    />
  </div>
</template>

<script>
import CampaignManagerReportHeader from '@/components/SmishingReport/CampaignManagerReportHeader'
import labels from '@/model/constants/labels'
import CampaignManagerReportClickedTable from '@/components/SmishingReport/Clicked/CampaignManagerReportClickedTable'
import CampaignManagerReportClickedItemDetailDialog from '@/components/SmishingReport/Clicked/CampaignManagerReportClickedItemDetailDialog'
import CampaignManagerReportResendDialog from '@/components/SmishingReport/CampaignManagerReportResendDialog'
import { useSmishingResend } from '@/hooks/useSmishingResend'
export default {
  name: 'CampaignManagerReportClicked',
  components: {
    CampaignManagerReportResendDialog,
    CampaignManagerReportClickedItemDetailDialog,
    CampaignManagerReportClickedTable,
    CampaignManagerReportHeader
  },
  mixins: [useSmishingResend],
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
      isShowDetailDialog: false,
      isShowSandboxFromParent: false
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
