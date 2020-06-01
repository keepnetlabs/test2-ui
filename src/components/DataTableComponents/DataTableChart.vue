<template>
  <div class="datatable-chart">
    <v-tooltip
      bottom
      opacity="1"
      v-if="
        scope.row &&
          scope.row[col.property] &&
          scope.row[col.property].filter(item => item === 0).length !==
            scope.row[col.property].length
      "
    >
      <template v-slot:activator="{ on }">
        <div v-on="on">
          <apexchart
            :options="chartOptions"
            :series="scope.row[col.property]"
            :width="chartOptions.chart.width"
          />
        </div>
        <div class="datatable-chart__text" v-if="chartOptions.summary && chartOptions.summary.show">
          {{ getChartSummary(scope.row[col.property], chartOptions.summary.seperator) }}
        </div>
      </template>
      <template
        v-for="(item, index) in scope.row[col.property]"
        v-if="chartOptions.showTooltipLine"
      >
        <p class="datatable-chart__tooltip">{{ chartOptions.labels[index] }} : {{ item }}</p>
      </template>
    </v-tooltip>
    <span v-else>-</span>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
export default {
  name: 'DataTableChart',
  components: {
    apexchart: VueApexCharts
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
  &__text {
    margin-top: -18px;
    margin-left: 2px;
    font-size: 12px;
    font-family: 'Open Sans', sans-serif !important;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.9;
    letter-spacing: normal;
    text-align: center;
  }
  &__tooltip {
    font-size: 12px !important;
    font-family: 'Open Sans', sans-serif !important;
    margin-bottom: 3px !important;
  }
}
</style>
