<template>
  <div id="campaign-manager-report-phishing-report" class="campaign-manager-report-phishing-report">
    <CampaignManagerReportHeader :title="labels.UserWhoReported" :subtitle="phishingScenarioName" />
    <CampaignManagerReportPhishingReporterItemDetailDialog
      v-if="isShowDetailDialog"
      :status="isShowDetailDialog"
      :item="selectedRow"
      @on-close="toggleShowDetailDialog"
    />
    <CampaignManagerReportPhishingReportTable
      ref="refPhishingReportTable"
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
import CampaignManagerReportPhishingReportTable from '@/components/CampaignManagerReport/PhishingReport/CampaignManagerReportPhishingReportTable'
import { resendPhishingCampaignToUserList } from '@/api/phishingsimulator'
import CampaignManagerReportPhishingReporterItemDetailDialog from '@/components/CampaignManagerReport/PhishingReport/CampaignManagerReportPhishingReporterItemDetailDialog'
export default {
  name: 'CampaignManagerReportPhishingReport',
  components: {
    CampaignManagerReportPhishingReporterItemDetailDialog,
    CampaignManagerReportPhishingReportTable,
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
    },
    handleOnResend(payload) {
      resendPhishingCampaignToUserList(payload, this.id).then(() => {
        this.$refs.refPhishingReportTable.callForData()
      })
    }
  }
}
</script>
