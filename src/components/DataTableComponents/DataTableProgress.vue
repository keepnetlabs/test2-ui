<template>
  <div class="datatable-progress">
    <template v-if="scope.row && parseInt(scope.row[col.property]) >= 0">
      <span
        :class="[scope.row[col.property] !== 100 && 'ml-1']"
        v-if="col.progressType !== 'plain'"
        class="datatable-progress__per"
        >{{ scope.row[col.property] === 100 ? 'Completed' : scope.row[col.property] + '%' }}</span
      >
      <v-progress-linear
        :value="scope.row[col.property]"
        background-color="#b3d4fc"
        color="#2196f3"
        height="4"
        reactive
        rounded
      />
      <span v-if="col.progressType === 'stats'" class="datatable-progress__stats"> </span>
    </template>
    <span v-else>
      <v-progress-linear
        :value="0"
        background-color="#e0e0e0"
        color="#2196f3"
        height="4"
        reactive
        rounded
    /></span>
  </div>
</template>

<script>
export default {
  name: 'DataTableProgress',
  props: {
    scope: {
      type: Object
    },
    col: {
      type: Object
    }
  },
  created() {}
}
</script>
