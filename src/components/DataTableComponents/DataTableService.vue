<template>
  <div>
    <span class="datatable-service-icon-content" v-if="scope.row && scope.row[col.property]">
      <img
        alt="outlook"
        src="../../assets/img/Office.png"
        v-if="scope.row[col.property] === 'Outlook'"
      />
      <img alt="o365" src="../../assets/img/Word.png" v-if="scope.row[col.property] === 'O365'" />
      <img
        alt="gsuite"
        src="../../assets/img/Google.png"
        v-if="['GSuite', 'GoogleWorkspace', 'Google Workspace'].includes(scope.row[col.property])"
      />
      <img
        alt="exchange"
        src="../../assets/img/exchange@3x.png"
        v-if="scope.row[col.property] === 'Exchange'"
      />
      <span class="ml-2">{{ scope.row[col.property] }}</span>
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

<style lang="scss">
.datatable-service-icon-content {
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    max-width: 16px;
    max-height: 16px;
  }
}
</style>
