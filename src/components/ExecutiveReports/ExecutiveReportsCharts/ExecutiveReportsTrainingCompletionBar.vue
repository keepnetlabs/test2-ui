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
            <BarChart
              v-if="chartData.datasets"
              :add-data-plugin="false"
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
import { getExecutiveReportChartData } from '@/api/reports'
import { createExecutiveReportChartData } from '@/components/ExecutiveReports/ExecutiveReportsWidget/utils'
import { CHART_COLORS } from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'

export default {
  name: 'ExecutiveReportsTrainingCompletionBar',
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
      getExecutiveReportChartData(payload)
        .then((response) => {
          const {
            data: { data }
          } = response || {}
          /*
          const { valueEnums, datasets } = createExecutiveReportChartData(data[0].widgetDatas)
          const newDatasets = []
          for (let itemType of valueEnums) {
            const typedItems = datasets.filter((item) => item.result === itemType)
            newDatasets.push({
              type: 'bar',
              barThickness: 32,
              label: itemType,
              ...CHART_COLORS[itemType],
              data: typedItems
            })
          }

           */
          const industryAverageData = Array(12).fill(30)
          this.chartData = {
            labels: ['Completed', 'In Progress', 'Incomplete'],
            datasets: [
              {
                barThickness: 32,
                label: 'Phishing Risk Score',
                data: [42, 40, 38, 32, 30, 28, 20, 18, 15, 12, 10, 8],
                backgroundColor: function (context) {
                  console.log('context', context)
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
                    labelString: 'Training Status',
                    fontFamily: 'Open-sans,sans-serif',
                    fontColor: '#383B41'
                  },
                  gridLines: {
                    display: false
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
                    labelString: 'Percentage Of Users'
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
              callbacks: {
                label: function (tooltipItem, data) {
                  const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || ''
                  return datasetLabel + ': ' + tooltipItem.yLabel + '%'
                }
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
