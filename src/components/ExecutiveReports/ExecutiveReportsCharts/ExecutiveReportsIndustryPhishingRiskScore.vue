<template>
  <WidgetLoading :loading="isLoading">
    <template #skeleton-content>
      <ExecutiveWidgetContainer>
        <ExecutiveWidgetHeader
          title="Industry Phishing Risk Score"
          subtitle="Phishing risk score comparing user responses and report rates against an industry average."
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
            label: 'Phish Reporters',
            type: 'bar',
            data: [
              {
                y: 80,
                x: 'Azure DevOps Mention',
                details: {
                  'Clicked Link': 4,
                  'Submitted Data': 11,
                  'Submit MFA Code': 25,
                  'Open Attachment': 9,
                  Reports: 2
                }
              },
              {
                y: 100,
                x: 'Meta Login',
                details: {
                  'Clicked Link': 2,
                  'Submitted Data': 9,
                  'Submit MFA Code': 15,
                  'Open Attachment': 5,
                  Reports: 3
                }
              },
              {
                y: 0,
                x: 'Amazon Password',
                details: {
                  'Clicked Link': 0,
                  'Submitted Data': 0,
                  'Submit MFA Code': 0,
                  'Open Attachment': 0,
                  Reports: 0
                }
              }
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
          },
          {
            label: 'Phishing Simulation Metrics',
            type: 'bar',
            data: [
              {
                y: 180,
                x: 'Azure DevOps Mention',
                details: {
                  'Clicked Link': 4,
                  'Submitted Data': 11,
                  'Submit MFA Code': 25,
                  'Open Attachment': 9,
                  Reports: 2
                }
              },
              {
                y: 140,
                x: 'Meta Login',
                details: {
                  'Clicked Link': 2,
                  'Submitted Data': 9,
                  'Submit MFA Code': 15,
                  'Open Attachment': 5,
                  Reports: 3
                }
              },
              {
                y: 90,
                x: 'Amazon Password',
                details: {
                  'Clicked Link': 0,
                  'Submitted Data': 0,
                  'Submit MFA Code': 0,
                  'Open Attachment': 0,
                  Reports: 0
                }
              }
            ],
            backgroundColor: '#B83A3A',
            borderColor: '#B83A3A',
            pointRadius: 3,
            borderWidth: 2,
            lineTension: 0,
            fill: false,
            stack: 1,
            order: 3,
            barThickness: 32
          },
          {
            label: 'All Industry Avg',
            type: 'line',
            data: [
              { y: 270, x: 'Azure DevOps Mention' },
              { y: 250, x: 'Meta Login' },
              { y: 100, x: 'Amazon Password' }
            ],
            backgroundColor: '#B6791D',
            borderColor: '#B6791D',
            fill: false,
            pointHoverRadius: 3,
            lineTension: 0,
            order: 2
          },
          {
            label: 'Phishing Risk Score %',
            type: 'line',
            data: [
              { y: 160, x: 'Azure DevOps Mention' },
              { y: 160, x: 'Meta Login' },
              { y: 160, x: 'Amazon Password' }
            ],
            backgroundColor: '#71ABDA',
            borderColor: '#71ABDA',
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            borderDash: [30, 30],
            borderWidth: 10,
            order: 2
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
                labelString: 'Phishing Risk Score',
                fontColor: '#B6791D'
              },
              offset: true,
              gridLines: {
                display: true,
                color: 'rgba(128, 151, 177, 0.3)',
                borderDash: [3]
              },
              ticks: {
                min: 0,
                max: 300,
                labelOffset: 0,
                beginAtZero: true,
                padding: -2,
                fontColor: '#B6791D',
                lineHeight: 1.58
              }
            },
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Total User Actions'
              },
              gridLines: {
                display: false
              },
              position: 'right',
              ticks: {
                min: 0,
                max: 500,
                stepSize: 100,
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
                labelString: 'Campaigns'
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
            align: 'end',
            anchor: 'end',
            offset: -2,
            color: '#B6791D',
            formatter: function (value, context) {
              if (context.dataset.label === 'All Industry Avg') {
                return value.y + '%'
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
