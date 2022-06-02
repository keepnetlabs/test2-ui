<template>
  <div class="target-user-import-file__progression">
    <div class="target-user-import-file__progression--text">
      Please wait while we are processing the file
    </div>
    <v-alert dense outlined type="info" v-if="isIdle">
      Process is Queued
    </v-alert>
    <div class="target-user-import-file__progression--progress">
      <div class="mb-2">
        <v-progress-circular :size="25" color="primary" indeterminate />
      </div>
      <div>{{ getText }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TargetUserLDAPImportLoader',
  props: {
    processedUserCount: {
      type: Number,
      default: 0
    },
    isIdle: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getText() {
      const isEqualToZero = this.processedUserCount === 0
      return `${isEqualToZero ? 'No' : this.processedUserCount} user${
        isEqualToZero ? '' : 's'
      } processed`
    }
  }
}
</script>
