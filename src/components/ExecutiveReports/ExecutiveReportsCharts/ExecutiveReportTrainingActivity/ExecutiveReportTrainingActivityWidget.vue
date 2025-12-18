<template>
  <div class="training-activity-widget">
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
              <BarChart
                v-if="chartData.datasets"
                :chart-data="chartData"
                :chart-options="chartOptions"
                :custom-plugin="customPlugin"
                :add-custom-legend-label-height="16"
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
  </div>
</template>

<script>
import WidgetLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import BarChart from '@/components/Common/Charts/Bar.vue'
import ExecutiveWidgetContainer from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetContainer.vue'
import ExecutiveWidgetHeader from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetHeader.vue'
import ExecutiveWidgetBody from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetBody.vue'
import { getExecutiveReportChartData } from '@/api/reports'
import { createExecutiveReportChartData } from '@/components/ExecutiveReports/ExecutiveReportsWidget/utils'
import { monthNamesLong } from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'

// Chart colors for Enrollments, Incomplete, Completed
const TRAINING_ACTIVITY_COLORS = {
  Enrollments: {
    backgroundColor: '#757575',
    borderColor: '#757575'
  },
  Incomplete: {
    backgroundColor: '#E6A23C',
    borderColor: '#E6A23C'
  },
  Completed: {
    backgroundColor: '#43A047',
    borderColor: '#43A047'
  }
}

export default {
  name: 'ExecutiveReportPhisihingActivityWidget',
  components: {
    ExecutiveWidgetBody,
    ExecutiveWidgetHeader,
    ExecutiveWidgetContainer,
    BarChart,
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
      chartOptions: {},
      chartData: {},
      customPlugin: [
        {
          afterDraw: (chart) => {
            const ctx = chart.chart.ctx
            const fontSize = 12
            const fontFamily = 'Open Sans, sans-serif'
            chart.legend.legendItems.forEach((legendItem, index) => {
              const textParts = legendItem.textParts
              if (textParts) {
                const text = textParts[0]
                const percentage = textParts[1]
                const x = chart.legend.legendHitBoxes[index].left + 17
                const y = chart.legend.legendHitBoxes[index].top + 6
                ctx.fillStyle = '#383B41'
                ctx.fillText(text, x, y)
                ctx.font = `bold ${fontSize}px ${fontFamily}`
                const offset = text === 'Completed' ? 0 : -4
                ctx.fillText(percentage, x + ctx.measureText(text).width + offset, y + 0.5)
                ctx.font = `${fontSize}px ${fontFamily}`
              }
            })
          }
        }
      ]
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
          this.$emit('on-set-default-widget-data', this.card.key, data)
          this.setChartData(data)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    setChartData(data) {
      const params = [data[0].widgetDatas]
      if (this.dateFormat) params.push(this.dateFormat)
      const { valueEnums, datasets } = createExecutiveReportChartData(...params)
      if (!datasets.length) {
        this.isEmpty = true
        return
      }

      // Map backend labels to display labels
      const labelMapping = {
        Total: 'Enrollments',
        Incomplete: 'Incomplete',
        Enrollment: 'Enrollments'
      }

      const newDatasets = []
      const datasetOrder = ['Enrollments', 'Incomplete', 'Completed']

      // Calculate Completed from Total - Incomplete per date (x is timestamp)
      const enrollmentsByDate = {}
      const incompleteByDate = {}

      datasets.forEach((item) => {
        const timestamp = item.x
        if (item.result === 'Total' || item.result === 'Enrollment') {
          enrollmentsByDate[timestamp] = item.y
        } else if (item.result === 'Incomplete') {
          incompleteByDate[timestamp] = item.y
        }
      })

      // Build datasets
      valueEnums.forEach((itemType) => {
        const typedItems = datasets.filter((item) => item.result === itemType)
        const newLabel = labelMapping[itemType] || itemType
        const orderIndex = datasetOrder.indexOf(newLabel)

        if (orderIndex !== -1) {
          const filteredData = typedItems.filter((item) => item.y > 0)
          if (filteredData.length > 0) {
            newDatasets[orderIndex] = {
              type: 'bar',
              barThickness: 32,
              borderWidth: 2,
              borderColor: '#ffffff',
              label: newLabel,
              backgroundColor: TRAINING_ACTIVITY_COLORS[newLabel].backgroundColor,
              data: filteredData
            }
          }
        }
      })

      // Create Completed dataset from Enrollments - Incomplete
      const completedData = Object.keys(enrollmentsByDate)
        .map((timestamp) => ({
          x: Number(timestamp),
          y: (enrollmentsByDate[timestamp] || 0) - (incompleteByDate[timestamp] || 0),
          result: 'Completed'
        }))
        .filter((item) => item.y > 0)

      if (completedData.length > 0) {
        newDatasets[2] = {
          type: 'bar',
          barThickness: 32,
          borderWidth: 2,
          borderColor: '#ffffff',
          label: 'Completed',
          backgroundColor: TRAINING_ACTIVITY_COLORS['Completed'].backgroundColor,
          data: completedData
        }
      }

      // Filter out undefined entries
      const filteredDatasets = newDatasets.filter(Boolean)

      // Calculate max Y value (grouped - find max individual value)
      let maxY = 0
      filteredDatasets.forEach((ds) => {
        ds.data.forEach((point) => {
          maxY = Math.max(maxY, point.y || 0)
        })
      })

      // Round up maxY to nice value
      if (maxY < 20) {
        maxY = 40
      } else if (maxY < 40) {
        maxY = 60
      } else if (maxY < 60) {
        maxY = 80
      } else if (maxY < 80) {
        maxY = 100
      } else {
        maxY = Math.ceil(maxY / 20) * 20
      }

      this.chartData = {
        datasets: filteredDatasets
      }

      this.chartOptions = {
        responsive: true,
        devicePixelRatio: 2,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              stacked: false,
              beginAtZero: true,
              position: 'left',
              scaleLabel: {
                display: true,
                labelString: 'Training Activity',
                fontColor: '#383B41'
              },
              offset: false,
              gridLines: {
                display: true,
                drawBorder: false,
                zeroLineColor: '#757575',
                zeroLineWidth: 2
              },
              ticks: {
                min: 0,
                max: maxY,
                stepSize: maxY / 5,
                labelOffset: 0,
                beginAtZero: true,
                padding: 12,
                fontFamily: 'Open-sans,sans-serif',
                fontColor: 'rgba(56, 59, 65, 0.72)',
                lineHeight: 1.58,
                callback: function (value) {
                  return value
                }
              }
            }
          ],
          xAxes: [
            {
              stacked: false,
              display: true,
              offset: true,
              type: 'time',
              time: {
                unit: 'month',
                displayFormats: {
                  month: 'MM/YYYY'
                }
              },
              scaleLabel: {
                display: true,
                labelString: 'Month/Year',
                fontColor: '#383B41'
              },
              ticks: {
                fontColor: 'rgba(56, 59, 65, 0.72)',
                fontStyle: '600',
                fontSize: 9,
                fontFamily: 'Open-sans,sans-serif',
                callback(value) {
                  const splittedVal = value.split('/')
                  const monthName = monthNamesLong[splittedVal[0] - 1]
                  return `${monthName}/${value.split('/')[1]}`
                }
              },
              gridLines: {
                display: false,
                showBorder: false,
                color: '#F2F2F2'
              }
            }
          ]
        },
        legend: {
          display: true,
          position: 'top',
          align: 'center',
          labels: {
            usePointStyle: true,
            fontColor: '#383B41',
            generateLabels(chart = {}) {
              const { data } = chart
              const legendOrder = ['Enrollments', 'Incomplete', 'Completed']
              const colors = {
                Enrollments: '#757575',
                Incomplete: '#E6A23C',
                Completed: '#43A047'
              }

              return legendOrder.map((label) => {
                const dataset = data.datasets.find((ds) => ds.label === label)
                const total = dataset
                  ? dataset.data.reduce((sum, current) => sum + (current.y || 0), 0)
                  : 0
                const customSpacer = '        '

                return {
                  text: Array.from(label + label + customSpacer)
                    .fill('')
                    .join(' '),
                  fillStyle: colors[label],
                  lineWidth: 0,
                  datasetIndex: data.datasets.findIndex((ds) => ds.label === label),
                  textParts: [label, `(${total})`]
                }
              })
            },
            fontFamily: 'Open-sans,sans-serif',
            padding: 16,
            fontSize: 12
          }
        },
        tooltips: {
          enabled: false
        },
        plugins: {
          datalabels: {
            display: true,
            color: '#383B41',
            font: {
              weight: 'bold',
              size: 11
            },
            anchor: 'end',
            align: 'top',
            formatter: function (value) {
              return value.y > 0 ? value.y : ''
            }
          }
        }
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

<style lang="scss" scoped>
.training-activity-widget {
  height: 360px;
  min-height: 360px;
  max-height: 360px;
}
</style>
