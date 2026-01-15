<template>
  <div class="alert-box">
    <slot>
      <div class="alert-box__default-content">
        <v-icon v-bind="iconProps" :color="iconColor">{{ iconName }}</v-icon>
        <slot name="text">
          <p>
            {{ text }}
          </p>
        </slot>
      </div>
    </slot>
    <div v-if="hasAction" class="alert-box__actions">
      <template v-if="slots.secondaryAction">
        <slot name="secondaryAction"> </slot>
      </template>
      <template v-if="slots.primaryAction">
        <slot name="primaryAction"> </slot>
      </template>
    </div>
  </div>
</template>

<script>
import labels from '@/model/constants/labels'

export default {
  name: 'AlertBox',
  props: {
    text: {
      type: String
    },
    iconColor: {
      type: String,
      default: '#B6791D'
    },
    iconName: {
      type: String,
      default: 'mdi-alert-circle'
    },
    iconProps: {
      type: Object,
      default: () => ({})
    },
    slots: {
      type: Object,
      default: () => ({
        primaryAction: false,
        secondaryAction: false
      })
    }
  },
  data() {
    return {
      labels
    }
  },
  computed: {
    hasAction() {
      return Object.values(this.slots).some((slot) => slot)
    }
  }
}
</script>


