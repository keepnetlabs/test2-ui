<script>
import { Doughnut } from 'vue-chartjs'
export default {
  name: 'Doughnut',
  extends: Doughnut,
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
  },
  methods: {}
}
</script>
