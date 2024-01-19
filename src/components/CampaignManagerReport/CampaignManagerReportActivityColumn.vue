<template>
  <span>
    {{ scope.row.activityType }}
    <v-tooltip v-if="isRenderTooltip" bottom max-width="180">
      <template #activator="{ on }">
        <v-icon
          v-on="on"
          style="margin-top: 0; font-size: 20px; margin-right: 2px;"
          :color="isChangedActivityAndActivityHuman ? '#757575' : '#B6791D'"
          >mdi-information</v-icon
        >
      </template>
      <span>{{ tooltipText }}</span>
    </v-tooltip>
  </span>
</template>

<script>
import { ACTIVITY_TYPES } from '@/components/CampaignManagerReport/Opened/utils'

export default {
  name: 'CampaignManagerReportActivityColumn',
  props: {
    scope: {
      type: Object
    },
    tooltipText: {
      type: String,
      default: 'Sandbox activities are displayed in the details list'
    }
  },
  computed: {
    isRenderTooltip() {
      return (
        this.scope?.row?.activityType === ACTIVITY_TYPES.SYSTEM ||
        this.isChangedActivityAndActivityHuman
      )
    },
    isChangedActivityAndActivityHuman() {
      return (
        this.scope?.row?.activityType === ACTIVITY_TYPES.HUMAN && this.scope.row.isChangedActivity
      )
    }
  }
}
</script>
