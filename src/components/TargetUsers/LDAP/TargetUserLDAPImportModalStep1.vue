<template>
  <v-form ref="refForm">
    <FormGroup
      class-name="w-100 max-w-100 ldap-import-table"
      :title="labels.LDAPGroups"
      :sub-title="labels.LDAPGroupsSub"
    >
      <TargetUserLDAPImportTable
        ref="refImportTable"
        :style="getLDAPTargetUserTableStyle"
        @on-selection-change="handleTableSelectionChange"
      />
      <CustomError
        class="mb-6 ml-2"
        style="margin-top: 2px;"
        :is-valid="isLDAPGroupsValid"
        :error-message="getLDAPGroupsErrorMessage"
      />
    </FormGroup>
    <FormGroup :title="labels.SelectTargetGroup" :sub-title="labels.SelectTargetGroupSub" has-hint>
      <KSelect
        v-model.trim="targetGroupResourceId"
        type="autocomplete"
        id="input--target-user-groups"
        custom-menu-class="target-user-ldap__target-groups"
        outlined
        clearable
        persistent-hint
        hint="*Required"
        prepend-inner-icon="mdi-magnify"
        autocomplete="disabled"
        placeholder="Select a target group"
        no-data-text="No user group available"
        position="top"
        :items="targetGroupItems"
        :rules="[(v) => Validations.required(v)]"
        :disabled="isEdit"
        :slots="{ item: true }"
      >
        <template #item="{ item }">
          <v-tooltip v-if="item.disabled" bottom>
            <template #activator="{on}">
              <span v-on="on">
                {{ item.text }}
              </span>
            </template>
            <span>This user group is already synced with LDAP</span>
          </v-tooltip>
          <span v-else>
            {{ item.text }}
          </span>
        </template>
      </KSelect>
    </FormGroup>
    <FormGroup v-if="isEdit" :title="labels.Status" class="mb-6">
      <v-switch
        v-model.trim="isActive"
        id="input--switch-ldap"
        class="k-switch mt-0"
        hide-details
        color="#2196f3"
        style="max-width: 100px;"
        :label="getSwitchLabel"
      />
    </FormGroup>
  </v-form>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup'
import TargetUserLDAPImportTable from '@/components/TargetUsers/LDAP/TargetUserLDAPImportTable'
import CustomError from '@/components/CustomError'
import labels from '@/model/constants/labels'
import LDAPService from '@/api/ldap'
import KSelect from '@/components/Common/Inputs/KSelect'
import * as Validations from '@/utils/validations'
export default {
  name: 'TargetUserLDAPImportModalStep1',
  components: { KSelect, CustomError, TargetUserLDAPImportTable, FormGroup },
  props: {
    selectedLDAPItems: {
      type: Array,
      default: () => []
    }
  },
  inject: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      labels,
      Validations,
      isLDAPGroupsValid: true,
      isActive: true,
      targetGroupItems: [],
      targetGroupResourceId: ''
    }
  },
  computed: {
    getLDAPGroupsErrorMessage() {
      return !this?.selectedLDAPItems?.length ? 'Required' : ''
    },
    getSwitchLabel() {
      return this.isActive ? labels.Active : labels.Passive
    },
    getLDAPTargetUserTableStyle() {
      return !this.isLDAPGroupsValid
        ? {
            border: '1px solid rgb(255, 82, 82) !important',
            borderRadius: '12px !important'
          }
        : {}
    }
  },
  created() {
    this.callForTargetGroups()
  },
  methods: {
    callForTargetGroups() {
      LDAPService.getTargetGroupsForLDAP().then((response) => {
        const {
          data: { data }
        } = response
        this.targetGroupItems = data.map((item) => ({
          text: item.name,
          value: item.resourceId,
          disabled: !item.isSelectable,
          attrs: {
            usedLdapName: item.message
          }
        }))
      })
    },
    validateForm() {
      return this?.$refs?.refForm?.validate() && this?.selectedLDAPItems?.length
    },
    handleTableSelectionChange(selectedLDAPItems) {
      if (selectedLDAPItems.length) this.isLDAPGroupsValid = true
      this.$emit('update:selectedLDAPItems', selectedLDAPItems)
    }
  }
}
</script>
