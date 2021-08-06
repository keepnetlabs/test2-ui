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
      {{
        props.scope.row[props.col.property] && props.scope.row[props.col.property].substring(0, 10)
      }}
    </span>
    <span
      v-else
      :class="{
        'dataTableText-main-error':
          props.scope.row &&
          props.scope.row['validationDetail'] &&
          props.scope.row['validationDetail'].find((item) => {
            return item.fieldName.toLowerCase() == props.col.property.toLowerCase() && item.message
          })
      }"
      >{{ props.col['emptyText'] || '' }}</span
    >
  </div>
</template>

<script>
export default {
  name: 'DataTableDate',
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
