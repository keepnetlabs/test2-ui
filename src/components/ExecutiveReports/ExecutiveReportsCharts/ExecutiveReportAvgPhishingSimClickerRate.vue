<template>
  <WidgetLoading :loading="isLoading">
    <template #skeleton-content>
      <ExecutiveWidgetContainer>
        <ExecutiveWidgetHeader
          :title="card.title"
          :subtitle="card.parentKey"
          :edit-mode="editMode"
          :is-dashboard-widget="isDashboardWidget"
          @on-delete="handleDelete"
          @on-edit="handleEdit"
        />
        <ExecutiveWidgetBody>
          <template v-if="!isEmpty">
            <BarChart
              v-if="chartData.datasets"
              :add-data-plugin="true"
              :chart-data="chartData"
              :chart-options="chartOptions"
              :custom-plugin="customPlugins"
              :add-custom-legend-label-height="12"
            />
            <div class="executive-report-avg-phishing-sim-clicker-msg">
              <h3 class="executive-report-avg-phishing-sim-clicker-msg-title">
                Cybersecurity Benefit
              </h3>
              <div class="executive-report-avg-phishing-sim-clicker-msg-desc">
                Achieved PLA target, reducing phishing risks through improved employee awareness.
              </div>
            </div>
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
import BarChart from '@/components/Common/Charts/Bar.vue'
import ExecutiveWidgetContainer from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetContainer.vue'
import ExecutiveWidgetHeader from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetHeader.vue'
import ExecutiveWidgetBody from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetBody.vue'
import { getExecutiveReportChartData } from '@/api/reports'
import { CHART_COLORS } from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'

export default {
  name: 'ExecutiveReportAvgPhishingSimClickerRate',
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
    isDashboardWidget: {
      type: Boolean,
      default: false
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
                let percentage = `${textParts[1]}`
                const x = chart.legend.legendHitBoxes[index].left + 17
                const y = chart.legend.legendHitBoxes[index].top + 7
                ctx.fillStyle = '#383B41'
                ctx.fillText(text, x, y)
                ctx.font = `bold ${fontSize}px ${fontFamily}`
                ctx.fillText(
                  percentage,
                  x + ctx.measureText(text).width - legendItem.customMarginLeft,
                  y
                )
                ctx.font = `${fontSize}px ${fontFamily}`
              }
            })
            const yScale = chart.scales['y-axis-0']
            const xScale = chart.scales['x-axis-0']
            const orangePolygonPos = yScale.getPixelForValue(this.chartData.datasets[2].data[0])
            const orangePolygon = new Image()
            orangePolygon.src = require('../../../assets/img/polygon-1.svg')
            const redPolygonPos = yScale.getPixelForValue(this.chartData.datasets[1].data[0][1])
            const redPolygon = new Image()
            redPolygon.src = require('../../../assets/img/polygon-2.svg')
            const orangeTotalPosX = xScale.getPixelForValue(0) + 26
            const orangeTotalPosY = orangePolygonPos + 2 - orangePolygon.height / 2
            // horizontal line
            ctx.beginPath()
            ctx.moveTo(orangeTotalPosX + 8, orangePolygonPos + 2)
            ctx.lineTo(200, orangePolygonPos + 2)
            ctx.strokeStyle = '#E6A23C'
            ctx.lineWidth = 1
            ctx.stroke()
            // vertical line
            ctx.beginPath()
            ctx.moveTo(200, orangePolygonPos + 2)
            ctx.lineTo(200, 138)
            ctx.strokeStyle = '#E6A23C'
            ctx.lineWidth = 1
            ctx.stroke()
            //last horizontal
            ctx.beginPath()
            ctx.moveTo(orangeTotalPosX + 92, 138)
            ctx.lineTo(300, 138)
            ctx.strokeStyle = '#E6A23C'
            ctx.lineWidth = 1
            ctx.stroke()
            ctx.drawImage(orangePolygon, orangeTotalPosX, orangeTotalPosY)
            ctx.drawImage(
              redPolygon,
              xScale.getPixelForValue(0) + 26,
              redPolygonPos + 2 - redPolygon.height / 2
            )
          },
          afterUpdate: function (chart) {
            const offset = 60
            chart.data.datasets.forEach(function (_, datasetIndex) {
              const meta = chart.getDatasetMeta(datasetIndex)
              meta.data.forEach(function (point) {
                const model = point._model
                model.x += offset
                if (model.controlPointNext) {
                  model.controlPointNextX += offset
                }
                if (model.controlPointPrevious) {
                  model.controlPointPreviousX += offset
                }
              })
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
        this.industryAverageObj = null
        return
      }
      const { values } = data[0].widgetDatas[0]
      const currentLevelImg = new Image()
      currentLevelImg.src = require('../../../assets/img/polygon-2.svg')
      const plaImg = new Image()
      plaImg.src = require('../../../assets/img/polygon-1.svg')
      this.chartOptions = {
        devicePixelRatio: 2,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              offset: false,
              stacked: true,
              gridLines: {
                display: false
              },
              ticks: {
                fontColor: '#383B41',
                fontSize: 9,
                labelOffset: 60,
                fontFamily: 'Open-sans,sans-serif',
                callback: function (label) {
                  if (label.includes('Empty')) return null
                  return ['Repeat Offenders']
                }
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                min: 0,
                max: 100,
                stepSize: 20,
                labelOffset: 0,
                padding: 12,
                fontColor: 'rgba(56, 59, 65, 0.72)',
                lineHeight: 1.58,
                fontFamily: 'Open-sans,sans-serif',
                beginAtZero: true,
                callback: function (value) {
                  return value + '%'
                }
              },
              scaleLabel: {
                display: true,
                fontFamily: 'Open-sans,sans-serif',
                fontSize: 12,
                fontColor: '#383B41',
                labelString: 'Percentage of Users'
              },
              gridLines: {
                display: true,
                color: '#F2F2F2',
                drawBorder: false,
                zeroLineColor: '#E0E0E0',
                zeroLineWidth: 2
              }
            }
          ]
        },
        legend: {
          display: true,
          position: 'top',
          onClick: (e) => e.stopPropagation(),
          labels: {
            usePointStyle: true,
            color: '#383B41',
            font: 'Open-sans,sans-serif',
            padding: 16,
            fontSize: 12,
            generateLabels: (chart = {}) => {
              const currentLevelLabel = 'Current Level'
              const plaLabel = 'Protection Level Agreement (PLA)'
              return [
                {
                  text: Array.from(
                    currentLevelLabel +
                      currentLevelLabel +
                      currentLevelLabel +
                      currentLevelLabel.substring(currentLevelLabel.length / 1.2)
                  )
                    .fill('')
                    .join(' '),
                  datasetIndex: 0,
                  customMarginLeft: 6,
                  pointStyle: currentLevelImg,
                  textParts: ['Current Level', '(100 users)']
                },
                {
                  text: Array.from(plaLabel + plaLabel)
                    .fill('')
                    .join(' '),
                  pointStyle: plaImg,
                  customMarginLeft: 12,
                  textParts: ['Protection Level Agreement (PLA)', '(5%)'],
                  datasetIndex: 1
                }
              ]
            }
          }
        },
        tooltips: {
          enabled: false,
          custom: function (tooltipModel) {
            let tooltipEl = document.getElementById('chartjs-tooltip-training-completion-bar')
            if (!tooltipEl) {
              tooltipEl = document.createElement('div')
              tooltipEl.id = 'chartjs-tooltip-training-completion-bar'
              tooltipEl.innerHTML =
                '<div class="tooltip-content"><table></table></div><div class="tooltip-footer"></div>'
              document.body.appendChild(tooltipEl)
            }

            tooltipEl.classList.remove('above', 'below', 'no-transform')
            if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign)
            } else {
              tooltipEl.classList.add('no-transform')
            }

            let position = this._chart.canvas.getBoundingClientRect()

            let tooltipWidth = tooltipEl.offsetWidth > 300 ? 250 : tooltipEl.offsetWidth
            tooltipEl.style.opacity = 1
            tooltipEl.style.display = 'block'
            tooltipEl.style.position = 'absolute'
            tooltipEl.style.left =
              position.left + window.pageXOffset + tooltipModel.caretX - tooltipWidth / 2 + 'px'
            tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px'
            tooltipEl.style.pointerEvents = 'none'

            let tooltipContent = tooltipEl.querySelector('.tooltip-content')
            tooltipContent.style.fontFamily = tooltipModel._bodyFontFamily
            tooltipContent.style.fontSize = tooltipModel.bodyFontSize + 'px'
            tooltipContent.style.fontStyle = tooltipModel._bodyFontStyle
            tooltipContent.style.padding =
              tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px'
            tooltipContent.style.background = 'white'
            tooltipContent.style.border = '1px solid #ccc'
            tooltipContent.style.borderRadius = '8px'
            tooltipContent.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)'
            if (tooltipModel.body && this._chart && this._chart.data.datasets) {
              let tableRoot = tooltipContent.querySelector('table')
              tableRoot.innerHTML = ''
              tableRoot.style.width = '100%'
              let titleRow = document.createElement('tr')
              const xValue = tooltipModel.dataPoints[0].xLabel
              titleRow.innerHTML = `<th style="text-align: left; display: block; padding-bottom: 8px; font-weight: bold;">${xValue}</th>`
              tableRoot.appendChild(titleRow)
              let selectedBackgroundColor = ''
              let selectedLabel = ''
              let selectedValue = ''
              this._chart.data.datasets.forEach((dataset) => {
                let datasetLabel = dataset.label
                let dataValue = dataset.data[tooltipModel.dataPoints[0].index]
                let backgroundColor =
                  tooltipModel.dataPoints[0].label === 'Completed'
                    ? '#217124'
                    : tooltipModel.dataPoints[0].label === 'Incomplete'
                    ? '#B83A3A'
                    : '#2196F3'
                let tr = document.createElement('tr')
                tr.innerHTML = `
                <td>
                    <span style="background-color:${backgroundColor}; width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 5px;"></span>
                    ${datasetLabel}:&nbsp;
                </td>
                <td>${dataValue}%</td>
            `
                if (
                  datasetLabel ===
                  this._chart.data.datasets[tooltipModel.dataPoints[0].datasetIndex].label
                ) {
                  tr.style.fontWeight = '600'
                  selectedValue = dataValue
                  selectedLabel = datasetLabel
                  selectedBackgroundColor = backgroundColor
                } else {
                  tr.style.fontWeight = 'normal'
                }

                tr.style.display = 'flex'
                tr.style.justifyContent = 'space-between'
                tr.style.paddingBottom = '6px'
                tableRoot.appendChild(tr)
              })
            }
            this._chart.canvas.addEventListener('mouseout', () => {
              tooltipEl.style.opacity = 0
              tooltipEl.style.display = 'none'
            })
          },
          xPadding: 16,
          yPadding: 16
        },
        plugins: {
          datalabels: {
            display: false,
            align: 'end',
            offset: -4,
            anchor: 'end',
            color(context, value) {
              if (context.dataset.label === 'PLA') return 'orange'
              else if (context.dataset.label === 'Inner Bar') return '#217124'
              return ''
            },
            clamp: true,
            formatter: function (value) {
              return value + '%'
            },
            borderRadius: 4
          }
        }
      }
      this.chartData = {
        labels: ['Repeat Offenders'],
        datasets: [
          {
            label: 'Outer Bar',
            data: [[1, 100]],
            backgroundColor: ['transparent'],
            borderColor: function (context) {
              const chart = context.chart
              const ctx = chart.ctx
              //const index = context.dataIndex
              //const value = context.dataset.data[index]
              console.log('chart.height', chart.height)
              const gradient = ctx.createLinearGradient(0, 0, 0, chart.height - 48)
              gradient.addColorStop(0, '#932727')
              gradient.addColorStop(1, '#F56C6C')
              return gradient
            },
            barThickness: 48,
            borderWidth: 1,
            order: 1
          },
          {
            label: 'Inner Bar',
            data: [[3, 60]],
            backgroundColor: function (context) {
              const chart = context.chart
              const ctx = chart.ctx
              //const index = context.dataIndex
              //const value = context.dataset.data[index]
              console.log('chart.height', chart.height)
              const gradient = ctx.createLinearGradient(0, 0, 0, chart.height - 48)
              gradient.addColorStop(0, '#932727')
              gradient.addColorStop(1, '#F56C6C')
              return gradient
            },
            borderColor: ['transparent'],
            barThickness: 40,
            borderWidth: 1,
            order: 2
          },
          {
            label: 'PLA',
            data: [70],
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            fill: false
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
