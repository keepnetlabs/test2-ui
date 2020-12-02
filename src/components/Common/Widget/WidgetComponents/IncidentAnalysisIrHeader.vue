<template>
  <CardLoading
    :loading="isLoading"
    class="dashboard-cards__skeleton-loading"
    :class="[isLoading && 'widget-card-loading']"
  >
    <template v-slot:skeleton-content>
      <div
        class="dashboard-cards incident-analysis"
        :class="{
          'no-data__opacity-red': isNotifiedEmailEmpty(irSummary)
        }"
      >
        <div class="card-header">
          <span class="head">{{ labels.IncidentAnalysis }}</span>
          <v-icon
            v-if="editMode"
            style="position: absolute; font-size: 16px; top: 5px; right: 5px;"
            small
            @click="$emit('deleteWidget')"
            class="widget__header-icon ml-1"
            >mdi-close-circle</v-icon
          >
        </div>
        <div class="columns-row__body" v-if="!isNotifiedEmailEmpty(irSummary)">
          <div class="card-body">
            <div class="biggest">
              {{
                (irSummary &&
                  irSummary.notifiedEmailResultCount &&
                  irSummary.notifiedEmailResultCount.harmfulCount) ||
                0
              }}
            </div>
          </div>
          <div class="card-footer">
            of
            {{
              (irSummary &&
                irSummary.notifiedEmailResultCount &&
                irSummary.notifiedEmailResultCount.reportedMailCount) ||
              0
            }}
            reported email(s)
          </div>
          <div class="card-status">{{ labels.FoundHarmful }}</div>
        </div>
        <div class="columns-row__body" v-else>
          <div class="card-footer no-data-text">{{ labels.NoEmailAnalysed }}</div>
          <!--<button class="btn-action btn-playbook btn-playbook__no-data" block rounded
            @click="emptyNotifiedEmailButtonClick">
      Start Now
    </button>-->
        </div>
        <div class="bg-image" :style="[isNotifiedEmailEmpty(irSummary) && { opacity: 0.3 }]">
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
      isLoading: true,
      labels
    }
  },
  computed: {
    ...mapGetters({
      // get IR Reports data via vuex.
      irSummary: 'investigations/irSummaryGetter' // for using getters
    })
  },

  methods: {
    isNotifiedEmailEmpty(data) {
      if (data && !data['notifiedEmailResultCount']) {
        return true
      } else
        return !(
          data &&
          data['notifiedEmailResultCount'] &&
          data['notifiedEmailResultCount']['reportedMailCount']
        )
    }
  },
  created() {
    this.$store
      .dispatch('investigations/getIrSummary')
      .then(() => {
        this.isLoading = false
      })
      .catch(() => {
        this.isLoading = false
      })
      .finally(() => {
        this.isLoading = false
      })
  }
}
</script>

<style lang="scss">
.incident-analysis {
  background-image: linear-gradient(to bottom, #f3a0a0, #f56c6c 99%);
}
</style>
