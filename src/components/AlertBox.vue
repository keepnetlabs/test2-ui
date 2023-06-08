<template>
  <div class="alert-box">
    <slot>
      <div class="alert-box__default-content">
        <v-icon :color="iconColor">mdi-alert-circle</v-icon>
        <p>{{ text }}</p>
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
      type: String,
      required: true
    },
    iconColor: {
      type: String,
      default: '#B6791D'
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
