<template>
  <div class="datatable-progress">
    <template v-if="scope.row && parseInt(scope.row.progress) >= 0">
      <span v-if="col.progressType !== 'plain'" class="datatable-progress__per">{{
        scope.row.progress === 100 ? 'Completed' : scope.row.progress + '%'
      }}</span>
      <v-progress-linear
        :value="scope.row.progress"
        background-color="#b3d4fc"
        color="#2196f3"
        height="4"
        reactive
        rounded
      />
      <span v-if="col.progressType === 'stats'" class="datatable-progress__stats"> </span>
    </template>
    <span v-else>
      <v-progress-linear
        :value="0"
        background-color="#e0e0e0"
        color="#2196f3"
        height="4"
        reactive
        rounded
    /></span>
  </div>
</template>

<script>
export default {
  name: 'DataTableProgress',
  props: {
    scope: {
      type: Object
    },
    col: {
      type: Object
    }
  },
  created() {
    console.log('col', this.col)
  }
}
</script>

<style lang="scss">
.datatable-progress {
  max-width: 60px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  flex-direction: column;

  .v-progress-linear {
    max-width: 48px;
    margin-top: 1px;
  }
  &__per {
    font-size: 10px;
    font-weight: normal;
    line-height: 1.9;
    letter-spacing: normal;
    text-align: center;
    color: rgba(0, 0, 0, 0.87) !important;
    margin-left: 3px;
  }
  &__stats {
    opacity: 0.64;
    font-size: 10px;
    color: rgba(0, 0, 0, 0.87) !important;
    text-align: center;
    line-height: 19px;
  }
}
</style>
