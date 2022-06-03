<template>
  <v-form ref="refForm">
    <FormGroup
      class-name="w-100 max-w-100 ldap-import-table"
      :title="labels.LDAPGroups"
      :sub-title="labels.LDAPGroupsSub"
    >
      <TargetUserLDAPImportTable
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
    <FormGroup :title="labels.SelectTargetGroup" :sub-title="labels.SelectTargetGroupSub">
      <KSelect
        v-model.trim="targetGroupResourceId"
        type="autocomplete"
        id="input--target-user-groups"
        outlined
        clearable
        persistent-hint
        position="top"
        hint="*Required"
        prepend-inner-icon="mdi-magnify"
        autocomplete="disabled"
        placeholder="Select a target group"
        no-data-text="No user group available"
        :items="targetGroupItems"
        :rules="[(v) => Validations.required(v)]"
        :disabled="isEdit"
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
      formData: {},
      targetGroupItems: [],
      targetGroupResourceId: ''
    }
  },
  computed: {
    getLDAPGroupsErrorMessage() {
      return !this?.selectedLDAPItems?.length ? 'Required' : ''
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
          disabled: !item.isSelectable
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
