<template>
  <div id="campaign-manager-report-summary" class="campaign-manager-report-summary">
    <CampaignManagerReportSummaryHeader />
    <CampaignManagerReportSummaryCards />
    <div class="campaign-manager-report-summary__general-info mt-6">
      <CampaignManagerReportSummaryCampaignInfo :items="getCampaignSummaryItems" />
      <CampaignManagerReportSummarySettings :items="getSettingsItems" />
    </div>
    <CampaignManagerReportSummaryTargetGroups :items="targetGroups" />
    <div class="campaign-manager-report-summary__general-info mt-4">
      <CampaignManagerReportSummaryScenarioInfo :items="getScenarioInfoItems" />
      <CampaignManagerReportSummaryScenarioStats
        :chart-data="getChartData"
        :chart-labels="chartLabels"
      />
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
import { difficulties, methods } from '@/components/CampaignManager/CampaignManagerInfo/utils'
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
      interval: null,
      chartLabels: [
        'Opened email',
        'Clicked link',
        'Submitted data',
        'No response',
        'Not delivered'
      ]
    }
  },
  computed: {
    getCampaignSummaryItems() {
      const { campaignInfo = {} } = this.campaignSummary
      const {
        startDate,
        endDate,
        totalTargetUserCount = 0,
        emailDeliveredUserCount = 0
      } = campaignInfo
      return {
        'Start Date': startDate,
        'End Date': endDate,
        'Total Target Users': totalTargetUserCount,
        'Not Delivered': totalTargetUserCount - emailDeliveredUserCount
      }
    },
    getSettingsItems() {
      const { settings = {} } = this.campaignSummary
      const { duration, excludeFromReports, languages, smtpName = 0 } = settings
      return {
        Languages: languages || 'English',
        Duration: `${duration} Day(s)`,
        'Excluded from reports': excludeFromReports ? 'Yes' : 'No',
        SMTP: smtpName
      }
    },
    getScenarioInfoItems() {
      const { scenarioInfo = {} } = this.campaignSummary
      const { name, difficultyTypeId = 1, methodTypeId = 1, languages } = scenarioInfo
      return {
        Name: name,
        Method: methods[methodTypeId - 1].text,
        Difficulty: difficulties[difficultyTypeId - 1].text,
        Languages: languages || 'English'
      }
    },
    getChartData() {
      const { scenarioStats = {} } = this.campaignSummary
      const {
        clickedEmail = 0,
        noResponseEmail = 0,
        notDelivered = 0,
        openedEmail = 0,
        submittedEmail = 0
      } = scenarioStats
      const dataContainer = [
        openedEmail,
        clickedEmail,
        submittedEmail,
        noResponseEmail,
        notDelivered
      ]
      const datasets = []
      this.chartLabels.forEach((item, index) => {
        datasets.push({
          label: item,
          data: dataContainer[index]
        })
      })
      return dataContainer.every((item) => item === 0) ? [] : dataContainer
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
