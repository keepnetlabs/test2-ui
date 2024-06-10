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
              add-data-plugin
              :chart-data="chartData"
              :chart-options="chartOptions"
              :custom-plugin="customPlugins"
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
  name: 'ExecutiveReportsImpactOfPhishingAwarenessTraining',
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
      isEmpty: false,
      empty: {
        message: 'You do not have any report conclusion'
      },
      isLoading: false,
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      chartOptions: {},
      chartData: {},
      customPlugins: [
        {
          afterDraw: (chart) => {
            const ctx = chart.chart.ctx
            const fontSize = 12
            const fontFamily = 'Open Sans, sans-serif'
            chart.legend.legendItems.forEach((legendItem, index) => {
              const textParts = legendItem.textParts
              if (textParts) {
                const text = textParts[0]
                const percentage = `(${textParts[1]}%)`
                const x = chart.legend.legendHitBoxes[index].left + 17
                const y = chart.legend.legendHitBoxes[index].top + 6
                ctx.fillStyle = '#383B41'
                ctx.fillText(text, x, y)
                ctx.font = `bold ${fontSize}px ${fontFamily}`
                ctx.fillText(percentage, x + ctx.measureText(text).width - 8, y + 0.5)
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
        datePeriod: 3,
        startDate: this.dateRange[0],
        endDate: this.dateRange[1]
      }
      getExecutiveReportChartData(payload)
        .then((response) => {
          const {
            data: { data }
          } = response || {}
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
      const industryAverageData = data[0].widgetDatas.map((wData) => {
        return wData.values.find((v) => v.name === 'IndustryAverage')?.value || 0
      })
      const companyPhishingRiskScoreData = data[0].widgetDatas.map((wData) => {
        return wData.values.find((v) => v.name === 'Percentage')?.value
      })
      const annotations = data[0].widgetDatas.map((wData) => {
        return wData.values.find((v) => v.name === 'Percentage')?.annotations
      })
      this.chartData = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        datasets: [
          {
            type: 'line',
            label: 'Industry Average',
            data: industryAverageData,
            borderColor: '#007bff',
            backgroundColor: 'rgba(0,123,255,0.1)',
            borderWidth: 2,
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            borderDash: [20, 20],
            lineTension: 0,
            order: 1
          },
          {
            type: 'bar',
            barThickness: 32,
            label: 'Phishing Risk Score',
            data: companyPhishingRiskScoreData,
            backgroundColor: function (context) {
              const index = context.dataIndex
              const value = context.dataset.data[index]
              let color = '#43A047'
              if (value - industryAverageData[index] >= 0) {
                color = '#F56C6C'
              } else if (
                value - industryAverageData[index] < 0 &&
                value - industryAverageData[index] > -10
              ) {
                color = '#D1AD0C'
              }
              return color
            },
            borderWidth: 1,
            order: 2
          }
        ]
      }
      this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Months',
                fontFamily: 'Open-sans,sans-serif',
                fontColor: '#383B41'
              },
              gridLines: {
                display: false
              },
              ticks: {
                fontColor: 'rgba(56, 59, 65, 0.72)',
                fontStyle: '600',
                fontSize: 9,
                fontFamily: 'Open-sans,sans-serif'
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                min: 0,
                max: 100,
                stepSize: 20,
                labelOffset: 0,
                padding: 12,
                fontColor: 'rgba(56, 59, 65, 0.72)',
                lineHeight: 1.58,
                fontFamily: 'Open-sans,sans-serif',
                beginAtZero: true,
                callback: function (value) {
                  return value + '%'
                }
              },
              scaleLabel: {
                display: true,
                fontFamily: 'Open-sans,sans-serif',
                fontSize: 12,
                fontColor: '#383B41',
                labelString: 'Phishing Risk Score'
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
          display: true,
          labels: {
            usePointStyle: true,
            fontColor: '#383B41',
            fontFamily: 'Open-sans,sans-serif',
            position: 'top',
            generateLabels() {
              return [
                {
                  text: '',
                  fillStyle: '#1173C1',
                  lineWidth: 0,
                  datasetIndex: 0,
                  industryAverage: industryAverageData[0],
                  textParts: ['Industry Avg', industryAverageData[0]]
                }
              ]
            }
          }
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || ''
              return datasetLabel + ': ' + tooltipItem.yLabel + '%'
            }
          }
        },
        plugins: {
          datalabels: {
            display: true,
            align: 'start',
            offset: -20,
            anchor: 'end',
            color: '#000',
            formatter: function (value, context) {
              if (context.dataset.label === 'Industry Average') return ''
              if (annotations[context.dataIndex]) {
                return annotations[context.dataIndex].definition
              }
              return ''
            },
            font: {
              size: 9,
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
