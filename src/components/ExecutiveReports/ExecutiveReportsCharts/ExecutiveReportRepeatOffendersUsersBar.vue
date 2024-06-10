<template>
  <WidgetLoading :loading="isLoading">
    <template #skeleton-content>
      <ExecutiveWidgetContainer>
        <ExecutiveWidgetHeader
          :title="card.title"
          :subtitle="card.parentKey"
          :edit-mode="editMode"
          @on-delete="handleDelete"
          @on-edit="handleEdit"
        />
        <ExecutiveWidgetBody>
          <template v-if="!isEmpty">
            <HorizontalBarChart
              v-if="chartData.datasets"
              :chart-data="chartData"
              :chart-options="chartOptions"
              :custom-plugin="customPlugin"
              :another-custom-plugin="anotherCustomPlugin"
            />
          </template>
          <div
            v-else
            class="k-widget-list__empty-inline"
            style="display: flex; align-items: center; justify-content: center;"
          >
            <h2 v-if="empty.message">{{ empty.message }}</h2>
            <p v-if="empty.subMes">{{ empty.subMes }}</p>
            <v-btn v-if="empty.btn" class="empty-btn">
              <v-icon class="mr-2">{{ empty.icon }}</v-icon>
              {{ empty.btn }}
            </v-btn>
          </div>
        </ExecutiveWidgetBody>
      </ExecutiveWidgetContainer>
    </template>
  </WidgetLoading>
</template>

<script>
import WidgetLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import ExecutiveWidgetContainer from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetContainer.vue'
import ExecutiveWidgetHeader from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetHeader.vue'
import ExecutiveWidgetBody from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetBody.vue'
import HorizontalBarChart from '@/components/Common/Charts/HorizontalBar.vue'
import { getExecutiveReportChartData } from '@/api/reports'
import { CHART_COLORS } from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'
import labels from '@/model/constants/labels'
export default {
  name: 'ExecutiveReportRepeatOffendersUsersBar',
  components: {
    ExecutiveWidgetBody,
    ExecutiveWidgetHeader,
    ExecutiveWidgetContainer,
    HorizontalBarChart,
    WidgetLoading
  },
  props: {
    editMode: {
      type: Boolean,
      default: true
    },
    card: {
      type: Object,
      default: () => {}
    },
    dateRange: {
      type: Array,
      default: () => []
    },
    datePeriod: {
      type: Number,
      default: 1
    },
    defaultWidgetData: {
      type: [Object, Array]
    },
    dateFormat: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isLoading: false,
      isEmpty: false,
      empty: {
        message: 'You do not have any report conclusion'
      },
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      chartOptions: {},
      chartData: {},
      customPlugin: {
        id: 'customPlugin',
        afterDraw(chart) {
          const ctx = chart.ctx
          ctx.save()
          ctx.strokeStyle = '#757575'
          ctx.lineWidth = 2
          const xAxis = chart.scales['x-axis-0']
          const yAxis = chart.scales['y-axis-0']
          const xTickStart = xAxis.left
          ctx.beginPath()
          ctx.moveTo(xTickStart, yAxis.bottom)
          ctx.lineTo(xAxis.right, yAxis.bottom)
          ctx.stroke()
          ctx.restore()
        }
      },
      anotherCustomPlugin: {
        afterDraw: (chart) => {
          const ctx = chart.chart.ctx
          const fontSize = 12
          const fontFamily = 'Open Sans, sans-serif'
          chart.legend.legendItems.forEach((legendItem, index) => {
            const textParts = legendItem.textParts
            if (textParts) {
              const text = textParts[0]
              const percentage = `(${textParts[1]} users)`
              const x = chart.legend.legendHitBoxes[index].left + 17
              const y = chart.legend.legendHitBoxes[index].top + 6
              ctx.fillStyle = '#383B41'
              ctx.fillText(text, x, y)
              ctx.font = `bold ${fontSize}px ${fontFamily}`
              ctx.fillText(
                percentage,
                x + ctx.measureText(text).width - legendItem.customMarginLeft,
                y + 0.5
              )
              ctx.font = `${fontSize}px ${fontFamily}`
            }
          })
        }
      }
    }
  },
  watch: {
    dateRange() {
      this.callForData()
    }
  },
  created() {
    if (this?.defaultWidgetData?.length) this.setChartData(this.defaultWidgetData)
    else this.callForData()
  },
  methods: {
    callForData() {
      this.isLoading = true
      const payload = {
        widgetIds: [this.card.resourceId],
        datePeriod: this.datePeriod,
        startDate: this.dateRange[0],
        endDate: this.dateRange[1]
      }
      getExecutiveReportChartData(payload)
        .then((response) => {
          const {
            data: { data }
          } = response || {}
          this.setChartData(data)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    setChartData(data) {
      this.chartOptions = {
        indexAxis: 'y',
        responsive: true,
        padding: 24,
        layout: {
          padding: {
            right: 0,
            left: 0
          }
        },
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              beginAtZero: true,
              offset: true,
              gridLines: {
                display: false,
                drawBorder: false
              },
              ticks: {
                labelOffset: 0,
                beginAtZero: true,
                padding: 0,
                fontSize: 9,
                fontFamily: 'Open Sans, sans-serif',
                fontStyle: '600',
                fontColor: 'rgba(56, 59, 65, 0.72)',
                lineHeight: 1.58
              }
            }
          ],
          xAxes: [
            {
              display: true,
              stacked: true,
              offset: false,
              scaleLabel: {
                display: true,
                labelString: 'Percentage Of Users',
                fontColor: '#383B41'
              },
              gridLines: {
                display: true,
                color: 'white',
                zeroLineColor: '#F2F2F2',
                z: 1
              },
              ticks: {
                min: 0,
                max: 100,
                stepSize: 20,
                fontFamily: 'Open Sans, sans-serif',
                fontColor: 'rgba(56, 59, 65, 0.72)',
                fontSize: 12,
                callback: function (value) {
                  return ((value / this.max) * 100).toFixed(0) + '%'
                }
              }
            }
          ]
        },
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
              const splittedRepeatOffenders = labels.RepeatOffenders.split(' ')
              const splittedSimulatedUsers = labels.SimulatedUsers.split(' ')
              return [
                {
                  text: Array.from(
                    labels.RepeatOffenders +
                      labels.RepeatOffenders +
                      data.datasets[0].data[0] +
                      ' (users) '
                  )
                    .fill('')
                    .join(' '),
                  fillStyle: CHART_COLORS[labels.RepeatOffenders]
                    ? CHART_COLORS[labels.RepeatOffenders].backgroundColor
                    : null,
                  lineWidth: 0,
                  datasetIndex: 1,
                  textParts: [
                    splittedRepeatOffenders[0] + ' ' + splittedRepeatOffenders[1],
                    data.datasets[0].data[0]
                  ],
                  customMarginLeft: 8
                },
                {
                  text: Array.from(
                    labels.SimulatedUsers +
                      labels.SimulatedUsers +
                      data.datasets[1].data[0] +
                      ' (users) '
                  )
                    .fill('')
                    .join(' '),
                  fillStyle: CHART_COLORS[labels.SimulatedUsers]
                    ? CHART_COLORS[labels.SimulatedUsers].backgroundColor
                    : null,
                  lineWidth: 0,
                  datasetIndex: 0,
                  textParts: [
                    splittedSimulatedUsers[0] + ' ' + splittedSimulatedUsers[1],
                    data.datasets[1].data[0]
                  ],
                  customMarginLeft: 2
                }
              ]
            }
          }
        },
        tooltips: {
          enabled: false
        },
        plugins: {
          datalabels: {
            display: false
          }
        }
      }
      if (!data[0].widgetDatas.length) {
        this.isEmpty = true
        return
      }
      const { values } = data[0].widgetDatas[0]
      const offenders = values.find((data) => data.name === 'CountRepeatOffender')?.value
      const simulated = values.find((data) => data.name === 'CountSimulated')?.value
      this.chartData = {
        xLabels: [0, 100],
        yLabels: ['Users'],
        datasets: [
          {
            label: 'Repeat Offenders',
            data: [offenders],
            barThickness: 150,
            backgroundColor: '#F56C6C',
            borderWidth: 1,
            stack: 'Stack 1'
          },
          {
            label: 'Simulated Users',
            data: [simulated],
            barThickness: 150,
            backgroundColor: '#2196F3',
            borderWidth: 1,
            stack: 'Stack 1'
          }
        ]
      }
      this.isEmpty = false
      this.isLoading = false
    },
    handleDelete() {
      this.$emit('on-delete', this.card)
    },
    handleEdit() {
      this.$emit('on-edit', this.card)
    }
  }
}
</script>
