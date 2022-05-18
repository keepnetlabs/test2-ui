<template>
  <div>
    <widgets :permissions="permissions" />
  </div>
</template>

<script>
import Widgets from '@/views/Widgets'
import { mapGetters } from 'vuex'
export default {
  components: {
    Widgets
  },
  computed: {
    ...mapGetters({
      permissions: 'permissions/getWidgetsPermissions'
    })
  },
  beforeRouteLeave(to, from, next) {
    this.$tours['tourDashboard'].finish()
    next()
  }
}
</script>
