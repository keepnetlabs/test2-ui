<template>
  <WidgetLoading :loading="isLoading">
    <template #skeleton-content>
      <ExecutiveWidgetContainer>
        <ExecutiveWidgetHeader :title="card.title" :subtitle="card.subtitle" :edit-mode="false" />
        <ExecutiveWidgetBody>
          <template v-if="!isEmpty">
            <HorizontalBarChart
              v-if="chartData.datasets"
              :chart-data="chartData"
              :chart-options="chartOptions"
              :custom-plugin="customPlugin"
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
import HorizontalBarChart from '@/components/Common/Charts/HorizontalBar.vue'
import ExecutiveWidgetBody from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetBody.vue'
import { getExecutiveReportChartData } from '@/api/reports'
import labels from '@/model/constants/labels'
import { CHART_COLORS } from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'

export default {
  name: 'CampaignManagerStatisticsBar',
  components: {
    ExecutiveWidgetBody,
    HorizontalBarChart,
    ExecutiveWidgetHeader,
    ExecutiveWidgetContainer,
    WidgetLoading
  },
  props: {
    card: {
      type: Object,
      default: () => {}
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
      }
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.isLoading = true
      const payload = {
        widgetIds: [this.card.resourceId],
        datePeriod: 1,
        startDate: '04/11/2024 15:47',
        endDate: '04/08/2024 15:47'
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
              scaleLabel: {
                display: true,
                labelString: 'Regions',
                fontColor: '#383B41'
              },
              gridLines: {
                display: false,
                drawBorder: false
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
                labelString: 'Number of Phishing Templates',
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
                max: 100,
                stepSize: 20,
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
          display: false
        },
        tooltips: {
          enabled: false,
          custom: function (tooltipModel) {
            let tooltipEl = document.getElementById('chartjs-tooltip-statistics-bar')

            if (!tooltipEl) {
              tooltipEl = document.createElement('div')
              tooltipEl.id = 'chartjs-tooltip-statistics-bar'
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
            tooltipEl.style.zIndex = '100'
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
              titleRow.textContent = dataPoint.y
              tableRoot.appendChild(titleRow)
              dataPoint.details.Score = dataPoint.x
              for (const [key, value] of Object.entries(dataPoint.details)) {
                let fieldRow = document.createElement('div')
                fieldRow.style.display = 'flex'
                fieldRow.style.justifyContent = 'space-between'
                fieldRow.style.paddingBottom = '4px'

                let fieldLabel = document.createElement('span')
                fieldLabel.textContent = `${key}:`
                fieldRow.appendChild(fieldLabel)

                let fieldValue = document.createElement('span')
                fieldValue.style.fontWeight = '700'
                fieldValue.style.paddingLeft = '8px'
                fieldValue.textContent = value
                fieldRow.appendChild(fieldValue)

                tableRoot.appendChild(fieldRow)
              }
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
            offset: -2,
            anchor: 'end',
            color: '#383B41',
            clamp: true,
            formatter: function (value) {
              if (!value.x) return ''
              return value.x + '%'
            },
            borderRadius: 4,
            padding: 6
          }
        }
      }
      if (!data[0].widgetDatas.length) {
        this.isEmpty = true
        return
      }
      const companies = data[0].widgetDatas.map((obj) => {
        return obj.dataObject.Company
      })
      const dataSetsData = data[0].widgetDatas.map((obj) => {
        return {
          x: obj.values[0].value,
          y: obj.dataObject.Company,
          details: {
            Score: obj.values[0].value,
            'Number of Users': obj.values[1].value
          }
        }
      })
      this.chartData = {
        xLabels: [0, 100],
        yLabels: companies,
        datasets: [
          {
            data: dataSetsData,
            barThickness: 20,
            backgroundColor: function (context) {
              const index = context.dataIndex
              const value = context.dataset.data[index].x
              return value > 60 ? '#1173C1' : 'rgba(17, 115, 193, 0.55)'
            },
            borderWidth: 1
          }
        ]
      }
      this.isEmpty = false
      this.isLoading = false
    }
  }
}
</script>
