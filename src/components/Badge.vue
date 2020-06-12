<template>
  <v-btn
    rounded
    :color="color"
    v-on="listeners"
    :class="['k-badge', fullWidth ? 'full-width' : '']"
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
    }
  }
}
</script>

<style lang="scss">
.k-badge {
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
  .v-btn__content {
    font-size: 12px !important;
    font-weight: 600 !important;
    letter-spacing: normal;
    text-align: center;
    text-transform: capitalize;
    color: #ffffff;
  }
}
.full-width {
  width: 100%;
}
</style>
