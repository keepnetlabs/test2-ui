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
          :confirm-button-disabled="isLeaveFromCommunityButtonDisabled"
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
        <!--<v-list-item class="pa-0" style="border-bottom: 1px solid rgba(80, 80, 80, 0.14);">
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
        </v-list-item>-->
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
        <!--<v-list-item class="pa-0">
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
      </template>
      <template v-slot:app-dialog-footer>
        <app-dialog-footer
          :confirm-button-disabled="isEmailNotificationsDisabled"
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
        v-if="openInviteModal"
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
            <v-btn
              text
              color="#f56c6c"
              class="k-dialog__button"
              @click="
                openInviteModal = false
                emailarray = []
              "
              >{{ labels.Cancel }}</v-btn
            >
            <v-btn
              :disabled="inviteAllButtonDisabled"
              text
              color="#2196f3"
              class="k-dialog__button"
              @click="inviteMember"
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
                    :disabled="commun.isJoined || isJoinCommunityButtonDisabled"
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
      isEmailNotificationsDisabled: false,
      isLeaveFromCommunityButtonDisabled: false,
      isJoinCommunityButtonDisabled: false,
      inviteAllButtonDisabled: false,
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
    },
    incidentsRef: {
      required: false
    },
    communitiesRef: {
      required: false
    },
    selectedTab: {
      required: false
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
      let _this = this
      deleteCommunity(this.communityDetails.resourceId).then(() => {
        this.isWantToDelete = false
        if (
          _this.$store.state['communities'].communities &&
          _this.$store.state['communities'].communities.communitiesData
        ) {
          _this.$store.state[
            'communities'
          ].communities.communitiesData.tableData = this.$store.state[
            'communities'
          ].communities.communitiesData.tableData.reduce((acc, item) => {
            if (item.communityResourceId !== this.communityDetails.resourceId) {
              acc.push(item)
            }
            return acc
          }, [])
        }
        this.$router.push(`/threat-sharing`)
      })
    },
    saveNotificationSetting() {
      this.isEmailNotificationsDisabled = true
      let payload = {
        EntityResourceId: this.$route.params.id,
        TypeId: 1,
        IsSMSEnabled: this.notifications.isSMSEnabled,
        IsEmailEnabled: this.notifications.isEmailEnabled,
        IsDashboardEnabled: this.notifications.isDashboardEnabled
      }
      updateNotifications(payload)
        .then(() => {
          this.openNotificationModal = false
        })
        .finally(() => {
          this.isEmailNotificationsDisabled = false
        })
    },
    leaveFromCommunityConfirm() {
      this.isLeaveFromCommunityButtonDisabled = true
      let _this = this
      removeFromCommunities(this.communityDetails.resourceId)
        .then(() => {
          if (_this.communityDetails.privacyStatusId === 1) {
            if (_this.$store.state['communities'].communities.communitiesData) {
              if (
                _this.$store.state['communities'].communities.communitiesData.tableData.find(
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
          } else {
            if (this.$store.state['communities'].communities.communitiesData) {
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
          }
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
        .finally(() => (this.isLeaveFromCommunityButtonDisabled = false))
    },
    onAddClose() {
      this.isWantToAddNewCommunity = false
      setTimeout(() => {
        this.$router.go(0)
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
          let communitiesData = []
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
          //this.$router.replace({ query: null })
          this.$router.push({
            path: `/community/${post.communityResourceId}?postId=${post.communityPostResourceId}`,
            query: { communityName: post.communityName }
          })
          //this.$router.go(`/community/${post.communityResourceId}?postId=${post.communityPostResourceId}`)
        } else {
          this.$router.push({
            path: `/community/${post.communityResourceId}?postId=${post.communityPostResourceId}`,
            query: { communityName: post.communityName }
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
          let communitiesData = []
          this.$store.dispatch('incidents/setIncidents', {
            key: 'incidents',
            incidentsData
          })
          this.$store.dispatch('communities/setCommunities', {
            key: 'communities',
            communitiesData
          })
        }
        //this.$router.replace({ query: null })
        let previousRouteName = this.$route.name
        this.$router.push({
          path: `/community/${post.communityResourceId}`,
          query: { communityName: post.communityName }
        })
        if (previousRouteName === 'Community') {
          //this.$router.go({ path: `/community/${post.communityResourceId}`, query: '' })
        }
        this.getAllRightColumnData()
      }
    },
    inviteMember() {
      this.inviteAllButtonDisabled = true
      setTimeout(() => {
        if (this.$refs.inviteModal.validate()) {
          const payload = {
            emailarray: this.emailarray
          }
          inviteToCommunity(this.$route.params.id, payload)
            .then((response) => {
              response.data.data.map((item) => {
                if (item.result === 'Failed') {
                  this.$store.dispatch('common/createSnackBar', {
                    color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
                    message: `${item['resultText']}: ${item['email']} `
                  })
                } else {
                  this.$store.dispatch('common/createSnackBar', {
                    color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
                    message: `${item['resultText']}: (${item['email']})`
                  })
                }
              })
              this.emailarray = []
              this.openInviteModal = false
            })
            .finally(() => (this.inviteAllButtonDisabled = false))
        } else {
          this.inviteAllButtonDisabled = false
        }
      }, 200)
    },
    getCommunityDetails() {
      if (this.$route.name == 'Community') {
        this.ownerDetails = this.$route.params.item
        getCommunityDetails(this.$route.params.id)
          .then((response) => {
            this.communityDetails = response.data.data
            if (this.$route.query && this.$route.query.postId) {
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
      this.isJoinCommunityButtonDisabled = true
      let _this = this
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
                itemsPerPage: this.$parent.$refs.tsCommunities.itemsPerPage
              },
              type: 'communities'
            }
            incidentsData = null
          } else if (this.$parent.$refs.tsIncidents) {
            communitiesData = null
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
            if (this.$route.name == 'Community') {
              this.$router.push({
                path: `/community/${resourceId}`,
                query: { communityName: communityName }
              })
              //this.$router.go(`/community/${resourceId}`)
              this.$emit('joinRequestSuccess')
            } else {
              this.$emit('joinRequestSuccess')
              this.$router.push({
                path: `/community/${resourceId}`,
                query: { communityName: communityName }
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
<style lang="scss" src="./RightColumn.scss"></style>
