<template>
  <CardLoading
    :loading="isLoading"
    class="dashboard-cards__skeleton-loading"
    :class="[isLoading && 'widget-card-loading']"
  >
    <template v-slot:skeleton-content>
      <div
        id="card--incident-responder-roi-summary"
        class="dashboard-cards"
        :class="{
          'no-data__opacity-purple': isRoiSummaryEmpty(roiSummary),
          'roi-summary': !isRoiSummaryEmpty(roiSummary)
        }"
      >
        <div class="card-header">
          <span class="head">{{ labels.RoiSummary }}</span>
          <v-icon
            v-if="editMode"
            id="btn-close--dashboard-widgets-roi-summary-card"
            style="position: absolute; font-size: 16px; top: 5px; right: 5px;"
            small
            @click="$emit('deleteWidget')"
            class="widget__header-icon ml-1"
            >mdi-close-circle</v-icon
          >
        </div>
        <div
          v-if="!isRoiSummaryEmpty(roiSummary)"
          class="card-body d-flex roi-summary__body-container"
        >
          <div class="body-row">
            <span
              id="card--incident-responder-roi-summary-time"
              class="body-row__number"
              style="white-space: nowrap;"
            >
              {{ `${roiSummary && roiSummary.time}` || 0 }}
            </span>

            <span class="body-row__text" style="margin-left: 2px;">Hour(s)</span>
          </div>
          <div class="body-row body-row--2">
            <span id="card--incident-responder-roi-summary-revenue" class="body-row__number">
              ${{ (roiSummary && roiSummary.revenue) || 0 }}
            </span>

            <span class="body-row__text" style="margin-left: 2px;">{{ labels.Money }}</span>
          </div>
          <div class="card-status">{{ labels.Saved }}</div>
        </div>
        <div class="columns-row__body" v-else>
          <div class="card-footer no-data-text">
            You haven’t saved any work
          </div>
        </div>
        <div class="bg-image">
          <img src="../../../../assets/img/ic-insert-chart.svg" alt="icon" />
        </div>
      </div>
    </template>
  </CardLoading>
</template>

<script>
import CardLoading from '@/components/SkeletonLoading/CardLoading'
import labels from '@/model/constants/labels'
import { mapGetters } from 'vuex'
export default {
  name: 'RoiSummaryIrHeader',
  components: {
    CardLoading
  },
  computed: {
    ...mapGetters({
      // get IR Reports data via vuex.
      roiSummary: 'widgets/getROISummaryCard',
      isLoading: 'widgets/getIsLoading'
    })
  },
  props: {
    editMode: {
      type: Boolean
    }
  },
  data() {
    return {
      labels
    }
  },

  methods: {
    isRoiSummaryEmpty() {
      let { revenue = '0', time = '0' } = this.roiSummary || {}
      return revenue === '0' && time === '0'
    }
  }
}
</script>
