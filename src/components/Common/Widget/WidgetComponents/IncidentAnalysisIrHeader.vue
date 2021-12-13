<template>
  <CardLoading
    :loading="isLoading"
    class="dashboard-cards__skeleton-loading"
    :class="[isLoading && 'widget-card-loading']"
  >
    <template v-slot:skeleton-content>
      <div
        id="card--incident-responder-incident-analysis"
        class="dashboard-cards"
        :class="{
          'no-data__opacity-red': isNotifiedEmailEmpty(notifiedEmailResultCount),
          'incident-analysis': !isNotifiedEmailEmpty(notifiedEmailResultCount)
        }"
      >
        <div class="card-header">
          <span class="head">{{ labels.IncidentAnalysis }}</span>
          <v-icon
            v-if="editMode"
            id="btn-close--dashboard-widgets-incident-analysis-reporter-card"
            style="position: absolute; font-size: 16px; top: 5px; right: 5px;"
            small
            @click="$emit('deleteWidget')"
            class="widget__header-icon ml-1"
            >mdi-close-circle</v-icon
          >
        </div>
        <div class="columns-row__body" v-if="!isNotifiedEmailEmpty(notifiedEmailResultCount)">
          <div class="card-body">
            <div
              class="biggest"
              id="card--incident-responder-incident-analysis-notified-harmful-count"
            >
              {{ (notifiedEmailResultCount && notifiedEmailResultCount.harmfulCount) || 0 }}
            </div>
          </div>
          <div
            class="card-footer"
            id="card--incident-responder-incident-analysis-reported-mail-count"
          >
            of
            {{ (notifiedEmailResultCount && notifiedEmailResultCount.reportedMailCount) || 0 }}
            reported email(s)
          </div>
          <div class="card-status">{{ labels.FoundHarmful }}</div>
        </div>
        <div class="columns-row__body" v-else>
          <div class="card-footer no-data-text">{{ labels.NoEmailAnalysed }}</div>
        </div>
        <div
          class="bg-image"
          :style="[isNotifiedEmailEmpty(notifiedEmailResultCount) && { opacity: 0.3 }]"
        >
          <img src="../../../../assets/img/ic-warning.svg" alt="link" />
        </div>
      </div>
    </template>
  </CardLoading>
</template>

<script>
import CardLoading from '@/components/SkeletonLoading/CardLoading'
import { mapGetters } from 'vuex'
import labels from '@/model/constants/labels'
export default {
  name: 'IncidentAnalysisIrHeader',
  components: {
    CardLoading
  },
  props: {
    editMode: {
      type: Boolean,
      default: false,
      labels
    }
  },
  data() {
    return {
      labels
    }
  },
  computed: {
    ...mapGetters({
      // get IR Reports data via vuex.
      notifiedEmailResultCount: 'widgets/getIncidentAnalysisCard',
      isLoading: 'widgets/getIsLoading'
    })
  },

  methods: {
    isNotifiedEmailEmpty(data) {
      return !(data['reportedMailCount'] || data['harmfulCount'])
    }
  }
}
</script>

<style lang="scss">
.incident-analysis {
  background-image: linear-gradient(to bottom, #f3a0a0, #f56c6c 99%);
}
</style>
