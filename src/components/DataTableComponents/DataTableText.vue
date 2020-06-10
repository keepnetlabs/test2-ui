<template>
  <div>
    <span v-if="scope.row && scope.row[col.property]">
      {{ scope.row[col.property] }}
    </span>
    <span v-else>{{ getEmptyText }}</span>
  </div>
</template>

<script>
export default {
  name: 'DataTableText',
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
    }
  }
}
</script>

<style scoped></style>
