<template>
  <v-skeleton-loader
    :loading="loading"
    v-bind="attrs"
    class="custom-fields-loader"
    type="list-item@5,divider,list-item@5"
  >
    <slot name="skeleton-content"></slot>
  </v-skeleton-loader>
</template>

<script>
export default {
  name: 'CustomFieldsLoading',
  props: {
    loading: { required: true, default: false, type: Boolean }
  },
  data() {
    return {
      attrs: {
        boilerplate: false
      }
    }
  }
}
</script>
<style lang="scss">
.custom-fields-loader {
  .v-skeleton-loader__list-item {
    padding: 0;
  }
}
</style>
