<template>
  <div>
    <span v-if="scope.row && scope.row[col.property]">
      <span class="mr-2">
        {{ scope.row[col.property][0] }}
      </span>
      <v-tooltip bottom max-width="230" opacity="1" v-if="scope.row[col.property].length > 1">
        <template v-slot:activator="{ on }">
          <div class="external-data" v-on="on">+{{ scope.row[col.property].length - 1 }}</div>
        </template>
        <p :key="index" class="tooltip-line" v-for="(item, index) in scope.row[col.property]">
          <span>{{ item }}</span>
        </p>
      </v-tooltip>
    </span>
    <span v-else>{{ getEmptyText }}</span>
  </div>
</template>

<script>
export default {
  name: 'DataTableArray',

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

<style>
.external-data {
  border-radius: 4px;
  background-color: #2196f3;
  color: #ffffff;
  width: 26px;
  display: inline-block;
  text-align: center;
}
</style>
