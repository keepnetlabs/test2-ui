<template>
  <LineChart v-if="chartData.datasets" :chart-data="chartData" :chart-options="chartOptions" />
</template>
<script>
import LineChart from '@/components/Common/Charts/Line.vue'
import { getDataTableFieldLabel } from '@/utils/functions'
import { LINE_CHART_COLORS } from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'
import useTimeUnitLabel from '@/hooks/executive-reports/useTimeUnitLabel'

export default {
  name: 'ExecutiveReportLineChart',
  components: { LineChart },
  mixins: [useTimeUnitLabel],
  props: {
    timeUnit: {
      type: String,
      default: 'month'
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
      const data = [
        {
          month: '2023-11',
          result: 'Opened Attachment',
          emailCount: 58
        },
        {
          month: '2023-11',
          result: 'Submitted',
          emailCount: 28
        },
        {
          month: '2023-11',
          result: 'Clicked',
          emailCount: 3
        },
        {
          month: '2023-12',
          result: 'Opened Attachment',
          emailCount: 18
        },
        {
          month: '2023-12',
          result: 'Submitted',
          emailCount: 4
        },
        {
          month: '2023-12',
          result: 'Clicked',
          emailCount: 9
        },
        {
          month: '2024-01',
          result: 'Opened Attachment',
          emailCount: 62
        },
        {
          month: '2024-01',
          result: 'Submitted',
          emailCount: 71
        },
        {
          month: '2024-01',
          result: 'Clicked',
          emailCount: 0
        }
      ]
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
          }
        }
        itemTypes = [...itemTypes]
        const datasets = []
        const colors = {
          'Opened Attachment': LINE_CHART_COLORS['Opened Attachment'],
          Clicked: LINE_CHART_COLORS.Clicked,
          Submitted: LINE_CHART_COLORS.Submitted
        }
        for (let itemType of itemTypes) {
          datasets.push({
            label: getDataTableFieldLabel(itemType),
            ...colors[itemType],
            data: newData.filter((item) => item.result === itemType)
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
