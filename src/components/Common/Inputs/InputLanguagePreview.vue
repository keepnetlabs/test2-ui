<template>
  <KSelect
    type="autocomplete"
    :value="value"
    class="input-languages-email-template-preview-select"
    label="Template Preview"
    outlined
    dense
    placeholder="Select a language"
    :disabled="disabled"
    :hide-details="hideDetails"
    :items="items"
    :persistent-hint="persistentHint"
    :hint="hint"
    @input="handleInputChange"
  />
</template>

<script>
import KSelect from './KSelect.vue'

export default {
  name: 'InputLanguagePreview',
  components: { KSelect },
  props: {
    value: {
      type: String || Number
    },
    disabled: {
      type: Boolean
    },
    items: {
      type: Array
    },
    persistentHint: {
      type: Boolean,
      default: false
    },
    hint: {
      type: String,
      default: ''
    },
    hideDetails: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleInputChange(v) {
      this.$emit('input', v)
    }
  }
}
</script>
