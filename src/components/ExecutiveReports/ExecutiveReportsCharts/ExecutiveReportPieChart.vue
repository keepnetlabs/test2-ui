<template>
  <PieChart v-if="chartData" :data="chartData" :chart-options="chartOptions" />
</template>
<script>
import PieChart from '@/components/Common/Charts/Pie.vue'
import labels from '@/model/constants/labels'
export default {
  name: 'ExecutiveReportPieChart',
  components: { PieChart },
  props: {
    rawData: {
      type: Array,
      default: () => []
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
                  text: `${this.chartOptions.labels[index]} (${data} users)`,
                  fillStyle: this.chartOptions.backgroundColor[index],
                  lineWidth: 0,
                  datasetIndex: index
                }
              })
            }
          }
        }
      }
      this.chartOptions = {
        ...chartOptions,
        backgroundColor: [
          '#217124',
          '#43A047',
          '#E6A23C',
          '#FF4433',
          '#913831',
          '#A52A2A',
          '#FF0000',
          '#F56C6C'
        ],
        labels: [
          labels.NoResponse,
          labels.ReportedAsSuspicious,
          labels.OpenedEmail,
          labels.ClickedThePhishingLink,
          labels.OpenedAttachment,
          labels.SubmittedData,
          labels.SubmittedMFACode,
          labels.EmailFailedToSend
        ],
        showTooltipLine: true
      }
      this.chartData = this.rawData
    }
  }
}
</script>
