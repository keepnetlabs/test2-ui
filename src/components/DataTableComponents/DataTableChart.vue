<template>
  <div class="datatable-chart__container">
    <div class="datatable-chart">
      <v-tooltip bottom opacity="1" v-if="shouldRenderTooltip">
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <pie :data="scope.row[col.property]" :chart-options="chartOptions" />
            <span
              class="datatable-chart__information-text"
              v-if="chartOptions && chartOptions.isWithText"
              >{{ scope.row[col.informationTextProperty] }}</span
            >
          </div>
        </template>
        <div
          v-for="(item, index) in scope.row[col.property]"
          :key="index"
          v-if="chartOptions && chartOptions.showTooltipLine"
        >
          <p class="datatable-chart__tooltip">{{ chartOptions.labels[index] }} : {{ item }}</p>
        </div>
      </v-tooltip>
      <template v-else>
        <div class="datatable-chart-empty-container">
          <div class="datatable-chart__empty">
            <div class="datatable-chart__empty-chart"></div>
          </div>
          <span
            v-if="chartOptions && chartOptions.isWithText"
            class="datatable-chart__empty-chart-text"
            >{{ scope.row[col.informationTextProperty] }}</span
          >
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
