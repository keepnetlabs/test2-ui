<template>
  <PieChart v-if="chartData" :data="chartData" :chart-options="chartOptions" />
</template>
<script>
import PieChart from '@/components/Common/Charts/Pie.vue'
import labels from '@/model/constants/labels'
import { CHART_COLORS } from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'
export default {
  name: 'ExecutiveReportPieChart',
  components: { PieChart },
  props: {
    rawData: {
      type: Array,
      default: () => []
    },
    valueEnums: {
      type: Array,
      default: () => [
        labels.NoResponse,
        labels.ReportedAsSuspicious,
        labels.OpenedEmail,
        labels.ClickedThePhishingLink,
        labels.OpenedAttachment,
        labels.SubmittedData,
        labels.SubmittedMFACode,
        labels.EmailFailedToSend
      ]
    }
  },
  data() {
    return {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      chartOptions: {},
      chartData: []
    }
  },
  created() {
    this.calculateData()
  },
  methods: {
    calculateData() {
      const chartOptions = {
        showLabels: true,
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          enabled: true
        },
        legend: {
          display: true,
          position: 'right',
          labels: {
            usePointStyle: true,
            color: '#383B41',
            font: 'Open-sans,sans-serif',
            padding: 32,
            fontSize: 12,
            generateLabels: (chart = {}) => {
              const { data } = chart
              return data.datasets[0].data.map((data, index) => {
                return {
                  text: `${data.labels[index]} (${d} users)`,
                  fillStyle: CHART_COLORS[data.labels[index]].backgroundColor,
                  lineWidth: 0,
                  datasetIndex: index
                }
              })
            }
          }
        }
      }
      let backgroundColor = []
      this.valueEnums.forEach((data) => {
        backgroundColor.push(CHART_COLORS[data].backgroundColor)
      })
      this.chartOptions = {
        ...chartOptions,
        backgroundColor,
        labels: this.valueEnums,
        showTooltipLine: true
      }
      this.chartData = this.rawData
    }
  }
}
</script>
