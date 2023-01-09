<template functional>
  <div>
    <template v-if="$options.getHasRowContent(props)">
      <span
        v-if="$options.getHasRowContent(props)"
        :class="{
          'dataTableText-main-error': $options.getHasValidationError(props)
        }"
        >{{ props.scope.row[props.col.property] }}</span
      >
      <v-tooltip v-if="$options.getHasValidationError(props)" bottom>
        <template #activator="{ on }">
          <v-icon
            v-if="$options.getHasValidationError(props)"
            v-on="on"
            class="ml-2"
            style="margin-top: -3px;"
            color="#B83A3A"
            medium
            >mdi-information</v-icon
          >
        </template>
        <span>{{
          props.scope.row['validationDetail'].find((item) => {
            return item.fieldName.toLowerCase() == props.col.property.toLowerCase() && item.message
          }) &&
          props.scope.row['validationDetail'].find((item) => {
            return item.fieldName.toLowerCase() == props.col.property.toLowerCase() && item.message
          }).message
        }}</span>
      </v-tooltip>
    </template>
    <span
      v-else
      :class="{
        'dataTableText-main-error': $options.getHasValidationError(props)
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
  },
  getHasRowContent(props) {
    return (
      props.scope.row &&
      (props.scope.row[props.col.property] !== undefined ||
        props.scope.row[props.col.property] !== null ||
        props.scope.row[props.col.property] !== '')
    )
  },
  getHasValidationError(props) {
    return (
      props.scope.row &&
      props.scope.row['validationDetail'] &&
      props.scope.row['validationDetail'].find((item) => {
        return item.fieldName.toLowerCase() == props.col.property.toLowerCase() && item.message
      })
    )
  }
}
</script>
