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
    <CampaignManagerReportHeader :title="labels.RepliedTitle" :subtitle="labels.RepliedSub" />
    <CampaignManagerReportRepliedDetailDialog
      v-if="isShowDetailDialog"
      :status="isShowDetailDialog"
      :item="selectedRow"
      @on-close="toggleShowDetailDialog"
    />
    <CampaignManagerReportRepliedTable
      ref="refTable"
      class="mt-6"
      :id="id"
      :instance-group="instanceGroup"
      :custom-fields="customFields"
      :password-complexities="getPasswordComplexities"
      @on-resend="handleOnResend"
      @on-detail="handleOnDetail"
      @on-selection-text-change="handleSelectionChange"
    />
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import { useResend } from '@/hooks/useResend'
import CampaignManagerReportResendDialog from '@/components/CampaignManagerReport/CampaignManagerReportResendDialog'
import CampaignManagerReportRepliedTable from '@/components/CampaignManagerReport/Replied/CampaignManagerReportRepliedTable.vue'
import CampaignManagerReportRepliedDetailDialog from '@/components/CampaignManagerReport/Replied/CampaignManagerReportRepliedDetailDialog.vue'
export default {
  name: 'CampaignManagerReportReplied',
  components: {
    CampaignManagerReportRepliedDetailDialog,
    CampaignManagerReportRepliedTable,
    CampaignManagerReportResendDialog,
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
  computed: {
    getPasswordComplexities() {
      return this?.formDetails?.passwordComplexityTypes || []
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
