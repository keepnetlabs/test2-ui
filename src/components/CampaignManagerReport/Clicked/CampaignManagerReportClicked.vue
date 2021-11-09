<template>
  <div id="campaign-manager-report-clicked" class="clicked">
    <CampaignManagerReportHeader :title="labels.UserWhoClicked" :subtitle="labels.ResetPassword" />
    <CampaignManagerReportClickedTable class="mt-6" />
  </div>
</template>

<script>
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import labels from '@/model/constants/labels'
import CampaignManagerReportClickedTable from '@/components/CampaignManagerReport/Clicked/CampaignManagerReportClickedTable'
export default {
  name: 'CampaignManagerReportClicked',
  components: { CampaignManagerReportClickedTable, CampaignManagerReportHeader },
  data() {
    return {
      labels
    }
  }
}
</script>
