<template functional>
  <v-btn
    v-bind="$options.getDynamicProps(props)"
    v-on="props.listeners"
    style="cursor: default;"
    :id="props.id"
    :ripple="false"
    :class="[
      'k-badge',
      props.fullWidth ? 'full-width' : '',
      $options.getBadgeSize(props.size, props),
      props.className,
      { 'k-badge--default': !props.outline }
    ]"
  >
    {{ props.text }}
  </v-btn>
</template>

<script>
export default {
  functional: true,
  name: 'Badge',
  props: {
    id: {
      type: String
    },
    color: {
      type: String,
      default: ''
    },
    defaultBackgroundColor: {
      type: String,
      default: '#fff'
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
    style: {
      type: Object
    },
    className: {
      type: String
    },
    col: {
      type: Object
    },
    outline: {
      type: Boolean,
      default: true
    }
  },
  getBadgeSize(val) {
    let retValue = ''
    switch (val) {
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
  },
  getDynamicProps(props = {}) {
    const dynamicProps = {}
    if (!props.outline) {
      dynamicProps['color'] = props.color
      dynamicProps['style'] = props.col && props.col.props && props.col.props.style
      dynamicProps['rounded'] = true
      return dynamicProps
    }
    dynamicProps['color'] = props.defaultBackgroundColor
    dynamicProps['style'] = [
      { border: `1px solid ${props.color} !important`, color: props.color },
      props.col && props.col.props && props.col.props.style
    ]
    return dynamicProps
  }
}
</script>

<style lang="scss">
.k-badge {
  &--default {
    .v-btn__content {
      color: #fff;
    }
  }
  &:focus {
    &:before {
      opacity: 0.12 !important;
    }
  }
  &:hover {
    &:before {
      opacity: 0 !important;
    }
  }
  .v-btn__content {
    font-size: 12px !important;
    font-weight: 600 !important;
    line-height: 1.33;
    padding-top: 1px;
    letter-spacing: normal !important;
    text-align: center;
    text-transform: none !important;
  }
  &__sizes {
    &--medium {
      &.v-btn {
        border-radius: 4px;
        margin: 0 auto;
        max-width: 76px;
        height: 24px !important;
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
