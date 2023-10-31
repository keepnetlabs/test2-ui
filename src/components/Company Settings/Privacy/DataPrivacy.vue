<template>
  <div class="smtp-settings">
    <CompanySettingsHeader
      title="Data Privacy"
      sub-title="Setting the visibility of target users' data"
    />
  </div>
</template>
<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'

export default {
  name: 'DataPrivacy',
  components: {
    CompanySettingsHeader
  }
}
</script>
