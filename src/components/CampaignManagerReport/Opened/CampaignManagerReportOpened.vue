<template>
  <div id="campaign-manager-report-opened" class="campaign-manager-report-opened">
    <CampaignManagerReportHeader :title="labels.UserWhoOpened" :subtitle="labels.ResetPassword" />
    <CampaignManagerReportOpenedTable class="mt-6" />
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import CampaignManagerReportOpenedTable from '@/components/CampaignManagerReport/Opened/CampaignManagerReportOpenedTable'
export default {
  name: 'CampaignManagerReportOpened',
  components: { CampaignManagerReportOpenedTable, CampaignManagerReportHeader },
  data() {
    return {
      labels
    }
  }
}
</script>

<style lang="scss"></style>
