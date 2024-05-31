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
          <template v-if="true">
            <BarChart v-if="chartData" :chart-data="chartData" :chart-options="chartOptions" />
          </template>
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
import { CHART_COLORS } from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'

export default {
  name: 'ExecutiveReportsRiskScoreTrendAcrossIndustries',
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
    }
  },
  data() {
    return {
      isLoading: false,
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
    this.callForData()
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
      const monthNamesLong = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
      getExecutiveReportChartData(payload)
        .then((response) => {
          const {
            data: { data }
          } = response || {}
          const { valueEnums, datasets } = createExecutiveReportChartData(data[0].widgetDatas)
          const newDatasets = []
          for (let itemType of valueEnums) {
            const typedItems = datasets.filter((item) => item.result === itemType)
            if (itemType.includes('Industry Avg (')) {
              newDatasets.push({
                type: 'line',
                label: itemType,
                ...CHART_COLORS['Industry Avg'],
                data: typedItems
              })
            } else {
              newDatasets.push({
                type: 'line',
                label: itemType,
                ...CHART_COLORS[itemType],
                data: typedItems
              })
            }
          }
          const maxFirstY = Math.max(...newDatasets[0].data.map((item) => item.y))
          const maxSecondY = Math.max(...newDatasets[1].data.map((item) => item.y))
          const maxThirdY = Math.max(...newDatasets[2].data.map((item) => item.y))
          const maxY = Math.max(maxFirstY, maxSecondY, maxThirdY)
          this.chartData = {
            datasets: newDatasets
          }
          this.chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  beginAtZero: true,
                  position: 'left',
                  scaleLabel: {
                    display: true,
                    labelString: 'Phishing Risk Score'
                  },
                  offset: true,
                  gridLines: {
                    display: true,
                    color: 'rgba(128, 151, 177, 0.3)',
                    borderDash: [3]
                  },
                  ticks: {
                    min: 0,
                    max: maxY > 100 ? maxY : 100,
                    stepSize: maxY > 100 ? Math.ceil(maxY / 6 / 2) * 2 : 20,
                    labelOffset: 0,
                    beginAtZero: true,
                    padding: -2,
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
                    unit: 'month'
                  },
                  scaleLabel: {
                    display: true,
                    labelString: 'Month/Year'
                  },
                  gridLines: {
                    display: true,
                    color: 'rgba(128, 151, 177, 0.3)',
                    borderDash: [3]
                  }
                }
              ]
            },
            legend: {
              display: true,
              position: 'top',
              labels: {
                usePointStyle: true,
                fontColor: '#757575',
                generateLabels(chart = {}) {
                  const { data } = chart
                  return data.datasets.map((item, index) => {
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
                let tooltipEl = document.getElementById('chartjs-tooltip-risk-score-trend')

                if (!tooltipEl) {
                  tooltipEl = document.createElement('div')
                  tooltipEl.id = 'chartjs-tooltip-risk-score-trend'
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

                tooltipEl.style.opacity = 1
                tooltipEl.style.position = 'absolute'
                tooltipEl.style.left =
                  position.left + window.pageXOffset + tooltipModel.caretX + 'px'
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
                  const xValue = new Date(tooltipModel.dataPoints[0].xLabel)
                  titleRow.innerHTML = `<th style="text-align: left; display: block; padding-bottom: 8px; font-weight: bold;">${
                    monthNamesLong[xValue.getMonth()]
                  }/${xValue.getFullYear()}</th>`
                  tableRoot.appendChild(titleRow)

                  let selectedBackgroundColor = ''
                  let selectedLabel = ''
                  let selectedValue = ''
                  this._chart.data.datasets.forEach((dataset, i) => {
                    let datasetLabel = dataset.label
                    let dataValue = dataset.data[tooltipModel.dataPoints[0].index]
                    let backgroundColor = dataset.backgroundColor || '#000'

                    let tr = document.createElement('tr')
                    tr.innerHTML = `
                <td>
                    <span style="background-color:${backgroundColor}; width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 5px;"></span>
                    ${datasetLabel}:&nbsp;
                </td>
                <td>${dataValue.y}%</td>
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
                })
              },
              xPadding: 16,
              yPadding: 16
            },
            plugins: {
              datalabels: {
                display: true,
                align: 'end',
                anchor: 'center',
                color: '#000',
                formatter: function (value, context) {
                  if (
                    context.dataset.label === 'Company Phishing Risk Score' &&
                    value.annotations
                  ) {
                    return value.annotations.definition
                  }
                  return ''
                },
                font: {
                  size: 12,
                  color: '#383B41',
                  weight: 'normal'
                },
                backgroundColor: function (context) {
                  /*
                  if (
                    context.dataset.label === 'Company Phishing Risk Score' &&
                    context.dataIndex === 1
                  ) {
                    return 'rgba(231,76,60,0.8)'
                  }
                  return 'rgba(0,0,0,0)'

                   */
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
    handleDelete() {
      this.$emit('on-delete', this.card)
    },
    handleEdit() {
      this.$emit('on-edit', this.card)
    }
  }
}
</script>
