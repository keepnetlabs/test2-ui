<template functional>
  <div>
    <span
      class="dataTableText-validation-error"
      v-if="props.scope.row && props.scope.row['validationDetail']"
      >{{
        props.scope.row['validationDetail'].find((item) => {
          return item.fieldName.toLowerCase() == props.col.property.toLowerCase() && item.message
        }) &&
        props.scope.row['validationDetail'].find((item) => {
          return item.fieldName.toLowerCase() == props.col.property.toLowerCase() && item.message
        }).message
      }}</span
    >
    <span
      v-if="props.scope.row && props.scope.row[props.col.property]"
      :class="{
        'dataTableText-main-error':
          props.scope.row &&
          props.scope.row['validationDetail'] &&
          props.scope.row['validationDetail'].find((item) => {
            return item.fieldName.toLowerCase() == props.col.property.toLowerCase() && item.message
          })
      }"
    >
      {{ props.scope.row[props.col.property] }}
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
