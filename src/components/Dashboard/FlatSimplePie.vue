<template>
  <v-chart id="main" style="width:30px; height:30px;" :options="options" />
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'

export default {
  components: {
    'v-chart': ECharts
  },
  name: 'FlatSimplePie',
  created() {
    const indexColors = ['#67c23a', '#ffcc33', '#409eff', '#f56c6c']
    const indexNames = ['No Response', 'Read', 'Click', 'Data Submitted']
    let data = this.pieData.map((value, index) => {
      const newData = {
        value,
        name: indexNames[index],
        itemStyle: {
          color: indexColors[index]
        }
      }
      return newData
    })
    if (data && data.length === 0) {
      data = [
        {
          value: 1,
          name: 'No Data',
          itemStyle: {
            color: '#00bcd4'
          }
        }
      ]
    }
    this.options.series[0].data = data
  },
  data: () => ({
    options: {
      responsive: true,
      maintainAspectRatio: false,
      series: [
        {
          name: 'Reference Page',
          type: 'pie',
          radius: '100%',
          hoverAnimation: false,
          label: {
            show: false
          },
          data: []
        }
      ]
    }
  }),
  props: {
    pieData: {
      type: Array,
      required: true
      /* default() {
        return [
          {
            value: 1,
            name: 'No Data',
            itemStyle: {
              color: '#67c23a',
            },
          },
        ];
      }, */
    }
  }
}
</script>

<style scoped></style>
