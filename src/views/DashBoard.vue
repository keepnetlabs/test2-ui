<template>
  <v-container class="main-content container mt-0 pt-0 ml-0 pl-0 pr-0 mr-0">
    <v-layout wrap>
      <v-col class="phishing-col pl-4 pr-2" md="6" sm="12">
        <v-card :class="{ z_index_custom_2: getTourData['0'] }">
          <div
            v-show="isTourActive"
            class="tour-btn-container tour-one"
            :class="{ z_index_custom_1: getTourData['0'] }"
          >
            <div class="tour-btn-wrapper">
              <div class="tour-btn-circle">
                <div class="tour-btn-circle-inner"></div>
              </div>
            </div>
          </div>
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
      </v-col>
      <v-col
        class="company-info-col pl-2 pr-4"
        md="6"
        sm="12"
        :class="{ z_index_custom: tour.one.active }"
      >
        <v-card height="100%" :class="{ z_index_custom_2: getTourData['1'] }">
          <div
            v-show="isTourActive"
            class="tour-btn-container tour-two"
            :class="{ z_index_custom_1: getTourData['1'] }"
          >
            <div class="tour-btn-wrapper">
              <div class="tour-btn-circle">
                <div class="tour-btn-circle-inner"></div>
              </div>
            </div>
          </div>
          <v-list-item class="pl-0 pr-0">
            <div class="v-btn v-cart-icon-wrapper" id="tour-1">
              <v-icon medium left color="blue" class="ml-2">
                mdi-domain
              </v-icon>
            </div>
            <v-list-item-content class="pt-0 pb-0">
              <v-list-item-title class="v-card-headline">Company Information</v-list-item-title>
              <v-list-item-subtitle>Summary of your company</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <!-- eslint-disable -->
          <company-information
                  :key="companyInformation.name"
                  :companyInformation="companyInformation"
          ><!-- eslint-disable-line --></company-information
          >
        </v-card>
      </v-col>
      <v-col class="overall-stats-col pl-4 pt-1 pr-4" lg="12" md="12" xl="12">
        <v-card :class="{ z_index_custom_2: getTourData['2'] }">
          <div
                  v-show="isTourActive"
                  class="tour-btn-container tour-three"
                  :class="{ z_index_custom_1: getTourData['2'] }"
          >
            <div class="tour-btn-wrapper">
              <div class="tour-btn-circle">
                <div class="tour-btn-circle-inner"></div>
              </div>
            </div>
          </div>
          <v-list-item class="pl-0 pr-0">
            <div class="v-btn v-cart-icon-wrapper">
              <v-icon medium left color="blue" class="ml-2">
                mdi-chart-bar
              </v-icon>
            </div>
            <v-list-item-content class="pt-0 pb-0">
              <v-list-item-title class="v-card-headline">Overall Stats</v-list-item-title>
              <v-list-item-subtitle>Keepnet activity stats of your company</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
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
        </v-card>
      </v-col>
      <v-col
              class="last5-col pl-4 pt-1 pr-4"
              lg="12"
              md="12"
              xl="12"
              :class="{ z_index_custom_2: getTourData['3'] }"
      >
        <div
                v-show="isTourActive"
                class="tour-btn-container tour-four"
                :class="{ z_index_custom_1: getTourData['3'] }"
        >
          <div class="tour-btn-wrapper">
            <div class="tour-btn-circle">
              <div class="tour-btn-circle-inner"></div>
            </div>
          </div>
        </div>
        <LastFiveCampaigns
                :key="lastFiveCampaignList.length"
                :campaignList2="firstCampaignList"
                :campaignList="lastFiveCampaignList"
                :singleTableList="singleCampaignList"
        />
      </v-col>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import PhishingCampaignsPieChart from '../components/Dashboard/PhishingCampaignsPieChart'
import CompanyInformation from '../components/Dashboard/CompanyInformation'
import OverallStats from '../components/Dashboard/OverallStats'
import LastFiveCampaigns from '../components/Dashboard/LastFiveCampaigns'
import AuthenticationService from '../services/authentication'
import AuthenticationStatus from '../model/constants/authenticationStatus'

export default {
  components: {
    CompanyInformation,
    PhishingCampaignsPieChart,
    OverallStats,
    LastFiveCampaigns
  },
  data: () => ({
    tour: {
      isActive: false,
      one: { active: false },
      two: { active: false },
      three: { active: false },
      four: { active: false },
      five: { active: false }
    },
    dropdownCurrent: {
      value: 'All Time',
      key: 'all'
    },
    dropdownCurrentOverallStats: {
      value: 'All Time',
      key: '12'
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
    ],
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
    pieData2: [],
    pieDataColor: ['#66bb6a', '#ffce56', '#ff6384'],
    pieData: [800, 200, 200],
    labels: ['Completed (800)', 'Passive (200)', 'Cancelled (200)'],
    labelsOverallStats: [
      'Phishing Simulatore Score',
      'Awareness Educator',
      'Threat Intelligence',
      'Incident Responder',
      'Email Threat Simulator'
    ],
    overallStatsData2: [],
    overallStatsData: [
      {
        name: 'Phishing Simulator Score',
        data: [65, 59, 80, 82, 57, 55, 41]
      },
      {
        name: 'Awareness Educator',
        data: [65, 67, 63, 53, 64, 57, 66]
      },
      {
        name: 'Threat Intelligence',
        data: [65, 44, 80, 44, 57, 33, 41]
      },
      {
        name: 'Incident Responder',
        data: [65, 67, 45, 53, 64, 58, 61]
      },
      {
        name: 'Email Threat Simulator',
        data: [45, 67, 35, 63, 44, 30, 61]
      }
    ],
    minMaxValues: [0, 50000]
  }),
  mounted() {
    this.$nextTick(() => {
      if (AuthenticationService.getAuthenticationStatus() === AuthenticationStatus.AUTHENTICATED) {
        //this.getCurrentUser()
        this.getPhishingCampaigns(999)
        this.getLastFiveCompaignsStats()
        this.getCompanyInformation()
        this.getDropdownCompanies()
        this.getOverallStats(12)
      } else {
        this.$router.push('/login')
      }
    })
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
  methods: {
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
    },
    ...mapActions({
      getCurrentUser: 'auth/getCurrentUser',
      getPhishingCampaigns: 'dashboard/getPhishingCampaigns',
      getLastFiveCompaignsStats: 'dashboard/getLastFiveCompaignsStats',
      getCompanyInformation: 'dashboard/getCompanyInformation',
      getDropdownCompanies: 'dashboard/getDropdownCompanies',
      getOverallStats: 'dashboard/getOverallStats'
    }),
    onPieChartDropdownSelect(item) {
      this.dropdownCurrent = item
      this.getPhishingCampaigns(this.dropdownCurrent.key)
    },
    onOverallStatsDropdownSelect(item) {
      this.dropdownCurrentOverallStats = item
      this.getOverallStats(this.dropdownCurrentOverallStats.key)
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .z_index_custom_1 {
  z-index: 99999 !important;
}

::v-deep .z_index_custom_2 {
  z-index: 16 !important;
}

.z_index_custom {
  z-index: 13;
}

.v-step__buttons {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
}

::v-deep .v-step__button {
  color: #00bcd4 !important;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  line-height: 1.71;
  text-align: center;
  text-transform: uppercase;
}

main > .v-content__wrap > .container--fluid > div {
  align-items: center;
  display: flex;
  justify-content: center;

  .main-content {
    max-width: 100%;
  }
}

.v-list-item__content2 {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-item-align: center;
  align-self: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-flex: 1;
  -ms-flex: 1 1;
  flex: 1 1;
  overflow: hidden;
  padding: 12px 0;
  padding-top: 0px;
  padding-right: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
}

.v-list-item2 {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -ms-flex: 1 1 100%;
  flex: 1 1 100%;
  letter-spacing: normal;
  min-height: 48px;
  outline: none;
  position: relative;
  text-decoration: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.tour-title {
  width: 100%;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 24px;
  line-height: 1.6;
  color: #2196f3;
  padding-top: 4px;
}

.tour-sub-title {
  font-family: 'Helvetica';
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;
}

::v-deep .tour-description {
  text-align: start !important;
}

::v-deep .v-step[x-placement^='right'] {
  left: 36px !important;
}

::v-deep .v-step[x-placement^='right'] .v-step__arrow[data-v-aa0cbe42] {
  border-bottom-color: transparent;
  border-left-color: transparent;
  border-top-color: transparent;
  border-width: 0 50px 52px 0;
  left: -26px;
  margin-left: 0;
  margin-right: 0;
  top: -7px;
}

::v-deep .v-step[x-placement^='left'] .v-step__arrow[data-v-aa0cbe42] {
  border-bottom-color: transparent;
  border-right-color: transparent;
  border-top-color: transparent;
  border-width: 0px 0px 50px 52px !important;
  margin-left: 1px;
  margin-right: -16px;
  right: -0.5rem;
  top: -7px;
}

::v-deep .v-step .v-step__arrow[data-v-aa0cbe42] {
  border-color: #ffffff;
  border-style: solid;
  height: 0;
  margin: 0.5rem;
  position: absolute;
  width: 0;
}

::v-deep .v-step[x-placement^='top'] .v-step__arrow[data-v-aa0cbe42] {
  bottom: -0.5rem !important;
  left: 43px !important;
}

.v-step {
  padding-left: 32px !important;
  padding-right: 32px !important;
  padding-bottom: 15px !important;
  z-index: 999;
  width: 1000px;
  min-height: 100px;
  background-color: #ffffff !important; //rgba(241, 248, 254, 1) !important;
  border-radius: 20px !important;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: black !important;
  max-width: 500px !important;
  top: 35px !important;
  left: -33px !important;
}

.tour-one {
  left: unset;
  top: -33px;
  right: 9px;
}

.tour-two {
  left: 16px;
  top: -33px;
}

.tour-three {
  left: 16px;
  top: -33px;
}

.tour-four {
  left: 16px;
  top: -33px;
}

@-moz-keyframes interaction_bubble {
  0% {
    width: 48px;
    height: 48px;
  }
  25% {
    width: 30px;
    height: 30px;
  }
  50% {
    width: 15px;
    height: 15px;
  }
  75% {
    width: 30px;
    height: 30px;
  }
  100% {
    width: 48px;
    height: 48px;
  }
}

@-webkit-keyframes interaction_bubble {
  0% {
    width: 48px;
    height: 48px;
  }
  25% {
    width: 30px;
    height: 30px;
  }
  50% {
    width: 15px;
    height: 15px;
  }
  75% {
    width: 30px;
    height: 30px;
  }
  100% {
    width: 48px;
    height: 48px;
  }
}

@-o-keyframes interaction_bubble {
  0% {
    width: 48px;
    height: 48px;
  }
  25% {
    width: 30px;
    height: 30px;
  }
  50% {
    width: 15px;
    height: 15px;
  }
  75% {
    width: 30px;
    height: 30px;
  }
  100% {
    width: 48px;
    height: 48px;
  }
}

.tour-btn-container {
  cursor: pointer;
  position: absolute;
  width: 48px;
  height: 48px;
  display: flex;

  .tour-btn-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: solid 1px #e5f1ff;
    margin-top: 10px;

    .tour-btn-circle {
      border-radius: 50%;
      width: 32px;
      height: 32px;
      background-color: #e5f1ff;
      display: flex;
      align-items: center;
      justify-content: center;

      .tour-btn-circle-inner {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: #b3d4fc;
      }
    }
  }
}

.container-wrapper {
  align-items: center;
  display: flex;
  justify-content: center;

  .v-step {
    z-index: 999;
  }

  > .container {
    max-width: 100%;
  }
}

.v-list-item__subtitle {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.2 !important;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87) !important;
  margin-left: 2px;
}

.v-sheet {
  border-radius: 20px !important;
}

.v-card-headline {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 24px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.4;
  letter-spacing: normal;
  color: #2196f3;
}

.v-cart-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  margin-right: 24px;
  box-shadow: 0 2px 20px 0 rgba(100, 181, 246, 0.5);
  border: solid 1px rgba(100, 181, 246, 0.5);
  background-color: #e3f2fd;
}

.v-list-item--active {
  border: solid red 3px;
}
.phishing-col > div {
  height: 100%;
}
::v-deep .v-card {
  padding: 24px !important;
  border-radius: 20px !important;
  box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;

  @media only screen and (max-width: 500px) {
    padding: 16px !important;
  }
}

@media only screen and (max-width: 960px) {
  .v-application .phishing-col {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  .v-application .company-info-col {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  .v-application .overall-stats-col {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  .v-application .last5-col {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
}
</style>
