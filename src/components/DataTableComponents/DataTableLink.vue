<template>
  <span>
    <router-link
      :to="getRouterLink"
      class="datatable-link"
      v-if="scope.row && scope.row[col.property] && col.href"
    >
      {{ scope.row[col.property] }}
    </router-link>
    <span v-else-if="scope.row && scope.row[col.property]" class="datatable-link">
      {{ scope.row[col.property] }}
    </span>
    <span v-else>
      {{ getEmptyText }}
    </span>
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
  },
  computed: {
    getEmptyText() {
      return this.col['emptyText'] || ''
    },
    getRouterLink() {
      return this.col.custom ? '' : `${this.col.href}/${this.scope.row[this.col.hrefKey]}`
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
