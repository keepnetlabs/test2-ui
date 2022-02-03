<template>
  <div>
    <widgets />
  </div>
</template>

<script>
import Widgets from '@/views/Widgets'
export default {
  components: {
    Widgets
  },
  beforeRouteLeave(to, from, next) {
    this.$tours['tourDashboard'].finish()
    next()
  }
}
</script>
