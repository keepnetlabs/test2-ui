<template>
  <v-textarea
    v-bind="requiredProps"
    :value="value"
    :id="id"
    outlined
    dense
    no-resize
    autocomplete="street-address"
    :placeholder="placeholder"
    :rules="rules"
    @input="$emit('input', $event)"
  />
</template>

<script>
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
export default {
  name: 'InputAddress',
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
      default: 200
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
            labels.getMaxLengthMessage(labels.Address, this.maxLength)
          )
      ],
      placeholder: '',
      requiredProps: {}
    }
  },
  created() {
    if (this.required) {
      this.requiredProps = { hint: labels.RequiredStar, persistentHint: true }
      this.rules.unshift((v) => Validations.required(v))
    }
    this.rules = this.initialRules || this.rules
    this.placeholder = this.initialPlaceholder || labels.EnterAddress
  }
}
</script>
