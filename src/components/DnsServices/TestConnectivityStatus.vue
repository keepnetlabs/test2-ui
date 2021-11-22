<template>
  <div>
    <div v-if="state === 'loading'" class="test-connectivity-status__icon">...</div>
    <div v-if="state === 'error'">
      <v-icon color="#f56c6c" class="test-connectivity-status__icon">mdi-close</v-icon>
      <span class="test-connectivity-status__error-text">{{ message }}</span>
    </div>
    <div v-if="state === 'success'">
      <span class="test-connectivity-status__success-text">{{ message }}</span>
      <v-icon color="#43a047" class="test-connectivity-status__icon">mdi-check</v-icon>
    </div>
  </div></template
>

<script>
export default {
  name: 'TestConnectivityStatus',
  props: {
    state: { required: true },
    message: { required: false }
  }
}
</script>

<style lang="scss">
.test-connectivity-status {
  &__icon {
    font-size: 20px !important;
    height: 20px;
  }
  &__error-text {
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: #f56c6c;
    margin-left: 4px;
  }
}
</style>
