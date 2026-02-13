<template>
  <div class="leaderboard-badges-popover">
    <div class="leaderboard-badges-popover__header">
      <v-text-field
        v-model="searchQuery"
        placeholder="Search badges"
        outlined
        dense
        hide-details
        prepend-inner-icon="mdi-magnify"
        class="leaderboard-badges-popover__search-input"
      />
      <v-icon
        class="leaderboard-badges-popover__close-btn"
        size="20"
        @click="onClose && onClose()"
      >
        mdi-close
      </v-icon>
    </div>
    <div class="leaderboard-badges-popover__divider" />
    <div class="leaderboard-badges-popover__list">
      <div
        v-for="(badge, index) in filteredBadges"
        :key="getBadgeKey(badge, index)"
        class="leaderboard-badges-popover__item"
      >
        <span class="leaderboard-badges-popover__item-name">
          {{ badge.badgeName || badge.name }}
        </span>
        <span
          v-if="getBadgeLevel(badge) != null"
          class="leaderboard-badges-popover__item-level"
        >
          Level {{ getBadgeLevel(badge) }}
        </span>
      </div>
      <div
        v-if="filteredBadges.length === 0"
        class="leaderboard-badges-popover__empty"
      >
        No badges found
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeaderboardBadgesPopover',
  props: {
    badges: {
      type: Array,
      default: () => []
    },
    onClose: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      searchQuery: ''
    }
  },
  computed: {
    filteredBadges() {
      const badges = Array.isArray(this.badges) ? this.badges : []
      const query = (this.searchQuery || '').trim().toLowerCase()
      if (!query) return badges
      return badges.filter((b) => {
        const name = (b.badgeName || b.name || '').toLowerCase()
        const level = b.level ? `level ${b.level}` : ''
        return name.includes(query) || level.includes(query)
      })
    }
  },
  methods: {
    getBadgeKey(badge, index) {
      return `${badge?.badgeType ?? badge?.type ?? ''}-${badge?.level ?? 0}-${index}`
    },
    getBadgeLevel(badge) {
      const level = badge?.level ?? badge?.Level
      return level != null && level !== '' ? level : null
    }
  }
}
</script>
