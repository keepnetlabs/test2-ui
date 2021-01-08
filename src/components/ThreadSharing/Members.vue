<template>
  <v-card flat class="members-content" color="basil">
    <app-dialog
      :status="showAppointANewOwnerModal"
      @changeStatus="showAppointANewOwnerModal = false"
      icon="mdi-lock"
      title="Give admin privileges?"
      :body="`${appointUserName} will be able to access to all settings such as removing users or deleting the community.`"
    >
      <template v-slot:app-dialog-footer>
        <div class="d-flex download-buttons flex-row flex-wrap justify-end">
          <div>
            <v-btn
              class="pa-0 k-dialog__button mr-2"
              text
              color="#f56c6c"
              @click="showAppointANewOwnerModal = false"
              >{{ labels.Cancel }}
            </v-btn>
          </div>
          <div class="d-flex flex-row flex-end">
            <v-btn
              class="pa-0 k-dialog__button"
              text
              color="#2196f3"
              :disabled="isAssignOwnerButtonDisabled"
              @click="appointANewOwnerConfirm"
              >ACCEPT
            </v-btn>
          </div>
        </div>
      </template>
    </app-dialog>
    <app-dialog
      :status="showRemoveFromCommunityModal"
      @changeStatus="showRemoveFromCommunityModal = false"
      icon="mdi-account"
      title="Remove user from community?"
      :subtitle="removeFromCommunityUserName"
      :body="`${removeFromCommunityUserName} will be removed and won’t be able to access the community`"
    >
      <template v-slot:app-dialog-footer>
        <div class="d-flex download-buttons flex-row flex-wrap justify-end">
          <div>
            <v-btn
              class="pa-0 k-dialog__button mr-2"
              text
              color="#f56c6c"
              @click="showRemoveFromCommunityModal = false"
              >{{ labels.Cancel }}
            </v-btn>
          </div>
          <div class="d-flex flex-row flex-end">
            <v-btn
              class="pa-0 k-dialog__button"
              text
              color="#2196f3"
              :disabled="isRemoveFromCommunityButtonDisabled"
              @click="removeFromCommunityConfirm"
              >REMOVE
            </v-btn>
          </div>
        </div>
      </template>
    </app-dialog>
    <v-card-text class="pt-2">
      <v-tabs v-model="tab" class="community-selector">
        <v-tab @click="getMembers()">Members</v-tab>
        <v-tab
          @click="getRequestMembers()"
          v-if="
            communityDetails &&
            communityDetails.myMembershipStatusId &&
            communityDetails.myMembershipStatusId == 1 &&
            communityDetails.privacyStatusId &&
            communityDetails.privacyStatusId === 2
          "
        >
          Requests
          <span v-if="requestMembers.length" class="request-count">
            {{ requestMembers.length }}
          </span>
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item :transition="false" :reverse-transition="false">
          <v-data-iterator
            :items="members"
            :items-per-page.sync="itemsPerPage"
            :page.sync="page"
            :footer-props="{ itemsPerPageOptions }"
            hide-default-footer
            @change="$forceUpdate()"
            :no-results-text="'Sorry, we couldn\'t find any results matching your criteria'"
          >
            <template v-slot:header>
              <div class="search-wrapper">
                <v-text-field
                  @mouseover.native="hover = true"
                  placeholder="Filter by attributes or keywords"
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
                <v-skeleton-loader :loading="membersLoading" type="article, actions">
                  <v-expansion-panels
                    v-for="(member, ind) of props.items"
                    :key="ind"
                    multiple
                    class="mb-4 mt-4 pl-1 pr-1"
                  >
                    <v-expansion-panel class="threat-sharing-content">
                      <div class="ts-header">
                        <div class="ts-title">
                          <img
                            class="threat-sharing-content__logo d-flex"
                            :src="memberImage(member)"
                            alt="logo"
                          />
                          <div class="community-info-wrapper">
                            <h2>{{ member.companyName }}</h2>
                            <div class="community-sub-info">
                              <div class="pa-0">
                                <v-icon class="company-mini-icon">mdi-account-multiple</v-icon>
                                <span class="company-mini-info">{{ member.userCount }} users</span>
                              </div>
                              <div class="pl-4 pa-0">
                                <v-icon class="company-mini-icon">mdi-domain</v-icon>
                                <span class="company-mini-info">{{
                                  member.industryName || 'Unknown'
                                }}</span>
                              </div>
                              <div class="pl-4 pa-0">
                                <v-icon class="company-mini-icon">mdi-clipboard-text</v-icon>
                                <span class="company-mini-info"
                                  >{{ member.postCount }} threat posts</span
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="flex-grow-1"></div>
                        <v-menu offset-y transition="scale-transition">
                          <template v-slot:activator="{ on }">
                            <v-btn icon color="blue" v-on="on" style="order: 2;">
                              <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                          </template>
                          <div class="notification-wrapper notification-wrapper__override">
                            <v-list dense flat class="notification-wrapper__v-list">
                              <v-list-item-group color="primary">
                                <v-list-item @click="seePostedIncidentsClick(member)">
                                  <v-list-item-icon>
                                    <v-icon>mdi-magnify</v-icon>
                                  </v-list-item-icon>
                                  <v-list-item-content>
                                    <v-list-item-title>See posted incidents</v-list-item-title>
                                  </v-list-item-content>
                                </v-list-item>
                                <v-list-item
                                  @click="appointANewOwner(member)"
                                  v-if="!isOwnCompany(member) && isCommunityOwner()"
                                >
                                  <v-list-item-icon>
                                    <v-icon>mdi-account-multiple-plus</v-icon>
                                  </v-list-item-icon>
                                  <v-list-item-content>
                                    <v-list-item-title>Assign as owner</v-list-item-title>
                                  </v-list-item-content>
                                </v-list-item>
                                <v-list-item
                                  @click="removeFromCommunity(member)"
                                  v-if="!isOwnCompany(member) && isCommunityOwner()"
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
                          <pie :key="series[0]" :data="series" />
                        </div>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-skeleton-loader>
              </div>
              <div v-else>
                <v-skeleton-loader :loading="membersLoading" type="article, actions">
                  <div class="empty-members">
                    <p class="empty-members-span">
                      No member in your communities
                    </p>
                  </div>
                </v-skeleton-loader>
              </div>
            </template>
            <template slot="no-data">
              <v-skeleton-loader :loading="membersLoading" type="article, actions">
                <div class="empty-members mt-8">
                  <p class="empty-members-span">
                    {{
                      search.length
                        ? 'Search criteria has no results'
                        : 'No member in your communities'
                    }}
                  </p>
                </div>
              </v-skeleton-loader>
            </template>
            <template v-slot:footer>
              <v-row
                class="mt-2"
                justify="end"
                style="margin: 5px !important;"
                v-if="members && members.length"
              >
                <el-pagination
                  layout="sizes, prev, pager, next,slot"
                  :current-page.sync="page"
                  :page-sizes="itemsPerPageOptions"
                  :page-size="itemsPerPage"
                  @size-change="handleSizeChange"
                  :total="members && members.length"
                >
                  <template>
                    <span class="el-pagination__total el-pagination__text--1">Rows per page:</span>
                    <span class="el-pagination__text el-pagination__text--2">
                      {{ page }}-{{ numberOfPages }}
                      of
                      {{ members && members.length }}
                    </span>
                  </template>
                </el-pagination>
              </v-row>
            </template>
          </v-data-iterator>
        </v-tab-item>
        <v-tab-item :transition="false" :reverse-transition="false">
          <v-data-iterator
            :items="requestMembers"
            :items-per-page.sync="itemsPerPage"
            :footer-props="{ itemsPerPageOptions }"
            hide-default-footer
            :no-results-text="'Sorry, we couldn\'t find any results matching your criteria'"
          >
            <template v-slot:header>
              <div class="search-wrapper">
                <v-text-field
                  @mouseover.native="hover = true"
                  placeholder="Filter by attributes or keywords"
                  outlined
                  dense
                  class="filter-field pt-6"
                  v-model="search"
                ></v-text-field>
                <v-icon class="filter-icon">mdi-filter-variant</v-icon>
              </div>
            </template>
            <template v-slot:default="props">
              <v-skeleton-loader :loading="membersLoading" type="article, actions">
                <v-expansion-panels
                  v-if="props.items && props.items.length > 0"
                  class="mb-4 mt-4 pl-1 pr-1"
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
                        <img src="../../assets/img/logo-min.png" alt="logo" />
                        <div class="community-info-wrapper">
                          <h2>{{ req.companyName }}</h2>
                          <div class="community-sub-info">
                            <div class="pa-0">
                              <v-icon class="company-mini-icon">mdi-account-multiple</v-icon>
                              <span class="company-mini-info">{{ req.userCount }} users</span>
                            </div>
                            <div class="pl-4 pa-0">
                              <v-icon class="company-mini-icon">mdi-domain</v-icon>
                              <span class="company-mini-info"
                                >{{ req.industryName || 'No Category defined' }}
                              </span>
                            </div>
                            <div class="pl-4 pa-0">
                              <v-icon class="company-mini-icon">mdi-clipboard-text</v-icon>
                              <span class="company-mini-info"
                                >{{ req.postCount }} threat posts</span
                              >
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
                          @click="refuseRequest(req.communityRequestResourceId)"
                        >
                          Refuse
                        </v-btn>
                        <v-btn
                          class="accept-btn"
                          block
                          rounded
                          medium
                          @click="acceptRequest(req.communityRequestResourceId)"
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
              </v-skeleton-loader>
            </template>
            <template slot="no-data">
              <v-skeleton-loader :loading="membersLoading" type="article, actions">
                <div class="empty-members">
                  <p class="empty-members-span">
                    No Requests to join your community
                  </p>
                </div>
              </v-skeleton-loader>
            </template>
            <template v-slot:footer>
              <v-row
                class="mt-2"
                justify="end"
                style="margin: 5px !important;"
                v-if="requestMembers && requestMembers.length"
              >
                <el-pagination
                  layout="sizes, prev, pager, next,slot"
                  :current-page.sync="page"
                  :page-sizes="itemsPerPageOptions"
                  :page-size="itemsPerPage"
                  @size-change="handleSizeChange"
                  :total="requestMembers && requestMembers.length"
                >
                  <template>
                    <span class="el-pagination__total el-pagination__text--1">Rows per page:</span>
                    <span class="el-pagination__text el-pagination__text--2">
                      {{ page }}-{{ numberOfPagesForRequest }}
                      of
                      {{ requestMembers && requestMembers.length }}
                    </span>
                  </template>
                </el-pagination>
              </v-row>
            </template>
          </v-data-iterator>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </v-card>
</template>
<script>
import Pie from '@/components/Common/Charts/Pie'
import {
  acceptCommunityMembershipRequest,
  appointNewOwner,
  getCommunityDetails,
  getCommunityMembers,
  getCommunityMembersRequest,
  refuseCommunityMembershipRequest,
  removeFromCommunity
} from '../../api/threadSharing'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'
import AppDialog from '../AppDialog'
import labels from '@/model/constants/labels'

export default {
  components: {
    AppDialog,
    Pie
  },
  data: () => ({
    page: 1,
    labels,
    isRemoveFromCommunityButtonDisabled: false,
    isAssignOwnerButtonDisabled: false,
    membersLoading: true,
    appointUserName: null,
    appointNewOwnerId: null,
    showAppointANewOwnerModal: false,
    removeFromCommunityUserName: null,
    removeCommunityId: null,
    showRemoveFromCommunityModal: false,
    newOwnerRule: {
      limit: (v) => (v && v.length <= 5) || 'You have reached to max limit'
    },
    AppointedCompanyResourceId: null,
    openNewOwnerModal: false,
    communityDetails: null,
    tab: null,
    members: [],
    requestMembers: [],
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
    numberOfPages() {
      return Math.ceil(this.members && this.members.length / this.itemsPerPage)
    },
    numberOfPagesForRequest() {
      return Math.ceil(this.requestMembers && this.requestMembers.length / this.itemsPerPage)
    },
    communityPrivacy() {
      return (
        this.$store.state.threadSharing.selectedCommunity.privacy ||
        JSON.parse(localStorage.getItem('communityPrivacy'))
      )
    },
    userCompany() {
      //return this.$store.state.auth.user.currentCompany.id @todo iceman delete
      return localStorage.getItem('companyName')
    }
  },
  methods: {
    handleSizeChange(val) {
      this.itemsPerPage = val
    },
    memberImage(member) {
      return member.logoUrl || require('../../assets/img/no-logo.png')
    },
    seePostedIncidentsClick(item) {
      this.$emit('selectedMemberPost', item)
    },
    isCommunityOwner() {
      return localStorage.getItem('isCommunityOwner') === 'owner'
    },
    isOwnCompany(item) {
      return item.membershipStatusId == 1
    },
    appointANewOwner(item) {
      this.appointNewOwnerId = item.companyResourceId
      this.appointUserName = item.companyName
      this.showAppointANewOwnerModal = true
    },
    appointANewOwnerConfirm() {
      const payload = {
        AppointedCompanyResourceId: this.appointNewOwnerId
      }
      this.isAssignOwnerButtonDisabled = true
      appointNewOwner(this.$route.params.id, payload)
        .then(() => {
          this.getMembers()
          this.showAppointANewOwnerModal = false
          setTimeout(() => {
            this.$store.dispatch('rightColumn/changeReloadRightColumnData', true).finally(() => {
              this.isAssignOwnerButtonDisabled = false
            })
          }, 500)
        })
        .catch(() => {
          this.isAssignOwnerButtonDisabled = false
        })
    },
    debounce(fn, delay) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        fn()
      }, delay)
    },
    getCommunityDetails() {
      this.membersLoading = true
      getCommunityDetails(this.$route.params.id).then((response) => {
        localStorage.setItem(
          'isCommunityOwner',
          response.data.data.myMembershipStatusId == 1 ? 'owner' : 'member'
        )
        this.communityDetails = response.data.data
        this.getMembers()
        this.getRequestMembers()
      })
    },
    listRequests() {},
    refuseRequest(reqId) {
      refuseCommunityMembershipRequest(reqId).then(() => {
        this.getMembers()
        this.getRequestMembers()
      })
    },
    acceptRequest(reqId) {
      acceptCommunityMembershipRequest(reqId).then(() => {
        this.getMembers()
        this.getRequestMembers()
        setTimeout(() => {
          this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
        }, 500)
      })
    },
    isOwnerOfTheCommunity() {},
    removeFromCommunity(item) {
      this.removeCommunityId = item.companyResourceId
      this.removeFromCommunityUserName = item.companyName
      this.showRemoveFromCommunityModal = true
    },
    removeFromCommunityConfirm() {
      this.isRemoveFromCommunityButtonDisabled = true
      removeFromCommunity(this.$route.params.id, this.removeCommunityId)
        .then(() => {
          this.getMembers()
          this.showRemoveFromCommunityModal = false
          setTimeout(() => {
            this.$store.dispatch('rightColumn/changeReloadRightColumnData', true).finally(() => {
              this.isRemoveFromCommunityButtonDisabled = false
            })
          }, 500)
        })
        .catch(() => {
          this.isRemoveFromCommunityButtonDisabled = false
        })
    },
    onRemoveMember() {},
    getMembers() {
      const payload = {
        pageNumber: 1,
        pageSize: 50000,
        orderBy: 'CompanyName',
        ascending: true,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [
                {
                  FieldName: 'CompanyName',
                  Operator: 'Contains',
                  Value: this.search
                }
              ],
              FilterGroups: []
            }
          ]
        }
      }
      this.membersLoading = true
      getCommunityMembers(this.$route.params.id, payload)
        .then((response) => {
          const { data } = response
          this.members = data.data.results
        })

        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.code === 'RESOURCE_NOT_FOUND'
          ) {
            this.members = []
          }
        })
        .finally(() => {
          this.membersLoading = false
        })
    },
    getRequestMembers() {
      if (
        this.communityDetails.myMembershipStatusId == 1 &&
        this.communityDetails.privacyStatusId == 2
      ) {
        const payload = {
          pageNumber: 1,
          pageSize: 50000,
          orderBy: 'CompanyName',
          ascending: true,
          filter: {
            Condition: 'AND',
            FilterGroups: [
              {
                Condition: 'AND',
                FilterItems: [
                  {
                    FieldName: 'CompanyName',
                    Operator: 'Contains',
                    Value: this.search
                  }
                ],
                FilterGroups: []
              }
            ]
          }
        }
        this.membersLoading = true
        getCommunityMembersRequest(this.$route.params.id, payload)
          .then((response) => {
            const { data } = response
            this.requestMembers = data.data.results
          })

          .catch((error) => {
            if (
              error.response &&
              error.response.data &&
              error.response.data.code === 'RESOURCE_NOT_FOUND'
            ) {
              this.requestMembers = []
            }
          })
          .finally(() => {
            this.membersLoading = false
          })
      }
    }
  },
  watch: {
    getSelectedCompany(val) {
      if (val) this.getMembers()
    },
    search: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (newVal) {
          this.debounce(() => {
            if (this.tab === 0) {
              this.getMembers()
            } else {
              this.getRequestMembers()
            }
          }, 1000)
        } else {
          if (this.tab === 0) {
            this.getMembers()
          } else {
            this.getRequestMembers()
          }
        }
      }
    }
  }
}
</script>
<style lang="scss">
.members-content {
  .el-pager {
    padding: 0 !important;
  }

  .el-pagination {
    display: flex;
    .el-pagination__text--1 {
      order: -1;
      margin-right: 8px;
    }
    .el-pagination__text--2 {
      margin-right: 42px;
    }
    .btn-prev {
      order: 1;
    }
    .el-pager {
      order: 2;
    }
    .btn-next {
      order: 3;
    }
    .btn-next {
      padding-left: 0 !important;
    }
    .btn-next .el-icon,
    .btn-prev .el-icon {
      font-size: 18px;
      font-weight: bolder;
      color: #757575;
      &:hover {
        color: #2196f3 !important;
      }
    }

    @media (max-width: 480px) {
      white-space: wrap;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      width: 100%;
    }
    &__total {
      margin-right: 32px;
      @media (max-width: 480px) {
        margin-right: 0;
      }
    }
    &__sizes {
      margin-right: 27px;
      @media (max-width: 480px) {
        margin-right: 0;
      }
    }
  }
  .el-pager > li {
    min-width: 13px;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    opacity: 0.7;
    color: rgba(0, 0, 0, 0.87);
    &.active {
      opacity: 1;
      font-size: 14px;
      font-weight: 600;
      color: #2196f3 !important;
    }
  }

  .el-pagination .btn-prev {
    padding-right: 0;
  }
  .notification-wrapper {
    padding: 0 !important;
    width: 100%;
    box-shadow: 0 8px 10px -3px rgba(255, 255, 255, 0.14), 0 2px 4px 0 rgba(255, 255, 255, 0.14),
      0 3px 14px 2px rgba(255, 255, 255, 0.12);
  }
  ::v-deep .community-selector {
    .v-tabs-bar {
      height: 44px !important;
    }
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
    background-color: #ffffff;
    &__logo {
      font-size: 12px;
      height: 46px;
      width: 46px;
    }
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
        @media only screen and (max-width: 750px) {
          flex-direction: column;
          padding-left: 13px;
          .pl-4 {
            padding-left: 0 !important;
          }
        }
        > div {
          line-height: 10px;
          width: auto;
        }

        .company-mini-icon {
          font-size: 16px !important;
          margin-right: 8px;
          top: 2px;
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
    flex-wrap: wrap;
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
      text-transform: uppercase !important;
    }

    .accept-btn {
      color: #fff !important;
      border-radius: 18px !important;
      box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5) !important;
      background-color: #2196f3 !important;
      min-width: 78px !important;
      max-width: 78px !important;
      height: 36px !important;
      text-transform: uppercase !important;
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
}
</style>
