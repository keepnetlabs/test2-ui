<template>
  <div
    id="campaign-manager-report-opened-attachment"
    class="campaign-manager-report-opened-attachment"
  >
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
      :title="labels.UserWhoOpenedAttachment"
      subtitle="List of users who opened the attachment"
    />
    <CampaignManagerReportOpenedAttachmentItemDetailDialog
      v-if="isShowDetailDialog"
      :status="isShowDetailDialog"
      :item="selectedRow"
      :is-show-sandbox-from-parent.sync="isShowSandboxFromParent"
      @on-close="toggleShowDetailDialog"
    />
    <CampaignManagerReportOpenedAttachmentTable
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
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import CampaignManagerReportOpenedAttachmentTable from '@/components/CampaignManagerReport/OpenedAttachment/CampaignManagerReportOpenedAttachmentTable'
import CampaignManagerReportOpenedAttachmentItemDetailDialog from '@/components/CampaignManagerReport/OpenedAttachment/CampaignManagerReportOpenedAttachmentItemDetailDialog'
import CampaignManagerReportResendDialog from '@/components/CampaignManagerReport/CampaignManagerReportResendDialog'
import { useResend } from '@/hooks/useResend'

export default {
  name: 'CampaignManagerReportOpenedAttachment',
  components: {
    CampaignManagerReportResendDialog,
    CampaignManagerReportOpenedAttachmentItemDetailDialog,
    CampaignManagerReportOpenedAttachmentTable,
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
      isShowSandboxFromParent: true,
      selectedRow: null
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
