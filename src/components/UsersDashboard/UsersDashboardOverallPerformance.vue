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
        <div class="users-dashboard-overall-performance__metric-item users-dashboard-overall-performance__metric-item--rank">
          <figure
            v-if="performanceData.rank >= 1 && performanceData.rank <= 3"
            :class="[
              'users-dashboard-overall-performance__ribbon',
              `users-dashboard-overall-performance__ribbon--${getRankClass(performanceData.rank)}`
            ]"
          >
            <img :src="getRibbonImgSrc(performanceData.rank)" :alt="getRibbonAlt(performanceData.rank)" />
          </figure>
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
      labels: 'usersDashboard/getLabels',
      topPerformance: 'usersDashboard/getTopPerformance',
      topPerformanceLoading: 'usersDashboard/getTopPerformanceLoading'
    }),
    performanceData() {
      // Get current user's data from topPerformance array
      if (!this.topPerformance || this.topPerformance.length === 0) {
        return {
          percentage: 0,
          points: 0,
          rank: 0
        }
      }

      const currentUserId = '4BCeEWHwAKME'
      const currentUser = this.topPerformance.find(
        (user) => user.targetUserResourceId === currentUserId
      )

      if (currentUser) {
        return {
          percentage: currentUser.performance || 0,
          points: currentUser.points || 0,
          rank: currentUser.rank || 0
        }
      }

      // Fallback to default values
      return {
        percentage: 0,
        points: 0,
        rank: 0
      }
    }
  },
  data() {
    return {
      goldRibbonImg: require('@/assets/img/leaderboard-gold-ribbon.svg'),
      silverRibbonImg: require('@/assets/img/leaderboard-silver-ribbon.svg'),
      bronzeRibbonImg: require('@/assets/img/leaderboard-bronze-ribbon.svg')
    }
  },
  methods: {
    handleSeeRankingDetails() {
      const leaderboardElement = document.getElementById('users-dashboard-leaderboard')
      if (leaderboardElement) {
        leaderboardElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    },
    getRibbonImgSrc(rank) {
      if (rank === 1) return this.goldRibbonImg
      if (rank === 2) return this.silverRibbonImg
      return this.bronzeRibbonImg
    },
    getRibbonAlt(rank) {
      if (rank === 1) return 'gold ribbon'
      if (rank === 2) return 'silver ribbon'
      return 'bronze ribbon'
    },
    getRankClass(rank) {
      if (rank === 1) return 'gold'
      if (rank === 2) return 'silver'
      return 'bronze'
    }
  }
}
</script>
