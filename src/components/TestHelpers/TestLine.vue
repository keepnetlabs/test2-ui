<template>
  <line-chart :chart-data="chartData" :chart-options="chartOptions" />
</template>

<script>
import Line from '@/components/Common/Charts/Line'

export default {
  name: 'TestLine',
  components: {
    'line-chart': Line
  },
  data() {
    return {
      chartOptions: {},
      chartData: {}
    }
  }
}
</script>
