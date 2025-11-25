<template>
  <div class="users-dashboard">
    <UsersDashboardHeader />
    <v-container fluid class="users-dashboard__container">
      <div class="users-dashboard__welcome-section">
        <h1 class="users-dashboard__title">
          {{ welcomeTitle }}
        </h1>
        <p class="users-dashboard__description">
          {{ welcomeDescription }}
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
      <v-row>
        <VCol cols="12">
          <UsersDashboardYourLearning />
        </VCol>
      </v-row>
      <v-row>
        <VCol cols="12">
          <UsersDashboardPhishingTestResults />
        </VCol>
      </v-row>
      <v-row>
        <VCol cols="12">
          <UsersDashboardLeaderboard />
        </VCol>
      </v-row>
      <v-row>
        <VCol cols="12">
          <UsersDashboardActivityTimeline />
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
import UsersDashboardPhishingTestResults from '@/components/UsersDashboard/UsersDashboardPhishingTestResults'
import UsersDashboardYourLearning from '@/components/UsersDashboard/UsersDashboardYourLearning'
import UsersDashboardLeaderboard from '@/components/UsersDashboard/UsersDashboardLeaderboard'
import UsersDashboardActivityTimeline from '@/components/UsersDashboard/UsersDashboardActivityTimeline'

export default {
  name: 'UsersDashboard',
  components: {
    UsersDashboardHeader,
    UsersDashboardOverallPerformance,
    UsersDashboardRecentBadges,
    UsersDashboardPhishingTestResults,
    UsersDashboardYourLearning,
    UsersDashboardLeaderboard,
    UsersDashboardActivityTimeline
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'usersDashboard/isAuthenticated',
      companyEmail: 'usersDashboard/getCompanyEmail',
      loginMethod: 'usersDashboard/getLoginMethod',
      userInfo: 'usersDashboard/getUserInfo',
      labels: 'usersDashboard/getLabels'
    }),
    welcomeTitle() {
      return this.labels.welcomeTitle(this.userInfo.name || 'User')
    },
    welcomeDescription() {
      return this.labels.welcomeDescription
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
      name: 'John Doe',
      email: 'john@example.com',
      department: 'Management',
      phoneNumber: '+15555555555',
      preferredLanguage: ''
    })
  },
  methods: {
    ...mapActions({
      logout: 'usersDashboard/logout'
    })
  }
}
</script>
