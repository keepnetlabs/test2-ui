<template>
  <component
    :is="getComponentType"
    :class="uniqueSelector"
    :attach="`.${uniqueSelector}`"
    :menu-props="{
      offsetY: true,
      top: position === 'top',
      contentClass: `k-select__menu ${addMinWidth ? 'k-select__menu-min-width' : ''}`
    }"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot:selection="props" v-if="slots.selection">
      <slot name="selection" v-bind="props" />
    </template>
    <template v-slot:item="props" v-if="slots.item">
      <slot name="item" v-bind="props" />
    </template>
  </component>
</template>

<script>
import { VSelect, VAutocomplete, VCombobox } from 'vuetify/lib'
export default {
  name: 'KSelect',
  props: {
    position: {
      type: String,
      default: 'bottom'
    },
    addMinWidth: {
      type: Boolean,
      default: false
    },
    type: {
      type: Boolean
    },
    slots: {
      type: Object,
      default: () => ({ selection: false, item: false })
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
      console.log('this.type', this.type)
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
      .v-list-item__action {
        .v-simple-checkbox {
          .mdi {
            &::before {
              font-size: 24px !important;
            }
          }
        }
      }
    }
  }
}
.k-select__menu-min-width {
  @media (max-width: 2000px) {
    min-width: 380px !important;
  }
}
</style>
