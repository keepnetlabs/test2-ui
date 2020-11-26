<script>
import { Line } from 'vue-chartjs'
export default {
  name: 'Line',
  extends: Line,
  props: ['chartData', 'options', 'chartOptions'],
  mounted() {
    if (this.chartData) {
      this.renderChart(this.chartData, this.chartOptions)
    }
  },
  watch: {
    chartData(newVal) {
      debugger
      this.renderChart(this.chartData, this.chartOptions)
    }
  }
}
</script>

<style lang="scss"></style>
