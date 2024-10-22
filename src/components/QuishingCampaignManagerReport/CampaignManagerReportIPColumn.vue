<template>
  <span>
    {{ scope.row.userIpAddressList }}
    <v-tooltip v-if="isRenderTooltip" bottom max-width="180" nudge-bottom="4" nudge-left="80">
      <template #activator="{ on }">
        <v-icon
          v-on="on"
          style="margin-top: -3px; font-size: 20px; margin-left: 2px;"
          color="#B6791D"
          >mdi-information</v-icon
        >
      </template>

      <span>A bot has clicked the Honeypot link. This user had no interaction with the email.</span>
    </v-tooltip>
  </span>
</template>

<script>
import { UNUSUAL_TYPES } from '@/components/QuishingCampaignManagerReport/Opened/utils'

export default {
  name: 'CampaignManagerReportIPColumn',
  props: {
    scope: {
      type: Object
    }
  },
  computed: {
    isRenderTooltip() {
      if (!this.scope?.row?.sandBoxType) return false
      const binaryArray = this.scope.row.sandBoxType.toString(2).split('').reverse().join('')
      return [binaryArray[UNUSUAL_TYPES.IP], binaryArray[UNUSUAL_TYPES.HONEYPOT]].includes('1')
    }
  }
}
</script>
