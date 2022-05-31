<template>
  <v-form ref="refForm">
    <FormGroup
      class-name="mt-6 w-100 max-w-100"
      :title="labels.LDAPGroups"
      :sub-title="labels.LDAPGroupsSub"
    >
      <TargetUserLDAPImportTable />
      <CustomError
        class="mb-6 ml-2"
        style="margin-top: 2px;"
        :is-valid="isLDAPGroupsValid"
        :error-message="getLDAPGroupsErrorMessage"
      />
    </FormGroup>
    <FormGroup :title="labels.SelectTargetGroup" :sub-title="labels.SelectTargetGroupSub">
      <InputTargetGroup
        v-model.trim="formData.groupResourceId"
        ref="inputTargetGroup"
        clearable
        position="top"
        :manipulate-items="handleManipulateItems"
      />
    </FormGroup>
  </v-form>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup'
import TargetUserLDAPImportTable from '@/components/TargetUsers/LDAP/TargetUserLDAPImportTable'
import CustomError from '@/components/CustomError'
import labels from '@/model/constants/labels'
import InputTargetGroup from '@/components/Common/Inputs/InputTargetGroup'
export default {
  name: 'TargetUserLDAPImportModalStep1',
  components: { InputTargetGroup, CustomError, TargetUserLDAPImportTable, FormGroup },
  data() {
    return {
      labels,
      isLDAPGroupsValid: true,
      formData: {}
    }
  },
  computed: {
    getLDAPGroupsErrorMessage() {
      return this?.formData?.targetGroupResourceIds?.length
        ? this.isLDAPGroupsValid
          ? 'Target groups must have at least 1 user'
          : 'Required'
        : 'Required'
    }
  },
  methods: {
    handleManipulateItems(items = []) {
      return items.map(({ name, resourceId }) => ({ text: name, value: resourceId }))
    }
  }
}
</script>
