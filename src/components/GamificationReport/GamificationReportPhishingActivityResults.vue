<template>
  <div class="gamification-report-phishing-activity-results">
    <div class="gamification-report-phishing-activity-results__header">
      <h2 class="gamification-report-phishing-activity-results__title">
        Phishing Activity Results
      </h2>
      <p class="gamification-report-phishing-activity-results__subtitle">
        An overview of phishing activity results for {{ selectedRow.firstName }}
        {{ selectedRow.lastName }}.
      </p>
    </div>
    <div class="gamification-report-phishing-activity-results__content">
      <div class="gamification-report-phishing-activity-results__cards">
        <div
          class="gamification-report-phishing-activity-results__card gamification-report-phishing-activity-results__card--green"
        >
          <div v-if="isLoading" class="gamification-report-phishing-activity-results__card-content">
            <v-skeleton-loader type="text, text" width="100" />
          </div>
          <div v-else class="gamification-report-phishing-activity-results__card-content">
            <div class="gamification-report-phishing-activity-results__metric-header">
              <span class="gamification-report-phishing-activity-results__metric-label">
                Reported Phishing Emails:
              </span>
              <span class="gamification-report-phishing-activity-results__metric-value">
                {{ phishingData.reportedPhishingEmails }}/{{ phishingData.totalPhishingEmails }}
              </span>
            </div>
            <div class="gamification-report-phishing-activity-results__metric-footer gamification-report-phishing-activity-results__metric-footer--green">
              {{ earnedPointsText.before }}
              <span v-if="earnedPointsText.points" class="gamification-report-phishing-activity-results__metric-footer-points gamification-report-phishing-activity-results__metric-footer-points--green">
                {{ earnedPointsText.points }}
              </span>
              {{ earnedPointsText.after }}
            </div>
          </div>
        </div>
        <div
          class="gamification-report-phishing-activity-results__card gamification-report-phishing-activity-results__card--red"
        >
          <div v-if="isLoading" class="gamification-report-phishing-activity-results__card-content">
            <v-skeleton-loader type="text, text" width="100" />
          </div>
          <div v-else class="gamification-report-phishing-activity-results__card-content">
            <div class="gamification-report-phishing-activity-results__metric-header">
              <span class="gamification-report-phishing-activity-results__metric-label">
                Phishing Simulations:
              </span>
              <span class="gamification-report-phishing-activity-results__metric-value">
                {{ phishingData.phishingSimulations }}/{{ phishingData.totalSimulations }}
              </span>
            </div>
            <div class="gamification-report-phishing-activity-results__metric-footer gamification-report-phishing-activity-results__metric-footer--red">
              {{ lostPointsText.before }}
              <span v-if="lostPointsText.points" class="gamification-report-phishing-activity-results__metric-footer-points gamification-report-phishing-activity-results__metric-footer-points--red">
                {{ lostPointsText.points }}
              </span>
              {{ lostPointsText.after }}
            </div>
          </div>
        </div>
        <div
          class="gamification-report-phishing-activity-results__card gamification-report-phishing-activity-results__card--gray"
        >
          <div v-if="isLoading" class="gamification-report-phishing-activity-results__card-content">
            <v-skeleton-loader type="text, text" width="100" />
          </div>
          <div v-else class="gamification-report-phishing-activity-results__card-content">
            <div class="gamification-report-phishing-activity-results__metric-header">
              <span class="gamification-report-phishing-activity-results__metric-label">
                Detection Accuracy:
              </span>
              <span class="gamification-report-phishing-activity-results__metric-value">
                {{ phishingData.detectionAccuracy }}% success rate
              </span>
            </div>
            <div class="gamification-report-phishing-activity-results__metric-footer gamification-report-phishing-activity-results__metric-footer--gray">
              {{ accuracyText }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getGamificationPhishingResult } from '@/api/reports'

export default {
  name: 'GamificationReportPhishingActivityResults',
  props: {
    selectedRow: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isLoading: false,
      phishingResult: null
    }
  },
  computed: {
    targetUserResourceId() {
      return this.selectedRow?.targetUserResourceId || this.selectedRow?.resourceId
    },
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

      const last30Days = this.phishingResult.last30Days || this.phishingResult || {}
      const totalCount = last30Days.totalCount ?? last30Days.totalPhishingEmails ?? 0
      const reportedCount = last30Days.reportedCount ?? last30Days.reportedPhishingEmails ?? 0
      const phishingSimulations = totalCount - reportedCount

      return {
        reportedPhishingEmails: reportedCount,
        totalPhishingEmails: totalCount,
        phishingSimulations,
        totalSimulations: totalCount,
        detectionAccuracy: this.phishingResult.successRate ?? this.phishingResult.detectionAccuracy ?? 0,
        earnedPoints: last30Days.earnedPoints ?? 0,
        lostPoints: last30Days.missedPoints ?? last30Days.lostPoints ?? 0,
        accuracyIncrease: this.phishingResult.accuracyChangePercentage ?? this.phishingResult.accuracyIncrease ?? 0
      }
    },
    earnedPointsText() {
      const points = this.phishingData.earnedPoints
      const name = this.selectedRow?.firstName || 'The user'
      if (points === 0) {
        return { before: `${name} has not earned any points for reported emails yet.`, points: '', after: '' }
      }
      return {
        before: `${name} earned `,
        points: `+${points} points`,
        after: ' for reported emails.'
      }
    },
    lostPointsText() {
      const points = this.phishingData.lostPoints
      const name = this.selectedRow?.firstName || 'The user'
      if (points === 0) {
        return { before: 'No points lost for missed reported emails.', points: '', after: '' }
      }
      return {
        before: `${name} lost `,
        points: `-${points} points`,
        after: ' for missed reported emails.'
      }
    },
    accuracyText() {
      const percentage = this.phishingData.accuracyIncrease
      const absPercentage = Math.abs(percentage)
      const name = this.selectedRow?.firstName || 'The user'
      if (percentage < 0) {
        return `${name}'s detection accuracy decreased by ${absPercentage}% from last month.`
      }
      if (percentage > 0) {
        return `${name}'s detection accuracy increased by ${absPercentage}% from last month.`
      }
      return `Detection accuracy unchanged from last month.`
    }
  },
  watch: {
    targetUserResourceId: {
      immediate: true,
      handler(id) {
        if (id) this.fetchPhishingResult()
      }
    }
  },
  methods: {
    async fetchPhishingResult() {
      if (!this.targetUserResourceId) return
      this.isLoading = true
      this.phishingResult = null
      try {
        const { data } = await getGamificationPhishingResult(this.targetUserResourceId)
        this.phishingResult = data?.data ?? data ?? null
      } catch {
        this.phishingResult = null
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
