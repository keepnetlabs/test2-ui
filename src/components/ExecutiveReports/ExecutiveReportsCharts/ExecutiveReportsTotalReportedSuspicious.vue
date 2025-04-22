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
export default {
  name: 'ExecutiveReportsTotalReportedSuspicious',
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
              let text = textParts[0]
              let percentage = `(${textParts[1]})`
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
          this.$emit('on-set-default-widget-data', this.card.key, data)
          this.setChartData(data)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    setChartData(data) {
      if (
        !data?.[0]?.widgetDatas?.length ||
        data?.[0]?.widgetDatas?.filter((obj) => obj.values[0].value).length === 0
      ) {
        this.isEmpty = true
        return
      }
      const yLabels = ['Undetected', 'Malicious', 'Phishing', 'Simulation']
      const dataSetsData = data[0].widgetDatas.map((obj) => {
        return {
          x: obj.values[0].value,
          y: obj.dataObject.ActionRange,
          details: {
            'Number of Reporting': obj.values[1].value,
            'Percentage of Reporting': obj.values[0].value + '%'
          }
        }
      })
      let maxX = Math.max(...dataSetsData.map((obj) => obj.x))
      if (maxX < 20) {
        maxX = 40
      } else if (maxX < 40) {
        maxX = 60
      } else if (maxX < 60) {
        maxX = 80
      } else if (maxX < 80) {
        maxX = 100
      } else {
        maxX = 100
      }
      const undetected = data[0].widgetDatas.find(
        (obj) => obj.dataObject.ActionRange === 'Undetected'
      )?.values
      const undetectedCount = undetected ? undetected[1].value : 0
      const malicious = data[0].widgetDatas.find(
        (obj) => obj.dataObject.ActionRange === 'Malicious'
      )?.values
      const maliciousCount = malicious ? malicious[1].value : 0
      const phishing = data[0].widgetDatas.find((obj) => obj.dataObject.ActionRange === 'Phishing')
        ?.values
      const phishingCount = phishing ? phishing[1].value : 0
      const simulation = data[0].widgetDatas.find(
        (obj) => obj.dataObject.ActionRange === 'Simulation'
      )?.values
      const simulationCount = simulation ? simulation[1].value : 0
      this.chartOptions = {
        devicePixelRatio: 2,
        indexAxis: 'y',
        responsive: true,
        padding: 24,
        layout: {
          padding: {
            right: 48,
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
                drawBorder: false,
                zeroLineColor: '#F2F2F2'
              },
              scaleLabel: {
                display: true,
                labelString: 'Category',
                fontColor: '#383B41'
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
              stacked: false,
              offset: false,
              scaleLabel: {
                display: true,
                labelString: 'Percentage of Emails Reported',
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
                max: maxX,
                stepSize: maxX / 5,
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
            padding: 16,
            fontSize: 12,
            onClick: (e) => e.stopPropagation(),
            generateLabels: (chart = {}) => {
              const { data } = chart
              return [undetectedCount, maliciousCount, phishingCount, simulationCount].map(
                (d, index) => {
                  const label = data.yLabels[index]
                  const splittedLabel = label.split(' ')
                  const textParts =
                    splittedLabel.length === 1
                      ? [splittedLabel[0], d]
                      : [splittedLabel[0] + ' ' + splittedLabel[1], d]
                  const comparatorVal = 4
                  let customMarginLeft = 1
                  if (label === 'Undetected') customMarginLeft = 5
                  else if (label === 'Simulation') customMarginLeft = 3
                  return {
                    text: Array.from(
                      label + label + label.substring(0, label.length / comparatorVal) + d + '  '
                    )
                      .fill('')
                      .join(' '),
                    fillStyle: CHART_COLORS[data.yLabels[index]]
                      ? CHART_COLORS[data.yLabels[index]].backgroundColor
                      : null,
                    lineWidth: 0,
                    datasetIndex: index,
                    textParts,
                    customMarginLeft
                  }
                }
              )
            }
          }
        },
        tooltips: {
          enabled: false,
          custom: function (tooltipModel) {
            let tooltipEl = document.getElementById('chartjs-tooltip-top-riskiest')

            if (!tooltipEl) {
              tooltipEl = document.createElement('div')
              tooltipEl.id = 'chartjs-tooltip-top-riskiest'
              tooltipEl.innerHTML = '<div class="tooltip-content"></div>'
              document.body.appendChild(tooltipEl)
            }

            tooltipEl.classList.remove('above', 'below', 'no-transform')
            if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign)
            } else {
              tooltipEl.classList.add('no-transform')
            }

            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0
              return
            }

            let position = this._chart.canvas.getBoundingClientRect()

            tooltipEl.style.opacity = 1
            tooltipEl.style.display = 'block'
            tooltipEl.style.position = 'absolute'
            tooltipEl.style.left =
              position.left + window.pageXOffset + tooltipModel.caretX / 2 + 'px'
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
              let tableRoot = tooltipContent
              tableRoot.innerHTML = ''

              let dataIndex = tooltipModel.dataPoints[0].index
              let dataPoint = this._chart.data.datasets[0].data[dataIndex]

              let titleRow = document.createElement('div')
              titleRow.style.fontWeight = 'bold'
              titleRow.style.paddingBottom = '8px'
              titleRow.style.fontSize = '14px'
              titleRow.textContent = dataPoint.y
              tableRoot.appendChild(titleRow)
              let index = 0
              for (const [key, value] of Object.entries(dataPoint.details)) {
                let fieldRow = document.createElement('div')
                fieldRow.style.display = 'flex'
                fieldRow.style.justifyContent = 'space-between'
                if (index < 1) fieldRow.style.paddingBottom = '8px'

                let fieldLabel = document.createElement('span')
                fieldLabel.textContent = `${key}:`
                fieldRow.appendChild(fieldLabel)

                let fieldValue = document.createElement('span')
                fieldValue.style.fontWeight = '700'
                fieldValue.style.paddingLeft = '8px'
                fieldValue.style.fontSize = '14px'
                fieldValue.textContent = value
                fieldRow.appendChild(fieldValue)
                tableRoot.appendChild(fieldRow)
                index++
              }
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
            display: true,
            align: 'end',
            offset: -2,
            anchor: 'end',
            color: '#383B41',
            clamp: true,
            formatter: function (value) {
              if (!value.x) return ''
              return `${value.x}%`
            },
            borderRadius: 4,
            padding: 6
          }
        }
      }
      this.chartData = {
        yLabels,
        datasets: [
          {
            data: dataSetsData,
            barThickness: 24,
            backgroundColor: function (context) {
              const index = context.dataIndex
              const valueObj = context.dataset.data[index]
              const value = valueObj.y
              if (value === 'Undetected') return '#757575'
              else if (value === 'Malicious') return '#F56C6C'
              else if (value === 'Phishing') return '#B83A3A'
              return '#2196F3'
            },
            borderWidth: 1
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
