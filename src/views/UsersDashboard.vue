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
      <v-row>
        <VCol cols="12">
          <UsersDashboardYourCertificates />
        </VCol>
      </v-row>
      <v-row>
        <VCol cols="12">
          <UsersDashboardYourBadges />
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
import UsersDashboardYourCertificates from '@/components/UsersDashboard/UsersDashboardYourCertificates'
import UsersDashboardYourBadges from '@/components/UsersDashboard/UsersDashboardYourBadges'

export default {
  name: 'UsersDashboard',
  components: {
    UsersDashboardHeader,
    UsersDashboardOverallPerformance,
    UsersDashboardRecentBadges,
    UsersDashboardPhishingTestResults,
    UsersDashboardYourLearning,
    UsersDashboardLeaderboard,
    UsersDashboardActivityTimeline,
    UsersDashboardYourCertificates,
    UsersDashboardYourBadges
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
    // TEMPORARILY DISABLED: Allow access without login for development
    // Check if authenticated
    // if (!this.isAuthenticated) {
    //   this.$router.push('/users-dashboard-login')
    // }
    // Fetch top performance data (used by OverallPerformance and Leaderboard components)
    // This will also update userInfo with name, email, and department from API response
    const targetUserResourceId = this?.$route?.query?.targetUserResourceId || '4BCeEWHwAKME'
    // Fetch user info (email, department, phoneNumber, preferredLanguage)
    this.$store.dispatch('usersDashboard/fetchUserInfo', targetUserResourceId)
    this.$store.dispatch('usersDashboard/fetchTopPerformance', targetUserResourceId)
    // Fetch my learning data (used by YourLearning component)
    this.$store.dispatch('usersDashboard/fetchMyLearning', targetUserResourceId)
    // Fetch my certificates data (used by YourCertificates component)
    this.$store.dispatch('usersDashboard/fetchMyCertificates', targetUserResourceId)
  },
  methods: {
    ...mapActions({
      logout: 'usersDashboard/logout'
    })
  }
}
</script>
