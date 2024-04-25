<template>
  <div class="executive-report-gauge-chart">
    <Gauge v-if="rawData" ref="chart" :options="chartOptions" />
  </div>
</template>
<script>
import Gauge from '@/components/Common/Charts/Gauge.vue'
export default {
  name: 'ExecutiveReportGaugeChart',
  components: { Gauge },
  props: {
    rawData: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      chartOptions: {
        hasNeedle: true,
        needleColor: '#757575',
        arcColors: ['#43A047', '#FBF280', '#E6A23C', '#B6791D', '#B83A3A'],
        arcDelimiters: [20, 40, 60, 80],
        arcPadding: 0,
        arcPaddingColor: 'white',
        rangeLabel: ['0', '100'],
        arcLabels: ['20', '40', '60', '80'],
        arcLabelFontSize: true,
        arcOverEffect: false,
        rangeLabelFontSize: false,
        chartWidth: 650,
        labelsFont: 'Open Sans',
        needleValue: this.rawData
      }
    }
  },
  created() {}
}
</script>
