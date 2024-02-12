<template>
  <v-card flat class="members-content" color="basil">
    <GiveAdminAccessToMemberDialog
      v-if="showAppointANewOwnerModal"
      :status="showAppointANewOwnerModal"
      :appoint-user-name="appointUserName"
      :is-action-button-disabled="isAssignOwnerButtonDisabled"
      @on-close="showAppointANewOwnerModal = false"
      @on-confirm="appointANewOwnerConfirm"
    />
    <RemoveUserFromCommunityDialog
      v-if="showRemoveFromCommunityModal"
      :status="showRemoveFromCommunityModal"
      :remove-from-community-user-name="removeFromCommunityUserName"
      :is-action-button-disabled="isRemoveFromCommunityButtonDisabled"
      @on-close="showRemoveFromCommunityModal = false"
      @on-confirm="removeFromCommunityConfirm"
    />
    <v-card-text class="pt-2">
      <v-tabs v-model="tab" class="community-selector">
        <v-tab id="threat-sharing-members-tab-button" @click="getMembers()">Members</v-tab>
        <v-tab
          v-if="showRequestMembersTab"
          id="threat-sharing-requests-tab-button"
          @click="getRequestMembers()"
        >
          Requests
          <span
            v-if="requestMembers.length"
            id="text--threat-sharing-members-members-length"
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
            <template #header>
              <div class="search-wrapper">
                <v-text-field
                  v-model="search"
                  id="input--threat-sharing-members-search"
                  placeholder="Filter by attributes or keywords"
                  outlined
                  dense
                  class="filter-field pt-6"
                ></v-text-field>
              </div>
            </template>
            <template #default="props">
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
            <template #footer>
              <v-row
                v-if="members && members.length"
                class="mt-2"
                justify="end"
                style="margin: 5px !important;"
              >
                <el-pagination
                  layout="sizes, prev, pager, next,slot"
                  :current-page.sync="page"
                  :page-sizes="itemsPerPageOptions"
                  :page-size="itemsPerPage"
                  :total="members && members.length"
                  @size-change="handleSizeChange"
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
            <template #header>
              <div class="search-wrapper">
                <v-text-field
                  placeholder="Filter by attributes or keywords"
                  outlined
                  dense
                  class="filter-field pt-6"
                  v-model="search"
                ></v-text-field>
              </div>
            </template>
            <template #default="props">
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
                    <p class="empty-members-span">No Requests to join your community</p>
                  </div>
                </div>
              </v-skeleton-loader>
            </template>
            <template slot="no-data">
              <v-skeleton-loader :loading="membersLoading" type="article, actions">
                <div class="empty-members mb-10">
                  <p class="empty-members-span">No Requests to join your community</p>
                </div>
              </v-skeleton-loader>
            </template>
            <template v-slot:footer>
              <v-row
                v-if="requestMembers && requestMembers.length"
                class="mt-2"
                justify="end"
                style="margin: 5px !important;"
              >
                <el-pagination
                  layout="sizes, prev, pager, next,slot"
                  :current-page.sync="page"
                  :page-sizes="itemsPerPageOptions"
                  :page-size="itemsPerPage"
                  :total="requestMembers && requestMembers.length"
                  @size-change="handleSizeChange"
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
import labels from '@/model/constants/labels'
import MemberCard from '@/components/ThreatSharing/Members/MemberCard'
import RequestCard from '@/components/ThreatSharing/Members/RequestCard'
import GiveAdminAccessToMemberDialog from '@/components/ThreatSharing/Members/GiveAdminAccessToMemberDialog'
import RemoveUserFromCommunityDialog from '@/components/ThreatSharing/Members/RemoveUserFromCommunityDialog'
import useDebounce from '@/hooks/useDebounce'

export default {
  components: {
    RemoveUserFromCommunityDialog,
    GiveAdminAccessToMemberDialog,
    MemberCard,
    RequestCard
  },
  mixins: [useDebounce],
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
    communityDetails: null,
    tab: null,
    members: [],
    requestMembers: [],
    search: '',
    itemsPerPageOptions: [5, 10, 20],
    itemsPerPage: 5,
    toggle: false
  }),
  computed: {
    showRequestMembersTab() {
      return (
        this.communityDetails &&
        this.communityDetails.myMembershipStatusId &&
        this.communityDetails.myMembershipStatusId == 1 &&
        this.communityDetails.privacyStatusId &&
        this.communityDetails.privacyStatusId === 2
      )
    },
    numberOfPages() {
      return Math.ceil(this.members && this.members.length / this.itemsPerPage)
    },
    numberOfPagesForRequest() {
      return Math.ceil(this.requestMembers && this.requestMembers.length / this.itemsPerPage)
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
            this.callForMembers()
          })
        } else {
          this.callForMembers()
        }
      }
    }
  },
  methods: {
    callForMembers() {
      if (this.tab === 0) {
        this.getMembers()
      } else {
        this.getRequestMembers()
      }
    },
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
      return item?.membershipStatusId?.toString() === '1'
    },
    appointANewOwner(item) {
      this.appointNewOwnerId = item.companyResourceId
      this.appointUserName = item.companyName
      this.showAppointANewOwnerModal = true
    },
    appointANewOwnerConfirm() {
      this.isAssignOwnerButtonDisabled = true
      appointNewOwner(this.$route.params.id, {
        AppointedCompanyResourceId: this.appointNewOwnerId
      })
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
    getCommunityDetails() {
      this.membersLoading = true
      getCommunityDetails(this.$route.params.id).then((response) => {
        localStorage.setItem(
          'isCommunityOwner',
          response.data.data.myMembershipStatusId == 1 ? 'owner' : 'member'
        )
        this.communityDetails = response.data.data
        this.$parent.$parent.$parent.$parent.$parent.$parent.communityName = response.data.data.name
        this.getMembers()
        this.getRequestMembers()
      })
    },
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
  }
}
</script>
