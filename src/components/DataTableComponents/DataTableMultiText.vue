<template>
  <div class="small-badge data-table-multi-text">
    <v-btn style="display: none;"></v-btn>
    <div
      v-if="scope.row && scope.row[col.property]"
      class="small-badge__container"
      :style="[
        maximumRenderedBadgeCount === 0 && unRenderedBadgeCount > 0 ? { textAlign: '' } : ''
      ]"
      ref="refSmallBadgeContainer"
    >
      <badge
        v-for="index in (maximumRenderedBadgeCount)"
        v-bind="col.props"
        :key="getKey(index)"
        outline
        hide-border
        size="small"
        :text="`${badges[index - 1]}${
          index < maximumRenderedBadgeCount || unRenderedBadgeCount > 0 ? ', ' : ''
        }`"
      />
      <v-tooltip bottom v-if="unRenderedBadgeCount > 0" :key="getKey(Math.random())">
        <template v-slot:activator="{ on }">
          <badge
            :full-width="col.fullWidth"
            :listeners="on"
            outline
            hide-border
            className="data-table-multi-text-tooltip"
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
import { createRandomCryptStringNumber } from '@/utils/functions'

export default {
  name: 'DataTableMultiText',
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
      const unRenderedBadges = this.badges
        .slice(this.maximumRenderedBadgeCount, this.badges.length)
        .filter(Boolean)
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
    if (badges && badges.length) {
      this.getBadges()
    }
  },

  methods: {
    getKey(index) {
      return `${index}ab-${createRandomCryptStringNumber()}`
    },
    getBadges() {
      const item = this.scope.row[this.col.property] || []
      const badges = typeof item === 'string' ? [item] : item.filter(Boolean) || []
      const width = this.scope.column.width
      if (this.checkIsChanged(badges, width)) {
        this.width = width
        this.badges = badges
        let totalWidth = Math.floor(this.width)
        let maximumRenderedBadgeCount = 0
        for (let text of this.badges) {
          let multiplyBy = this.getMultiplyBy(text)
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
      } else if (!badges?.length) {
        this.badges = []
        this.unRenderedBadgeCount = 0
        this.maximumRenderedBadgeCount = 0
      }
    },
    checkIsChanged(badges, width) {
      return (
        badges &&
        badges.length &&
        (width !== this.width || JSON.stringify(badges) !== JSON.stringify(this.badges))
      )
    },
    getMultiplyBy(text = '') {
      if (text.length > 15) return 5
      else if (text.length > 5) return 6
      else if (text.length < 3) return 8
      else return 8
    }
  }
}
</script>
