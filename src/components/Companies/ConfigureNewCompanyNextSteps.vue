<template>
  <div class="mt-6">
    <ConfigureNewCompanyNextStepsItem
      route-text="Company > Company Settings > Notification Templates"
      text="to edit and create email notificaiton templates"
      title="Customize notification templates"
      :route-link="{ name: 'Company Settings', params: { tab: 'notification-template' } }"
    />
    <ConfigureNewCompanyNextStepsItem
      route-link="/target-users"
      route-text="Company > Target Users"
      text="to add target users to this organization"
      title="Create target users"
    />
    <ConfigureNewCompanyNextStepsItem
      route-link="/mailConfiguration"
      route-text="Incident Responder > Mail configurations"
      text="to define email services for effective use of Phishing Reporter and Incident responder"
      title="Mail configurations"
    />
    <ConfigureNewCompanyNextStepsItem
      route-link="/companies"
      route-text="Company > Companies "
      text="to manually create tenant companies"
      title="Create tenant companies"
    />
    <ConfigureNewCompanyNextStepsItem
      route-text="Phishing Reporter > Settings "
      text="to configure add-in settings"
      title="Configure Phishing Reporter"
      :route-link="{ name: 'Phishing Reporter', params: { tab: 'phishing-reporter-settings' } }"
    />
  </div>
</template>

<script>
import ConfigureNewCompanyNextStepsItem from '@/components/Companies/ConfigureNewCompanyNextStepsItem'
export default {
  name: 'ConfigureNewCompanyNextSteps',
  components: { ConfigureNewCompanyNextStepsItem }
}
</script>
