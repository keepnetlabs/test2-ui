<template>
  <div>
    <span v-if="scope.row && scope.row[col.property] > 0">
      <v-icon color="#757575">mdi-paperclip</v-icon>
    </span>
    <span v-else />
  </div>
</template>

<script>
export default {
  name: 'DataTableAttachment',
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

<style></style>
