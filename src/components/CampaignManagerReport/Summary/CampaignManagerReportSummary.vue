<template>
  <div id="campaign-manager-report-summary" class="campaign-manager-report-summary">
    <CampaignManagerReportSummaryHeader />
    <CampaignManagerReportSummaryCards />
    <div class="campaign-manager-report-summary__general-info mt-6">
      <CampaignManagerReportSummaryCampaignInfo />
      <CampaignManagerReportSummarySettings />
    </div>
    <CampaignManagerReportSummaryTargetGroups />
    <div class="campaign-manager-report-summary__general-info mt-4">
      <CampaignManagerReportSummaryScenarioInfo />
      <CampaignManagerReportSummaryScenarioStats />
    </div>
    <CampaignManagerReportSummaryEmail />
    <CampaignManagerReportSummaryLanginPage />
  </div>
</template>

<script>
import CampaignManagerReportSummaryHeader from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryHeader'
import CampaignManagerReportSummaryCards from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryCards'
import CampaignManagerReportSummaryCampaignInfo from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryCampaignInfo'
import CampaignManagerReportSummarySettings from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummarySettings'
import CampaignManagerReportSummaryTargetGroups from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryTargetGroups'
import CampaignManagerReportSummaryScenarioInfo from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryScenarioInfo'
import CampaignManagerReportSummaryScenarioStats from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryScenarioStats'
import CampaignManagerReportSummaryEmail from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryEmail'
import CampaignManagerReportSummaryLanginPage from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryLanginPage'
export default {
  name: 'CampaignManagerReportSummary',
  components: {
    CampaignManagerReportSummaryLanginPage,
    CampaignManagerReportSummaryEmail,
    CampaignManagerReportSummaryScenarioStats,
    CampaignManagerReportSummaryScenarioInfo,
    CampaignManagerReportSummaryTargetGroups,
    CampaignManagerReportSummarySettings,
    CampaignManagerReportSummaryCampaignInfo,
    CampaignManagerReportSummaryCards,
    CampaignManagerReportSummaryHeader
  }
}
</script>

<style lang="scss">
.campaign-manager-report-summary {
  &__general-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .campaign-manager-summary-card__body-item {
    justify-content: space-between;
  }
}
</style>
