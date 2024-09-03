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
    <CampaignManagerReportHeader :title="labels.EmailSendingReport" :subtitle="getReportSubtitle" />
    <CampaignManagerReportSendingReportTable
      ref="refTable"
      class="mt-6"
      :id="id"
      :instance-group="instanceGroup"
      :custom-fields="customFields"
      :last-sending-status-items="getLastSendingStatusItems"
      :is-quishing-type-printout="isQuishingTypePrintout"
      @on-resend="handleOnResend"
      @on-selection-text-change="handleSelectionChange"
    />
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
import CampaignManagerReportHeader from '@/components/QuishingCampaignManagerReport/CampaignManagerReportHeader'
import CampaignManagerReportSendingReportTable from '@/components/QuishingCampaignManagerReport/SendingReport/CampaignManagerReportSendingReportTable'
import CampaignManagerReportResendDialog from '@/components/QuishingCampaignManagerReport/CampaignManagerReportResendDialog'
import { useResend } from '@/hooks/useQuishingResend'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
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
    },
    apiResponse: {
      type: Object
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
    getReportSubtitle() {
      return this.isQuishingTypePrintout
        ? 'Quishing delivery details'
        : 'Quishing email delivery details'
    },
    getLastSendingStatusItems() {
      return this?.formDetails?.userStatuses || []
    },
    isQuishingTypePrintout() {
      return (
        this?.apiResponse?.data?.data?.scenarios?.[0]?.scenarioInfo?.templateType?.toLowerCase() ===
        QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
      )
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
