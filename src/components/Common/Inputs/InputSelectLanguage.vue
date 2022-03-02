<template>
  <v-select
    outlined
    :required="required"
    :persistent-hint="persistentHint"
    :items="items"
    :item-disabled="itemDisabled"
    :item-text="itemText"
    :item-value="itemValue"
    :value="value"
    :hint="hint"
    :menu-props="menuProps"
    :placeholder="placeholder"
    @input="handleLanguageChange"
  />
</template>

<script>
export default {
  name: 'InputSelectLanguage',
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
    }
  },
  methods: {
    handleLanguageChange(newVal) {
      this.$emit('input', newVal)
    }
  }
}
</script>
