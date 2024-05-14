<template>
  <BarChart v-if="chartData.datasets" :chart-data="chartData" :chart-options="chartOptions" />
</template>

<script>
import BarChart from '@/components/Common/Charts/Bar.vue'
import { CHART_COLORS } from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'
import { getDataTableFieldLabel } from '@/utils/functions'
import useTimeUnitLabel from '@/hooks/executive-reports/useTimeUnitLabel'

export default {
  name: 'ExecutiveReportStackedBarChart',
  components: { BarChart },
  mixins: [useTimeUnitLabel],
  props: {
    timeUnit: {
      type: String,
      default: 'month'
    },
    rawData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      chartOptions: {},
      chartData: {}
    }
  },
  watch: {
    timeUnit() {
      this.calculateData()
    }
  },
  created() {
    this.calculateData()
  },
  methods: {
    calculateData() {
      const data = this.rawData.datasets
      const valueEnums = this.rawData.valueEnums
      if (data.length) {
        this.chartOptions = {
          barPercentage: 0.8,
          plugins: {
            datalabels: {
              formatter: function () {
                return ''
              },
              color: '#575757'
            }
          },
          tooltips: {
            callbacks: {
              title: (tooltipItem) => {
                const newDate = new Date(tooltipItem[0].xLabel)
                const months = this.months
                return `${months[newDate.getMonth()]} ${newDate.getFullYear()}`
              }
            },
            backgroundColor: '#6d6d6d',
            displayColors: false
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: this.getTimeUnitLabel()
                },
                stacked: true,
                display: true,
                type: 'time',
                time: {
                  unit: this.timeUnit
                },
                offset: true,
                gridLines: {
                  display: true,
                  color: 'rgba(128, 151, 177, 0.3)',
                  borderDash: [3]
                },
                ticks: {
                  fontColor: 'rgba(176, 186, 201)',
                  lineHeight: 1.58
                }
              }
            ],
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: 'Trends'
                },
                stacked: true,
                offset: true,
                gridLines: {
                  display: true,
                  color: 'rgba(128, 151, 177, 0.3)',
                  borderDash: [3]
                },
                ticks: {
                  labelOffset: 0,
                  beginAtZero: true,
                  padding: -2,
                  fontColor: 'rgba(176, 186, 201)',
                  lineHeight: 1.58
                }
              }
            ]
          },
          legend: {
            display: true,
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
              fontSize: 12
            }
          },
          elements: {
            rectangle: {
              categoryPercentage: 0.5,
              barPercentage: 0.4
            }
          }
        }
        const datasets = []
        for (let itemType of valueEnums) {
          datasets.push({
            label: getDataTableFieldLabel(itemType),
            ...CHART_COLORS[itemType],
            data: this.rawData.datasets.filter((item) => item.result === itemType),
            barThickness: 32
          })
        }
        this.chartData = {
          datasets
        }
      }
    }
  }
}
</script>
