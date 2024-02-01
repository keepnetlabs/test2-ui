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
      title="Users who submitted the MFA code"
      subtitle="List of users who submitted the MFA code that is delivered to their phone by SMS."
    />
    <CampaignManagerReportSubmittedItemDetailDialog
      v-if="isShowDetailDialog"
      :status="isShowDetailDialog"
      :item="selectedRow"
      @on-close="toggleShowDetailDialog"
    />
    <CampaignManagerReportSubmittedTable
      ref="refTable"
      class="mt-6"
      :id="id"
      :instance-group="instanceGroup"
      :custom-fields="customFields"
      :password-complexities="getPasswordComplexities"
      @on-resend="handleOnResend"
      @on-detail="handleOnDetail"
    />
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
import CampaignManagerReportHeader from '@/components/SmishingReport/CampaignManagerReportHeader'
import CampaignManagerReportSubmittedTable from '@/components/SmishingReport/SubmittedMFACode/CampaignManagerReportSubmittedMFACodeTable'
import CampaignManagerReportSubmittedItemDetailDialog from '@/components/SmishingReport/SubmittedMFACode/CampaignManagerReportSubmittedMFACodeItemDetailDialog'
import { useSmishingResend } from '@/hooks/useSmishingResend'
import CampaignManagerReportResendDialog from '@/components/SmishingReport/CampaignManagerReportResendDialog'
export default {
  name: 'CampaignManagerReportSubmittedMFACodeData',
  components: {
    CampaignManagerReportResendDialog,
    CampaignManagerReportSubmittedItemDetailDialog,
    CampaignManagerReportSubmittedTable,
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
  computed: {
    getPasswordComplexities() {
      return this?.formDetails?.passwordComplexityTypes || []
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
