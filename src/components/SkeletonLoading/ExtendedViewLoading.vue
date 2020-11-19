<template>
  <v-skeleton-loader :loading="loading" v-bind="attrs" :type="getType"
    ><slot name="skeleton-content"></slot></v-skeleton-loader
></template>

<script>
export default {
  name: 'ExtendedViewLoading',
  props: {
    loading: { required: true, default: false, type: Boolean },
    size: { default: 'medium', type: String }
  },
  data() {
    return {
      attrs: {
        boilerplate: false
      }
    }
  },
  computed: {
    getType() {
      switch (this.size) {
        case 'small':
          return 'table-heading,list-item,list-item,list-item'
        case 'medium':
          return 'table-heading,list-item,list-item,list-item,list-item,list-item'
        case 'big':
          return 'table-heading,list-item,list-item,list-item,list-item,list-item,list-item,list-item'
        default:
          return 'table-heading,list-item,list-item,list-item'
      }
    }
  }
}
</script>

<style scoped></style>
