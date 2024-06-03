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
    },
    addCustomLegendLabelHeight: {
      type: Number,
      default: 4
    },
    customPlugin: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    if (this.addDataPlugin) this.addPlugin(ChartDataLabels)
    const customHeight = this.addCustomLegendLabelHeight
    this.addPlugin({
      beforeInit: function (chart, options) {
        chart.legend.afterFit = function () {
          this.height = this.height + customHeight
        }
      }
    })
    if (this.customPlugin.length) {
      for (let plugin of this.customPlugin) {
        this.addPlugin(plugin)
      }
    }
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
