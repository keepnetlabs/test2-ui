<template>
  <NewExecutiveReportCommonContainer />
</template>
<script>
import NewExecutiveReportCommonContainer from '@/components/ExecutiveReports/NewExecutiveReportCommonContainer.vue'

export default {
  name: 'NewExecutiveReport',
  components: { NewExecutiveReportCommonContainer },
  data() {
    return {}
  },
  mounted() {
    if (window.safari || navigator.vendor.match(/apple/i)) {
      const mainNode = document.querySelector('.v-main__wrap')
      if (!mainNode) return
      mainNode.style.overflow = 'hidden'
    }
  },
  beforeDestroy() {
    const mainNode = document.querySelector('.v-main__wrap')
    if (!mainNode) return
    mainNode.style.overflow = ''
  }
}
</script>
