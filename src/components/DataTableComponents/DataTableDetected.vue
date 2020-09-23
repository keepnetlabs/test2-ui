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
      switch (type.toLowerCase()) {
        case 'pending':
          return '#00bcd4'
        case 'clean':
          return '#00bcd4'
        case 'active':
          return '#00bcd4'
        case 'inactive':
          return '#f56c6c'
        case 'warning':
          return '#e6a23c'
        case 'malicious':
          return '#e6a23c'
        case 'offline':
          return '#f56c6c'
        case 'expired':
          return '#e6a23c'
        case 'cancelled':
          return '#f56c6c'
        case 'phishing':
          return '#f56c6c'
        case 'idle':
          return '#f56c6c'
        case 'disabled':
          return '#f56c6c'
        case 'network error':
          return '#f56c6c'
        case 'quedued':
          return '#00bcd4'
        case 'none':
          return '#00bcd4'
        case 'running':
          return '#2196f3'
        case 'completed':
          return '#00bcd4'
        case 'finished':
          return '#43a047'
        case 'online':
          return '#00bcd4'
        case 'deactivated':
          return '#757575'
        case 'not installed':
          return '#757575'
        case 'user unavailable':
          return '#757575'
        case 'n/a':
          return '#00bcd4'
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss"></style>
