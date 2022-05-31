<template>
  <div>
    <KButtonRadioGroup v-model="selectedRadioGroupIndex" :items="radioGroupItems" />
    <div>
      <TargetUserLdapImportManuallyStep v-if="selectedRadioGroupIndex === 0" />
      <TargetUserLDAPImportSyncByQueryStep v-else />
    </div>
  </div>
</template>

<script>
import KButtonRadioGroup from '@/components/ButtonRadioGroup/KButtonRadioGroup'
import TargetUserLdapImportManuallyStep from '@/components/TargetUsers/LDAP/TargetUserLDAPImportManuallyStep'
import TargetUserLDAPImportSyncByQueryStep from '@/components/TargetUsers/LDAP/TargetUserLDAPImportSyncByQueryStep'
export default {
  name: 'TargetUserLDAPImportModalStep2',
  components: {
    TargetUserLDAPImportSyncByQueryStep,
    TargetUserLdapImportManuallyStep,
    KButtonRadioGroup
  },
  data() {
    return {
      radioGroupItems: [{ label: 'MANUALLY' }, { label: 'SYNC BY QUERY' }],
      selectedRadioGroupIndex: 0
    }
  }
}
</script>
