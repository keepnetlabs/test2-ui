<template>
  <v-card flat class="members-content" color="basil">
    <app-dialog
      icon="mdi-lock"
      title="Give admin privileges?"
      :status="showAppointANewOwnerModal"
      :body="`${appointUserName} will be able to access to all settings such as removing users or deleting the community.`"
      @changeStatus="showAppointANewOwnerModal = false"
    >
      <template v-slot:app-dialog-footer>
        <div class="d-flex download-buttons flex-row flex-wrap justify-end">
          <div>
            <v-btn
              class="pa-0 k-dialog__button mr-2"
              text
              color="#f56c6c"
              @click="showAppointANewOwnerModal = false"
              id="threat-sharing-members-new-owner-modal-cancel-button"
              >{{ labels.Cancel }}
            </v-btn>
          </div>
          <div class="d-flex flex-row flex-end">
            <v-btn
              class="pa-0 k-dialog__button"
              text
              color="#2196f3"
              id="threat-sharing-members-new-owner-modal-accept-button"
              :disabled="isAssignOwnerButtonDisabled"
              @click="appointANewOwnerConfirm"
              >ACCEPT
            </v-btn>
          </div>
        </div>
      </template>
    </app-dialog>
    <app-dialog
      icon="mdi-account"
      title="Remove user from community?"
      title-id="text--threat-sharing-members-popup-title"
      subtitle-id="text--threat-sharing-members-popup-subtitle"
      :subtitle="removeFromCommunityUserName"
      :body="`${removeFromCommunityUserName} will be removed and won’t be able to access the community`"
      :status="showRemoveFromCommunityModal"
      @changeStatus="showRemoveFromCommunityModal = false"
    >
      <template v-slot:app-dialog-footer>
        <div class="d-flex download-buttons flex-row flex-wrap justify-end">
          <div>
            <v-btn
              class="pa-0 k-dialog__button mr-2"
              text
              color="#f56c6c"
              @click="showRemoveFromCommunityModal = false"
              id="threat-sharing-members-remove-community-cancel-button"
              >{{ labels.Cancel }}
            </v-btn>
          </div>
          <div class="d-flex flex-row flex-end">
            <v-btn
              class="pa-0 k-dialog__button"
              text
              color="#2196f3"
              :disabled="isRemoveFromCommunityButtonDisabled"
              id="threat-sharing-members-remove-community-remove-button"
              @click="removeFromCommunityConfirm"
              >REMOVE
            </v-btn>
          </div>
        </div>
      </template>
    </app-dialog>
    <v-card-text class="pt-2">
      <v-tabs v-model="tab" class="community-selector">
        <v-tab id="threat-sharing-members-tab-button" @click="getMembers()">Members</v-tab>
        <v-tab
          @click="getRequestMembers()"
          id="threat-sharing-requests-tab-button"
          v-if="showRequestMembersTab"
        >
          Requests
          <span
            id="text--threat-sharing-members-members-length"
            v-if="requestMembers.length"
            class="request-count"
          >
            {{ requestMembers.length }}
          </span>
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item :transition="false" :reverse-transition="false">
          <v-data-iterator
            hide-default-footer
            :items="members"
            :items-per-page.sync="itemsPerPage"
            :page.sync="page"
            :footer-props="{ itemsPerPageOptions }"
            :no-results-text="'Sorry, we couldn\'t find any results matching your criteria'"
            @change="$forceUpdate()"
          >
            <template v-slot:header>
              <div class="search-wrapper">
                <v-text-field
                  @mouseover.native="hover = true"
                  id="input--threat-sharing-members-search"
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
                    v-for="(member, index) of props.items"
                    :key="index"
                    multiple
                    class="mb-4 mt-4 pl-1 pr-1"
                  >
                    <member-card
                      :member="member"
                      :index="index"
                      :memberImage="memberImage(member)"
                      :canAppointNewOwner="!isOwnCompany(member) && isCommunityOwner()"
                      :canRemoveFromCommunity="!isOwnCompany(member) && isCommunityOwner()"
                      :series="series"
                      @seePostedIncidents="seePostedIncidentsClick(member)"
                      @appointNewOwner="appointANewOwner(member)"
                      @removeFromCommunity="removeFromCommunity(member)"
                    />
                  </v-expansion-panels>
                </v-skeleton-loader>
              </div>
              <div v-else>
                <v-skeleton-loader :loading="membersLoading" type="article, actions">
                  <div class="empty-members">
                    <p
                      id="item--threat-sharing-member-no-member-in-community"
                      class="empty-members-span"
                    >
                      No member in your communities
                    </p>
                  </div>
                </v-skeleton-loader>
              </div>
            </template>
            <template slot="no-data">
              <v-skeleton-loader :loading="membersLoading" type="article, actions">
                <div class="empty-members mb-10">
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
            hide-default-footer
            :items="requestMembers"
            :items-per-page.sync="itemsPerPage"
            :footer-props="{ itemsPerPageOptions }"
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
                    <request-card
                      :request="req"
                      @refuseRequest="refuseRequest(req.communityRequestResourceId)"
                      @acceptRequest="acceptRequest(req.communityRequestResourceId)"
                      @togglePanel="toggle = !toggle"
                    />
                  </v-expansion-panel>
                </v-expansion-panels>
                <div v-else>
                  <div class="empty-members mb-10">
                    <p class="empty-members-span">
                      No Requests to join your community
                    </p>
                  </div>
                </div>
              </v-skeleton-loader>
            </template>
            <template slot="no-data">
              <v-skeleton-loader :loading="membersLoading" type="article, actions">
                <div class="empty-members mb-10">
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
import {
  acceptCommunityMembershipRequest,
  appointNewOwner,
  getCommunityDetails,
  getCommunityMembers,
  getCommunityMembersRequest,
  refuseCommunityMembershipRequest,
  removeFromCommunity
} from '@/api/threatSharing'
import AppDialog from '@/components/AppDialog'
import labels from '@/model/constants/labels'
import MemberCard from '@/components/ThreatSharing/Members/MemberCard'
import RequestCard from '@/components/ThreatSharing/Members/RequestCard'

export default {
  components: {
    AppDialog,
    MemberCard,
    RequestCard
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
    showRequestMembersTab() {
      return this.communityDetails &&
              this.communityDetails.myMembershipStatusId &&
              this.communityDetails.myMembershipStatusId == 1 &&
              this.communityDetails.privacyStatusId &&
              this.communityDetails.privacyStatusId === 2
    },
    numberOfPages() {
      return Math.ceil(this.members && this.members.length / this.itemsPerPage)
    },
    numberOfPagesForRequest() {
      return Math.ceil(this.requestMembers && this.requestMembers.length / this.itemsPerPage)
    },
    communityPrivacy() {
      return (
        this.$store.state.threatSharing.selectedCommunity.privacy ||
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
      return member.logoUrl || require('../../../assets/img/no-logo.png')
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
      let _this = this
      getCommunityDetails(this.$route.params.id).then((response) => {
        localStorage.setItem(
          'isCommunityOwner',
          response.data.data.myMembershipStatusId == 1 ? 'owner' : 'member'
        )
        this.communityDetails = response.data.data
        _this.$parent.$parent.$parent.$parent.$parent.$parent.communityName =
          response.data.data.name
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

<style lang="scss" src="./Members.scss"></style>
