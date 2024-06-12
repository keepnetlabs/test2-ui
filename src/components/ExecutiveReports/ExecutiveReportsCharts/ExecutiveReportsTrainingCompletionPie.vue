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
  name: 'ExecutiveReportsTrainingCompletionPie',
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
      default: () => [60, 25, 15]
    },
    valueEnums: {
      type: Array,
      default: () => [labels.Completed, labels.InProgress, labels.Incomplete]
    },
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
      chartData: [],
      customPlugins: [
        {
          afterDraw: (chart) => {
            const ctx = chart.chart.ctx
            const fontSize = 12
            const fontFamily = 'Open Sans, sans-serif'
            chart.legend.legendItems.forEach((legendItem, index) => {
              const textParts = legendItem.textParts
              if (textParts) {
                let text = textParts[0]
                let percentage = `(${textParts[1]}%)`
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
      const { values } = data[0].widgetDatas[0]
      const completed = values.find((obj) => obj.name === 'Completed')?.value
      const inProgress = values.find((obj) => obj.name === 'InProgress')?.value
      const incomplete = values.find((obj) => obj.name === 'Incomplete')?.value
      const chartOptions = {
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        rotation: 45,
        showLabels: true,
        labels: this.valueEnums,
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
            color: '#383B41',
            font: 'Open-sans,sans-serif',
            padding: 16,
            fontSize: 12,
            generateLabels: (chart = {}) => {
              const { data } = chart
              return data.datasets[0].data.map((d, index) => {
                const label = data.labels[index]
                const splittedLabel = label.split(' ')
                const textParts =
                  splittedLabel.length === 1
                    ? [splittedLabel[0], d]
                    : [splittedLabel[0] + ' ' + splittedLabel[1], d]
                const comparatorVal = label === 'Completed' ? 2 : 4
                return {
                  text: Array.from(
                    label + label + label.substring(0, label.length / comparatorVal) + d + ' (%) '
                  )
                    .fill('')
                    .join(' '),
                  fillStyle: CHART_COLORS[data.labels[index]]
                    ? CHART_COLORS[data.labels[index]].backgroundColor
                    : null,
                  lineWidth: 0,
                  datasetIndex: index,
                  textParts,
                  customMarginLeft: label === 'Completed' ? 4 : 0
                }
              })
            }
          }
        }
      }
      let backgroundColor = []
      this.valueEnums.forEach((data) => {
        if (!CHART_COLORS[data]) return
        backgroundColor.push(CHART_COLORS[data].backgroundColor)
      })
      this.chartOptions = {
        ...chartOptions,
        backgroundColor,
        showTooltipLine: true,
        plugins: {
          datalabels: {
            color: '#383B41',
            font: { family: 'Open Sans, sans-serif' },
            display: true,
            clamp: true,
            anchor: function (context) {
              const isZeroTwice = context.dataset.data.filter((d) => d === 0).length > 1
              if (isZeroTwice) return 'start'
              return 'center'
            },
            align: function (context) {
              const isZeroTwice = context.dataset.data.filter((d) => d === 0).length > 1
              if (isZeroTwice) return 'center'
              return 'center'
            },
            formatter(value) {
              if (value === 0) return ''
              return `${value}%`
            }
          }
        }
      }
      this.chartData = [completed, inProgress, incomplete]
      this.isLoading = false
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
