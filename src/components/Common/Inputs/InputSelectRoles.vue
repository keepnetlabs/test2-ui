<template>
  <FormGroup has-hint :title="title" :sub-title="subTitle">
    <k-select
      v-bind="commonRules"
      :value="value"
      :items="items"
      :item-text="itemText"
      :item-value="itemValue"
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
      :placeholder="placeholder"
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
    itemText: {
      type: String,
      default: 'name'
    },
    itemValue: {
      type: String,
      default: 'resourceId'
    },
    title: {
      type: String,
      default: 'Role'
    },
    subTitle: {
      type: String,
      default: 'Select intended role for this training'
    },
    placeholder: {
      type: String,
      default: 'Select roles'
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
