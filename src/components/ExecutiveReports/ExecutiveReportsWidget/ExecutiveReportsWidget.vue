<template>
  <WidgetLoading :loading="isLoading">
    <template #skeleton-content>
      <ExecutiveWidgetContainer>
        <ExecutiveWidgetHeader
          :title="card.title"
          :subtitle="card.parentKey"
          @on-delete="handleDelete"
          @on-edit="handleEdit"
        />
        <ExecutiveWidgetBody>
          <template v-if="true">
            <ExecutiveReportStackedBarChart
              v-if="card.chartType === 'stackedBar'"
              :time-unit="card.timeUnit"
            />
            <ExecutiveReportLineChart
              v-else-if="card.chartType === 'line'"
              :time-unit="card.timeUnit"
            />
            <ExecutiveReportGaugeChart
              v-else-if="card.chartType === 'gauge'"
              :time-unit="card.timeUnit"
            />
            <ExecutiveReportBarChart
              v-else-if="card.chartType === 'bar'"
              :time-unit="card.timeUnit"
            />
            <ExecutiveReportDoughnutChart
              v-else-if="card.chartType === 'doughnut'"
              :time-unit="card.timeUnit"
            />
            <ExecutiveReportPieChart
              v-else-if="card.chartType === 'pie'"
              :time-unit="card.timeUnit"
            />
            <ExecutiveReportTable
              v-else-if="card.chartType === 'table'"
              class="d-flex align-items-center mt-2"
              :columns="executiveReportColumns"
              :data="executiveReportData"
            />
            <div v-if="card.chartType === 'gauge'">
              <div class="executive-report-gauge-value" style="margin-top: -14px;">
                32
              </div>
              <div class="executive-report-gauge-average" style="margin-top: -2px;">
                Industry Average: 40
              </div>
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
import ExecutiveReportPieChart from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportPieChart.vue'
import ExecutiveReportTable from '@/components/ExecutiveReports/ExecutiveReportTable.vue'
import { LABEL_STORE, PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'

export default {
  name: 'ExecutiveReportsWidget',
  components: {
    ExecutiveReportTable,
    ExecutiveReportPieChart,
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
      executiveReportColumns: [
        {
          property: PROPERTY_STORE.NAME,
          label: LABEL_STORE.NAME,
          align: 'left'
        },
        {
          property: PROPERTY_STORE.EMAIL,
          label: labels.Email,
          align: 'left'
        },
        {
          property: PROPERTY_STORE.DEPARTMENT,
          label: labels.Department,
          align: 'left'
        },
        {
          property: PROPERTY_STORE.RISK_SCORE,
          label: labels.RiskScore,
          align: 'left'
        }
      ],
      executiveReportData: [
        {
          email: 'nurullah@keepnetlabs.com',
          name: 'Angel Siphron',
          department: 'Marketing',
          riskScore: '80%'
        },
        {
          email: 'nurullah@keepnetlabs.com',
          name: 'Angel Siphron',
          department: 'Marketing',
          riskScore: '80%'
        },
        {
          email: 'nurullah@keepnetlabs.com',
          name: 'Angel Siphron',
          department: 'Marketing',
          riskScore: '80%'
        },
        {
          email: 'nurullah@keepnetlabs.com',
          name: 'Angel Siphron',
          department: 'Marketing',
          riskScore: '80%'
        },
        {
          email: 'nurullah@keepnetlabs.com',
          name: 'Angel Siphron',
          department: 'Marketing',
          riskScore: '80%'
        }
      ],
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
