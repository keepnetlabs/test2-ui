<template>
  <div id="campaign-manager-report-submitted-data" class="campaign-manager-report-submitted-data">
    <CampaignManagerReportHeader
      :title="labels.UserWhoSubmitted"
      :subtitle="phishingScenarioName"
    />
    <CampaignManagerReportSubmittedtemDetailDialog
      v-if="isShowDetailDialog"
      :status="isShowDetailDialog"
      :item="selectedRow"
    />
    <CampaignManagerReportSubmittedTable
      class="mt-6"
      :id="id"
      @on-resend="handleOnResend"
      @on-detail="handleOnDetail"
    />
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import CampaignManagerReportSubmittedTable from '@/components/CampaignManagerReport/SubmittedData/CampaignManagerReportSubmittedTable'
import CampaignManagerReportSubmittedtemDetailDialog from '@/components/CampaignManagerReport/SubmittedData/CampaignManagerReportSubmittedtemDetailDialog'
export default {
  name: 'CampaignManagerReportSubmittedData',
  components: {
    CampaignManagerReportSubmittedtemDetailDialog,
    CampaignManagerReportSubmittedTable,
    CampaignManagerReportHeader
  },
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
      isShowDetailDialog: false,
      selectedRow: null
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
