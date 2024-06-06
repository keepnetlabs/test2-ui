<template>
  <WidgetLoading :loading="isLoading">
    <template #skeleton-content>
      <ExecutiveWidgetContainer>
        <ExecutiveWidgetHeader
          title="Repeat Offenders Users (Threshold: 2)"
          subtitle="Percentage of users who are repeat offenders"
          :edit-mode="editMode"
          @on-delete="handleDelete"
          @on-edit="handleEdit"
        />
        <ExecutiveWidgetBody>
          <template v-if="true">
            <PieChart
              v-if="chartData"
              style="margin-top: -8px;"
              :data="chartData"
              :chart-options="chartOptions"
              :custom-plugins="customPlugins"
              add-data-label-plugin
            />
          </template>
        </ExecutiveWidgetBody>
      </ExecutiveWidgetContainer>
    </template>
  </WidgetLoading>
</template>
<script>
import PieChart from '@/components/Common/Charts/Pie.vue'
import labels from '@/model/constants/labels'
import { CHART_COLORS } from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'
import WidgetLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import ExecutiveWidgetBody from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetBody.vue'
import ExecutiveWidgetContainer from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetContainer.vue'
import ExecutiveWidgetHeader from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetHeader.vue'
export default {
  name: 'ExecutiveReportsRepeatOffendersUsers',
  components: {
    ExecutiveWidgetHeader,
    ExecutiveWidgetContainer,
    ExecutiveWidgetBody,
    WidgetLoading,
    PieChart
  },
  props: {
    rawData: {
      type: Array,
      default: () => [30, 70]
    },
    valueEnums: {
      type: Array,
      default: () => [labels.SimulatedUsers, labels.RepeatOffenders]
    },
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
      chartData: [],
      customPlugins: [
        {
          id: 'height-plugin',
          beforeInit: function (chart) {
            chart.legend.afterFit = function () {
              this.height = this.height + 8
            }
          }
        }
      ]
    }
  },
  created() {
    this.calculateData()
  },
  methods: {
    calculateData() {
      const chartOptions = {
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        showLabels: true,
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          enabled: false
        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            fontColor: '#383B41',
            font: 'Open-sans,sans-serif',
            padding: 32,
            fontSize: 12,
            generateLabels: (chart = {}) => {
              const { data } = chart
              return [
                {
                  text: `Repeat Offenders (${data.datasets[0].data[1]} users)`,
                  fillStyle: CHART_COLORS[labels.RepeatOffenders]
                    ? CHART_COLORS[labels.RepeatOffenders].backgroundColor
                    : null,
                  lineWidth: 0,
                  datasetIndex: 1
                },
                {
                  text: `Simulated Users (${data.datasets[0].data[0]} users)`,
                  fillStyle: CHART_COLORS[labels.SimulatedUsers]
                    ? CHART_COLORS[labels.SimulatedUsers].backgroundColor
                    : null,
                  lineWidth: 0,
                  datasetIndex: 0
                }
              ]
            }
          }
        }
      }
      let backgroundColor = []
      this.valueEnums.forEach((data) => {
        if (!CHART_COLORS[data]) return
        backgroundColor.push(CHART_COLORS[data].backgroundColor)
      })
      this.chartOptions = {
        ...chartOptions,
        backgroundColor,
        labels: this.valueEnums,
        showTooltipLine: true,
        plugins: {
          datalabels: {
            color: '#383B41',
            anchor: 'center',
            align: 'center',
            display: true,
            font: {
              size: 12,
              family: 'Open Sans, sans-serif'
            },
            formatter(value) {
              return `${value}%`
            }
          }
        }
      }
      this.chartData = this.rawData
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
