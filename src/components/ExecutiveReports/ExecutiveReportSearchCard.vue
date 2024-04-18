<template>
  <div class="executive-report-search-card">
    <div class="executive-report-search-card__header">
      <div class="executive-report-search-card__header-title">
        {{ card.name }}
      </div>
      <div>
        <VIcon class="cursor-pointer" medium @click="showBodyDetail = !showBodyDetail">
          {{ showBodyDetail ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
        </VIcon>
      </div>
    </div>
    <div v-if="showBodyDetail" class="executive-report-search-card__content mt-2">
      <div
        v-for="chart in card.charts"
        :key="chart.name"
        class="executive-report-search-card__content-chart cursor-pointer"
        @click="handleChartClick"
      >
        <img
          class="executive-report-search-card__content-chart-image"
          :src="chart.src"
          alt="chart"
        />
        <div class="executive-report-search-card__content-chart-title">{{ chart.name }}</div>
      </div>
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
    }
  },
  data() {
    return {
      isMenuActive: this.isDefaultActive,
      showBodyDetail: this.isDefaultActive
    }
  },
  methods: {
    handleChartClick() {}
  }
}
</script>
