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
        let maxIndex = -1
        let maxX = -Infinity
        for (let i = 0; i < dataset.data.length; i++) {
          if (dataset.data[i].x > maxX) {
            maxX = dataset.data[i].x
            maxIndex = i
          }
        }

        if (maxIndex !== -1) {
          const maxData = meta.data[maxIndex]
          if (maxData && maxData._model) {
            const fontSize = 7
            const fontFamily = 'Open Sans, sans-serif'
            const padding = 24
            //ctx.measureText(text).width;
            const x = maxData._model.x / 2 - 24
            const y = maxData._model.y - padding
            ctx.fillStyle = '#383B41'
            ctx.textAlign = 'left'
            ctx.textBaseline = 'bottom'
            ctx.font = `${fontSize}px ${fontFamily}`
            ctx.fillText('Critical Risk Level. Immediate training is needed.', x, y)
          }
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
