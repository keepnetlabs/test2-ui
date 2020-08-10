<template>
  <div class="communities-wrapper">
    <v-overlay
      id="new-community-overlay"
      :value="isWantToAddNewCommunity"
      :class="{ newCommunityOverlay: isWantToAddNewCommunity }"
      :opacity="1"
      :z-index="999"
      color="white"
    >
      <new-community
        :communityItem="communityItem"
        :resourceId="resourceId"
        @closeAdd="onAddClose"
      />
    </v-overlay>
    <app-dialog
      :status="isWantToDelete"
      @changeStatus="isWantToDelete = false"
      icon="mdi-delete"
      title="Delete Community?"
      :subtitle="deleteCommunityName"
      :body="`${deleteCommunityName} will be deleted. All posts and data will be lost`"
    >
      <template v-slot:app-dialog-footer>
        <div class="d-flex download-buttons flex-row flex-wrap justify-end flex-row">
          <div>
            <v-btn
              class="pa-0 k-dialog__button mr-2"
              text
              color="#f56c6c"
              @click="isWantToDelete = false"
              >CANCEL
            </v-btn>
          </div>
          <div class="d-flex flex-row flex-end">
            <v-btn
              class="pa-0 k-dialog__button"
              text
              color="#2196f3"
              @click="deleteCommunityConfirm()"
              >Delete
            </v-btn>
          </div>
        </div>
      </template>
    </app-dialog>
    <app-dialog
      :status="isWantToToLeaveFromCommunity"
      @changeStatus="isWantToToLeaveFromCommunity = false"
      icon="mdi-exit-to-app"
      title="Leave Community?"
      :subtitle="leaveCommunityName"
      :body="`You are leaving ${leaveCommunityName}. You won’t be able to post incidents to this community`"
    >
      <template v-slot:app-dialog-footer>
        <div class="d-flex download-buttons flex-row flex-wrap justify-end">
          <div>
            <v-btn
              class="pa-0 k-dialog__button mr-2"
              text
              color="#f56c6c"
              @click="isWantToToLeaveFromCommunity = false"
              >CANCEL
            </v-btn>
          </div>
          <div class="d-flex flex-row flex-end">
            <v-btn
              class="pa-0 k-dialog__button"
              text
              color="#2196f3"
              @click="leaveFromCommunityConfirm"
              >LEAVE
            </v-btn>
          </div>
        </div>
      </template>
    </app-dialog>
    <app-dialog
      :status="showNeedPermissionModal"
      @changeStatus="showNeedPermissionModal = false"
      icon="mdi-exit-to-app"
      title="Cannot Leave Community"
      :subtitle="leaveCommunityName"
      :body="`You have to give admin privileges to at least 1 other person`"
    >
      <template v-slot:app-dialog-footer>
        <div class="d-flex download-buttons flex-row flex-wrap justify-end">
          <div class="d-flex flex-row flex-end">
            <v-btn
              class="pa-0 k-dialog__button"
              text
              color="#2196f3"
              @click="showNeedPermissionModal = false"
              >I UNDERSTAND
            </v-btn>
          </div>
        </div>
      </template>
    </app-dialog>
    <app-dialog
      :status="openNotificationModal"
      icon="mdi-bell"
      title="Community Notification Settings"
    >
      <template v-slot:app-dialog-body>
        <v-list-item class="pa-0" style="border-bottom: 1px solid rgba(80, 80, 80, 0.14);">
          <div class="communities-wrapper__community-notification-row">
            <div class="community-notification__text">
              Notifications
            </div>
            <div>
              <v-switch
                id="general-notif-switch"
                v-model="notifications.isNotifications"
                color="#2196f3"
                hide-details
                class="community-notification-switch mt-0"
              />
            </div>
          </div>
        </v-list-item>
        <v-list-item class="pa-0">
          <div class="communities-wrapper__community-notification-row">
            <div class="community-notification__text">
              Dashboard notifications
            </div>
            <div>
              <v-switch
                id="dashboard-notif-switch"
                v-model="notifications.isDashboard"
                color="#2196f3"
                hide-details
                class="community-notification-switch mt-0"
              />
            </div>
          </div>
        </v-list-item>
        <v-list-item class="pa-0">
          <div class="communities-wrapper__community-notification-row">
            <div class="community-notification__text">
              Email notifications
            </div>
            <div>
              <v-switch
                id="email-notif-switch"
                v-model="notifications.isEmail"
                color="#2196f3"
                hide-details
                class="community-notification-switch mt-0"
              />
            </div>
          </div>
        </v-list-item>
        <v-list-item class="pa-0">
          <div class="communities-wrapper__community-notification-row">
            <div class="community-notification__text">
              SMS notifications
            </div>
            <div>
              <v-switch
                id="whatsapp-notif-switch"
                v-model="notifications.isSms"
                color="#2196f3"
                hide-details
                class="community-notification-switch mt-0"
              />
            </div>
          </div>
        </v-list-item>
      </template>
      <template v-slot:app-dialog-footer>
        <div class="d-flex download-buttons flex-row flex-wrap justify-end">
          <v-btn
            text
            color="#f56c6c"
            class="k-dialog__button"
            @click="openNotificationModal = false"
            >CANCEL</v-btn
          >
          <v-btn text color="#2196f3" class="k-dialog__button" @click="saveNotificationSetting"
            >Save</v-btn
          >
        </div>
      </template>
    </app-dialog>
    <app-dialog
      :status="isCancelRequestModal"
      @changeStatus="isCancelRequestModal = false"
      icon="mdi-exit-to-app"
      title="Cancel Request?"
      :subtitle="cancelRequestCommunityName"
      :body="`You are cancelling your join request to the ${cancelRequestCommunityName}`"
    >
      <template v-slot:app-dialog-footer>
        <div class="d-flex download-buttons flex-row flex-wrap justify-end">
          <div>
            <v-btn
              class="pa-0 k-dialog__button"
              text
              color="#f56c6c"
              @click="isCancelRequestModal = false"
              >CANCEL
            </v-btn>
          </div>
          <div class="d-flex flex-row flex-end">
            <v-btn class="pa-0 k-dialog__button" text color="#2196f3" @click="cancelRequestConfirm"
              >Confirm
            </v-btn>
          </div>
        </div>
      </template>
    </app-dialog>
    <v-card flat color="basil">
      <v-card-text class="pt-2">
        <v-data-iterator
          :items="listData"
          :page="page"
          :items-per-page.sync="itemsPerPage"
          :footer-props="{ itemsPerPageOptions }"
          :no-data-text="'Sorry, we couldn\'t find any results matching your criteria'"
        >
          <template v-slot:header>
            <v-tabs v-model="selectedTab" class="community-selector">
              <v-tab
                v-for="(tab, ind) in tabOptions"
                :key="ind"
                @click="subTabSelected(tab)"
                :href="`#tab-${ind}`"
                class="text-decoration-none sub-tab__content"
              >
                <template v-if="ind === 2">
                  {{ tab }}
                  <span v-if="invitationsCount" class="invitations-count">
                    {{ invitationsCount }}
                  </span>
                </template>
                <template v-else>
                  {{ tab }}
                </template>
              </v-tab>
            </v-tabs>
            <div class="search-wrapper">
              <v-text-field
                @mouseover.native="hover = true"
                placeholder="Filter by attributes or keywords"
                outlined
                dense
                class="filter-field pt-6"
                v-model.trim="filter"
              ></v-text-field>
              <v-icon class="filter-icon" @click.native="updateCommunities()"
                >mdi-filter-variant
              </v-icon>
            </div>
          </template>
          <template v-slot:default="props">
            <div v-if="selectedTab === 'tab-0' || selectedTab === 'tab-1'" id="tab-0">
              <div v-for="(item, ind) of props.items" :key="ind" class="threat-sharing-content">
                <div class="ts-header">
                  <div
                    class="ts-title"
                    @click="communityDetails(item)"
                    :style="{ cursor: isOwnerOrMember(item) ? 'pointer' : 'text' }"
                  >
                    {{ item.communityName }}
                  </div>
                  <div class="flex-grow-1"></div>
                  <div class="ts-header-btn-1">
                    <v-btn v-if="item.membershipStatusId == 1" outlined rounded medium color="blue">
                      OWNER
                    </v-btn>
                    <v-btn
                      v-else-if="item.membershipStatusId == 3"
                      outlined
                      rounded
                      medium
                      class="join-button"
                    >
                      <v-icon style="font-size: 20px; margin-right: 8px;">mdi-account-clock</v-icon>
                      REQUEST SENT
                    </v-btn>
                    <v-btn
                      v-else-if="item.membershipStatusId == 2"
                      outlined
                      rounded
                      medium
                      color="blue"
                    >
                      MEMBER
                    </v-btn>
                    <v-btn
                      v-else-if="!item.membershipStatusId && item.privacyStatusName == 'Private'"
                      outlined
                      rounded
                      medium
                      class="join-button"
                      @click="requestJoin(item.communityResourceId, 'requestToJoin')"
                    >
                      <v-icon style="font-size: 20px; margin-right: 8px;">mdi-account-plus</v-icon>
                      REQUEST TO JOIN
                    </v-btn>
                    <v-btn
                      v-else-if="!item.membershipStatusId && item.privacyStatusName == 'Public'"
                      outlined
                      rounded
                      medium
                      class="join-button"
                      @click="requestJoin(item.communityResourceId, 'join')"
                    >
                      <v-icon style="font-size: 20px; margin-right: 8px;">mdi-account-plus</v-icon>
                      JOIN
                    </v-btn>
                    <v-btn
                      v-else-if="item.membershipStatusId == 4"
                      outlined
                      rounded
                      medium
                      color="blue"
                      @click="subTabSelected"
                    >
                      INVITED
                    </v-btn>
                  </div>
                  <v-menu
                    offset-y
                    transition="scale-transition"
                    v-if="isOwnerOrMember(item) || item.membershipStatusId == 3"
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn icon color="blue" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <div class="communities__notification-wrapper">
                      <v-list dense flat class="notification-wrapper__v-list">
                        <v-list-item-group color="primary">
                          <v-list-item @click="editCommunity(item)" v-if="isOwner(item)">
                            <v-list-item-icon>
                              <v-icon>mdi-pencil</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>Edit Community</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item
                            @click="openNotificationModal = true"
                            v-if="isOwnerOrMember(item)"
                          >
                            <v-list-item-icon>
                              <v-icon>mdi-bell</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>Notification Settings</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item
                            @click="leaveFromCommunity(item)"
                            v-if="isOwnerOrMember(item)"
                          >
                            <v-list-item-icon>
                              <v-icon>mdi-exit-to-app</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>Leave</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item @click="deleteCommunity(item)" v-if="isOwner(item)">
                            <v-list-item-icon>
                              <v-icon>mdi-delete</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>Delete</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item
                            @click="cancelRequest(item)"
                            v-if="item.membershipStatusId == 3"
                          >
                            <v-list-item-icon>
                              <v-icon>mdi-close-circle</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>Cancel Request</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </div>
                  </v-menu>
                </div>
                <div class="ts-user-comp">
                  <div class="ts-user-comp-detail">
                    <v-icon class="ts-people-icon pr-1">mdi-account-multiple</v-icon>
                    <span class="pr-2">{{ item.memberCount }}</span>
                    &bull;
                    <span class="ts-community-industry pl-2 pr-2">
                      {{ item.industryName || 'Industry' }}
                    </span>
                    &bull;
                    <span class="ts-community-industry pl-2" v-if="!!item.privacyStatusName">{{
                      item.privacyStatusName
                    }}</span>
                  </div>
                  <div v-if="item && item.createTime" class="ts-community-date pt-1">
                    Last update:
                    {{ item.lastPostTime ? item.lastPostTime : item.createTime }}
                    <!--{{
                  item.lastPostTime
                  ? item.lastPostTime.substring(0, 10).replace(/-/g, '.')
                  : item.createTime.substring(0, 10).replace(/-/g, '.')
                  }}-->
                  </div>
                </div>
                <div class="ts-body">
                  <v-clamp autoresize :max-lines="3">
                    {{ item.communityDescription }}
                  </v-clamp>
                </div>
              </div>
            </div>
            <div v-if="selectedTab === 'tab-2'">
              <div v-for="(item, ind) of props.items" :key="ind" class="threat-sharing-content">
                <div class="ts-header">
                  <div class="ts-title" @click="community(item)">
                    {{ item.name }}
                  </div>
                  <div class="flex-grow-1"></div>
                  <div class="ts-header-btn-1">
                    <div class="request-btns flex-grow-1">
                      <v-btn class="refuse-btn" block rounded medium @click="refuseRequest(item)">
                        CANCEL
                      </v-btn>
                      <v-btn class="accept-btn" block rounded medium @click="acceptRequest(item)">
                        JOIN
                      </v-btn>
                    </div>
                  </div>
                </div>
                <div class="ts-user-comp">
                  <div class="ts-user-comp-detail">
                    <v-icon class="ts-people-icon pr-1">mdi-account-multiple</v-icon>
                    <span class="pr-2">{{ item.memberCount }}</span>
                    &bull;
                    <span class="ts-community-industry pl-2 pr-2">
                      {{ item.industryName || 'Industry' }}
                    </span>
                    &bull;
                    <span class="ts-community-industry pl-2" v-if="!!item.privacyStatusName">{{
                      item.privacyStatusName
                    }}</span>
                  </div>
                  <div v-if="item && item.lastPostTime" class="ts-community-date pt-1">
                    Last update:
                    {{ item.lastPostTime }}
                  </div>
                </div>
                <div class="ts-body">
                  <v-clamp autoresize :max-lines="3">
                    {{ item.description }}
                  </v-clamp>
                </div>
              </div>
            </div>
          </template>
          <template v-if="!filter || filter.length < 1" slot="no-data">
            <div class="empty-communities" v-if="selectedTab === 'tab-1'">
              <div class="empty-communities-inline">
                <span class="no-community">
                  No community has been created, yet
                </span>
                <v-btn class="create-com-btn mb-11" @click="createNewCommunity()" rounded>
                  Create Community
                </v-btn>
              </div>
            </div>
            <div class="empty-communities" v-if="selectedTab === 'tab-0'">
              <div class="empty-communities-inline">
                <span class="no-community">
                  You haven’t joined any communities, yet
                </span>
                <v-btn class="create-com-btn mb-11" @click="subTabSelected('All')" rounded>
                  Browse Communities
                </v-btn>
              </div>
            </div>
            <div class="empty-communities" v-if="selectedTab === 'tab-2'" id="tab-2">
              <div class="empty-communities-inline">
                <span class="no-community">
                  You don't have any invitations from communities
                </span>
                <v-btn class="create-com-btn mb-11" @click="subTabSelected('All')" rounded>
                  Browse Communities
                </v-btn>
              </div>
            </div>
          </template>
        </v-data-iterator>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import {
  acceptInvitation,
  cancelRequest,
  deleteCommunity,
  getAllCommunityList,
  getInvitationCount,
  getInvitations,
  getMyCommunityList,
  joinCommunity,
  refuseInvitation,
  removeFromCommunities
} from '../../api/threadSharing'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'
import VClamp from 'vue-clamp'
import { isOwnerOrMember } from '../../utils/functions'
import NewCommunity from '../ThreadSharing/NewCommunity'
import AppDialog from '../AppDialog'
import { isOwner } from '../../utils/functions'

export default {
  components: {
    VClamp,
    NewCommunity,
    AppDialog
  },
  data: () => ({
    cancelRequestCommunityName: null,
    cancelRequestCommunityId: null,
    isCancelRequestModal: false,
    notifications: {
      isNotifications: false,
      isDashboard: false,
      isEmail: false,
      isSms: false
    },
    openNotificationModal: false,
    showNeedPermissionModal: false,
    leaveCommunityName: null,
    isWantToToLeaveFromCommunity: false,
    isWantToDelete: false,
    deleteCommunityName: null,
    deleteCommunityId: null,
    invitationsCount: 0,
    resourceId: null,
    communityItem: null,
    isWantToAddNewCommunity: false,
    selectedTab: 'tab-1',
    tabOptions: ['Your Communities', 'All', 'Invitations'],
    communities: ['keepnet'],
    search: '',
    page: 1,
    itemsPerPageOptions: [5, 10, 20],
    itemsPerPage: 5,
    filter: '',
    listData: []
  }),
  props: {
    refresh: {
      type: Boolean
    }
  },
  watch: {
    refresh: function (newVal, oldVal) {
      if (oldVal != newVal) {
        this.selectedTab = 'tab-1'
        this.getAllCommunitiesListData()
        this.getMyCommunitiesListData()
      }
    },
    filter: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.debounce(() => {
          this.updateCommunities()
        }, 500)
      }
    }
  },
  created() {},
  mounted() {
    this.selectedTab = 'tab-1'
  },
  methods: {
    getAllCommunityTabsData() {
      this.getAllCommunitiesListData()
      this.getMyCommunitiesListData()
      this.getInvitions()
      this.getInvitationCount()
    },
    isOwner(community) {
      return isOwner(community.membershipStatusId)
    },
    isOwnerOrMember(community) {
      return community.membershipStatusId == 2 || community.membershipStatusId == 1
    },
    saveNotificationSetting() {},
    cancelRequest(item) {
      cancelRequest(item.membershipResourceId).then(() => {
        this.getAllCommunitiesListData()
        this.getInvitationCount()
        setTimeout(() => {
          this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
        }, 500)
      })
      //this.isCancelRequestModal = true
    },
    cancelRequestConfirm() {
      cancelRequest(this.cancelRequestCommunityId)
        .then(() => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            message: '' // @nejat, @atakan
          })
          this.isCancelRequestModal = false
          this.getAllCommunitiesListData()
          this.getMyCommunitiesListData()
          this.getInvitationCount()
          setTimeout(() => {
            this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
          }, 500)
        })
        .catch((error) => {
          /*this.$store.dispatch('common/createSnackBar', {
                  color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
                  message: 'Error when attempting to leave from a community'
                })*/
        })
    },
    deleteCommunity(item) {
      this.deleteCommunityName = item.communityName
      this.deleteCommunityId = item.communityResourceId
      this.isWantToDelete = true
    },
    deleteCommunityConfirm() {
      deleteCommunity(this.deleteCommunityId).then((response) => {
        this.$store.dispatch('common/createSnackBar', {
          color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
          message: 'Community has been deleted successfully'
        })
        this.isWantToDelete = false
        this.getAllCommunitiesListData()
        this.getMyCommunitiesListData()
        this.getInvitationCount()
        setTimeout(() => {
          this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
        }, 500)
      })
    },
    getInvitationCount() {
      getInvitationCount()
        .then((response) => {
          this.invitationsCount = response.data.data.count
        })

        .catch((error) => {
          if (error.response.data.code === 'RESOURCE_NOT_FOUND') {
            this.invitationsCount = []
          }
        })
      /*
        .catch(() => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when attempting to get invitation counts'
          })
        })*/
    },
    refuseRequest(item) {
      refuseInvitation(item.resourceId).then(() => {
        this.$store.dispatch('common/createSnackBar', {
          color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
          message: 'Invitation request has been cancelled successfully'
        })
        this.getInvitions()
        this.getInvitationCount()
      })
      /*
        .catch(() => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when attempting to cancel invitation request'
          })
        })*/
    },
    acceptRequest(item) {
      acceptInvitation(item.resourceId).then(() => {
        this.$store.dispatch('common/createSnackBar', {
          color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
          message: 'Invitation request has been accepted successfully'
        })
        this.getInvitions()
        this.getInvitationCount()
      })
      /*
        .catch(() => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when attempting to accept an invitation request'
          })
        })*/
    },
    leaveFromCommunity(item) {
      this.leaveCommunityId = item.communityResourceId
      this.leaveCommunityName = item.communityName
      this.isWantToToLeaveFromCommunity = true
    },
    leaveFromCommunityConfirm() {
      removeFromCommunities(this.leaveCommunityId)
        .then(() => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            message: 'You have been removed from the community successfully'
          })
          this.isWantToToLeaveFromCommunity = false
          this.getAllCommunitiesListData()
          this.getMyCommunitiesListData()
          this.getInvitationCount()
          setTimeout(() => {
            this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
          }, 500)
        })
        .catch((error) => {
          /*this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when attempting to leave from a community'
          })*/
          if (error.response.data.code === 'CANNOT_LEAVE_COMMUNITY') {
            this.isWantToToLeaveFromCommunity = false
            this.showNeedPermissionModal = true
          }
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
    editCommunity(item) {
      this.resourceId = item.communityResourceId
      this.communityItem = item
      this.isWantToAddNewCommunity = true
    },
    onAddClose() {
      this.isWantToAddNewCommunity = false
      this.selectedTab = 'tab-1'
      this.getAllCommunitiesListData()
    },
    getInvitions() {
      this.listData = []
      getInvitations().then((response) => {
        const { data } = response
        this.listData = data.data
      })
    },
    getAllCommunitiesListData() {
      this.listData = []
      const payload = {
        pageNumber: 1,
        pageSize: 100,
        orderBy: 'CommunityName',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'OR',
              FilterItems: [
                {
                  FieldName: 'CommunityName',
                  Operator: 'Contains',
                  Value: this.filter
                },
                {
                  FieldName: 'CommunityDescription',
                  Operator: 'Contains',
                  Value: this.filter
                }
              ],
              FilterGroups: []
            }
          ]
        }
      }
      getAllCommunityList(payload)
        .then((response) => {
          const { data } = response
          this.listData = data.data.results
        })

        .catch((error) => {
          if (error.response.data.code === 'RESOURCE_NOT_FOUND') {
            this.listData = []
          }
        })
    },
    getMyCommunitiesListData() {
      this.listData = []
      const payload = {
        pageNumber: 1,
        pageSize: 100,
        orderBy: 'CommunityName',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'OR',
              FilterItems: [
                {
                  FieldName: 'CommunityName',
                  Operator: 'Contains',
                  Value: this.filter
                },
                {
                  FieldName: 'CommunityDescription',
                  Operator: 'Contains',
                  Value: this.filter
                }
              ],
              FilterGroups: []
            }
          ]
        }
      }
      getMyCommunityList(payload)
        .then((response) => {
          const { data } = response
          this.listData = data.data.results
        })
        .catch((error) => {
          if (error.response.data.code === 'RESOURCE_NOT_FOUND') {
            this.listData = []
          }
        })
    },
    communityDetails(item) {
      if (isOwnerOrMember(item.membershipStatusId)) {
        localStorage.setItem('communityName', item.communityName)
        localStorage.setItem('communityResourceIdForRedirect', item.communityResourceId)
        localStorage.setItem('isCommunityOwner', item.membershipStatusId == 1 ? 'owner' : 'member')
        this.$router.push({
          name: `Community`,
          params: { id: item.communityResourceId, item: item }
        })
      }
    },
    updateCommunities() {
      switch (this.selectedTab) {
        case 'tab-0':
          this.getMyCommunitiesListData()
          break
        case 'tab-1':
          this.getAllCommunitiesListData()

          break
        case 'tab-2':
          this.getInvitions()
          break
        default:
          return false
      }
    },
    requestJoin(communityId) {
      joinCommunity(communityId).then(() => {
        this.$store.dispatch('common/createSnackBar', {
          color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
          message: 'Join request has been sent successfully'
        })
        this.getAllCommunitiesListData()
        this.getMyCommunitiesListData()
        setTimeout(() => {
          this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
        }, 500)
      })
      /*.catch(() => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when attempting to send join request'
          })
        })*/
    },
    createNewCommunity() {
      this.isWantToAddNewCommunity = true
    },
    subTabSelected(name) {
      if (name == 'Your Communities') {
        this.selectedTab = 'tab-0'
        this.getMyCommunitiesListData()
      } else if (name == 'All') {
        this.selectedTab = 'tab-1'
        this.getAllCommunitiesListData()
      } else {
        this.selectedTab = 'tab-2'
        this.getInvitions()
        this.getInvitationCount()
        return
      }
    }
  }
}
</script>

<style lang="scss">
.communities-wrapper {
  .v-tabs-slider {
    width: calc(100% + 16px);
    margin-left: -8px;
  }
  .notification-wrapper {
    padding: 0 !important;
    width: 100%;
    box-shadow: 0 8px 10px -3px rgba(255, 255, 255, 0.14), 0 2px 4px 0 rgba(255, 255, 255, 0.14),
      0 3px 14px 2px rgba(255, 255, 255, 0.12);
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
  .search-wrapper {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    > div {
      padding-right: 10px;
    }

    .filter-icon {
      color: rgba(0, 0, 0, 0.34) !important;
      cursor: pointer;
    }
  }

  .threat-sharing-content {
    min-height: 150px;
    width: 100%;
    border-radius: 20px;
    box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
      0 3px 1px -2px rgba(80, 80, 80, 0.12);
    background-color: #ffffff;
    padding: 24px;
    margin-bottom: 16px;
  }

  .ts-header {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
  }

  .ts-title {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 24px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.29;
    letter-spacing: normal;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.87);
    max-height: 70px;
    max-width: 60%;
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
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

  .v-application--is-ltr .v-list-item__icon:first-child {
    margin-right: 10px !important;
  }

  .empty-communities {
    align-items: center;
    display: flex;
    justify-content: center;
    position: relative;
    min-height: 171px;
    width: 100%;

    .empty-communities-inline {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 420px;

      .no-community {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 24px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.29;
        letter-spacing: normal;
        color: #000;
        text-align: center;
        width: 100%;
        padding-top: 50px;
        padding-bottom: 16px;
      }
    }
  }

  .create-com-btn {
    align-items: center;
    background-color: #2196f3 !important;
    color: #fff;
    display: flex;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    height: 36px !important;
    text-transform: unset !important;
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
    font-size: 13px !important;
    font-weight: normal !important;
    font-stretch: normal !important;
    font-style: normal !important;
    line-height: normal !important;
    letter-spacing: normal !important;
    color: rgba(0, 0, 0, 0.72) !important;
  }

  .invite-sub-header {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px !important;
    font-weight: normal !important;
    font-stretch: normal !important;
    font-style: normal !important;
    line-height: 1.5 !important;
    letter-spacing: normal !important;
    color: rgba(0, 0, 0, 0.87) !important;
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

  .delete-dialog-body {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.72);
    margin-top: 38px;
    margin-bottom: 24px;
  }

  .join-button {
    color: #fff !important;
    background-color: #2196f3 !important;
    font-family: 'Open Sans', sans-serif !important;
    box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5) !important;
    border: none !important;
  }

  .invitation-cancel {
    color: #fff;
    background-color: #f56c6c;
  }

  .invitation-accept {
    color: #fff;
    background-color: #2196f3;
  }

  ::v-deep .text-decoration-none {
    text-decoration: none !important;
    text-decoration-line: none !important;
  }

  .invitations-count {
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
}
.communities-wrapper__community-notification-row {
  display: flex;
  width: 100%;
  align-items: flex-end;
  justify-content: space-between;
  .community-notification__text {
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }
}
</style>
