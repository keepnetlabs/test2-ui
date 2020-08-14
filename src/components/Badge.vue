<template>
  <v-btn
    rounded
    :color="color"
    v-on="listeners"
    :class="['k-badge', fullWidth ? 'full-width' : '', getBadgeSize, className]"
  >
    {{ text }}
  </v-btn>
</template>

<script>
export default {
  name: 'Badge',
  props: {
    color: {
      type: String,
      default: ''
    },
    text: {
      type: String || Number
    },
    listeners: {},
    fullWidth: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'medium'
    },
    className: {
      type: String
    }
  },
  computed: {
    getBadgeSize() {
      let retValue = ''
      switch (this.size) {
        case 'medium':
          retValue = 'k-badge__sizes--medium'
          break
        case 'small':
          retValue = 'k-badge__sizes--small'
          break
        case 'mini':
          retValue = 'k-badge__sizes--mini'
          break
        default:
          break
      }
      return retValue
    }
  }
}
</script>

<style lang="scss">
.k-badge {
  .v-btn__content {
    font-size: 12px !important;
    font-weight: 600 !important;
    letter-spacing: normal;
    text-align: center;
    text-transform: none !important;
    color: #ffffff;
  }
  &__sizes {
    &--medium {
      &.v-btn {
        border-radius: 18px !important;
        margin: 0 auto;
        max-width: 90px;
        height: 34px !important;
        box-shadow: none !important;
      }
      &.v-btn:not(.v-btn--round).v-size--default {
        min-width: 90px;
      }
    }
    &--small {
      &.v-btn {
        border-radius: 4px !important;
        box-shadow: none !important;
        max-width: fit-content;
        height: auto !important;
        padding: 4px 6px !important;
      }
      &.v-btn:not(.v-btn--round).v-size--default {
        min-width: 60px;
        padding: 0;
      }
    }
    &--mini {
      &.v-btn {
        border-radius: 4px !important;
        max-width: 26px;
        height: 24px !important;
        box-shadow: none !important;
      }
      &.v-btn:not(.v-btn--round).v-size--default {
        min-width: 26px;
        padding: 0;
      }
    }
  }
}
.full-width {
  width: 100%;
}
</style>
