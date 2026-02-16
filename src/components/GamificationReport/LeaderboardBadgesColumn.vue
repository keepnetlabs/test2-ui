<template>
  <div class="leaderboard-badges-column">
    <div v-if="isLoading" class="leaderboard-badges-column__skeleton">
      <div
        v-for="n in 3"
        :key="`skeleton-${n}`"
        class="leaderboard-badges-column__skeleton-item"
      />
    </div>
    <div
      v-else-if="visibleBadges.length"
      class="leaderboard-badges-column__container"
    >
      <v-tooltip
        v-for="(badge, index) in visibleBadges"
        :key="getBadgeKey(badge, index)"
        bottom
      >
        <template #activator="{ on }">
          <div
            v-on="on"
            class="leaderboard-badges-column__badge"
          >
            <slot name="badge" :badge="badge" :index="index">
              <img
                v-if="getBadgeImage(normalizeBadgeForMixin(badge))"
                :src="getBadgeImage(normalizeBadgeForMixin(badge))"
                :alt="badge.badgeName || badge.name"
                class="leaderboard-badges-column__badge-img"
              />
              <span v-else class="leaderboard-badges-column__badge-placeholder">
                {{ getBadgeFallbackText(badge) }}
              </span>
            </slot>
          </div>
        </template>
        <span>{{ badge.badgeName || badge.name || '' }}</span>
      </v-tooltip>
      <v-menu
        v-if="overflowCount > 0"
        v-model="isBadgesPopoverOpen"
        offset-x
        offset-y
        nudge-left="8"
        :close-on-content-click="false"
        content-class="leaderboard-badges-column__popover"
      >
        <template #activator="{ on, attrs }">
          <span
            v-bind="attrs"
            v-on="on"
            class="leaderboard-badges-column__overflow"
          >
            +{{ overflowCount }} badges
          </span>
        </template>
        <LeaderboardBadgesPopover
          :badges="overflowBadges"
          :on-close="handleCloseBadgesPopover"
        />
      </v-menu>
    </div>
  </div>
</template>

<script>
import usersDashboardBadgeMixin from '@/mixins/usersDashboardBadgeMixin'
import LeaderboardBadgesPopover from './LeaderboardBadgesPopover'

export default {
  name: 'LeaderboardBadgesColumn',
  components: { LeaderboardBadgesPopover },
  mixins: [usersDashboardBadgeMixin],
  data() {
    return {
      isBadgesPopoverOpen: false
    }
  },
  props: {
    badges: {
      type: Array,
      default: () => []
    },
    maxVisible: {
      type: Number,
      default: 3
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    /** Toplam badge sayısı */
    totalBadgeCount() {
      return Array.isArray(this.badges) ? this.badges.length : 0
    },
    /** Tabloda gösterilecek badge'ler: her zaman min(3, total) badge göster. ≤3 ise hepsi, >3 ise level'a göre ilk 3 */
    visibleBadges() {
      const sorted = [...(this.badges || [])].sort((a, b) => (b.level ?? 0) - (a.level ?? 0))
      if (this.totalBadgeCount <= this.maxVisible) {
        return sorted
      }
      return sorted.slice(0, this.maxVisible)
    },
    overflowCount() {
      return this.overflowBadges.length
    },
    /** Gizlenen tüm badge'ler: tabloda gösterilmeyenler */
    overflowBadges() {
      if (this.totalBadgeCount <= this.maxVisible) return []
      const sorted = [...(this.badges || [])].sort((a, b) => (b.level ?? 0) - (a.level ?? 0))
      return sorted.slice(this.maxVisible)
    },
    overflowTooltipText() {
      if (this.overflowCount <= 0) return ''
      return this.overflowBadges.map((b) => this.getBadgeTooltipText(b)).join(', ')
    }
  },
  methods: {
    normalizeBadgeForMixin(badge) {
      if (!badge) return {}
      return {
        name: badge.badgeName ?? badge.name,
        type: badge.badgeType ?? badge.type,
        level: badge.level
      }
    },
    getBadgeKey(badge, index) {
      return `${badge?.badgeType ?? badge?.type ?? ''}-${badge?.level ?? 0}-${index}`
    },
    getBadgeFallbackText(badge) {
      if (!badge) return '?'
      return badge.badgeName ?? badge.name ?? badge.text ?? '•'
    },
    getBadgeTooltipText(badge) {
      if (!badge) return ''
      return badge.description ?? badge.badgeName ?? badge.name ?? ''
    },
    handleCloseBadgesPopover() {
      this.isBadgesPopoverOpen = false
    }
  }
}
</script>
