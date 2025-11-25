<template>
  <v-card class="users-dashboard-overall-performance">
    <div class="users-dashboard-overall-performance__header">
      <div class="users-dashboard-overall-performance__header-left">
        <h2
          id="text--users-dashboard-overall-performance-title"
          class="users-dashboard-overall-performance__title"
        >
          {{ labels.overallPerformanceTitle }}
        </h2>
        <p
          id="text--users-dashboard-overall-performance-subtitle"
          class="users-dashboard-overall-performance__subtitle"
        >
          {{ labels.overallPerformanceSubtitle }}
        </p>
      </div>
      <a
        id="link--users-dashboard-overall-performance-ranking-details"
        href="#"
        class="users-dashboard-overall-performance__link"
        @click.prevent="handleSeeRankingDetails"
      >
        {{ labels.overallPerformanceSeeRanking }}
      </a>
    </div>
    <div class="users-dashboard-overall-performance__content">
      <div class="users-dashboard-overall-performance__percentage-box">
        <span
          id="text--users-dashboard-overall-performance-percentage"
          class="users-dashboard-overall-performance__percentage"
        >
          {{ performanceData.percentage }}%
        </span>
      </div>
      <div class="users-dashboard-overall-performance__metrics">
        <div class="users-dashboard-overall-performance__metric-item">
          <span class="users-dashboard-overall-performance__metric-label">{{
            labels.overallPerformancePoints
          }}</span>
          <span
            id="text--users-dashboard-overall-performance-points"
            class="users-dashboard-overall-performance__metric-value"
          >
            {{ performanceData.points }}
          </span>
        </div>
        <div class="users-dashboard-overall-performance__metric-item">
          <span class="users-dashboard-overall-performance__metric-label">{{
            labels.overallPerformanceRank
          }}</span>
          <span
            id="text--users-dashboard-overall-performance-rank"
            class="users-dashboard-overall-performance__metric-value"
          >
            {{ performanceData.rank }}
          </span>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'UsersDashboardOverallPerformance',
  computed: {
    ...mapGetters({
      labels: 'usersDashboard/getLabels'
    })
  },
  data() {
    return {
      // TODO: Replace with actual API data
      performanceData: {
        percentage: 85,
        points: 12500,
        rank: 15
      }
    }
  },
  methods: {
    handleSeeRankingDetails() {
      // TODO: Scroll to ranking details component when it's added
      // For now, just a placeholder
      console.log('See Ranking Details clicked')
    }
  }
}
</script>
