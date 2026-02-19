<template>
  <div class="right-column" ref="rightCol">
    <new-community
      v-if="isWantToAddNewCommunity"
      :status="isWantToAddNewCommunity"
      :community-item="communityItem"
      :resourceId="communityItem && communityItem.resourceId"
      :style="{ 'z-index': '999999' }"
      @closeAdd="onAddClose"
    />
    <RightColumnLeaveCommunityDialog
      v-if="isWantToToLeaveFromCommunity"
      :status="isWantToToLeaveFromCommunity"
      :community-details="communityDetails"
      :is-action-button-disabled="isLeaveFromCommunityButtonDisabled"
      @on-close="isWantToToLeaveFromCommunity = false"
      @on-confirm="leaveFromCommunityConfirm"
    />
    <RightColumnNotificationDialog
      v-if="openNotificationModal"
      :status="openNotificationModal"
      @on-close="openNotificationModal = false"
    />
    <RightColumnDeleteCommunityDialog
      v-if="isWantToDelete"
      :status="isWantToDelete"
      :community-details="communityDetails"
      @on-close="isWantToDelete = false"
      @on-confirm="deleteCommunityConfirm"
    />
    <RightColumnInviteUsersDialog
      v-if="openInviteModal"
      :status="openInviteModal"
      @on-close="openInviteModal = false"
    />
    <v-card class="pop-up-card right-column pt-4 pl-6 pr-6" light min-height="300">
      <v-btn
        v-if="$route.path === '/threat-sharing'"
        id="threat-sharing-right-column-create-a-new-community-button"
        :disabled="!getCreateCommunityPermission"
        class="create-com-btn"
        block
        rounded
        @click="createNewCommunity"
        >CREATE A NEW COMMUNITY
      </v-btn>
      <v-btn
        v-if="$route.name === 'Community'"
        class="create-com-btn"
        id="threat-sharing-right-column-post-incident-button"
        block
        rounded
        :disabled="!getPostIncidentPermission"
        @click="postIncident"
        >POST INCIDENT
      </v-btn>
      <div class="right-side-content wrapper pt-8 pb-4">
        <div v-if="$route.name === 'Community'">
          <div class="about-community right-side-title">
            About Community
            <v-menu offset-y transition="scale-transition">
              <template v-slot:activator="{ on }">
                <v-icon v-on="on">mdi-cog</v-icon>
              </template>
              <div class="notification-wrapper__right-column">
                <v-list dense flat class="notification-wrapper__v-list">
                  <v-list-item-group
                    v-if="getEditCommunityPermission && isOwnerOfTheCommunity()"
                    color="primary"
                  >
                    <v-list-item id="right-col-edit-commun" @click="editCommunity()">
                      <v-list-item-icon>
                        <v-icon>mdi-pencil</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title id="item--threat-sharing-right-column-edit-community"
                          >Edit Community</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                  <v-list-item-group color="primary">
                    <v-list-item
                      id="right-col-notification-settings"
                      @click="openNotificationModal = true"
                    >
                      <v-list-item-icon>
                        <v-icon>mdi-bell</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title
                          id="item--threat-sharing-right-column-notification-settings"
                          >Notification Settings</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                  <v-list-item-group color="primary">
                    <v-list-item
                      v-if="getLeaveCommunityPermission"
                      id="right-col-leave-commun"
                      @click="isWantToToLeaveFromCommunity = true"
                    >
                      <v-list-item-icon>
                        <v-icon>mdi-exit-to-app</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title id="item--threat-sharing-right-column-leave-community"
                          >Leave</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                  <v-list-item-group
                    v-if="getDeleteCommunityPermission && isOwnerOfTheCommunity()"
                    color="primary"
                  >
                    <v-list-item id="right-col-delete-commun" @click="isWantToDelete = true">
                      <v-list-item-icon>
                        <v-icon>mdi-delete</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title id="item--threat-sharing-right-column-delete-community"
                          >Delete</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </div>
            </v-menu>
          </div>
          <div class="right-side-post-container pt-2 pb-8">
            <span
              id="text--threat-sharing-right-column-community-description"
              class="about-community-statement"
              >{{ communityDetails.description }}</span
            >
            <v-row class="mt-1 mb-8">
              <v-col cols="12" sm="5" class="about-community-table-td pb-0">
                <span
                  id="text--threat-sharing-right-column-community-owner"
                  class="right-col-semibold-label"
                  >Owner</span
                >
              </v-col>
              <v-col
                id="text--threat-sharing-right-column-community-owner-company-name"
                cols="12"
                sm="7"
                class="about-community-table-td-sec pb-0"
              >
                {{ communityDetails.ownerCompanyName }}
              </v-col>
            </v-row>
            <div class="about-community-table">
              <v-row>
                <v-col cols="12" sm="5" class="about-community-table-td pb-0">
                  <span class="right-col-semibold-label">Members</span>
                </v-col>
                <v-col
                  id="text--threat-sharing-right-column-community-member-count"
                  cols="12"
                  sm="7"
                  class="about-community-table-td-sec pb-0 d-flex"
                >
                  {{ communityDetails.memberCount }}
                  <a
                    v-if="
                      ((!!communityDetails && communityDetails.myMembershipStatusId == 1) ||
                        (!!communityDetails && communityDetails.privacyStatusName === 'Public')) &&
                      getInviteToCommunityPermission
                    "
                    id="threat-sharing-right-column-invite-plus"
                    href="#"
                    class="pl-4"
                    @click="openInviteModal = true"
                    ><v-icon :size="24" color="#2196f3">mdi-plus</v-icon>Invite</a
                  >
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="5" class="about-community-table-td pb-0">
                  <span class="right-col-semibold-label">Industry</span>
                </v-col>
                <v-col
                  id="text--threat-sharing-right-column-community-industry-name"
                  cols="12"
                  sm="7"
                  class="about-community-table-td-sec pb-0"
                >
                  {{ communityDetails.industryName }}
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="5" class="about-community-table-td pb-0">
                  <span class="right-col-semibold-label">Total Incidents</span>
                </v-col>
                <v-col
                  id="text--threat-sharing-right-column-community-incident-count"
                  cols="12"
                  sm="7"
                  class="about-community-table-td-sec pb-0"
                  >{{ communityDetails.incidentCount }}
                </v-col>
              </v-row>
            </div>
          </div>
        </div>
        <div
          id="text--threat-sharing-right-column-posts-title"
          class="right-side-title pt-1"
          v-if="getMyLastPostsPermission"
        >
          Your Posts
        </div>
        <PostCardLoading
          v-show="getMyLastPostsPermission && yourPostsLoading"
          :loading="yourPostsLoading"
          id="your-post-skeleton"
        >
          <template v-slot:skeleton-content> </template>
        </PostCardLoading>
        <div v-show="getMyLastPostsPermission && !yourPostsLoading">
          <div class="pb-4" v-if="yourPosts && yourPosts.length > 0">
            <div v-for="(post, ind) of yourPosts" :key="ind + Math.floor(Math.random() * 10000)">
              <post
                class="pt-2"
                :index="ind"
                :post="post"
                @goToPostDetails="goToPostDetails(post)"
                @goToCommunityDetails="goToCommunityDetails(post)"
              />
            </div>
          </div>
          <div
            v-else-if="yourPosts && !yourPosts.length"
            id="text--threat-sharing-right-column-post-no-post"
            class="pb-4 pt-1 empty-posts"
          >
            You haven’t posted any incidents
          </div>
        </div>

        <div
          v-if="getTopPostsPermission"
          id="text--threat-sharing-right-column-post-top-post-from-your-communities"
          class="right-side-title pt-4"
        >
          Top Posts from your communities
        </div>
        <PostCardLoading :loading="getTopPostsPermission && topPostsLoading" id="top-post-skeleton">
          <template v-slot:skeleton-content>
            <div v-if="topPosts && topPosts.length && getTopPostsPermission">
              <div v-for="(post, ind) of topPosts" :key="ind + Math.floor(Math.random() * 10000)">
                <post
                  class="right-side-post-container pt-2"
                  :post="post"
                  :index="ind"
                  @goToPostDetails="goToPostDetails(post)"
                  @goToCommunityDetails="goToCommunityDetails(post)"
                />
              </div>
            </div>
            <div v-else-if="!getTopPostsPermission" class="empty-posts pt-1"></div>
            <div id="text--threat-sharing-right-column-top-posts-post-no-top-posts" v-else>
              No incident has been posted in your communities
            </div>
          </template>
        </PostCardLoading>
        <div
          v-if="getSuggestedCommunitiesPermission"
          id="text--threat-sharing-right-column-suggested-communities"
          class="right-side-title pb-3 pt-8"
        >
          Suggested Communities
        </div>
        <CommunitiesCardLoading
          v-if="postsLoading"
          :loading="getSuggestedCommunitiesPermission && postsLoading"
          id="communities-post-skeleton"
        />
        <div v-show="getSuggestedCommunitiesPermission && !postsLoading">
          <div v-if="suggestedCommunities && suggestedCommunities.length">
            <v-card
              v-for="(commun, ind) of suggestedCommunities"
              :key="ind + commun.communityName"
              class="suggested-card"
            >
              <suggested-community
                :index="ind"
                :community="commun"
                @joinCommunity="joinCommunity(commun)"
              />
            </v-card>
          </div>
          <div
            :id="`text--threat-sharing-right-column-suggest-communities-item-no-suggested-communities`"
            class="pb-2"
            v-else
          >
            There is no suggested community available
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  deleteCommunity,
  getCommunityDetails,
  getMyLastPosts,
  getMyTopPosts,
  getsuggestedCommunities,
  joinCommunity,
  removeFromCommunities
} from '@/api/threatSharing'
import { isOwner } from '@/utils/functions'
import NewCommunity from '@/components/ThreatSharing/NewCommunity/NewCommunity'
import CommunitiesCardLoading from '@/components/SkeletonLoading/CommunitiesCardLoading'
import PostCardLoading from '@/components/SkeletonLoading/PostCardLoading'
import labels from '@/model/constants/labels'
import Post from '@/components/ThreatSharing/RightColumn/Post'
import SuggestedCommunity from '@/components/ThreatSharing/RightColumn/SuggestedCommunity'
import RightColumnLeaveCommunityDialog from '@/components/ThreatSharing/RightColumn/RightColumnLeaveCommunityDialog'
import RightColumnNotificationDialog from '@/components/ThreatSharing/RightColumn/RightColumnNotificationDialog'
import RightColumnDeleteCommunityDialog from '@/components/ThreatSharing/RightColumn/RightColumnDeleteCommunityDialog'
import RightColumnInviteUsersDialog from '@/components/ThreatSharing/RightColumn/RightColumnInviteUsersDialog'

export default {
  components: {
    RightColumnInviteUsersDialog,
    RightColumnDeleteCommunityDialog,
    RightColumnNotificationDialog,
    RightColumnLeaveCommunityDialog,
    NewCommunity,
    CommunitiesCardLoading,
    PostCardLoading,
    Post,
    SuggestedCommunity
  },
  props: {
    pageView: {
      type: Boolean,
      required: false,
      default: false
    },
    selectedTab: {
      required: false
    }
  },
  data() {
    return {
      isLeaveFromCommunityButtonDisabled: false,
      isJoinCommunityButtonDisabled: false,
      labels,
      yourPostsLoading: true,
      topPostsLoading: true,
      postsLoading: true,
      isWantToDelete: false,
      openNotificationModal: false,
      isWantToToLeaveFromCommunity: false,
      communityItem: null,
      communityResourceId: null,
      isWantToAddNewCommunity: false,
      openInviteModal: false,
      suggestedCommunities: [],
      communityDetails: {},
      myLastPosts: [],
      topPosts: [],
      yourPosts: []
    }
  },
  created() {
    this.getAllRightColumnData()
    this.$store.watch(
      (state) => {
        return state.rightColumn.reloadRightColumnData // could also put a Getter here
      },
      (newValue) => {
        if (newValue) {
          this.getAllRightColumnData()
          setTimeout(() => {
            this.$store.dispatch('rightColumn/changeReloadRightColumnData', false)
          }, 150)
        }
      }
    )
  },
  computed: {
    ...mapGetters({
      getCreateCommunityPermission: 'permissions/getThreatSharingCreateCommunityPermission',
      getEditCommunityPermission: 'permissions/getThreatSharingEditCommunityPermission',
      getLeaveCommunityPermission: 'permissions/getThreatSharingLeaveCommunityPermission',
      getDeleteCommunityPermission: 'permissions/getThreatSharingDeleteCommunityPermission',
      getPostIncidentPermission: 'permissions/getThreatSharingPostIncidentPermission',
      getInviteToCommunityPermission: 'permissions/getThreatSharingInviteToCommunityPermission',
      getMyLastPostsPermission: 'permissions/getThreatSharingMyLastPostsPermission',
      getTopPostsPermission: 'permissions/getThreatSharingTopPostsPermission',
      getSuggestedCommunitiesPermission:
        'permissions/getThreatSharingSuggestedCommunitiesPermission'
    })
  },
  methods: {
    getAllRightColumnData() {
      this.getCommunityDetails()
      this.getMyLastPosts()
      this.getMyTopPosts()
      this.getsuggestedCommunities()
    },
    deleteCommunityConfirm() {
      deleteCommunity(this.communityDetails.resourceId).then(() => {
        this.isWantToDelete = false
        if (
          this.$store.state['communities'].communities &&
          this.$store.state['communities'].communities.communitiesData
        ) {
          this.$store.state[
            'communities'
          ].communities.communitiesData.tableData = this.$store.state[
            'communities'
          ].communities.communitiesData.tableData.reduce((acc, item) => {
            if (item.communityResourceId !== this.communityDetails.resourceId) {
              acc.push(item)
            }
            return acc
          }, [])
          this.$store.state[
            'communities'
          ].communities.communitiesData.searchValues.totalNumberOfRecords =
            this.$store.state['communities'].communities.communitiesData.searchValues
              .totalNumberOfRecords - 1
        }
        this.$store.dispatch('tableReload/setTableReload', true)
        this.$router.push(`/threat-sharing`)
      })
    },
    leaveFromCommunityConfirm() {
      this.isLeaveFromCommunityButtonDisabled = true
      removeFromCommunities(this.communityDetails.resourceId)
        .then(() => {
          if (this.communityDetails.privacyStatusId === 1) {
            if (this.$store.state['communities'].communities.communitiesData) {
              if (
                this.$store.state['communities'].communities.communitiesData.tableData.some(
                  (item) => item.communityResourceId === this.communityDetails.resourceId
                )
              ) {
                this.$store.state['communities'].communities.communitiesData.tableData.find(
                  (item) => item.communityResourceId === this.communityDetails.resourceId
                ).membershipStatusId = 0
                this.$store.state['communities'].communities.communitiesData.tableData.find(
                  (item) => item.communityResourceId === this.communityDetails.resourceId
                ).privacyStatusName = 'Public'
                this.$store.state['communities'].communities.communitiesData.tableData.find(
                  (item) => item.communityResourceId === this.communityDetails.resourceId
                ).memberCount =
                  this.$store.state['communities'].communities.communitiesData.tableData.find(
                    (item) => item.communityResourceId === this.communityDetails.resourceId
                  ).memberCount - 1
              }
            }
          } else if (this.$store.state['communities'].communities.communitiesData) {
            if (
              this.$parent.$refs.tsCommunities &&
              this.$parent.$refs.tsCommunities.listData.find(
                (item) => item.communityResourceId === this.communityDetails.resourceId
              )
            ) {
              this.$store.state['communities'].communities.communitiesData.tableData.find(
                (item) => item.communityResourceId === this.communityDetails.resourceId
              ).membershipStatusId = 0
              this.$store.state['communities'].communities.communitiesData.tableData.find(
                (item) => item.communityResourceId === this.communityDetails.resourceId
              ).privacyStatusName = 'Private'
            }
          }
          this.$store.dispatch('tableReload/setTableReload', true)
          this.isWantToToLeaveFromCommunity = false
          if (
            this.$store.state['communities'].communities &&
            this.$store.state['communities'].communities.communitiesData &&
            this.$store.state['communities'].communities.communitiesData.searchValues
              .selectedTab === 'tab-0'
          ) {
            this.$store.state[
              'communities'
            ].communities.communitiesData.tableData = this.$store.state[
              'communities'
            ].communities.communitiesData.tableData.reduce((acc, item) => {
              if (item.communityResourceId !== this.communityDetails.resourceId) {
                acc.push(item)
              }
              return acc
            }, [])
            this.$store.state[
              'communities'
            ].communities.communitiesData.searchValues.totalNumberOfRecords =
              this.$store.state['communities'].communities.communitiesData.searchValues
                .totalNumberOfRecords - 1
          }
          this.$router.push(`/threat-sharing`)
        })
        .finally(() => (this.isLeaveFromCommunityButtonDisabled = false))
    },
    onAddClose() {
      this.isWantToAddNewCommunity = false
      setTimeout(() => {
        this.getAllRightColumnData()
      }, 250)
    },
    goToPostDetails(post) {
      let currentCommunityName = localStorage.getItem('communityName')
      let currentCommunityId = localStorage.getItem('communityResourceIdForRedirect')
      localStorage.setItem('previousCommunityName', currentCommunityName)
      localStorage.setItem('previousCommunityResourceIdForRedirect', currentCommunityId)
      localStorage.setItem('communityName', post.communityName)
      localStorage.setItem('communityResourceIdForRedirect', post.communityResourceId)
      if (post.communityResourceId) {
        if (this.selectedTab === 1) {
          let communitiesData = {
            tableData:
              this.$parent.$refs.tsCommunities.selectedTab === 'tab-2'
                ? this.$parent.$refs.tsCommunities.invitationData
                : this.$parent.$refs.tsCommunities.listData,
            searchValues: {
              filter: this.$parent.$refs.tsCommunities.filter,
              industryValue: this.$parent.$refs.tsCommunities.industryValue,
              privacyValue: this.$parent.$refs.tsCommunities.privacyValue,
              selectedTab: this.$parent.$refs.tsCommunities.selectedTab,
              page: this.$parent.$refs.tsCommunities.page,
              totalNumberOfRecords: this.$parent.$refs.tsCommunities.totalNumberOfRecords,
              totalNumberOfPages: this.$parent.$refs.tsCommunities.totalNumberOfPages,
              itemsPerPage: this.$parent.$refs.tsCommunities.itemsPerPage
            },
            type: 'communities'
          }
          this.$store.dispatch('communities/setCommunities', {
            key: 'communities',
            communitiesData
          })
          let incidentsData = null
          this.$store.dispatch('incidents/setIncidents', {
            key: 'incidents',
            incidentsData
          })
        } else if (this.selectedTab === 0) {
          let incidentsData = {
            tableData: this.$parent.$refs.tsIncidents.incidentList,
            searchValues: {
              search: this.$parent.$refs.tsIncidents.search,
              companyValue: this.$parent.$refs.tsIncidents.companyValue,
              threats: this.$parent.$refs.tsIncidents.threats,
              page: this.$parent.$refs.tsIncidents.page,
              totalNumberOfRecords: this.$parent.$refs.tsIncidents.totalNumberOfRecords,
              totalNumberOfPages: this.$parent.$refs.tsIncidents.totalNumberOfPages,
              itemsPerPage: this.$parent.$refs.tsIncidents.itemsPerPage
            },
            type: 'incidents'
          }
          let communitiesData = null
          this.$store.dispatch('incidents/setIncidents', {
            key: 'incidents',
            incidentsData
          })
          this.$store.dispatch('communities/setCommunities', {
            key: 'communities',
            communitiesData
          })
        }
        if (this.$route.name === 'Community') {
          this.$router.replace({
            query: { postId: post.communityPostResourceId },
            params: {
              communityName: post.communityName,
              id: post.communityResourceId
            }
          })
        } else {
          this.$router.replace({ query: null, params: null })
          this.$router.push({
            name: 'Community',
            query: { postId: post.communityPostResourceId },
            params: {
              communityName: post.communityName,
              id: post.communityResourceId
            }
          })
        }
        this.getAllRightColumnData()
      }
    },
    goToCommunityDetails(post) {
      if (post.communityResourceId) {
        let currentCommunityName = localStorage.getItem('communityName')
        let currentCommunityId = localStorage.getItem('communityResourceIdForRedirect')
        localStorage.setItem('previousCommunityName', currentCommunityName)
        localStorage.setItem('previousCommunityResourceIdForRedirect', currentCommunityId)
        localStorage.setItem('communityName', post.communityName)
        localStorage.setItem('communityResourceIdForRedirect', post.communityResourceId)
        if (this.selectedTab === 1) {
          let communitiesData = {
            tableData:
              this.$parent.$refs.tsCommunities.selectedTab === 'tab-2'
                ? this.$parent.$refs.tsCommunities.invitationData
                : this.$parent.$refs.tsCommunities.listData,
            searchValues: {
              filter: this.$parent.$refs.tsCommunities.filter,
              industryValue: this.$parent.$refs.tsCommunities.industryValue,
              privacyValue: this.$parent.$refs.tsCommunities.privacyValue,
              selectedTab: this.$parent.$refs.tsCommunities.selectedTab,
              page: this.$parent.$refs.tsCommunities.page,
              totalNumberOfRecords: this.$parent.$refs.tsCommunities.totalNumberOfRecords,
              totalNumberOfPages: this.$parent.$refs.tsCommunities.totalNumberOfPages,
              itemsPerPage: this.$parent.$refs.tsCommunities.itemsPerPage,
              subSelectedTab: this.$parent.$refs.tsCommunities.subSelectedTab
            },
            type: 'communities'
          }
          this.$store.dispatch('communities/setCommunities', {
            key: 'communities',
            communitiesData
          })
          let incidentsData = null
          this.$store.dispatch('incidents/setIncidents', {
            key: 'incidents',
            incidentsData
          })
        } else if (this.selectedTab === 0) {
          let incidentsData = {
            tableData: this.$parent.$refs.tsIncidents.incidentList,
            searchValues: {
              search: this.$parent.$refs.tsIncidents.search,
              companyValue: this.$parent.$refs.tsIncidents.companyValue,
              threats: this.$parent.$refs.tsIncidents.threats,
              page: this.$parent.$refs.tsIncidents.page,
              totalNumberOfRecords: this.$parent.$refs.tsIncidents.totalNumberOfRecords,
              totalNumberOfPages: this.$parent.$refs.tsIncidents.totalNumberOfPages,
              itemsPerPage: this.$parent.$refs.tsIncidents.itemsPerPage
            },
            type: 'incidents'
          }
          let communitiesData = null
          this.$store.dispatch('incidents/setIncidents', {
            key: 'incidents',
            incidentsData
          })
          this.$store.dispatch('communities/setCommunities', {
            key: 'communities',
            communitiesData
          })
        }
        if (this.$route.params.id !== post.communityResourceId) {
          this.$router.push({
            name: 'Community',
            params: {
              communityName: post.communityName,
              id: post.communityResourceId
            }
          })
        }
        this.getAllRightColumnData()
      }
    },
    getCommunityDetails() {
      if (this.$route.name === 'Community') {
        this.$parent.$parent.$parent.$parent.communityName = 'Loading...'
        getCommunityDetails(this.$route.params.id)
          .then((response) => {
            this.communityDetails = response.data.data
            if (this.$route.query && this.$route.query.postId) {
              localStorage.setItem('communityName', response.data.data.name)
              localStorage.setItem('communityResourceIdForRedirect', response.data.data.resourceId)
            }
            this.$parent.$parent.$parent.$parent.communityName = response.data.data.name
            this.$forceUpdate()
          })
          .catch((error) => {
            if (error.response.data.code) {
              this.$router.push({
                name: 'Threat Sharing',
                params: {
                  isCommunity: true,
                  postId: this.$route.query.postId,
                  communityId: this.$route.params['id'],
                  communityName: 'empty'
                }
              })
            }
          })
      }
    },
    getMyLastPosts() {
      this.yourPostsLoading = true
      getMyLastPosts()
        .then((response) => {
          this.yourPosts = response.data.data.slice(0, 3)
          this.yourPostsLoading = false
          this.$forceUpdate()
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.code === 'RESOURCE_NOT_FOUND'
          ) {
            this.yourPosts = []
            this.yourPostsLoading = false
          }
        })
        .finally(() => (this.yourPostsLoading = false))
    },
    getMyTopPosts() {
      this.topPostsLoading = true
      getMyTopPosts()
        .then((response) => {
          this.topPosts = response.data.data.slice(0, 3)
          this.topPostsLoading = false
          this.$forceUpdate()
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.code === 'RESOURCE_NOT_FOUND'
          ) {
            this.topPosts = []
            this.topPostsLoading = false
          }
        })
        .finally(() => (this.topPostsLoading = false))
    },
    getsuggestedCommunities() {
      this.postsLoading = true
      getsuggestedCommunities()
        .then((response) => {
          this.suggestedCommunities = response.data.data
          this.suggestedCommunities = this.suggestedCommunities
            .map((item) => {
              return { ...item, isJoined: false }
            })
            .slice(0, 3)
          this.$forceUpdate()
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.code === 'RESOURCE_NOT_FOUND'
          ) {
            this.suggestedCommunities = []
          }
        })
        .finally(() => (this.postsLoading = false))
    },
    createNewCommunity() {
      if (this.selectedTab === 1) {
        let communitiesData = {
          tableData:
            this.$parent.$refs.tsCommunities.selectedTab === 'tab-2'
              ? this.$parent.$refs.tsCommunities.invitationData
              : this.$parent.$refs.tsCommunities.listData,
          searchValues: {
            filter: this.$parent.$refs.tsCommunities.filter,
            industryValue: this.$parent.$refs.tsCommunities.industryValue,
            privacyValue: this.$parent.$refs.tsCommunities.privacyValue,
            selectedTab: this.$parent.$refs.tsCommunities.selectedTab,
            page: this.$parent.$refs.tsCommunities.page,
            totalNumberOfRecords: this.$parent.$refs.tsCommunities.totalNumberOfRecords,
            totalNumberOfPages: this.$parent.$refs.tsCommunities.totalNumberOfPages,
            itemsPerPage: this.$parent.$refs.tsCommunities.itemsPerPage
          },
          type: 'communities'
        }
        this.$store.dispatch('communities/setCommunities', {
          key: 'communities',
          communitiesData
        })
        let incidentsData = null
        this.$store.dispatch('incidents/setIncidents', {
          key: 'incidents',
          incidentsData
        })
      } else if (this.selectedTab === 0) {
        let incidentsData = {
          tableData: this.$parent.$refs.tsIncidents.incidentList,
          searchValues: {
            search: this.$parent.$refs.tsIncidents.search,
            companyValue: this.$parent.$refs.tsIncidents.companyValue,
            threats: this.$parent.$refs.tsIncidents.threats,
            page: this.$parent.$refs.tsIncidents.page,
            totalNumberOfRecords: this.$parent.$refs.tsIncidents.totalNumberOfRecords,
            totalNumberOfPages: this.$parent.$refs.tsIncidents.totalNumberOfPages,
            itemsPerPage: this.$parent.$refs.tsIncidents.itemsPerPage
          },
          type: 'incidents'
        }
        let communitiesData = null
        this.$store.dispatch('incidents/setIncidents', {
          key: 'incidents',
          incidentsData
        })
        this.$store.dispatch('communities/setCommunities', {
          key: 'communities',
          communitiesData
        })
      }
      this.$emit('createCommunityAction')
    },
    editCommunity() {
      this.communityItem = this.communityDetails
      this.communityItem.resourceId = this.communityDetails.resourceId
      this.communityItem.communityName = this.communityDetails.name
      this.communityItem.communityDescription = this.communityDetails.description
      this.isWantToAddNewCommunity = true
    },
    postIncident() {
      this.$emit('postIncident')
    },
    joinCommunity({ resourceId, communityName, privacyStatusName }) {
      this.isJoinCommunityButtonDisabled = true
      joinCommunity(resourceId)
        .then(() => {
          this.getsuggestedCommunities()
          localStorage.setItem('communityName', communityName)
          localStorage.setItem('communityResourceIdForRedirect', resourceId)
          let communitiesData = null
          let incidentsData = null

          if (privacyStatusName === 'Public' && this.$parent.$refs.tsCommunities) {
            if (
              this.$parent.$refs.tsCommunities.listData.find(
                (item) => item.communityResourceId === resourceId
              )
            ) {
              this.$parent.$refs.tsCommunities.listData.find(
                (item) => item.communityResourceId === resourceId
              ).membershipStatusId = 2
            }

            communitiesData = {
              tableData:
                this.$parent.$refs.tsCommunities.selectedTab === 'tab-2'
                  ? this.$parent.$refs.tsCommunities.invitationData
                  : this.$parent.$refs.tsCommunities.listData,
              searchValues: {
                filter: this.$parent.$refs.tsCommunities.filter,
                industryValue: this.$parent.$refs.tsCommunities.industryValue,
                privacyValue: this.$parent.$refs.tsCommunities.privacyValue,
                selectedTab: this.$parent.$refs.tsCommunities.selectedTab,
                page: this.$parent.$refs.tsCommunities.page,
                totalNumberOfRecords: this.$parent.$refs.tsCommunities.totalNumberOfRecords,
                totalNumberOfPages: this.$parent.$refs.tsCommunities.totalNumberOfPages,
                itemsPerPage: this.$parent.$refs.tsCommunities.itemsPerPage,
                subSelectedTab: this.$parent.$refs.tsCommunities.subSelectedTab
              },
              type: 'communities'
            }
          } else if (this.$parent.$refs.tsIncidents) {
            incidentsData = {
              tableData: this.$parent.$refs.tsIncidents.incidentList,
              searchValues: {
                search: this.$parent.$refs.tsIncidents.search,
                companyValue: this.$parent.$refs.tsIncidents.companyValue,
                threats: this.$parent.$refs.tsIncidents.threats,
                page: this.$parent.$refs.tsIncidents.page,
                totalNumberOfRecords: this.$parent.$refs.tsIncidents.totalNumberOfRecords,
                totalNumberOfPages: this.$parent.$refs.tsIncidents.totalNumberOfPages,
                itemsPerPage: this.$parent.$refs.tsIncidents.itemsPerPage
              },
              type: 'incidents'
            }
          }
          this.$store.dispatch('communities/setCommunities', {
            key: 'communities',
            communitiesData
          })
          this.$store.dispatch('incidents/setIncidents', {
            key: 'incidents',
            incidentsData
          })
          if (privacyStatusName !== 'Private') {
            if (this.$route.name === 'Community') {
              this.$router.push({
                name: 'Community',
                params: { communityName: communityName, id: resourceId }
              })
              this.$emit('joinRequestSuccess')
            } else {
              this.$emit('joinRequestSuccess')
              this.$router.push({
                name: 'Community',
                params: { communityName: communityName, id: resourceId }
              })
            }
          } else {
            this.$emit('joinRequestSuccess')
          }
        })
        .finally(() => (this.isJoinCommunityButtonDisabled = false))
    },
    isOwnerOfTheCommunity() {
      if (this.communityDetails) {
        return isOwner(this.communityDetails.myMembershipStatusId)
      }
    }
  }
}
</script>
