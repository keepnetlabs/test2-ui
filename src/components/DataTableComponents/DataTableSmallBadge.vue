<template>
  <div class="small-badge">
    <div
      v-if="scope.row && scope.row[col.property]"
      class="small-badge__container"
      :style="[
        maximumRenderedBadgeCount === 0 && unRenderedBadgeCount > 0 ? { textAlign: 'center' } : ''
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
      <v-tooltip bottom v-if="unRenderedBadgeCount > 0">
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
    const stringBadges = this.scope.row[this.col.property]
    if (stringBadges && stringBadges.charAt(stringBadges.length - 1) === ',') {
      this.badges = stringBadges.substring(0, stringBadges.length - 1).split(',')
      this.getBadges()
    }
  },

  methods: {
    getKey(index) {
      return `${index}ab-${Math.random()}`
    },
    getBadges() {
      const stringBadges = this.scope.row[this.col.property]
      if (stringBadges && stringBadges.charAt(stringBadges.length - 1) === ',') {
        this.badges = stringBadges.substring(0, stringBadges.length - 1).split(',')
        console.log('this.scope.column.width ', this.scope.column.width)
        console.log('this.scope.column.realWidth ', this.scope.column.realWidth)
        if (this.unRenderedBadgeCount > 0) {
          const totalWidth = this.scope.column.width - 35
          this.maximumRenderedBadgeCount = Math.floor(totalWidth / 65)
        } else {
          this.maximumRenderedBadgeCount = Math.floor(this.scope.column.width / 65)
        }
        if (this.maximumRenderedBadgeCount > this.badges.length) {
          this.maximumRenderedBadgeCount = this.badges.length
        }
        this.unRenderedBadgeCount = this.badges.length - this.maximumRenderedBadgeCount
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
