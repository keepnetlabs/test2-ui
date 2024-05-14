<template>
  <DoughnutChart
    v-if="chartData.datasets"
    :chart-data="chartData"
    :chart-options="chartOptions"
    class="executive-report-doughnut-chart"
  />
</template>
<script>
import DoughnutChart from '@/components/Common/Charts/Doughnut.vue'
import { CHART_COLORS } from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'
export default {
  name: 'ExecutiveReportDoughnutChart',
  components: { DoughnutChart },
  props: {
    rawData: {
      type: Array,
      default: () => []
    },
    valueEnums: {
      type: Array,
      default: () => ['Open Attachment', 'Clicked']
    }
  },
  data() {
    return {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      chartOptions: {
        labels: this.valueEnums,
        cutoutPercentage: 60,
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            color: '#383B41',
            font: 'Open-sans,sans-serif',
            padding: 32,
            fontSize: 12,
            generateLabels: (chart = {}) => {
              const { data } = chart
              return data.datasets[0].data.map((d, index) => {
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
      },
      chartData: {}
    }
  },
  created() {
    this.calculateData()
  },
  mounted() {},
  methods: {
    calculateData() {
      let backgroundColor = []
      this.valueEnums.forEach((label) => {
        backgroundColor.push(CHART_COLORS[label].backgroundColor)
      })
      this.chartData = {
        labels: this.valueEnums,
        datasets: [
          {
            data: this.rawData,
            backgroundColor
          }
        ]
      }
    }
  }
}
</script>
