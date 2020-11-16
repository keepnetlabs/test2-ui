<template>
  <v-skeleton-loader :loading="loading" v-bind="attrs" type="article, list-item@6">
    <slot name="skeleton-content"></slot>
  </v-skeleton-loader>
</template>

<script>
export default {
  name: 'CompanyListExtendLoading',
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
