<template>
  <CampaignManagerSummaryCard
    class="campaign-manager-report-summary-scenario-stats ml-4"
    icon="mdi-equalizer"
    :title="labels.ScenarioStats"
  >
    <template #body>
      <div style="background-color: #fafafa; overflow: hidden;">
        <div class="campaign-manager-report-summary-scenario-stats__chart-container">
          <Pie v-if="chartData.length" :chart-options="chartOptions" :data="chartData" />
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
  props: {
    chartData: {
      type: Array
    },
    chartLabels: {
      type: Array
    }
  },
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
            font: 'Open-sans,sans-serif',
            padding: 16,
            fontSize: 12,
            generateLabels: (chart) => {
              const { data } = chart
              return data.datasets[0].data.map((data, index) => {
                return {
                  text: `${this.chartLabels[index]} - ${data}`,
                  fillStyle: this.chartOptions.backgroundColor[index],
                  fontColor: '#383B41',
                  lineWidth: 0
                }
              })
            }
          }
        },
        backgroundColor: ['#E6A23C', '#B6791D', '#B83A3A', '#43A047', '#F56C6C'],
        tooltips: {
          enabled: true
        },
        labels: this.chartLabels,
        showTooltipLine: true
      }
    }
  }
}
</script>

<style lang="scss">
.campaign-manager-report-summary-scenario-stats {
  &__chart {
    &-container {
      max-width: 350px;
      margin: -60px auto;
      max-height: 350px;
    }
  }
}
</style>
