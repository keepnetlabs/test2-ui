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

<style lang="scss">
.app-modal-body-header {
  padding: 0;
  margin-top: 32px;
  margin-bottom: 24px;
  .v-list-item__content > *:not(:last-child) {
    margin-bottom: 0;
  }
  &-stepper {
    margin-top: 0 !important;
  }
  &__title {
    font-size: 24px !important;
    font-weight: normal;
    line-height: 1.29 !important;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
    opacity: 0.9;
  }
  &__sub-title {
    font-size: 14px !important;
    font-weight: normal;
    line-height: 1.5 !important;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
    opacity: 0.9;
  }
}
</style>
