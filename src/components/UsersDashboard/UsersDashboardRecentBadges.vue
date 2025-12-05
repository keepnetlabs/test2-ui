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
      <template v-if="isLoading">
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
        <VTooltip v-for="(badge, index) in recentBadges" :key="badge.id || index" bottom>
          <template #activator="{ on }">
            <div
              v-on="on"
              :class="[
                'users-dashboard-recent-badges__badge-item',
                `users-dashboard-recent-badges__badge-item--count-${badgeCount}`
              ]"
            >
              <div class="users-dashboard-recent-badges__badge-icon">
                <img
                  v-if="getBadgeImage(badge)"
                  :src="getBadgeImage(badge)"
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
          <span>{{ getBadgeDescription(badge) }}</span>
        </VTooltip>
      </template>
    </div>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import usersDashboardBadgeMixin from '@/mixins/usersDashboardBadgeMixin'

export default {
  name: 'UsersDashboardRecentBadges',
  mixins: [usersDashboardBadgeMixin],
  computed: {
    ...mapGetters({
      labels: 'usersDashboard/getLabels',
      myBadges: 'usersDashboard/getMyBadges',
      myBadgesLoading: 'usersDashboard/getMyBadgesLoading',
      language: 'usersDashboard/getLanguage'
    }),
    isLoading() {
      return this.myBadgesLoading
    },
    badgeCount() {
      return Math.min(this.recentBadges.length, 3)
    },
    recentBadges() {
      // Get earned badges from API, sorted by earnedDate (most recent first)
      if (this.myBadges && this.myBadges.length > 0) {
        const earnedBadges = this.myBadges
          .filter((badge) => badge.earned === true && badge.earnedDate)
          .map((badge, index) => ({
            id: `${badge.badgeType}-${badge.level || 0}-${index}`,
            name: badge.badgeName,
            type: badge.badgeType,
            level: badge.level || null,
            description: badge.description || '',
            earnedDate: badge.earnedDate
          }))
          .sort((a, b) => {
            // Sort by earnedDate descending (most recent first)
            return new Date(b.earnedDate) - new Date(a.earnedDate)
          })
          .slice(0, 3) // Take only first 3

        return earnedBadges
      }
      return []
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
