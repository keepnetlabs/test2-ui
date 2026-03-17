<template>
  <div v-if="col.type === 'status'">
    <v-btn style="display: none;"> </v-btn>
    <v-tooltip v-if="shouldRenderTooltip" bottom opacity="1" max-width="200px">
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
      <span>{{ getStatusTooltipText(scope.row[col.property]) }}</span>
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
