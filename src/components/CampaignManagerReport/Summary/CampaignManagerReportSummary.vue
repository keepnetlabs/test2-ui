<template>
  <div id="campaign-manager-report-summary" class="campaign-manager-report-summary">
    <CampaignManagerReportSummaryHeader />
    <CampaignManagerReportSummaryCards />
    <div class="campaign-manager-report-summary__general-info mt-6">
      <CampaignManagerReportSummaryCampaignInfo :items="getCampaignSummaryItems" />
      <CampaignManagerReportSummarySettings />
    </div>
    <CampaignManagerReportSummaryTargetGroups :items="targetGroups" />
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
import { getCampaignJobSummary, getCampaignJobSummaryTargetGroups } from '@/api/phishingsimulator'
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
  },
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      targetGroups: [],
      campaignSummary: {},
      interval: null
    }
  },
  computed: {
    getCampaignSummaryItems() {
      const { campaignInfo = {} } = this.campaignSummary
      const { startDate, endDate, totalTargetUserCount, emailNotDeliveredUserCount } = campaignInfo
      return {
        'Start Date': startDate,
        'End Date': endDate,
        'Total Target Users': totalTargetUserCount,
        'Not Delivered': emailNotDeliveredUserCount || 0
      }
    }
  },
  created() {
    this.callForData()
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    callForData() {
      this.callApis()
      this.interval = setInterval(() => {
        this.callApis()
      }, 15000)
    },
    callApis() {
      getCampaignJobSummary(this.id).then((response) => {
        this.campaignSummary = response?.data?.data
      })
      getCampaignJobSummaryTargetGroups(this.id).then((response) => {
        this.targetGroups = response?.data?.data?.groups
      })
    }
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
