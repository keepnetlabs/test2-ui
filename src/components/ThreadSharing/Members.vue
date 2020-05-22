<template>
  <v-card flat color="basil">
    <v-overlay
      id="delete-community-overlay"
      fixed
      :opacity="0.46"
      :value="isWantToRemoveMember"
      :z-index="999"
    >
      <v-card
        id="delete-community-card"
        light
        class="confirm-dialog pb-4 pa-6"
        style="width: 444px;"
      >
        <v-list-item class="pl-0 pr-0">
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon medium left color="blue" class="ml-2">mdi-account-outline</v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline"
              >Remove user from community?
            </v-list-item-title>
            <v-list-item-subtitle class="v-card-sub-header">
              User will be removed from community
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="pl-0 pr-0 pt-7 pb-6">
          <span class="delete-info"
            >User will be removed and won’t be able to access the community
          </span>
        </v-list-item>
        <div class="d-flex flex-row flex-wrap justify-end">
          <v-btn
            id="delete-community-cancel-btn"
            text
            color="#f56c6c"
            @click="isWantToRemoveMember = false"
            >CANCEL
          </v-btn>
          <v-btn id="delete-community-delete-btn" text color="#2196f3" @click="onRemoveMember"
            >REMOVE
          </v-btn>
        </div>
      </v-card>
    </v-overlay>
    <v-card-text class="pt-2">
      <v-tabs v-model="tab" class="community-selector">
        <v-tab @click="getMembers()">Members</v-tab>
        <v-tab
          v-if="
            isOwnerOfTheCommunity() && (communityPrivacy === 'true' || communityPrivacy === true)
          "
          @click="listRequests"
        >
          Requests
          <span v-if="memberRequests.length" class="request-count">
            {{ memberRequests.length }}
          </span>
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-data-iterator
            :items="members"
            :items-per-page.sync="itemsPerPage"
            :footer-props="{ itemsPerPageOptions }"
            :search="search"
            :no-results-text="'Sorry, we couldn\'t find any results matching your criteria'"
          >
            <template v-slot:header>
              <div class="search-wrapper">
                <v-text-field
                  @mouseover.native="hover = true"
                  label="Filter by attributes or keywords"
                  outlined
                  dense
                  class="filter-field pt-6"
                  v-model="search"
                ></v-text-field>
                <v-icon class="filter-icon">mdi-filter-variant</v-icon>
              </div>
            </template>
            <template v-slot:default="props">
              <div v-if="props.items && props.items.length">
                <v-expansion-panels
                  v-for="(member, ind) of props.items"
                  :key="ind"
                  multiple
                  class="mb-4 mt-4"
                >
                  <v-expansion-panel class="threat-sharing-content">
                    <div class="ts-header">
                      <div class="ts-title">
                        <img src="../../assets/img/logo-min.png" alt="KeepNet" />
                        <div class="community-info-wrapper">
                          <h2>{{ member.CompanyName }}</h2>
                          <div class="community-sub-info">
                            <div class="pa-0">
                              <v-icon class="company-mini-icon">mdi-account-multiple</v-icon>
                              <span class="company-mini-info">{{ member.UserCount }} users</span>
                            </div>
                            <div class="pl-4 pa-0">
                              <v-icon class="company-mini-icon">mdi-domain</v-icon>
                              <span class="company-mini-info">{{
                                member.CategoryName || 'Unknown'
                              }}</span>
                            </div>
                            <div class="pl-4 pa-0">
                              <v-icon class="company-mini-icon">mdi-clipboard-text</v-icon>
                              <span class="company-mini-info"
                                >{{ member.PostCount }} threat posts</span
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="flex-grow-1"></div>
                      <v-menu offset-y transition="scale-transition">
                        <template v-slot:activator="{ on }">
                          <v-btn icon color="blue" v-on="on" style="order: 2">
                            <v-icon>mdi-dots-vertical</v-icon>
                          </v-btn>
                        </template>
                        <div class="notification-wrapper">
                          <v-list dense flat>
                            <v-list-item-group color="primary">
                              <v-list-item>
                                <v-list-item-icon>
                                  <v-icon>mdi-magnify</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                  <v-list-item-title>See posted incidents</v-list-item-title>
                                </v-list-item-content>
                              </v-list-item>
                              <v-list-item
                                v-if="setRemoveFromCommunityVisibility(member)"
                                @click="removeFromCommunity(member.CompanyId)"
                              >
                                <v-list-item-icon>
                                  <v-icon>mdi-delete</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                  <v-list-item-title>Remove from community</v-list-item-title>
                                </v-list-item-content>
                              </v-list-item>
                            </v-list-item-group>
                          </v-list>
                        </div>
                      </v-menu>
                    </div>
                    <v-expansion-panel-content class="expand-body member-company-body">
                      <div class="members-posts">
                        <div class="members-posts-header">
                          Top posts in community
                        </div>
                        <div class="members-post-list">
                          <a href="#">Harmful xls file</a>
                          <a href="#">Whatsapp phishing attempt</a>
                          <a href="#">Win a prize</a>
                        </div>
                        <div class="members-post-see-all pt-1">
                          <a href="#">SEE ALL POSTS</a>
                        </div>
                      </div>
                      <div class="members-pie">
                        <apexchart
                          :key="series[0]"
                          type="pie"
                          height="150"
                          :options="chartOptions"
                          :series="series"
                        />
                      </div>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>
              <div v-else>
                <div class="empty-members">
                  <p class="empty-members-span">
                    No member in your communities, yet
                  </p>
                </div>
              </div>
            </template>
            <template slot="no-data">
              <div class="empty-members">
                <p class="empty-members-span">
                  No member in your communities, yet
                </p>
              </div>
            </template>
          </v-data-iterator>
        </v-tab-item>
        <v-tab-item>
          <v-data-iterator
            :items="memberRequests"
            :items-per-page.sync="itemsPerPage"
            :footer-props="{ itemsPerPageOptions }"
            :search="search"
            :no-results-text="'Sorry, we couldn\'t find any results matching your criteria'"
          >
            <template v-slot:default="props">
              <v-expansion-panels
                v-if="props.items && props.items.length > 0"
                class="mb-4 mt-4"
                multiple
                readonly
              >
                <v-expansion-panel
                  v-for="(req, ind) in props.items"
                  :key="ind"
                  class="threat-sharing-content community-rqts"
                >
                  <div class="member-requests ts-header">
                    <div class="ts-title">
                      <img src="../../assets/img/logo-min.png" alt="Keepnet" />
                      <div class="community-info-wrapper">
                        <h2>{{ req.CompanyName }}</h2>
                        <div class="community-sub-info">
                          <div class="pa-0">
                            <v-icon class="company-mini-icon">mdi-account-multiple</v-icon>
                            <span class="company-mini-info">{{ req.UserCount }} users</span>
                          </div>
                          <div class="pl-4 pa-0">
                            <v-icon class="company-mini-icon">mdi-domain</v-icon>
                            <span class="company-mini-info"
                              >{{ req.BusinessCategory || 'No Category defined' }}
                            </span>
                          </div>
                          <div class="pl-4 pa-0">
                            <v-icon class="company-mini-icon">mdi-clipboard-text</v-icon>
                            <span class="company-mini-info">{{ req.PostCount }} threat posts</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="request-btns flex-grow-1">
                      <v-btn
                        class="refuse-btn"
                        block
                        rounded
                        medium
                        @click="refuseRequest(req.CommunityCompanyRequestId)"
                      >
                        Refuse
                      </v-btn>
                      <v-btn
                        class="accept-btn"
                        block
                        rounded
                        medium
                        @click="acceptRequest(req.CommunityCompanyRequestId)"
                      >
                        Accept
                      </v-btn>
                    </div>
                    <v-expansion-panel-header
                      style="display: none;"
                      @click="toggle = !toggle"
                      disable-icon-rotate
                    >
                      <template v-slot:actions>
                        &nbsp;
                      </template>
                    </v-expansion-panel-header>
                  </div>
                </v-expansion-panel>
              </v-expansion-panels>
              <div v-else>
                <div class="empty-members">
                  <p class="empty-members-span">
                    No Requests to join your community
                  </p>
                </div>
              </div>
            </template>
            <template slot="no-data">
              <div class="empty-members">
                <p class="empty-members-span">
                  No Requests to join your community
                </p>
              </div>
            </template>
          </v-data-iterator>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </v-card>
</template>
<script>
import VueApexCharts from 'vue-apexcharts'
import { mapGetters } from 'vuex'

export default {
  components: {
    apexchart: VueApexCharts
  },
  data: () => ({
    tab: null,
    members: ['dummy community', 'dummy 32'],
    search: '',
    itemsPerPageOptions: [5, 10, 20],
    itemsPerPage: 5,
    toggle: false,
    toggles: [],
    series: [44, 80],
    chartOptions: {
      labels: ['Phishing', 'Malicious'],
      fill: {
        colors: ['#f56c6c', '#e6a23c']
      },
      colors: ['#f56c6c', '#e6a23c'],
      legend: {
        verticalAlign: 'right',
        fontSize: '16px',
        fontFamily: undefined,
        position: 'right',
        offsetX: 0,
        markers: {
          width: 16,
          height: 16,
          strokeWidth: 16,
          shape: 'square',
          radius: 0,
          offsetX: 20
        },
        itemMargin: {
          horizontal: 6,
          vertical: 15
        },
        onItemClick: {
          toggleDataSeries: true
        },
        onItemHover: {
          highlightDataSeries: true
        },
        labels: {
          colors: ['#f56c6c', '#e6a23c']
        }
      },
      dataLabels: {
        enabled: false
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
              offsetX: -30,
              offsetY: 10
            },
            itemMargin: {
              horizontal: 100,
              vertical: 0
            },
            legend: {
              position: 'bottom',
              offsetY: -10
            }
          }
        }
      ]
    },
    isWantToRemoveMember: false,
    memberCompId: null
  }),
  computed: {
    ...mapGetters({
      memberList: 'threadSharing/membersGetter',
      selectedCommunity: 'threadSharing/selectedCommunityGetter',
      memberRequests: 'threadSharing/memberRequestsGetter',
      fetchedCommunity: 'threadSharing/fetchedCommunGetter',
      getSelectedCompany: 'dashboard/getSelectedCompany'
    }),
    communityPrivacy() {
      return (
        this.$store.state.threadSharing.selectedCommunity.privacy ||
        JSON.parse(localStorage.getItem('communityPrivacy'))
      )
    },
    userCompany() {
      return this.$store.state.auth.user.currentCompany.id
    }
  },
  methods: {
    setRemoveFromCommunityVisibility(member) {
      return (
        this.selectedCommunity &&
        this.isOwnerOfTheCommunity() &&
        member.CompanyId !== this.getSelectedCompany.companyId
      )
    },
    listRequests() {
      this.$store.dispatch(
        'threadSharing/getMemberRequests',
        this.selectedCommunity.id || localStorage.getItem('communityId')
      )
    },
    refuseRequest(reqId) {
      this.$store
        .dispatch('threadSharing/declineMemberRequest', {
          CommunityCompanyRequestId: reqId,
          ModifyUserId: localStorage.getItem('userId')
        })
        .then(() => {
          this.listRequests()
        })
    },
    acceptRequest(reqId) {
      this.$store
        .dispatch('threadSharing/acceptMemberRequest', {
          CommunityCompanyRequestId: reqId,
          ModifyUserId: localStorage.getItem('userId')
        })
        .then(() => {
          this.$store.dispatch('threadSharing/getCommunityInfo')
          this.listRequests()
        })
    },
    isOwnerOfTheCommunity() {
      const creator = localStorage.getItem('communityCompanyId')
      const user = localStorage.getItem('companyId')
      if (
        user == creator ||
        this.getSelectedCompany.companyId === this.selectedCommunity.communityCompanyId
      ) {
        return true
      } else {
        return false
      }
    },
    removeFromCommunity(compId) {
      this.isWantToRemoveMember = true
      this.memberCompId = compId
    },
    onRemoveMember() {
      const obj = {
        CommunityId: localStorage.getItem('communityId'),
        ModifyUserId: localStorage.getItem('userId'),
        CompanyId: this.memberCompId
      }
      this.$store.dispatch('threadSharing/deleteCompFromCommunity', obj).then(() => {
        this.getMembers()
        this.isWantToRemoveMember = false
      })
    },
    getMembers() {
      this.$store.dispatch('threadSharing/getMembers')
      this.$store.dispatch(
        'threadSharing/getMemberRequests',
        this.selectedCommunity.id || localStorage.getItem('communityId')
      )
    }
  },
  watch: {
    memberList(val) {
      if (val) this.members = val
    },
    getSelectedCompany(val) {
      if (val) this.getMembers()
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .community-selector {
  .v-tabs-bar {
    height: 44px !important;
  }
}

::v-deep .community-selector .v-slide-group__wrapper {
  background-color: #f5f7fa !important;
  height: 44px !important;
  padding-left: 0 !important;

  .v-tab {
    font-weight: 400;
    font-size: 14px !important;
    margin-top: 6px;
    margin-right: 32px !important;
  }
}

::v-deep .community-selector .v-slide-group__wrapper > div {
  height: 100%;
  margin-right: 0 !important;
}

.v-tab {
  padding: 0 3px !important;
  font-size: 20px;
  font-weight: 400;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.15;
  letter-spacing: normal;
  text-transform: none;
  color: rgba(0, 0, 0, 0.87);
  min-width: min-content !important;
  text-align: left !important;
}

.search-wrapper {
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  ::v-deep .v-text-field__details {
    display: none !important;
  }

  > div {
    padding-right: 10px;
  }

  .filter-icon {
    color: rgba(0, 0, 0, 0.34) !important;
    cursor: pointer;
  }
}

.threat-sharing-content {
  width: 100%;
  border-radius: 20px !important;
  box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
    0 3px 1px -2px rgba(80, 80, 80, 0.12) !important;
  background-color: #ffffff;
}

.threat-sharing-content.community-rqts {
  margin-bottom: 16px;
}

.threat-sharing-content.community-rqts::after {
  border-top: none !important;
}

.ts-header {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  padding: 24px;

  @media only screen and (max-width: 750px) {
    justify-content: center;
  }

  .v-btn--icon.v-size--default {
    float: right !important;
    max-width: 36px !important;
  }
}

.ts-title {
  display: flex;
  align-items: center;
  min-width: 300px;
  max-width: 70%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  @media only screen and (max-width: 1025px) {
    min-width: 360px;
    width: 360px;
  }
  @media only screen and (max-width: 750px) {
    min-width: 100%;
    width: 100%;
    padding-bottom: 26px;
  }

  h2 {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.3;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 0 !important;
  }

  img {
    max-width: 46px;
    max-height: 46px;
    margin-right: 16px;
    border: solid 0.5px #dcdcdc;
  }

  .community-info-wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    max-width: 85%;

    h2 {
      display: block;
      max-width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .community-sub-info {
      display: flex;
      flex-direction: row;
      padding-top: 5px;

      @media only screen and (max-width: 750px) {
        flex-direction: column;
        padding-left: 13px;

        .pl-4 {
          padding-left: 0 !important;
        }
      }

      > div {
        width: auto;
      }

      .company-mini-icon {
        font-size: 16px !important;
        margin-right: 8px;
      }

      .company-mini-info {
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.58;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
      }
    }
  }
}

.ts-body {
  margin-top: 8px;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}

.ts-user-comp {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.58;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);

  a {
    text-decoration: none;
  }

  .ts-user-date {
    font-weight: bold;
  }
}

.ts-user-comp-detail {
  align-items: center;
  display: flex;
}

.ts-community-industry {
  font-family: 'Open Sans', sans-serif !important;
  color: rgba(0, 0, 0, 0.87) !important;
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
}

.ts-people-icon {
  font-size: 16px;
}

.notification-wrapper {
  background-color: #fff;
}

.v-menu__content {
  border-radius: 8px !important;
  box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8) !important;

  .v-list-item {
    padding-left: 29px !important;
    padding-right: 16px !important;
  }

  .v-list-item__title {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }
}

.v-application--is-ltr .v-list-item__icon:first-child {
  margin-right: 10px !important;
}

.v-expansion-panel-header {
  max-width: 120px !important;
  padding: 0 !important;

  @media only screen and (max-width: 750px) {
    max-width: 95px !important;
  }
}

.member-company-body {
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .members-posts {
    float: left;
    width: 50%;

    @media only screen and (max-width: 750px) {
      width: 100%;
    }

    .members-posts-header {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }

    .members-post-list {
      display: flex;
      flex-direction: column;
      margin-bottom: 8px;
      margin-top: 10px;

      > a {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        font-weight: 400;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #2196f3;
        margin-bottom: 2px;
        text-decoration: unset;
        width: 100%;
      }
    }

    .members-post-see-all > a {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 400;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      text-decoration: unset;
      color: #2196f3;
    }
  }

  .members-pie {
    float: left;
    width: 50%;

    @media only screen and (max-width: 750px) {
      width: 100%;
      padding-bottom: 20px;
    }
  }
}

::v-deep .apexcharts-legend-marker {
  margin-right: 16px !important;
}

::v-deep .apexcharts-legend-series {
  align-items: center;
  display: flex;
}

.request-btns {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  .refuse-btn {
    color: #fff !important;
    border-radius: 18px !important;
    box-shadow: 0 2px 5px 0 rgba(248, 162, 162, 0.5) !important;
    background-color: #f56c6c !important;
    min-width: 78px !important;
    max-width: 78px !important;
    height: 36px !important;
    margin-right: 14px;
    text-transform: capitalize !important;
  }

  .accept-btn {
    color: #fff !important;
    border-radius: 18px !important;
    box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5) !important;
    background-color: #2196f3 !important;
    min-width: 78px !important;
    max-width: 78px !important;
    height: 36px !important;
    text-transform: capitalize !important;
  }

  @media only screen and (max-width: 950px) {
    justify-content: center;
    padding-top: 20px;
  }
}

.request-count {
  align-items: center;
  background-color: #d32f2f;
  border-radius: 50%;
  color: #fff;
  display: flex;
  font-size: 12px;
  line-height: 18px;
  justify-content: center;
  position: absolute;
  top: 0;
  right: -13px;
  height: 16px;
  width: 16px;
}

::v-deep .v-expansion-panel:before {
  box-shadow: unset !important;
}

@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  ::v-deep .v-expansion-panel-header > div {
    margin-top: 5px;
  }
}

.empty-members {
  padding-top: 40px !important;

  p {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 24px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: #000;
    text-align: center;
  }
}

.v-card-headline {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 20px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.4;
  letter-spacing: normal;
  color: #2196f3;
}

.v-card-sub-header {
  font-family: Helvetica;
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  color: #000 !important;
}

.edit-name-textfield,
.edit-description,
.edit-select {
  font-size: 13px !important;
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

.delete-info {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.72);
}
</style>
