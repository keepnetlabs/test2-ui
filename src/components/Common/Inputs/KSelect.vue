<template>
  <component
    :is="getComponentType"
    :class="uniqueSelector"
    :attach="`.${uniqueSelector}`"
    :menu-props="{
      offsetY: true,
      ...getPosition,
      contentClass: getContentClass,
      nudgeWidth
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
import { VAutocomplete, VCombobox, VSelect } from 'vuetify/lib'

export default {
  name: 'KSelect',
  props: {
    position: {
      type: String,
      default: 'bottom'
    },
    minWidthType: {
      type: String,
      default: ''
    },
    nudgeWidth: {
      type: String,
      default: '5'
    },
    type: {
      type: String,
      default: 'select'
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
      switch (this.type) {
        case 'autocomplete':
          return VAutocomplete
        case 'combobox':
          return VCombobox
        case 'select':
          return VSelect
        default:
          return VSelect
      }
    },
    getPosition() {
      return { [this.position]: true }
    },
    getContentClass() {
      return `k-select__menu ${
        this.minWidthType ? `k-select__menu--${this.minWidthType.toLowerCase()}` : ''
      }`
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
  &--big {
    @media (max-width: 1400px) {
      min-width: 300px !important;
    }
  }
  &--medium {
    @media (max-width: 1400px) {
      min-width: 250px !important;
    }
  }
  &--small {
    @media (max-width: 1400px) {
      min-width: 190px !important;
    }
  }
}
</style>
