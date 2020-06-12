<template>
  <div class="datatable-progress" style="max-width: 80px; margin: 0 auto;">
    <template v-if="scope.row && parseInt(scope.row.progress) >= 0">
      <span class="datatable-progress__per">{{
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
  }
}
</script>

<style lang="scss">
.datatable-progress {
  max-width: 80px;
  margin: 0 auto;
  &__per {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 10px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.9;
    letter-spacing: normal;
    text-align: center;
    color: rgba(0, 0, 0, 0.87);
  }
}
</style>
