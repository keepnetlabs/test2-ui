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
export default {
  name: 'ExecutiveReportDoughnutChart',
  components: { DoughnutChart },
  data() {
    return {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      chartOptions: {
        labels: ['Opened Attachment', 'Clicked'],
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
                  fillStyle: data.datasets[0].backgroundColor[index],
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
      this.chartData = {
        labels: ['Completed', 'Incomplete'],
        datasets: [
          {
            label: 'Completed',
            backgroundColor: ['#43A047', '#E6A23C'],
            data: [10, 20]
          }
        ]
      }
    }
  }
}
</script>
