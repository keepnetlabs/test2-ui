<template>
  <div v-if="loading" class="data-table-loading">
    <v-skeleton-loader
      v-show="loading"
      v-bind="attrs"
      type="table-heading,table-tbody"
      :loading="loading"
    >
      <slot name="skeleton-content"></slot>
    </v-skeleton-loader>
  </div>
</template>

<script>
export default {
  name: 'DatatableLoading',
  props: {
    loading: { required: true, default: false, type: Boolean },
    loaderType: { required: false, default: 0, type: Number }
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
