<template>
  <KSelect
    outlined
    type="autocomplete"
    :required="required"
    :persistent-hint="persistentHint"
    :items="items"
    :item-disabled="itemDisabled"
    :item-text="itemText"
    :item-value="itemValue"
    :value="value"
    :hint="hint"
    :disabled="disabled"
    :menu-props="menuProps"
    :placeholder="placeholder"
    :hide-details="hideDetails"
    :rules="rules"
    :label="label"
    @input="handleLanguageChange"
  />
</template>

<script>
import KSelect from '@/components/Common/Inputs/KSelect'
export default {
  name: 'InputSelectLanguage',
  components: { KSelect },
  props: {
    items: {
      type: Array,
      default: () => [],
      required: true
    },
    itemText: {
      type: String,
      default: 'text'
    },
    itemValue: {
      type: String,
      default: 'value'
    },
    itemDisabled: {
      type: Function,
      default: (item) => item.isDisabled
    },
    value: {
      type: String,
      required: true,
      default: ''
    },
    hint: {
      type: String
    },
    menuProps: {
      type: Object,
      default: () => ({ offsetY: true })
    },
    placeholder: {
      type: String,
      default: 'Select language'
    },
    required: {
      type: Boolean,
      default: false
    },
    persistentHint: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    hideDetails: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array
    },
    label: {
      type: String
    }
  },
  methods: {
    handleLanguageChange(newVal) {
      this.$emit('input', newVal)
    }
  }
}
</script>
