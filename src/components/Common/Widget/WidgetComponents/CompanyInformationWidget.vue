<template>
  <company-information :companyInformation="companyInformation"
  ><!-- eslint-disable-line --></company-information
  >
</template>

<script>
import CompanyInformation from '@/components/Dashboard/CompanyInformation'
export default {
  name: 'CompanyInformationWidget',
  components: {
    CompanyInformation
  },
  data() {
    return {
      companyInformation: {
        name: '',
        awarenessScore: '',
        awarenessColor: '#e6a23c',
        licenceStatus: '5000 registered users of 5000',
        endsAt: '25.07.2020',
        isLicenceStatusValid: false,
        licenseStatusMessage:
          'You reached the user license limit. To add more users, please contract your administrator to upgrade your plan.'
      }
    }
  }
}
</script>

<style></style>
