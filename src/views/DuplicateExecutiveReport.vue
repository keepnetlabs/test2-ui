<template>
  <NewExecutiveReportCommonContainer is-edit is-duplicate />
</template>
<script>
import KContainer from '@/components/KContainer/KContainer.vue'
import ExecutiveReportNewCard from '@/components/ExecutiveReports/ExecutiveReportNewCard.vue'
import NewExecutiveReportCommonContainer from '@/components/ExecutiveReports/NewExecutiveReportCommonContainer.vue'

export default {
  name: 'DuplicateExecutiveReport',
  components: { NewExecutiveReportCommonContainer },
  data() {
    return {}
  }
}
</script>
