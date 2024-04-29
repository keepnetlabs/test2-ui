<script>
import { HorizontalBar } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'

export default {
  name: 'HorizontalBar',
  extends: HorizontalBar,
  props: ['chartData', 'options', 'chartOptions'],
  mounted() {
    this.addPlugin(ChartDataLabels)
    if (this.chartData) {
      this.renderChart(this.chartData, this.chartOptions)
    }
  },
  watch: {
    chartData() {
      this.renderChart(this.chartData, this.chartOptions)
    }
  }
}
</script>
