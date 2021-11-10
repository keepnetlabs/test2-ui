<template>
  <div id="campaign-manager-report-no-response" class="campaign-manager-report-no-response">
    <CampaignManagerReportHeader
      :title="labels.UserWhoHaventOpened"
      :subtitle="labels.ResetPassword"
    />
    <CampaignManagerReportNoResponseTable class="mt-6" @on-resend="handleOnResend" />
  </div>
</template>

<script>
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import labels from '@/model/constants/labels'
import CampaignManagerReportNoResponseTable from '@/components/CampaignManagerReport/NoResponse/CampaignManagerReportNoResponseTable'
export default {
  name: 'CampaignManagerReportNoResponse',
  components: { CampaignManagerReportNoResponseTable, CampaignManagerReportHeader },
  data() {
    return {
      labels
    }
  },
  methods: {
    handleOnResend(row = {}) {}
  }
}
</script>
