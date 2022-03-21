<template>
  <div class="scim-settings">
    <CompanySettingsHeader :title="CONSTANTS.title" :sub-title="CONSTANTS.subtitle" />
    <SCIMSettingsTable :PERMISSIONS="PERMISSIONS" />
  </div>
</template>

<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import SCIMSettingsTable from '@/components/Company Settings/SCIM/SCIMSettingsTable'
export default {
  name: 'SCIMSettings',
  components: { SCIMSettingsTable, CompanySettingsHeader },
  props: {
    PERMISSIONS: {
      type: Object
    }
  },
  data() {
    return {
      CONSTANTS: {
        title: 'SCIM Settings',
        subtitle: 'Manage SCIM Integrations'
      }
    }
  }
}
</script>
