<template>
  <WidgetLoading :loading="isLoading">
    <template #skeleton-content>
      <ExecutiveWidgetContainer>
        <ExecutiveWidgetHeader
          title="Top Riskiest Users"
          subtitle="Human Risk Score for Highest-Risk Users"
          :edit-mode="editMode"
          @on-delete="handleDelete"
          @on-edit="handleEdit"
        />
        <ExecutiveWidgetBody>
          <template v-if="true">
            <HorizontalBarChart
              v-if="chartData.datasets"
              :chart-data="chartData"
              :chart-options="chartOptions"
            />
          </template>
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
import { createExecutiveReportChartData } from '@/components/ExecutiveReports/ExecutiveReportsWidget/utils'
import { CHART_COLORS } from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'
export default {
  name: 'ExecutiveReportsTopRiskiestUsers',
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
    }
  },
  data() {
    return {
      isLoading: false,
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      chartOptions: {},
      chartData: {}
    }
  },
  created() {
    this.calculateData()
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
          console.log('data', data)
          this.chartOptions = {
            indexAxis: 'y',
            responsive: true,
            padding: 24,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  beginAtZero: true,
                  offset: true,
                  gridLines: {
                    display: true,
                    color: 'rgba(128, 151, 177, 0.3)',
                    borderDash: [3]
                  },
                  ticks: {
                    labelOffset: 0,
                    beginAtZero: true,
                    padding: 0,
                    fontColor: '#383B41',
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
                    labelString: 'Human Risk Score',
                    fontColor: '#383B41'
                  },
                  gridLines: {
                    display: true,
                    color: 'rgba(128, 151, 177, 0.3)',
                    borderDash: [3]
                  },
                  ticks: {
                    min: 0,
                    max: 100,
                    stepSize: 20,
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
                })
              },
              xPadding: 12,
              yPadding: 12
            },
            plugins: {
              datalabels: {
                display: true,
                align: 'center',
                offset: 12,
                anchor: 'center',
                color: 'white',
                clamp: true,
                formatter: function (value) {
                  return value.x
                },
                borderRadius: 4,
                padding: 6
              }
            }
          }
          this.isLoading = false
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    calculateData() {
      this.chartData = {
        xLabels: [0, 100],
        yLabels: [
          'Desirae Baptista',
          'Jakob Dokidis',
          'Ann Schleifer',
          'Marilyn Geidt',
          'Jakob Stanton'
        ],
        datasets: [
          {
            label: 'Desirae Baptista',
            data: [
              {
                y: 'Desirae Baptista',
                x: 90,
                details: {
                  Email: 'desirae.baptista@ku.edu',
                  Department: 'IT'
                }
              },
              {
                y: 'Jakob Dokidis',
                x: 20,
                details: { Email: 'jakob.dokidis@ku.edu', Department: 'IT' }
              },
              {
                y: 'Ann Schleifer',
                x: 10,
                details: { Email: 'ann.schleifer@ku.edu', Department: 'IT' }
              },
              {
                y: 'Marilyn Geidt',
                x: 25,
                details: { Email: 'marilyn.geidt@ku.edu', Department: 'IT' }
              },
              {
                y: 'Jakob Stanton',
                x: 85,
                details: { Email: 'jakob.stanton@ku.edu', Department: 'IT' }
              }
            ],
            barThickness: 32,
            backgroundColor: ['#B83A3A', '#F56C6C', '#F56C6C', '#F56C6C', '#F56C6C'],
            borderColor: ['#B83A3A', '#F56C6C', '#F56C6C', '#F56C6C', '#F56C6C'],
            borderWidth: 1
          }
        ]
      }
      this.chartOptions = {
        indexAxis: 'y',
        responsive: true,
        padding: 24,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              beginAtZero: true,
              offset: true,
              gridLines: {
                display: true,
                color: 'rgba(128, 151, 177, 0.3)',
                borderDash: [3]
              },
              ticks: {
                labelOffset: 0,
                beginAtZero: true,
                padding: 0,
                fontColor: '#383B41',
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
                labelString: 'Human Risk Score',
                fontColor: '#383B41'
              },
              gridLines: {
                display: true,
                color: 'rgba(128, 151, 177, 0.3)',
                borderDash: [3]
              },
              ticks: {
                min: 0,
                max: 100,
                stepSize: 20,
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
            })
          },
          xPadding: 12,
          yPadding: 12
        },
        plugins: {
          datalabels: {
            display: true,
            align: 'center',
            offset: 12,
            anchor: 'center',
            color: 'white',
            clamp: true,
            formatter: function (value) {
              return value.x
            },
            borderRadius: 4,
            padding: 6
          }
        }
      }
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
