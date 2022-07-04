<template>
  <v-list-item :class="['app-modal-body-header', inStepper && 'app-modal-body-header-stepper']">
    <v-list-item-content>
      <v-list-item-title class="app-modal-body-header__title">
        {{ title }}
      </v-list-item-title>
      <slot name="subtitle">
        <v-list-item-subtitle class="app-modal-body-header__sub-title">
          {{ subTitle }}
        </v-list-item-subtitle>
      </slot>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: 'AppModalBodyHeader',
  props: {
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    inStepper: {
      type: Boolean,
      default: false
    }
  }
}
</script>
