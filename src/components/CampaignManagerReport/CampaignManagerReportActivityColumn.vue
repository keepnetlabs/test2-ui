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
      <span>{{ getActivityTooltipText() }}</span>
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
      default: 'Bot activities are displayed in the details list'
    }
  },
  computed: {
    isRenderTooltip() {
      return (
        this.scope?.row?.activityType === ACTIVITY_TYPES.BOT ||
        this.isChangedActivityAndActivityHuman
      )
    },
    isChangedActivityAndActivityHuman() {
      return (
        this.scope?.row?.activityType === ACTIVITY_TYPES.HUMAN && this.scope.row.isChangedActivity
      )
    }
  },
  methods: {
    getActivityTooltipText() {
      if (
        this?.scope?.row?.activityType === ACTIVITY_TYPES.BOT &&
        this?.scope?.row?.sandBoxType === undefined
      ) {
        return 'Bot activities are displayed in the details list'
      }
      if (
        this?.scope?.row?.activityType === ACTIVITY_TYPES.HUMAN &&
        this?.scope?.row?.isChangedActivity
      )
        return 'Bot activity has been changed to human activity'
      if (this?.scope?.row?.sandBoxType === 1 || this?.scope?.row?.sandBoxType === 2) {
        return 'Bot Activity Rules: A1'
      }
      if (this?.scope?.row?.sandBoxType >= 16) {
        return 'Bot Activity Rules: A4.1'
      }
      if (this?.scope?.row?.sandBoxType >= 32) {
        return 'Bot Activity Rules: A4.2'
      }
      if (this?.scope?.row?.sandBoxType >= 8) {
        return 'Bot Activity Rules: A3'
      }
      return 'Bot Activity Rules: A2'
    }
  }
}
</script>
