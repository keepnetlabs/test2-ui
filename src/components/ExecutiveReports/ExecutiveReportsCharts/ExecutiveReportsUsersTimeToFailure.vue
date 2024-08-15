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
import labels from '@/model/constants/labels'
export default {
  name: 'ExecutiveReportsUsersTimeToFailure',
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
          ctx.save()
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
      const offenders = values.find((data) => data.name === 'CountRepeatOffender')?.value
      const simulated = values.find((data) => data.name === 'CountSimulated')?.value
      const offendersPercentage = values.find((data) => data.name === 'RepeatOffenderPercentage')
        ?.value
      const simulatedPercentage = values.find((data) => data.name === 'PercentageSimulated')?.value
      const companyAvg = new Image()
      companyAvg.src = require('../../../assets/img/company-avg.svg')
      const industryAvg = new Image()
      industryAvg.src = require('../../../assets/img/industry-avg.svg')
      this.chartOptions = {
        indexAxis: 'y',
        devicePixelRatio: 2,
        responsive: true,
        padding: 24,
        layout: {
          padding: {
            right: 0,
            left: 0
          }
        },
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              beginAtZero: true,
              gridLines: {
                display: false,
                drawBorder: false
              },
              scaleLabel: {
                display: true,
                labelString: 'Time to Respond (Seconds)',
                fontColor: '#383B41'
              },
              ticks: {
                padding: 0,
                fontSize: 12,
                fontFamily: 'Open Sans, sans-serif',
                fontStyle: '400',
                fontColor: 'rgba(56, 59, 65, 0.72)'
              }
            }
          ],
          xAxes: [
            {
              display: true,
              stacked: true,
              offset: false,
              scaleLabel: {
                display: true,
                labelString: 'Number Of Users',
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
                max: 600,
                stepSize: 100,
                fontFamily: 'Open Sans, sans-serif',
                fontColor: 'rgba(56, 59, 65, 0.72)',
                fontStyle: '600',
                fontSize: 9
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
            padding: 32,
            fontSize: 12,
            generateLabels: (chart = {}) => {
              const { data } = chart
              return [
                {
                  text: `${data.datasets[0].label}`,
                  fillStyle: data.datasets[0].backgroundColor,
                  lineWidth: 0,
                  datasetIndex: 0
                },
                {
                  text: `${data.datasets[1].label}`,
                  fillStyle: data.datasets[1].backgroundColor,
                  lineWidth: 0,
                  datasetIndex: 1
                },
                {
                  text: `Company Avg (Link Click/Data Submit)`,
                  datasetIndex: 2,
                  pointStyle: companyAvg
                },
                {
                  text: `Industry Avg (Link Click/Data Submit)`,
                  fillStyle: data.datasets[1].backgroundColor,
                  pointStyle: industryAvg,
                  datasetIndex: 3
                }
              ]
            }
          },
          onClick(e, legendItem) {
            const index = legendItem.datasetIndex
            const label = legendItem.text
            const ci = this.chart
            const meta = ci.getDatasetMeta(index)
            if (label === 'Company Avg (Link Click/Data Submit)') {
              const dataSubmitMeta = ci.getDatasetMeta(3)
              meta.hidden = meta.hidden === null ? !ci.data.datasets[2].hidden : null
              dataSubmitMeta.hidden =
                dataSubmitMeta.hidden === null ? !ci.data.datasets[3].hidden : null
            } else if (label === 'Industry Avg (Link Click/Data Submit)') {
              const dataSubmitMeta = ci.getDatasetMeta(5)
              const linkMeta = ci.getDatasetMeta(4)
              linkMeta.hidden = linkMeta.hidden === null ? !ci.data.datasets[4].hidden : null
              dataSubmitMeta.hidden =
                dataSubmitMeta.hidden === null ? !ci.data.datasets[5].hidden : null
            } else {
              meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null
            }

            ci.update()
          }
        },
        tooltips: {
          enabled: false,
          custom: function (tooltipModel) {
            let tooltipEl = document.getElementById('chartjs-tooltip-repeat-offenders-users-bar')

            if (!tooltipEl) {
              tooltipEl = document.createElement('div')
              tooltipEl.id = 'chartjs-tooltip-repeat-offenders-users-bar'
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
              this._chart.data.datasets.forEach((dataset, i) => {
                let datasetLabel = dataset.label
                let dataValue = dataset.data[0]
                let backgroundColor = dataset.backgroundColor
                let tr = document.createElement('tr')
                tr.innerHTML = `
                <td>
                    <span style="background-color:${backgroundColor}; width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 5px;"></span>
                    ${datasetLabel}:&nbsp;
                </td>
                <td style="font-weight: 600">${dataValue || 0}%</td>
            `

                tr.style.display = 'flex'
                tr.style.justifyContent = 'space-between'
                if (i === 0) tr.style.paddingBottom = '6px'
                tableRoot.appendChild(tr)
              })
            }
            this._chart.canvas.addEventListener('mouseout', () => {
              tooltipEl.style.opacity = 0
            })
          },
          xPadding: 12,
          yPadding: 12
        },
        plugins: {
          datalabels: {
            display: false
          }
        }
      }
      this.chartData = {
        yLabels: [60, 50, 40, 30, 20, 10, 0],
        datasets: [
          {
            label: 'Clicked',
            data: [
              { x: 0, y: 0 },
              { x: 50, y: 10 },
              { x: 80, y: 20 },
              { x: 250, y: 30 },
              { x: 170, y: 40 },
              { x: 170, y: 50 },
              { x: 400, y: 60 }
            ],
            barThickness: 20,
            backgroundColor: '#F56C6C',
            borderWidth: 1,
            stack: 'Stack 1',
            order: 1
          },
          {
            label: 'Submitted Data',
            data: [
              { x: 50, y: 0 },
              { x: 50, y: 10 },
              { x: 80, y: 20 },
              { x: 250, y: 30 },
              { x: 170, y: 40 },
              { x: 170, y: 50 },
              { x: 40, y: 60 }
            ],
            barThickness: 20,
            backgroundColor: '#B83A3A',
            borderWidth: 1,
            stack: 'Stack 1',
            order: 1
          },
          {
            label: 'Company Avg Link Click',
            type: 'line',
            id: 'avg-link-click',
            data: [
              { x: 0, y: 20 },
              { x: 100, y: 20 },
              { x: 200, y: 20 },
              { x: 300, y: 20 },
              { x: 400, y: 20 },
              { x: 500, y: 20 }
            ],
            backgroundColor: '#1173C1',
            borderColor: '#1173C1',
            fill: false,
            pointRadius: 0,
            pointStyle: 'dash',
            lineTension: 0,
            stack: 'Stack 2',
            order: 0
          },
          {
            label: 'Company Avg Data Submit',
            type: 'line',
            id: 'avg-data-submit',
            data: [
              { x: 0, y: 50 },
              { x: 100, y: 50 },
              { x: 200, y: 50 },
              { x: 300, y: 50 },
              { x: 400, y: 50 },
              { x: 500, y: 50 }
            ],
            backgroundColor: '#D1AD0C',
            borderColor: '#D1AD0C',
            fill: false,
            pointRadius: 0,
            pointStyle: 'dash',
            lineTension: 0,
            order: 0
          },
          {
            label: 'Industry Avg Link Click',
            type: 'line',
            id: 'avg-link-click',
            data: [
              { x: 0, y: 40 },
              { x: 100, y: 40 },
              { x: 200, y: 40 },
              { x: 300, y: 40 },
              { x: 400, y: 40 },
              { x: 500, y: 40 },
              { x: 600, y: 40 }
            ],
            backgroundColor: '#D1AD0C',
            borderColor: '#D1AD0C',
            pointHoverRadius: 0,
            pointRadius: 0,
            borderDash: [10, 10],
            borderWidth: 2,
            fill: false,
            pointStyle: 'dash',
            lineTension: 0,
            order: 0
          },
          {
            label: 'Industry Avg Data Submit',
            type: 'line',
            id: 'avg-data-submit',
            data: [
              { x: 0, y: 10 },
              { x: 100, y: 10 },
              { x: 200, y: 10 },
              { x: 300, y: 10 },
              { x: 400, y: 10 },
              { x: 500, y: 10 },
              { x: 600, y: 10 }
            ],
            backgroundColor: '#1173C1',
            borderColor: '#1173C1',
            pointHoverRadius: 0,
            pointRadius: 0,
            borderDash: [10, 10],
            borderWidth: 2,
            fill: false,
            pointStyle: 'dash',
            lineTension: 0,
            order: 0
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
