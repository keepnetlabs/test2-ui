<template>
  <NewExecutiveReportCommonContainer :is-show-left-side="false" />
</template>
<script>
import KContainer from '@/components/KContainer/KContainer.vue'
import ExecutiveReportNewCard from '@/components/ExecutiveReports/ExecutiveReportNewCard.vue'
import NewExecutiveReportCommonContainer from '@/components/ExecutiveReports/NewExecutiveReportCommonContainer.vue'

export default {
  name: 'PreviewExecutiveReport',
  components: { NewExecutiveReportCommonContainer },
  data() {
    return {}
  }
}
</script>
