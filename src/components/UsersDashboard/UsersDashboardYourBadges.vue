<template>
  <VCard class="users-dashboard-your-badges">
    <div class="users-dashboard-your-badges__header">
      <h2
        id="text--users-dashboard-your-badges-title"
        class="users-dashboard-your-badges__title"
      >
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
      <div
        v-for="(badge, index) in badges"
        :key="badge.id || index"
        :class="[
          'users-dashboard-your-badges__badge-card',
          badge.isEarned ? 'users-dashboard-your-badges__badge-card--earned' : 'users-dashboard-your-badges__badge-card--not-earned'
        ]"
      >
        <div
          :class="[
            'users-dashboard-your-badges__badge-icon',
            badge.isEarned ? 'users-dashboard-your-badges__badge-icon--earned' : 'users-dashboard-your-badges__badge-icon--not-earned'
          ]"
        >
          <VIcon
            :size="48"
            :color="badge.isEarned ? '#2196F3' : '#757575'"
          >
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
    </div>
  </VCard>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'UsersDashboardYourBadges',
  computed: {
    ...mapGetters({
      labels: 'usersDashboard/getLabels'
    })
  },
  data() {
    return {
      badges: []
    }
  },
  created() {
    this.fetchBadges()
  },
  methods: {
    fetchBadges() {
      // TODO: Replace with actual API call
      setTimeout(() => {
        this.badges = [
          {
            id: 1,
            name: 'Elite Security Champion',
            type: 'security-champion',
            isEarned: true,
            earnedDate: '2025-11-02'
          },
          {
            id: 2,
            name: 'Engagement Star',
            type: 'engagement-star',
            isEarned: true,
            earnedDate: '2025-11-02'
          },
          {
            id: 3,
            name: 'Security Ambassador',
            type: 'security-ambassador',
            isEarned: false
          }
        ]
      }, 300)
    },
    getBadgeIcon(type) {
      const iconMap = {
        'security-champion': 'mdi-shield-check',
        'engagement-star': 'mdi-star',
        'security-ambassador': 'mdi-account-group'
      }
      return iconMap[type] || 'mdi-trophy'
    },
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

