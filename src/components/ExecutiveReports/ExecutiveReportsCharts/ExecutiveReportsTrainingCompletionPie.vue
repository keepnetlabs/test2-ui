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
      const { values } = data[0].widgetDatas[0]
      const completed = values.find((obj) => obj.name === 'Completed')?.value
      const inProgress = values.find((obj) => obj.name === 'InProgress')?.value
      const incomplete = values.find((obj) => obj.name === 'Incomplete')?.value
      const chartOptions = {
        devicePixelRatio: 2,
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
          enabled: false,
          custom: function (tooltipModel) {
            let tooltipEl = document.getElementById('chartjs-tooltip-training-completion-doughnut')
            if (!tooltipEl) {
              tooltipEl = document.createElement('div')
              tooltipEl.id = 'chartjs-tooltip-training-completion-doughnut'
              tooltipEl.innerHTML = '<div class="tooltip-content"><table></table></div>'
              document.body.appendChild(tooltipEl)
            }
            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0
              tooltipEl.style.display = 'none'
              return
            }
            tooltipEl.classList.remove('above', 'below', 'no-transform')
            if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign)
            } else {
              tooltipEl.classList.add('no-transform')
            }
            let tooltipContent = tooltipEl.querySelector('.tooltip-content')
            if (tooltipModel.body) {
              let tableRoot = tooltipContent.querySelector('table')
              tableRoot.innerHTML = ''
              tableRoot.style.width = '100%'
              let titleRow = document.createElement('tr')
              const valArr = tooltipModel.body[0].lines[0].split(':')
              titleRow.innerHTML = `<th style="text-align: left; display: block; padding-bottom: 8px; font-weight: bold;font-size: 12px;">${valArr[0]}</th>`
              tableRoot.appendChild(titleRow)
              const addTr = (label, val, addPaddingBottom = true) => {
                let tr = document.createElement('tr')
                let backgroundColor =
                  valArr[0] === 'Completed'
                    ? '#43A047'
                    : valArr[0] === 'In Progress'
                    ? '#2196F3'
                    : '#B83A3A'
                tr.innerHTML = `
                <td style="font-weight:600;font-size:12px;"><span style="background-color:${backgroundColor}; width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 5px;"></span>${label}:&nbsp;
                </td>

                <td style="font-weight:600;font-size:12px;">${val}</td>
            `
                tr.style.display = 'flex'
                tr.style.justifyContent = 'space-between'
                if (addPaddingBottom) tr.style.paddingBottom = '8px'
                tableRoot.appendChild(tr)
              }
              const type = valArr[0]
              let val = 0
              if (type === 'Completed') {
                val = completed
              } else if (type === 'In Progress') {
                val = inProgress
              } else if (type === 'Incomplete') {
                val = incomplete
              }
              addTr('Percentage of Users', val + '%', false)
            }
            const position = this._chart.canvas.getBoundingClientRect()
            tooltipEl.style.opacity = 1
            tooltipEl.style.display = 'block'
            tooltipEl.style.position = 'absolute'
            tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px'
            tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px'
            tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily
            tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px'
            tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle
            tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px'
            tooltipEl.style.pointerEvents = 'none'
            tooltipContent.style.fontFamily = tooltipModel._bodyFontFamily
            tooltipContent.style.fontSize = tooltipModel.bodyFontSize + 'px'
            tooltipContent.style.fontStyle = tooltipModel._bodyFontStyle
            tooltipContent.style.padding =
              tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px'
            tooltipContent.style.background = 'white'
            tooltipContent.style.border = '1px solid #ccc'
            tooltipContent.style.borderRadius = '8px'
            tooltipContent.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)'

            this._chart.canvas.addEventListener('mouseout', () => {
              tooltipEl.style.opacity = 0
              tooltipEl.style.display = 'none'
            })
          },
          xPadding: 16,
          yPadding: 16
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
              return [completed, inProgress, incomplete].map((d, index) => {
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
        if (data === labels.Completed && completed) {
          backgroundColor.push(CHART_COLORS[data].backgroundColor)
        } else if (data === labels.InProgress && inProgress) {
          backgroundColor.push(CHART_COLORS[data].backgroundColor)
        } else if (data === labels.Incomplete && incomplete) {
          backgroundColor.push(CHART_COLORS[data].backgroundColor)
        }
      })
      this.chartOptions = {
        ...chartOptions,
        backgroundColor,
        showTooltipLine: true,
        plugins: {
          datalabels: {
            color: '#000',
            font: { family: 'Open Sans, sans-serif', weight: 'bold', size: 14 },
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
              const dataArr = context.dataset.data
              if (context.dataIndex === 0) {
                const comparator = dataArr[context.dataIndex] - dataArr[context.dataIndex + 1]
                if (comparator <= 3 || comparator >= -3) return 'end'
              }
              return 'center'
            },
            formatter(value) {
              if (value === 0) return ''
              return `${value}%`
            }
          }
        }
      }
      this.chartData = [completed, inProgress, incomplete].filter((val) => val > 0)
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
