<template>
  <el-tabs
    v-model="tab"
    id="settings-el-tabs"
    :class="['k-sub-tab', { 'ldap-field-mapping-disabled': isFieldMappingDisabled }]"
    :before-leave="handleBeforeLeave"
  >
    <el-tab-pane id="ldap-settings" label="Settings" name="settings">
      <LDAPSettings
        :initial-form-data="initialFormData"
        :is-loading="isLoading"
        @on-submit="handleSubmit"
      />
    </el-tab-pane>
    <el-tab-pane id="ldap-scheduled-syncs" label="Scheduled Syncs" name="scheduled-syncs">
      <LDAPScheduledSyncs />
    </el-tab-pane>
    <el-tab-pane id="ldap-field-mappings" label="Field Mapping" name="field-mapping">
      <template v-if="isFieldMappingDisabled" #label>
        Field Mapping
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-icon v-on="on" class="mr-2" size="18">mdi-alert-circle</v-icon>
          </template>
          <span>You must first connect to active directory to map fields.</span>
        </v-tooltip>
      </template>
      <LDAPFieldMappings
        v-if="tab === 'field-mapping'"
        :field-mappings="fieldMappings"
        :is-loading-from-parent="isLoading"
        @on-submit="handleSubmit"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { useLoading } from '@/hooks/useLoading'
import LDAPSettings from '@/components/Company Settings/LDAP/LDAPSettings'
import LDAPScheduledSyncs from '@/components/Company Settings/LDAP/LDAPScheduledSyncs'
import LDAPFieldMappings from '@/components/Company Settings/LDAP/LDAPFieldMappings'
import LDAPService from '@/api/ldap'
export default {
  name: 'LDAP',
  components: { LDAPFieldMappings, LDAPScheduledSyncs, LDAPSettings },
  mixins: [useLoading],
  data() {
    return {
      tab: 'settings',
      isFieldMappingDisabled: false,
      initialFormData: null,
      resourceId: '',
      fieldMappings: []
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    handleBeforeLeave(val) {
      return !(this.isFieldMappingDisabled && val === 'field-mapping')
    },
    callForData() {
      this.setLoading(true)
      LDAPService.getLDAPSettingDetailForMyCompany()
        .then((response) => {
          const {
            data: { data }
          } = response
          this.isFieldMappingDisabled = false
          data.password = data['hashPassword']
          this.resourceId = data.resourceId
          this.fieldMappings = data.fieldMappings
          delete data['hashPassword']
          delete data['resourceId']
          delete data['fieldMappings']
          delete data['name']
          this.initialFormData = data
        })
        .catch((e) => {
          const { response } = e
          if (response?.status === 404) {
            this.isFieldMappingDisabled = true
            if (this.tab === 'field-mapping') this.tab = 'settings'
          }
        })
        .finally(this.setLoading)
    },
    handleSubmit(formData) {
      //that means we are updating the settings
      this.setLoading(true)
      if (this.initialFormData) {
        LDAPService.updateLDAPSetting(
          { ...this.initialFormData, ...formData },
          this.resourceId
        ).finally(this.setLoading)
      } else {
        LDAPService.createLDAPSetting(formData).then(this.callForData)
      }
    }
  }
}
</script>

<style lang="scss">
.ldap-field-mapping-disabled #tab-field-mapping {
  color: #383b41 !important;
  opacity: 0.5;
  cursor: auto;
}
</style>
