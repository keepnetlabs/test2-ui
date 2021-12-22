<template>
  <div id="campaign-manager-report-clicked" class="clicked">
    <CampaignManagerReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      @on-close="toggleIsShowResendDialog"
      @on-confirm="resendItem"
    />
    <CampaignManagerReportHeader :title="labels.UserWhoClicked" :subtitle="phishingScenarioName" />
    <CampaignManagerReportClickedItemDetailDialog
      v-if="isShowDetailDialog"
      :item="selectedRow"
      :status="isShowDetailDialog"
      @on-close="toggleShowDetailDialog"
    />
    <CampaignManagerReportClickedTable
      ref="refTable"
      class="mt-6"
      :id="id"
      @on-resend="handleOnResend"
      @on-detail="handleOnDetail"
    />
  </div>
</template>

<script>
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import labels from '@/model/constants/labels'
import CampaignManagerReportClickedTable from '@/components/CampaignManagerReport/Clicked/CampaignManagerReportClickedTable'
import CampaignManagerReportClickedItemDetailDialog from '@/components/CampaignManagerReport/Clicked/CampaignManagerReportClickedItemDetailDialog'
import CampaignManagerReportResendDialog from '@/components/CampaignManagerReport/CampaignManagerReportResendDialog'
import { useResend } from '@/hooks/useResend'
export default {
  name: 'CampaignManagerReportClicked',
  components: {
    CampaignManagerReportResendDialog,
    CampaignManagerReportClickedItemDetailDialog,
    CampaignManagerReportClickedTable,
    CampaignManagerReportHeader
  },
  mixins: [useResend],
  props: {
    id: {
      type: String
    },
    phishingScenarioName: {
      type: String
    }
  },
  data() {
    return {
      labels,
      selectedRow: {},
      isShowDetailDialog: false
    }
  },
  methods: {
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
