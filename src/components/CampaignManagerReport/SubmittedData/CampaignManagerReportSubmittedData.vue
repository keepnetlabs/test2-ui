<template>
  <div id="campaign-manager-report-submitted-data" class="campaign-manager-report-submitted-data">
    <CampaignManagerReportHeader
      :title="labels.UserWhoSubmitted"
      :subtitle="labels.ResetPassword"
    />
    <CampaignManagerReportSubmittedTable class="mt-6" />
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import CampaignManagerReportSubmittedTable from '@/components/CampaignManagerReport/SubmittedData/CampaignManagerReportSubmittedTable'
export default {
  name: 'CampaignManagerReportSubmittedData',
  components: { CampaignManagerReportSubmittedTable, CampaignManagerReportHeader },
  data() {
    return {
      labels
    }
  }
}
</script>
