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
    <span v-else class="leaderboard-badges-column__empty">—</span>
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
    /** Aynı tipte sadece en yüksek level - farklı tipleri önceliklendirmek için */
    uniqueByTypeBadges() {
      const badges = Array.isArray(this.badges) ? this.badges : []
      const byType = {}
      for (const badge of badges) {
        const type = badge.badgeType ?? badge.type
        const key = String(type)
        if (!byType[key] || (byType[key].level ?? 0) < (badge.level ?? 0)) {
          byType[key] = badge
        }
      }
      return Object.values(byType).sort((a, b) => (b.level ?? 0) - (a.level ?? 0))
    },
    /** Tabloda gösterilecek badge'ler: ≤3 ise hepsi, >3 ise farklı tiplerden ilk 3 */
    visibleBadges() {
      if (this.totalBadgeCount <= this.maxVisible) {
        return [...(this.badges || [])].sort((a, b) => (b.level ?? 0) - (a.level ?? 0))
      }
      return this.uniqueByTypeBadges.slice(0, this.maxVisible)
    },
    overflowCount() {
      return this.overflowBadges.length
    },
    /** Gizlenen tüm badge'ler: tabloda gösterilmeyenler */
    overflowBadges() {
      if (this.totalBadgeCount <= this.maxVisible) return []
      const original = Array.isArray(this.badges) ? this.badges : []
      const displayedTypes = this.visibleBadges.map((v) => String(v.badgeType ?? v.type))
      const overflow = []
      const seenPerType = {}
      for (const badge of original) {
        const type = String(badge.badgeType ?? badge.type)
        const level = badge.level ?? 0
        if (!displayedTypes.includes(type)) {
          overflow.push(badge)
          continue
        }
        const displayed = this.visibleBadges.find((v) => String(v.badgeType ?? v.type) === type)
        if (!displayed) continue
        const displayedLevel = displayed.level ?? 0
        if (level < displayedLevel) {
          overflow.push(badge)
        } else if (level === displayedLevel) {
          seenPerType[type] = (seenPerType[type] || 0) + 1
          if (seenPerType[type] > 1) overflow.push(badge)
        }
      }
      return overflow.sort((a, b) => (b.level ?? 0) - (a.level ?? 0))
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
