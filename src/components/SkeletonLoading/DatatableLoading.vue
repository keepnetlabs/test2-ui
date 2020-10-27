<template>
  <v-skeleton-loader
    :loading="loading"
    v-show="loading"
    v-bind="attrs"
    type="table-heading,table-tbody"
    class="data-table-loading"
    ><slot name="skeleton-content"></slot
  ></v-skeleton-loader>
</template>

<script>
export default {
  name: 'DatatableLoading',
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

<style>
.data-table-loading {
  height: 100%;
  margin-bottom: 20px;
}
</style>
