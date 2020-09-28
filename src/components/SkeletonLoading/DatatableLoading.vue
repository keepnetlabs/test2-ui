<template>
  <v-skeleton-loader :loading="loading" v-bind="attrs" type="table"></v-skeleton-loader>
</template>

<script>
export default {
  name: 'DatatableLoading',
  data() {
    return {
      attrs: {
        class: 'mb-6',
        boilerplate: false,
        elevation: 2
      }
    }
  }
}
</script>

<style scoped></style>
