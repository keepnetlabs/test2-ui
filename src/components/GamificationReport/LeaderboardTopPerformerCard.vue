<template>
  <div class="gamification-report__top-performer-card">
    <figure class="gamification-report__top-performer-card-ribbon">
      <img :src="getRibbonImgSrc" alt="gold ribbon" />
    </figure>
    <figure>
      <img :src="getMedalImgSrc" alt="gold medal" />
    </figure>
    <span class="gamification-report__top-performer-card-name">{{ performer.name }}</span>
    <span class="gamification-report__top-performer-card-email">{{ performer.email }}</span>
    <span class="gamification-report__top-performer-card-department">{{
      performer.department
    }}</span>
    <span class="gamification-report__top-performer-card-score">{{ performer.score }} PTS</span>
  </div>
</template>

<script>
export default {
  name: 'LeaderboardTopPerformerCard',
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
    getMedalImgSrc() {
      if (this.performer.type === 'gold') {
        return this.goldMedalImg
      }
      if (this.performer.type === 'silver') {
        return this.silverMedalImg
      }
      return this.bronzeMedalImg
    },
    getRibbonImgSrc() {
      if (this.performer.type === 'gold') {
        return this.goldRibbonImg
      }
      if (this.performer.type === 'silver') {
        return this.silverRibbonImg
      }
      return this.bronzeRibbonImg
    }
  }
}
</script>
