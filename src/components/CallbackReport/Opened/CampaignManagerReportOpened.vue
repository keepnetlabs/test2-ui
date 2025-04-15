<template>
  <div id="campaign-manager-report-opened" class="campaign-manager-report-opened">
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
      :title="labels.UserWhoOpened"
      subtitle="List of users who opened the email but didn’t call the phone number "
    />
    <CampaignManagerReportOpenedItemDetailDialog
      v-if="isShowDetailDialog"
      :status="isShowDetailDialog"
      :item="selectedRow"
      :is-show-sandbox-from-parent="isShowSandboxFromParent"
      @on-close="toggleShowDetailDialog"
    />
    <CampaignManagerReportOpenedTable
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
import labels from '@/model/constants/labels'
import CampaignManagerReportHeader from '@/components/CallbackReport/CampaignManagerReportHeader'
import CampaignManagerReportOpenedTable from '@/components/CallbackReport/Opened/CampaignManagerReportOpenedTable'
import CampaignManagerReportOpenedItemDetailDialog from '@/components/CallbackReport/Opened/CampaignManagerReportOpenedItemDetailDialog'
import CampaignManagerReportResendDialog from '@/components/CallbackReport/CampaignManagerReportResendDialog'
import { useResend } from '@/hooks/useCallbackResend'
export default {
  name: 'CallbackReportOpened',
  components: {
    CampaignManagerReportResendDialog,
    CampaignManagerReportOpenedItemDetailDialog,
    CampaignManagerReportOpenedTable,
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
      isShowDetailDialog: false,
      isShowSandboxFromParent: false,
      selectedRow: null
    }
  },
  methods: {
    handleSelectionChange(selectionCount) {
      this.resendItemCount = selectionCount
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
