<template>
  <div class="phishing-activity-widget">
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

// Chart colors for Campaigns, Risky Actions, Reported
const PHISHING_ACTIVITY_COLORS = {
  Campaigns: {
    backgroundColor: '#757575',
    borderColor: '#757575'
  },
  'Risky Actions': {
    backgroundColor: '#F56C6C',
    borderColor: '#F56C6C'
  },
  Reported: {
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
                const offset = text === 'Reported' ? 0 : -2
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

      // Map old labels to new labels
      const labelMapping = {
        Delivered: 'Campaigns',
        'Risky Actions': 'Risky Actions',
        RiskyActions: 'Risky Actions',
        Reported: 'Reported'
      }

      const newDatasets = []
      const datasetOrder = ['Campaigns', 'Risky Actions', 'Reported']

      valueEnums.forEach((itemType) => {
        // Sadece y > 0 olan değerleri oluştur (0 olanları hiç ekleme)
        const typedItems = datasets.filter((item) => item.result === itemType && item.y > 0)
        const newLabel = labelMapping[itemType] || itemType
        const orderIndex = datasetOrder.indexOf(newLabel)

        if (orderIndex !== -1 && typedItems.length > 0) {
          newDatasets[orderIndex] = {
            type: 'bar',
            maxBarThickness: 32,
            label: newLabel,
            ...PHISHING_ACTIVITY_COLORS[newLabel],
            data: typedItems
          }
        }
      })

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
                labelString: 'Number of Activities',
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
                lineHeight: 1.58
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
              const legendOrder = ['Campaigns', 'Risky Actions', 'Reported']
              const colors = {
                Campaigns: '#757575',
                'Risky Actions': '#F56C6C',
                Reported: '#43A047'
              }

              return legendOrder.map((label) => {
                const dataset = data.datasets.find((ds) => ds.label === label)
                const total = dataset
                  ? dataset.data.reduce((sum, current) => sum + (current.y || 0), 0)
                  : 0
                const customSpacer = '            '

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
              return value.y || ''
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
.phishing-activity-widget {
  height: 360px;
  min-height: 360px;
  max-height: 360px;
}
</style>
