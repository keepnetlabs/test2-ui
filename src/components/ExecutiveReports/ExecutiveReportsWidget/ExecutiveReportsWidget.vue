<template>
  <WidgetLoading :loading="isLoading">
    <template #skeleton-content>
      <ExecutiveWidgetContainer>
        <ExecutiveWidgetHeader
          :title="card.title"
          :subtitle="card.subtitle"
          @on-delete="handleDelete"
          @on-edit="handleEdit"
        />
        <ExecutiveWidgetBody>
          <template v-if="true">
            <ExecutiveReportStackedBarChart v-if="card.chartType === 'stackedBar'" />
            <ExecutiveReportLineChart v-else-if="card.chartType === 'line'" />
            <ExecutiveReportGaugeChart v-else-if="card.chartType === 'gauge'" />
            <ExecutiveReportBarChart v-else-if="card.chartType === 'bar'" />
            <ExecutiveReportDoughnutChart v-else-if="card.chartType === 'doughnut'" />
            <div v-if="card.chartType === 'gauge'" class="executive-report-gauge-value">
              40
            </div>
          </template>
          <div
            class="k-widget-list__empty-inline"
            style="display: flex; align-items: center; justify-content: center;"
            v-else
          >
            <h2 v-if="empty.message">{{ empty.message }}</h2>
            <p v-if="empty.subMes">{{ empty.subMes }}</p>
            <v-btn v-if="empty.btn" class="empty-btn" @click="onEmptyBtnClicked">
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
import { mapGetters } from 'vuex'
import WidgetLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import ExecutiveWidgetContainer from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetContainer.vue'
import ExecutiveWidgetHeader from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetHeader.vue'
import ExecutiveReportLineChart from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportLineChart.vue'
import ExecutiveWidgetBody from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetBody.vue'
import ExecutiveReportStackedBarChart from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportStackedBarChart.vue'
import ExecutiveReportBarChart from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportBarChart.vue'
import ExecutiveReportGaugeChart from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportGaugeChart.vue'
import ExecutiveReportDoughnutChart from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportDoughnutChart.vue'

export default {
  name: 'ExecutiveReportsWidget',
  components: {
    ExecutiveReportDoughnutChart,
    ExecutiveReportGaugeChart,
    ExecutiveReportBarChart,
    ExecutiveReportStackedBarChart,
    ExecutiveWidgetBody,
    ExecutiveReportLineChart,
    ExecutiveWidgetHeader,
    ExecutiveWidgetContainer,
    WidgetLoading
  },
  props: {
    card: {
      type: Object,
      default: () => ({
        title: 'Phishing Campaign Trends',
        subtitle: 'Phishing Metric'
      })
    }
  },
  data() {
    return {
      empty: {
        message: 'You do not have any report conclusion'
      }
    }
  },
  computed: {
    ...mapGetters({
      isLoading: 'widgets/getIsLoading'
    })
  },
  methods: {
    onEmptyBtnClicked() {},
    handleDelete() {
      this.$emit('on-delete', this.card)
    },
    handleEdit() {
      this.$emit('on-edit', this.card)
    }
  }
}
</script>
