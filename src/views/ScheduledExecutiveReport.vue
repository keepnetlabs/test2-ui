<template>
  <div class="executive-report-scheduled-report">
    <ExecutiveReportNewCard is-preview is-scheduled-report />
  </div>
</template>
<script>
import ExecutiveReportNewCard from '@/components/ExecutiveReports/ExecutiveReportNewCard.vue'

export default {
  name: 'PreviewExecutiveReport',
  components: { ExecutiveReportNewCard },
  data() {
    return {}
  }
}
</script>
