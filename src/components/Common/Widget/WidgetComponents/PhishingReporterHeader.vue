<template>
  <div class="phishing-reporter__header-container">
    <v-skeleton-loader :loading="isLoading" type="card" tile>
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
    </v-skeleton-loader>
  </div>
</template>

<script>
import { getPhishingReportSummary } from '@/api/phishingReporter'
import FirstTime from '@/components/PhishingReporter/Settings/FirstTime'

export default {
  name: 'PhishingReporterHeader',
  data() {
    return {
      tab: 0,
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
      ]
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
    getDateValue(value) {
      value = typeof value == 'string' ? value : value.toString()
      return value.length === 1 ? `0${value}` : `${value}`
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
          this.isLoading = false
        })
        .catch(() => {
          this.phishingReportSummary = {}
          this.isLoading = false
        })
    },
    getDates() {
      const today = new Date()
      const day = today.getDate()
      const month = today.getMonth() + 1
      const year = today.getFullYear()
      const hours = today.getHours()
      const minutes = today.getMinutes()
      const seconds = today.getSeconds()
      switch (this.selectedDate) {
        case this.listItems[0]:
          const fourMinutesBefore = new Date(year, month, day, hours, minutes - 4, seconds)
          const fourMinutesBeforeMonth = fourMinutesBefore.getMonth()
          const fourMinutesBeforeDay = fourMinutesBefore.getDate()
          const fourMinutesBeforeHours = fourMinutesBefore.getHours()
          const fourMinutesBeforeMinutes = fourMinutesBefore.getMinutes()
          const fourMinutesBeforeSeconds = fourMinutesBefore.getSeconds()
          return {
            endDate: `${year}-${this.getDateValue(month)}-${this.getDateValue(
              day
            )}-${this.getDateValue(hours)}-${this.getDateValue(minutes)}-${this.getDateValue(
              seconds
            )}`,
            startDate: `${fourMinutesBefore.getFullYear()}-${this.getDateValue(
              fourMinutesBeforeMonth
            )}-${this.getDateValue(fourMinutesBeforeDay)}-${this.getDateValue(
              fourMinutesBeforeHours
            )}-${this.getDateValue(fourMinutesBeforeMinutes)}-${this.getDateValue(
              fourMinutesBeforeSeconds
            )}`
          }
        case this.listItems[1]:
          const yesterday = new Date(new Date().setDate(day - 1))
          const tomorrow = new Date(new Date().setDate(day + 1))
          return {
            startDate: `${yesterday.getFullYear()}-${this.getDateValue(
              yesterday.getMonth() + 1
            )}-${this.getDateValue(yesterday.getDate())}-00-00-00`,
            endDate: `${tomorrow.getFullYear()}-${this.getDateValue(
              tomorrow.getMonth() + 1
            )}-${this.getDateValue(tomorrow.getDate())}-00-00-00`
          }
        case this.listItems[2]:
          const sevenDaysAgo = new Date(new Date().setDate(day - 7))
          return {
            startDate: `${sevenDaysAgo.getFullYear()}-${this.getDateValue(
              sevenDaysAgo.getMonth() + 1
            )}-${this.getDateValue(sevenDaysAgo.getDate())}-00-00-00`,
            endDate: `${year}-${this.getDateValue(month)}-${this.getDateValue(
              new Date(new Date().setDate(day)).getDate()
            )}-00-00-00`
          }
        case this.listItems[3]:
          const last30DayDate = new Date(new Date().setDate(day - 30))
          return {
            endDate: `${year}-${this.getDateValue(month)}-${this.getDateValue(
              new Date(new Date().setDate(day)).getDate()
            )}-00-00-00`,
            startDate: `${last30DayDate.getFullYear()}-${this.getDateValue(
              last30DayDate.getMonth() + 1
            )}-${this.getDateValue(last30DayDate.getDate())}-00-00-00`
          }
        case this.listItems[4]:
          return {
            startDate: `${year}-${this.getDateValue(month)}-01-00-00-00`,
            endDate: `${year}-${this.getDateValue(month)}-${this.getDateValue(day)}-00-00-00`
          }
        case this.listItems[5]:
          const lastMonthDate = new Date(new Date().setMonth(month - 1))

          return {
            startDate: `${lastMonthDate.getFullYear()}-${this.getDateValue(
              lastMonthDate.getMonth()
            )}-01-00-00-00`,
            endDate: `${lastMonthDate.getFullYear()}-${this.getDateValue(
              lastMonthDate.getMonth()
            )}-${this.getDateValue(
              new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth(), 0).getDate()
            )}-00-00-00`
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
