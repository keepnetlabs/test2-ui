<template>
  <component
    :is="getComponentType"
    :class="uniqueSelector"
    :attach="`.${uniqueSelector}`"
    :menu-props="{
      offsetY: true,
      top: position === 'top',
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
.v-menu__content.k-select__menu {
  z-index: 99999 !important;
  .v-list.v-select-list {
    .v-list-item {
      padding: 0 16px !important;
      min-height: 40px !important;
      &__content {
        margin-bottom: 0 !important;
        padding: 8px 0 !important;
        .v-list-item__title {
          overflow: visible !important;
        }
      }
    }
  }
}
</style>
