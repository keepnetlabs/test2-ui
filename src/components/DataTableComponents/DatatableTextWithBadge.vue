<template>
  <div class="data-table-text-with-badge">
    <div
      v-if="scope.row && scope.row[col.property]"
      class="small-badge__container data-table-text-with-badge__container"
      :style="[
        maximumRenderedBadgeCount === 0 && unRenderedBadgeCount > 0
          ? { justifyContent: 'center' }
          : ''
      ]"
    >
      <v-tooltip bottom :key="getKey(index)" v-for="index in (maximumRenderedBadgeCount)">
        <template v-slot:activator="{ on }">
          <span :listeners="on" class="data-table-text-with-badge__span">
            {{ badges[index - 1] }} {{ index !== maximumRenderedBadgeCount ? ' , ' : null }}
          </span>
        </template>
        <span class="tooltip-span">
          <slot name="status-tooltip-text" :scope="scope" :col="col">
            {{ badges[index - 1] }}
          </slot>
        </span>
      </v-tooltip>
      <v-tooltip
        bottom
        v-if="unRenderedBadgeCount > 0"
        content-class="data-table-text-with-badge__tooltip"
      >
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
  name: 'DatatableTextWithBadge',
  components: {
    badge: Badge
  },
  watch: {
    scope(val) {
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
      isAscending: true
    }
  },
  computed: {
    getTooltipText() {
      const unRenderedBadges = this.badges.slice(this.maximumRenderedBadgeCount, this.badges.length)
      const text = unRenderedBadges.reduce((acc, item, index) => {
        acc += `${item}\n`
        return acc
      }, '')
      return text
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
    this.badges = this.scope.row[this.col.property]
    this.getBadges()
  },

  methods: {
    getKey(index) {
      return `${index}ab-${Math.random()}`
    },
    getBadges() {
      if (this.badges.length > 0) {
        /*
        const textAverageWidth =
          this.badges.reduce((acc, item) => {
            return acc + item.length * 9
          }, 0) /
            this.badges.length +
          10
        let totalWidth
        */
        let renderedCount = 0
        let totalWidth = this.unRenderedBadgeCount
          ? this.scope.column.width - 40
          : this.scope.column.width
        for (let item of this.badges) {
          let itemWidth = item.length * 8 + this.col.cellPadding
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
          if (this.scope.column.width > 100) {
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
.data-table-text-with-badge {
  .k-badge {
    margin-left: 10px;
  }

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
