<script>
import { Bar } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
export default {
  name: 'Bar',
  extends: Bar,
  props: {
    chartData: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    },
    chartOptions: {
      type: Object,
      default: null
    },
    addDataPlugin: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    if (this.addDataPlugin) this.addPlugin(ChartDataLabels)
    this.addPlugin({
      beforeInit: function (chart, options) {
        chart.legend.afterFit = function () {
          this.height = this.height + 4
        }
      }
    })
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
