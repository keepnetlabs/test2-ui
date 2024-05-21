<template>
  <NewExecutiveReportCommonContainer is-edit />
</template>
<script>
import KContainer from '@/components/KContainer/KContainer.vue'
import ExecutiveReportNewCard from '@/components/ExecutiveReports/ExecutiveReportNewCard.vue'
import NewExecutiveReportCommonContainer from '@/components/ExecutiveReports/NewExecutiveReportCommonContainer.vue'

export default {
  name: 'EditExecutiveReport',
  components: { NewExecutiveReportCommonContainer },
  data() {
    return {}
  }
}
</script>
