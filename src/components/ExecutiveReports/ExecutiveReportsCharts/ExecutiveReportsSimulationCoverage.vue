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
  name: 'ExecutiveReportsSimulationCoverage',
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
      default: () => [labels.SimulatedUsers, labels.NonSimulatedUsers]
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
          this.$emit('on-set-default-widget-data', this.card.key, data)
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
      let backgroundColor = []
      this.valueEnums.forEach((data) => {
        if (!CHART_COLORS[data]) return
        if (data === labels.SimulatedUsers)
          return backgroundColor.push(CHART_COLORS[labels.SimulatedUsersCoverage].backgroundColor)
        backgroundColor.push(CHART_COLORS[data].backgroundColor)
      })
      const { values } = data[0].widgetDatas[0]
      const nonSimulatedUsers = values.find((data) => data.name === 'CountNonSimulated')?.value
      const simulatedUsers = values.find((data) => data.name === 'CountSimulated')?.value
      const nonSimulated = values.find((data) => data.name === 'NonSimulatedPercentage')?.value
      const simulated = values.find((data) => data.name === 'SimulatedPercentage')?.value
      const chartOptions = {
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        devicePixelRatio: 2,
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
              const splittedNonSimulatedUsers = labels.NonSimulatedUsers.split(' ')
              const splittedSimulatedUsers = labels.SimulatedUsers.split(' ')
              return [
                {
                  text: Array.from(
                    labels.SimulatedUsers +
                      labels.SimulatedUsers +
                      data.datasets[0].data[0] +
                      ' (users) '
                  )
                    .fill('')
                    .join(' '),
                  fillStyle: CHART_COLORS[labels.SimulatedUsersCoverage]
                    ? CHART_COLORS[labels.SimulatedUsersCoverage].backgroundColor
                    : null,
                  lineWidth: 0,
                  datasetIndex: 0,
                  textParts: [
                    splittedSimulatedUsers[0] + ' ' + splittedSimulatedUsers[1],
                    simulatedUsers
                  ],
                  customMarginLeft: 7
                },
                {
                  text: Array.from(
                    labels.NonSimulatedUsers +
                      labels.NonSimulatedUsers +
                      data.datasets[0].data[1] +
                      ' (users) '
                  )
                    .fill('')
                    .join(' '),
                  fillStyle: CHART_COLORS[labels.NonSimulatedUsers]
                    ? CHART_COLORS[labels.NonSimulatedUsers].backgroundColor
                    : null,
                  lineWidth: 0,
                  datasetIndex: 1,
                  textParts: [
                    splittedNonSimulatedUsers[0] + ' ' + splittedNonSimulatedUsers[1],
                    nonSimulatedUsers
                  ],
                  customMarginLeft: 4
                }
              ]
            }
          }
        }
      }
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
      this.chartData = [simulated, nonSimulated]
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
