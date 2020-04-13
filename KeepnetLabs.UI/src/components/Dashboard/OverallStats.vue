<template>
  <div>
    <div class="v-cart-dropdown mr-2">
      <div class="text-right">
        <v-menu
          v-model="value"
          :disabled="false"
          :absolute="false"
          :open-on-hover="false"
          :close-on-click="true"
          :close-on-content-click="true"
          :offset-x="false"
          :offset-y="true"
          z-index="999"
        >
          <template v-slot:activator="{ on }">
            <div
              class="v-btn-dropdown v-btn v-btn--depressed v-btn--flat v-btn--tile theme--light
              v-size--default black--text pr-0 pl-2"
              v-on="on"
            >
              {{ dropdownCurrent.value }}
              <v-icon>mdi-chevron-down</v-icon>
            </div>
          </template>

          <v-list class="v-cart-dropdown-list">
            <v-list-item
              v-for="(item, index) in dropdownData"
              :key="index"
              @click="changeDropdownItem(item)"
            >
              <v-list-item-title>{{ item.value }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
    <div class="v-cart-content-wrapper">
      <div class="v-cart-content-pie-chart">
        <div v-if="chartData && chartData.length > 0">
          <div id="chart">
            <apexchart
              type="area"
              :width="getWidth"
              height="520"
              class="apex-chart"
              :options="chartOptions"
              :series="series"
            />
          </div>
        </div>
        <img
          v-else
          :src="require('../../assets/img/overall-no-data.png')"
          class="overall-no-data"
        />
      </div>
    </div>
  </div>
</template>
<script>
import VueApexCharts from 'vue-apexcharts'

export default {
  name: 'overall-stats',
  components: {
    apexchart: VueApexCharts
  },
  data: () => ({
    /* monthNames: ['January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December',
        ], */
    value: false,
    series: [],
    series2: [],
    chartOptions: {
      colors: ['#64B5F6', '#c05adf', '#67C23A', '#E6A23C', '#5822F6'],
      legend: {
        fontSize: '16px',
        position: 'top',
        horizontalAlign: 'center',
        offsetY: 20,
        markers: {
          size: 6,
          strokeWidth: 0,
          strokeColor: '#fff',
          offsetX: 0,
          offsetY: 0,
          shape: 'circle',
          radius: 2
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        tickPlacement: 'on',
        type: 'category',
        categories: [],
        labels: {
          showDuplicates: true,
          trim: false,
          hideOverlappingLabels: false,
          offsetX: 0,
          style: {
            colors: [],
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            cssClass: 'apexcharts-xaxis-label'
          },
          // tickAmount: 14,
          //  formatter: value => new Date('2018-09-19T00:00:00').getMonth(),
          // https://stackoverflow.com/questions/1643320/get-month-name-from-date
          formatter(value) {
            const date = new Date(value)
            const month = date.toLocaleString('en-EN', { month: 'long' })
            return month // The formatter function overrides format property
          }
        }
      },
      yaxis: {
        // tickAmount: 5,
        // min: 0,
        // max: 0,
        // forceNiceScale: true,
      },
      tooltip: {
        x: {
          format: 'MMMM'
        }
      },
      responsive: [
        {
          breakpoint: 1000,
          options: {
            chart: {
              height: '500px'
            }
          }
        }
      ]
    }
  }),
  methods: {
    changeDropdownItem(item) {
      // this.dropdownCurrent = item;
      this.$emit('changeDropdownItem', item)
    }
  },
  created() {
    this.series = this.chartData
    this.chartOptions.xaxis.categories = this.months
    // const [min, max] = this.minMaxValues
    // this.chartOptions.yaxis.min = min;
    // this.chartOptions.yaxis.max = max;
  },
  mounted() {
    // this.chartOptions.labels = this.labels;
  },
  computed: {
    getWidth() {
      return '100%'
      // return `${this.calculate}px`
    },
    calculate() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 400
        case 'sm':
          return 600
        case 'md':
          return 840
        case 'lg':
          return 1100
        case 'xl':
          return 1550
        default:
          return 0
      }
    }
  },
  props: {
    minMaxValues: {
      type: Array,
      required: true
    },
    months: {
      type: Array,
      required: true
    },
    chartData: {
      type: Array,
      required: true
    },
    dropdownCurrent: {
      type: Object,
      required: true
    },
    dropdownData: {
      type: Array,
      default() {
        return [
          {
            key: '',
            value: ''
          }
        ]
      }
    }
  }
}
</script>

<style scoped lang="scss">
.v-cart-dropdown-list {
  .theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
    color: rgba(0, 0, 0, 0.87) !important;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 1px !important;
    min-height: 41px;
  }

  .theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled):hover {
    background-color: #e0e0e0 !important;
  }
}

.v-menu__content {
  border-radius: 8px !important;
  box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8) !important;
  font-family: 'Open Sans', sans-serif !important;
}

.v-btn-dropdown {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px !important;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-transform: none;
  min-width: 80px !important;
  width: 133px;
  justify-content: flex-end;
}

.v-cart-content-pie-chart {
  align-items: center;
  position: relative;
  margin: 0 auto !important;
  padding-top: 24px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  height: auto;
  max-height: 550px;

  > div {
    max-width: 100%;
    width: 100%;
  }

  .overall-no-data {
    max-width: 100%;
    height: auto;
    max-height: 526px;
  }
}

@media only screen and (max-width: 1025px) {
  ::v-deep .apexcharts-canvas {
    max-width: 100% !important;
    width: 100% !important;

    > svg {
      max-width: 100% !important;
      width: 100% !important;

      > foreignObject {
        max-width: 100% !important;
        width: 100% !important;
      }

      > .apexcharts-inner {
        max-width: 100% !important;
        width: 100% !important;
      }
    }
  }
}

#chart {
  align-items: center;
}

::v-deep svg:not(:root) {
  overflow: visible;
}

::v-deep foreignObject {
  overflow: visible;
}

::v-deep .apexcharts-toolbar {
  display: none !important;
}

.v-cart-content-wrapper {
  min-height: auto;
  background-color: #fafafa;
  border-radius: 20px !important;
}
::v-deep .apexcharts-legend {
  padding-bottom: 32px;

  .apexcharts-legend-series {
    margin: 0 8px !important;
  }
  .apexcharts-legend-marker {
    width: 16px !important;
    height: 16px !important;
    margin-right: 8px !important;
  }
  .apexcharts-legend-text {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 16px !important;
  }
}
@media only screen and (min-width: 1025px) {
  ::v-deep .v-image__image,
  .v-image__placeholder {
    background-size: contain !important;
    height: 79%;
  }
}
@media only screen and (max-width: 1025px) {
  ::v-deep .v-image__image,
  .v-image__placeholder {
    top: 35%;
  }
  .v-responsive {
    overflow: visible !important;
  }
}
</style>
