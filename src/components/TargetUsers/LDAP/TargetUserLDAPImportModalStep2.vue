<template>
  <div>
    <KButtonRadioGroup v-model="selectedRadioGroupIndex" :items="radioGroupItems" />
    <div>
      <TargetUserLDAPImportLoader class="mt-6" v-if="false" />
      <TargetUserLdapImportManuallyStep v-else-if="selectedRadioGroupIndex === 0" />
      <TargetUserLDAPImportSyncByQueryStep v-else />
    </div>
  </div>
</template>

<script>
import KButtonRadioGroup from '@/components/ButtonRadioGroup/KButtonRadioGroup'
import TargetUserLdapImportManuallyStep from '@/components/TargetUsers/LDAP/TargetUserLDAPImportManuallyStep'
import TargetUserLDAPImportSyncByQueryStep from '@/components/TargetUsers/LDAP/TargetUserLDAPImportSyncByQueryStep'
import TargetUserLDAPImportLoader from '@/components/TargetUsers/LDAP/TargetUserLDAPImportLoader'
export default {
  name: 'TargetUserLDAPImportModalStep2',
  components: {
    TargetUserLDAPImportLoader,
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
