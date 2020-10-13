<template>
  <v-skeleton-loader
    :loading="loading"
    v-bind="attrs"
    type="table-heading, list-item-two, list-item, list-item, list-item, list-item, list-item, list-item, list-item, list-item, list-item, list-item, list-item"
    ><slot name="skeleton-content"></slot></v-skeleton-loader
></template>

<script>
export default {
  name: 'InvestigationDetailsLeftBarLoading',
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
