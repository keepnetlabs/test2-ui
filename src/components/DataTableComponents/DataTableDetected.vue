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
      if (type.toLowerCase() === 'pending') return '#00bcd4'
      if (type.toLowerCase() === 'clean') return '#00bcd4'
      if (type.toLowerCase() === 'active') return '#00bcd4'
      if (type.toLowerCase() === 'inactive') return '#f56c6c'
      if (type.toLowerCase() === 'warning') return '#e6a23c'
      if (type.toLowerCase() === 'malicious') return '#e6a23c'
      if (type.toLowerCase() === 'offline') return '#f56c6c'
      if (type.toLowerCase() === 'expired') return '#e6a23c'
      if (type.toLowerCase() === 'cancelled') return '#f56c6c'
      if (type.toLowerCase() === 'phishing') return '#f56c6c'
      if (type.toLowerCase() === 'idle') return '#f56c6c'
      if (type.toLowerCase() === 'disabled') return '#f56c6c'
      if (type.toLowerCase() === 'network error') return '#f56c6c'
      if (type.toLowerCase() === 'quedued') return '#00bcd4'
      if (type.toLowerCase() === 'none') return '#00bcd4'
      if (type.toLowerCase() === 'running') return '#2196f3'
      if (type.toLowerCase() === 'not running') return '#f56c6c'
      if (type.toLowerCase() === 'completed') return '#00bcd4'
      if (type.toLowerCase() === 'finished') return '#43a047'
      if (type.toLowerCase() === 'online') return '#00bcd4'
      if (type.toLowerCase() === 'deactivated') return '#757575'
      if (type.toLowerCase() === 'not installed') return '#757575'
      if (type.toLowerCase() === 'user unavailable') return '#757575'
      if (type.toLowerCase() === 'n/a') return '#00bcd4'
    }
  }
}
</script>
