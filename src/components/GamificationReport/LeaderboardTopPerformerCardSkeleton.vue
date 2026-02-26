<template>
  <div class="gamification-report__top-performers mb-6">
    <div class="gamification-report__top-performers-header">
      Top Performers
    </div>
    <div class="gamification-report__top-performers-content">
      <div
        v-for="i in 3"
        :key="i"
        class="gamification-report__top-performer-card-skeleton"
      >
        <div class="gamification-report__top-performer-card-skeleton__ribbon">
          <v-skeleton-loader type="text" width="48px" />
        </div>
        <v-skeleton-loader
          type="avatar"
          class="gamification-report__top-performer-card-skeleton__medal"
        />
        <v-skeleton-loader
          type="text"
          width="55%"
          class="gamification-report__top-performer-card-skeleton__line mt-3"
        />
        <v-skeleton-loader
          type="text"
          width="78%"
          class="gamification-report__top-performer-card-skeleton__line"
        />
        <v-skeleton-loader
          type="text"
          width="45%"
          class="gamification-report__top-performer-card-skeleton__line"
        />
        <v-skeleton-loader
          type="chip"
          class="gamification-report__top-performer-card-skeleton__chip mt-3"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeaderboardTopPerformerCardSkeleton'
}
</script>
