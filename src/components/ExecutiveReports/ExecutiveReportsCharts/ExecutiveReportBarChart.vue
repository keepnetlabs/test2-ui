<template>
  <BarChart v-if="chartData.datasets" :chart-data="chartData" :chart-options="chartOptions" />
</template>
<script>
import BarChart from '@/components/Common/Charts/Bar.vue'
import { STACKED_CHART_COLORS } from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'
import { getDataTableFieldLabel } from '@/utils/functions'
import useTimeUnitLabel from '@/hooks/executive-reports/useTimeUnitLabel'
export default {
  name: 'ExecutiveReportBarChart',
  components: { BarChart },
  mixins: [useTimeUnitLabel],
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
      const data = this.rawData
      if (data.length) {
        let minDate = Date.now(),
          maxDate = null,
          minEmailCount = 0,
          maxEmailCount = 0
        let itemTypes = new Set()
        const newData = data.map((row) => {
          let { month, result, emailCount } = row
          const splittedDate = month?.split('-')
          const timeStampOfDate = new Date(splittedDate[0], splittedDate[1] - 1).getTime()
          if (timeStampOfDate < minDate) {
            minDate = timeStampOfDate
          }
          if (timeStampOfDate > maxDate) {
            maxDate = timeStampOfDate
          }
          if (emailCount < minEmailCount) {
            minEmailCount = emailCount
          }
          if (emailCount > maxEmailCount) {
            maxEmailCount = emailCount
          }
          itemTypes.add(result)
          return { x: timeStampOfDate, y: emailCount, result }
        })
        if (maxEmailCount) {
          const remainder = Math.floor(maxEmailCount / 50)
          if (!remainder) {
            maxEmailCount = 50
          } else {
            maxEmailCount = remainder * 50 + 50
          }
        } else {
          maxEmailCount += 10 - (maxEmailCount % 10)
        }
        this.chartOptions = {
          // Look at this bit
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
                  lineHeight: 1.58,
                  min: minDate,
                  max: maxDate
                }
              }
            ],
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: 'Trends'
                },
                offset: true,
                gridLines: {
                  display: true,
                  color: 'rgba(128, 151, 177, 0.3)',
                  borderDash: [3]
                },
                ticks: {
                  min: minEmailCount,
                  max: maxEmailCount,
                  labelOffset: 0,
                  beginAtZero: true,
                  padding: -2,
                  fontColor: 'rgba(176, 186, 201)',
                  lineHeight: 1.58,
                  maxTicksLimit: 6,
                  stepSize: maxEmailCount / 5
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
        itemTypes = [...itemTypes]
        const datasets = []
        const colors = {
          'Opened Attachment': STACKED_CHART_COLORS['Opened Attachment']
        }
        for (let itemType of itemTypes) {
          datasets.push({
            label: getDataTableFieldLabel(itemType),
            ...colors[itemType],
            data: newData.filter((item) => item.result === itemType),
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
