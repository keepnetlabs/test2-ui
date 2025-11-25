<template>
  <VCard class="users-dashboard-activity-timeline">
    <div class="users-dashboard-activity-timeline__header">
      <h2
        id="text--users-dashboard-activity-timeline-title"
        class="users-dashboard-activity-timeline__title"
      >
        {{ labels.activityTimelineTitle }}
      </h2>
      <p
        id="text--users-dashboard-activity-timeline-subtitle"
        class="users-dashboard-activity-timeline__subtitle"
      >
        {{ labels.activityTimelineSubtitle }}
      </p>
    </div>
    <div class="users-dashboard-activity-timeline__content">
      <div v-if="activities.length === 0" class="users-dashboard-activity-timeline__empty">
        <span class="users-dashboard-activity-timeline__empty-text">
          {{ labels.activityTimelineEmptyMessage }}
        </span>
      </div>
      <div v-else class="users-dashboard-activity-timeline__items">
        <div
          v-for="(activity, index) in activities"
          :key="index"
          class="users-dashboard-activity-timeline__item"
        >
          <div class="users-dashboard-activity-timeline__item-content">
            <div class="users-dashboard-activity-timeline__item-left">
              <div
                class="users-dashboard-activity-timeline__item-icon"
                :style="{ backgroundColor: getActivityColor(activity.status) }"
              >
                <VIcon :color="'#fff'" size="16">
                  {{ getActivityIcon(activity.status) }}
                </VIcon>
              </div>
              <div class="users-dashboard-activity-timeline__item-text">
                <span
                  class="users-dashboard-activity-timeline__item-status"
                  :style="{ color: getActivityColor(activity.status) }"
                >
                  {{ activity.status }}
                </span>
                <span class="users-dashboard-activity-timeline__item-description">
                  You
                  <strong>{{
                    activity.points > 0
                      ? labels.activityTimelineEarnedPoints(activity.points)
                      : labels.activityTimelineLostPoints(Math.abs(activity.points))
                  }}</strong>
                  {{ labels.activityTimelineInCampaign }}
                  <strong>{{ activity.campaignName }}</strong>
                  {{ labels.activityTimelinePhishingCampaign }}
                  {{ labels.activityTimelineAtDifficulty }}
                  <strong>{{ getDifficultyLabel(activity.difficulty) }}</strong>
                  {{ labels.activityTimelineDifficulty }},
                  {{ labels.activityTimelineWithPerformance }}
                  <strong>{{ activity.campaignPerformance }}%</strong>.
                </span>
              </div>
            </div>
            <div class="users-dashboard-activity-timeline__item-timestamp">
              {{ activity.timestamp }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="hasMoreActivities" class="users-dashboard-activity-timeline__load-more">
      <VBtn
        text
        block
        class="users-dashboard-activity-timeline__load-more-btn"
        @click="handleLoadMore"
      >
        {{ labels.activityTimelineLoadMore }}
      </VBtn>
    </div>
  </VCard>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'UsersDashboardActivityTimeline',
  computed: {
    ...mapGetters({
      labels: 'usersDashboard/getLabels'
    })
  },
  data() {
    return {
      activities: [],
      hasMoreActivities: false,
      isLoading: false
    }
  },
  created() {
    this.fetchActivities()
  },
  methods: {
    fetchActivities() {
      this.isLoading = true
      // TODO: Replace with actual API call
      setTimeout(() => {
        // Mock data for now
        this.activities = [
          {
            status: 'Reported',
            points: 200,
            campaignName: 'Q4 Security Awareness Campaign',
            difficulty: 'easy',
            campaignPerformance: 85,
            timestamp: '05/12/2024 11:09 UTC-12:00'
          },
          {
            status: 'Clicked Link',
            points: -200,
            campaignName: 'Q4 Security Awareness Campaign',
            difficulty: 'easy',
            campaignPerformance: 83,
            timestamp: '05/12/2024 11:09 UTC-12:00'
          },
          {
            status: 'Opened Email',
            points: -50,
            campaignName: 'Q4 Security Awareness Campaign',
            difficulty: 'easy',
            campaignPerformance: 84,
            timestamp: '05/12/2024 11:09 UTC-12:00'
          }
        ]
        this.hasMoreActivities = true
        this.isLoading = false
      }, 500)
    },
    handleLoadMore() {
      // Generate 5 new mock activities
      const newActivities = []
      const statuses = ['Reported', 'Clicked Link', 'Opened Email']
      const difficulties = ['easy', 'medium', 'hard']
      const campaignNames = [
        'Q4 Security Awareness Campaign',
        'Phishing Simulation Test',
        'Security Training Program',
        'Email Security Challenge',
        'Cyber Awareness Month'
      ]

      for (let i = 0; i < 5; i++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)]
        const campaignName = campaignNames[Math.floor(Math.random() * campaignNames.length)]
        const points = status === 'Reported' ? 200 : status === 'Clicked Link' ? -200 : -50
        const campaignPerformance = 80 + Math.floor(Math.random() * 10)

        newActivities.push({
          status,
          points,
          campaignName,
          difficulty,
          campaignPerformance,
          timestamp: '05/12/2024 11:09 UTC-12:00'
        })
      }

      this.activities = [...this.activities, ...newActivities]
    },
    getActivityColor(status) {
      const colorMap = {
        Reported: '#43A047',
        'Reported Email': '#43A047',
        'Clicked Link': '#F56C6C',
        'Opened Email': '#E6A23C',
        'Email Opened': '#E6A23C'
      }
      return colorMap[status] || '#757575'
    },
    getActivityIcon(status) {
      const iconMap = {
        Reported: 'mdi-shield-check',
        'Reported Email': 'mdi-shield-check',
        'Clicked Link': 'mdi-link-variant',
        'Opened Email': 'mdi-email-open',
        'Email Opened': 'mdi-email-open'
      }
      return iconMap[status] || 'mdi-circle'
    },
    getDifficultyLabel(difficulty) {
      const difficultyMap = {
        easy: this.labels.activityTimelineEasy,
        medium: this.labels.activityTimelineMedium,
        hard: this.labels.activityTimelineHard
      }
      return difficultyMap[difficulty] || difficulty
    }
  }
}
</script>
