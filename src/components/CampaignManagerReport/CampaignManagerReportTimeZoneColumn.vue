<template>
  <div class="d-flex">
    <div class="d-flex flex-column">
      <span>{{ scope.row[timeKey] }}</span>
      <span style="font-size: 9px; line-height: 12px;">{{
        scope.row[localTimeKey] || scope.row[timeKey]
      }}</span>
    </div>
    <v-tooltip v-if="isToBeSent" right opacity="1">
      <template #activator="{ on }">
        <v-icon v-on="on" small class="ml-1" color="#B6791D">mdi-update</v-icon>
      </template>
      <span> To be sent </span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: 'CampaignManagerReportTimeZoneColumn',
  props: {
    scope: {
      type: Object
    },
    isToBeSent: {
      type: Boolean,
      default: false
    },
    timeKey: {
      type: String
    },
    localTimeKey: {
      type: String
    }
  }
}
</script>
