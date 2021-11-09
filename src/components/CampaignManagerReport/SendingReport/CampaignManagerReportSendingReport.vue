<template>
  <div id="campaign-manager-report-sending-report" class="campaign-manager-report-sending-report">
    <CampaignManagerReportHeader
      :title="labels.EmailSendingReport"
      :subtitle="labels.ResetPassword"
    />
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
export default {
  name: 'CampaignManagerReportSendingReport',
  components: { CampaignManagerReportHeader },
  data() {
    return {
      labels
    }
  }
}
</script>
