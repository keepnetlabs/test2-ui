<template>
  <div v-if="col.type === 'status'">
    <v-btn style="display: none;"> </v-btn>
    <div v-if="isSkeletonLoading" class="blocklist-skeleton-wrapper">
      <div class="blocklist-skeleton-badge" />
    </div>
    <v-tooltip
      v-else-if="shouldRenderTooltip"
      bottom
      opacity="1"
      :max-width="tooltipMaxWidth"
    >
      <template v-slot:activator="{ on }">
        <div v-on="on">
          <badge
            v-bind="col.props"
            v-if="shouldRenderBadge"
            :color="getBadgeColor(scope.row[col.property])"
            :full-width="col.fullWidth"
            :text="getBadgeText"
          />
          <span v-else>
            {{ col.emptyText || '' }}
          </span>
        </div>
      </template>
      <span class="datatable-status-tooltip-text">{{ getStatusTooltipText(scope.row[col.property]) }}</span>
    </v-tooltip>
    <template v-else>
      <badge
        v-bind="col.props"
        v-if="shouldRenderBadge"
        :color="getBadgeColor(scope.row[col.property])"
        :full-width="col.fullWidth"
        :text="getBadgeText"
      />
      <span v-else>
        {{ col.emptyText || '' }}
      </span>
    </template>
  </div>
</template>

<script>
import {
  getBtnStatusColor,
  getDataTableFieldLabel,
  getInvestigationStatusTooltipText
} from '@/utils/functions'
import Badge from '@/components/Badge'
export default {
  name: 'DataTableStatus',
  components: {
    Badge
  },
  props: {
    scope: {
      type: Object
    },
    col: {
      type: Object
    }
  },
  computed: {
    isSkeletonLoading() {
      const value = String(this.scope.row[this.col.property] || '').trim().toLowerCase()
      return value === 'loading' && this.col.badgeColorMap && 'loading' in this.col.badgeColorMap
    },
    shouldRenderBadge() {
      const { scope } = this.$props
      return (
        scope.row &&
        (scope.row[this.col.property] || scope.row['difficultyName'] || scope.row['difficulty'])
      )
    },
    getBadgeText() {
      const { scope } = this.$props
      return this.getDataTableFieldLabel(
        scope.row[this.col.property] || scope.row['difficultyName'] || scope.row['difficulty']
      )
    },
    shouldRenderTooltip() {
      if (this.col.tooltipKey) return !!this.scope.row[this.col.tooltipKey]
      return this.col.isWithTooltip
    },
    tooltipMaxWidth() {
      return this.col.tooltipMaxWidth || "200px"
    }
  },
  methods: {
    getBadgeColor(type) {
      const normalizedType = String(type || '').trim().toLowerCase()
      const customBadgeColors = this.col?.badgeColorMap || {}
      return customBadgeColors[normalizedType] || getBtnStatusColor(type)
    },
    getBtnStatusColor(type) {
      return getBtnStatusColor(type)
    },
    getDataTableFieldLabel(field) {
      return getDataTableFieldLabel(field)
    },
    getStatusTooltipText(type) {
      return this.col.tooltipKey
        ? this.scope.row[this.col.tooltipKey]
        : getInvestigationStatusTooltipText(type)
    }
  }
}
</script>

<style scoped>
.blocklist-skeleton-wrapper {
  display: flex;
  justify-content: center;
}
.blocklist-skeleton-badge {
  width: 90px;
  height: 24px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e0e0e0 25%, #eeeeee 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite ease-in-out;
}
@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.datatable-status-tooltip-text {
  display: block;
  white-space: pre-wrap;
  text-align: left;
}
</style>

