<template>
  <v-textarea
    v-bind="requiredProps"
    :value="value"
    :id="id"
    outlined
    dense
    no-resize
    autocomplete="disabled"
    :height="height"
    :rows="rows"
    :disabled="disabled"
    :placeholder="placeholder"
    :rules="rules"
    :readonly="readonly"
    @input="$emit('input', $event)"
  />
</template>

<script>
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
export default {
  name: 'InputDescription',
  props: {
    value: {
      type: String
    },
    id: {
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
    required: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: Number,
      default: 2000
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
    height: {
      type: String
    },
    rows: {
      type: String
    }
  },
  data() {
    return {
      rules: [
        (v) => Validations.startsWithSpace(v, labels.CannotStartWithSpace),
        (v) =>
          Validations.maxLength(
            v,
            this.maxLength,
            labels.getMaxLengthMessage(labels.Description, this.maxLength)
          )
      ],
      placeholder: '',
      requiredProps: {}
    }
  },
  watch: {
    required(val) {
      if (val) {
        this.requiredProps = { hint: labels.RequiredStar, persistentHint: true }
        this.rules.unshift((v) => Validations.required(v))
      }
      this.rules = this.applyRules ? this.initialRules || this.rules : []
      this.placeholder = this.initialPlaceholder || labels.EnterDescription
    }
  },
  created() {
    if (this.required) {
      this.requiredProps = { hint: labels.RequiredStar, persistentHint: true }
      this.rules.unshift((v) => Validations.required(v))
    }
    this.rules = this.applyRules ? this.initialRules || this.rules : []
    this.placeholder = this.initialPlaceholder || labels.EnterDescription
  }
}
</script>
