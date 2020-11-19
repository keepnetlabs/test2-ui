<template>
  <component
    :is="getComponentType"
    :class="uniqueSelector"
    :attach="`.${uniqueSelector}`"
    :menu-props="{
      offsetY: true,
      position: position,
      contentClass: 'k-select__menu'
    }"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import { VSelect, VAutocomplete, VCombobox } from 'vuetify/lib'
export default {
  name: 'KSelect',
  props: {
    position: {
      type: String,
      default: 'bottom'
    }
  },
  created() {
    this.uniqueSelector = `class-${Math.floor(Math.random() * 1000000).toString()}`
  },
  data() {
    return {
      uniqueSelector: null
    }
  },
  computed: {
    getComponentType() {
      switch (this.type) {
        case 'autocomplete':
          return VAutocomplete
        case 'combobox':
          return VCombobox
        default:
          return VSelect
      }
    }
  }
}
</script>

<style lang="scss">
.k-select__menu {
  z-index: 1000 !important;
  .v-list-item {
    padding: 0 16px !important;
  }
}
</style>
