<template>
  <div id="campaign-manager-report-sending-report" class="campaign-manager-report-sending-report">
    <CampaignManagerReportHeader
      :title="labels.EmailSendingReport"
      :subtitle="phishingScenarioName"
    />
    <CampaignManagerReportSendingReportTable
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
import CampaignManagerReportSendingReportTable from '@/components/CampaignManagerReport/SendingReport/CampaignManagerReportSendingReportTable'
export default {
  name: 'CampaignManagerReportSendingReport',
  components: { CampaignManagerReportSendingReportTable, CampaignManagerReportHeader },
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
