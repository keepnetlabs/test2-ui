<template>
  <div id="campaign-manager-report-no-response" class="campaign-manager-report-no-response">
    <CampaignManagerReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      :payload="resendPayload"
      @on-close="toggleIsShowResendDialog"
      @on-confirm="resendItem"
    />
    <CampaignManagerReportHeader
      :title="labels.UserWhoHaventOpened"
      subtitle="List of users who had no interaction with the quishing email"
    />
    <CampaignManagerReportNoResponseTable
      ref="refTable"
      class="mt-6"
      :id="id"
      :instance-group="instanceGroup"
      :custom-fields="customFields"
      @on-resend="handleOnResend"
    />
  </div>
</template>

<script>
import CampaignManagerReportHeader from '@/components/QuishingCampaignManagerReport/CampaignManagerReportHeader'
import labels from '@/model/constants/labels'
import CampaignManagerReportNoResponseTable from '@/components/QuishingCampaignManagerReport/NoResponse/CampaignManagerReportNoResponseTable'
import CampaignManagerReportResendDialog from '@/components/QuishingCampaignManagerReport/CampaignManagerReportResendDialog'
import { useResend } from '@/hooks/useQuishingResend'
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
    instanceGroup: {
      type: [String, Number]
    },
    phishingScenarioName: {
      type: String
    },
    customFields: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      labels
    }
  },
  methods: {
    handleOnResend(payload) {
      this.resendPayload = payload
      this.toggleIsShowResendDialog()
    }
  }
}
</script>
