<template>
  <Pie :key="series[0]" :data="series" :chart-options="chartOptions" />
</template>

<script>
import Pie from '@/components/Common/Charts/Pie'
export default {
  name: 'TestPie',
  components: {
    Pie
  },
  data() {
    return {
      series: [44, 80],
      chartOptions: {
        labels: ['Phishing', 'Malicious'],
        fill: {
          colors: ['#f56c6c', '#e6a23c']
        },
        colors: ['#f56c6c', '#e6a23c'],
        legend: {
          verticalAlign: 'right',
          fontSize: '16px',
          fontFamily: undefined,
          position: 'right',
          offsetX: 0,
          markers: {
            width: 16,
            height: 16,
            strokeWidth: 16,
            shape: 'square',
            radius: 0,
            offsetX: 20
          },
          itemMargin: {
            horizontal: 6,
            vertical: 15
          },
          onItemClick: {
            toggleDataSeries: true
          },
          onItemHover: {
            highlightDataSeries: true
          },
          labels: {
            colors: ['#f56c6c', '#e6a23c']
          }
        },
        dataLabels: {
          enabled: false
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
                offsetX: -30,
                offsetY: 10
              },
              itemMargin: {
                horizontal: 100,
                vertical: 0
              },
              legend: {
                position: 'bottom',
                offsetY: -10
              }
            }
          }
        ]
      }
    }
  }
}
</script>
