<template>
  <v-tooltip max-width="200" bottom>
    <template #activator="{ on }">
      <v-btn
        v-on="on"
        :id="id"
        icon
        :ripple="!isDisabled"
        :class="{ 'default-button-row-action--disabled': isDisabled }"
        @click="handleClick"
      >
        <v-icon :ripple="!isDisabled">{{ icon }}</v-icon>
      </v-btn>
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
