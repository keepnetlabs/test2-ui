<template>
  <v-skeleton-loader
    v-bind="attrs"
    :loading="loading"
    type="table-heading, list-item-two, list-item, list-item, list-item"
    class="three-row-loading"
    ><slot name="skeleton-content"></slot></v-skeleton-loader
></template>

<script>
export default {
  name: 'ThreeRowLoading',
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
