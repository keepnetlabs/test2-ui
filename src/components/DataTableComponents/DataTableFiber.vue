<template>
  <div class="datatable-fiber__container">
    <div class="datatable-fiber__item">
      <template v-if="scope.row[rowKey] === 'Online'">
        <img src="../../assets/img/fiber-manual-record-online.svg" alt="icon" />
      </template>
      <template v-else>
        <img src="../../assets/img/fiber-manual-record-offline.svg" alt="icon" />
      </template>
    </div>
    <span v-if="scope.row && scope.row[col.property]">
      {{ scope.row[col.property] }}
    </span>
    <span v-else>{{ getEmptyText }}</span>
  </div>
</template>

<script>
export default {
  name: 'DataTableFiber',
  props: {
    scope: {
      type: Object
    },
    col: {
      type: Object
    },
    rowKey: {
      type: String,
      default: 'addInStatusName'
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
.datatable-fiber {
  &__container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  &__item {
    > img {
      margin-top: 7px;
      margin-right: 3px;
    }
  }
}
</style>
