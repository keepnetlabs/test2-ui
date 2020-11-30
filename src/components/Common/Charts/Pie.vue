<script>
import { Pie } from 'vue-chartjs'
export default {
  name: 'Pie',
  extends: Pie,
  props: {
    chartOptions: {
      type: Object
    },
    data: {
      type: Array
    }
  },
  mounted() {
    this.attachToDom()
  },
  methods: {
    attachToDom() {
      this.options = {
        plugins: {
          datalabels: {
            formatter: function (value) {
              return ''
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
          datasets: [
            {
              data: this.data,
              backgroundColor: this.chartOptions.backgroundColor
            }
          ]
        },
        this.options
      )
    }
  }
}
</script>

<style lang="scss"></style>
