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
</template>

<script>
import WidgetLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import BarChart from '@/components/Common/Charts/Bar.vue'
import ExecutiveWidgetContainer from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetContainer.vue'
import ExecutiveWidgetHeader from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetHeader.vue'
import ExecutiveWidgetBody from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetBody.vue'
import { getExecutiveReportChartData } from '@/api/reports'
import { createExecutiveReportChartData } from '@/components/ExecutiveReports/ExecutiveReportsWidget/utils'
import {
  CHART_COLORS,
  monthNamesLong
} from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'
import labels from '../../../model/constants/labels'

export default {
  name: 'ExecutiveReportsPhishingSimulationEngagement',
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
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
      const params = [data[0].widgetDatas]
      if (this.dateFormat) params.push(this.dateFormat)
      const { valueEnums, datasets } = createExecutiveReportChartData(...params)
      if (!datasets.length) {
        this.isEmpty = true
        return
      }
      const newDatasets = []
      valueEnums.sort((a, b) => (b > a ? 1 : -1))
      for (let itemType of valueEnums) {
        const typedItems = datasets.filter((item) => item.result === itemType)
        let chartColorType = 'Not Reported (%)'
        if (itemType === 'Users Who Clicked And Reported (%)') {
          chartColorType = 'Clicked Email Trends'
        } else if (itemType === 'Users Who Did Not Click And Reported (%)') {
          chartColorType = 'Not Clicked (%)'
        }
        let index = 1
        if (itemType === 'Users Who Did Not Click And Reported (%)') {
          index = 0
        } else if (itemType === 'Users Who Did Not Reported (%)') {
          index = 2
        }
        newDatasets[index] = {
          type: 'bar',
          barThickness: 32,
          label: itemType,
          ...CHART_COLORS[chartColorType],
          data: typedItems
        }
      }
      const maxYData = []
      for (let i = 0; i < newDatasets[0].data.length; i++) {
        maxYData.push(
          newDatasets[0].data[i].y + newDatasets[1].data[i].y + newDatasets[2].data[i].y
        )
      }
      let maxY = Math.max(...maxYData)
      if (maxY < 20) {
        maxY = 40
      } else if (maxY < 40) {
        maxY = 60
      } else if (maxY < 60) {
        maxY = 80
      } else if (maxY < 80) {
        maxY = 100
      } else {
        maxY = 100
      }
      this.chartData = {
        datasets: newDatasets
      }
      this.chartOptions = {
        responsive: true,
        devicePixelRatio: 2,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              beginAtZero: true,
              position: 'left',
              scaleLabel: {
                display: true,
                labelString: 'Phishing Report Rate',
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
                  return value + '%'
                }
              }
            }
          ],
          xAxes: [
            {
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
          labels: {
            usePointStyle: true,
            fontColor: '#383B41',
            generateLabels(chart = {}) {
              const { data } = chart
              return data.datasets.map((item, index) => {
                const average = Math.round(
                  item.data.reduce((total, current) => total + current.y, 0) / item.data.length
                )
                let label = 'Users Who Did Not Report'
                if (item.label === 'Users Who Clicked And Reported (%)') {
                  label = 'Users Who Clicked And Reported'
                } else if (item.label === 'Users Who Did Not Click And Reported (%)') {
                  label = 'Users Who Did Not Click And Report'
                }
                const percentage = average.toString().includes('.') ? average.toFixed(2) : average
                const customSpacer =
                  label !== labels.UserWhoDidNotClickAndReport ? '        ' : '     '
                let customMarginLeft = 6
                if (label === labels.UserWhoClickedAndReported) {
                  customMarginLeft = 8
                } else if (label === labels.UserWhoDidNotClickAndReport) {
                  customMarginLeft = 16
                }
                return {
                  text: Array.from(label + label + customSpacer)
                    .fill('')
                    .join(' '),
                  fillStyle: item.borderColor,
                  lineWidth: 0,
                  datasetIndex: index,
                  textParts: [label, `(${percentage}%)`],
                  customMarginLeft
                }
              })
            },
            fontFamily: 'Open-sans,sans-serif',
            padding: 16,
            fontSize: 12
          }
        },
        tooltips: {
          enabled: false,
          custom: function (tooltipModel) {
            let tooltipEl = document.getElementById(
              'chartjs-tooltip-phishing-simulation-engagement'
            )

            if (!tooltipEl) {
              tooltipEl = document.createElement('div')
              tooltipEl.id = 'chartjs-tooltip-phishing-simulation-engagement'
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

            let tooltipWidth = tooltipEl.offsetWidth > 300 ? 280 : tooltipEl.offsetWidth
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

            let tooltipFooter = tooltipEl.querySelector('.tooltip-footer')
            tooltipFooter.style.marginTop = '2px'
            tooltipFooter.style.fontFamily = 'Open-sans,sans-serif'
            tooltipFooter.style.fontSize = '12px'
            tooltipFooter.style.borderRadius = '8px'
            tooltipFooter.style.color = '#fff'
            tooltipFooter.style.padding = '16px'
            tooltipFooter.style.maxWidth = '280px'
            tooltipFooter.style.fontWeight = 'normal'
            if (tooltipModel.body && this._chart && this._chart.data.datasets) {
              let tableRoot = tooltipContent.querySelector('table')
              tableRoot.innerHTML = ''
              tableRoot.style.width = '100%'
              let titleRow = document.createElement('tr')
              const xValue = new Date(tooltipModel.dataPoints[0].xLabel)
              titleRow.innerHTML = `<th style="text-align: left; display: block; padding-bottom: 8px; font-weight: bold;">${
                monthNamesLong[xValue.getMonth()]
              }/${xValue.getFullYear()}</th>`
              tableRoot.appendChild(titleRow)
              this._chart.data.datasets.forEach((dataset) => {
                let datasetLabel = 'Users Who Did Not Report'
                if (dataset.label === 'Users Who Clicked And Reported (%)') {
                  datasetLabel = 'Users Who Clicked And Reported'
                } else if (dataset.label === 'Users Who Did Not Click And Reported (%)') {
                  datasetLabel = 'Users Who Did Not Click And Report'
                }
                let dataValue = dataset.data[tooltipModel.dataPoints[0].index]
                let backgroundColor = dataset.backgroundColor || '#000'
                let tr = document.createElement('tr')
                tr.innerHTML = `
                <td>
                    <span style="background-color:${backgroundColor}; width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 5px;"></span>
                    ${datasetLabel}:
                </td>
                <td style="font-weight:600">${dataValue.y}%</td>
            `
                if (
                  dataset.label !==
                  this._chart.data.datasets[tooltipModel.dataPoints[0].datasetIndex].label
                ) {
                  tr.style.fontWeight = 'normal'
                }

                tr.style.display = 'flex'
                tr.style.justifyContent = 'space-between'
                tr.style.paddingBottom = '6px'
                tableRoot.appendChild(tr)
              })
              const index = tooltipModel.dataPoints[0].index
              const totalPhishingReportRate =
                this._chart.data.datasets[0].data[index].y +
                this._chart.data.datasets[1].data[index].y
              let lastTr = document.createElement('tr')
              lastTr.innerHTML = `
                <td>

                    Phishing Report Rate:
                </td>
                <td style="font-weight:600;">${totalPhishingReportRate}%</td>
            `
              lastTr.style.borderTop = '1px solid #E0E0E0'
              lastTr.style.display = 'flex'
              lastTr.style.justifyContent = 'space-between'
              lastTr.style.paddingTop = '8px'
              tableRoot.appendChild(lastTr)
              let isIncreased = false
              let comparatorValue = 0
              let dataIndex = tooltipModel.dataPoints[0].index
              if (dataIndex > 0) {
                const datasets = this._chart.data.datasets
                const beforeClickedData = datasets[1].data[dataIndex - 1]?.y
                const beforeNotClickedData = datasets[0].data[dataIndex - 1]?.y
                const currentClickedData = datasets[1].data[dataIndex]?.y
                const currentNotClickedData = datasets[0].data[dataIndex]?.y
                comparatorValue =
                  currentClickedData -
                  beforeClickedData +
                  (currentNotClickedData - beforeNotClickedData)
                isIncreased = comparatorValue > 0
              }
              if (comparatorValue < 0) comparatorValue = -comparatorValue
              tooltipFooter.style.background = isIncreased ? '#43A047' : '#E6A23C'
              const explanationText = isIncreased ? ' increased by' : ' decreased by'
              tooltipFooter.style.opacity = dataIndex === 0 || comparatorValue === 0 ? 0 : 1
              tooltipFooter.innerHTML = `<th style="text-align: left; font-size:12px; font-weight: normal; display: block;">Phishing reporting ${explanationText} <span style="font-weight:700;">${comparatorValue}%</span> in simulation users</th>`
            }
            this._chart.canvas.addEventListener('mouseout', () => {
              tooltipEl.style.opacity = 0
              tooltipEl.style.display = 'none'
            })
          },
          xPadding: 12,
          yPadding: 12
        },
        plugins: {
          datalabels: {
            display: true,
            align: 'end',
            anchor: 'end',
            offset: -2,
            color: '#000',
            formatter: function (value, context) {
              if (context.dataset.label === 'Not Reported (%)' && value.annotations) {
                return value.annotations.definition
              }
              return ''
            },
            font: {
              size: 9,
              family: 'Open Sans, sans-serif',
              weight: 'normal'
            },
            borderRadius: 4,
            padding: 6
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
