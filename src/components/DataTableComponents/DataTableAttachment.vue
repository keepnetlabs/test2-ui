<template functional>
  <div>
    <span v-if="props.scope.row && props.scope.row[props.col.property] > 0">
      <v-icon color="#43a047">mdi-check</v-icon>
    </span>
    <span v-else>
      <v-icon color="#757575">mdi-cancel</v-icon>
    </span>
  </div>
</template>

<script>
export default {
  name: 'DataTableAttachment',
  functional: true,
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
