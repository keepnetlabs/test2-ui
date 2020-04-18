<template>
  <div class="phishing-wrapper">
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
        >
          <template v-slot:activator="{ on }">
            <div
              class="v-btn-dropdown v-btn v-btn--depressed v-btn--flat v-btn--tile theme--light
              v-size--default black--text pr-0 pl-2"
              v-on="on"
            >
              {{ dropdownCurrent.value }}
              <v-icon class="pl-2">mdi-chevron-down</v-icon>
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
      <div v-if="series.length > 0">
        <div id="chart" class="v-cart-content-pie-chart">
          <apexchart
            :key="series[0]"
            type="pie"
            height="220"
            :options="chartOptions"
            :series="series"
          />
        </div>
      </div>

      <div v-else>
        <div
          class="pide-data-not-found-wrapper d-flex flex-wrap flex-row justify-center align-center align-self-center align-content-center"
        >
          <div class="pie-data-not-found-left-img"></div>
          <div class="pie-data-right d-flex flex-wrap flex-column align-center">
            <div class="pie-data-right-title">
              There's no data, yet
            </div>
            <div class="pie-data-right-button">
              <v-btn color="#2196f3" dark rounded>
                <v-icon left>mdi-plus-thick</v-icon>
                START A CAMPAIGN
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VueApexCharts from 'vue-apexcharts'

export default {
  name: 'phishing-campaigns-pie-chart',
  components: {
    apexchart: VueApexCharts
  },
  data: () => ({
    value: false,
    series: [0, 0, 0],
    chartOptions: {
      tooltip: {
        y: {
          formatter: function(val) {
            return `${'<div>' + '<span>'}${val}</span>` + '</div>'
          },
          title: {
            formatter: function() {
              return ''
            }
          }
        }
      },
      legend: {
        show: true,
        showForSingleSeries: false,
        floating: true,
        position: 'right', // whether to position legends in 1 of 4
        // direction - top, bottom, left, right
        horizontalAlign: 'center', // when position top/bottom, you can
        // specify whether to align legends
        // left, right or center
        verticalAlign: 'right',
        fontSize: '12px',
        fontFamily: undefined,
        textAnchor: 'start',
        offsetY: 0,
        offsetX: -200,
        formatter: undefined,
        labels: {
          colors: ['#66bb6a', '#2196f3', '#00bcd4', '#ffce56', '#e91e63'],
          useSeriesColors: false
        },
        markers: {
          size: 6,
          strokeWidth: 0,
          strokeColor: '#fff',
          offsetX: 0,
          offsetY: 0,
          shape: 'circle',
          radius: 2
        },
        itemMargin: {
          horizontal: 6,
          vertical: 5
        },
        containerMargin: {
          left: 20,
          top: 4,
          right: 10,
          bottom: 0
        },
        onItemClick: {
          toggleDataSeries: true
        },
        onItemHover: {
          highlightDataSeries: true
        }
      },
      fill: {
        colors: ['#66bb6a', '#2196f3', '#00bcd4', '#ffce56', '#e91e63']
      },
      colors: ['#66bb6a', '#2196f3', '#00bcd4', '#ffce56', '#e91e63'],
      labels: [],
      responsive: [
        {
          breakpoint: 1000,
          options: {
            chart: {
              width: 200,
              height: 200,
              offsetX: -30
            },
            legend: {
              width: 200
            }
          }
        },
        {
          breakpoint: 500,
          options: {
            chart: {
              width: 300,
              height: 300,
              offsetX: 0,
              offsetY: 26,
              floating: false
            },
            legend: {
              floating: true,
              position: 'bottom',
              width: 300,
              height: 300,
              offsetX: 0,
              offsetY: 400,
              horizontalAlign: undefined,
              verticalAlign: undefined,
              textAnchor: 'end'
            }
          }
        },
        {
          breakpoint: 360,
          options: {
            chart: {
              width: 260,
              height: 260,
              offsetX: 0,
              offsetY: 26,
              floating: false
            },
            legend: {
              width: 100,
              height: 100,
              offsetX: -17
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
    },
    initialize() {
      this.chartOptions.labels = this.labels
      this.series = this.pieData
      this.chartOptions.colors = this.chartOptionColors
      this.chartOptions.fill.colors = this.chartOptionColors
    }
  },
  created() {
    this.initialize()
  },
  mounted() {
    this.initialize()
  },
  watch: {
    labels() {
      this.initialize()
    }
  },
  computed: {},
  props: {
    chartOptionColors: {
      type: Array,
      required: true
    },
    pieData: {
      type: Array,
      required: true
    },
    labels: {
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
.phishing-wrapper {
  height: 100%;

  @media only screen and (max-width: 360px) {
    overflow: hidden !important;
  }
}
::v-deep .apexcharts-tooltip {
  background: #ffff !important;
  font-size: 15px !important;
  color: #2196f3 !important;
  padding: 4px 8px 4px 8px;
}

.pide-data-not-found-wrapper {
  padding-top: 27px;

  .pie-data-not-found-left-img {
    width: 182px;
    height: 182px;
    background-size: 100%;
    background-image: url('../assets/img/pie-no-data.png') !important;
  }

  .no-data-wrapper {
    margin-left: 27vw;
  }

  .pie-data-right {
    margin-left: 43px;

    .pie-data-right-title {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 24px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.29;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 16px;
    }
  }
}

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

  .v-list-item {
    padding-left: 29px !important;
    padding-right: 16px !important;
  }
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
  width: 55%;
  padding-top: 13px;
  position: relative;
  margin-left: 0;

  > div {
    max-width: 100%;
  }
}
@media only screen and (max-width: 1000px) {
  .v-cart-content-pie-chart {
    width: 350px;
    padding-top: 0;
    margin: 0 auto;
  }
}
@media only screen and (max-width: 360px) {
  .v-cart-content-pie-chart {
    width: 100%;
  }
}

::v-deep svg:not(:root) {
  overflow: visible;
}

::v-deep foreignObject {
  overflow: visible;
}

.v-cart-content-wrapper {
  height: 231px;
  background-color: #fafafa;
  border-radius: 20px !important;
}

::v-deep .apexcharts-legend-marker {
  top: 2px !important;
}

::v-deep .apexcharts-legend-text {
  margin-left: 7px !important;
}

::v-deep .apexcharts-tooltip {
  background-color: transparent !important;
  box-shadow: none !important;
}

::v-deep .apexcharts-tooltip-series-group {
  background-color: #fff !important;
  border-radius: 20px !important;
  color: #2196f3 !important;
}
::v-deep .apexcharts-tooltip-text-value > div > span {
  font-size: 16px !important;
}

::v-deep .apexcharts-legend {
  .apexcharts-legend-marker {
    width: 16px !important;
    height: 16px !important;
    margin-right: 8px !important;
  }

  .apexcharts-legend-text {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px !important;
  }
}

@media only screen and (max-width: 1135px) and (min-width: 769px) {
  .pie-data-not-found-left-img {
    display: none !important;
  }
  .pide-data-not-found-wrapper {
    margin: 0 auto;

    .pie-data-right {
      margin: 0 auto;
      margin-top: 50px;
    }
  }
}

@media only screen and (max-width: 769px) {
  .v-cart-content-wrapper {
    display: flex !important;
    align-items: center !important;
    > div {
      margin: 0 auto;
    }
  }
  .pie-data-not-found-left-img {
    display: none !important;
  }
  ::v-deep .apexcharts-legend {
    overflow: hidden;
    padding: 0 !important;
    top: 10px !important;
    right: -200px !important;
    height: 200px !important;
    width: 200px !important;
    z-index: 99;
  }

  .pie-data-right {
    margin-left: 0 !important;
  }
}
@media only screen and (max-width: 500px) {
  .v-cart-content-wrapper {
    height: auto;
    padding-bottom: 20px;
    > div {
      margin: 0 auto;
    }
  }
  ::v-deep .apexcharts-legend {
    margin-left: 40px;
    margin-top: 220px !important;
  }
}
</style>
