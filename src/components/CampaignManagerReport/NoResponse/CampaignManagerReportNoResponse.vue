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
      :title="labels.UserWhoHaventOpened"
      :subtitle="phishingScenarioName"
    />
    <CampaignManagerReportNoResponseTable
      ref="refTable"
      class="mt-6"
      :id="id"
      @on-resend="handleOnResend"
    />
  </div>
</template>

<script>
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import labels from '@/model/constants/labels'
import CampaignManagerReportNoResponseTable from '@/components/CampaignManagerReport/NoResponse/CampaignManagerReportNoResponseTable'
import {
  resendNoResponsePhishingCampaignJob,
  resendPhishingCampaignToUserList
} from '@/api/phishingsimulator'
import CampaignManagerReportResendDialog from '@/components/CampaignManagerReport/CampaignManagerReportResendDialog'
import { useResend } from '@/hooks/useResend'
export default {
  name: 'CampaignManagerReportNoResponse',
  components: {
    CampaignManagerReportResendDialog,
    CampaignManagerReportNoResponseTable,
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
      labels
    }
  }
}
</script>
