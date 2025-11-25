<template>
  <v-card class="users-dashboard-recent-badges">
    <div class="users-dashboard-recent-badges__header">
      <div class="users-dashboard-recent-badges__header-left">
        <h2
          id="text--users-dashboard-recent-badges-title"
          class="users-dashboard-recent-badges__title"
        >
          Recent Badges
        </h2>
        <p
          id="text--users-dashboard-recent-badges-subtitle"
          class="users-dashboard-recent-badges__subtitle"
        >
          View your last 3 badges earned from your actions and behaviors.
        </p>
      </div>
      <a
        id="link--users-dashboard-recent-badges-see-all"
        href="#"
        class="users-dashboard-recent-badges__link"
        @click.prevent="handleSeeAllBadges"
      >
        See All Badges
      </a>
    </div>
    <div class="users-dashboard-recent-badges__content">
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
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'UsersDashboardRecentBadges',
  data() {
    return {
      // TODO: Replace with actual API data
      recentBadges: [
        {
          id: 1,
          name: 'Elite Security Champion',
          type: 'security-champion',
          imageUrl: null // Will be loaded based on type
        },
        {
          id: 2,
          name: 'Engagement Star',
          type: 'engagement-star',
          imageUrl: null // Will be loaded based on type
        }
      ]
    }
  },
  computed: {
    badgeCount() {
      return Math.min(this.recentBadges.length, 3)
    }
  },
  methods: {
    handleSeeAllBadges() {
      // TODO: Navigate to all badges page or show modal
      console.log('See All Badges clicked')
    }
  }
}
</script>
