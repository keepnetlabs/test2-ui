<template>
  <div id="campaign-manager-report-sending-report" class="campaign-manager-report-sending-report">
    <CampaignManagerReportHeader
      :title="labels.EmailSendingReport"
      :subtitle="phishingScenarioName"
    />
    <CampaignManagerReportSendingReportTable
      ref="refSendingReportTable"
      class="mt-6"
      :id="id"
      :last-sending-status-items="getLastSendingStatusItems"
      @on-resend="handleOnResend"
      @on-detail="handleOnDetail"
    />
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import CampaignManagerReportSendingReportTable from '@/components/CampaignManagerReport/SendingReport/CampaignManagerReportSendingReportTable'
import { resendPhishingCampaignToUserList } from '@/api/phishingsimulator'
export default {
  name: 'CampaignManagerReportSendingReport',
  components: { CampaignManagerReportSendingReportTable, CampaignManagerReportHeader },
  props: {
    id: {
      type: String
    },
    phishingScenarioName: {
      type: String
    },
    formDetails: {
      type: Object
    }
  },
  data() {
    return {
      labels,
      isShowDetailDialog: false,
      selectedRow: null
    }
  },
  computed: {
    getLastSendingStatusItems() {
      return this.formDetails['userStatuses']
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
        this.$refs.refSendingReportTable.callForData()
      })
    }
  }
}
</script>
