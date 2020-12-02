<template>
  <widget-container>
    <widget-header
      :title="getTitle"
      :link="{ href: '/incident-responder', text: 'Incident Responder' }"
      :edit-mode="editMode"
      @deleteWidget="$emit('deleteWidget')"
    />
    <widget-body>
      <bubble :chart-options="chartOptions" :data="chartData" />
    </widget-body>
  </widget-container>
</template>

<script>
import WidgetHeader from '@/components/Common/Widget/WidgetHeader'
import WidgetBody from '@/components/Common/Widget/WidgetBody'
import WidgetContainer from '@/components/Common/Widget/WidgetContainer'
import Bubble from '@/components/Common/Charts/Bubble'
import labels from '@/model/constants/labels'
export default {
  name: 'IncidentClusters',
  components: {
    Bubble,
    WidgetHeader,
    WidgetBody,
    WidgetContainer
  },
  props: {
    editMode: {
      type: Boolean
    }
  },
  computed: {
    getTitle() {
      return labels.IncidentClusters
    }
  },
  data() {
    return {
      isLoading: false,
      chartOptions: {
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
              scaleLabel: {
                display: true,
                labelString: 'Avarage Reliability',
                lineHeight: 1.83,
                fontColor: '#b0bac9',
                fontFamily: 'Open-sans,sans-serif',
                fontWeight: 600
              },
              ticks: {
                min: 0,
                max: 100,
                labelOffset: 0,
                padding: -2,
                stepSize: 20,
                scaleBeginAtZero: true,
                fontColor: 'rgba(176, 186, 201)',
                lineHeight: 1.58
              }
            }
          ]
        },
        legend: {
          display: true,
          labels: {
            usePointStyle: true
          }
        }
      },
      chartData: [
        {
          label: 'Phishing',
          data: [
            {
              x: 1601547149316,
              y: 75,
              r: 24
            },
            {
              x: 1602248550626,
              y: 85,
              r: 15
            },
            {
              x: 1602075731227,
              y: 55,
              r: 20
            }
          ],
          backgroundColor: 'rgba(33, 150, 243, 0.5)'
        },
        {
          label: 'Malicious',
          data: [
            {
              x: 1601815785520,
              y: 40,
              r: 16
            },
            {
              x: 1602075731227,
              y: 40,
              r: 26
            }
          ],
          backgroundColor: 'rgba(230, 162, 60, 0.5)'
        },
        {
          label: 'Non Malicious',
          data: [
            {
              x: 1602594179690,
              y: 30,
              r: 23
            }
          ],
          backgroundColor: 'rgba(0, 188, 212, 0.5)'
        },
        {
          label: 'Clean',
          data: [
            {
              x: 1602853389542,
              y: 30,
              r: 8
            },
            {
              x: 1602594179690,
              y: 75,
              r: 13
            }
          ],
          backgroundColor: 'rgba(67, 160, 71, 0.5)'
        }
      ]
    }
  }
}
</script>

<style lang="scss"></style>
