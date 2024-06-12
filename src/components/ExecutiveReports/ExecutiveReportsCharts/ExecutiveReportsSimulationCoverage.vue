<template>
  <WidgetLoading :loading="isLoading">
    <template #skeleton-content>
      <ExecutiveWidgetContainer>
        <ExecutiveWidgetHeader
          title="Simulation Coverage"
          subtitle="Simulation proportion of simulated versus non-simulated users."
          :edit-mode="editMode"
          @on-delete="handleDelete"
          @on-edit="handleEdit"
        />
        <ExecutiveWidgetBody>
          <template v-if="true">
            <PieChart
              v-if="chartData"
              :data="chartData"
              :chart-options="chartOptions"
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
  name: 'ExecutiveReportsSimulationCoverage',
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
      default: () => [20, 40]
    },
    valueEnums: {
      type: Array,
      default: () => [labels.SimulatedUsers, labels.NonSimulatedUsers]
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
        devicePixelRatio: 2,
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
