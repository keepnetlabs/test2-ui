<template>
  <div>
    <ConfigureCompanyStepHeader
      class="mb-6"
      :title="labels.ScheduledSyncs"
      :subtitle="labels.ScheduledSyncsSub"
    />
    <LDAPScheduledSyncsTable />
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
import LDAPScheduledSyncsTable from '@/components/Company Settings/LDAP/LDAPScheduledSyncsTable'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'
export default {
  name: 'LDAPScheduledSyncs',
  components: { ConfigureCompanyStepHeader, LDAPScheduledSyncsTable },
  data() {
    return {
      labels
    }
  }
}
</script>
