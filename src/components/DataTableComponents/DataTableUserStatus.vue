<template>
  <div>
    <badge
      :color="getBtnUserStatusColor(scope.row[col.property])"
      :full-width="col.fullWidth"
      :text="scope.row[col.property]"
      v-if="scope.row && scope.row[col.property]"
    />
    <span v-else></span>
  </div>
</template>

<script>
export default {
  name: 'DataTableUserStatus',
  props: {
    scope: {
      type: Object
    },
    col: {
      type: Object
    }
  },
  methods: {
    getBtnUserStatusColor(type) {
      switch (type.toLowerCase()) {
        case 'online':
          return '#00bcd4'
        case 'offline':
          return '#f56c6c'
        default:
          break
      }
    }
  }
}
</script>

<style></style>
