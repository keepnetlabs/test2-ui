<template>
  <div class="phishing-reporter__header" id="phishing-reporter">
    <div
      class="phishing-reporter__header-container"
      v-if="checkPermissions('phishing-reporter/summary', 'GET')"
    >
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
                    <img src="../assets/img/account-tree.png" alt="" />
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
              <div class="phishing-reporter__header-container-panel-text">{{ selectedDate }}</div>
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
                :label="labels.Users"
                name="phishing-reporter-users"
                id="phishing-reporter-users-content"
                v-if="checkPermissions('phishing-reporter/search', 'POST')"
                ><users
                  v-if="tab === 'phishing-reporter-users'"
                  ref="refUsers"
                  @callForPhishingReporterSummary="getPhishingReportSummary()"
              /></el-tab-pane>
              <el-tab-pane
                :label="labels.Settings"
                name="phishing-reporter-settings"
                id="phishing-reporter-settings-content"
                v-if="checkPermissions('phishing-reporter', 'GET')"
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
import { checkPermission } from '@/utils/functions'
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
    getAddOnStatus() {
      return this.phishingReportSummary ? this.phishingReportSummary['totalUsersCount'] : 0
    }
  },
  methods: {
    checkPermissions(permission, type) {
      return checkPermission(permission, type)
    },
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
        switch (hash) {
          case '#users':
            this.tab = 0
            break
          case '#settings':
            this.tab = 1
            break
          default:
            break
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
      switch (this.selectedDate) {
        case this.listItems[0]:
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
        case this.listItems[1]:
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
        case this.listItems[2]:
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
        case this.listItems[3]:
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
        case this.listItems[4]:
          return {
            startDate: `${year}-${this.getDateValue(month)}-01-00-00-00`,
            endDate: `${year}-${this.getDateValue(month)}-${this.getDateValue(
              day
            )}-${this.getDateValue(hours)}-${this.getDateValue(minutes)}-${this.getDateValue(
              seconds
            )}`
          }
        case this.listItems[5]:
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
          if (response.status === 200) {
            this.tabComponent = {
              name: Settings,
              ref: 'refSettings',
              formData: data.data
            }
          }
        })
        .catch(() => {
          this.tabComponent = {
            name: FirstTime,
            ref: 'refFirstTime',
            formData: null
          }
          this.tab = 'phishing-reporter-settings'
        })
        .finally(() => (this.isLoading = false))
    }
  },
  created() {
    this.getPhishingReportSummary()
    this.getPhishingReport()
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
      refs.refFirstTime.showAddInConfiguration = false
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
  }
}
</script>

<style lang="scss">
.phishing-reporter {
  &__tab {
    &-container {
      padding-left: 0 !important;
      padding-right: 0 !important;
      padding-top: 0 !important;
      margin-top: 24px !important;
      .v-card {
        @media only screen and (max-width: 500px) {
          padding: 20px !important;
        }
      }
    }
  }

  &__tabs {
    &-items {
      margin-top: 8px;
      .v-window-item {
        margin-top: 0;
      }
    }
  }

  &__card {
    box-shadow: 0 1px 3px 0 rgba(142, 142, 142, 0.2), 0 1px 1px 0 rgba(243, 243, 243, 0.14),
      0 1px 1px -1px rgba(204, 204, 204, 0.12) !important;
    padding: 10px 24px 0 24px !important;
    border-radius: 20px !important;
  }

  &__stats {
    padding: 24px 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    flex-flow: row;
    border-bottom: 2px solid #e4e7ed;
    margin: 0 24px;

    @media (max-width: 768px) {
      flex-direction: column;
    }

    &-cards {
      display: flex;
      flex-basis: 50%;
      flex-grow: 0;

      @media (max-width: 768px) {
        margin-bottom: 10px;
      }
    }
    &-card {
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: center;

      &-left {
        &-icon {
          width: 50px;
          height: 50px;
          align-items: center;
          justify-content: center;
          display: flex;
          box-shadow: 0 2px 5px 0 rgba(112, 177, 115, 0.5);
          border-radius: 30px;
          margin-right: 8px;

          &.bg-green {
            background: #43a047;
          }

          &.bg-turquoise {
            background-color: #00bcd4;
          }

          &.bg-blue {
            background-color: #2196f3;
          }

          &.bg-salmon {
            background-color: #f56c6c;
          }

          &.bg-macaroni {
            background-color: #e6a23c;
          }

          i {
            margin-right: 0 !important;
          }
        }
      }

      &-right {
        &-title {
          font-size: 20px;
          font-weight: 600;
          line-height: 1.15;
          letter-spacing: normal;
          color: #2196f3;
        }

        &-stats {
          margin-bottom: 0 !important;
          font-size: 16px;
          letter-spacing: normal;
          color: rgba(0, 0, 0, 0.87);
          max-width: 250px;
        }
      }
    }
  }
}
.phishing-reporter__header {
  padding: 11px 16px 16px 16px;

  &-left-column {
    display: flex;
    flex-basis: 73%;
    @media (max-width: 400px) {
      flex-direction: column;
    }
  }
  &-right-column {
    display: flex;
    flex-basis: 50%;
    .phishing-reporter__stats-cards:first-child {
      flex-basis: 73%;
      @media (max-width: 900px) {
        flex-basis: 50%;
      }
    }
    @media (max-width: 400px) {
      flex-direction: column;
    }
    .phishing-reporter__stats-cards:last-child {
      flex-basis: 27%;
      @media (max-width: 900px) {
        flex-basis: 50%;
      }
    }
  }
  &-container {
    border-radius: 20px;
    box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5);
    background-color: #ffffff;

    &-panel {
      margin: 0 37px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: end;
      -ms-flex-pack: end;
      justify-content: flex-end;
      padding: 16px 0;
      align-items: center;

      &-right-col {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        padding-left: 10px;
      }
      &-text {
        font-size: 14px;
        font-weight: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #000000;
      }
    }
  }
}
</style>
