<template>
  <v-tooltip v-if="canRenderTooltip" bottom>
    <template #activator="{on}">
      <v-list-item :class="className" :disabled="isDisabled" @click="onClick">
        <v-list-item-title v-on="on">
          <v-icon :disabled="isDisabled" class="pr-3">{{ icon }}</v-icon>
          <span>{{ text }}</span>
        </v-list-item-title>
      </v-list-item>
    </template>
    <span>{{ disabledTooltipText }}</span>
  </v-tooltip>
  <v-list-item v-else :class="className" :disabled="isDisabled" @click="onClick">
    <v-list-item-title>
      <v-icon :disabled="isDisabled" class="pr-3">{{ icon }}</v-icon>
      <span>{{ text }}</span>
    </v-list-item-title>
  </v-list-item>
</template>

<script>
export default {
  name: 'DefaultMenuRowAction',
  props: {
    icon: {
      type: String
    },
    text: {
      type: String
    },
    scope: {
      type: Object
    },
    disabled: {
      type: Boolean
    },
    checkIsOwnerProperty: {
      type: Boolean,
      default: true
    },
    disabledTooltipText: {
      type: String
    },
    showTooltip: {
      type: Boolean,
      default: false
    },
    className: {
      type: String
    }
  },
  computed: {
    isDisabled() {
      const { row } = this.scope
      if (row.hasOwnProperty('isOwner') && this.checkIsOwnerProperty) {
        return this.disabled || !row.isOwner
      }
      return this.disabled
    },
    canRenderTooltip() {
      return this.showTooltip && this.isDisabled
    }
  },
  methods: {
    onClick() {
      if (this.isDisabled) return
      this.$emit('on-click', scope)
    }
  }
}
</script>
