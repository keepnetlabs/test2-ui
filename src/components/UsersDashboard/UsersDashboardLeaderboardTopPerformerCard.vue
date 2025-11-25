<template>
  <VCard class="users-dashboard-leaderboard-top-performer-card">
    <figure class="users-dashboard-leaderboard-top-performer-card__ribbon">
      <img :src="getRibbonImgSrc" :alt="getRibbonAlt" />
    </figure>
    <figure class="users-dashboard-leaderboard-top-performer-card__medal">
      <img :src="getMedalImgSrc" :alt="getMedalAlt" />
    </figure>
    <div class="users-dashboard-leaderboard-top-performer-card__content">
      <span class="users-dashboard-leaderboard-top-performer-card__name">
        {{ performer.firstName }} {{ performer.lastName }}
      </span>
      <span class="users-dashboard-leaderboard-top-performer-card__email">
        {{ performer.email }}
      </span>
      <span
        v-if="performer.department"
        class="users-dashboard-leaderboard-top-performer-card__department"
      >
        {{ performer.department }}
      </span>
      <div class="users-dashboard-leaderboard-top-performer-card__performance">
        {{ performer.performance }}% {{ labels.leaderboardPerformance }}
      </div>
    </div>
  </VCard>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'UsersDashboardLeaderboardTopPerformerCard',
  props: {
    performer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      goldMedalImg: require('@/assets/img/leaderboard-gold-medal.svg'),
      goldRibbonImg: require('@/assets/img/leaderboard-gold-ribbon.svg'),
      silverMedalImg: require('@/assets/img/leaderboard-silver-medal.svg'),
      silverRibbonImg: require('@/assets/img/leaderboard-silver-ribbon.svg'),
      bronzeMedalImg: require('@/assets/img/leaderboard-bronze-medal.svg'),
      bronzeRibbonImg: require('@/assets/img/leaderboard-bronze-ribbon.svg')
    }
  },
  computed: {
    ...mapGetters({
      labels: 'usersDashboard/getLabels'
    }),
    getMedalImgSrc() {
      if (this.performer.rank === 1) {
        return this.goldMedalImg
      }
      if (this.performer.rank === 2) {
        return this.silverMedalImg
      }
      return this.bronzeMedalImg
    },
    getRibbonImgSrc() {
      if (this.performer.rank === 1) {
        return this.goldRibbonImg
      }
      if (this.performer.rank === 2) {
        return this.silverRibbonImg
      }
      return this.bronzeRibbonImg
    },
    getMedalAlt() {
      if (this.performer.rank === 1) return 'gold medal'
      if (this.performer.rank === 2) return 'silver medal'
      return 'bronze medal'
    },
    getRibbonAlt() {
      if (this.performer.rank === 1) return 'gold ribbon'
      if (this.performer.rank === 2) return 'silver ribbon'
      return 'bronze ribbon'
    }
  }
}
</script>
