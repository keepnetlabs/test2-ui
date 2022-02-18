<template>
  <div v-if="col.type === 'status'">
    <v-btn style="display: none;"> </v-btn>
    <v-tooltip v-if="col.isWithTooltip" bottom opacity="1" max-width="200px">
      <template v-slot:activator="{ on }">
        <div v-on="on">
          <badge
            v-bind="col.props"
            v-if="shouldRenderBadge"
            :color="getBtnStatusColor(scope.row[col.property])"
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
        :color="getBtnStatusColor(scope.row[col.property])"
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
        scope.row && (scope.row['status'] || scope.row['difficultyName'] || scope.row['difficulty'])
      )
    },
    getBadgeText() {
      const { scope } = this.$props
      return this.getDataTableFieldLabel(
        scope.row.status || scope.row['difficultyName'] || scope.row['difficulty']
      )
    }
  },
  methods: {
    getBtnStatusColor(type) {
      return getBtnStatusColor(type)
    },
    getDataTableFieldLabel(field) {
      return getDataTableFieldLabel(field)
    },
    getStatusTooltipText(type) {
      return getInvestigationStatusTooltipText(type)
    }
  }
}
</script>
