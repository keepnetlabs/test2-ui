<template>
  <div>
    <badge
      :color="getBtnDetectedColor(scope.row[col.property])"
      :full-width="col.fullWidth"
      :text="scope.row[col.property]"
      v-if="scope.row && scope.row[col.property]"
    />
    <span v-else></span>
    <v-btn style="display: none;"></v-btn>
  </div>
</template>

<script>
import Badge from '../Badge'
import { DETECTED_COLORS } from '@/components/DataTableComponents/utils'
export default {
  name: 'DataTableDetected',
  components: {
    badge: Badge
  },
  props: {
    scope: {
      type: Object
    },
    col: {
      type: Object
    }
  },
  methods: {
    getBtnDetectedColor(type) {
      return DETECTED_COLORS[type.toLowerCase()]
    }
  }
}
</script>
