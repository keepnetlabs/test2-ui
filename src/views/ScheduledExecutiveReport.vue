<template>
  <div class="executive-report-scheduled-report">
    <ExecutiveReportNewCard
      is-preview
      is-scheduled-report
      :default-company-logo="defaultCompanyLogo"
    />
  </div>
</template>
<script>
import ExecutiveReportNewCard from '@/components/ExecutiveReports/ExecutiveReportNewCard.vue'
import { getReportSchedulingLogo } from '../api/reports'

export default {
  name: 'PreviewExecutiveReport',
  components: { ExecutiveReportNewCard },
  data() {
    return {
      defaultCompanyLogo: null
    }
  },
  created() {
    getReportSchedulingLogo(localStorage.getItem('selectedCompanyRequestId')).then((logo) => {
      this.defaultCompanyLogo = new File([logo.data], 'Default Company Logo', { type: logo.type })
    })
  }
}
</script>
