<script>
import { HorizontalBar } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'

export default {
  name: 'HorizontalBar',
  extends: HorizontalBar,
  props: ['chartData', 'options', 'chartOptions', 'customPlugin'],
  mounted() {
    this.addPlugin(ChartDataLabels)
    if (this.customPlugin) this.addPlugin(this.customPlugin)
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
