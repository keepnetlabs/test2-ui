<template>
  <div>
    <span
      v-if="scope.row && scope.row[col.property]"
      class="datatable__colorful-text"
      :style="{ color: getTextColor(text) }"
    >
      {{ text }}
    </span>
    <span v-else>{{ getEmptyText }}</span>
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
  computed: {
    getEmptyText() {
      return this.col['emptyText'] || ''
    }
  },
  methods: {
    getTextColor(value) {
      return getTextColor(value)
    }
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
