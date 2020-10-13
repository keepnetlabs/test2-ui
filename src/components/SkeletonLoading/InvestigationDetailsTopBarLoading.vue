<template>
  <v-skeleton-loader :loading="loading" v-bind="attrs" type="list-item-avatar-three-line"
    ><slot name="skeleton-content"></slot></v-skeleton-loader
></template>

<script>
export default {
  name: 'InvestigationDetailsBarLoading',
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
