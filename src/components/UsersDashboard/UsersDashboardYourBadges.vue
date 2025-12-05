<template>
  <VCard id="users-dashboard-your-badges" class="users-dashboard-your-badges">
    <div class="users-dashboard-your-badges__header">
      <h2 id="text--users-dashboard-your-badges-title" class="users-dashboard-your-badges__title">
        {{ labels.yourBadgesTitle }}
      </h2>
      <p
        id="text--users-dashboard-your-badges-subtitle"
        class="users-dashboard-your-badges__subtitle"
      >
        {{ labels.yourBadgesSubtitle }}
      </p>
    </div>
    <div class="users-dashboard-your-badges__content">
      <VTooltip v-for="(badge, index) in badges" :key="badge.id || index" bottom>
        <template #activator="{ on }">
          <div
            v-on="on"
            :class="[
              'users-dashboard-your-badges__badge-card',
              badge.isEarned
                ? 'users-dashboard-your-badges__badge-card--earned'
                : 'users-dashboard-your-badges__badge-card--not-earned'
            ]"
          >
            <div
              :class="[
                'users-dashboard-your-badges__badge-icon',
                badge.isEarned
                  ? 'users-dashboard-your-badges__badge-icon--earned'
                  : 'users-dashboard-your-badges__badge-icon--not-earned'
              ]"
            >
              <img
                v-if="getBadgeImage(badge)"
                :src="getBadgeImage(badge)"
                :alt="badge.name"
                class="users-dashboard-your-badges__badge-image"
                :style="{ filter: badge.isEarned ? 'none' : 'grayscale(1)' }"
              />
              <VIcon v-else :size="48" :color="badge.isEarned ? '#2196F3' : '#757575'">
                {{ getBadgeIcon(badge.type) }}
              </VIcon>
            </div>
            <h3 class="users-dashboard-your-badges__badge-name">
              {{ badge.name }}
            </h3>
            <p class="users-dashboard-your-badges__badge-status">
              {{ getBadgeStatus(badge) }}
            </p>
          </div>
        </template>
        <span>{{ getBadgeDescription(badge) }}</span>
      </VTooltip>
    </div>
  </VCard>
</template>

<script>
import { mapGetters } from 'vuex'
import usersDashboardBadgeMixin from '@/mixins/usersDashboardBadgeMixin'

export default {
  name: 'UsersDashboardYourBadges',
  mixins: [usersDashboardBadgeMixin],
  computed: {
    ...mapGetters({
      labels: 'usersDashboard/getLabels',
      myBadges: 'usersDashboard/getMyBadges',
      myBadgesLoading: 'usersDashboard/getMyBadgesLoading',
      language: 'usersDashboard/getLanguage'
    }),
    badges() {
      // If badges are loaded from API, use them; otherwise return empty array
      // The API response will be mapped to the expected format
      if (this.myBadges && this.myBadges.length > 0) {
        const mappedBadges = this.myBadges.map((badge, index) => ({
          id: `${badge.badgeType}-${badge.level || 0}-${index}`,
          name: badge.badgeName,
          type: badge.badgeType,
          isEarned: badge.earned || false,
          earnedDate: badge.earnedDate || null,
          level: badge.level || null,
          description: badge.description || '',
          categoryType: badge.categoryType,
          categoryName: badge.categoryName
        }))

        // Sort badges: earned badges first, then not earned
        return mappedBadges.sort((a, b) => {
          if (a.isEarned && !b.isEarned) return -1
          if (!a.isEarned && b.isEarned) return 1
          return 0
        })
      }
      // Return empty array while loading or if no badges
      return []
    },
    isLoading() {
      return this.myBadgesLoading
    }
  },
  methods: {
    getBadgeStatus(badge) {
      if (badge.isEarned && badge.earnedDate) {
        const date = new Date(badge.earnedDate)
        const formattedDate = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
        return this.labels.yourBadgesEarnedOn(formattedDate)
      }
      return this.labels.yourBadgesNotEarnedYet
    }
  }
}
</script>
