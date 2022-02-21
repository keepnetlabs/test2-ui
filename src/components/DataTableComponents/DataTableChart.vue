<template>
  <div class="datatable-chart__container">
    <div class="datatable-chart">
      <v-tooltip bottom opacity="1" v-if="shouldRenderTooltip">
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <pie :data="scope.row[col.property]" :chart-options="chartOptions" />
            <span class="datatable-chart__information-text" v-if="chartOptions.isWithText">{{
              scope.row[col.informationTextProperty]
            }}</span>
          </div>
        </template>
        <div
          v-for="(item, index) in scope.row[col.property]"
          :key="index"
          v-if="chartOptions.showTooltipLine"
        >
          <p class="datatable-chart__tooltip">{{ chartOptions.labels[index] }} : {{ item }}</p>
        </div>
      </v-tooltip>
      <template v-else>
        <div class="datatable-chart-empty-container">
          <div class="datatable-chart__empty">
            <div class="datatable-chart__empty-chart"></div>
          </div>
          <span v-if="chartOptions.isWithText" class="datatable-chart__empty-chart-text">{{
            scope.row[col.informationTextProperty]
          }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Pie from '@/components/Common/Charts/Pie'
export default {
  name: 'DataTableChart',
  components: {
    Pie
  },
  computed: {
    shouldRenderTooltip() {
      const { scope, col } = this.$props
      return (
        scope.row &&
        scope.row[col.property] &&
        scope.row[col.property].constructor.name === 'Array' &&
        scope.row[col.property].filter((item) => item === 0).length !==
          scope.row[col.property].length
      )
    }
  },
  props: {
    scope: {
      type: Object
    },
    col: {
      type: Object
    },
    chartOptions: {
      type: Object
    }
  }
}
</script>

<style lang="scss">
.datatable-chart__container {
  padding: 0 32px;
}
.datatable-chart {
  display: flex;
  justify-content: center;
  > div {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    > div {
      margin-top: -8px;
      width: 43px;
      height: 43px;
    }
  }
  &__text {
    margin-top: -18px;
    margin-left: 16px;
    font-size: 12px;
    font-family: 'Open Sans', sans-serif !important;
    line-height: 1.9;
    letter-spacing: normal;
    text-align: center;
  }
  &__information-text {
    margin-left: 14px;
  }
  &__tooltip {
    margin-bottom: 0 !important;
  }
  &__empty {
    margin: 0 !important;
    height: 43px;
    width: 43px;
    position: relative;
    &-chart {
      margin: 0 !important;
      border-radius: 50%;
      background-color: #e0e0e0;
      height: 32px !important;
      width: 32px !important;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      &:after {
        content: '';
        position: absolute;
        height: 16px;
        width: 2px;
        background-color: rgba(255, 255, 255, 0.3);
        transform: rotateY(-10deg);
        left: 50%;
      }
    }
  }
  &__empty-chart-text {
    line-height: 28px;
    margin-left: 16px;
  }
  &__empty-container {
    display: flex;
    align-items: center;
  }
}
</style>
