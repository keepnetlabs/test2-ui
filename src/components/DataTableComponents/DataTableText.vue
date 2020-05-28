<template>
  <div>
    <span v-if="scope.row && scope.row[col.property]">
      {{ scope.row[col.property] }}
    </span>
    <span v-else>-</span>
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
  }
}
</script>

<style scoped></style>
