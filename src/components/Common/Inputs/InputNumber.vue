<template>
  <v-text-field
    v-bind="requiredProps"
    outlined
    dense
    type="number"
    :value="value"
    :id="id"
    :placeholder="placeholder"
    :rules="rules"
    :disabled="disabled"
    :readonly="readonly"
    :hide-details="hideDetails"
    :pattern="pattern"
    @input="$emit('input', $event)"
  />
</template>
<script>
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
export default {
  name: 'InputNumber',
  props: {
    value: {
      type: String
    },
    initialPlaceholder: {
      type: String,
      default: ''
    },
    initialRules: {
      type: Array
    },
    entityName: {
      type: String
    },
    id: {
      type: String
    },
    required: {
      default: true
    },
    disabled: {
      default: false
    },
    readonly: {
      default: false
    },
    applyRules: {
      default: true
    },
    hideDetails: {
      default: false
    },
    pattern: {
      default: () => /^[\d]+$/
    }
  },
  data() {
    return {
      rules: [],
      placeholder: '',
      requiredProps: {}
    }
  },
  created() {
    if (this.required) {
      this.requiredProps = { hint: '*Required', persistentHint: true }
      this.rules.unshift((v) => Validations.required(v))
    }

    this.placeholder = this.initialPlaceholder || `Enter ${this.entityName} name`

    this.rules = this.applyRules ? this.initialRules || this.rules : []
  }
}
</script>
