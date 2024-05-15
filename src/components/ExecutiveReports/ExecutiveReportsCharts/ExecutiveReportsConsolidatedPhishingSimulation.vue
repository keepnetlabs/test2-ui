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
  name: 'ExecutiveReportsConsolidatedPhishingSimulation',
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
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Stacked Bar Dataset 1',
            type: 'bar',
            data: [10, 20, 30, 40, 50, 60, 70],
            backgroundColor: '#7BBD7E',
            borderColor: '#7BBD7E',
            borderWidth: 1,
            barThickness: 32,
            stack: 'Stack 1',
            order: 2
          },
          {
            label: 'Stacked Bar Dataset 2',
            type: 'bar',
            data: [20, 30, 40, 50, 60, 70, 80],
            backgroundColor: '#F49A34',
            borderColor: '#F49A34',
            borderWidth: 1,
            barThickness: 32,
            stack: 'Stack 1',
            order: 2
          },
          {
            label: 'Stacked Bar Dataset 2',
            type: 'bar',
            data: [20, 30, 40, 50, 60, 70, 80],
            backgroundColor: '#F49A34',
            borderColor: '#F49A34',
            borderWidth: 1,
            barThickness: 32,
            stack: 'Stack 1',
            order: 2
          },
          {
            label: 'Stacked Bar Dataset 2',
            type: 'bar',
            data: [150, 30, 40, 50, 110, 70, 80],
            backgroundColor: '#D6797C',
            borderColor: '#D6797C',
            borderWidth: 1,
            barThickness: 32,
            stack: 'Stack 1',
            order: 2
          },
          {
            label: 'Stacked Bar Dataset 2',
            type: 'bar',
            data: [20, 30, 40, 50, 60, 70, 80],
            backgroundColor: '#F9A7A7',
            borderColor: '#F9A7A7',
            borderWidth: 1,
            barThickness: 32,
            stack: 'Stack 1',
            order: 2
          },
          {
            label: 'Line Dataset',
            type: 'line',
            data: [150, 150, 150, 150, 150, 150, 150],
            backgroundColor: '#1173C1',
            borderColor: '#1173C1',
            fill: false,
            pointRadius: 3,
            borderDash: [5, 5],
            borderWidth: 2,
            order: 1
          },
          {
            label: 'Line Dataset',
            type: 'line',
            data: [200, 200, 200, 200, 200, 200, 200],
            backgroundColor: '#2196F3',
            borderColor: '#2196F3',
            fill: false,
            pointRadius: 0,
            borderDash: [30, 30],
            borderWidth: 10,
            order: 1
          },
          {
            label: 'Line Dataset',
            type: 'line',
            data: [50, 60, 70, 80, 200, 55, 110],
            backgroundColor: '#757575',
            borderColor: '#757575',
            fill: false,
            pointRadius: 3,
            borderWidth: 2,
            order: 1
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
                labelString: 'Phish Risk Score %'
              },
              offset: false,
              gridLines: {
                display: true,
                color: 'rgba(128, 151, 177, 0.3)',
                borderDash: [3]
              },
              ticks: {
                labelOffset: 0,
                beginAtZero: true,
                padding: -2,
                fontColor: 'rgba(176, 186, 201)',
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
                beginAtZero: true
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
          custom: function (tooltipModel, obj) {
            let tooltipEl = document.getElementById('chartjs-tooltip')

            if (!tooltipEl) {
              tooltipEl = document.createElement('div')
              tooltipEl.id = 'chartjs-tooltip'
              tooltipEl.innerHTML = '<table></table>'
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
            tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily
            tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px'
            tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle
            tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px'
            tooltipEl.style.pointerEvents = 'none'
            tooltipEl.style.background = 'white'
            tooltipEl.style.border = '1px solid #ccc'
            tooltipEl.style.borderRadius = '3px'
            tooltipEl.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)'

            if (tooltipModel.body && this._chart && this._chart.data.datasets) {
              let tableRoot = tooltipEl.querySelector('table')
              tableRoot.innerHTML = ''

              this._chart.data.datasets.forEach((dataset, i) => {
                let datasetLabel = dataset.label
                let dataValue = dataset.data[tooltipModel.dataPoints[0].index]
                let backgroundColor = dataset.backgroundColor || '#000' // Varsayılan bir renk belirleyin veya dataset'in backgroundColor özelliğine bakın

                let tr = document.createElement('tr')
                tr.innerHTML = `
          <td>
            <span style="background-color:${backgroundColor}; width: 8px; height: 8px; display: inline-block; margin-right: 5px;"></span>
            ${datasetLabel}
          </td>
          <td>${dataValue}</td>
        `
                tableRoot.appendChild(tr)
              })
            }
          }
          /*
          enabled: true,
          backgroundColor: '#fff',
          xPadding: 16,
          yPadding: 16,
          borderColor: 'gray',
          titleFontColor: '#383B41',
          titleMarginBottom: 12,
          bodyFontColor: '#383B41',
          callbacks: {
            title: (tooltipItem) => {
              const newDate = new Date(2024, 2, 13)
              const months = this.months
              return `${months[newDate.getMonth()]}/${newDate.getFullYear()}`
            },
            label: function (tooltipItem, data) {
              let label = data.datasets[tooltipItem.datasetIndex].label || ''

              if (label) {
                label += ': '
              }
              label += Math.round(tooltipItem.yLabel * 100) / 100
              return label
            },
            labelColor: function (tooltipItem, chart) {
              return {
                usePointStyle: true,
                borderColor: 'rgb(0, 0, 255)',
                backgroundColor: 'rgb(255, 0, 0)'
              }
            },
            labelTextColor: function (tooltipItem, chart) {
              return '#543453'
            }
          }

           */
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
