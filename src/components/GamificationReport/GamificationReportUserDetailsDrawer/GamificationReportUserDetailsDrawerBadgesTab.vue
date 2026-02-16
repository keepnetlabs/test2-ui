<template>
  <div class="gamification-report-user-details-badges-tab">
    <div class="gamification-report-user-details-badges-tab__header">
      <h2 class="gamification-report-user-details-badges-tab__title">Badges</h2>
      <p class="gamification-report-user-details-badges-tab__subtitle">
        View {{ selectedRow.firstName }} {{ selectedRow.lastName }}'s earned and unearned badges
        based on their actions and behaviors.
      </p>
    </div>

    <div v-if="isLoading" class="gamification-report-user-details-badges-tab__skeleton">
      <div class="gamification-report-user-details-badges-tab__skeleton-tabs">
        <v-skeleton-loader type="chip" width="80" height="32" />
        <v-skeleton-loader type="chip" width="80" height="32" />
        <v-skeleton-loader type="chip" width="80" height="32" />
      </div>
      <div class="gamification-report-user-details-badges-tab__skeleton-grid">
        <div
          v-for="n in 6"
          :key="`badge-skeleton-${n}`"
          class="gamification-report-user-details-badges-tab__skeleton-card"
        >
          <div class="gamification-report-user-details-badges-tab__skeleton-card-icon">
            <v-skeleton-loader type="avatar" size="80" />
          </div>
          <v-skeleton-loader type="text" width="100" height="16" class="gamification-report-user-details-badges-tab__skeleton-card-name" />
          <v-skeleton-loader type="text" width="70" height="12" />
        </div>
      </div>
    </div>
    <div
      v-else-if="allBadges.length === 0"
      class="gamification-report-user-details-badges-tab__empty"
    >
      <span class="gamification-report-user-details-badges-tab__empty-text">
        The user has not earned any badge
      </span>
    </div>
    <div v-else>
      <ElTabs
        v-model="activeLevelTab"
        class="k-sub-tab gamification-report-user-details-badges-tab__tabs"
      >
        <ElTabPane
          v-for="level in [1, 2, 3]"
          :key="level"
          :label="`Level ${level}`"
          :name="String(level)"
        >
          <div class="gamification-report-user-details-badges-tab__grid">
            <template v-if="getBadgesByLevel(level).length > 0">
              <div
                v-for="(badge, index) in getBadgesByLevel(level)"
                :key="getBadgeKey(badge, index)"
                class="gamification-report-user-details-badges-tab__grid-item"
              >
                <VTooltip
                  bottom
                  opacity="1"
                  :disabled="!getTooltipContent(badge)"
                >
                  <template #activator="{ on, attrs }">
                    <div
                      v-bind="attrs"
                      v-on="on"
                      :class="[
                        'gamification-report-user-details-badges-tab__badge-card',
                        badge.earned
                          ? 'gamification-report-user-details-badges-tab__badge-card--earned'
                          : 'gamification-report-user-details-badges-tab__badge-card--not-earned'
                      ]"
                    >
                      <div
                        :class="[
                          'gamification-report-user-details-badges-tab__badge-icon',
                          badge.earned
                            ? 'gamification-report-user-details-badges-tab__badge-icon--earned'
                            : 'gamification-report-user-details-badges-tab__badge-icon--not-earned'
                        ]"
                      >
                        <img
                          v-if="getBadgeImage(normalizeBadge(badge))"
                          :src="getBadgeImage(normalizeBadge(badge))"
                          :alt="getBadgeDisplayName(badge)"
                          class="gamification-report-user-details-badges-tab__badge-img"
                          :style="{ filter: badge.earned ? 'none' : 'grayscale(1)' }"
                        />
                        <VIcon
                          v-else
                          :size="48"
                          :color="badge.earned ? '#2196F3' : '#757575'"
                        >
                          {{ getBadgeIcon(badge.badgeType ?? badge.type) }}
                        </VIcon>
                      </div>
                      <h3 class="gamification-report-user-details-badges-tab__badge-name">
                        {{ getBadgeDisplayName(badge) }}
                      </h3>
                      <p class="gamification-report-user-details-badges-tab__badge-status">
                        {{ getBadgeStatus(badge) }}
                      </p>
                    </div>
                  </template>
                  <span>{{ getTooltipContent(badge) }}</span>
                </VTooltip>
              </div>
            </template>
            <div
              v-else
              class="gamification-report-user-details-badges-tab__level-empty"
            >
              <span class="gamification-report-user-details-badges-tab__level-empty-text">
                No badges for this level
              </span>
            </div>
          </div>
        </ElTabPane>
      </ElTabs>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import usersDashboardBadgeMixin from '@/mixins/usersDashboardBadgeMixin'

export default {
  name: 'GamificationReportUserDetailsDrawerBadgesTab',
  mixins: [usersDashboardBadgeMixin],
  props: {
    selectedRow: { type: Object, required: true }
  },
  data() {
    return {
      activeLevelTab: '1'
    }
  },
  computed: {
    ...mapGetters({
      getAllBadgesForUser: 'gamificationBadges/getAllBadgesForUser',
      hasValidBadgesCache: 'gamificationBadges/hasValidCache',
      isBadgesCalculating: 'gamificationBadges/isCalculating',
      isBadgesFetching: 'gamificationBadges/isFetching',
      labels: 'usersDashboard/getLabels',
      language: 'usersDashboard/getLanguage'
    }),
    targetUserResourceId() {
      return this.selectedRow?.targetUserResourceId || this.selectedRow?.resourceId
    },
    allBadges() {
      const raw = this.getAllBadgesForUser(this.targetUserResourceId)
      return Array.isArray(raw) ? raw : []
    },
    isLoading() {
      if (!this.targetUserResourceId) return false
      const hasCache = this.hasValidBadgesCache(this.targetUserResourceId)
      return !hasCache && (this.isBadgesCalculating || this.isBadgesFetching)
    }
  },
  created() {
    this.ensureBadgesFetched()
  },
  methods: {
    ensureBadgesFetched() {
      if (!this.targetUserResourceId) return
      this.$store.dispatch('gamificationBadges/fetchBadgesForTable', [this.targetUserResourceId])
    },
    normalizeBadge(badge) {
      if (!badge) return {}
      return {
        name: badge.badgeName ?? badge.name,
        type: badge.badgeType ?? badge.type,
        level: badge.level,
        description: badge.description
      }
    },
    getBadgeKey(badge, index) {
      return `${badge?.badgeType ?? badge?.type ?? ''}-${badge?.level ?? 0}-${index}`
    },
    getBadgesByLevel(level) {
      return this.allBadges.filter((b) => (Number(b.level) || 1) === level)
    },
    getTooltipContent(badge) {
      const desc = this.getBadgeDescription(this.normalizeBadge(badge))
      if (desc) return desc
      return this.getBadgeDisplayName(badge) || ''
    },
    getBadgeDisplayName(badge) {
      const normalized = this.normalizeBadge(badge)
      try {
        const name = this.getBadgeName(normalized)
        return name || badge.badgeName || badge.name || ''
      } catch {
        return badge.badgeName || badge.name || ''
      }
    },
    getBadgeStatus(badge) {
      if (badge.earned) {
        const date = badge.earnedDate || badge.earnedOn || badge.earnedAt || badge.createdAt || badge.earned_at || badge.dateEarned
        const formatted = this.formatBadgeEarnedDate(date)
        if (!formatted) return this.labels?.yourBadgesEarned ?? 'Earned'
        return this.labels?.yourBadgesEarnedOn?.(formatted) ?? `Earned on ${formatted}`
      }
      return this.labels?.yourBadgesNotEarnedYet ?? 'Not earned yet'
    },
    formatBadgeEarnedDate(dateString) {
      if (!dateString) return ''
      try {
        let date = new Date(dateString)
        if (isNaN(date.getTime())) {
          const match = String(dateString).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/)
          if (match) {
            const day = parseInt(match[1], 10)
            const month = parseInt(match[2], 10) - 1
            const year = parseInt(match[3], 10)
            const hour = parseInt(match[4], 10) || 0
            const min = parseInt(match[5], 10) || 0
            date = new Date(year, month, day, hour, min)
          }
        }
        if (isNaN(date.getTime())) return ''
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
      } catch {
        return ''
      }
    }
  }
}
</script>

<style scoped>
.gamification-report-user-details-badges-tab__grid-item .v-tooltip {
  display: block;
}

::v-deep .v-tooltip__content {
  max-width: 300px;
}
</style>
