<template>
  <div>
    <v-btn
      :class="[
        'btn-status',
        scope.row.userStatus === 'Online' ? 'btn-online' : '',
        scope.row.userStatus === 'Offline' ? 'btn-offline' : ''
      ]"
      block
      rounded
      v-if="scope.row && scope.row[col.property]"
      >{{ scope.row.userStatus }}
    </v-btn>
    <span v-else>-</span>
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
  created() {}
}
</script>

<style scoped></style>
