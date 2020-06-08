<template>
  <span>
    <router-link :to="col.href" class="datatable-link" v-if="scope.row && scope.row[col.property]">
      {{ scope.row[col.property] }}
    </router-link>
    <span v-else>-</span>
  </span>
</template>

<script>
export default {
  name: 'DataTableLink',
  props: {
    scope: {
      type: Object
    },
    col: {
      type: Object
    }
  }
}
</script>

<style>
.datatable-link {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.29;
  letter-spacing: normal;
  color: #2196f3 !important;
  text-decoration: none;
}
</style>
