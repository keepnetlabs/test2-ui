<template>
  <KContainer id="preview-executive-report" tabless>
    <ExecutiveReportNewCard is-preview :edit-data="editData" />
  </KContainer>
</template>
<script>
import KContainer from '@/components/KContainer/KContainer.vue'
import ExecutiveReportNewCard from '@/components/ExecutiveReports/ExecutiveReportNewCard.vue'

export default {
  name: 'PreviewExecutiveReport',
  components: { ExecutiveReportNewCard, KContainer },
  data() {
    return {
      editData: {
        name: 'System Executive Report',
        date: '02/04/2024',
        companyName: 'Keepnet Labs',
        logo:
          localStorage.getItem('isSelectCompany') === 'true'
            ? this.$store.state.dashboard.selectedCompanyObject.logoUrl
            : this.$store.state.auth.logoUrl
      }
    }
  }
}
</script>
