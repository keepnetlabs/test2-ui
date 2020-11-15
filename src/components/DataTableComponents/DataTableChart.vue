<template>
  <div class="datatable-chart">
    <v-tooltip
      bottom
      opacity="1"
      v-if="
        scope.row &&
        scope.row[col.property] &&
        scope.row[col.property].constructor.name === 'Array' &&
        scope.row[col.property].filter((item) => item === 0).length !==
          scope.row[col.property].length
      "
    >
      <template v-slot:activator="{ on }">
        <div v-on="on">
          <pie :data="scope.row[col.property]" :chart-options="chartOptions" />
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
    <div v-else class="datatable-chart__empty"></div>
  </div>
</template>

<script>
import Pie from '@/components/Common/Charts/Pie'
export default {
  name: 'DataTableChart',
  components: {
    Pie
  },
  methods: {
    getChartSummary(property, seperator = '/') {
      return property.join(seperator)
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
.datatable-chart {
  display: flex;
  justify-content: center;
  > div {
    > div {
      margin-top: -8px;
      width: 43px;
      height: 43px;
    }
  }
  &__text {
    margin-top: -18px;
    margin-left: 2px;
    font-size: 12px;
    font-family: 'Open Sans', sans-serif !important;
    line-height: 1.9;
    letter-spacing: normal;
    text-align: center;
  }
  &__tooltip {
    margin-bottom: 0 !important;
  }
  &__empty {
    border-radius: 50%;
    background-color: #e0e0e0;
    height: 32px;
    width: 32px;
    margin: 0 auto;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      height: 16px;
      width: 1px;
      background-color: rgba(255, 255, 255, 0.3);
      transform: rotateY(-10deg);
      left: 50%;
    }
  }
}
</style>
