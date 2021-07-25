<template functional>
  <div>
    <span
      v-if="
        props.scope.row &&
        (props.scope.row[props.col.property] !== undefined ||
          props.scope.row[props.col.property] !== null ||
          props.scope.row[props.col.property] !== '')
      "
    >
      {{ props.scope.row[props.col.property].toString() }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'DataTableText',
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

<style></style>
