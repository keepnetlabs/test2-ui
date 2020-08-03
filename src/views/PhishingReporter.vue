<template>
  <div class="phishing-reporter__header" id="phishing-reporter">
    <div class="phishing-reporter__header-container">
      <div class="phishing-reporter__stats">
        <div class="phishing-reporter__header-left-column">
          <div class="phishing-reporter__stats-cards">
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
                  {{ (phishingReportSummary && phishingReportSummary.onlineUsersCount) || 0 }}
                </h3>
                <p class="phishing-reporter__stats-card-right-stats">
                  Online Users
                </p>
              </div>
            </div>
          </div>
          <div class="phishing-reporter__stats-cards">
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
                  Users have the add-on
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="phishing-reporter__header-right-column">
          <div class="phishing-reporter__stats-cards">
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
                  {{ (phishingReportSummary && phishingReportSummary.offlineUsersCount) || 0 }}
                </h3>
                <p class="phishing-reporter__stats-card-right-stats">
                  Users Stayed Offline
                </p>
              </div>
            </div>
          </div>
          <div class="phishing-reporter__stats-cards">
            <div class="phishing-reporter__stats-card">
              <div class="phishing-reporter__stats-card-left">
                <div
                  class="phishing-reporter__stats-card-left-icon"
                  style="background-color: #2196f3;"
                >
                  <img src="../assets/img/account-tree.png" />
                </div>
              </div>
              <div class="phishing-reporter__stats-card-right">
                <h3 class="phishing-reporter__stats-card-right-title" style="color: #2196f3;">
                  {{ (phishingReportSummary && phishingReportSummary.addInVersion) || 0 }}
                </h3>
                <p class="phishing-reporter__stats-card-right-stats">
                  Latest Release
                </p>
              </div>
            </div>
          </div>
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
            <v-list-item @click="handleListItemClick(item)" :key="item" v-for="item in listItems">
              <v-list-item-title>{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
    <div class="phishing-reporter">
      <v-layout id="ts-layout" style="min-height: 80vh;" wrap>
        <v-col class="pl-0 phishing-reporter__tab-container" cols="12">
          <v-card class="phishing-reporter__card">
            <v-tabs background-color="transparent" color="basil" v-model="tab" class="k-tabs">
              <v-tab @click="changeTabStatus(0)" class="k-tab p-2">
                Users
              </v-tab>
              <v-tab @click="changeTabStatus(1)" class="k-tab p-2">Settings </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab" class="phishing-reporter__tabs-items">
              <v-tab-item>
                <users
                  ref="refUsers"
                  @callForPhishingReporterSummary="getPhishingReportSummary()"
                />
              </v-tab-item>
              <v-tab-item>
                <component
                  :is="tabComponent.name"
                  :ref="tabComponent.ref"
                  :formData="tabComponent.formData"
                  @getPhishingReport="getPhishingReport"
                />
              </v-tab-item>
            </v-tabs-items>
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
import { getPhishingReporter, getPhishingReportSummary } from '../api/phishingReporter'

export default {
  name: 'PhishingReporter',
  components: {
    Settings,
    Users,
    FirstTime
  },
  data() {
    return {
      tab: 0,
      phishingReportSummary: null,
      tabComponent: {
        name: FirstTime,
        ref: 'refFirstTime',
        formData: null
      },
      selectedDate: 'Last 24h',
      listItems: ['Last 24h', 'Last 7 days', 'Last 30 days', 'This month', 'Last month']
    }
  },
  computed: {
    getAddOnStatus() {
      return this.phishingReportSummary
        ? `${this.phishingReportSummary.onlineUsersCount || 0} of ${
            this.phishingReportSummary.totalUsersCount || 0
          }`
        : 0
    }
  },
  methods: {
    changeTabStatus(status) {
      /*
      this.$router.replace({ ...this.$route, hash: status === 0 ? '#users' : '#settings' })
      */
      this.tab = status
    },
    handleListItemClick(date) {
      this.selectedDate = date
      this.getPhishingReportSummary()
    },
    getPhishingReportSummary() {
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
        .catch((error) => {
          this.phishingReportSummary = {}
        })
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
      const day = today.getDate()
      const month = today.getMonth() + 1
      const year = today.getFullYear()
      switch (this.selectedDate) {
        case this.listItems[0]:
          const yesterday = new Date(new Date().setDate(day - 1))
          return {
            startDate: `${yesterday.getFullYear()}-${
              yesterday.getMonth() + 1
            }-${yesterday.getDate()}`,
            endDate: `${year}-${month}-${new Date(new Date().setDate(day)).getDate()}`
          }
        case this.listItems[1]:
          const sevenDaysAgo = new Date(new Date().setDate(day - 7))
          return {
            startDate: `${sevenDaysAgo.getFullYear()}-${
              sevenDaysAgo.getMonth() + 1
            }-${sevenDaysAgo.getDate()}`,
            endDate: `${year}-${month}-${new Date(new Date().setDate(day)).getDate()}`
          }
        case this.listItems[2]:
          const last30DayDate = new Date(new Date().setDate(day - 30))
          return {
            endDate: `${year}-${month}-${new Date(new Date().setDate(day)).getDate()}`,
            startDate: `${last30DayDate.getFullYear()}-${
              last30DayDate.getMonth() + 1
            }-${last30DayDate.getDate()}`
          }
        case this.listItems[3]:
          return {
            startDate: `${year}-${month}-01`,
            endDate: `${year}-${month}-${day}`
          }
        case this.listItems[4]:
          const lastMonthDate = new Date(new Date().setMonth(month - 1))

          return {
            startDate: `${lastMonthDate.getFullYear()}-${lastMonthDate.getMonth()}-01`,
            endDate: `${lastMonthDate.getFullYear()}-${lastMonthDate.getMonth()}-${new Date(
              lastMonthDate.getFullYear(),
              lastMonthDate.getMonth(),
              0
            ).getDate()}`
          }
      }
    },
    getPhishingReport() {
      getPhishingReporter()
        .then((response) => {
          const { data } = response
          if (data.code === 'RESOURCE_RETRIEVED') {
            this.tabComponent = {
              name: Settings,
              ref: 'refSettings',
              formData: data.data
            }
          }
        })
        .catch((error) => {
          this.tabComponent = {
            name: FirstTime,
            ref: 'refFirstTime',
            formData: null
          }
        })
    }
  },
  created() {
    this.getPhishingReportSummary()
    this.getPhishingReport()
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
      margin-top: 16px !important;
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
    padding: 10px 24px 18px 24px !important;
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
    -ms-flex-flow: row;
    flex-flow: row;
    border-bottom: 2px solid #e4e7ed;
    margin: 0 28px;

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
          margin-bottom: 5px;
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
  padding: 16px;
  padding-top: 10px;

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
      padding: 14px 0 27px 0;
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
        letter-spacing: normal;
        color: #000000;
      }
    }
  }
}
</style>
