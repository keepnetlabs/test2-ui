<template>
  <v-textarea
    v-bind="requiredProps"
    :value="value"
    :id="id"
    outlined
    dense
    no-resize
    autocomplete="off"
    :height="height"
    :rows="rows"
    :disabled="disabled"
    :placeholder="placeholder"
    :rules="rules"
    :readonly="readonly"
    :hint="hint"
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
      type: String,
      default: labels.Description
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
    },
    hint: {
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
            labels.getMaxLengthMessage(this.entityName, this.maxLength)
          )
      ],
      placeholder: '',
      requiredProps: {}
    }
  },
  watch: {
    required(val) {
      if (val) {
        this.requiredProps = { hint: this.hint || labels.RequiredStar, persistentHint: true }
        this.rules.unshift((v) => Validations.required(v))
      }
      this.rules = this.applyRules ? this.initialRules || this.rules : []
      this.placeholder = this.initialPlaceholder || labels.EnterDescription
    }
  },
  created() {
    if (this.required) {
      this.requiredProps = { hint: this.hint || labels.RequiredStar, persistentHint: true }
      this.rules.unshift((v) => Validations.required(v))
    }
    this.rules = this.applyRules ? this.initialRules || this.rules : []
    this.placeholder = this.initialPlaceholder || labels.EnterDescription
  }
}
</script>
