<template>
  <WidgetLoading :loading="isLoading">
    <template #skeleton-content>
      <ExecutiveWidgetContainer>
        <ExecutiveWidgetHeader
          title="Training Completion"
          subtitle="Measure the training coverage across the company"
          :edit-mode="editMode"
          @on-delete="handleDelete"
          @on-edit="handleEdit"
        />
        <ExecutiveWidgetBody>
          <template v-if="true">
            <DoughnutChart
              v-if="chartData"
              :chart-data="chartData"
              :chart-options="chartOptions"
              :addDataLabelPlugin="true"
            />
          </template>
        </ExecutiveWidgetBody>
      </ExecutiveWidgetContainer>
    </template>
  </WidgetLoading>
</template>
<script>
import DoughnutChart from '@/components/Common/Charts/Doughnut.vue'
import labels from '@/model/constants/labels'
import { CHART_COLORS } from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'
import WidgetLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import ExecutiveWidgetBody from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetBody.vue'
import ExecutiveWidgetContainer from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetContainer.vue'
import ExecutiveWidgetHeader from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetHeader.vue'
export default {
  name: 'ExecutiveReportsTrainingCompletion',
  components: {
    ExecutiveWidgetHeader,
    ExecutiveWidgetContainer,
    ExecutiveWidgetBody,
    WidgetLoading,
    DoughnutChart
  },
  props: {
    rawData: {
      type: Array,
      default: () => [60, 25, 15]
    },
    valueEnums: {
      type: Array,
      default: () => [labels.Completed, labels.InProgress, labels.Incomplete]
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
      chartData: []
    }
  },
  created() {
    this.calculateData()
  },
  methods: {
    calculateData() {
      const chartOptions = {
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
            color: '#383B41',
            font: 'Open-sans,sans-serif',
            padding: 32,
            fontSize: 12,
            generateLabels: (chart = {}) => {
              const { data } = chart
              return data.datasets[0].data.map((d, index) => {
                return {
                  text: `${data.labels[index]} (${d} users)`,
                  fillStyle: CHART_COLORS[data.labels[index]]
                    ? CHART_COLORS[data.labels[index]].backgroundColor
                    : null,
                  lineWidth: 0,
                  datasetIndex: index
                }
              })
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
        showTooltipLine: true
      }
      this.chartData = {
        labels: this.valueEnums,
        datasets: [
          {
            data: this.rawData,
            backgroundColor
          }
        ]
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
