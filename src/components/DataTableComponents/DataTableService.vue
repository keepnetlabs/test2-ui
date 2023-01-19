<template>
  <div>
    <span class="datatable-service-icon-content" v-if="scope.row && scope.row[col.property]">
      <img
        alt="outlook"
        src="../../assets/img/Office.svg"
        v-if="scope.row[col.property] === 'Outlook'"
      />
      <img
        alt="o365"
        src="../../assets/img/microsoft365Mini.svg"
        v-if="['Microsoft365', 'Microsoft 365', 'O365'].includes(scope.row[col.property])"
      />
      <img
        alt="gsuite"
        src="../../assets/img/google.svg"
        v-if="['GSuite', 'GoogleWorkspace', 'Google Workspace'].includes(scope.row[col.property])"
      />
      <img
        alt="exchange"
        src="../../assets/img/exchange@3x.png"
        v-if="scope.row[col.property] === 'Exchange'"
      />
    </span>
    <span v-else>
      {{ getEmptyText }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'DataTableService',
  props: {
    scope: {
      type: Object
    },
    col: {
      type: Object
    }
  },
  computed: {
    getEmptyText() {
      return this.col['emptyText'] || ''
    }
  }
}
</script>
