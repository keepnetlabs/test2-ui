<template>
  <v-tooltip
    v-if="canRenderTooltip"
    bottom
    offset-overflow
    :z-index="10000"
    content-class="k-v-tooltip-content--over-drawer"
    :open-delay="150"
  >
    <template #activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on" class="default-menu-row-action-tooltip-wrap">
        <v-list-item :id="id" :class="className" :disabled="isDisabled" @click="onClick">
          <v-list-item-title>
            <v-icon :disabled="isDisabled" class="pr-3">{{ icon }}</v-icon>
            <span>{{ text }}</span>
          </v-list-item-title>
        </v-list-item>
      </div>
    </template>
    <span>{{ disabledTooltipText }}</span>
  </v-tooltip>
  <v-list-item v-else :id="id" :class="className" :disabled="isDisabled" @click="onClick">
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
    },
    id: {
      type: String
    }
  },
  computed: {
    isDisabled() {
      const row = this.scope && this.scope.row
      if (!row) return true
      if (Object.prototype.hasOwnProperty.call(row, 'isOwner') && this.checkIsOwnerProperty) {
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
      if (this.isDisabled || !this.scope) return
      this.$emit('on-click', this.scope)
    }
  }
}
</script>
