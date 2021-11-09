<template>
  <div id="campaign-manager-report-clicked" class="clicked">
    <CampaignManagerReportHeader :title="labels.UserWhoClicked" :subtitle="labels.ResetPassword" />
    <CampaignManagerReportClickedItemDetailDialog
      v-if="isShowDetailDialog"
      :status="isShowDetailDialog"
    />
    <CampaignManagerReportClickedTable
      class="mt-6"
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
export default {
  name: 'CampaignManagerReportClicked',
  components: {
    CampaignManagerReportClickedItemDetailDialog,
    CampaignManagerReportClickedTable,
    CampaignManagerReportHeader
  },
  data() {
    return {
      labels,
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
    },
    handleOnResend(row = {}) {}
  }
}
</script>
