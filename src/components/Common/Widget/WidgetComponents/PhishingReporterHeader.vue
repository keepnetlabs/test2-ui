<template>
  <div class="phishing-reporter__header-container">
    <div class="phishing-reporter__stats">
      <div class="phishing-reporter__header-left-column">
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
                Users have the add-in
              </p>
            </div>
          </div>
        </div>
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
                {{ (phishingReportSummary && phishingReportSummary['onlineUsersCount']) || 0 }}
              </h3>
              <p class="phishing-reporter__stats-card-right-stats">
                Users Online
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
                {{ (phishingReportSummary && phishingReportSummary['offlineUsersCount']) || 0 }}
              </h3>
              <p class="phishing-reporter__stats-card-right-stats">
                Users Offline
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
                <img src="../../../../assets/img/account-tree.png" alt="" />
              </div>
            </div>
            <div class="phishing-reporter__stats-card-right">
              <h3 class="phishing-reporter__stats-card-right-title" style="color: #2196f3;">
                v{{ (phishingReportSummary && phishingReportSummary['addInVersion']) || 0 }}
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
</template>

<script>
import { getPhishingReportSummary } from '@/api/phishingReporter'

export default {
  name: 'PhishingReporterHeader',
  data() {
    return {
      listItems: ['Last 24h', 'Last 7 days', 'Last 30 days', 'This month', 'Last month'],
      selectedDate: 'Last 24h',
      phishingReportSummary: {}
    }
  },
  computed: {
    getAddOnStatus() {
      return this.phishingReportSummary ? this.phishingReportSummary['totalUsersCount'] : 0
    }
  },
  methods: {
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
        .catch(() => {
          this.phishingReportSummary = {}
        })
    },
    getDates() {
      const today = new Date()
      const day = today.getDate()
      const month = today.getMonth() + 1
      const year = today.getFullYear()
      switch (this.selectedDate) {
        case this.listItems[0]:
          const yesterday = new Date(new Date().setDate(day - 1))
          const tomorrow = new Date(new Date().setDate(day + 1))
          return {
            startDate: `${yesterday.getFullYear()}-${
              yesterday.getMonth() + 1
            }-${yesterday.getDate()}`,
            endDate: `${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1}-${tomorrow.getDate()}`
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
    }
  },
  created() {
    this.getPhishingReportSummary()
  }
}
</script>

<style></style>
