<template>
  <div>
    <span class="datatable-service-icon-content" v-if="scope.row && scope.row[col.property]">
      <img
        alt="outlook"
        src="../../assets/img/Office.png"
        v-if="scope.row[col.property] === 'Outlook'"
      />
      <img
        alt="outlook"
        src="../../assets/img/Word.png"
        v-if="scope.row[col.property] === 'O365'"
      />
      <img
        alt="outlook"
        src="../../assets/img/Google.png"
        v-if="scope.row[col.property] === 'GSuite'"
      />
      <img
        alt="outlook"
        src="../../assets/img/Exchange.png"
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
  img {
    max-width: 16px;
    max-height: 16px;
  }
}
</style>
