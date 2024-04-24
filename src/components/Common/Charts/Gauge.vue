<template>
  <VueGauge :refid="refId" :options="options" />
</template>
<script>
import { createRandomCryptStringNumber } from '@/utils/functions'

export default {
  name: 'Gauge',
  components: {
    VueGauge: () => import('vue-gauge')
  },
  props: {
    refId: {
      type: String,
      default: () => `gauge-key-${createRandomCryptStringNumber()}`
    },
    options: {
      type: Object,
      default: () => ({
        hasNeedle: true,
        needleColor: '#757575',
        arcColors: ['#43A047', '#FBF280', '#E6A23C', '#B6791D', '#B83A3A'],
        arcDelimiters: [20, 40, 60, 80],
        arcPadding: 0,
        arcPaddingColor: 'white',
        arcLabels: ['0', '20', '40', '60', '80', '100'],
        arcLabelFontSize: true,
        arcOverEffect: false,
        rangeLabelFontSize: false,
        chartWidth: 600,
        labelsFont: 'Open Sans'
      })
    }
  }
}
</script>
