<template>
  <widget-container>
    <widget-header
      title="Incident Clusters"
      :link="{ href: '/incident-responder', text: 'Incident Responder' }"
      :edit-mode="editMode"
      @deleteWidget="$emit('deleteWidget')"
    />
    <widget-body>
      <apexchart type="bubble" height="200" :options="chartOptions" :series="series" />
    </widget-body>
  </widget-container>
</template>

<script>
import WidgetHeader from '@/components/Common/Widget/WidgetHeader'
import WidgetBody from '@/components/Common/Widget/WidgetBody'
import WidgetContainer from '@/components/Common/Widget/WidgetContainer'
import VueApexCharts from 'vue-apexcharts'
export default {
  name: 'IncidentClusters',
  components: {
    WidgetHeader,
    WidgetBody,
    WidgetContainer,
    apexchart: VueApexCharts
  },
  props: {
    editMode: {
      type: Boolean
    }
  },
  data() {
    return {
      isLoading: false,
      series: [
        {
          name: 'Clean',
          data: [
            {
              x: 1601547149316,
              y: 75,
              z: 24
            },
            {
              x: 1602248550626,
              y: 85,
              z: 15
            },
            {
              x: 1602075731227,
              y: 55,
              z: 20
            }
          ]
        },
        {
          name: 'Non Malicious',
          data: [
            {
              x: 1601815785520,
              y: 40,
              z: 16
            }
          ]
        },
        {
          name: 'Malicious',
          data: [
            {
              x: 1602594179690,
              y: 30,
              z: 23
            }
          ]
        },
        {
          name: 'Phishing',
          data: [
            {
              x: 1602853389542,
              y: 30,
              z: 8
            }
          ]
        }
      ],

      chartOptions: {
        redrawOnParentResize: true,
        grid: {
          borderColor: '#f4f7fa',
          position: 'back',
          responsive: true,
          strokeDashArray: 2,
          row: {
            opacity: 0.5
          },
          column: {
            opacity: 0.5
          },
          xaxis: {
            lines: {
              show: true
            }
          },
          yaxis: {
            lines: {
              show: true
            }
          },
          padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 10
          }
        },
        chart: {
          type: 'bubble',
          width: 500,
          toolbar: {
            show: true
          }
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: true,
          distributed: false,
          background: {
            enabled: true,
            foreColor: '#575757',
            padding: '15px'
          }
        },
        fill: {
          opacity: 0.6
        },
        xaxis: {
          type: 'datetime',
          axisTicks: {
            offsetX: 0
          },
          labels: {
            format: 'MMM dd',
            style: {
              colors: '#b0bac9',
              fontWeight: 400,
              fontSize: '12px'
            }
          },

          min: new Date('25 Sep 2020').getTime(),
          max: new Date('08 Nov 2020').getTime()
        },
        yaxis: {
          max: 100,
          min: 0,
          tickAmount: 5,
          axisBorder: {
            show: true,
            color: '#e0e7ff'
          },
          labels: {
            style: {
              colors: '#b0bac9',
              fontWeight: 400,
              fontSize: '12px'
            }
          },
          title: {
            text: 'Avarage Reliability',
            style: {
              color: '#b0bac9',
              fontSize: '12px',
              fontFamily: 'Open Sans,sans-serif',
              fontWeight: '400'
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="scss"></style>
