<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        icon
        :ripple="!isDisabled"
        :class="{ 'default-button-row-action--disabled': isDisabled }"
        @click.native="!isDisabled && $emit('on-click', scope)"
      >
        <v-icon :ripple="!isDisabled">{{ icon }}</v-icon>
      </v-btn>
    </template>
    <span>{{ text }}</span>
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
    }
  },
  computed: {
    isDisabled() {
      const { row } = this.scope
      if (row.hasOwnProperty('isOwner')) {
        return this.disabled || !row.isOwner
      }
      return this.disabled
    }
  }
}
</script>
<style lang="scss">
.default-button-row-action {
  &--disabled {
    opacity: 0.5;
    cursor: auto;
    background-color: transparent !important;
    &:before {
      background-color: transparent !important;
    }
    &:hover,
    &:focus {
      &:before,
      &:after {
        background-color: transparent !important;
      }
    }
  }
}
</style>
