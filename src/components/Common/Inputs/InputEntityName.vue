<template>
  <v-text-field
    v-bind="requiredProps"
    ref="refInput"
    outlined
    dense
    :value="value"
    :id="id"
    :type="type"
    :placeholder="placeholder"
    :rules="rules"
    :disabled="disabled"
    :readonly="readonly"
    :hide-details="hideDetails"
    @input="$emit('input', $event)"
  />
</template>
<script>
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
export default {
  name: 'InputEntityName',
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
      type: Boolean,
      default: false
    },
    hint: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    maxLength: {
      type: Number,
      default: 200
    }
  },
  data() {
    return {
      rules: [(v) => Validations.startsWithSpace(v, labels.CannotStartWithSpace)],
      placeholder: '',
      requiredProps: {}
    }
  },
  watch: {
    initialRules: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) this.rules = this.applyRules ? val : []
      }
    },
    required: {
      immediate: true,
      handler() {
        this.applyRequiredProps()
      }
    }
  },
  mounted() {
    this.rules.unshift((v) =>
      Validations.maxLength(
        v,
        this.maxLength,
        labels.getMaxLengthMessage(this.entityName, this.maxLength)
      )
    )

    this.placeholder = this.initialPlaceholder || `Enter ${this.entityName} name`

    this.rules = this.applyRules ? this.initialRules || this.rules : []
  },
  methods: {
    applyRequiredProps() {
      if (this.required) {
        this.requiredProps = { hint: this.hint || '*Required', persistentHint: true }
        this.rules.unshift((v) => Validations.required(v))
      } else {
        this.requiredProps = {}
        this.rules = this.applyRules ? this.initialRules : []
      }
    }
  }
}
</script>
