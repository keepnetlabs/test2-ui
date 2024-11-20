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
              add-data-plugin
              :chart-data="chartData"
              :chart-options="chartOptions"
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
export default {
  name: 'ExecutiveReportsSimulationCoverageBar',
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
      chartData: {}
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
      const nonSimulatedUsers = values.find((data) => data.name === 'CountNonSimulated')?.value
      const simulatedUsers = values.find((data) => data.name === 'CountSimulated')?.value
      let biggestValue = Math.floor(Math.max(nonSimulatedUsers, simulatedUsers))
      const nonSimulated = values.find((data) => data.name === 'NonSimulatedPercentage')?.value
      const simulated = values.find((data) => data.name === 'SimulatedPercentage')?.value
      biggestValue = 40
      if (biggestValue <= 20) {
        biggestValue = 20
      } else if (biggestValue > 20 && biggestValue <= 40) {
        biggestValue = 40
      } else if (biggestValue > 40 && biggestValue <= 60) {
        biggestValue = 60
      } else if (biggestValue > 60 && biggestValue <= 80) {
        biggestValue = 80
      } else {
        const remainder = Math.floor(biggestValue / 50)
        if (!remainder) {
          biggestValue = 100
        } else {
          biggestValue = remainder * 50 + 50
        }
      }
      this.chartData = {
        labels: ['Simulated users', 'Non-simulated users'],
        datasets: [
          {
            barThickness: 32,
            label: 'Percentage',
            data: [simulatedUsers, nonSimulatedUsers],
            backgroundColor: ['#00BCD4', '#FBF280'],
            borderColor: 'transparent',
            borderWidth: 1,
            order: 2
          }
        ]
      }
      this.chartOptions = {
        devicePixelRatio: 2,
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 24
          }
        },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                fontFamily: 'Open-sans,sans-serif',
                fontColor: '#383B41'
              },
              gridLines: {
                display: false
              },
              ticks: {
                fontColor: '#383B41',
                fontSize: 9,
                fontFamily: 'Open-sans,sans-serif'
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                min: 0,
                max: biggestValue,
                stepSize: Math.floor(biggestValue / 5),
                labelOffset: 0,
                padding: 12,
                fontColor: 'rgba(56, 59, 65, 0.72)',
                lineHeight: 1.58,
                fontFamily: 'Open-sans,sans-serif',
                beginAtZero: true
              },
              scaleLabel: {
                display: true,
                fontFamily: 'Open-sans,sans-serif',
                fontSize: 12,
                fontColor: '#383B41',
                labelString: 'Number of Users'
              },
              gridLines: {
                display: true,
                color: '#F2F2F2',
                drawBorder: false,
                zeroLineColor: '#757575',
                zeroLineWidth: 2
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
                let datasetLabel = 'Number of Users'
                let dataValue =
                  tooltipModel.dataPoints[0].label === 'Simulated users'
                    ? simulatedUsers
                    : nonSimulatedUsers
                let backgroundColor =
                  tooltipModel.dataPoints[0].label === 'Simulated users' ? '#00BCD4' : '#FBF280'
                let tr = document.createElement('tr')
                tr.innerHTML = `
                <td>
                    <span style="background-color:${backgroundColor}; width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 5px;"></span>
                    ${datasetLabel}:&nbsp;
                </td>
                <td style="font-weight: 600">${dataValue}</td>
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
            display: true,
            align: 'end',
            offset: -2,
            anchor: 'end',
            color: '#383B41',
            clamp: true,
            formatter: function (_, { dataIndex }) {
              const value = dataIndex === 0 ? simulated : nonSimulated
              return value + '%'
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
