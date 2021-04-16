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
          'no-data__opacity-purple': isRoiSummaryEmpty(irSummary),
          'roi-summary': !isRoiSummaryEmpty(irSummary)
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
          v-if="!isRoiSummaryEmpty(irSummary)"
          class="card-body d-flex roi-summary__body-container"
        >
          <div class="body-row">
            <span
              id="card--incident-responder-roi-summary-time"
              class="body-row__number"
              style="white-space: nowrap;"
            >
              {{ `${irSummary && irSummary.roiSummary && irSummary.roiSummary.time}` || 0 }}
            </span>

            <span class="body-row__text" style="margin-left: 2px;">Hour(s)</span>
          </div>
          <div class="body-row body-row--2">
            <span id="card--incident-responder-roi-summary-revenue" class="body-row__number">
              ${{ (irSummary && irSummary.roiSummary && irSummary.roiSummary.revenue) || 0 }}
            </span>

            <span class="body-row__text" style="margin-left: 2px;">{{ labels.Money }}</span>
          </div>
          <div class="card-status">{{ labels.Saved }}</div>
        </div>
        <div class="columns-row__body" v-else>
          <div class="card-footer no-data-text">
            You haven’t saved any work, yet
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
      irSummary: 'investigations/irSummaryGetter' // for using getters
    }),
    getRoiSummaryValue() {
      if (this.irSummary && this.irSummary['roiSummary'] && this.irSummary['roiSummary'].revenue) {
        let revenue = Number(this.irSummary['roiSummary'].revenue)
        if (revenue < 1000) {
          return `$${revenue}`
        } else if (revenue >= 1000 && revenue < 1000000) {
          const newRevenue = revenue / 1000
          const stringRevenue = String(newRevenue)
          const indexOfNewRevenue = stringRevenue.indexOf('.')
          if (indexOfNewRevenue !== -1 && stringRevenue.charAt(indexOfNewRevenue + 1) !== '0') {
            const beforeDecimal = stringRevenue.split('.')[0]
            return `$${beforeDecimal}.${stringRevenue.charAt(indexOfNewRevenue + 1)}k`
          } else {
            return `$${newRevenue}k`
          }
        } else if (revenue >= 1000000 && revenue < 1000000000) {
          const newRevenu = revenue / 1000000
          const stringRevenue = String(newRevenu)
          const indexOfNewRevenue = stringRevenue.indexOf('.')
          if (indexOfNewRevenue !== -1 && stringRevenue.charAt(indexOfNewRevenue + 1) !== '0') {
            const beforeDecimal = stringRevenue.split('.')[0]
            const nextDecimalValue = stringRevenue.charAt(indexOfNewRevenue + 2)
            if (nextDecimalValue) {
              return `$${beforeDecimal}.${stringRevenue.charAt(
                indexOfNewRevenue + 1
              )}${nextDecimalValue}M`
            } else {
              return `$${newRevenu}m`
            }
          } else {
            if (stringRevenue.length === 7) {
              return `$${stringRevenue.substring(0, stringRevenue.length - 1)}m`
            }
            return `$${newRevenu}m`
          }
        } else if (revenue >= 1000000000) {
          const newRevenue = revenue / 1000000000
          const stringRevenue = String(newRevenue)
          const indexOfNewRevenue = stringRevenue.indexOf('.')
          if (indexOfNewRevenue !== -1) {
            return `$${newRevenue.toFixed(3)}b`
          } else {
            return `$${newRevenue}b`
          }
        }
      } else {
        return `$0`
      }
      return `$0`
    }
  },
  props: {
    editMode: {
      type: Boolean
    }
  },
  data() {
    return {
      isLoading: true,
      labels
    }
  },

  methods: {
    isRoiSummaryEmpty(summary) {
      const { roiSummary: { revenue = '0', time = '0' } = { revenue, time } } = summary
      return revenue === '0' && time === '0'
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
.dashboard-cards.roi-summary {
  background-image: linear-gradient(to bottom, #b27fc2, #66257a 96%);
}
.roi-summary__body-container {
  margin-top: 13px;
  @media (max-width: 1900px) {
    .body-row--2 {
      margin-left: 16px;
    }
  }
  @media (max-width: 1899px) and (min-width: 1500px) {
    .body-row--2 {
      margin-left: 16px;
    }
  }
  @media (max-width: 1499px) and (min-width: 1026px) {
    .body-row--2 {
      margin-left: 16px;
    }
  }
  @media (min-width: 1901px) {
    .body-row--2 {
      margin-left: 70px;
    }
  }
}
</style>
