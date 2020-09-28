<template>
  <v-skeleton-loader v-bind="attrs" type="article, actions"></v-skeleton-loader>
</template>

<script>
export default {
  name: 'DatatableLoading',
  attrs: {
    class: 'mb-6',
    boilerplate: false,
    elevation: 2
  }
}
</script>

<style scoped></style>
