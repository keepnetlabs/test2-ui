<template>
  <v-skeleton-loader class="mainListItem" :loading="loading" v-bind="attrs" type="list-item"
    ><slot name="skeleton-content"></slot></v-skeleton-loader
></template>

<script>
export default {
  name: 'MainListItemLoading',
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

<style></style>
