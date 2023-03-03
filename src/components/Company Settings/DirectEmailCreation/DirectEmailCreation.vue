<template>
  <div id="direct-email-creation">
    <CompanySettingsHeader
      :title="labels.DirectEmailCreationTitle"
      :sub-title="labels.DirectEmailCreationSubTitle"
    />
    <DirectEmailCreationTable />
  </div>
</template>

<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import labels from '@/model/constants/labels'
import DirectEmailCreationTable from '@/components/Company Settings/DirectEmailCreation/DirectEmailCreationTable.vue'
export default {
  name: 'DirectEmailCreation',
  components: { DirectEmailCreationTable, CompanySettingsHeader },
  data() {
    return {
      labels
    }
  }
}
</script>
