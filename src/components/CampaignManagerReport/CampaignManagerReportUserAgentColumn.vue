<template>
  <span>
    <v-tooltip v-if="isRenderTooltip" bottom max-width="180" nudge-bottom="4" nudge-left="80">
      <template #activator="{ on }">
        <v-icon
          v-on="on"
          style="margin-top: -3px; font-size: 20px; margin-right: 2px;"
          color="#B6791D"
          >mdi-information</v-icon
        >
      </template>
      <span>Unusual User Agent: This user had no interaction with the email.</span>
    </v-tooltip>
    {{ scope.row.userAgent }}
  </span>
</template>

<script>
import { UNUSUAL_TYPES } from '@/components/CampaignManagerReport/Opened/utils'

export default {
  name: 'CampaignManagerReportUserAgentColumn',
  props: {
    scope: {
      type: Object
    }
  },
  computed: {
    isRenderTooltip() {
      if (!this.scope?.row?.sandBoxType) return false
      const binaryArray = this.scope.row.sandBoxType.toString(2).split('').reverse().join('')
      return [binaryArray[UNUSUAL_TYPES.USER_AGENT]].includes('1')
    }
  }
}
</script>
