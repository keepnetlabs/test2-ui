<script>
import { Doughnut } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
export default {
  name: 'Doughnut',
  extends: Doughnut,
  props: ['chartData', 'options', 'chartOptions', 'addDataLabelPlugin'],
  mounted() {
    if (this.addDataLabelPlugin) this.addPlugin(ChartDataLabels)
    if (this.chartData) {
      this.renderChart(this.chartData, this.chartOptions)
    }
  },
  watch: {
    chartData() {
      this.renderChart(this.chartData, this.chartOptions)
    }
  },
  methods: {}
}
</script>
