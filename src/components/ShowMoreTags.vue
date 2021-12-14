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
          <Badge :listeners="on" size="small" :color="'#1173C1'" :text="`${badges[index - 1]}`" />
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
            size="mini"
            :color="'#1173C1'"
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
export default {
  name: 'ShowMoreTags',
  components: { Badge },
  props: {
    defaultBadges: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      badges: this.defaultBadges || [],
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
      return `${index}ab-${Math.random()}`
    },
    getBadges() {
      if (this.badges.length > 0) {
        let renderedCount = 0
        const maxWidth = 200
        let totalWidth = this.unRenderedBadgeCount ? maxWidth - 40 : maxWidth
        for (let item of this.badges) {
          let itemWidth = item.length * 8 + 8
          if (itemWidth > totalWidth) {
            break
          } else {
            renderedCount++
            totalWidth -= itemWidth
          }
        }

        this.maximumRenderedBadgeCount = renderedCount
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

<style lang="scss">
.show-more-tags {
  &__tooltip {
    white-space: pre-line;
    line-height: 1.6;
  }
  &__container {
    display: flex;
  }
  &__span {
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
