<template functional>
  <div>
    <span
      v-if="props.scope.row && props.scope.row[props.col.property]"
      class="datatable__colorful-text"
      :style="{ color: $options.getTextColor(props.text) }"
    >
      {{ props.text }}
    </span>
    <span v-else>{{ props.col['emptyText'] || '' }}</span>
  </div>
</template>

<script>
import { getTextColor } from '../../utils/functions'

export default {
  name: 'DataTableColorfulText',
  props: {
    scope: {
      type: Object
    },
    col: {
      type: Object
    },
    text: {
      type: String
    }
  },
  getTextColor(value) {
    return getTextColor(value)
  }
}
</script>

<style lang="scss">
.datatable {
  &__colorful-text {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.29;
    letter-spacing: normal;
  }
}
</style>
