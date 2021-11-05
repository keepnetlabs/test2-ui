<template>
  <div id="campaign-manager-report-summary" class="campaign-manager-report-summary">
    <CampaignManagerReportSummaryHeader />
    <CampaignManagerReportSummaryCards />
  </div>
</template>

<script>
import CampaignManagerReportSummaryHeader from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryHeader'
import CampaignManagerReportSummaryCards from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryCards'
export default {
  name: 'CampaignManagerReportSummary',
  components: { CampaignManagerReportSummaryCards, CampaignManagerReportSummaryHeader }
}
</script>

<style lang="scss"></style>
