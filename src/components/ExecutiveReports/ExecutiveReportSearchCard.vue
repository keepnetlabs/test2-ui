<template>
  <div class="executive-report-search-card">
    <div class="executive-report-search-card__header">
      <div class="executive-report-search-card__header-title">
        {{ card.name }}
        <VTooltip v-if="isManagerMetricCard" bottom>
          <template #activator="{ on, attrs }">
            <VIcon v-bind="attrs" v-on="on" small class="ml-1">mdi-information-outline</VIcon>
          </template>
          <span>Manager Metric widgets cannot be used together or with other metric widgets.</span>
        </VTooltip>
      </div>
      <div>
        <VIcon class="cursor-pointer" medium @click="showBodyDetail = !showBodyDetail">
          {{ showBodyDetail ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
        </VIcon>
      </div>
    </div>
    <div v-if="showBodyDetail" class="executive-report-search-card__content mt-2">
      <VTooltip
        v-for="(chart, index) in card.widgets"
        :key="index"
        bottom
        :disabled="!getTooltipText(chart)"
      >
        <template #activator="{ on, attrs }">
          <div
            v-bind="attrs"
            v-on="on"
            :class="[
              'executive-report-search-card__content-chart position-relative',
              isChartDisabled(chart) ? 'cursor-not-allowed' : 'cursor-pointer'
            ]"
            @click="handleAddChart(chart, card.widgets, index)"
          >
            <div>
              <img
                :class="[
                  'executive-report-search-card__content-chart-image',
                  chart.isAdded || isChartDisabled(chart) ? 'opacity-40' : ''
                ]"
                :src="chart.imageUrl"
                :alt="chart.name"
              />
              <div
                v-if="chart.isAdded"
                class="executive-report-search-card__content-chart-image--active"
              >
                ALREADY ADDED
              </div>
            </div>
            <div
              :class="[
                'executive-report-search-card__content-chart-title',
                chart.isAdded || isChartDisabled(chart) ? 'opacity-40' : ''
              ]"
            >
              {{ chart.name }}
            </div>
          </div>
        </template>
        <span>{{ getTooltipText(chart) }}</span>
      </VTooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExecutiveReportSearchCard',
  props: {
    card: {
      type: Object,
      default: () => {}
    },
    isDefaultActive: {
      type: Boolean,
      default: false
    },
    hasManagerMetricAdded: {
      type: Boolean,
      default: false
    },
    hasNonManagerMetricAdded: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isManagerMetricCard() {
      return this.card.widgets?.some((widget) => widget.isSupportManager)
    }
  },
  data() {
    return {
      isMenuActive: this.isDefaultActive,
      showBodyDetail: this.isDefaultActive
    }
  },
  methods: {
    handleAddChart(chart, charts, index) {
      if (this.isChartDisabled(chart)) return
      this.$emit('on-add-chart', chart, charts, index)
    },
    isChartDisabled(chart) {
      if (chart.isAdded) return false
      if (this.hasManagerMetricAdded) return true
      if (this.hasNonManagerMetricAdded && chart.isSupportManager) return true
      return false
    },
    getTooltipText(chart) {
      if (chart.isAdded) return ''
      if (this.hasManagerMetricAdded) {
        if (chart.isSupportManager) return 'Only one Manager Metric widget can be added.'
        return 'Unavailable while a Manager Metric widget is added.'
      }
      if (this.hasNonManagerMetricAdded && chart.isSupportManager) {
        return 'Manager Metric widgets cannot be added while other metric widgets are already added.'
      }
      return ''
    }
  }
}
</script>
