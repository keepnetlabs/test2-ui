<script>
import { HorizontalBar } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'

export default {
  name: 'HorizontalBar',
  extends: HorizontalBar,
  props: ['chartData', 'options', 'chartOptions'],
  mounted() {
    this.addPlugin(ChartDataLabels)
    this.addPlugin({
      id: 'customPlugin',
      beforeDraw(chart) {
        const ctx = chart.ctx
        const dataset = chart.data.datasets[0]
        const meta = chart.getDatasetMeta(0)
        const maxIndex = dataset.data.indexOf(Math.max(...dataset.data))
        const maxData = meta.data[maxIndex]

        const fontSize = 10
        const fontStyle = 'bold'
        const fontFamily = 'Arial'
        const padding = 5
        const y = maxData._model.y - padding

        ctx.fillStyle = 'red'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'bottom'
        ctx.font = `${fontStyle} ${fontSize}px ${fontFamily}`
        ctx.fillText('Critical Risk Level. Immediate training is needed.', maxData._model.x, y)
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
