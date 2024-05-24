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
import { getExecutiveReportLogo } from '@/api/reports'

export default {
  name: 'PreviewExecutiveReport',
  components: { ExecutiveReportNewCard },
  data() {
    return {
      defaultCompanyLogo: null
    }
  },
  created() {
    const { params, query } = this.$route
    const { id } = params
    const { token, companyResourceId } = query
    if (!token || !companyResourceId) return
    getExecutiveReportLogo(id, token, companyResourceId).then((logo) => {
      this.defaultCompanyLogo = new File([logo.data], 'Executive Report Logo', { type: logo.type })
    })
  },
  mounted() {
    setTimeout(() => {
      if (window && window.userflow) {
        window.userflow.endAll()
        const userflowIcon = document.querySelector('.userflowjs-icon')
        if (userflowIcon) userflowIcon.style.display = 'none'
      }
    }, 3000)
  }
}
</script>
