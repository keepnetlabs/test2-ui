<template>
  <div v-if="getIncidentResponderSummaryPermission" class="columns-row">
    <IncidentResponderROIDialog v-if="isShowRoi" :status="isShowRoi" @on-close="toggleROIDialog" />
    <CardLoading
      :loading="incidentLoading"
      :class="['dashboard-cards__skeleton-loading', incidentLoading && 'dashboard-cards-loading']"
    >
      <template #skeleton-content>
        <div
          id="card--incident-responder-phishing-reporter"
          :class="[
            'dashboard-cards phishing-reporter mr-2',
            {
              'no-data__opacity-blue': isPhishingEmpty
            }
          ]"
        >
          <div class="card-header">
            <span class="head">Phishing Reporter</span>
            <router-link
              to="/phishing-reporter"
              id="btn-link--incident-responder-to-phishing-reporter"
            >
              <v-icon style="opacity: 0.8;" :color="'white'">mdi-open-in-new</v-icon>
            </router-link>
          </div>
          <div v-if="!isPhishingEmpty" class="columns-row__body">
            <div class="card-body">
              <div
                class="biggest"
                id="card--incident-responder-phishing-reporter-online-users-count"
              >
                {{ getPhishingReporterOnlineUserCount }}
              </div>
            </div>
            <div
              class="card-footer"
              id="card--incident-responder-phishing-reporter-total-users-count"
            >
              of
              {{ getPhishingReporterTotalUserCount }}
              user(s) are
            </div>
            <div class="card-status">{{ labels.Online }}</div>
          </div>
          <div class="columns-row__body" v-else>
            <div class="card-footer no-data-text">
              Add-in isn’t installed at any users’ account
            </div>
          </div>
          <div
            class="bg-image"
            style="bottom: 10px; right: -11px;"
            :style="[isPhishingEmpty && { opacity: 0.4 }]"
          >
            <img src="../../../assets/img/ph-crone.svg" alt="crone icon" />
          </div>
        </div>
      </template>
    </CardLoading>
    <CardLoading
      :loading="incidentLoading"
      :class="['dashboard-cards__skeleton-loading', incidentLoading && 'dashboard-cards-loading']"
    >
      <template #skeleton-content>
        <div
          id="card--incident-responder-incident-analysis"
          :class="[
            'dashboard-cards mr-2',
            {
              'no-data__opacity-red': isNotifiedEmailEmpty,
              'bg-image-incident-analysis': !isNotifiedEmailEmpty
            }
          ]"
        >
          <div class="card-header">
            <span class="head">{{ labels.IncidentAnalysis }}</span>
          </div>
          <div v-if="!isNotifiedEmailEmpty" class="columns-row__body">
            <div class="card-body">
              <div
                class="biggest"
                id="card--incident-responder-incident-analysis-notified-harmful-count"
              >
                {{ getIncidentAnalysisNotifiedHarmfulCount }}
              </div>
            </div>
            <div
              id="card--incident-responder-incident-analysis-reported-mail-count"
              class="card-footer"
            >
              of
              {{ getIncidentAnalysisNotifiedReportedMailCount }}
              reported email(s)
            </div>
            <div class="card-status">{{ labels.FoundHarmful }}</div>
          </div>
          <div class="columns-row__body" v-else>
            <div class="card-footer no-data-text">
              {{ labels.NoEmailAnalysed }}
            </div>
          </div>
          <div class="bg-image" :style="[isNotifiedEmailEmpty && { opacity: 0.3 }]">
            <img src="../../../assets/img/ic-warning.svg" alt="warning icon" />
          </div>
        </div>
      </template>
    </CardLoading>
    <CardLoading
      :loading="incidentLoading"
      :class="['dashboard-cards__skeleton-loading', incidentLoading && 'dashboard-cards-loading']"
    >
      <template #skeleton-content>
        <div
          id="card--incident-responder-investigations"
          :class="[
            'dashboard-cards investigations mr-2',
            {
              'no-data__opacity-green': !isInvestigationsEmpty
            }
          ]"
        >
          <div class="card-header">
            <span class="head">Investigations</span>
            <router-link
              id="btn-link--incident-responder-to-investigations"
              to="/incident-responder/investigations"
            >
              <v-icon style="opacity: 0.8;" color="white">mdi-open-in-new</v-icon>
            </router-link>
          </div>
          <div v-if="isInvestigationsEmpty" class="columns-row__body" style="margin-top: 13px;">
            <div class="card-body d-flex">
              <div class="body-row">
                <span
                  id="card--incident-responder-investigations-automatic-investigation-count"
                  class="body-row__number"
                >
                  {{ getAutomaticInvestigationCount }}
                </span>

                <span class="body-row__text" style="margin-left: 4px;">{{ labels.LowerAuto }}</span>
              </div>
              <div class="body-row" style="margin-left: 64px;">
                <span
                  class="body-row__number"
                  id="card--incident-responder-investigations-manual-investigation-count"
                  >{{ getManuelInvestigationCount }}
                </span>

                <span class="body-row__text">{{ labels.LowerManual }}</span>
              </div>
            </div>
            <div class="card-status mt-7">
              {{ labels.IncidentsResolved }}
            </div>
          </div>
          <div class="columns-row__body" v-else>
            <div class="card-footer no-data-text">
              {{ labels.NoInvestigationStarted }}
            </div>
          </div>
          <div class="bg-image" :style="[!isInvestigationsEmpty && { opacity: 0.4 }]">
            <img src="../../../assets/img/ic-check-box.svg" alt="check icon" />
          </div>
        </div>
      </template>
    </CardLoading>
    <CardLoading
      :loading="incidentLoading"
      :class="['dashboard-cards__skeleton-loading', incidentLoading && 'dashboard-cards-loading']"
    >
      <template #skeleton-content>
        <div
          id="card--incident-responder-roi-summary"
          :class="[
            'dashboard-cards',
            {
              'no-data__opacity-purple': isRoiSummaryEmpty,
              'roi-summary': !isRoiSummaryEmpty
            }
          ]"
        >
          <div class="card-header">
            <span class="head">{{ labels.RoiSummary }}</span>
            <v-icon
              v-if="getIncidentResponderROISettingGetPermission"
              id="btn-show--incident-responder-roi-summary"
              color="#fff"
              @click="toggleROIDialog(false)"
              >mdi-cog</v-icon
            >
          </div>
          <div v-if="!isRoiSummaryEmpty" class="card-body d-flex roi-summary__body-container">
            <div class="body-row">
              <span
                id="card--incident-responder-roi-summary-time"
                class="body-row__number"
                style="white-space: nowrap;"
              >
                {{ getROISummaryTime }}
              </span>

              <span class="body-row__text" style="margin-left: 2px;">Hour(s)</span>
            </div>
            <div class="body-row body-row--2">
              <span class="body-row__number" id="card--incident-responder-roi-summary-revenue">
                ${{ getROISummaryRevenue }}
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
            <img src="../../../assets/img/ic-insert-chart.svg" alt="chart icon" />
          </div>
        </div>
      </template>
    </CardLoading>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CardLoading from '@/components/SkeletonLoading/IRCardLoading'
import labels from '@/model/constants/labels'
import IncidentResponderROIDialog from '@/components/IncidentResponder/Dashboard/IncidentResponderROIDialog'
export default {
  name: 'IncidentResponderHeaderCards',
  components: { IncidentResponderROIDialog, CardLoading },
  data() {
    return {
      labels,
      incidentLoading: false,
      isShowRoi: false
    }
  },
  computed: {
    ...mapGetters({
      irSummary: 'investigations/irSummaryGetter',
      getIncidentResponderSummaryPermission: 'permissions/getIncidentResponderSummaryPermission',
      getIncidentResponderROISettingGetPermission:
        'permissions/getIncidentResponderROISettingGetPermission'
    }),
    isPhishingEmpty() {
      const data = this.irSummary
      if (data && !data.phishingReporterUserStatusCount) {
        return true
      } else if (
        data &&
        data.phishingReporterUserStatusCount &&
        (data.phishingReporterUserStatusCount.onlineUsersCount ||
          data.phishingReporterUserStatusCount.offlineUsersCount)
      ) {
        return false
      } else {
        return true
      }
    },
    getPhishingReporterOnlineUserCount() {
      return this?.irSummary?.phishingReporterUserStatusCount?.onlineUsersCount || 0
    },
    getPhishingReporterTotalUserCount() {
      const { irSummary } = this
      return (
        (irSummary &&
          irSummary.phishingReporterUserStatusCount &&
          irSummary.phishingReporterUserStatusCount.onlineUsersCount +
            irSummary.phishingReporterUserStatusCount.offlineUsersCount) ||
        0
      )
    },
    isNotifiedEmailEmpty() {
      const data = this.irSummary
      if (data && !data.notifiedEmailResultCount) {
        return true
      } else if (
        data &&
        data.notifiedEmailResultCount &&
        data.notifiedEmailResultCount.reportedMailCount
      ) {
        return false
      } else {
        return true
      }
    },
    getIncidentAnalysisNotifiedHarmfulCount() {
      return this?.irSummary?.notifiedEmailResultCount?.harmfulCount || 0
    },
    getIncidentAnalysisNotifiedReportedMailCount() {
      return this?.irSummary.notifiedEmailResultCount.reportedMailCount || 0
    },
    isInvestigationsEmpty() {
      const summary = this.irSummary
      if (summary && summary.investigationTypeCount) {
        const investigationTypeCountKeys = Object.keys(summary.investigationTypeCount)
        if (investigationTypeCountKeys.length > 0) {
          let hasValue = false
          for (let key of investigationTypeCountKeys) {
            if (summary.investigationTypeCount[key]) {
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
    getAutomaticInvestigationCount() {
      return this?.irSummary?.investigationTypeCount?.automaticInvestigationCount || 0
    },
    getManuelInvestigationCount() {
      return this?.irSummary.investigationTypeCount?.manualInvestigationCount || 0
    },
    isRoiSummaryEmpty() {
      const { roiSummary: { revenue = '0', time = '0' } = { revenue, time } } = this.irSummary || {}
      return revenue === '0' && time === '0'
    },
    getROISummaryTime() {
      return this?.irSummary?.roiSummary?.time || 0
    },
    getROISummaryRevenue() {
      return this?.irSummary?.roiSummary?.revenue || 0
    }
  },
  created() {
    this.callForData()
    window.addEventListener('resize', this.addQuery)
  },
  mounted() {
    this.addQuery()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.addQuery)
  },
  methods: {
    callForData() {
      this.incidentLoading = true
      this.$store.dispatch('investigations/getIrSummary').finally(() => {
        this.incidentLoading = false
      })
    },
    addQuery() {
      const navigatorWidth = document.querySelector('nav.page-nav').style.width
      const width = window.innerWidth - Number(navigatorWidth.slice(0, -2))
      if (width < 1050 && width > 750) {
        document
          .querySelectorAll(
            '.incident-responder-parent .columns-row .dashboard-cards__skeleton-loading'
          )
          .forEach((item) => {
            item.style = 'width: calc(50%) !important;max-width: calc(50%) !important;'
          })

        document.querySelector('.columns-row').style = 'flex-wrap:wrap;'
      } else {
        document
          .querySelectorAll(
            '.incident-responder-parent .columns-row .dashboard-cards__skeleton-loading'
          )
          .forEach((item) => {
            item.style = ''
          })
        const columnsRowContainer = document.querySelector('.columns-row')
        if (columnsRowContainer) document.querySelector('.columns-row').style = ''
      }
    },
    toggleROIDialog(forceUpdate = false) {
      if (forceUpdate) this.callForData()
      this.isShowRoi = !this.isShowRoi
    }
  }
}
</script>
