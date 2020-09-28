<template>
  <div class="incident-responder-parent">
    <div class="columns-row">
      <div
        class="dashboard-cards phishing-reporter mr-2 ml-0"
        :class="{
          'no-data__opacity-blue': isPhishingEmpty(irSummary)
        }"
      >
        <div class="card-header">
          <span class="head">Phishing Reporter</span>
          <router-link to="/phishing-reporter">
            <v-icon :color="isPhishingEmpty(irSummary) ? '#757575' : 'white'"
              >mdi-open-in-new</v-icon
            >
          </router-link>
        </div>
        <div class="columns-row__body" v-if="!isPhishingEmpty(irSummary)">
          <div class="card-body">
            <div class="biggest">
              {{
                (irSummary &&
                  irSummary['phishingReporterUserStatusCount'] &&
                  irSummary['phishingReporterUserStatusCount']['onlineUsersCount']) ||
                0
              }}
            </div>
          </div>
          <div class="card-footer">
            of
            {{
              (irSummary &&
                irSummary['phishingReporterUserStatusCount'] &&
                irSummary['phishingReporterUserStatusCount']['onlineUsersCount'] +
                  irSummary['phishingReporterUserStatusCount']['offlineUsersCount']) ||
              0
            }}
            users are
          </div>
          <div class="card-status">Currently Online</div>
        </div>
        <div class="columns-row__body" v-else>
          <div class="card-footer no-data-text">
            No add-ins installed
          </div>
          <v-btn
            class="btn-action btn-playbook btn-playbook__no-data"
            rounded
            color="white"
            style="box-shadow: none !important; margin-top: 29px;"
          >
            Install Now
          </v-btn>
        </div>
        <div
          class="bg-image"
          style="bottom: 10px; right: 0;"
          :style="[isPhishingEmpty(irSummary) && { opacity: 0.4 }]"
        >
          <img src="../../../../assets/img/shape.svg" alt="shape" />
        </div>
      </div>
      <div
        class="dashboard-cards incident-analysis mr-2"
        :class="{
          'no-data__opacity-red': isNotifiedEmailEmpty(irSummary)
        }"
      >
        <div class="card-header">
          <span class="head">Incident Analysis</span>
        </div>
        <div class="columns-row__body" v-if="!isNotifiedEmailEmpty(irSummary)">
          <div class="card-body">
            <div class="biggest">
              {{
                (irSummary &&
                  irSummary['notifiedEmailResultCount'] &&
                  irSummary['notifiedEmailResultCount']['harmfulCount']) ||
                0
              }}
            </div>
          </div>
          <div class="card-footer">
            of
            {{
              (irSummary &&
                irSummary['notifiedEmailResultCount'] &&
                irSummary['notifiedEmailResultCount']['reportedMailCount']) ||
              0
            }}
            reported emails
          </div>
          <div class="card-status">Found harmful</div>
        </div>
        <div class="columns-row__body" v-else>
          <div class="card-footer no-data-text">No emails analysed</div>
          <!--<button class="btn-action btn-playbook btn-playbook__no-data" block rounded
                @click="emptyNotifiedEmailButtonClick">
          Start Now
        </button>-->
        </div>
        <div class="bg-image" :style="[isNotifiedEmailEmpty(irSummary) && { opacity: 0.3 }]">
          <img src="../../../../assets/img/ic-warning.svg" alt="warning" />
        </div>
      </div>
      <div
        class="dashboard-cards investigations mr-2"
        :class="{
          'no-data__opacity-green': !isInvestigationsEmpty(irSummary)
        }"
      >
        <div class="card-header">
          <span class="head">Investigations</span>
          <router-link :to="'/investigations'">
            <v-icon :color="isInvestigationsEmpty(irSummary) ? 'white' : '#757575'"
              >mdi-open-in-new</v-icon
            >
          </router-link>
        </div>
        <div
          class="columns-row__body"
          style="margin-top: 22px;"
          v-if="isInvestigationsEmpty(irSummary)"
        >
          <div class="card-body">
            <div class="body-row">
              <span class="body-row__number">
                {{
                  (irSummary &&
                    irSummary['investigationTypeCount'] &&
                    irSummary['investigationTypeCount']['automaticInvestigationCount']) ||
                  0
                }}
              </span>

              <span class="body-row__text">automated</span>
            </div>
            <div class="body-row mt-4">
              <span class="body-row__number"
                >{{
                  (irSummary &&
                    irSummary['investigationTypeCount'] &&
                    irSummary['investigationTypeCount']['manualInvestigationCount']) ||
                  0
                }}
              </span>

              <span class="body-row__text">manual</span>
            </div>
          </div>
          <div class="card-status mt-7">Incidents resolved</div>
        </div>
        <div class="columns-row__body" v-else>
          <div class="card-footer no-data-text">No investigation started</div>
          <v-btn
            class="btn-action btn-playbook btn-playbook__no-data"
            rounded
            color="white"
            style="box-shadow: none !important; margin-top: 29px;"
          >
            Start Now
          </v-btn>
        </div>
        <div class="bg-image" :style="[!isInvestigationsEmpty(irSummary) && { opacity: 0.4 }]">
          <img src="../../../../assets/img/ic-check-box.svg" alt="icon" />
        </div>
      </div>
      <div
        class="dashboard-cards roi-summary"
        :class="{
          'no-data__opacity-purple': isPhishingEmpty(irSummary)
        }"
      >
        <div class="card-header">
          <span class="head">ROI Summary</span>
          <v-icon color="#fff" v-if="isRoiSummaryEmpty(irSummary)" @click="isShowRoi = true"
            >mdi-cog</v-icon
          >
        </div>
        <div class="card-body">
          <div class="body-row" style="margin-top: 22px;">
            <span class="body-row__number">
              {{ (irSummary && irSummary['roiSummary'] && irSummary['roiSummary'].time) || 0 }}h
            </span>
            <span>and</span>
          </div>
          <div class="body-row mt-4">
            <span class="body-row__number"> {{ getRoiSummaryValue }} </span>
          </div>
        </div>
        <div class="card-status">Saved</div>
        <div class="bg-image">
          <img src="../../../../assets/img/ic-insert-chart.svg" alt="chart" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'IncidentResponderHeader',
  props: {},
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
  data() {
    return {
      isLoading: true
    }
  },
  methods: {
    isPhishingEmpty(data) {
      if (data && !data['phishingReporterUserStatusCount']) {
        return true
      } else
        return !(
          data &&
          data['phishingReporterUserStatusCount'] &&
          (data['phishingReporterUserStatusCount']['onlineUsersCount'] ||
            data['phishingReporterUserStatusCount']['offlineUsersCount'])
        )
    },
    isNotifiedEmailEmpty(data) {
      if (data && !data['notifiedEmailResultCount']) {
        return true
      } else
        return !(
          data &&
          data['notifiedEmailResultCount'] &&
          data['notifiedEmailResultCount']['reportedMailCount']
        )
    },
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
    isRoiSummaryEmpty(summary) {
      return !!summary
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
  }
}
</script>

<style scoped>
.dashboard-cards {
  width: 25%;
}
</style>
