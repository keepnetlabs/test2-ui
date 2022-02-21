<template>
  <div class="target-users" id="target-users">
    <v-layout wrap class="target-users__container">
      <v-card class="target-users__container-card">
        <show-all-jobs-inline></show-all-jobs-inline>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
import ShowAllJobsInline from '@/components/TargetUsers/ShowAllJobs'
export default {
  name: 'ShowAllJobs',
  components: { ShowAllJobsInline }
}
</script>

<style lang="scss">
.target-users {
  min-height: 80vh !important;
  padding-top: 10px;
  &__container {
    padding: 0px 16px 24px 16px !important;
    width: 100%;
    &-card {
      box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;
      padding: 10px 24px 0 24px !important;
      border-radius: 20px !important;
      width: 100%;
    }
  }
}
</style>
