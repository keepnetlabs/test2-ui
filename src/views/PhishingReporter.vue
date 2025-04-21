<template>
  <div class="phishing-reporter__header" id="phishing-reporter" style="margin-top: 5px;">
    <div class="phishing-reporter__header-container" v-if="getPhishingReporterSummaryPermissions">
      <div class="phishing-reporter__stats">
        <div
          class="phishing-reporter__header-left-column"
          :style="[isHeaderLoading && { flexBasis: '50%' }]"
        >
          <template v-if="isHeaderLoading">
            <PhishingReporterTopBar :loading="isHeaderLoading" class="w-100" />
            <PhishingReporterTopBar :loading="isHeaderLoading" class="w-100" />
          </template>
          <template v-else>
            <div class="phishing-reporter__stats-cards" id="card--phishing-reporter-header-online">
              <div class="phishing-reporter__stats-card">
                <div class="phishing-reporter__stats-card-left">
                  <div
                    class="phishing-reporter__stats-card-left-icon"
                    style="background-color: #00bcd4;"
                  >
                    <v-icon color="white" left medium>mdi-account</v-icon>
                  </div>
                </div>
                <div class="phishing-reporter__stats-card-right">
                  <h3 class="phishing-reporter__stats-card-right-title" style="color: #00bcd4;">
                    {{ (phishingReportSummary && phishingReportSummary['onlineUsersCount']) || 0 }}
                  </h3>
                  <p class="phishing-reporter__stats-card-right-stats">
                    Online users
                  </p>
                </div>
              </div>
            </div>
            <div class="phishing-reporter__stats-cards" id="card--phishing-reporter-header-add-in">
              <div class="phishing-reporter__stats-card">
                <div class="phishing-reporter__stats-card-left">
                  <div
                    class="phishing-reporter__stats-card-left-icon"
                    style="background-color: #2196f3;"
                  >
                    <v-icon color="white" left medium>mdi-puzzle</v-icon>
                  </div>
                </div>
                <div class="phishing-reporter__stats-card-right">
                  <h3 class="phishing-reporter__stats-card-right-title" style="color: #2196f3;">
                    {{ getAddOnStatus }}
                  </h3>
                  <p class="phishing-reporter__stats-card-right-stats">
                    Users with add-in
                  </p>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="phishing-reporter__header-right-column">
          <template v-if="isHeaderLoading">
            <PhishingReporterTopBar :loading="isHeaderLoading" class="w-100" />
            <PhishingReporterTopBar :loading="isHeaderLoading" class="w-100" />
          </template>
          <template v-else>
            <div class="phishing-reporter__stats-cards" id="card--phishing-reporter-header-offline">
              <div class="phishing-reporter__stats-card">
                <div class="phishing-reporter__stats-card-left">
                  <div
                    class="phishing-reporter__stats-card-left-icon"
                    style="background-color: #f56c6c;"
                  >
                    <v-icon color="white" left medium>mdi-account-outline</v-icon>
                  </div>
                </div>
                <div class="phishing-reporter__stats-card-right">
                  <h3 class="phishing-reporter__stats-card-right-title" style="color: #f56c6c;">
                    {{ (phishingReportSummary && phishingReportSummary['offlineUsersCount']) || 0 }}
                  </h3>
                  <p class="phishing-reporter__stats-card-right-stats">
                    Offline users
                  </p>
                </div>
              </div>
            </div>
            <div
              class="phishing-reporter__stats-cards"
              id="card--phishing-reporter-header-latest-release"
            >
              <div class="phishing-reporter__stats-card">
                <div class="phishing-reporter__stats-card-left">
                  <div
                    class="phishing-reporter__stats-card-left-icon"
                    style="background-color: #2196f3;"
                  >
                    <img src="../assets/img/account-tree.svg" alt="" />
                  </div>
                </div>
                <div class="phishing-reporter__stats-card-right">
                  <h3 class="phishing-reporter__stats-card-right-title" style="color: #2196f3;">
                    v{{ (phishingReportSummary && phishingReportSummary['addInVersion']) || 0 }}
                  </h3>
                  <p class="phishing-reporter__stats-card-right-stats">
                    {{ labels.Latest }} {{ labels.Release }}
                  </p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="phishing-reporter__header-container-panel">
        <v-menu bottom offset-y min-width="133">
          <template v-slot:activator="{ on }">
            <div v-on="on" class="phishing-reporter__header-container-panel-right-col">
              <div class="phishing-reporter__header-container-panel-text">
                {{ selectedDate }}
              </div>
              <v-icon style="padding-left: 6px;">mdi-chevron-down</v-icon>
            </div>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in listItems"
              :id="`item--phishing-reporter-header-${index}`"
              :key="item"
              @click="handleListItemClick(item)"
            >
              <v-list-item-title :id="listItemsId[index]">{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
    <div class="phishing-reporter">
      <v-layout id="ts-layout" style="min-height: 80vh;" wrap>
        <v-col class="pl-0 phishing-reporter__tab-container" cols="12">
          <v-card class="phishing-reporter__card">
            <el-tabs v-model="tab" @tab-click="handleTabClick">
              <el-tab-pane
                v-if="getPhishingReporterSearchPermissions"
                :label="labels.Users"
                name="phishing-reporter-users"
                id="phishing-reporter-users-content"
                ><users
                  v-if="tab === 'phishing-reporter-users'"
                  ref="refUsers"
                  @callForPhishingReporterSummary="getPhishingReportSummary()"
              /></el-tab-pane>
              <el-tab-pane
                v-if="getPhishingReporterGetPermissions"
                :label="labels.Settings"
                name="phishing-reporter-settings"
                id="phishing-reporter-settings-content"
              >
                <DatatableLoading class="mt-5" :loading="isLoading" v-if="isLoading" />
                <component
                  v-show="!isLoading"
                  :is="tabComponent.name"
                  :ref="tabComponent.ref"
                  :formData="tabComponent.formData"
                  @getPhishingReport="getPhishingReport"
              /></el-tab-pane>
            </el-tabs>
          </v-card>
        </v-col>
      </v-layout>
    </div>
  </div>
</template>

<script>
import Settings from '../components/PhishingReporter/Settings/Settings'
import Users from '../components/PhishingReporter/Users'
import FirstTime from '../components/PhishingReporter/Settings/FirstTime'
import { getPhishingReporter, getPhishingReportSummary } from '@/api/phishingReporter'
import PhishingReporterTopBar from '../components/SkeletonLoading/PhishingReporterTopBar'
import DatatableLoading from '@/components/SkeletonLoading/DatatableLoading'
import InvestigationDetailsTopBarLoading from '@/components/SkeletonLoading/InvestigationDetailsTopBarLoading'
import labels from '@/model/constants/labels'
import { mapGetters } from 'vuex'
export default {
  name: 'PhishingReporter',
  components: {
    DatatableLoading,
    Settings,
    Users,
    FirstTime,
    PhishingReporterTopBar,
    InvestigationDetailsTopBarLoading
  },
  data() {
    return {
      loading: true,
      tab: 'phishing-reporter-users',
      labels,
      isHeaderLoading: true,
      phishingReportSummary: null,
      tabComponent: {
        name: FirstTime,
        ref: 'refFirstTime',
        formData: null
      },
      isLoading: true,
      selectedDate: 'Last 4 minutes',
      listItems: [
        'Last 4 minutes',
        'Last 24h',
        'Last 7 days',
        'Last 30 days',
        'This month',
        'Previous month'
      ],
      listItemsId: [
        'last-four-items',
        'last-twenty-four-hours',
        'last-seven-days',
        'last-thirty-days',
        'this-month',
        'previous-month'
      ]
    }
  },
  computed: {
    ...mapGetters({
      getPhishingReporterSearchPermissions: 'permissions/getPhishingReporterSearchPermissions',
      getPhishingReporterSummaryPermissions: 'permissions/getPhishingReporterSummaryPermissions',
      getPhishingReporterGetPermissions: 'permissions/getPhishingReporterGetPermissions',
      getPhishingReporterSavePermissions: 'permissions/getPhishingReporterSavePermissions'
    }),
    getAddOnStatus() {
      return this.phishingReportSummary ? this.phishingReportSummary['totalUsersCount'] : 0
    }
  },
  created() {
    if (!this.getPhishingReporterSearchPermissions && this.getPhishingReporterGetPermissions) {
      this.tab = 'phishing-reporter-settings'
    }
    this.getPhishingReportSummary()
    this.getPhishingReport()
    if (
      this.$route.query?.tenant ||
      (this.$route.query?.error &&
        (this.$route.query?.error_description || this.$route.query?.error_subcode))
    ) {
      this.tab = 'phishing-reporter-settings'
      return
    }
    if (this.$route.params && this.$route.params.tab) {
      this.tab = this.$route.params.tab
    }
    if (this.$route.query && this.$route.query.tab) {
      this.$nextTick(() => {
        this.tab = this.$route.query.tab
      })
    }
  },
  mounted() {
    this.getHash()
  },
  beforeRouteLeave(to, from, next) {
    const refs = this.$refs
    if (refs && refs.refFirstTime && refs.refFirstTime.showAddInConfiguration) {
      refs.refFirstTime.checkIfCanCloseOverlay()
      next(false)
    } else if (refs && refs.refUsers && refs.refUsers.isWantToDelete) {
      refs.refUsers.isWantToDelete = false
      next(false)
    } else {
      next()
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (this.getHash(to.hash)) {
      if (to.hash !== from.hash) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  },
  methods: {
    handleTabClick({ label = '' }) {
      if (label === 'Settings') {
        this.getPhishingReport()
      } else {
        this.getPhishingReportSummary()
      }
    },
    changeTabStatus(status) {
      this.tab = status
    },
    handleListItemClick(date) {
      this.selectedDate = date
      this.getPhishingReportSummary()
    },
    getPhishingReportSummary() {
      this.loading = true
      this.isHeaderLoading = true
      const dateObj = this.getDates()
      getPhishingReportSummary({
        startDate: dateObj.startDate,
        endDate: dateObj.endDate
      })
        .then((response) => {
          const {
            data: { data }
          } = response

          this.phishingReportSummary = data
        })
        .catch(() => {
          this.phishingReportSummary = {}
        })
        .finally(() => {
          this.loading = false
          this.isHeaderLoading = false
        })
    },
    getDateValue(value) {
      value = typeof value == 'string' ? value : value.toString()
      return value.length === 1 ? `0${value}` : `${value}`
    },
    getHash(hashValue) {
      if (hashValue || (this.$route && this.$route.hash)) {
        const hash = hashValue || this.$route.hash
        if (hash === '#users') {
          this.tab = 0
        }
        if (hash === '#settings') {
          this.tab = 1
        }
        return true
      } else {
        return false
      }
    },
    getDates() {
      const today = new Date()
      const day = today.getUTCDate()
      const month = today.getUTCMonth() + 1
      const year = today.getUTCFullYear()
      const hours = today.getUTCHours()
      const minutes = today.getUTCMinutes()
      const seconds = today.getUTCSeconds()
      if (this.selectedDate === this.listItems[0]) {
        const fourMinutesBefore = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          today.getHours(),
          today.getMinutes() - 4,
          today.getSeconds()
        )
        const fourMinutesBeforeMonth = fourMinutesBefore.getUTCMonth() + 1
        const fourMinutesBeforeDay = fourMinutesBefore.getUTCDate()
        const fourMinutesBeforeHours = fourMinutesBefore.getUTCHours()
        const fourMinutesBeforeMinutes = fourMinutesBefore.getUTCMinutes()
        const fourMinutesBeforeSeconds = fourMinutesBefore.getUTCSeconds()
        return {
          endDate: `${year}-${this.getDateValue(month)}-${this.getDateValue(
            day
          )}-${this.getDateValue(hours)}-${this.getDateValue(minutes)}-${this.getDateValue(
            seconds
          )}`,
          startDate: `${fourMinutesBefore.getUTCFullYear()}-${this.getDateValue(
            fourMinutesBeforeMonth
          )}-${this.getDateValue(fourMinutesBeforeDay)}-${this.getDateValue(
            fourMinutesBeforeHours
          )}-${this.getDateValue(fourMinutesBeforeMinutes)}-${this.getDateValue(
            fourMinutesBeforeSeconds
          )}`
        }
      }
      if (this.selectedDate === this.listItems[1]) {
        const yesterday = new Date(new Date().setUTCDate(day - 1))
        return {
          startDate: `${yesterday.getUTCFullYear()}-${this.getDateValue(
            yesterday.getUTCMonth() + 1
          )}-${this.getDateValue(yesterday.getUTCDate())}-${this.getDateValue(
            hours
          )}-${this.getDateValue(minutes)}-${this.getDateValue(seconds)}`,
          endDate: `${year}-${this.getDateValue(month)}-${this.getDateValue(
            day
          )}-${this.getDateValue(hours)}-${this.getDateValue(minutes)}-${this.getDateValue(
            seconds
          )}`
        }
      }
      if (this.selectedDate === this.listItems[2]) {
        const sevenDaysAgo = new Date(new Date().setUTCDate(day - 7))
        return {
          startDate: `${sevenDaysAgo.getUTCFullYear()}-${this.getDateValue(
            sevenDaysAgo.getUTCMonth() + 1
          )}-${this.getDateValue(sevenDaysAgo.getUTCDate())}-${this.getDateValue(
            hours
          )}-${this.getDateValue(minutes)}-${this.getDateValue(seconds)}`,
          endDate: `${year}-${this.getDateValue(month)}-${this.getDateValue(
            new Date(new Date().setUTCDate(day)).getUTCDate()
          )}-${this.getDateValue(hours)}-${this.getDateValue(minutes)}-${this.getDateValue(
            seconds
          )}`
        }
      }
      if (this.selectedDate === this.listItems[3]) {
        const last30DayDate = new Date(new Date().setUTCDate(day - 30))
        return {
          endDate: `${year}-${this.getDateValue(month)}-${this.getDateValue(
            new Date(new Date().setUTCDate(day)).getUTCDate()
          )}-${this.getDateValue(hours)}-${this.getDateValue(minutes)}-${this.getDateValue(
            seconds
          )}`,
          startDate: `${last30DayDate.getUTCFullYear()}-${this.getDateValue(
            last30DayDate.getUTCMonth() + 1
          )}-${this.getDateValue(last30DayDate.getUTCDate())}-${this.getDateValue(
            hours
          )}-${this.getDateValue(minutes)}-${this.getDateValue(seconds)}`
        }
      }
      if (this.selectedDate === this.listItems[4]) {
        return {
          startDate: `${year}-${this.getDateValue(month)}-01-00-00-00`,
          endDate: `${year}-${this.getDateValue(month)}-${this.getDateValue(
            day
          )}-${this.getDateValue(hours)}-${this.getDateValue(minutes)}-${this.getDateValue(
            seconds
          )}`
        }
      }
      if (this.selectedDate === this.listItems[5]) {
        const lastMonthDate = new Date(new Date().setUTCMonth(month - 1))

        return {
          startDate: `${lastMonthDate.getUTCFullYear()}-${this.getDateValue(
            lastMonthDate.getUTCMonth()
          )}-01-00-00-00`,
          endDate: `${lastMonthDate.getUTCFullYear()}-${this.getDateValue(
            lastMonthDate.getUTCMonth()
          )}-${this.getDateValue(
            new Date(lastMonthDate.getUTCFullYear(), lastMonthDate.getUTCMonth(), 0).getUTCDate()
          )}-00-00-00`
        }
      }
    },
    getPhishingReport() {
      this.isLoading = true
      getPhishingReporter()
        .then((response) => {
          const { data } = response
          if (data.message === 'Phishing reporter not found' && data.status === 'SUCCESS') {
            this.tabComponent = {
              name: FirstTime,
              ref: 'refFirstTime',
              formData: null
            }
            this.tab = 'phishing-reporter-settings'
          } else if (response.status === 200) {
            this.tabComponent = {
              name: Settings,
              ref: 'refSettings',
              formData: data.data
            }
          }
        })
        .finally(() => (this.isLoading = false))
    }
  }
}
</script>
