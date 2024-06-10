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
            <PieChart
              v-if="chartData"
              style="margin-top: -8px;"
              :data="chartData"
              :chart-options="chartOptions"
              :custom-plugins="customPlugins"
              add-data-label-plugin
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
import PieChart from '@/components/Common/Charts/Pie.vue'
import labels from '@/model/constants/labels'
import { CHART_COLORS } from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'
import WidgetLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import ExecutiveWidgetBody from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetBody.vue'
import ExecutiveWidgetContainer from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetContainer.vue'
import ExecutiveWidgetHeader from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetHeader.vue'
import { getExecutiveReportChartData } from '@/api/reports'
export default {
  name: 'ExecutiveReportsRepeatOffendersUsers',
  components: {
    ExecutiveWidgetHeader,
    ExecutiveWidgetContainer,
    ExecutiveWidgetBody,
    WidgetLoading,
    PieChart
  },
  props: {
    rawData: {
      type: Array,
      default: () => [30, 70]
    },
    valueEnums: {
      type: Array,
      default: () => [labels.SimulatedUsers, labels.RepeatOffenders]
    },
    editMode: {
      type: Boolean,
      default: true
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
    },
    card: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isLoading: false,
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      chartOptions: {},
      chartData: [],
      isEmpty: false,
      empty: {
        message: 'You do not have any report conclusion'
      },
      customPlugins: [
        {
          id: 'height-plugin',
          beforeInit: function (chart) {
            chart.legend.afterFit = function () {
              this.height = this.height + 8
            }
          }
        },
        {
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
          this.setChartData(data)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    setChartData(data) {
      if (!data[0].widgetDatas.length) {
        this.isEmpty = true
        return
      }
      const chartOptions = {
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        showLabels: true,
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          enabled: false
        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            fontColor: '#383B41',
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
                      data.datasets[0].data[1] +
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
                    data.datasets[0].data[1]
                  ],
                  customMarginLeft: 8
                },
                {
                  text: Array.from(
                    labels.SimulatedUsers +
                      labels.SimulatedUsers +
                      data.datasets[0].data[0] +
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
                    data.datasets[0].data[0]
                  ],
                  customMarginLeft: 2
                }
              ]
            }
          }
        }
      }
      let backgroundColor = []
      this.valueEnums.forEach((data) => {
        if (!CHART_COLORS[data]) return
        backgroundColor.push(CHART_COLORS[data].backgroundColor)
      })
      const { values } = data[0].widgetDatas[0]
      const offenders = values.find((data) => data.name === 'RepeatOffenderPercentage')?.value
      const simulated = values.find((data) => data.name === 'PercentageSimulated')?.value
      this.chartOptions = {
        ...chartOptions,
        backgroundColor,
        labels: this.valueEnums,
        showTooltipLine: true,
        plugins: {
          datalabels: {
            color: '#383B41',
            anchor: function (context) {
              if (context.dataset.data.includes(0)) return 'start'
              return 'top'
            },
            align: function (context) {
              if (context.dataset.data.includes(0)) return 'center'
              if (context.dataset.data[1] > context.dataset.data[0]) {
                if (context.dataIndex === 0) {
                  return 'center'
                }
                return 'top'
              }
              return 'center'
            },
            display: true,
            font: {
              size: 12,
              family: 'Open Sans, sans-serif'
            },
            formatter(value) {
              if (value) return `${value}%`
              return ``
            }
          }
        }
      }
      this.chartData = [simulated, offenders]
      this.isEmpty = false
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
