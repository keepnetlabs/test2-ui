<template>
  <div class="right-column" ref="rightCol">
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
        :resourceId="communityItem && communityItem.resourceId"
        @closeAdd="onAddClose"
      />
    </v-overlay>
    <app-dialog
      :status="showNeedPermissionModal"
      @changeStatus="showNeedPermissionModal = false"
      icon="mdi-exit-to-app"
      title="Cannot Leave Community"
      :subtitle="communityDetails && communityDetails.name"
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
      :status="isWantToToLeaveFromCommunity"
      @changeStatus="isWantToToLeaveFromCommunity = false"
      icon="mdi-exit-to-app"
      title="Leave Community?"
      :subtitle="communityDetails && communityDetails.name"
      :body="`You are leaving ${
        communityDetails && communityDetails.name
      }. You won’t be able to post incidents to this community`"
    >
      <template v-slot:app-dialog-footer>
        <app-dialog-footer
          @handleClose="isWantToToLeaveFromCommunity = false"
          @handleConfirm="leaveFromCommunityConfirm"
          actionButtonText="LEAVE"
        />
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
        </v-list-item>
        <v-list-item class="pa-0">
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
        </v-list-item>
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
        </v-list-item>
      </template>
      <template v-slot:app-dialog-footer>
        <app-dialog-footer
          @handleClose="openNotificationModal = false"
          @handleConfirm="saveNotificationSetting"
        />
      </template>
    </app-dialog>
    <app-dialog
      :status="isWantToDelete"
      @changeStatus="isWantToDelete = false"
      icon="mdi-delete"
      title="Delete Community?"
      :subtitle="communityDetails && communityDetails.name"
      :body="`${
        communityDetails && communityDetails.name
      } will be deleted. All posts and data will be lost`"
    >
      <template v-slot:app-dialog-footer>
        <app-dialog-footer
          @handleClose="isWantToDelete = false"
          @handleConfirm="deleteCommunityConfirm"
          actionButtonText="DELETE"
        />
      </template>
    </app-dialog>
    <v-card class="pop-up-card right-column pt-4 pl-6 pr-6" light min-height="300">
      <app-dialog
        :status="openInviteModal"
        icon="mdi-account-multiple-plus"
        title="Invite Members"
        subtitle="Bring new members to the community"
        size="big"
        @changeStatus="openInviteModal = false"
      >
        <template v-slot:app-dialog-body>
          <v-form ref="inviteModal">
            <k-select
              type="combobox"
              :items="[]"
              placeholder="Enter email addresses of the companies to be invited (max. 5)"
              multiple
              dense
              deletable-chips
              autocomplete="off"
              small-chips
              outlined
              :no-data-text="'Enter email addresses of the companies to be invited (max. 5)'"
              v-model.trim="emailarray"
              :rules="[inviteMembers.limit, inviteMembers.email, inviteMembers.required]"
              class="pop-up-card__invite-member"
              hint="Press enter to separate email adresses"
              @change="comboboxChange"
            ></k-select>
          </v-form>
        </template>
        <template v-slot:app-dialog-footer>
          <div class="d-flex download-buttons flex-row flex-wrap justify-end">
            <v-btn text color="#f56c6c" class="k-dialog__button" @click="openInviteModal = false">{{
              labels.Cancel
            }}</v-btn>
            <v-btn text color="#2196f3" class="k-dialog__button" @click="inviteMember"
              >Invite All</v-btn
            >
          </div>
        </template>
      </app-dialog>
      <v-btn
        v-if="$route.path == '/threat-sharing'"
        :disabled="!checkPermissions('communities', 'POST')"
        class="create-com-btn"
        @click="createNewCommunity"
        block
        rounded
        id="create-community-btn"
        >CREATE A NEW COMMUNITY
      </v-btn>
      <v-btn
        v-if="$route.name == 'Community'"
        class="create-com-btn"
        @click="postIncident"
        block
        rounded
        id="post-inc-btn"
        :disabled="!checkPermissions('community-posts', 'POST')"
        >POST INCIDENT
      </v-btn>
      <div class="right-side-content wrapper pt-8 pb-4">
        <div v-if="$route.name == 'Community'">
          <div class="about-community right-side-title">
            About Community
            <v-menu
              content-class="right-col-commun-settings"
              offset-y
              transition="scale-transition"
            >
              <template v-slot:activator="{ on }">
                <v-icon v-on="on">mdi-cog</v-icon>
              </template>
              <div class="notification-wrapper__right-column">
                <v-list dense flat class="notification-wrapper__v-list">
                  <v-list-item-group
                    v-if="
                      checkPermissions('communities/{resourceId}', 'PUT') && isOwnerOfTheCommunity()
                    "
                    color="primary"
                  >
                    <v-list-item id="right-col-edit-commun" @click="editCommunity()">
                      <v-list-item-icon>
                        <v-icon>mdi-pencil</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Edit Community</v-list-item-title>
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
                        <v-list-item-title>Notification Settings</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                  <v-list-item-group color="primary">
                    <v-list-item
                      id="right-col-leave-commun"
                      @click="isWantToToLeaveFromCommunity = true"
                      v-if="checkPermissions('communities/{resourceId}/leave', 'POST')"
                    >
                      <v-list-item-icon>
                        <v-icon>mdi-exit-to-app</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Leave</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                  <v-list-item-group
                    v-if="
                      checkPermissions('communities/{resourceId}', 'DELETE') &&
                      isOwnerOfTheCommunity()
                    "
                    color="primary"
                  >
                    <v-list-item id="right-col-delete-commun" @click="isWantToDelete = true">
                      <v-list-item-icon>
                        <v-icon>mdi-delete</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Delete</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </div>
            </v-menu>
          </div>
          <div class="right-side-post-container pt-2 pb-9">
            <span class="about-community-statement">{{ communityDetails.description }}</span>
            <v-row>
              <v-col cols="12" sm="5" class="about-community-table-td pb-0">
                <span class="right-col-semibold-label">Owner</span>
              </v-col>
              <v-col cols="12" sm="7" class="about-community-table-td-sec pb-0">
                {{ communityDetails.ownerCompanyName }}
              </v-col>
            </v-row>
            <div class="about-community-table">
              <v-row>
                <v-col cols="12" sm="5" class="about-community-table-td pb-0">
                  <span class="right-col-semibold-label">Members</span>
                </v-col>
                <v-col cols="12" sm="7" class="about-community-table-td-sec pb-0 d-flex">
                  {{ communityDetails.memberCount }}
                  <a
                    v-if="
                      ((!!communityDetails && communityDetails.myMembershipStatusId == 1) ||
                        (!!communityDetails && communityDetails.privacyStatusName === 'Public')) &&
                      checkPermissions('communities/{resourceId}/invite', 'POST')
                    "
                    href="#"
                    class="pl-4"
                    @click="openInviteModal = true"
                    >+ Invite</a
                  >
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="5" class="about-community-table-td pb-0">
                  <span class="right-col-semibold-label">Industry</span>
                </v-col>
                <v-col cols="12" sm="7" class="about-community-table-td-sec pb-0">
                  {{ communityDetails.industryName }}
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="5" class="about-community-table-td pb-0">
                  <span class="right-col-semibold-label">Total Incidents</span>
                </v-col>
                <v-col cols="12" sm="7" class="about-community-table-td-sec pb-0"
                  >{{ communityDetails.incidentCount }}
                </v-col>
              </v-row>
              <v-row v-if="false">
                <v-col cols="12" sm="6" class="about-community-table-td pb-0"
                  >You investigated</v-col
                >
                <v-col cols="12" sm="6" class="about-community-table-td-sec pb-0">21</v-col>
              </v-row>
              <v-row v-if="false">
                <v-col cols="12" sm="6" class="about-community-table-td pb-0">Eliminated</v-col>
                <v-col cols="12" sm="6" class="about-community-table-td-sec pb-0">48 threats</v-col>
              </v-row>
            </div>
          </div>
        </div>
        <div
          class="right-side-title pt-1"
          v-if="checkPermissions('community-posts/my-last-posts', 'GET')"
        >
          Your Posts
        </div>
        <PostCardLoading
          :loading="yourPostsLoading"
          id="your-post-skeleton"
          v-show="checkPermissions('community-posts/my-last-posts', 'GET') && yourPostsLoading"
        >
          <template v-slot:skeleton-content> </template>
        </PostCardLoading>
        <div v-show="checkPermissions('community-posts/my-last-posts', 'GET') && !yourPostsLoading">
          <div class="pb-4" v-if="yourPosts && yourPosts.length > 0">
            <div v-for="(post, ind) of yourPosts" :key="ind + Math.floor(Math.random() * 10000)">
              <div class="pt-2">
                <div class="right-side-sub-title pb-1">
                  <a @click="goToPostDetails(post)">{{ post.title }}</a>
                </div>
                <div class="right-side-desc pb-1">
                  in
                  <a @click="goToCommunityDetails(post)">{{ post.communityName }}</a>
                </div>
                <div class="right-side-like-comment-wrapper">
                  <div class="right-side-like">
                    <v-btn disabled text x-small icon color="grey">
                      <v-icon>mdi-thumb-up</v-icon>
                    </v-btn>
                    <span class="like-count">{{ post.likeCount }}</span>
                  </div>
                  <div class="right-side-message pl-2">
                    <v-btn disabled text x-small icon color="grey">
                      <v-icon>mdi-message-reply-text</v-icon>
                    </v-btn>
                    <span class="comment-count">{{ post.commentCount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pb-4 pt-1 empty-posts" v-else-if="yourPosts && !yourPosts.length">
            You haven’t posted any incidents
          </div>
        </div>

        <div
          class="right-side-title pt-4"
          v-if="checkPermissions('community-posts/top-posts', 'GET')"
        >
          Top Posts from your communities
        </div>
        <PostCardLoading
          :loading="checkPermissions('community-posts/top-posts', 'GET') && topPostsLoading"
          id="top-post-skeleton"
        >
          <template v-slot:skeleton-content>
            <div
              v-if="
                topPosts && topPosts.length && checkPermissions('community-posts/top-posts', 'GET')
              "
            >
              <div v-for="(post, ind) of topPosts" :key="ind + Math.floor(Math.random() * 10000)">
                <div class="right-side-post-container pt-2">
                  <div class="right-side-sub-title pb-1">
                    <a @click="goToPostDetails(post)">{{ post.postTitle }}</a>
                  </div>
                  <div class="right-side-desc pb-1">
                    in
                    <a @click="goToCommunityDetails(post)">{{ post.communityName }}</a>
                  </div>
                  <div class="right-side-like-comment-wrapper">
                    <div class="right-side-like">
                      <v-btn disabled text x-small icon color="grey">
                        <v-icon>mdi-thumb-up</v-icon>
                      </v-btn>
                      <span class="like-count">{{ post.likeCount }}</span>
                    </div>
                    <div class="right-side-message pl-2">
                      <v-btn disabled text x-small icon color="grey">
                        <v-icon>mdi-message-reply-text</v-icon>
                      </v-btn>
                      <span class="comment-count">{{ post.commentCount }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-else-if="!checkPermissions('community-posts/top-posts', 'GET')"
              class="empty-posts pt-1"
            ></div>
            <div v-else>
              No incident has been posted in your communities
            </div>
          </template>
        </PostCardLoading>
        <div
          class="right-side-title pb-3 pt-8"
          v-if="checkPermissions('communities/suggested', 'GET')"
        >
          Suggested Communities
        </div>
        <CommunitiesCardLoading
          v-if="postsLoading"
          :loading="checkPermissions('communities/suggested', 'GET') && postsLoading"
          id="communities-post-skeleton"
        />
        <div v-show="checkPermissions('communities/suggested', 'GET') && !postsLoading">
          <div v-if="suggestedCommunities && suggestedCommunities.length">
            <v-card
              v-for="(commun, ind) of suggestedCommunities"
              :key="ind + commun.communityName"
              class="suggested-card"
            >
              <div class="suggested-row">
                <div class="suggested-com-name" cols="12">
                  <div class="suggested-title">{{ commun.communityName }}</div>
                  <div class="suggested-com-detail">
                    <v-icon class="suggested-people-icon pr-1">mdi-account-multiple</v-icon>
                    <b>{{ commun.memberCount }}</b
                    ><span class="suggested-row__seperator">•</span>
                    <span class="suggested-company">{{ commun.industryName }} </span>
                    <span class="suggested-row__seperator">•</span>
                    <span class="suggested-company">{{ commun.privacyStatusName }} </span>
                  </div>
                </div>
                <div class="suggested-right-action">
                  <v-btn class="suggested-btn" rounded v-if="commun.isJoined">
                    <v-icon class="pl-2 pr-1">mdi-account-circle</v-icon>
                    <span class="pr-2">Member</span>
                  </v-btn>
                  <v-btn
                    @click="joinCommunity(commun)"
                    class="suggested-btn"
                    block
                    rounded
                    v-else
                    :disabled="commun.isJoined"
                    style="background-color: #2196f3 !important;"
                  >
                    <v-icon v-if="!commun.isJoined" class="pr-2">mdi-account-circle </v-icon>
                    <v-icon v-if="commun.isJoined" class="pr-2" style="color: #fff !important;"
                      >mdi-account-clock
                    </v-icon>
                    <div v-if="commun.privacyStatusName != 'Private'" :key="commun.resourceId">
                      JOIN
                    </div>
                    <div v-else-if="commun.isJoined" :key="commun.resourceId">
                      Request Sent
                    </div>
                    <div v-else :key="commun.resourceId">Request to join</div>
                  </v-btn>
                </div>
              </div>
            </v-card>
          </div>
          <div class="pb-2" v-else>
            There is no suggested community available
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import {
  deleteCommunity,
  getCommunityDetails,
  getMyLastPosts,
  getMyTopPosts,
  getsuggestedCommunities,
  inviteToCommunity,
  joinCommunity,
  removeFromCommunities,
  updateNotifications
} from '../../api/threadSharing'
import AppDialog from '../AppDialog'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'
import { checkPermission, isOwner } from '../../utils/functions'
import NewCommunity from '../ThreadSharing/NewCommunity'
import CommunitiesCardLoading from '../SkeletonLoading/CommunitiesCardLoading'
import PostCardLoading from '../SkeletonLoading/PostCardLoading'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import KSelect from '@/components/Common/Inputs/KSelect'
import labels from '@/model/constants/labels'
import { getNotifications } from '../../api/dashboard'

export default {
  data() {
    return {
      notificationLoading: false,
      labels,
      yourPostsLoading: true,
      topPostsLoading: true,
      postsLoading: true,
      isWantToDelete: false,
      openNotificationModal: false,
      notifications: {
        isNotifications: false,
        isSMSEnabled: false,
        isEmailEnabled: false,
        isDashboardEnabled: false
      },
      showNeedPermissionModal: false,
      isWantToToLeaveFromCommunity: false,
      leaveCommunityName: null,
      communityItem: null,
      communityResourceId: null,
      isWantToAddNewCommunity: false,
      emailarray: [],
      openInviteModal: false,
      suggestedCommunities: [],
      communityDetails: {},
      myLastPosts: [],
      topPosts: [],
      ownerDetails: null,
      yourPosts: [],
      inviteMembers: {
        limit: (v) => (v && v.length <= 5) || 'You have reached to max limit',
        required: (v) => (v && v.length >= 1) || 'Required',
        email: (v) => {
          if (v.length > 0) {
            let booReturn = true
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            for (let i = 0; i < v.length; i++) {
              if (!pattern.test(v[i])) {
                booReturn = false
                document.getElementsByClassName('v-chip--select')[i].style.borderColor = '#ff5252'
                document.getElementsByClassName('v-chip--select')[i].style.color = '#ff5252'
                return v[i] + ' address is not valid'
              } else if (v.length === i) {
                return booReturn
              } else {
                booReturn = true
              }
            }
            return booReturn
          } else {
            return true
          }
        }
      }
    }
  },
  props: {
    pageView: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  components: {
    KSelect,
    AppDialogFooter,
    AppDialog,
    NewCommunity,
    CommunitiesCardLoading,
    PostCardLoading
  },
  created() {
    this.getAllRightColumnData()
    if (this.$route.name === 'Community') {
      this.getNotifications()
    }
    this.$store.watch(
      (state) => {
        return state.rightColumn.reloadRightColumnData // could also put a Getter here
      },
      (newValue, oldValue) => {
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
      getSelectedCompany: 'dashboard/getSelectedCompany',
      userGetter: 'auth/userGetter'
    }),
    ...mapState({
      companyInformation: (state) => state.dashboard.companyInformation
    }),
    communityDescription() {
      return this.selectedCommunity.description || localStorage.getItem('communityDesc')
    },
    communityIndustry() {
      return this.selectedCommunity.industry || localStorage.getItem('communityCat')
    }
  },
  methods: {
    checkPermissions(permission, type) {
      return checkPermission(permission, type)
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
        EntityResourceId: this.$route.params.id,
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
    getAllRightColumnData() {
      this.getCommunityDetails()
      this.getMyLastPosts()
      this.getMyTopPosts()
      this.getsuggestedCommunities()
    },
    isInviteMemberDisabled() {
      return this.$refs.inviteModal && !this.$refs.inviteModal.validate()
    },
    comboboxChange(val) {
      let newVal = val.map((item) => item.trim())
      this.emailarray = newVal
      return newVal
    },
    deleteCommunityConfirm() {
      deleteCommunity(this.communityDetails.resourceId).then(() => {
        this.isWantToDelete = false
        this.$router.push(`/threat-sharing`)
      })
    },
    saveNotificationSetting() {
      let payload = {
        EntityResourceId: this.$route.params.id,
        TypeId: 1,
        IsSMSEnabled: this.notifications.isSMSEnabled,
        IsEmailEnabled: this.notifications.isEmailEnabled,
        IsDashboardEnabled: this.notifications.isDashboardEnabled
      }
      updateNotifications(payload).then(() => {
        this.openNotificationModal = false
      })
    },
    leaveFromCommunityConfirm() {
      removeFromCommunities(this.communityDetails.resourceId)
        .then(() => {
          this.isWantToToLeaveFromCommunity = false
          this.$router.push(`/threat-sharing`)
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
        })
    },
    onAddClose() {
      this.isWantToAddNewCommunity = false
    },
    goToPostDetails(post) {
      if (post.communityResourceId) {
        if (this.$route.name === 'Community') {
          this.$router.push(
            `/community/${post.communityResourceId}?postId=${post.communityPostResourceId}`
          )
          this.$router.go(
            `/community/${post.communityResourceId}?postId=${post.communityPostResourceId}`
          )
        } else {
          this.$router.push(
            `/community/${post.communityResourceId}?postId=${post.communityPostResourceId}`
          )
        }
      }
    },
    goToCommunityDetails(post) {
      if (post.communityResourceId) {
        localStorage.setItem('communityName', post.communityName)
        localStorage.setItem('communityResourceIdForRedirect', post.communityResourceId)
        this.$router.push(`/community/${post.communityResourceId}`)
        this.$router.go(`/community/${post.communityResourceId}`)
      }
    },
    inviteMember() {
      setTimeout(() => {
        if (this.$refs.inviteModal.validate()) {
          const payload = {
            emailarray: this.emailarray
          }
          inviteToCommunity(this.$route.params.id, payload).then((response) => {
            response.data.data.map((item) => {
              if (item.result === 'Failed') {
                this.$store.dispatch('common/createSnackBar', {
                  color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
                  message: `${item['email']} ${item['resultText']}`
                })
              } else {
                this.$store.dispatch('common/createSnackBar', {
                  color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
                  message: `${item['resultText']} (${item['email']})`
                })
              }
            })
            this.emailarray = []
            this.openInviteModal = false
          })
        }
      }, 200)
    },
    getCommunityDetails() {
      const _this = this
      if (this.$route.name == 'Community') {
        this.ownerDetails = this.$route.params.item
        getCommunityDetails(this.$route.params.id)
          .then((response) => {
            this.communityDetails = response.data.data
            if (_this.$route.query && _this.$route.query.postId) {
              localStorage.setItem('communityName', response.data.data.name)
              localStorage.setItem('communityResourceIdForRedirect', response.data.data.resourceId)
            }
            this.$forceUpdate()
          })
          .catch((error) => {
            if (error.response.data.code) {
              this.$router.push({
                name: 'Threat Sharing',
                params: {
                  isCommunity: true,
                  postId: _this.$route.query.postId,
                  communityId: _this.$route.params['id'],
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
    closeCommunityInfo() {
      // this.$emit('closeCommunity')
    },
    createNewCommunity() {
      this.$emit('createCommunityAction')
      this.closeCommunityInfo()
    },
    isWantToAddMembers() {
      this.$emit('addMembers')
      this.closeCommunityInfo()
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
      this.closeCommunityInfo()
    },
    joinCommunity({ resourceId, communityName, privacyStatusName }) {
      joinCommunity(resourceId).then(() => {
        this.getsuggestedCommunities()
        localStorage.setItem('communityName', communityName)
        localStorage.setItem('communityResourceIdForRedirect', resourceId)
        if (privacyStatusName !== 'Private') {
          if (this.$route.name == 'Community') {
            this.$router.push(`/community/${resourceId}`)
            this.$router.go(`/community/${resourceId}`)
            this.$emit('joinRequestSuccess')
          } else {
            this.$emit('joinRequestSuccess')
            this.$router.push(`/community/${resourceId}`)
          }
        } else {
          this.$emit('joinRequestSuccess')
        }
      })
    },
    isOwnerOfTheCommunity() {
      if (this.communityDetails) {
        return isOwner(this.communityDetails.myMembershipStatusId)
      }
    },
    openNotifications() {},
    isJoined(id) {
      /*if (id && id != null && this.myCommunities && this.myCommunities.length) {
        return this.myCommunities.some((cId) => cId.CommunityId == id)
      }*/
    },
    leaveCommunity() {
      this.$emit('leaveCommunity')
      this.closeCommunityInfo()
    },
    deleteCommunity() {
      this.$emit('deleteCommunity')
      this.closeCommunityInfo()
    },
    refreshCommunities() {
      this.$store.dispatch('threadSharing/getCommunities')
    },
    refreshRequests() {
      this.$store.dispatch('threadSharing/getRequestsCompany', localStorage.getItem('companyId'))
    }
  }
}
</script>
<style lang="scss">
.pop-up-card__invite-member {
  .v-select__selections input {
    min-height: 32px;
  }
  .v-input__append-inner {
    display: none;
  }
}
.right-column {
  .notification-wrapper__right-column {
    padding: 0 !important;
    width: 100%;
    box-shadow: 0 8px 10px -3px rgba(255, 255, 255, 0.14), 0 2px 4px 0 rgba(255, 255, 255, 0.14),
      0 3px 14px 2px rgba(255, 255, 255, 0.12);
  }

  .right-column-header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 10px 0 !important;

    .header-p {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.15;
      letter-spacing: normal;
      color: #2196f3 !important;
      margin-bottom: 0 !important;
    }
  }

  .right-col-sub-header {
    font-family: Helvetica;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: #000;
    padding-bottom: 20px !important;
  }

  .pop-up-card {
    width: 100%;
    border-radius: 20px !important;
    box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5);
    background-color: #fff;
  }

  @media only screen and (max-width: 1023px) {
    ::-webkit-scrollbar {
      -webkit-overflow-scrolling: auto;
      -webkit-appearance: none;
      width: 7px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: rgba(0, 0, 0, 0.5);
      box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
    }
  }

  .create-com-btn {
    background-color: #2196f3 !important;
    color: #fff;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    height: 36px !important;
    text-transform: uppercase !important;
  }

  .suggested-card > .suggested-row {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  .right-side- {
    &title {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 20px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.15;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }
  }

  .ts-tags {
    align-items: center;
  }

  .ts-footer {
    display: flex;
    margin-top: 10px;
    margin-left: 0px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.58;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  .ts-like {
    margin-right: 10px;
    display: flex;

    span {
      align-items: center;
      font-size: inherit;
      line-height: unset;
      line-height: 2;
    }
  }

  .ts-message {
    margin-right: 40px;
    display: flex;

    span {
      align-items: center;
      font-size: inherit;
      line-height: unset;
      line-height: 2;
    }
  }

  .ts-harmful {
    margin-right: 15px;
    display: flex;

    span {
      align-items: center;
      font-size: inherit;
      line-height: unset;
      line-height: 2;
    }
  }

  .ts-success {
    display: flex;

    span {
      align-items: center;
      font-size: inherit;
      line-height: unset;
      line-height: 2;
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

  // Threat sharing Content
  .threat-sharing-content {
    min-height: 200px;
    width: 100%;
    border-radius: 20px;
    box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
      0 3px 1px -2px rgba(80, 80, 80, 0.12);
    background-color: #ffffff;
    padding: 29px 32px 16px 32px;
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
    color: rgba(0, 0, 0, 0.87);
  }

  // Threat sharing Content End

  .v-tab {
    padding: 0 !important;
    font-size: 20px;
    font-weight: 400;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.15;
    letter-spacing: normal;
    text-transform: none;
    color: rgba(0, 0, 0, 0.87);
    text-align: left !important;
  }

  .v-slide-group__wrapper {
    padding-left: 20px !important;
  }

  .v-card.v-sheet.theme--light {
    padding-top: 0;
    padding-left: 3px;
    padding-right: 3px;
    border-radius: 20px;
  }

  .community-selector {
    .v-tabs-bar {
      height: 44px !important;
    }
  }

  .community-selector .v-slide-group__wrapper {
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

  .community-selector .v-slide-group__wrapper > div {
    height: 100%;
    margin-right: 0 !important;
  }

  .v-text-field--outlined fieldset {
    border-radius: 6px !important;
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

  .filter-field {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 13px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.54);
  }

  .create-com-btn {
    background-color: #2196f3 !important;
    color: #fff;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    height: 36px !important;
    text-transform: uppercase !important;
  }

  .ts-community-industry {
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
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: var(--black-87);
    }
  }

  .v-application--is-ltr .v-list-item__icon:first-child {
    margin-right: 10px !important;
  }

  .ts-user-comp-detail {
    align-items: center;
    display: flex;
  }

  .v-btn:not(.v-btn--round).v-size--default,
  .v-btn--icon.v-size--default {
    height: 36px !important;
  }

  .v-btn--icon.v-size--default {
    margin-left: 4px;
    width: 36px !important;
  }

  // Right Column
  .right-side-content {
    a {
      text-decoration: none !important;
      color: #2196f3;
    }

    a:hover {
      text-decoration: underline !important;
    }
  }

  .right-side-title {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  .right-side-sub-title {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #2196f3;
  }

  .right-side-desc {
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #434343;
    a {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.29;
      letter-spacing: normal;
      color: #2196f3;
    }
  }

  .about-community {
    display: flex;
    justify-content: space-between;
  }

  .about-community-statement {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  .about-community-table-td {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  .about-community-table-td-sec {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  .right-side-like .v-icon,
  .right-side-message .v-icon {
    height: 14px !important;
    width: 14px !important;
    font-size: 14px !important;
  }

  .right-side-like-comment-wrapper {
    align-items: center;
    display: flex;
    flex-direction: row;
  }

  .like-count,
  .comment-count {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.58;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    padding-left: 2px;
  }

  .suggested-card {
    display: flex;
    flex-direction: row;
    position: relative;
    min-height: 76px;
    margin-bottom: 8px;
    border-radius: 4px !important;
    border: none !important;
    border-radius: 4px;
    box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
      0 3px 1px -2px rgba(80, 80, 80, 0.12);
    background-color: #ffffff;

    .suggested-row {
      align-items: stretch;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      flex-wrap: wrap;
      height: auto;
      max-height: 220px;
      width: 100%;
      padding: 16px;
      padding-bottom: 4px;
      &__seperator {
        margin: 0 4px;
        font-weight: 900;
      }
    }

    .suggested-com-name {
      display: flex;
      flex-direction: column;
      position: relative;
      max-width: 100%;

      .suggested-title {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
        margin-top: 0;
        padding-bottom: 8px;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        display: block;
        max-width: 100%;
      }

      .suggested-com-detail {
        font-size: 12px;

        .suggested-people-icon {
          font-size: 20px !important;
        }

        .suggested-industry {
          font-family: 'Open Sans', sans-serif !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          color: rgba(0, 0, 0, 0.87) !important;
        }
        .suggested-company {
          font-size: 14px;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          color: rgba(0, 0, 0, 0.87);
        }
      }
    }

    .suggested-right-action {
      align-items: center;
      display: flex;
      justify-content: flex-end;
      margin-top: 4px;
      margin-bottom: 13px;
      width: min-content;

      .suggested-btn {
        align-items: center;
        background-color: #2196f3 !important;
        color: #fff !important;
        width: min-content;
        text-transform: uppercase;

        @media only screen and (max-width: 500px) {
          padding: 0 3px !important;
        }
      }
    }
  }

  .community-notification-header {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: #000;
  }

  .community-notification-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 25px !important;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);

    .community-notification-switch {
      align-items: center;
      display: flex;
      height: 25px !important;
      margin-top: 10px !important;
    }
  }

  .community-notification-row:first-child {
    border-bottom: 1px solid gray !important;
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

  .invite-sub-header {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  .invite-input > .v-input__control > .v-input__slot {
    align-items: center;
    border-radius: 8px;
    border: solid 1px rgba(0, 0, 0, 0.16);
    background-color: #fff;
    box-shadow: unset !important;
    display: flex;

    .v-label {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 13px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.54);
      display: flex;
      align-items: center;
    }

    .invite-chip {
      border-radius: 18px !important;

      > span > span {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.71;
        letter-spacing: normal;
        text-align: center;
        color: #000000;
      }
    }

    .mdi-menu-down {
      display: none !important;
    }
  }

  .newCommunityOverlay {
    background-color: #fff !important;
    overflow: auto !important;
    height: 100% !important;
    max-width: 100vw !important;
    width: 100% !important;
    display: block !important;
    justify-content: center !important;
    align-items: center !important;

    > .v-overlay__content {
      height: auto;
      width: 100%;
    }
  }

  .empty-posts {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #212121;
    display: block;
  }

  .empty-suggested-span {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
  }

  .create-first-btn {
    min-width: 70% !important;
    width: 221px !important;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 13px !important;
    font-weight: 400 !important;
    font-stretch: normal !important;
    font-style: normal !important;
    line-height: 1.71 !important;
    letter-spacing: normal !important;
  }

  .create-community-button {
    background-color: #2196f3 !important;
    color: #fff;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    height: 36px !important;
    text-transform: uppercase !important;
    width: 211px !important;
  }

  .right-col-semibold-label {
    color: rgba(0, 0, 0, 0.87);
    font-family: 'Open Sans', sans-serif !important;
    font-size: 16px;
    font-weight: 600;
  }

  @media only screen and (max-width: 1023px) {
    ::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 7px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: rgba(0, 0, 0, 0.5);
      box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
    }
  }
}
</style>
