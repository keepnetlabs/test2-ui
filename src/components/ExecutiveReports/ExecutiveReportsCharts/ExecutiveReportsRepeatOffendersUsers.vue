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
                const percentage = `(${textParts[1]})`
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
      if (!data?.[0]?.widgetDatas?.length) {
        this.isEmpty = true
        return
      } else if (data?.[0]?.widgetDatas?.length) {
        if (data[0].widgetDatas[0].values?.length) {
          this.isEmpty = !data[0].widgetDatas[0].values.some((row) => !!row.value)
          if (this.isEmpty) return
        }
      }
      let backgroundColor = []
      this.valueEnums.forEach((data) => {
        if (!CHART_COLORS[data]) return
        backgroundColor.push(CHART_COLORS[data].backgroundColor)
      })
      const { values } = data[0].widgetDatas[0]
      const offendersUsers = values.find((data) => data.name === 'CountRepeatOffender')?.value
      const simulatedUsers = values.find((data) => data.name === 'CountSimulated')?.value
      const offenders = values.find((data) => data.name === 'RepeatOffenderPercentage')?.value
      const simulated = values.find((data) => data.name === 'PercentageSimulated')?.value
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
          enabled: false,
          custom: function (tooltipModel) {
            let tooltipEl = document.getElementById('chartjs-tooltip-repeat-offenders-users-pie')
            if (!tooltipEl) {
              tooltipEl = document.createElement('div')
              tooltipEl.id = 'chartjs-tooltip-repeat-offenders-users-pie'
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
              titleRow.innerHTML = `<th style="text-align: left; display: block; padding-bottom: 8px; font-weight: bold;font-size: 14px;">${valArr[0]}</th>`
              tableRoot.appendChild(titleRow)
              const addTr = (label, val, addPaddingBottom = true) => {
                let tr = document.createElement('tr')
                let backgroundColor = valArr[0] === 'Simulated Users' ? '#2196F3' : '#F56C6C'
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
              const value = valArr[0] === 'Simulated Users' ? simulatedUsers : offendersUsers
              addTr('Number of Users', value, false)
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
                      '  '
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
                    offendersUsers
                  ],
                  customMarginLeft: 8
                },
                {
                  text: Array.from(
                    labels.SimulatedUsers + labels.SimulatedUsers + data.datasets[0].data[0] + '  '
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
                    simulatedUsers
                  ],
                  customMarginLeft: 2
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
            color: '#000',
            display: true,
            font: { family: 'Open Sans, sans-serif', weight: 'bold', size: 14 },
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
