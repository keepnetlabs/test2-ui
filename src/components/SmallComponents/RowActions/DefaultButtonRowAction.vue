<template>
  <v-tooltip
    max-width="200"
    bottom
    :z-index="10000"
    content-class="k-v-tooltip-content--over-drawer"
    :open-delay="150"
  >
    <template #activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on" class="default-button-row-action-tooltip-wrap">
        <v-btn
          :id="id"
          icon
          :disabled="isDisabled"
          :ripple="!isDisabled"
          @click="handleClick"
        >
          <v-icon :disabled="isDisabled">{{ icon }}</v-icon>
        </v-btn>
      </span>
    </template>
    <span>{{ tooltipMessage }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'DefaultButtonRowAction',
  props: {
    scope: {
      type: Object
    },
    icon: {
      type: String
    },
    text: {
      type: String
    },
    disabled: {
      type: Boolean
    },
    checkIsOwnerProperty: {
      type: Boolean,
      default: true
    },
    id: {
      type: String
    },
    disabledTooltipText: {
      type: String
    }
  },
  computed: {
    isDisabled() {
      const row = this.scope && this.scope.row
      if (!row) return true
      if (Object.prototype.hasOwnProperty.call(row, 'isOwner') && this.checkIsOwnerProperty) {
        return !!this.disabled || !row.isOwner
      }
      return !!this.disabled
    },
    tooltipMessage() {
      if (this.isDisabled) {
        const row = this.scope && this.scope.row
        return row && row.isDownloading
          ? 'Downloading PDF. Please wait...'
          : this.disabledTooltipText || this.text
      }
      return this.text
    }
  },
  methods: {
    handleClick() {
      if (!this.isDisabled && this.scope) {
        this.$emit('on-click', this.scope)
      }
    }
  }
}
</script>

<style lang="scss">
.default-button-row-action-tooltip-wrap {
  display: inline-flex;
  align-items: center;
  pointer-events: auto;
  position: relative;
  z-index: 1;

  .v-btn--disabled {
    pointer-events: none;
  }
}
</style>
