<template>
  <el-tabs
    v-model="tab"
    id="settings-el-tabs"
    :class="[
      'k-sub-tab',
      {
        'ldap-field-mapping-disabled': isFieldMappingDisabled,
        'ldap-scheduled-syncs-disabled': isNotConfiguredYet
      }
    ]"
    :before-leave="handleBeforeLeave"
  >
    <el-tab-pane id="ldap-settings" label="Settings" name="settings">
      <LDAPNotConfigured v-if="isNotConfiguredYet" @integrateClicked="onIntegrateClicked" />
      <LDAPSettings
        v-if="!isNotConfiguredYet"
        :initial-form-data="initialFormData"
        :is-loading="isLoading"
        :field-mappings="fieldMappings"
        @on-submit="handleSubmit"
      />
    </el-tab-pane>
    <el-tab-pane
      v-if="getLDAPSettingSchedulePermission"
      id="ldap-scheduled-syncs"
      label="Scheduled Syncs"
      name="scheduled-syncs"
    >
      <LDAPScheduledSyncs
        v-if="tab === 'scheduled-syncs'"
        :resource-id="resourceId"
        :field-mappings="fieldMappings"
      />
    </el-tab-pane>
    <el-tab-pane
      v-if="getLDAPFieldMappingPermissions"
      id="ldap-field-mappings"
      label="Field Mapping"
      name="field-mapping"
    >
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
        :initial-custom-fields="customFields"
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
import LDAPNotConfigured from '@/components/Company Settings/LDAP/LDAPNotConfigured'
import LDAPService from '@/api/ldap'
import {
  defaultFieldMappings,
  getDefaultFieldMappingsWithCurrent
} from '@/components/Company Settings/LDAP/utils'
import { getTargetUserCustomFieldsByCompanyId } from '@/api/targetUsers'
import { mapGetters } from 'vuex'
export default {
  name: 'LDAP',
  components: { LDAPFieldMappings, LDAPScheduledSyncs, LDAPSettings, LDAPNotConfigured },
  mixins: [useLoading],
  data() {
    return {
      isNotConfiguredYet: false,
      tab: 'settings',
      isFieldMappingDisabled: false,
      initialFormData: null,
      resourceId: '',
      fieldMappings: [],
      customFields: []
    }
  },
  computed: {
    ...mapGetters({
      getLDAPSettingSchedulePermission: 'permissions/getLDAPSettingSchedulePermission',
      getLDAPFieldMappingPermissions: 'permissions/getLDAPFieldMappingPermissions'
    })
  },
  watch: {
    tab(val) {
      if (val === 'field-mapping') {
        this.callForData()
        this.callForCustomFields()
      }
    }
  },
  created() {
    this.callForData()
    this.callForCustomFields()
  },
  methods: {
    onIntegrateClicked() {
      this.isNotConfiguredYet = false
    },
    handleBeforeLeave(val) {
      return !(
        (this.isFieldMappingDisabled && val === 'field-mapping') ||
        (this.isNotConfiguredYet && val === 'scheduled-syncs')
      )
    },
    callForData() {
      this.setLoading(true)
      LDAPService.getLDAPSettingDetailForMyCompany()
        .then((response) => {
          if (
            response?.data?.message === 'LDAP Setting not found' &&
            response?.data?.status === 'SUCCESS'
          ) {
            this.isNotConfiguredYet = true
            this.isFieldMappingDisabled = true
            if (this.tab === 'field-mapping') this.tab = 'settings'
            return
          }
          const {
            data: { data }
          } = response
          this.isFieldMappingDisabled = false
          data.password = data['hashPassword']
          this.resourceId = data.resourceId
          this.fieldMappings = getDefaultFieldMappingsWithCurrent(
            defaultFieldMappings,
            data?.fieldMappings
          )
          delete data['hashPassword']
          delete data['resourceId']
          delete data['fieldMappings']
          delete data['name']
          this.initialFormData = data
        })
        .finally(this.setLoading)
    },
    callForCustomFields() {
      getTargetUserCustomFieldsByCompanyId().then((response) => {
        const {
          data: { data }
        } = response
        this.customFields = data.filter(
          (cField) => cField.fieldDataType === 'String' && cField.isActive
        )
        const sortProp = 'sortOrder'
        this.customFields.sort((a, b) => {
          if (a[sortProp] > b[sortProp]) {
            return 1
          } else if (a[sortProp] === b[sortProp]) {
            return 0
          }
          return -1
        })
      })
    },
    handleSubmit(formData) {
      //that means we are updating the settings
      this.setLoading(true)
      if (this.initialFormData) {
        LDAPService.updateLDAPSetting(
          { ...this.initialFormData, ...formData },
          this.resourceId
        ).finally(this.callForData)
      } else {
        LDAPService.createLDAPSetting(formData).then(this.callForData)
      }
    }
  }
}
</script>
