<template>
  <div class="users-dashboard">
    <UsersDashboardHeader />
    <v-container fluid class="users-dashboard__container">
      <div class="users-dashboard__welcome-section">
        <h1 class="users-dashboard__title">
          {{ welcomeTitle }}
        </h1>
        <p class="users-dashboard__description">
          Track your progress and see how your actions strengthen our security culture.
        </p>
      </div>
      <v-row>
        <VCol cols="12" md="6">
          <UsersDashboardOverallPerformance />
        </VCol>
        <VCol cols="12" md="6">
          <UsersDashboardRecentBadges />
        </VCol>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import UsersDashboardHeader from '@/components/UsersDashboard/UsersDashboardHeader'
import UsersDashboardOverallPerformance from '@/components/UsersDashboard/UsersDashboardOverallPerformance'
import UsersDashboardRecentBadges from '@/components/UsersDashboard/UsersDashboardRecentBadges'

export default {
  name: 'UsersDashboard',
  components: {
    UsersDashboardHeader,
    UsersDashboardOverallPerformance,
    UsersDashboardRecentBadges
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'usersDashboard/isAuthenticated',
      companyEmail: 'usersDashboard/getCompanyEmail',
      loginMethod: 'usersDashboard/getLoginMethod',
      userInfo: 'usersDashboard/getUserInfo'
    }),
    welcomeTitle() {
      const userName = this.userInfo.name || 'User'
      return `${userName}, Welcome to Your Security Growth Dashboard!`
    }
  },
  created() {
    // Initialize from storage
    this.$store.dispatch('usersDashboard/initializeFromStorage')
    // Get whitelabel info
    this.$store.dispatch('login/getWhiteLabelByUrl')
    // Check if authenticated
    if (!this.isAuthenticated) {
      this.$router.push('/users-dashboard-login')
    }
    // TODO: Fetch user info from API
    // For now, set mock data
    this.$store.dispatch('usersDashboard/setUserInfo', {
      name: 'John Duran',
      department: 'IT'
    })
  },
  methods: {
    ...mapActions({
      logout: 'usersDashboard/logout'
    })
  }
}
</script>
