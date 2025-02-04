<template>
  <div class="d-flex gap-4 gamification-report-performance-details-info-card">
    <div>
      <VIcon color="#1173C1">{{ icon }}</VIcon>
    </div>
    <div>
      <div class="gamification-report-performance-details-info-card__title">
        {{ title }}
      </div>
      <div class="gamification-report-performance-details-info-card__description">
        {{ description }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'GamificationReportPerformanceDetailsInfoCard',
  props: {
    icon: {
      type: String,
      default: 'mdi-star'
    },
    title: {
      type: String,
      default: 'Why Earning Full Points Matters'
    },
    description: {
      type: String,
      default:
        'Achieving the maximum score of 500 points demonstrates mastery of critical skills, builds recognition, and opens opportunities for competitive rankings or certifications. Reaching this milestone is a benchmark of success and personal growth.'
    }
  }
}
</script>
