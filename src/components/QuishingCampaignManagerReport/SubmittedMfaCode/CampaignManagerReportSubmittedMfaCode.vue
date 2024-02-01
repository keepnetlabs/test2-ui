<template>
  <div id="campaign-manager-report-submitted-data" class="campaign-manager-report-submitted-data">
    <CampaignManagerReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      :payload="resendPayload"
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
    />
  </div>
</template>

<script>
import CampaignManagerReportResendDialog from '@/components/QuishingCampaignManagerReport/CampaignManagerReportResendDialog'
import CampaignManagerReportHeader from '@/components/QuishingCampaignManagerReport/CampaignManagerReportHeader'
import CampaignManagerReportSubmittedMfaCodeTable from '@/components/QuishingCampaignManagerReport/SubmittedMfaCode/CampaignManagerReportSubmittedMfaCodeTable'
import CampaignManagerReportSubmittedMfaCodeDetailDialog from '@/components/QuishingCampaignManagerReport/SubmittedMfaCode/CampaignManagerReportSubmittedMfaCodeDetailDialog'
import { useResend } from '@/hooks/useQuishingResend'
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
      labels,
      isShowDetailDialog: false,
      selectedRow: {}
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
