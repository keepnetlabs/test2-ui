<template>
  <FormGroup has-hint title="Roles" sub-title="Select the roles for this phishing scenario">
    <k-select
      v-bind="commonRules"
      :value="value"
      :items="items"
      item-text="name"
      item-value="resourceId"
      :disabled="disabled"
      :loading="loading"
      outlined
      multiple
      chips
      small-chips
      deletable-chips
      hint="*Required"
      required
      persistent-hint
      placeholder="Select roles"
      @input="$emit('input', $event)"
    />
  </FormGroup>
</template>

<script>
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import FormGroup from '@/components/SmallComponents/FormGroup.vue'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'

export default {
  name: 'InputSelectRoles',
  components: { FormGroup, KSelect },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      commonRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [(v) => (v.length > 0 ? Validations.required(v, labels.Required) : 'Required')]
      }
    }
  }
}
</script>
