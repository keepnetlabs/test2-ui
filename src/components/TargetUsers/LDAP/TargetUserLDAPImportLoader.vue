<template>
  <div class="target-user-import-file__progression">
    <div class="target-user-import-file__progression--text">
      Please wait while we are processing the file
    </div>
    <v-alert dense outlined type="info" v-if="isIdle">
      Process is Queued
    </v-alert>
    <div class="target-user-import-file__progression--progress">
      <div>{{ getProgressValue }}%</div>
      <div>
        <v-progress-linear :value="getProgressValue"></v-progress-linear>
      </div>
      <div>
        0/240 users processed
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TargetUserLDAPImportLoader',
  computed: {
    isIdle() {
      return false
    },
    getProgressValue() {
      return 50
    }
  }
}
</script>
