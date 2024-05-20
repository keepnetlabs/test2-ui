<template>
  <WidgetLoading :loading="isLoading">
    <template #skeleton-content>
      <ExecutiveWidgetContainer>
        <ExecutiveWidgetHeader
          title="Consolidated Phishing Simulation Metrics"
          subtitle="Unified Metrics for SMS, Voice, QR, Callback, and Email Simulations"
          :edit-mode="editMode"
          @on-delete="handleDelete"
          @on-edit="handleEdit"
        />
        <ExecutiveWidgetBody>
          <template v-if="true">
            <BarChart
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
import BarChart from '@/components/Common/Charts/Bar.vue'
import ExecutiveWidgetContainer from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetContainer.vue'
import ExecutiveWidgetHeader from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetHeader.vue'
import ExecutiveWidgetBody from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetBody.vue'

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
    calculateData() {
      this.chartData = {
        labels: ['Azure DevOps Mention', 'Meta Login', 'Amazon Password'],
        datasets: [
          {
            label: 'Clicked (%)',
            type: 'bar',
            data: [
              { y: 70, x: 1704056400000 },
              { y: 20, x: 1706734800000 },
              { y: 10, x: 1709240400000 }
            ],
            backgroundColor: '#2196F3',
            borderColor: '#2196F3',
            pointRadius: 3,
            borderWidth: 2,
            lineTension: 0,
            fill: false,
            stack: 1,
            order: 3,
            barThickness: 32
          },
          {
            label: 'Not Clicked (%)',
            type: 'bar',
            data: [
              { y: 20, x: 1704056400000 },
              { y: 70, x: 1706734800000 },
              { y: 20, x: 1709240400000 }
            ],
            backgroundColor: '#43A047',
            borderColor: '#43A047',
            fill: false,
            borderDash: [5, 5],
            borderWidth: 2,
            lineTension: 0,
            stack: 1,
            order: 3,
            barThickness: 32
          }
        ]
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
                labelString: 'Phishing Report Rate (%)',
                fontColor: '#383B41'
              },
              offset: true,
              gridLines: {
                display: true,
                color: 'rgba(128, 151, 177, 0.3)',
                borderDash: [3]
              },
              ticks: {
                min: 0,
                max: 100,
                labelOffset: 0,
                beginAtZero: true,
                padding: -2,
                fontColor: '#383B41',
                lineHeight: 1.58
              }
            }
          ],
          xAxes: [
            {
              display: true,
              offset: true,
              type: 'time',
              scaleLabel: {
                display: true,
                labelString: 'Month/Year',
                fontColor: '#383B41'
              },
              time: {
                unit: 'month',
                min: 1704056400000,
                max: 1709240400000
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
            let tooltipEl = document.getElementById('chartjs-tooltip')

            if (!tooltipEl) {
              tooltipEl = document.createElement('div')
              tooltipEl.id = 'chartjs-tooltip'
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
            tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px'
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
            tooltipFooter.style.fontSize = '14px'
            tooltipFooter.style.borderRadius = '8px'
            tooltipFooter.style.color = '#fff'
            tooltipFooter.style.padding = '16px'
            tooltipFooter.style.maxWidth = '280px'
            tooltipFooter.style.fontWeight = 'normal'
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
                    ${datasetLabel}:
                </td>
                <td>${dataValue.y}</td>
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
              let lastTr = document.createElement('tr')
              lastTr.innerHTML = `
                <td>

                    Phishing Report Rate:
                </td>
                <td>70</td>
            `
              lastTr.style.borderTop = '1px solid #E0E0E0'
              lastTr.style.display = 'flex'
              lastTr.style.justifyContent = 'space-between'
              lastTr.style.paddingTop = '8px'
              tableRoot.appendChild(lastTr)
              tooltipFooter.style.background = selectedBackgroundColor
              const explanationText =
                selectedLabel === 'Clicked (%)'
                  ? ' of the users who did click the email also reporting it.'
                  : ' of users identifying and reporting phishing in simulation engagements'
              tooltipFooter.innerHTML = `<th style="text-align: left; font-weight: normal; display: block;"><span style="font-weight:700;">${selectedValue.y}%</span>${explanationText}</th>`
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
            offset: 12,

            color: '#383B41',
            formatter: function (value, context) {
              if (context.dataset.label === 'Not Clicked (%)' && context.dataIndex === 1) {
                return '---- Reporting practices have steadily improved'
              }
              if (context.dataset.label === 'Not Clicked (%)' && context.dataIndex === 2) {
                return 'Significant decrease in reporting practices ----'
              }
              return ''
            },
            align: function (context) {
              if (context.dataset.label === 'Not Clicked (%)' && context.dataIndex === 1) {
                return 'right'
              }
              return 'left'
            },
            anchor: function (context) {
              if (context.dataset.label === 'Not Clicked (%)' && context.dataIndex === 1) {
                return 'right'
              }
              return 'left'
            },
            font: {
              size: 10,
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
