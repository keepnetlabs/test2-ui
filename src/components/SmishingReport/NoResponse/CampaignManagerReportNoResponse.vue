<template>
  <div id="campaign-manager-report-no-response" class="campaign-manager-report-no-response">
    <CampaignManagerReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      @on-close="toggleIsShowResendDialog"
      @on-confirm="resendItem"
    />
    <CampaignManagerReportHeader
      title="Users who don't reply to messages"
      subtitle="List of users who had no interaction with the smishing"
    />
    <CampaignManagerReportNoResponseTable
      ref="refTable"
      class="mt-6"
      :id="id"
      :instance-group="instanceGroup"
      @on-resend="handleOnResend"
    />
  </div>
</template>

<script>
import CampaignManagerReportHeader from '@/components/SmishingReport/CampaignManagerReportHeader'
import labels from '@/model/constants/labels'
import CampaignManagerReportNoResponseTable from '@/components/SmishingReport/NoResponse/CampaignManagerReportNoResponseTable'
import CampaignManagerReportResendDialog from '@/components/SmishingReport/CampaignManagerReportResendDialog'
import { useSmishingResend } from '@/hooks/useSmishingResend'
export default {
  name: 'CampaignManagerReportNoResponse',
  components: {
    CampaignManagerReportResendDialog,
    CampaignManagerReportNoResponseTable,
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
    }
  },
  data() {
    return {
      labels
    }
  }
}
</script>
