<template>
  <v-card class="pa-4">
    <v-list-item class="pl-0 pr-0">
      <div class="v-btn v-cart-icon-wrapper">
        <v-icon medium left color="blue" class="ml-2">
          mdi-email
        </v-icon>
      </div>
      <v-list-item-content class="pt-0 pb-0">
        <v-list-item-title class="v-card-headline">Phishing Campaigns</v-list-item-title>
        <v-list-item-subtitle>Your phishing campaign statistics</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <phishing-campaigns-pie-chart
      :dropdown-current="dropdownCurrent"
      v-on:changeDropdownItem="onPieChartDropdownSelect($event)"
      :dropdown-data="chartDropdownData"
      :labels="pieChartDataLabels"
      :pieData="pieChartData"
      :chartOptionColors="chartOptionColors"
    ></phishing-campaigns-pie-chart>
  </v-card>
</template>

<script>
import PhishingCampaignsPieChart from '@/components/Dashboard/PhishingCampaignsPieChart'
import { mapActions, mapState } from 'vuex'
import AuthenticationService from '@/services/authentication'
import AuthenticationStatus from '@/model/constants/authenticationStatus'
export default {
  name: 'PhishingCampaigns',
  components: {
    PhishingCampaignsPieChart
  },
  data() {
    return {
      dropdownCurrent: {
        value: 'All Time',
        key: 'all'
      },
      chartDropdownData: [
        {
          value: 'All Time',
          key: '999'
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
      ]
    }
  },
  computed: {
    ...mapState({
      pieChartData: (state) => state.dashboard.pieChartData,
      pieChartDataLabels: (state) => state.dashboard.pieChartDataLabels,
      chartOptionColors: (state) => state.dashboard.chartOptionColors,
      companyInformation: (state) => state.dashboard.companyInformation
    })
  },
  methods: {
    ...mapActions({
      getCurrentUser: 'auth/getCurrentUser',
      getPhishingCampaigns: 'dashboard/getPhishingCampaigns',
      getLastFiveCompaignsStats: 'dashboard/getLastFiveCompaignsStats',
      getCompanyInformation: 'dashboard/getCompanyInformation',
      getDropdownCompanies: 'dashboard/getDropdownCompanies',
      getMenus: 'dashboard/getMenus',
      getOverallStats: 'dashboard/getOverallStats'
    }),
    onPieChartDropdownSelect(item) {
      this.dropdownCurrent = item
      this.getPhishingCampaigns(this.dropdownCurrent.key)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getPhishingCampaigns(999)
      this.getLastFiveCompaignsStats()
      this.getOverallStats(12)
    })
  }
}
</script>

<style></style>
