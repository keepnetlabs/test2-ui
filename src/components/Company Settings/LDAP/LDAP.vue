<template>
  <el-tabs v-model="tab" id="settings-el-tabs" class="k-sub-tab">
    <el-tab-pane id="ldap-settings" label="Settings" name="settings">
      <LDAPSettings v-if="tab === 'settings'" />
    </el-tab-pane>
    <el-tab-pane id="ldap-scheduled-syncs" label="Scheduled Syncs" name="scheduled-syncs">
      <LDAPScheduledSyncs v-if="tab === 'scheduled-syncs'" />
    </el-tab-pane>
    <el-tab-pane id="ldap-field-mappings" label="Field Mapping" name="field-mapping">
      <LDAPFieldMappings v-if="tab === 'field-mapping'" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { useLoading } from '@/hooks/useLoading'
import LDAPSettings from '@/components/Company Settings/LDAP/LDAPSettings'
import LDAPScheduledSyncs from '@/components/Company Settings/LDAP/LDAPScheduledSyncs'
import LDAPFieldMappings from '@/components/Company Settings/LDAP/LDAPFieldMappings'
export default {
  name: 'LDAP',
  components: { LDAPFieldMappings, LDAPScheduledSyncs, LDAPSettings },
  mixins: [useLoading],
  data() {
    return {
      tab: 'settings'
    }
  }
}
</script>
