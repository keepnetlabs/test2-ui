<template>
  <component
    v-bind="$attrs"
    v-on="$listeners"
    ref="refComponent"
    :is="getComponentType"
    :class="uniqueSelector"
    :attach="`.${uniqueSelector}`"
    :hint="hint"
    :persistent-hint="persistentHint"
    :menu-props="{
      offsetY: true,
      ...getPosition,
      contentClass: getContentClass,
      nudgeWidth
    }"
  >
    <template v-slot:selection="props" v-if="slots.selection">
      <slot name="selection" v-bind="props" />
    </template>
    <template v-slot:item="props" v-if="slots.item">
      <slot name="item" v-bind="props" />
    </template>
    <template v-slot:append v-if="slots.append">
      <slot name="append" />
    </template>
    <template v-slot:prepend-item v-if="slots.prependItem">
      <slot name="prependItem" />
    </template>
    <template v-slot:progress v-if="slots.progress">
      <slot name="progress" />
    </template>
  </component>
</template>

<script>
import { VAutocomplete, VCombobox, VSelect } from 'vuetify/lib'
import { createRandomCryptStringNumber } from '@/utils/functions'

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
    customMenuClass: {
      type: String
    },
    slots: {
      type: Object,
      default: () => ({ selection: false, item: false })
    },
    hint: {
      default: undefined
    },
    persistentHint: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.uniqueSelector = `class-${createRandomCryptStringNumber()}`
  },
  data() {
    return {
      uniqueSelector: null
    }
  },
  computed: {
    getComponentType() {
      if (this.type === 'autocomplete') return VAutocomplete
      if (this.type === 'combobox') return VCombobox
      if (this.type === 'select') return VSelect
      return VSelect
    },
    getPosition() {
      return { [this.position]: true }
    },
    getContentClass() {
      return `k-select__menu ${
        this.minWidthType ? `k-select__menu--${this.minWidthType.toLowerCase()}` : ''
      } ${this.customMenuClass ? this.customMenuClass : ''}`
    }
  }
}
</script>
