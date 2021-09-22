<template>
  <v-skeleton-loader
    v-bind="attrs"
    type="list-item-avatar-two-line"
    class="phishing-reporter-top-bar-loading"
    :loading="loading"
    ><slot name="skeleton-content"></slot></v-skeleton-loader
></template>

<script>
export default {
  name: 'PhishingReporterTopBar',
  props: { loading: { required: true, default: false, type: Boolean } },
  data() {
    return {
      attrs: {
        boilerplate: false
      }
    }
  }
}
</script>

<style scoped></style>
