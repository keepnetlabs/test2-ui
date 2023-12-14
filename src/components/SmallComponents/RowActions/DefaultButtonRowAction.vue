<template>
  <v-tooltip content-class="max-w-300" bottom>
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
      const { row } = this.scope
      if (row.hasOwnProperty('isOwner') && this.checkIsOwnerProperty) {
        return !!this.disabled || !row.isOwner
      }
      return !!this.disabled
    },
    tooltipMessage() {
      if (this.isDisabled) {
        return this.scope.row.isDownloading
          ? 'Downloading PDF. Please wait...'
          : this.disabledTooltipText
      }
      return this.text
    }
  },
  methods: {
    handleClick() {
      if (!this.isDisabled) {
        this.$emit('on-click', this.scope)
      }
    }
  }
}
</script>
