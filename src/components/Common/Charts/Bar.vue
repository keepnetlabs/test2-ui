<script>
import { Bar } from 'vue-chartjs'

export default {
  name: 'Bar',
  extends: Bar,
  props: ['chartData', 'options', 'chartOptions'],
  mounted() {
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
