<template>
  <div id="campaign-manager-report-submitted-data" class="campaign-manager-report-submitted-data">
    <CampaignManagerReportHeader
      :title="labels.UserWhoSubmitted"
      :subtitle="phishingScenarioName"
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
      :password-complexities="getPasswordComplexities"
      @on-resend="handleOnResend"
      @on-detail="handleOnDetail"
    />
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import CampaignManagerReportSubmittedTable from '@/components/CampaignManagerReport/SubmittedData/CampaignManagerReportSubmittedTable'
import CampaignManagerReportSubmittedItemDetailDialog from '@/components/CampaignManagerReport/SubmittedData/CampaignManagerReportSubmittedtemDetailDialog'
import { resendSubmittedDataPhishingCampaignJob } from '@/api/phishingsimulator'
export default {
  name: 'CampaignManagerReportSubmittedData',
  components: {
    CampaignManagerReportSubmittedItemDetailDialog,
    CampaignManagerReportSubmittedTable,
    CampaignManagerReportHeader
  },
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
      selectedRow: {}
    }
  },
  computed: {
    getPasswordComplexities() {
      return this.formDetails['passwordComplexityTypes']
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
    handleOnResend(row = {}) {
      resendSubmittedDataPhishingCampaignJob(row.resourceId).then(() => {
        this.$refs.refTable.callForData()
      })
    }
  }
}
</script>
