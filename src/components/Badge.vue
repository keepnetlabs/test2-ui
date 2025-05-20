<template functional>
  <div>
    <v-tooltip bottom v-if="props.isErrorState && props.errorStateValue">
      <template v-slot:activator="{ on }">
        <v-btn
          v-bind="$options.getDynamicProps(props)"
          v-on="on"
          style="cursor: default;"
          :id="props.id"
          :ripple="false"
          :class="[
            'k-badge',
            props.fullWidth ? 'full-width' : '',
            $options.getBadgeSize(props.size, props),
            props.className,
            { 'k-badge--default': !props.outline },
            { 'k-badge--text-black': props.textBlack }
          ]"
        >
          {{ props.text }}
        </v-btn>
      </template>
      <span>{{ props.errorStateValue }}</span>
    </v-tooltip>
    <v-btn
      v-else
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
        { 'k-badge--default': !props.outline },
        { 'k-badge--text-black': props.textBlack }
      ]"
    >
      <slot name="content">
        {{ props.text }}
      </slot>
    </v-btn>
  </div>
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
    isBlackText: {
      type: Boolean,
      default: false
    },
    defaultBackgroundColor: {
      type: String,
      default: '#fff'
    },
    text: {
      type: String || Number
    },
    textBlack: {
      type: Boolean
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
    },
    isErrorState: {
      default: false
    },
    errorStateValue: {
      default: ''
    },
    hideBorder: {
      type: Boolean,
      default: false
    }
  },
  getBadgeSize(val) {
    let retValue = ''

    if (val === 'medium') {
      retValue = 'k-badge__sizes--medium'
    }

    if (val === 'small') {
      retValue = 'k-badge__sizes--small'
    }

    if (val === 'mini') {
      retValue = 'k-badge__sizes--mini'
    }

    if (val === 'auto') {
      retValue = 'k-badge__sizes--auto'
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
      {
        border: props.hideBorder ? 'none' : `1px solid ${props.color} !important`,
        color: props.color
      },
      props.col && props.col.props && props.col.props.style
    ]
    return dynamicProps
  }
}
</script>
