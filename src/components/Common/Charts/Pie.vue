<script>
import { Pie } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
export default {
  name: 'Pie',
  extends: Pie,
  props: {
    chartOptions: {
      type: Object
    },
    data: {
      type: Array
    },
    addDataLabelPlugin: {
      type: Boolean,
      default: false
    },
    customPlugins: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    if (this.addDataLabelPlugin) this.addPlugin(ChartDataLabels)
    this.customPlugins.forEach((plugin) => this.addPlugin(plugin))
    this.attachToDom()
  },
  methods: {
    attachToDom() {
      this.options = {
        plugins: {
          datalabels: {
            formatter: function (d) {
              return d
            },
            color: '#575757'
          }
        },
        responsive: true,
        maintainAspectRatio: true,
        tooltips: {
          enabled: false
        },
        ...this.chartOptions
      }
      this.renderChart(
        {
          labels: this.chartOptions?.showLabels ? this.chartOptions?.labels : undefined,
          datasets: [
            {
              data: this.data,
              backgroundColor: this.chartOptions?.backgroundColor
            }
          ]
        },
        this.options
      )
    }
  }
}
</script>
