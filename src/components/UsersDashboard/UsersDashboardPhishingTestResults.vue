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
            <VCardText class="users-dashboard-phishing-test-results__metric-content">
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
            <VCardText class="users-dashboard-phishing-test-results__metric-content">
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
            <VCardText class="users-dashboard-phishing-test-results__metric-content">
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
      labels: 'usersDashboard/getLabels'
    })
  },
  data() {
    return {
      // TODO: Replace with actual API data
      phishingData: {
        reportedPhishingEmails: 46,
        totalPhishingEmails: 50,
        phishingSimulations: 4,
        totalSimulations: 50,
        detectionAccuracy: 92,
        earnedPoints: 1250,
        lostPoints: 500,
        accuracyIncrease: 14
      }
    }
  },
  created() {
    // Simulate API call
    this.fetchPhishingTestResults()
  },
  methods: {
    fetchPhishingTestResults() {
      // TODO: Replace with actual API call
      // Example:
      // getPhishingTestResults().then((response) => {
      //   this.phishingData = response.data
      // })
    }
  }
}
</script>
