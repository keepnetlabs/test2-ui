<template>
  <overall-stats
    :key="overallStatsList"
    :dropdown-data="overallDropdownData"
    :dropdown-current="dropdownCurrentOverallStats"
    v-on:changeDropdownItem="onOverallStatsDropdownSelect($event)"
    :chartData="overallStatsList"
    :months="getMonths(dropdownCurrentOverallStats.key)"
    :minMaxValues="minMaxValues"
    ><!-- eslint-disable-line --></overall-stats
  >
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex'
import OverallStats from '@/components/Dashboard/OverallStats'

export default {
  name: 'OverallStatsWidget',
  components: {
    OverallStats
  },
  computed: {
    ...mapGetters({
      isTourActive: 'tour/isTourActive',
      getTourData: 'tour/getTourData',
      getPieChartLabels: 'dashboard/getPieChartLabels',
      firstCampaignList: 'dashboard/getFirstCampaignList',
      lastFiveCampaignList: 'dashboard/getLastFiveCampaignList',
      singleCampaignList: 'dashboard/getSingleCampaignList',
      menuList: 'dashboard/getMenuList',
      overallStatsList: 'dashboard/getOverallStatsList',
      notificationList: 'dashboard/getNotificationList'
    }),
    ...mapState({
      pieChartData: (state) => state.dashboard.pieChartData,
      pieChartDataLabels: (state) => state.dashboard.pieChartDataLabels,
      chartOptionColors: (state) => state.dashboard.chartOptionColors,
      companyInformation: (state) => state.dashboard.companyInformation
    })
  },
  data() {
    return {
      overallDropdownData: [
        {
          value: 'All Time',
          key: '12'
        },
        {
          value: 'Last 1 month',
          key: '1'
        },
        {
          value: 'Last 3 months',
          key: '3'
        },
        {
          value: 'Last 6 months',
          key: '6'
        },
        {
          value: 'Last 12 months',
          key: '12'
        }
      ],
      dropdownCurrentOverallStats: {
        value: 'All Time',
        key: '12'
      },
      minMaxValues: [0, 50000]
    }
  },
  methods: {
    ...mapActions({
      getOverallStats: 'dashboard/getOverallStats'
    }),
    onOverallStatsDropdownSelect(item) {
      this.dropdownCurrentOverallStats = item
      this.getOverallStats(this.dropdownCurrentOverallStats.key)
    },
    getMonths(numbers) {
      const date = new Date()
      const newMonths = []
      const currentMonth = date.getMonth()
      for (let i = 0; i < numbers; i++) {
        const dateMonth = currentMonth - i
        date.setMonth(dateMonth)
        newMonths.push(date.toGMTString())
      }
      return newMonths
    }
  },
  mounted() {
    this.getOverallStats(12)
  }
}
</script>

<style></style>
