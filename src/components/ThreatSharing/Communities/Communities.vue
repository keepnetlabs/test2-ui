<template>
  <div class="communities-wrapper">
    <v-overlay
      id="new-community-overlay"
      :value="isWantToAddNewCommunity"
      :class="{ newCommunityOverlay: isWantToAddNewCommunity }"
      :opacity="1"
      :z-index="9"
      color="white"
    >
      <new-community
        ref="newCommunityModal"
        :communityItem="communityItem"
        :resourceId="resourceId"
        @closeAdd="onAddClose"
      />
    </v-overlay>
    <app-dialog
      :status="isWantToDelete"
      @changeStatus="isWantToDelete = false"
      icon="mdi-delete"
      type="delete"
      title="Delete Community?"
      :subtitle="deleteCommunityName"
      :body="`${deleteCommunityName} will be deleted. All posts and data will be lost`"
    >
      <template v-slot:app-dialog-footer>
        <app-dialog-footer
          @handleClose="isWantToDelete = false"
          @handleConfirm="deleteCommunityConfirm()"
          actionButtonText="DELETE"
          type="delete"
          cancel-button-id="threat-sharing-communities-delete-modal-cancel-button"
          confirm-button-id="threat-sharing-communities-delete-modal-confirm-button"
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
          cancel-button-id="threat-sharing-communities-leave-modal-cancel-button"
          confirm-button-id="threat-sharing-communities-leave-modal-confirm-button"
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
              id="threat-sharing-communities-need-petmission-modal-i-undestand-button"
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
        </div>
      </template>
      <template v-slot:app-dialog-footer>
        <app-dialog-footer
          :confirm-button-disabled="isNotificationSettingButtonDisabled"
          @handleClose="openNotificationModal = false"
          @handleConfirm="saveNotificationSetting"
          cancel-button-id="threat-sharing-communities-notification-setting-modal-cancel-button"
          confirm-button-id="threat-sharing-communities-notification-setting-modal-confirm-button"
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
              id="threat-sharing-communities-cancel-request-modal-cancel-button"
              >{{ labels.Cancel }}
            </v-btn>
          </div>
          <div class="d-flex flex-row flex-end">
            <v-btn
              id="threat-sharing-communities-cancel-request-modal-confirm-button"
              class="pa-0 k-dialog__button"
              text
              color="#2196f3"
              @click="cancelRequestConfirm"
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
                :id="`threat-sharing-communities-tab-${ind}`"
              >
                <template v-if="ind === 2">
                  {{ tab }}
                  <span
                    v-if="getMyInvitationsPermission && invitationsCount"
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
                <community-card
                  :community="item"
                  :isOwnerOrMember="isOwnerOrMember(item)"
                  :isRequestToJoinDisabled="isRequestToJoinDisabled"
                  :canEditCommunity="getEditCommunityPermission && isOwner(item)"
                  :canLeaveCommunity="getLeaveCommunityPermission && isOwnerOrMember(item)"
                  :canDeleteCommunity="getDeleteCommunityPermission && isOwner(item)"
                  @detailsClick="communityDetails(item)"
                  @requestJoin="
                    requestJoin(item.communityResourceId, item.communityName, 'requestToJoin')
                  "
                  @join="requestJoin(item.communityResourceId, item.communityName, 'join')"
                  @invitedClick="subTabSelected"
                  @editCommunity="editCommunity(item)"
                  @notificationSettingsClick="setNotificationModal(item.communityResourceId)"
                  @leaveCommunity="leaveFromCommunity(item)"
                  @deleteCommunity="deleteCommunity(item)"
                  @cancelRequest="cancelRequest(item)"
                />
              </div>
            </div>
            <div v-if="selectedTab === 'tab-2' && getMyInvitationsPermission">
              <div v-for="(item, ind) of props.items" :key="ind" class="threat-sharing-content">
                <community-invitation-card
                  :community="item"
                  @communityNameClick="communityDetails(item)"
                  @refuseRequest="refuseRequest(item)"
                  @acceptRequest="acceptRequest(item)"
                />
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
            v-if="
              (!communityLoading && filter) ||
              (!communityLoading && industryValue.length) ||
              (!communityLoading && privacyValue.length)
            "
            slot="no-data"
          >
            <div
              class="empty-communities"
              v-if="selectedTab === 'tab-1' || selectedTab === 'tab-0'"
            >
              <div class="empty-communities-inline">
                <span class="no-community">
                  Sorry, that search and filter criteria has no results.
                </span>
              </div>
            </div>
            <div class="empty-communities" v-if="selectedTab === 'tab-2'" id="tab-2">
              <div class="empty-communities-inline">
                <span class="no-community">
                  You don't have any invitations from communities
                </span>
                <v-btn
                  id="threat-sharing-communities-browse-communities-button"
                  class="create-com-btn mb-11"
                  @click="subTabSelected('All')"
                  rounded
                >
                  Browse Communities
                </v-btn>
              </div>
            </div>
          </template>
          <template
            v-else-if="!communityLoading && !industryValue.length && !filter"
            slot="no-data"
          >
            <div class="empty-communities" v-if="selectedTab === 'tab-1'">
              <div class="empty-communities-inline">
                <span class="no-community">
                  No community has been created
                </span>
                <v-btn
                  id="threat-sharing-communities-create-community-button"
                  class="create-com-btn mb-11"
                  @click="createNewCommunity()"
                  rounded
                >
                  Create Community
                </v-btn>
              </div>
            </div>
            <div class="empty-communities" v-if="selectedTab === 'tab-0'">
              <div class="empty-communities-inline">
                <span class="no-community">
                  You haven’t joined any communities
                </span>
                <v-btn
                  id="threat-sharing-communities-browse-community-button"
                  class="create-com-btn mb-11"
                  @click="subTabSelected('All')"
                  rounded
                >
                  Browse Communities
                </v-btn>
              </div>
            </div>
            <div class="empty-communities" v-if="selectedTab === 'tab-2'" id="tab-2-2">
              <div class="empty-communities-inline">
                <span class="no-community">
                  You don't have any invitations from communities
                </span>
                <v-btn
                  id="threat-sharing-communities-browse-community-button"
                  class="create-com-btn mb-11"
                  @click="subTabSelected('All')"
                  rounded
                >
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
} from '@/api/threatSharing'
import { isOwner, isOwnerOrMember } from '@/utils/functions'
import NewCommunity from '@/components/ThreatSharing/NewCommunity/NewCommunity'
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import KSelect from '@/components/Common/Inputs/KSelect'
import labels from '@/model/constants/labels'
import { getNotifications } from '@/api/dashboard'
import CommunityCard from '@/components/ThreatSharing/Communities/CommunityCard'
import CommunityInvitationCard from '@/components/ThreatSharing/Communities/CommunityInvitationCard'
import { mapGetters } from 'vuex'

export default {
  components: {
    KSelect,
    AppDialogFooter,
    NewCommunity,
    AppDialog,
    CommunityCard,
    CommunityInvitationCard
  },
  computed: {
    ...mapGetters({
      getMyInvitationsPermission: 'permissions/getThreatSharingMyInvitationsPermission',
      getEditCommunityPermission: 'permissions/getThreatSharingEditCommunityPermission',
      getLeaveCommunityPermission: 'permissions/getThreatSharingLeaveCommunityPermission',
      getDeleteCommunityPermission: 'permissions/getThreatSharingDeleteCommunityPermission'
    }),
    numberOfPages() {
      const communitiesData =
        this.$store.state['communities'].communities ||
        this.$store.state['communities'].communities.communitiesData
      return Math.ceil(
        this.selectedTab && this.selectedTab === 'tab-2'
          ? this.invitationData && this.invitationData.length / this.itemsPerPage
          : (this.listData && communitiesData.totalNumberOfRecords) ||
              this.totalNumberOfRecords / this.itemsPerPage
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
    },
    isTableReload: {
      required: false
    },
    setThreatSharingStepLoading: {
      required: false
    }
  },
  watch: {
    communityLoading(newVal, oldVal) {
      if (oldVal !== newVal) {
        this.$emit('setThreatSharingStepLoading', newVal)
      }
    },
    refresh(newVal, oldVal) {
      if (oldVal !== newVal && !this.isLoadState) {
        this.selectedTab = 'tab-1'
        this.getAllCommunitiesListData()
        this.getMyCommunitiesListData()
      }
    },
    filter(newVal, oldVal) {
      if (newVal !== oldVal && !this.isLoadState) {
        if (!newVal) {
          this.updateCommunities()
        } else {
          this.debounce(() => {
            this.updateCommunities()
          }, 1000)
        }
      }
    }
  },
  created() {
    this.getIndustryList()
    if (this.isLoadState) {
      const communitiesData =
        this.$store.state['communities'].communities &&
        this.$store.state['communities'].communities.communitiesData
      if (communitiesData) {
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
        if (communitiesData.searchValues.selectedTab === 'tab-2') {
          this.invitationData = communitiesData.tableData
        } else {
          this.listData = communitiesData.tableData
        }
      } else {
        this.page = (communitiesData && communitiesData.searchValues.page) || 1
        this.itemsPerPage = (communitiesData && communitiesData.searchValues.itemsPerPage) || 5
        this.getAllCommunitiesListData()
        this.getInvitationCount()
        this.setInitialCommunityValues()
        this.$route.params.isCommunity = false
      }
      if (this.isTableReload) {
        this.page = 1
        this.filter = null
        this.industryValue = []
        this.privacyValue = []
        switch (this.selectedTab) {
          case 'tab-0':
            this.getMyCommunitiesListData(true)
            break
          case 'tab-1':
            if (!this.$route.params.isCommunity) this.getAllCommunitiesListData(true)
            break
          case 'tab-2':
            this.getInvitions()
            break
          default:
            return false
        }
        this.$store.dispatch('tableReload/setTableReload', false)
      }
      setTimeout(() => {
        this.$emit('setLoadState')
      }, 100)
    }

    if (this.$route.params.isCommunity) {
      let _this = this
      if (this.$route.params.communityName === 'empty') {
        _this.$parent.$parent.$parent.$parent.communityName = 'Loading...'
        getCommunityDetails(this.$route.params.communityId)
          .then((response) => {
            this.communityDetails = response.data.data
            this.filter = response.data.data.name
            setTimeout(() => {
              _this.$parent.$parent.$parent.$parent.communityName = response.data.data.name
            }, 250)
          })
          .catch((error) => {
            error.response.data
          })
        this.$route.params.isCommunity = false
      } else {
        this.filter = this.$route.params.communityName
        setTimeout(() => {
          this.$route.params.isCommunity = false
        }, 2000)
      }
    }
    if (!this.isLoadState) this.selectedTab = 'tab-1'
    setTimeout(() => {
      this.$emit('setLoadState')
    }, 100)
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
            if (!this.$route.params.isCommunity) this.getAllCommunitiesListData(true)
            break
          default:
            return false
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
            if (!this.$route.params.isCommunity) this.getAllCommunitiesListData()
            break
        }
      }
    },
    setNotificationModal(communityResourceId) {
      this.temporaryResourceId = communityResourceId
      this.getNotifications()
      this.openNotificationModal = true
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
        .then(() => {
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
            if (!this.$route.params.isCommunity) this.getAllCommunitiesListData()
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
      if (!this.isLoadState) this.selectedTab = 'tab-1'
    },
    getInvitationCount() {
      if (this.getMyInvitationsPermission) {
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
    checkIfCanCloseCommunityModal() {
      if (this.$refs.newCommunityModal) {
        this.$refs.newCommunityModal.onCancelClicked()
      }
    },
    onAddClose() {
      this.isWantToAddNewCommunity = false
      this.selectedTab = 'tab-1'
      this.getAllCommunitiesListData()
    },
    getInvitions() {
      if (this.getMyInvitationsPermission) {
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
          if (isSearch) {
            this.page = 1
          }
          if (this.$route.params.isCommunity) {
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
          if (isSearch) {
            this.page = 1
          }
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
          params: { id: item.communityResourceId, item: item, communityName: item.communityName }
        })
      } else {
        localStorage.setItem('isCommunityOwner', item.membershipStatusId == 1 ? 'owner' : 'member')
      }
    },
    updateCommunities() {
      this.$route.params.isCommunity = false
      if (!this.isLoadState) {
        switch (this.selectedTab) {
          case 'tab-0':
            this.getMyCommunitiesListData(true)
            break
          case 'tab-1':
            if (!this.$route.params.isCommunity) this.getAllCommunitiesListData(true)
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
            this.listData.find((item) => item.communityResourceId === communityId).memberCount =
              this.listData.find((item) => item.communityResourceId === communityId).memberCount + 1
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
              key: 'communities',
              communitiesData
            })
            let incidentsData = null
            this.$store.dispatch('incidents/setIncidents', {
              key: 'incidents',
              incidentsData
            })
            this.$router.push({
              path: `/threat-sharing/community/${communityId}`,
              params: { communityName: communityName }
            })
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
      this.$route.params.isCommunity = false
      if (name === 'Your Communities' && !this.isLoadState) {
        this.selectedTab = 'tab-0'
        this.page = 1
        this.getMyCommunitiesListData()
      } else if (name === 'All' && !this.isLoadState) {
        this.selectedTab = 'tab-1'
        this.page = 1
        this.getAllCommunitiesListData()
      } else {
        if (!this.isLoadState) {
          this.selectedTab = 'tab-2'
          this.page = 1
          this.filter = ''
          this.industryValue = []
          this.privacyValue = []
          this.getInvitions()
          this.getInvitationCount()
        }
      }
    }
  }
}
</script>
