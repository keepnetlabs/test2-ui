<script>
import {Line} from 'vue-chartjs'

export default {
  name: 'Line',
  extends: Line,
  props: ['chartdata', 'options'],
  mounted() {
    this.chartOptions = {
      // Look at this bit
      plugins: {
        datalabels: {
          formatter: function (value) {
            return ''
          },
          color: '#575757'
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            display: true,
            type: 'time',
            time: {
              unit: 'week'
            },
            offset: true,
            gridLines: {
              display: true,
              color: 'rgba(128, 151, 177, 0.3)',
              borderDash: [3]
            },
            ticks: {
              fontColor: 'rgba(176, 186, 201)',
              lineHeight: 1.58,
              min: 1601154000000,
              max: 1603141200000
            }
          }
        ],
        yAxes: [
          {
            offset: true,
            gridLines: {
              display: true,
              color: 'rgba(128, 151, 177, 0.3)',
              borderDash: [3]
            },
            ticks: {
              min: 0,
              max: 5000,
              labelOffset: 0,
              beginAtZero: true,
              padding: -2,
              stepSize: 1000,
              fontColor: 'rgba(176, 186, 201)',
              lineHeight: 1.58
            }
          }
        ]
      },

      legend: {
        display: true,
        labels: {
          usePointStyle: true,
          lineDashOffset: 0
        }
      }
    }
    this.renderChart(
      {
        datasets: [
          {
            label: 'Total Reports',
            backgroundColor: 'white',
            borderColor: '#2e5bff',
            pointBorderColor: '#2e5bff',
            pointBackgroundColor: 'white',
            fill: false,
            pointRadius: 3,
            borderWidth: 2,
            lineTension: 0,
            data: [
              {
                x: 1600894800000,
                y: 0
              },
              {
                x: 1601547149316,
                y: 500
              },
              {
                x: 1602104400000,
                y: 750
              },
              {
                x: 1602363600000,
                y: 3500
              },
              {
                x: 1602968400000,
                y: 1500
              }
            ]
          },
          {
            label: 'Actual Threats',
            backgroundColor: 'white',
            borderColor: '#ff6167',
            fill: false,
            pointRadius: 3,
            borderWidth: 2,
            lineTension: 0,
            data: [
              {
                x: 1600894800000,
                y: 150
              },
              {
                x: 1601547149316,
                y: 2800
              },
              {
                x: 1602104400000,
                y: 300
              },
              {
                x: 1602363600000,
                y: 5000
              },
              {
                x: 1602968400000,
                y: 3200
              }
            ]
          },
          {
            label: 'Phishing',
            backgroundColor: 'white',
            borderColor: '#f19f10',
            fill: false,
            pointRadius: 3,
            borderWidth: 2,
            lineTension: 0,
            data: [
              {
                x: 1600894800000,
                y: 0
              },
              {
                x: 1601547149316,
                y: 3200
              },
              {
                x: 1602104400000,
                y: 1600
              },
              {
                x: 1602363600000,
                y: 2200
              },
              {
                x: 1602968400000,
                y: 2800
              }
            ]
          },
          {
            label: 'Malicious File',
            backgroundColor: 'white',
            borderColor: '#8c54ff',
            fill: false,
            pointRadius: 3,
            borderWidth: 2,
            lineTension: 0,
            data: [
              {
                x: 1600894800000,
                y: 3000
              },
              {
                x: 1601547149316,
                y: 2000
              },
              {
                x: 1602104400000,
                y: 2500
              },
              {
                x: 1602363600000,
                y: 400
              },
              {
                x: 1602968400000,
                y: 2000
              }
            ]
          },
          {
            label: 'Spam',
            backgroundColor: 'white',
            borderColor: '#757575',
            fill: false,
            pointRadius: 3,
            borderWidth: 2,
            lineTension: 0,
            data: [
              {
                x: 1600894800000,
                y: 1000
              },
              {
                x: 1601547149316,
                y: 4000
              },
              {
                x: 1602104400000,
                y: 2500
              },
              {
                x: 1602363600000,
                y: 3200
              },
              {
                x: 1602968400000,
                y: 3800
              }
            ]
          }
        ]
      },
      this.chartOptions
    )
  }
}
</script>

<style lang="scss"></style>
