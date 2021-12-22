<template>
  <div id="campaign-manager-report-opened" class="campaign-manager-report-opened">
    <CampaignManagerReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      @on-close="toggleIsShowResendDialog"
      @on-confirm="resendItem"
    />
    <CampaignManagerReportHeader :title="labels.UserWhoOpened" :subtitle="phishingScenarioName" />
    <CampaignManagerReportOpenedItemDetailDialog
      v-if="isShowDetailDialog"
      :status="isShowDetailDialog"
      :item="selectedRow"
      @on-close="toggleShowDetailDialog"
    />
    <CampaignManagerReportOpenedTable
      ref="refTable"
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
import CampaignManagerReportResendDialog from '@/components/CampaignManagerReport/CampaignManagerReportResendDialog'
import { useResend } from '@/hooks/useResend'
export default {
  name: 'CampaignManagerReportOpened',
  components: {
    CampaignManagerReportResendDialog,
    CampaignManagerReportOpenedItemDetailDialog,
    CampaignManagerReportOpenedTable,
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
    }
  }
}
</script>

<style lang="scss"></style>
