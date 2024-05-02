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
            data: [300, 300, 300, 300, 300, 300, 300],
            backgroundColor: '#1173C1',
            borderColor: '#1173C1',
            fill: false,
            pointRadius: 0,
            borderDash: [5, 5],
            borderWidth: 1,
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
                console.log('item', item)
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
