<template>
  <div class="show-more-tags">
    <div
      v-if="badges.length"
      class="small-badge__container show-more-tags__container"
      :style="[
        maximumRenderedBadgeCount === 0 && unRenderedBadgeCount > 0
          ? { justifyContent: 'center' }
          : ''
      ]"
    >
      <v-tooltip bottom :key="getKey(index)" v-for="index in (maximumRenderedBadgeCount)">
        <template v-slot:activator="{ on }">
          <v-btn style="display: none;"></v-btn>
          <Badge
            :listeners="on"
            size="small"
            :color="badgeColor"
            :text="`${getBadgeText(badges[index - 1])}`"
          />
        </template>
        <span class="tooltip-span">
          <slot name="status-tooltip-text">
            {{ badges[index - 1] }}
          </slot>
        </span>
      </v-tooltip>
      <v-tooltip bottom v-if="unRenderedBadgeCount > 0" content-class="show-more-tags__tooltip">
        <template v-slot:activator="{ on }">
          <v-btn style="display: none;"></v-btn>
          <Badge
            :listeners="on"
            size="small"
            :color="badgeColor"
            :text="`+${unRenderedBadgeCount}`"
          />
        </template>
        <span class="tooltip-span">
          <slot name="status-tooltip-text">
            {{ getTooltipText }}
          </slot>
        </span>
      </v-tooltip>
    </div>
    <span v-else> </span>
    <v-btn style="display: none;"></v-btn>
  </div>
</template>

<script>
import Badge from '@/components/Badge'
import { createRandomCryptStringNumber } from '@/utils/functions'
export default {
  name: 'ShowMoreTags',
  components: { Badge },
  props: {
    defaultBadges: {
      type: Array,
      default: () => []
    },
    badgeColor: {
      default: '#1173C1'
    },
    showMaximumBadgeCount: {
      type: Number
    }
  },
  data() {
    return {
      badges: this.defaultBadges.filter(Boolean) || [],
      maximumRenderedBadgeWidth: null,
      maximumRenderedBadgeCount: 0,
      unRenderedBadgeCount: 0
    }
  },
  computed: {
    getTooltipText() {
      const unRenderedBadges = this.badges.slice(this.maximumRenderedBadgeCount, this.badges.length)
      return unRenderedBadges.reduce((acc, item) => {
        acc += `${item}\n`
        return acc
      }, '')
    }
  },
  created() {
    this.getBadges()
  },
  methods: {
    getKey(index) {
      return `${index}ab-${createRandomCryptStringNumber()}`
    },
    getBadgeText(text = '') {
      if (text.length > 25) {
        return text.slice(0, 25) + '...'
      }
      return text
    },
    getBadges() {
      if (this.badges.length > 0) {
        let renderedCount = 0
        const maxWidth = 200
        let totalWidth = this.unRenderedBadgeCount ? maxWidth - 40 : maxWidth
        for (let item of this.badges) {
          let itemWidth = item.length * 8 + 10
          if (itemWidth > totalWidth) {
            break
          } else {
            renderedCount++
            totalWidth -= itemWidth
          }
        }

        this.maximumRenderedBadgeCount = this.showMaximumBadgeCount
          ? Math.min(this.showMaximumBadgeCount, renderedCount)
          : renderedCount
        if (this.maximumRenderedBadgeCount > this.badges.length) {
          this.maximumRenderedBadgeCount = this.badges.length
        }
        if (this.maximumRenderedBadgeCount < 0) {
          this.maximumRenderedBadgeCount = 0
        }

        this.unRenderedBadgeCount = this.badges.length - this.maximumRenderedBadgeCount
        if (this.maximumRenderedBadgeCount === 0) {
          if (maxWidth > 100) {
            this.maximumRenderedBadgeCount = 1
            this.unRenderedBadgeCount -= 1
          }
        }
      }
    }
  }
}
</script>
