<template>
  <CampaignManagerSummaryCard
    class="campaign-manager-report-summary-scenario-stats ml-4"
    icon="mdi-equalizer"
    :title="labels.ScenarioStats"
  >
    <template #body>
      <div style="background-color: #fafafa;">
        <div class="campaign-manager-report-summary-scenario-stats__chart-container">
          <Pie :chart-options="chartOptions" :data="chartData" />
        </div>
      </div>
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import Pie from '@/components/Common/Charts/Pie'
export default {
  name: 'CampaignManagerReportSummaryScenarioStats',
  components: { Pie, CampaignManagerSummaryCard },
  data() {
    return {
      labels,
      chartOptions: {
        showLabels: true,
        plugins: {
          datalabels: {
            formatter: function (value) {
              return value
            },
            color: '#575757'
          }
        },
        legend: {
          display: true,
          position: 'right',
          labels: {
            usePointStyle: true,
            fontColor: '#757575',
            fontFamily: 'Open-sans,sans-serif',
            padding: 16,
            fontSize: 12
          }
        },
        backgroundColor: ['#3f51b5', '#00bcd4'],
        tooltips: {
          enabled: true
        },
        labels: ['Gürkan', 'Sara'],
        showTooltipLine: true
      },
      chartData: [10, 20]
    }
  }
}
</script>

<style lang="scss">
.campaign-manager-report-summary-scenario-stats {
  &__chart {
    &-container {
      max-width: 300px;
      margin: 0 auto;
      max-height: 300px;
    }
  }
}
</style>
