<template>
  <KContainer tabless>
    <show-all-jobs-inline></show-all-jobs-inline>
  </KContainer>
</template>

<script>
import ShowAllJobsInline from '@/components/TargetUsers/ShowAllJobs'
import KContainer from '@/components/KContainer/KContainer'
export default {
  name: 'ShowAllJobs',
  components: { KContainer, ShowAllJobsInline }
}
</script>
