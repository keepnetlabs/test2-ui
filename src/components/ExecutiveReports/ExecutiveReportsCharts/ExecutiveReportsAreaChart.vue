<template>
  <HorizontalBarChart
    v-if="chartData.datasets"
    class="executive-reports-area-chart"
    :chart-data="chartData"
    :chart-options="chartOptions"
  />
</template>

<script>
import HorizontalBarChart from '@/components/Common/Charts/HorizontalBar.vue'

export default {
  name: 'ExecutiveReportsAreaChart',
  components: { HorizontalBarChart },
  props: {
    timeUnit: {
      type: String,
      default: 'month'
    },
    rawData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      chartOptions: {},
      chartData: {}
    }
  },
  created() {
    this.calculateData()
  },
  methods: {
    calculateData() {
      this.chartData = {
        labels: ['Click Only Campaigns'],
        datasets: [
          {
            label: 'Click Only Campaigns',
            data: [50],
            backgroundColor: '#F56C6C',
            borderColor: '#F56C6C',
            barThickness: 32
          },
          {
            label: 'Data Submission Campaigns',
            data: [100],
            backgroundColor: 'blue',
            borderColor: 'blue',
            barThickness: 32
          },
          {
            label: 'MFA Campaigns',
            data: [120],
            backgroundColor: 'pink',
            borderColor: 'pink',
            barThickness: 32
          },
          {
            label: 'Attachment Campaigns',
            data: [70],
            backgroundColor: 'yellow',
            borderColor: 'yellow',
            barThickness: 32
          }
        ]
      }

      this.chartOptions = {
        responsive: true,
        indexAxis: 'y',
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            anchor: 'center', // Anchor the labels to the start of the datapoint
            color: '#fff',
            align: 'center', // Align the text after the anchor point
            formatter: function (value) {
              // Show the label instead of the value
              return value
            }
          }
        },
        tooltips: {
          enabled: false
        },
        scales: {
          xAxes: [
            {
              stacked: true,
              display: false
            }
          ],
          yAxes: [
            {
              display: false,
              stacked: true
            }
          ]
        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            fontColor: '#757575',
            generateLabels(chart = {}) {
              const { data } = chart
              return data.datasets.map((item, index) => {
                return {
                  text: item.label,
                  fillStyle: item.borderColor,
                  lineWidth: 0,
                  datasetIndex: index
                }
              })
            },
            fontFamily: 'Open-sans,sans-serif',
            padding: 16,
            paddingBottom: 0,
            fontSize: 12
          }
        }
      }
    }
  }
}
</script>
