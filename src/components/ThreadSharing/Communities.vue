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
        <app-dialog-footer
          @handleClose="isWantToDelete = false"
          @handleConfirm="deleteCommunityConfirm()"
          actionButtonText="DELETE"
        />
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
        <app-dialog-footer
          :confirm-button-disabled="isLeaveFromCommunityButtonDisabled"
          @handleClose="isWantToToLeaveFromCommunity = false"
          @handleConfirm="leaveFromCommunityConfirm"
          actionButtonText="LEAVE"
        />
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
      @changeStatus="openNotificationModal = false"
      :status="openNotificationModal"
      v-if="openNotificationModal"
      icon="mdi-bell"
      title="Community Notification Settings"
    >
      <template v-slot:app-dialog-body>
        <div v-if="notificationLoading">
          <v-skeleton-loader :loading="notificationLoading" type="article, list-item"
            ><slot name="skeleton-content"></slot
          ></v-skeleton-loader>
        </div>
        <div v-else>
          <!--
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
                  @change="setAllNotification"
                />
              </div>
            </div>
          </v-list-item>-->
          <!--<v-list-item class="pa-0">
            <div class="communities-wrapper__community-notification-row">
              <div class="community-notification__text">
                Dashboard notifications
              </div>
              <div>
                <v-switch
                  id="dashboard-notif-switch"
                  v-model="notifications.isDashboardEnabled"
                  color="#2196f3"
                  hide-details
                  class="community-notification-switch mt-0"
                  @change="checkAllNotificationsAreSelected"
                />
              </div>
            </div>
          </v-list-item> -->
          <v-list-item class="pa-0">
            <div class="communities-wrapper__community-notification-row">
              <div class="community-notification__text">
                Email notifications
              </div>
              <div>
                <v-switch
                  id="email-notif-switch"
                  v-model="notifications.isEmailEnabled"
                  color="#2196f3"
                  hide-details
                  class="community-notification-switch mt-0"
                  @change="checkAllNotificationsAreSelected"
                />
              </div>
            </div>
          </v-list-item>
          <!--
          <v-list-item class="pa-0">
            <div class="communities-wrapper__community-notification-row">
              <div class="community-notification__text">
                SMS notifications
              </div>
              <div>
                <v-switch
                  id="whatsapp-notif-switch"
                  v-model="notifications.isSMSEnabled"
                  color="#2196f3"
                  hide-details
                  class="community-notification-switch mt-0"
                  @change="checkAllNotificationsAreSelected"
                />
              </div>
            </div>
          </v-list-item> -->
        </div>
      </template>
      <template v-slot:app-dialog-footer>
        <app-dialog-footer
          :confirm-button-disabled="isNotificationSettingButtonDisabled"
          @handleClose="openNotificationModal = false"
          @handleConfirm="saveNotificationSetting"
        />
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
              >{{ labels.Cancel }}
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
          :items="selectedTab === 'tab-2' ? invitationData : listData"
          :page.sync="page"
          :items-per-page.sync="itemsPerPage"
          hide-default-footer
          @change="$forceUpdate()"
          :footer-props="{ itemsPerPageOptions }"
        >
          <template v-slot:header>
            <v-tabs v-model="selectedTab" class="community-selector">
              <v-tab
                v-for="(tab, ind) in tabOptions"
                :key="ind"
                @click="subTabSelected(tab)"
                :href="`#tab-${ind}`"
                class="text-decoration-none sub-tab__content"
                :disabled="communityLoading"
              >
                <template v-if="ind === 2">
                  {{ tab }}
                  <span
                    v-if="checkPermissions('communities/my-invitations', 'GET') && invitationsCount"
                    class="invitations-count"
                  >
                    {{ invitationsCount }}
                  </span>
                </template>
                <template v-else>
                  {{ tab }}
                </template>
              </v-tab>
            </v-tabs>
            <div class="search-wrapper">
              <div>
                <v-text-field
                  @mouseover.native="hover = true"
                  placeholder="Search"
                  outlined
                  class="filter-field search-wrapper__search-filter"
                  v-model.trim="filter"
                  id="incidents-search-textfield"
                  hide-details
                  prepend-inner-icon="mdi-magnify"
                  :disabled="selectedTab === 'tab-2' || communityLoading"
                ></v-text-field>
              </div>
              <div>
                <v-combobox
                  :items="industryList"
                  item-text="name"
                  item-value="resourceId"
                  value="resourceId"
                  max-width="180"
                  outlined
                  class="edit-select search-wrapper__combobox"
                  v-model.trim="industryValue"
                  @change="updateCommunities(true)"
                  :placeholder="'Industry'"
                  hide-details
                  multiple
                  :disabled="selectedTab === 'tab-2' || communityLoading"
                  :slots="{ selection: true, item: false }"
                >
                  <template v-slot:selection="{ item, index }">
                    <span
                      v-if="index === 0"
                      style="
                        font-size: 13px;
                        line-height: 1.6;
                        letter-spacing: normal;
                        color: rgba(0, 0, 0, 0.72) !important;
                      "
                    >
                      {{ item.name }}
                    </span>
                    <span v-if="index === 1" class="caption pl-1">
                      (+{{ industryValue.length - 1 }})</span
                    >
                  </template>
                </v-combobox>
              </div>
              <div class="d-flex">
                <k-select
                  :items="privacyList"
                  placeholder="Privacy"
                  outlined
                  v-model="privacyValue"
                  multiple
                  hide-details
                  item-text="name"
                  item-value="id"
                  @change="updateCommunities(true)"
                  :menu-props="{ offsetY: true }"
                  :disabled="selectedTab === 'tab-2' || communityLoading"
                  :slots="{ selection: true, item: false }"
                >
                  <template v-slot:selection="{ item, index }">
                    <span
                      v-if="index === 0"
                      style="
                        font-size: 13px;
                        line-height: 1.6;
                        letter-spacing: normal;
                        color: rgba(0, 0, 0, 0.72) !important;
                      "
                    >
                      {{ item.name }}
                    </span>
                    <span v-if="index === 1" class="caption pl-1">
                      (+{{ privacyValue.length - 1 }})</span
                    >
                  </template>
                </k-select>
              </div>
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
                      color="blue"
                    >
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
                      v-else-if="
                        !item.membershipStatusId &&
                        (item.privacyStatusName == 'Private' ||
                          (item.membershipStatusId == 5 && item.privacyStatusName == 'Private'))
                      "
                      outlined
                      rounded
                      medium
                      :disabled="isRequestToJoinDisabled"
                      class="join-button"
                      @click="
                        requestJoin(item.communityResourceId, item.communityName, 'requestToJoin')
                      "
                    >
                      <v-icon style="font-size: 20px; margin-right: 8px;">mdi-account-plus</v-icon>
                      REQUEST TO JOIN
                    </v-btn>
                    <v-btn
                      v-else-if="
                        !item.membershipStatusId &&
                        (item.privacyStatusName == 'Public' ||
                          (item.membershipStatusId == 5 && item.privacyStatusName == 'Public'))
                      "
                      outlined
                      rounded
                      :disabled="isRequestToJoinDisabled"
                      medium
                      class="join-button"
                      @click="requestJoin(item.communityResourceId, item.communityName, 'join')"
                    >
                      <v-icon style="font-size: 20px; margin-right: 8px;">mdi-account-plus</v-icon>
                      JOIN
                    </v-btn>
                    <v-btn
                      v-else-if="
                        item.membershipStatusId && (item.membershipStatusId == 5 && item.privacyStatusName == 'Private')
                      "
                      outlined
                      rounded
                      medium
                      color="blue"
                    >
                      Request Declined
                    </v-btn>
                    <v-btn
                      v-else-if="
                        item.membershipStatusId && (item.membershipStatusId == 5 && item.privacyStatusName == 'Public')
                      "
                      outlined
                      rounded
                      medium
                      color="blue"
                    >
                      Request Declined
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
                          <v-list-item
                            @click="editCommunity(item)"
                            v-if="
                              checkPermissions('communities/{resourceId}', 'PUT') && isOwner(item)
                            "
                          >
                            <v-list-item-icon>
                              <v-icon>mdi-pencil</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>Edit Community</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item
                            @click="setNotificationModal(item.communityResourceId)"
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
                            v-if="
                              checkPermissions('communities/{resourceId}/leave', 'POST') &&
                              isOwnerOrMember(item)
                            "
                          >
                            <v-list-item-icon>
                              <v-icon>mdi-exit-to-app</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>Leave</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item
                            @click="deleteCommunity(item)"
                            v-if="
                              checkPermissions('communities/{resourceId}', 'DELETE') &&
                              isOwner(item)
                            "
                          >
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
            <div
              v-if="
                selectedTab === 'tab-2' && checkPermissions('communities/my-invitations', 'GET')
              "
            >
              <div v-for="(item, ind) of props.items" :key="ind" class="threat-sharing-content">
                <div class="ts-header">
                  <div class="ts-title" @click="community(item)">
                    {{ item.name }}
                  </div>
                  <div class="flex-grow-1"></div>
                  <div class="ts-header-btn-1">
                    <div class="request-btns flex-grow-1">
                      <v-btn class="refuse-btn" block rounded medium @click="refuseRequest(item)">
                        {{ labels.Cancel }}
                      </v-btn>
                      <v-btn
                        class="accept-btn"
                        :disabled="item['disabled']"
                        block
                        rounded
                        medium
                        @click="acceptRequest(item)"
                      >
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
          <template v-if="communityLoading" slot="no-data">
            <v-skeleton-loader
              :loading="communityLoading"
              type="article, actions"
            ></v-skeleton-loader>
          </template>
          <template
            v-if="(!communityLoading && filter) || (!communityLoading && industryValue.length)"
            slot="no-data"
          >
            <div
              class="empty-communities"
              v-if="selectedTab === 'tab-1' || selectedTab === 'tab-0'"
            >
              <div class="empty-communities-inline">
                <span class="no-community">
                  Sorry, we couldn't find any results matching your criteria
                </span>
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
          <template v-if="!communityLoading && !industryValue.length && !filter" slot="no-data">
            <div class="empty-communities" v-if="selectedTab === 'tab-1'">
              <div class="empty-communities-inline">
                <span class="no-community">
                  No community has been created
                </span>
                <v-btn class="create-com-btn mb-11" @click="createNewCommunity()" rounded>
                  Create Community
                </v-btn>
              </div>
            </div>
            <div class="empty-communities" v-if="selectedTab === 'tab-0'">
              <div class="empty-communities-inline">
                <span class="no-community">
                  You haven’t joined any communities
                </span>
                <v-btn class="create-com-btn mb-11" @click="subTabSelected('All')" rounded>
                  Browse Communities
                </v-btn>
              </div>
            </div>
            <div class="empty-communities" v-if="selectedTab === 'tab-2'" id="tab-2-2">
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
          <template v-slot:footer>
            <v-row
              class="mt-2"
              justify="end"
              style="margin: 5px !important;"
              v-if="
                selectedTab && selectedTab === 'tab-2' ? invitationData.length : listData.length
              "
            >
              <el-pagination
                layout="sizes, prev, pager, next,slot"
                :current-page.sync="page"
                :page-sizes="itemsPerPageArray"
                :page-size="itemsPerPage"
                @size-change="handleSizeChange"
                @current-change="onChangePagination"
                :total="
                  selectedTab && selectedTab === 'tab-2'
                    ? invitationData.length
                    : totalNumberOfRecords
                "
              >
                <template>
                  <span class="el-pagination__total el-pagination__text--1">Rows per page:</span>
                  <span class="el-pagination__text el-pagination__text--2">
                    {{ page }}-{{ numberOfPages }}
                    of
                    {{
                      selectedTab && selectedTab === 'tab-2'
                        ? invitationData.length
                        : totalNumberOfRecords
                    }}
                  </span>
                </template>
              </el-pagination>
            </v-row>
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
  getCommunityDetails,
  getInvitationCount,
  getInvitations,
  getMyCommunityList,
  joinCommunity,
  listBusinessCategories,
  refuseInvitation,
  removeFromCommunities,
  updateNotifications
} from '../../api/threadSharing'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'
import VClamp from 'vue-clamp'
import { checkPermission, isOwner, isOwnerOrMember } from '../../utils/functions'
import NewCommunity from '../ThreadSharing/NewCommunity'
import AppDialog from '../AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import KSelect from '@/components/Common/Inputs/KSelect'
import labels from '@/model/constants/labels'
import { getNotifications } from '../../api/dashboard'

export default {
  components: {
    KSelect,
    AppDialogFooter,
    VClamp,
    NewCommunity,
    AppDialog
  },
  computed: {
    numberOfPages() {
      return Math.ceil(
        this.selectedTab && this.selectedTab === 'tab-2'
          ? this.invitationData && this.invitationData.length / this.itemsPerPage
          : this.listData && this.totalNumberOfRecords / this.itemsPerPage
      )
    }
  },
  data: () => ({
    totalNumberOfRecords: null,
    totalNumberOfPages: null,
    itemsPerPageArray: [5, 10, 20],
    page: 1,
    itemsPerPage: 5,
    isNotificationSettingButtonDisabled: false,
    isRequestToJoinDisabled: false,
    temporaryResourceId: null,
    isLeaveFromCommunityButtonDisabled: false,
    notificationLoading: false,
    labels,
    industryList: [],
    industryValue: [],
    privacyList: [
      { name: 'Public', id: 1 },
      { name: 'Private', id: 2 },
      { name: 'Hidden', id: 3 }
    ],
    privacyValue: [],
    cancelRequestCommunityName: null,
    cancelRequestCommunityId: null,
    isCancelRequestModal: false,
    notifications: {
      isNotifications: false,
      isSMSEnabled: false,
      isEmailEnabled: false,
      isDashboardEnabled: false
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
    itemsPerPageOptions: [5, 10, 20],
    filter: '',
    listData: [{}],
    invitationData: [],
    communityLoading: true
  }),
  props: {
    refresh: {
      type: Boolean
    },
    isCommunity: { required: false },
    isLoadState: {
      type: Boolean
    },

    setLoadState: {
      required: false
    }
  },
  watch: {
    refresh: function (newVal, oldVal) {
      if (oldVal != newVal && !this.isLoadState) {
        this.selectedTab = 'tab-1'
        this.getAllCommunitiesListData()
        this.getMyCommunitiesListData()
      }
    },
    filter: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (!newVal) {
          this.updateCommunities()
        } else {
          this.debounce(() => {
            this.updateCommunities()
          }, 1000)
        }
      }
    },
    page: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log(newVal)
        console.log(oldVal)
      }
    }
  },
  created() {
    this.getIndustryList()
    if (this.isCommunity) {
      if (this.$route.params.communityName === 'empty') {
        getCommunityDetails(this.$route.params.communityId)
          .then((response) => {
            this.communityDetails = response.data.data
            this.filter = response.data.data.name
          })
          .catch((error) => {
            error.response.data
          })
        this.isCommunity = false
      } else {
        this.filter = this.$route.params.communityName
        setTimeout(() => {
          this.isCommunity = false
        }, 2000)
      }
    }
    if (!this.isLoadState) this.selectedTab = 'tab-1'
    setTimeout(() => {
      this.$emit('setLoadState')
    }, 3000)
  },
  methods: {
    handleSizeChange(val) {
      this.itemsPerPage = val
      if (!this.isLoadState) {
        switch (this.selectedTab) {
          case 'tab-0':
            this.getMyCommunitiesListData(true)
            break
          case 'tab-1':
            if (!this.isCommunity) this.getAllCommunitiesListData(true)
            break
          default:
            return false
        }
      } else {
        const communitiesData = this.$store.state['communities'].communities.communitiesData
        if (communitiesData) {
          debugger
          this.filter = communitiesData.searchValues.filter
          this.industryValue = communitiesData.searchValues.industryValue
          this.privacyValue = communitiesData.searchValues.privacyValue
          this.selectedTab = communitiesData.searchValues.selectedTab
          this.page = communitiesData.searchValues.page
          this.totalNumberOfRecords = communitiesData.searchValues.totalNumberOfRecords
          this.totalNumberOfPages = communitiesData.searchValues.totalNumberOfPages
          this.selectedTab = communitiesData.searchValues.selectedTab
          this.communityLoading = false
          this.itemsPerPage = communitiesData.searchValues.itemsPerPage
        }
      }
    },
    onChangePagination() {
      if (!this.isLoadState) {
        switch (this.selectedTab) {
          case 'tab-0':
            this.getMyCommunitiesListData()
            break
          case 'tab-1':
            if (!this.isCommunity) this.getAllCommunitiesListData()
            break
        }
      } else {
        const communitiesData = this.$store.state['communities'].communities.communitiesData
        if (communitiesData) {
          this.filter = communitiesData.searchValues.filter
          this.industryValue = communitiesData.searchValues.industryValue
          this.privacyValue = communitiesData.searchValues.privacyValue
          this.selectedTab = communitiesData.searchValues.selectedTab
          debugger
          this.page = communitiesData.searchValues.page
          this.totalNumberOfRecords = communitiesData.searchValues.totalNumberOfRecords
          this.totalNumberOfPages = communitiesData.searchValues.totalNumberOfPages
          this.selectedTab = communitiesData.searchValues.selectedTab
          this.communityLoading = false
          this.itemsPerPage = communitiesData.searchValues.itemsPerPage
        }
      }
    },
    checkPermissions(permission, type) {
      return checkPermission(permission, type)
    },
    setNotificationModal(communityResourceId) {
      this.temporaryResourceId = communityResourceId
      this.getNotifications()
      this.openNotificationModal = true
    },
    setAllNotification(val) {
      this.notifications = {
        isNotifications: val,
        isSMSEnabled: val,
        isEmailEnabled: val,
        isDashboardEnabled: val
      }
    },
    checkAllNotificationsAreSelected() {
      this.notifications.isNotifications =
        this.notifications.isSMSEnabled &&
        this.notifications.isEmailEnabled &&
        this.notifications.isDashboardEnabled
    },
    getNotifications() {
      this.notificationLoading = true
      let payload = {
        EntityResourceId: this.temporaryResourceId,
        TypeId: 1
      }
      getNotifications(payload)
        .then((response) => {
          this.notifications = {
            isNotifications:
              response.data.data.isSMSEnabled &&
              response.data.data.isEmailEnabled &&
              response.data.data.isDashboardEnabled,
            isSMSEnabled: response.data.data.isSMSEnabled,
            isEmailEnabled: response.data.data.isEmailEnabled,
            isDashboardEnabled: response.data.data.isDashboardEnabled
          }
        })
        .finally(() => {
          this.notificationLoading = false
        })
    },
    getIndustryList() {
      listBusinessCategories().then((response) => {
        this.industryList = response.data.data
      })
    },
    isOwner(community) {
      return isOwner(community.membershipStatusId)
    },
    isOwnerOrMember(community) {
      return community.membershipStatusId == 2 || community.membershipStatusId == 1
    },
    saveNotificationSetting() {
      let payload = {
        EntityResourceId: this.temporaryResourceId,
        TypeId: 1,
        IsSMSEnabled: this.notifications.isSMSEnabled,
        IsEmailEnabled: this.notifications.isEmailEnabled,
        IsDashboardEnabled: this.notifications.isDashboardEnabled
      }
      this.isNotificationSettingButtonDisabled = true
      updateNotifications(payload)
        .then((response) => {
          this.openNotificationModal = false
        })
        .finally(() => (this.isNotificationSettingButtonDisabled = false))
    },
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
      cancelRequest(this.cancelRequestCommunityId).then(() => {
        this.isCancelRequestModal = false
        this.getAllCommunitiesListData()
        this.getMyCommunitiesListData()
        this.getInvitationCount()
        setTimeout(() => {
          this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
        }, 500)
      })
    },
    deleteCommunity(item) {
      this.deleteCommunityName = item.communityName
      this.deleteCommunityId = item.communityResourceId
      this.isWantToDelete = true
    },
    deleteCommunityConfirm() {
      deleteCommunity(this.deleteCommunityId).then(() => {
        this.isWantToDelete = false
        switch (this.selectedTab) {
          case 'tab-0':
            this.getMyCommunitiesListData()
            break
          case 'tab-1':
            if (!this.isCommunity) this.getAllCommunitiesListData()
            break
          case 'tab-2':
            this.getInvitions()
            this.getInvitationCount()
            break
          default:
            return false
        }
        setTimeout(() => {
          this.$store.dispatch('rightColumn/changeReloadRightColumnData', true)
        }, 500)
      })
    },
    setInitialCommunityValues() {
      this.selectedTab = 'tab-1'
    },
    getInvitationCount() {
      if (this.checkPermissions('communities/my-invitations', 'GET')) {
        getInvitationCount()
          .then((response) => {
            this.invitationsCount = response.data.data.count
          })

          .catch((error) => {
            if (
              error.response &&
              error.response.data &&
              error.response.data.code === 'RESOURCE_NOT_FOUND'
            ) {
              this.invitationsCount = []
            }
          })
      }
    },
    refuseRequest(item) {
      refuseInvitation(item.resourceId).then(() => {
        this.getInvitions()
        this.getInvitationCount()
      })
    },
    acceptRequest(item) {
      item['disabled'] = true
      this.$forceUpdate()
      acceptInvitation(item.resourceId)
        .then(() => {
          this.getInvitions()
          this.getInvitationCount()
        })
        .finally(() => {
          item['disabled'] = false
        })
    },
    leaveFromCommunity(item) {
      this.leaveCommunityId = item.communityResourceId
      this.leaveCommunityName = item.communityName
      this.isWantToToLeaveFromCommunity = true
    },
    leaveFromCommunityConfirm() {
      this.isLeaveFromCommunityButtonDisabled = true
      removeFromCommunities(this.leaveCommunityId)
        .then(() => {
          this.isWantToToLeaveFromCommunity = false
          if (this.selectedTab === 'tab-0') {
            this.getMyCommunitiesListData(true)
          } else {
            this.getAllCommunitiesListData()
          }
          this.getInvitationCount()
          setTimeout(() => {
            this.$store.dispatch('rightColumn/changeReloadRightColumnData', true).finally(() => {
              this.isLeaveFromCommunityButtonDisabled = false
            })
          }, 500)
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.code === 'CANNOT_LEAVE_COMMUNITY'
          ) {
            this.isWantToToLeaveFromCommunity = false
            this.showNeedPermissionModal = true
          }
          this.isLeaveFromCommunityButtonDisabled = false
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
      if (this.checkPermissions('communities/my-invitations', 'GET')) {
        this.invitationData = []
        this.communityLoading = true
        getInvitations()
          .then((response) => {
            const { data } = response
            this.invitationData = data.data
            this.communityLoading = false
            this.totalNumberOfRecords = data.data.totalNumberOfRecords
            this.totalNumberOfPages = data.data.totalNumberOfPages
          })
          .catch((error) => {
            if (
              error.response &&
              error.response.data &&
              error.response.data.code === 'RESOURCE_NOT_FOUND'
            ) {
              this.invitationData = []
            }
          })
          .finally(() => {
            this.communityLoading = false
          })
      }
    },
    getAllCommunitiesListData(isSearch) {
      this.listData = []
      this.communityLoading = true
      debugger
      const payload = {
        pageNumber: isSearch ? 1 : this.page,
        pageSize: this.itemsPerPage,
        orderBy: 'createTime',
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
            },
            {
              Condition: 'AND',
              FilterItems: [
                {
                  FieldName: 'IndustryResourceId',
                  Operator: 'Include',
                  Value: this.industryValue.map((item) => item.resourceId).toString() || ''
                }
              ],
              FilterGroups: []
            },
            {
              Condition: 'AND',
              FilterItems: [
                {
                  FieldName: 'PrivacyStatusId',
                  Operator: 'Include',
                  Value: this.privacyValue.toString() || ''
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
          debugger
          if (isSearch) this.page = 1
          if (this.isCommunity) {
            this.listData = data.data.results.filter(
              (item) => item.communityResourceId === this.$route.params.communityId
            )
            this.totalNumberOfRecords = data.data.totalNumberOfRecords
            this.totalNumberOfPages = data.data.totalNumberOfPages
          } else {
            this.listData = data.data.results
            this.totalNumberOfRecords = data.data.totalNumberOfRecords
            this.totalNumberOfPages = data.data.totalNumberOfPages
          }
        })

        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.code === 'RESOURCE_NOT_FOUND'
          ) {
            this.listData = []
          }
        })
        .finally(() => {
          this.communityLoading = false
        })
    },
    getMyCommunitiesListData(isSearch) {
      this.listData = []
      this.communityLoading = true
      debugger
      const payload = {
        pageNumber: isSearch ? 1 : this.page,
        pageSize: this.itemsPerPage,
        orderBy: 'createTime',
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
            },
            {
              Condition: 'AND',
              FilterItems: [
                {
                  FieldName: 'IndustryResourceId',
                  Operator: 'Include',
                  Value: this.industryValue.map((item) => item.resourceId).toString() || ''
                }
              ],
              FilterGroups: []
            },
            {
              Condition: 'AND',
              FilterItems: [
                {
                  FieldName: 'PrivacyStatusId',
                  Operator: 'Include',
                  Value: this.privacyValue.toString() || ''
                }
              ],
              FilterGroups: []
            }
          ]
        }
      }
      getMyCommunityList(payload)
        .then((response) => {
          debugger
          if (isSearch) this.page = 1
          const { data } = response
          this.listData = data.data.results
          this.totalNumberOfRecords = data.data.totalNumberOfRecords
          this.totalNumberOfPages = data.data.totalNumberOfPages
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.code === 'RESOURCE_NOT_FOUND'
          ) {
            this.listData = []
          }
        })
        .finally(() => (this.communityLoading = false))
    },
    communityDetails(item) {
      if (isOwnerOrMember(item.membershipStatusId)) {
        localStorage.setItem('communityName', item.communityName)
        localStorage.setItem('communityResourceIdForRedirect', item.communityResourceId)
        localStorage.setItem('isCommunityOwner', item.membershipStatusId == 1 ? 'owner' : 'member')
        let communitiesData = {
          tableData: this.selectedTab === 'tab-2' ? this.invitationData : this.listData,
          searchValues: {
            filter: this.filter,
            industryValue: this.industryValue,
            privacyValue: this.privacyValue,
            selectedTab: this.selectedTab,
            page: this.page,
            totalNumberOfRecords: this.totalNumberOfRecords,
            totalNumberOfPages: this.totalNumberOfPages,
            itemsPerPage: this.itemsPerPage
          },
          type: 'community'
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
        this.$router.push({
          name: `Community`,
          params: { id: item.communityResourceId, item: item }
        })
      } else {
        localStorage.setItem('isCommunityOwner', item.membershipStatusId == 1 ? 'owner' : 'member')
      }
    },
    updateCommunities(isSearch) {
      this.isCommunity = false
      if (!this.isLoadState) {
        switch (this.selectedTab) {
          case 'tab-0':
            this.getMyCommunitiesListData(true)
            break
          case 'tab-1':
            if (!this.isCommunity) this.getAllCommunitiesListData(true)
            break
          case 'tab-2':
            this.getInvitions()
            break
          default:
            return false
        }
      }
    },
    requestJoin(communityId, communityName, type) {
      this.communityLoading = true
      this.isRequestToJoinDisabled = true
      joinCommunity(communityId)
        .then(() => {
          if (type === 'join') {
            this.listData.find(
              (item) => item.communityResourceId === communityId
            ).membershipStatusId = 2
            localStorage.setItem('communityName', communityName)
            localStorage.setItem('communityResourceIdForRedirect', communityId)
            let communitiesData = {
              tableData: this.selectedTab === 'tab-2' ? this.invitationData : this.listData,
              searchValues: {
                filter: this.filter,
                industryValue: this.industryValue,
                privacyValue: this.privacyValue,
                selectedTab: this.selectedTab,
                page: this.page,
                totalNumberOfRecords: this.totalNumberOfRecords,
                totalNumberOfPages: this.totalNumberOfPages,
                itemsPerPage: this.itemsPerPage
              },
              type: 'community'
            }
            this.$store.dispatch('communities/setCommunities', {
              key: 'communityJoin',
              communitiesData
            })
            let incidentsData = null
            this.$store.dispatch('incidents/setIncidents', {
              key: 'incidents',
              incidentsData
            })
            this.$router.push(`/community/${communityId}`)
          } else {
            this.listData.find(
              (item) => item.communityResourceId === communityId
            ).membershipStatusId = 3
            if (this.selectedTab === 'tab-1') {
              this.getAllCommunitiesListData()
            } else {
              this.getMyCommunitiesListData()
            }
          }

          setTimeout(() => {
            this.$store
              .dispatch('rightColumn/changeReloadRightColumnData', true)
              .finally(() => (this.isRequestToJoinDisabled = false))
          }, 500)
        })
        .catch(() => {
          this.isRequestToJoinDisabled = false
        })
        .finally(() => {
          this.communityLoading = false
        })
    },
    createNewCommunity() {
      this.isWantToAddNewCommunity = true
    },
    subTabSelected(name) {
      this.isCommunity = false
      if (name == 'Your Communities' && !this.isLoadState) {
        this.selectedTab = 'tab-0'
        this.getMyCommunitiesListData()
      } else if (name == 'All' && !this.isLoadState) {
        this.selectedTab = 'tab-1'
        this.getAllCommunitiesListData()
      } else {
        if (!this.isLoadState) {
          this.selectedTab = 'tab-2'
          this.filter = ''
          this.industryValue = []
          this.privacyValue = []
          this.getInvitions()
          this.getInvitationCount()
        }
        return
      }
    }
  }
}
</script>
<style lang="scss" src="./Communities.scss"></style>
