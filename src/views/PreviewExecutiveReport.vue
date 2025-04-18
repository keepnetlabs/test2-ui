<template>
  <NewExecutiveReportCommonContainer :is-show-left-side="false" />
</template>
<script>
import NewExecutiveReportCommonContainer from '@/components/ExecutiveReports/NewExecutiveReportCommonContainer.vue'
export default {
  name: 'PreviewExecutiveReport',
  components: { NewExecutiveReportCommonContainer },
  data() {
    return {}
  }
}
</script>
