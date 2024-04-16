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
      @on-close="toggleShowDetailDialog"
    />
    <CampaignManagerReportOpenedAttachmentTable
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
import labels from '@/model/constants/labels'
import CampaignManagerReportHeader from '@/components/QuishingCampaignManagerReport/CampaignManagerReportHeader'
import CampaignManagerReportOpenedAttachmentTable from '@/components/QuishingCampaignManagerReport/OpenedAttachment/CampaignManagerReportOpenedAttachmentTable'
import CampaignManagerReportOpenedAttachmentItemDetailDialog from '@/components/QuishingCampaignManagerReport/OpenedAttachment/CampaignManagerReportOpenedAttachmentItemDetailDialog'
import CampaignManagerReportResendDialog from '@/components/QuishingCampaignManagerReport/CampaignManagerReportResendDialog'
import { useResend } from '@/hooks/useQuishingResend'

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
      labels,
      isShowDetailDialog: false,
      selectedRow: null
    }
  },
  methods: {
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
