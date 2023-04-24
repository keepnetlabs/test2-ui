<template>
  <v-text-field
    ref="refInputNumber"
    v-bind="requiredProps"
    outlined
    dense
    :value="value"
    :id="id"
    :placeholder="placeholder"
    :rules="rules"
    :disabled="disabled"
    :readonly="readonly"
    :hide-details="hideDetails"
    @input="handleInputChange"
  />
</template>
<script>
import * as Validations from '@/utils/validations'
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
      default: () => /^\d+$/
    }
  },
  data() {
    return {
      rules: [],
      placeholder: '',
      requiredProps: {}
    }
  },
  methods: {
    handleInputChange(value) {
      if (!value || this.pattern.test(value)) {
        this.$emit('input', value)
      } else {
        this.$refs.refInputNumber.initialValue = this.value
        this.$refs.refInputNumber.lazyValue = this.value
      }
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
