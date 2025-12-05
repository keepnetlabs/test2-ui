<template>
  <VCard class="users-dashboard-phishing-test-results">
    <div class="users-dashboard-phishing-test-results__header">
      <h2
        id="text--users-dashboard-phishing-test-results-title"
        class="users-dashboard-phishing-test-results__title"
      >
        {{ labels.phishingTestResultsTitle }}
      </h2>
      <p
        id="text--users-dashboard-phishing-test-results-subtitle"
        class="users-dashboard-phishing-test-results__subtitle"
      >
        {{ labels.phishingTestResultsSubtitle }}
      </p>
    </div>
    <div class="users-dashboard-phishing-test-results__content">
      <VRow>
        <VCol cols="12" md="4">
          <VCard
            class="users-dashboard-phishing-test-results__metric-card users-dashboard-phishing-test-results__metric-card--green"
          >
            <VCardText
              v-if="phishingResultLoading"
              class="users-dashboard-phishing-test-results__metric-content"
            >
              <v-skeleton-loader type="text, text" width="100" />
            </VCardText>
            <VCardText v-else class="users-dashboard-phishing-test-results__metric-content">
              <div class="users-dashboard-phishing-test-results__metric-header">
                <div class="users-dashboard-phishing-test-results__metric-label-wrapper">
                  <span class="users-dashboard-phishing-test-results__metric-label">
                    {{ labels.phishingTestResultsReportedPhishingEmails }}
                  </span>
                </div>
                <span class="users-dashboard-phishing-test-results__metric-value">
                  {{ phishingData.reportedPhishingEmails }}/{{ phishingData.totalPhishingEmails }}
                </span>
              </div>
              <div
                class="users-dashboard-phishing-test-results__metric-footer users-dashboard-phishing-test-results__metric-footer--green"
              >
                {{ labels.phishingTestResultsEarnedPoints(phishingData.earnedPoints) }}
              </div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="12" md="4">
          <VCard
            class="users-dashboard-phishing-test-results__metric-card users-dashboard-phishing-test-results__metric-card--red"
          >
            <VCardText
              v-if="phishingResultLoading"
              class="users-dashboard-phishing-test-results__metric-content"
            >
              <v-skeleton-loader type="text, text" width="100" />
            </VCardText>
            <VCardText v-else class="users-dashboard-phishing-test-results__metric-content">
              <div class="users-dashboard-phishing-test-results__metric-header">
                <span class="users-dashboard-phishing-test-results__metric-label">
                  {{ labels.phishingTestResultsPhishingSimulations }}
                </span>
                <span class="users-dashboard-phishing-test-results__metric-value">
                  {{ phishingData.phishingSimulations }}/{{ phishingData.totalSimulations }}
                </span>
              </div>
              <div
                class="users-dashboard-phishing-test-results__metric-footer users-dashboard-phishing-test-results__metric-footer--red"
              >
                {{ labels.phishingTestResultsLostPoints(phishingData.lostPoints) }}
              </div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="12" md="4">
          <VCard
            class="users-dashboard-phishing-test-results__metric-card users-dashboard-phishing-test-results__metric-card--gray"
          >
            <VCardText
              v-if="phishingResultLoading"
              class="users-dashboard-phishing-test-results__metric-content"
            >
              <v-skeleton-loader type="text, text" width="100" />
            </VCardText>
            <VCardText v-else class="users-dashboard-phishing-test-results__metric-content">
              <div class="users-dashboard-phishing-test-results__metric-header">
                <span class="users-dashboard-phishing-test-results__metric-label">
                  {{ labels.phishingTestResultsDetectionAccuracy }}
                </span>
                <span class="users-dashboard-phishing-test-results__metric-value">
                  {{ phishingData.detectionAccuracy }}%
                  {{ labels.phishingTestResultsSuccessRate }}
                </span>
              </div>
              <div
                class="users-dashboard-phishing-test-results__metric-footer users-dashboard-phishing-test-results__metric-footer--gray"
              >
                {{ labels.phishingTestResultsAccuracyUp(phishingData.accuracyIncrease) }}
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>
  </VCard>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'UsersDashboardPhishingTestResults',
  computed: {
    ...mapGetters({
      labels: 'usersDashboard/getLabels',
      phishingResult: 'usersDashboard/getPhishingResult',
      phishingResultLoading: 'usersDashboard/getPhishingResultLoading'
    }),
    phishingData() {
      if (!this.phishingResult) {
        return {
          reportedPhishingEmails: 0,
          totalPhishingEmails: 0,
          phishingSimulations: 0,
          totalSimulations: 0,
          detectionAccuracy: 0,
          earnedPoints: 0,
          lostPoints: 0,
          accuracyIncrease: 0
        }
      }

      const last30Days = this.phishingResult.last30Days || {}
      const totalCount = last30Days.totalCount || 0
      const reportedCount = last30Days.reportedCount || 0
      // phishingSimulations = total - reported (clicked/failed ones)
      const phishingSimulations = totalCount - reportedCount

      return {
        reportedPhishingEmails: reportedCount,
        totalPhishingEmails: totalCount,
        phishingSimulations: phishingSimulations,
        totalSimulations: totalCount,
        detectionAccuracy: this.phishingResult.successRate || 0,
        earnedPoints: last30Days.earnedPoints || 0,
        lostPoints: last30Days.missedPoints || 0,
        accuracyIncrease: this.phishingResult.accuracyChangePercentage || 0
      }
    }
  },
  created() {
    // Fetch phishing result data
    const targetUserResourceId = '4BCeEWHwAKME' // Static resource ID
    this.$store.dispatch('usersDashboard/fetchPhishingResult', targetUserResourceId)
  }
}
</script>
