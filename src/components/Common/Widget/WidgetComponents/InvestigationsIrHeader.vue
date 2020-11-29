<template>
  <CardLoading
    :loading="isLoading"
    class="dashboard-cards__skeleton-loading"
    :class="[isLoading && 'widget-card-loading']"
  >
    <template v-slot:skeleton-content>
      <div
        class="dashboard-cards investigations"
        :class="{
          'no-data__opacity-green': !isInvestigationsEmpty(irSummary)
        }"
      >
        <div class="card-header">
          <span class="head">Investigations</span>
          <v-icon
            v-if="editMode"
            style="position: absolute; font-size: 16px; top: 5px; right: 5px;"
            small
            @click="$emit('deleteWidget')"
            class="widget__header-icon ml-1"
            >mdi-close-circle</v-icon
          >
          <router-link :to="'/investigations'">
            <v-icon :color="'white'">mdi-open-in-new</v-icon>
          </router-link>
        </div>
        <div class="columns-row__body" style="margin-top: 13px;" v-if="true">
          <div class="card-body d-flex">
            <div class="body-row">
              <span class="body-row__number">
                {{
                  (irSummary &&
                    irSummary.investigationTypeCount &&
                    irSummary.investigationTypeCount.automaticInvestigationCount) ||
                  0
                }}
              </span>

              <span class="body-row__text">auto</span>
            </div>
            <div class="body-row" style="margin-left: 81px;">
              <span class="body-row__number"
                >{{
                  (irSummary &&
                    irSummary.investigationTypeCount &&
                    irSummary.investigationTypeCount.manualInvestigationCount) ||
                  0
                }}
              </span>

              <span class="body-row__text">manual</span>
            </div>
          </div>
          <div class="card-status mt-7">Incident(s) resolved</div>
        </div>
        <div class="columns-row__body" v-else>
          <div class="card-footer no-data-text" style="margin-top: 36px;">
            No investigation started
          </div>
          <v-btn
            class="btn-action btn-playbook btn-playbook__no-data"
            rounded
            color="white"
            style="box-shadow: none !important; margin-top: 16px;"
            @click="emptyInvestigationButtonClick"
          >
            Start Now
          </v-btn>
        </div>
        <div class="bg-image" :style="[!isInvestigationsEmpty(irSummary) && { opacity: 0.4 }]">
          <img src="../../../../assets/img/ic-check-box.svg" />
        </div>
      </div>
    </template>
  </CardLoading>
</template>

<script>
import CardLoading from '@/components/SkeletonLoading/CardLoading'
import { mapGetters } from 'vuex'

export default {
  name: 'InvestigationsIrHeader',
  components: {
    CardLoading
  },
  props: {
    editMode: {
      type: Boolean
    }
  },
  data() {
    return {
      isLoading: true
    }
  },
  computed: {
    ...mapGetters({
      // get IR Reports data via vuex.
      irSummary: 'investigations/irSummaryGetter' // for using getters
    })
  },
  methods: {
    isInvestigationsEmpty(summary) {
      if (summary && summary['investigationTypeCount']) {
        const investigationTypeCountKeys = Object.keys(summary['investigationTypeCount'])
        if (investigationTypeCountKeys.length > 0) {
          let hasValue = false
          for (let key of investigationTypeCountKeys) {
            if (summary['investigationTypeCount'][key]) {
              hasValue = true
            }
          }
          return hasValue
        } else {
          return false
        }
      } else {
        return false
      }
    },
    emptyInvestigationButtonClick() {
      this.$router.push('investigations')
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
.dashboard-cards.investigations {
  background-image: linear-gradient(to bottom, #71c876, #43a047);
}
</style>
