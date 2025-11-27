<template>
  <v-card class="users-dashboard-recent-badges">
    <div class="users-dashboard-recent-badges__header">
      <div class="users-dashboard-recent-badges__header-left">
        <h2
          id="text--users-dashboard-recent-badges-title"
          class="users-dashboard-recent-badges__title"
        >
          {{ labels.recentBadgesTitle }}
        </h2>
        <p
          id="text--users-dashboard-recent-badges-subtitle"
          class="users-dashboard-recent-badges__subtitle"
        >
          {{ labels.recentBadgesSubtitle }}
        </p>
      </div>
      <a
        id="link--users-dashboard-recent-badges-see-all"
        href="#"
        class="users-dashboard-recent-badges__link"
        @click.prevent="handleSeeAllBadges"
      >
        {{ labels.recentBadgesSeeAll }}
      </a>
    </div>
    <div class="users-dashboard-recent-badges__content">
      <template v-if="topPerformanceLoading">
        <div
          v-for="n in badgeCount"
          :key="`skeleton-${n}`"
          :class="[
            'users-dashboard-recent-badges__badge-item',
            `users-dashboard-recent-badges__badge-item--count-${badgeCount}`
          ]"
        >
          <div class="users-dashboard-recent-badges__badge-icon">
            <v-skeleton-loader type="avatar" size="80" />
          </div>
          <v-skeleton-loader type="text, text" width="90" />
        </div>
      </template>
      <template v-else>
        <div
          v-for="(badge, index) in recentBadges"
          :key="index"
          :class="[
            'users-dashboard-recent-badges__badge-item',
            `users-dashboard-recent-badges__badge-item--count-${badgeCount}`
          ]"
        >
          <div class="users-dashboard-recent-badges__badge-icon">
            <img
              v-if="badge.imageUrl"
              :src="badge.imageUrl"
              :alt="badge.name"
              class="users-dashboard-recent-badges__badge-image"
            />
            <div v-else class="users-dashboard-recent-badges__badge-placeholder">
              <VIcon size="48" color="#2196F3">mdi-trophy</VIcon>
            </div>
          </div>
          <span
            :id="`text--users-dashboard-recent-badges-name-${index}`"
            class="users-dashboard-recent-badges__badge-name"
          >
            {{ badge.name }}
          </span>
        </div>
      </template>
    </div>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'UsersDashboardRecentBadges',
  computed: {
    ...mapGetters({
      labels: 'usersDashboard/getLabels',
      topPerformanceLoading: 'usersDashboard/getTopPerformanceLoading'
    }),
    badgeCount() {
      return Math.min(this.recentBadges.length, 3)
    },
    recentBadges() {
      return [
        {
          id: 1,
          name: this.labels.badgeEliteSecurityChampion,
          type: 'security-champion',
          imageUrl: require('@/assets/img/elite-security-champion.png')
        },
        {
          id: 2,
          name: this.labels.badgeEngagementStar,
          type: 'engagement-star',
          imageUrl: require('@/assets/img/engagement-star.png')
        }
      ]
    }
  },
  data() {
    return {
      // Badge data is now in computed property to use labels
    }
  },
  methods: {
    handleSeeAllBadges() {
      const yourBadgesElement = document.getElementById('users-dashboard-your-badges')
      if (yourBadgesElement) {
        yourBadgesElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }
}
</script>
