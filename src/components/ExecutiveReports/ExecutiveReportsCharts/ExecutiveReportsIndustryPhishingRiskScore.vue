<template>
  <WidgetLoading :loading="isLoading">
    <template #skeleton-content>
      <ExecutiveWidgetContainer>
        <ExecutiveWidgetHeader
          :title="getTitle"
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
              :chart-data="chartData"
              :chart-options="chartOptions"
              :add-custom-legend-label-height="16"
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
import BarChart from '@/components/Common/Charts/Bar.vue'
import ExecutiveWidgetContainer from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetContainer.vue'
import ExecutiveWidgetHeader from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetHeader.vue'
import ExecutiveWidgetBody from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetBody.vue'
import { getExecutiveReportChartData } from '@/api/reports'

export default {
  name: 'ExecutiveReportsIndustryPhishingRiskScore',
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
      industryAverageObj: null,
      empty: {
        message: 'You do not have any report conclusion'
      },
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
                ctx.fillText(percentage, x + ctx.measureText(text).width - 7, y + 0.5)
                ctx.font = `${fontSize}px ${fontFamily}`
              }
            })
          }
        }
      ]
    }
  },
  computed: {
    getTitle() {
      if (this.industryAverageObj) {
        return `${this.card.title}: ${this.industryAverageObj.value}%`
      }
      return this.card.title
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
      const xLabels = data[0].widgetDatas.map((obj) => obj.dataObject.name)
      const phishingRiskScoreData = []
      const phishingSimulationMetricsData = []
      const phishReportersData = []
      const industryAverageData = []
      let maxY = 0
      const industryAverageObj = data[0]?.widgetDatas[0]?.values?.find(
        (obj) => obj.name === 'IndustryAverage'
      )
      this.industryAverageObj = industryAverageObj
      const totalUserActions = data[0]?.widgetDatas.reduce((acc, item) => {
        return acc + item.dataObject.totalReportedCount + item.dataObject.totalMetrics
      }, 0)
      let maxTotalUserActions = totalUserActions
      const remainder = Math.floor(maxTotalUserActions / 50)
      if (!remainder) {
        maxTotalUserActions = 100
      } else {
        maxTotalUserActions = remainder * 50 + 50
      }
      data[0].widgetDatas.map((obj) => {
        const generalObj = {
          x: obj.dataObject.name,
          dataObject: obj.dataObject
        }
        obj.values.map((val) => {
          if (val.name === 'RiskScore') {
            phishingRiskScoreData.push({ ...generalObj, y: val.value })
          } else if (val.name === 'TotalMetrics') {
            phishingSimulationMetricsData.push({ ...generalObj, y: val.value })
          } else if (val.name === 'TotalReportedCount') {
            phishReportersData.push({ ...generalObj, y: val.value })
          } else if (val.name === 'IndustryAverage') {
            industryAverageData.push({ ...generalObj, y: val.value })
          }
          if (val.value > maxY) {
            maxY = val.value
          }
        })
        return {
          x: obj.dataObject.name,
          y: obj.dataObject.fullName,
          details: {
            Email: obj.dataObject.email,
            Department: obj.dataObject.department
          }
        }
      })
      const maxPhishingRiskScore = Math.max(...phishingRiskScoreData.map((obj) => obj.y))
      this.chartData = {
        labels: xLabels,
        datasets: [
          {
            label: 'Industry Average',
            type: 'line',
            data: industryAverageData,
            backgroundColor: '#1173C1',
            borderColor: '#1173C1',
            fill: false,
            yAxisID: 'A',
            pointHoverRadius: 0,
            pointRadius: 0,
            borderDash: [20, 20],
            borderWidth: 2,
            lineTension: 0,
            order: 1
          },
          {
            label: 'Phish Reporters',
            type: 'bar',
            yAxisID: 'B',
            data: phishReportersData,
            backgroundColor: '#43A047',
            borderColor: '#43A047',
            fill: false,
            borderDash: [5, 5],
            borderWidth: 2,
            lineTension: 0,
            stack: 'Stack 1',
            order: 3,
            barThickness: 32
          },
          {
            label: 'Phishing Risk Score %',
            type: 'line',
            yAxisID: 'A',
            data: phishingRiskScoreData,
            backgroundColor: '#383B41',
            borderColor: '#383B41',
            fill: false,
            pointRadius: 3,
            pointHoverRadius: 3,
            lineTension: 0,
            order: 2
          },
          {
            label: 'Phishing Simulation Metrics',
            type: 'bar',
            yAxisID: 'B',
            data: phishingSimulationMetricsData,
            backgroundColor: '#F56C6C',
            borderColor: '#F56C6C',
            pointRadius: 3,
            borderWidth: 2,
            lineTension: 0,
            fill: false,
            stack: 'Stack 1',
            order: 3,
            barThickness: 32
          }
        ]
      }
      this.chartOptions = {
        responsive: true,
        devicePixelRatio: 2,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              id: 'A',
              beginAtZero: true,
              position: 'left',
              scaleLabel: {
                display: true,
                labelString: 'Phishing Risk Score',
                fontFamily: 'Open-sans,sans-serif',
                fontColor: '#383B41'
              },
              offset: false,
              gridLines: {
                display: true,
                color: '#F2F2F2',
                drawBorder: false,
                zeroLineColor: '#757575',
                zeroLineWidth: 2
              },
              ticks: {
                min: 0,
                max: maxY > 100 ? maxY : 100,
                stepSize: maxY > 100 ? Math.ceil(maxY / 5 / 2) * 2 : 20,
                labelOffset: 0,
                beginAtZero: true,
                padding: 12,
                fontColor: '#383B41',
                fontFamily: 'Open-sans,sans-serif',
                lineHeight: 1.58,
                callback: function (value) {
                  return value + '%'
                }
              }
            },
            {
              id: 'B',
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Total User Actions',
                fontColor: '#383B41'
              },
              gridLines: {
                display: false
              },
              position: 'right',
              ticks: {
                min: 0,
                max: totalUserActions < 100 ? 100 : maxTotalUserActions,
                stepSize: totalUserActions < 100 ? 20 : maxTotalUserActions / 5,
                fontFamily: 'Open Sans, sans-serif',
                beginAtZero: true
              }
            }
          ],
          xAxes: [
            {
              display: true,
              offset: true,
              scaleLabel: {
                display: true,
                labelString: 'Campaigns',
                fontColor: '#383B41'
              },
              gridLines: {
                display: false,
                color: 'rgba(128, 151, 177, 0.3)',
                borderDash: [3]
              },
              ticks: {
                labelOffset: 0,
                fontColor: 'rgba(56, 59, 65, 0.72)',
                fontStyle: '600',
                fontSize: 9,
                fontFamily: 'Open-sans,sans-serif',
                callback(value) {
                  let text = value
                  if (xLabels.length > 9) {
                    text = text.length >= 30 ? text.substring(0, 27) + '...' : text
                  }
                  return text
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
            fontColor: '#383B41',
            generateLabels(chart = {}) {
              const { data } = chart
              return data.datasets.map((item, index) => {
                if (item.label.includes('Industry Average')) {
                  const label = item.label.includes('Industry Average')
                    ? industryAverageObj?.label
                    : item.label
                  const splittedLabel = label.split(' ')
                  return {
                    text: Array.from(label + label.substring(0, label.length / 1.4))
                      .fill('')
                      .join(' '),
                    fillStyle: item.borderColor,
                    lineWidth: 0,
                    datasetIndex: index,
                    textParts: [splittedLabel[0] + ' ' + splittedLabel[1], splittedLabel[2]]
                  }
                }
                return {
                  text: item.label,
                  fillStyle: item.borderColor,
                  lineWidth: 0,
                  datasetIndex: index
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
            let tooltipEl = document.getElementById('chartjs-tooltip-phishing-risk-score')

            if (!tooltipEl) {
              tooltipEl = document.createElement('div')
              tooltipEl.id = 'chartjs-tooltip-phishing-risk-score'
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
              let tableRoot = tooltipContent
              tableRoot.innerHTML = ''

              let dataIndex = tooltipModel.dataPoints[0].index
              let dataPoint = this._chart.data.datasets[0].data[dataIndex]
              let titleRow = document.createElement('div')
              titleRow.style.fontWeight = 'bold'
              titleRow.style.paddingBottom = '8px'
              titleRow.textContent = dataPoint.x
              tableRoot.appendChild(titleRow)
              const {
                phishingType,
                Frequency,
                instanceGroupCount,
                startDate,
                totalClickedCount,
                totalSubmittedCount,
                totalMfaSubmittedCount,
                totalAttachmentOpenedCount,
                totalScanQRCount,
                totalVishedCount,
                totalCalledCount,
                totalEnteredCount,
                totalReportedCount
              } = dataPoint.dataObject
              const detailsObj = {}
              detailsObj['Campaign Type'] = phishingType
              detailsObj['Frequency'] = Frequency
              detailsObj['Instances'] = instanceGroupCount
              detailsObj['Start Time'] = startDate
              if (phishingType === 'Phishing') {
                detailsObj['Clicked Link'] = totalClickedCount
                detailsObj['Submitted Data'] = totalSubmittedCount
                detailsObj['Submitted MFA Code'] = totalMfaSubmittedCount
                detailsObj['Open Attachment'] = totalAttachmentOpenedCount
                detailsObj['Reports'] = totalReportedCount
              } else if (phishingType === 'Quishing') {
                detailsObj['Scanned QR Link'] = totalScanQRCount
                detailsObj['Submitted Data'] = totalSubmittedCount
                detailsObj['Submitted MFA Code'] = totalMfaSubmittedCount
                detailsObj['Reports'] = totalReportedCount
              } else if (phishingType === 'Vishing') {
                detailsObj['Total Vished Count'] = totalVishedCount
                detailsObj['Reports'] = totalReportedCount
              } else if (phishingType === 'Smishing') {
                detailsObj['Clicked Link'] = totalClickedCount
                detailsObj['Submitted Data'] = totalSubmittedCount
                detailsObj['Submitted MFA Code'] = totalMfaSubmittedCount
                detailsObj['Reports'] = totalReportedCount
              } else if (phishingType === 'Callback') {
                detailsObj['Called Back'] = totalCalledCount
                detailsObj['Entered Digits'] = totalEnteredCount
                detailsObj['Reports'] = totalReportedCount
              }
              for (const [key, value] of Object.entries(detailsObj)) {
                let fieldRow = document.createElement('div')
                fieldRow.style.display = 'flex'
                fieldRow.style.justifyContent = 'space-between'
                fieldRow.style.paddingBottom = '6px'

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
            offset: 4,
            align({ dataIndex, dataset }) {
              const { data } = dataset
              if (dataIndex === dataset.data.length - 1) return 'top'
              if (dataIndex > 0) {
                if (data[dataIndex].y < data[dataIndex - 1].y) {
                  if (data[dataIndex - 1].y / data[dataIndex].y >= 2.01) {
                    if (data[dataIndex + 1] && data[dataIndex + 1].y > data[dataIndex].y) {
                      return 'bottom'
                    }
                  } else if (data[dataIndex + 1] && data[dataIndex + 1].y <= data[dataIndex].y) {
                    return 'top'
                  }
                  if (maxPhishingRiskScore / data[dataIndex].y > 100) {
                    return 'top'
                  }
                  return 'bottom'
                }
              }
              return 'end'
            },
            anchor: 'bottom',
            color: '#383B41',
            formatter: function (value, context) {
              if (context.dataset.label.includes('Phishing Risk Score') && value.y > 0) {
                return value.y + '%'
              }
              return ''
            },
            font: {
              size: 9,
              color: '#383B41',
              weight: '600'
            },
            backgroundColor: function (context) {
              return 'transparent'
            },
            borderRadius: 4,
            padding: 0
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
