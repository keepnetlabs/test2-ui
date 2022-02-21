<template>
  <v-text-field
    v-bind="requiredProps"
    :value="value"
    :id="id"
    outlined
    dense
    :placeholder="placeholder"
    :rules="rules"
    @input="$emit('input', $event)"
  ></v-text-field>
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
    }
  },
  data() {
    return {
      rules: [
        (v) => Validations.startsWithSpace(v, labels.CannotStartWithSpace),
        (v) => Validations.isEntityNameSpecialCharacter(v)
      ],
      placeholder: '',
      requiredProps: {}
    }
  },
  created() {
    if (this.required) {
      this.requiredProps = { hint: '*Required', persistentHint: true }
      this.rules.unshift((v) => Validations.required(v))
    }

    this.rules.push((v) =>
      Validations.maxLength(v, 64, labels.getMaxLengthMessage(this.entityName, 64))
    )

    this.placeholder = this.initialPlaceholder || `Enter ${this.entityName} name`

    this.rules = this.initialRules || this.rules
  }
}
</script>
