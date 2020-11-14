<template>
  <div class="small-badge">
    <v-btn style="display: none;"></v-btn>
    <div
      v-if="scope.row && scope.row[col.property]"
      class="small-badge__container"
      :style="[
        maximumRenderedBadgeCount === 0 && unRenderedBadgeCount > 0 ? { textAlign: '' } : ''
      ]"
      ref="refSmallBadgeContainer"
    >
      <v-tooltip bottom :key="getKey(index)" v-for="index in (maximumRenderedBadgeCount)">
        <template v-slot:activator="{ on }">
          <badge
            :color="'#2196f3'"
            :listeners="on"
            :full-width="col.fullWidth"
            v-bind="col.props"
            size="small"
            :text="badges[index - 1]"
          />
        </template>
        <span class="tooltip-span">
          <slot name="status-tooltip-text" :scope="scope" :col="col">
            {{ badges[index - 1] }}
          </slot>
        </span>
      </v-tooltip>
      <v-tooltip bottom v-if="unRenderedBadgeCount > 0" :key="getKey(Math.random())">
        <template v-slot:activator="{ on }">
          <badge
            :color="'#2196f3'"
            :full-width="col.fullWidth"
            :listeners="on"
            size="mini"
            :text="`+${unRenderedBadgeCount}`"
          />
        </template>
        <span class="tooltip-span">
          <slot name="status-tooltip-text" :scope="scope" :col="col">
            {{ getTooltipText }}
          </slot>
        </span>
      </v-tooltip>
    </div>
    <span v-else>
      {{ col.emptyText || '' }}
    </span>
  </div>
</template>

<script>
import Badge from '../Badge'

export default {
  name: 'DataTableSmallBadge',
  components: {
    badge: Badge
  },
  watch: {
    scope() {
      this.getBadges()
    }
  },
  data() {
    return {
      badges: [],
      maximumRenderedBadgeWidth: null,
      maximumRenderedBadgeCount: 0,
      unRenderedBadgeCount: 0,
      isDescending: false,
      width: null,
      isAscending: true
    }
  },
  computed: {
    getTooltipText() {
      const unRenderedBadges = this.badges.slice(this.maximumRenderedBadgeCount, this.badges.length)
      return unRenderedBadges.join(',')
    }
  },
  props: {
    scope: {
      type: Object
    },
    col: {
      type: Object
    }
  },
  created() {
    const badges = this.scope.row[this.col.property]
    if (badges.length) {
      this.getBadges()
    }
  },

  methods: {
    getKey(index) {
      return `${index}ab-${Math.random()}`
    },
    getBadges() {
      const badges = this.scope.row[this.col.property]
      const width = this.scope.column.width
      if (
        badges.length &&
        (width !== this.width || JSON.stringify(badges) !== JSON.stringify(this.badges))
      ) {
        this.width = width
        this.badges = badges
        let totalWidth = Math.floor(this.width) - 20

        let maximumRenderedBadgeCount = 0
        for (let text of this.badges) {
          let multiplyBy = text.length > 15 ? 7.5 : text.length > 5 ? 8 : 10
          const itemWidth = Math.floor(text.length * multiplyBy) + 5
          if (itemWidth > totalWidth) {
            break
          } else {
            totalWidth -= itemWidth
            maximumRenderedBadgeCount++
          }
        }
        this.maximumRenderedBadgeCount = maximumRenderedBadgeCount
        if (this.maximumRenderedBadgeCount > this.badges.length) {
          this.maximumRenderedBadgeCount = this.badges.length
        }
        this.unRenderedBadgeCount = this.badges.length - this.maximumRenderedBadgeCount
        if (this.unRenderedBadgeCount && totalWidth - 26 < 0) {
          this.maximumRenderedBadgeCount--
          this.unRenderedBadgeCount++
        }
      }
    }
  }
}
</script>

<style lang="scss">
.small-badge {
  &__container {
    .k-badge {
      margin-right: 5px;
    }
  }
}
</style>
