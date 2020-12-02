<script>
import { Bubble } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'

export default {
  name: 'Bubble',
  extends: Bubble,
  props: {
    chartOptions: {
      type: Object
    },
    data: {
      type: Array
    }
  },
  mounted() {
    this.addPlugin(ChartDataLabels)
    this.options = {
      plugins: {
        // Look at this bit
        datalabels: {
          formatter: function (value) {
            return Math.round(value.r)
          },
          color: '#575757'
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      ...this.chartOptions
    }
    this.renderChart(
      {
        datasets: this.data
      },
      this.options
    )
  }
}
</script>

<style lang="scss"></style>
