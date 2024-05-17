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
            <HorizontalBarChart
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
import ExecutiveWidgetContainer from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetContainer.vue'
import ExecutiveWidgetHeader from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetHeader.vue'
import ExecutiveWidgetBody from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetBody.vue'
import HorizontalBarChart from '@/components/Common/Charts/HorizontalBar.vue'
export default {
  name: 'ExecutiveReportsTopRiskiestUsers',
  components: {
    ExecutiveWidgetBody,
    ExecutiveWidgetHeader,
    ExecutiveWidgetContainer,
    HorizontalBarChart,
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
        xLabels: [0, 100],
        yLabels: [
          { name: 'Desirae Baptista', email: 'desirae@company.com', department: 'HR' },
          { name: 'Jakob Dokidis', email: 'jakob.d@company.com', department: 'Finance' },
          { name: 'Ann Schleifer', email: 'ann@company.com', department: 'Product' },
          { name: 'Marilyn Geidt', email: 'marilyn@company.com', department: 'Marketing' },
          { name: 'Jakob Stanton', email: 'jakob.s@company.com', department: 'Marketing' }
        ],
        datasets: [
          {
            label: 'Desirae Baptista',
            data: [
              { y: 'Desirae Baptista', x: 90 },
              { y: 'Jakob Dokidis', x: 20 },
              { y: 'Ann Schleifer', x: 10 },
              { y: 'Marilyn Geidt', x: 25 },
              { y: 'Jakob Stanton', x: 85 }
            ],
            barThickness: 32,
            backgroundColor: ['#B83A3A', '#F56C6C', '#F56C6C', '#F56C6C', '#F56C6C'],
            borderColor: ['#B83A3A', '#F56C6C', '#F56C6C', '#F56C6C', '#F56C6C'],
            borderWidth: 1
          }
        ]
      }
      this.chartOptions = {
        indexAxis: 'y',
        responsive: true,
        padding: 24,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              beginAtZero: true,
              offset: true,
              gridLines: {
                display: true,
                color: 'rgba(128, 151, 177, 0.3)',
                borderDash: [3]
              },
              ticks: {
                callback: function (data, index, values) {
                  return `${data.name}\n(${data.email})\n${data.department}`
                },
                labelOffset: 0,
                beginAtZero: true,
                padding: 0,
                fontColor: '#383B41',
                lineHeight: 1.58
              }
            }
          ],
          xAxes: [
            {
              display: true,
              stacked: false,
              offset: true,
              scaleLabel: {
                display: true,
                labelString: 'Human Risk Score (%)',
                fontColor: '#383B41'
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
          display: false
        },
        tooltips: {
          enabled: false,
          xPadding: 12,
          yPadding: 12
        },
        plugins: {
          datalabels: {
            display: true,
            align: 'center',
            offset: 12,
            anchor: 'center',
            color: 'white',
            clamp: true,
            formatter: function (value) {
              return value.x
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
