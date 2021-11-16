<template>
  <div id="campaign-manager-report-opened" class="campaign-manager-report-opened">
    <CampaignManagerReportHeader :title="labels.UserWhoOpened" :subtitle="phishingScenarioName" />
    <CampaignManagerReportOpenedItemDetailDialog
      v-if="isShowDetailDialog"
      :status="isShowDetailDialog"
      :item="selectedRow"
      @on-close="toggleShowDetailDialog"
    />
    <CampaignManagerReportOpenedTable
      ref="refOpenedTable"
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
import CampaignManagerReportOpenedTable from '@/components/CampaignManagerReport/Opened/CampaignManagerReportOpenedTable'
import CampaignManagerReportOpenedItemDetailDialog from '@/components/CampaignManagerReport/Opened/CampaignManagerReportOpenedItemDetailDialog'
import { resendPhishingCampaignToUserList } from '@/api/phishingsimulator'
export default {
  name: 'CampaignManagerReportOpened',
  components: {
    CampaignManagerReportOpenedItemDetailDialog,
    CampaignManagerReportOpenedTable,
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
    handleOnResend(payload) {
      resendPhishingCampaignToUserList(payload, this.id).then(() => {
        this.$refs.refOpenedTable.callForData()
      })
    }
  }
}
</script>

<style lang="scss"></style>
