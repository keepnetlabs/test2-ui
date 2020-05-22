<template>
  <div id="community-page-wrapper" class="page-wrapper">
    <v-overlay
      id="edit-community-overlay"
      fixed
      :opacity="0.46"
      :value="isWantToEditCommunity"
      :z-index="999"
    >
      <edit-community @closeEdit="onEditClose" />
    </v-overlay>
    <v-overlay
      id="notification-settings-overlay"
      fixed
      :opacity="0.46"
      :value="notificationSettingsOpened"
      :z-index="999"
    >
      <v-card id="notification-card" light class="community-notification__container">
        <div class="community-notification-header">Community Notification Settings</div>
        <v-list-item
          id="notification-general-wrapper"
          class="pa-0"
          style="border-bottom: 1px solid rgba(80, 80, 80, 0.14);"
        >
          <div class="community-notification-row">
            <div class="community-notification__text">
              Notifications
            </div>
            <div>
              <v-switch
                id="notification-general-switch"
                v-model="notifications.IsNotificationsEnabled"
                color="#2196f3"
                hide-details
                class="community-notification-switch mt-0"
              />
            </div>
          </div>
        </v-list-item>
        <v-list-item id="notification-dashboard-wrapper" class="pa-0">
          <div class="community-notification-row">
            <div class="community-notification__text">
              Dashboard notifications
            </div>
            <div>
              <v-switch
                id="notification-dashboard-switch"
                v-model="notifications.IsDashboardEnabled"
                color="#2196f3"
                hide-details
                class="community-notification-switch mt-0"
                :disabled="!notifications.IsNotificationsEnabled"
              />
            </div>
          </div>
        </v-list-item>
        <v-list-item id="notification-email-wrapper" class="community-notification-row pa-0">
          <div class="community-notification-row">
            <div class="community-notification__text">
              Email notifications
            </div>
            <div>
              <v-switch
                id="notification-email-switch"
                v-model="notifications.IsEmailEnabled"
                color="#2196f3"
                hide-details
                class="community-notification-switch mt-0"
                :disabled="!notifications.IsNotificationsEnabled"
              />
            </div>
          </div>
        </v-list-item>
        <v-list-item id="notification-whatsapp-wrapper" class="pa-0">
          <div class="community-notification-row">
            <div class="community-notification__text">
              SMS notifications
            </div>
            <div>
              <v-switch
                id="notification-whatsapp-switch"
                v-model="notifications.IsWhatsappEnabled"
                color="#2196f3"
                hide-details
                class="community-notification-switch mt-0"
                :disabled="!notifications.IsNotificationsEnabled"
              />
            </div>
          </div>
        </v-list-item>
        <div class="d-flex flex-row flex-wrap justify-end pb-3 pt-5" style="margin-right: -18px">
          <v-btn
            id="notification-cancel-btn"
            text
            color="#f56c6c"
            class="pa-0"
            @click="onCloseNotifications"
            >CANCEL
          </v-btn>
          <v-btn
            id="notification-save-btn"
            text
            color="#2196f3"
            class="pa-0"
            @click="saveNotifications"
            >SAVE
          </v-btn>
        </div>
      </v-card>
    </v-overlay>
    <v-overlay
      id="delete-community-overlay"
      fixed
      :opacity="0.46"
      :value="isWantToDeleteCommunity"
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
            <v-icon medium left color="blue" class="ml-2">mdi-delete</v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline">Delete Community?</v-list-item-title>
            <v-list-item-subtitle class="v-card-sub-header"
              >{{ fetchedCommunity.Name }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="pl-0 pr-0 pt-7 pb-6">
          <span class="delete-info">All posts and data will be lost</span>
        </v-list-item>
        <div class="d-flex flex-row flex-wrap justify-end">
          <v-btn id="delete-community-cancel-btn" text color="#f56c6c" @click="onCancelDelete"
            >CANCEL
          </v-btn>
          <v-btn id="delete-community-delete-btn" text color="#2196f3" @click="onDeleteCommunity"
            >DELETE
          </v-btn>
        </div>
      </v-card>
    </v-overlay>
    <v-overlay
      id="leave-commun-overlay"
      fixed
      :opacity="0.46"
      :value="isWantToLeaveFromCommunity"
      :z-index="999"
    >
      <v-card id="delete-commun-card" light class="confirm-dialog pb-4 pa-6" style="width: 444px;">
        <v-list-item class="pl-0 pr-0">
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon id="delete-icon-community" medium left color="blue" class="ml-2"
              >mdi-exit-to-app
            </v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline">Leave Community?</v-list-item-title>
            <v-list-item-subtitle class="v-card-sub-header"
              >{{ fetchedCommunity.Name }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="pl-0 pr-0 pt-7 pb-6">
          <span class="delete-info">
            You are leaving {{ fetchedCommunity.Name }}. You won’t be able to post incidents to this
            community
          </span>
        </v-list-item>
        <div class="d-flex flex-row flex-wrap justify-end">
          <v-btn id="cancel-leave-commun-btn" text color="#f56c6c" @click="onCancelLeave"
            >CANCEL
          </v-btn>
          <v-btn id="leave-leave-commun-btn" text color="#2196f3" @click="onLeaveConfirmed"
            >Leave
          </v-btn>
        </div>
      </v-card>
    </v-overlay>
    <v-overlay
      id="add-member-overlay"
      fixed
      :opacity="0.46"
      :value="isWantToAddMembers"
      :z-index="999"
    >
      <v-card id="add-member-card" light class="confirm-dialog pb-4 pa-6" style="width: 600px;">
        <v-list-item class="pl-0 pr-0">
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon medium left color="blue" class="ml-2">mdi-account-multiple-plus</v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline">Invite Members</v-list-item-title>
            <v-list-item-subtitle class="invite-sub-header v-card-sub-header"
              >Bring new members to the community
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="pl-0 pr-0 pt-10" style="flex-direction: column">
          <v-form v-model="validEmail" ref="emails">
            <v-combobox
              id="add-member-combobox"
              v-model="model"
              label="Enter email addresses of the companies to be invited"
              :search-input.sync="emailSearch"
              multiple
              :clearable="true"
              append-icon
              chips
              deletable-chips
              class="invite-input"
              solo
              @blur="validateEmailArea"
              :rules="[emailData.required, emailData.regex, emailData.email, emailData.maxFive]"
            ></v-combobox>
          </v-form>
          <div style="width: 100%;" v-if="memberInvites && memberInvites.length">
            <div style="width: 100%;" v-for="(mail, ind) of memberInvites" :key="ind">
              <p
                v-if="!mail.IsSuccess"
                class="v-messages v-messages__message mail-errors error--text"
              >
                {{ mail.Data }} - {{ mail.Message }}
              </p>
            </div>
          </div>
          <div style="width: 100%;" v-if="maxCharForEmail">
            <p class="v-messages v-messages__message mail-errors error--text">
              Email address cannot exceed 254 characters
            </p>
          </div>
        </v-list-item>
        <div class="d-flex flex-row flex-wrap justify-end">
          <v-btn id="add-member-cancel-btn" text color="#f56c6c" @click="onCancelInvite"
            >CANCEL
          </v-btn>
          <v-btn
            id="add-member-invite-btn"
            text
            color="#2196f3"
            :disabled="!isMailChanged"
            @click="onInvite"
            >INVITE
          </v-btn>
        </div>
      </v-card>
    </v-overlay>
    <v-overlay
      id="new-community-overlay"
      :value="isWantToAddNewCommunity"
      :class="{ newCommunityOverlay: isWantToAddNewCommunity }"
      :opacity="1"
      :z-index="999"
      color="white"
    >
      <new-community @closeAdd="onAddClose" />
    </v-overlay>
    <v-overlay
      id="post-incident-overlay"
      fixed
      :opacity="0.46"
      :value="isWantToPostIncident"
      :z-index="999"
      color="white"
      class="post-incident-overlay"
    >
      <post-incident @closePostIncident="closePost()" :communityName="selectedCommunity.name" />
    </v-overlay>
    <v-overlay
      id="mobile-right-column-overlay"
      :opacity="0.46"
      :value="isMobileInfo"
      :z-index="999"
      class="right-col-overlay"
      style="overflow: auto;"
    >
      <div class="right-col-wrapper">
        <right-column
          :pageView="true"
          @closeCommunity="isMobileInfo = false"
          @openNotifications="notificationSettingsOpened = true"
          @postIncident="isWantToPostIncident = true"
          @addMembers="isWantToAddMembers = true"
          @editCommunity="isWantToEditCommunity = true"
          @createCommunity="isWantToAddNewCommunity = true"
          @leaveCommunity="isWantToLeaveFromCommunity = true"
          @deleteCommunity="isWantToDeleteCommunity = true"
        />
      </div>
    </v-overlay>
    <v-layout wrap>
      <v-col class="main-column pr-0" cols="12" md="8">
        <v-card id="community-tabs" class="pl-1 pt-2 pr-1">
          <v-tabs v-model="tab" background-color="transparent" color="basil">
            <v-tab id="incidents-tab">Incidents</v-tab>
            <v-tab id="members-tab" @click="getMembers">Members</v-tab>
            <div class="tablet-info-btn">
              <v-btn id="info-btn" class="create-com-btn" @click="mobileInfoClicked" block rounded>
                <v-icon class="pr-1">mdi-information</v-icon>
                INFO
              </v-btn>
            </div>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <incidents
                ref="refIncidents"
                :posts="postsGetter.Data"
                :incidentsCommunityName="selectedCommunity.name"
              />
            </v-tab-item>
            <v-tab-item>
              <members />
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
      <v-col class="right-column" cols="12" md="4">
        <right-column
          class="right-col-desktop"
          @openNotifications="notificationSettingsOpened = true"
          @postIncident="isWantToPostIncident = true"
          @addMembers="isWantToAddMembers = true"
          @editCommunity="isWantToEditCommunity = true"
          @createCommunity="isWantToAddNewCommunity = true"
          @leaveCommunity="isWantToLeaveFromCommunity = true"
          @deleteCommunity="isWantToDeleteCommunity = true"
        />
      </v-col>
    </v-layout>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AuthenticationService from '../services/authentication'
import Incidents from '../components/ThreadSharing/Incidents'
import Members from '../components/ThreadSharing/Members'
import EditCommunity from '../components/ThreadSharing/EditCommunity'
import NewCommunity from '../components/ThreadSharing/NewCommunity'
import PostIncident from '../components/ThreadSharing/PostIncident'
import RightColumn from '../components/ThreadSharing/RightColumn'

export default {
  name: 'ThreatSharing',
  components: {
    Incidents,
    Members,
    EditCommunity,
    NewCommunity,
    PostIncident,
    RightColumn
  },
  data: () => ({
    search: '',
    itemsPerPageOptions: [5, 10, 20],
    itemsPerPage: 5,
    tab: null,
    items2: ['Incidents', 'Members'],
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    notificationSettingsOpened: false,
    isWantToAddNewCommunity: false,
    isWantToEditCommunity: false,
    isWantToDeleteCommunity: false,
    isWantToAddMembers: false,
    isWantToPostIncident: false,
    isWantToLeaveFromCommunity: false,
    ex11: true,
    inviteEmail: '',
    activator: null,
    attach: null,
    colors: ['#e0e0e0'],
    editing: null,
    index: -1,
    items: [],
    nonce: 1,
    menu: false,
    model: [],
    x: 0,
    inviteSearch: null,
    y: 0,
    IsNotificationsEnabled: false,
    yourPosts: [],
    isMobileInfo: false,
    mails: null,
    emailData: {
      regex: v =>
        /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/@\/,\/.\/\-\/_\s]*$/gi.test(v) ||
        'Only use letters, digits, period, comma, underline and hyphen',
      email: v => {
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
      },
      maxFive: v => {
        if (v.length > 5) {
          return 'Maximum 5 email for each invite'
        } else {
          return true
        }
      },
      required: v => (v && v.length >= 1) || 'You should type an email to invite'
    },
    validEmail: false,
    emailSearch: null,
    emailsForApi: [],
    isMailChanged: false,
    windowWidth: 0,
    pageView: true,
    maxCharForEmail: false
  }),
  computed: {
    ...mapGetters({
      notifications: 'threadSharing/notificationGetter',
      suggestedCommunities: 'threadSharing/suggestedCommunGetter',
      selectedCommunity: 'threadSharing/selectedCommunityGetter',
      getSelectedCompany: 'dashboard/getSelectedCompany',
      userGetter: 'auth/userGetter',
      postsGetter: 'threadSharing/postsGetter',
      selectedCompany: 'dashboard/getSelectedCompany',
      myCommunities: 'threadSharing/myCommunitiesGetter',
      fetchedCommunity: 'threadSharing/fetchedCommunGetter',
      memberInvites: 'threadSharing/invitesGetter',
      isMobileVisible: 'threadSharing/mobileVisibilityGetter'
    })
  },
  watch: {
    model(val, prev) {
      if (val && val.length) {
        this.isMailChanged = true
        for (let a of val) {
          if ((a && a.startsWith(' ')) || a == ' ') {
            a.replace(/\s\s+/g, ' ')
            this.model.pop()
          }
        }
      }
      if (val != prev) {
        this.isMailChanged = true
      }
    },
    IsNotificationsEnabled() {
      if (this.IsNotificationsEnabled) {
        this.notifications.IsDashboardEnabled = true
        this.notifications.IsEmailEnabled = true
        this.notifications.IsWhatsappEnabled = true
      }
    },
    selectedCompany(val, prev) {
      if (val && val != prev) {
        this.$store.dispatch('threadSharing/getCommunities').then(() => {
          if (!this.isJoined() && localStorage.getItem('communityPrivacy') === 'true') {
            this.$router.push('/threat-sharing')
          }
        })
      }
    },
    emailSearch(val) {
      val && val.length > 254 ? (this.maxCharForEmail = true) : (this.maxCharForEmail = false)
      if ((val && val.startsWith(' ')) || val == ' ') {
        val.replace(/\s\s+/g, ' ')
        this.emailSearch = ''
      }
      if (!this.regexChar(val)) {
        this.emailSearch = ''
      }
    },
    memberInvites(val) {
      if (val && !val.IsSuccess) {
        const elements = document.getElementsByClassName('v-chip--select')
        if (val && val[0] === 'success') {
          this.isWantToAddMembers = false
          this.model = []
          this.$store.commit('common/SET_SNACK_STATUS', true)
          this.$store.commit('common/SET_SNACKBAR_COLOR', '#43a047')
          this.$store.commit('common/SET_ERROR_STATE', true)
          this.$store.commit(
            'common/SET_ERROR_MESSAGE',
            `${this.emailsForApi.length} users are invited to ${this.fetchedCommunity.Name}`
          )
          this.emailsForApi = []
        }
        for (let ind = 0; ind < elements.length; ind++) {
          if (
            val &&
            val[ind] &&
            elements[ind].innerText === val[ind].Data &&
            val[ind].IsSuccess === false
          ) {
            elements[ind].style.color = '#ff5252'
            elements[ind].style.borderColor = '#ff5252'
          } else if (
            val &&
            val[ind] &&
            elements[ind].innerText === val[ind].Data &&
            val[ind].IsSuccess === true
          ) {
            elements[ind].style.color = '#43a047'
            elements[ind].style.borderColor = '#43a047'
          }
        }
      } else {
        this.isWantToAddMembers = false
        this.emailsForApi = []
      }
    },
    isMailChanged() {
      if (this.memberInvites && this.memberInvites.length) {
        this.$store.commit('threadSharing/SET_INVITE_RESULTS', [])
      }
    },
    windowWidth(val, prev) {
      if (val && val != prev && val > 768) {
        this.$store.commit('threadSharing/SET_MOBILE_INFO', false)
        this.isMobileInfo = false
      }
    }
  },
  created() {
    const communityId = this.$route.params.name
    localStorage.setItem('communityId', communityId)
    this.$store.dispatch('threadSharing/getCommunities')
    this.$store
      .dispatch('threadSharing/getCommunityInfo')
      .then(data => {
        this.$store
          .dispatch('threadSharing/setSelectedCommunity', {
            id: data.CommunityId,
            name: data.Name,
            description: data.Description,
            industry: data.BusinessCategoryText,
            privacy: data.IsPrivate,
            communityCompanyId: data.CommunityCompany[0].CompanyId,
            isOwner: data.CommunityCompany[0].CompanyId === this.getSelectedCompany.companyId
          })
          .then(response => {
            localStorage.setItem('communityName', data.Name)
            localStorage.setItem('communityDesc', data.Description)
            localStorage.setItem('communityCat', data.BusinessCategoryText)
            localStorage.setItem('communityPrivacy', data.IsPrivate)
            localStorage.setItem('creatorId', data.CreateUserId)
            localStorage.setItem('communityId', data.CommunityId)
            localStorage.setItem('communityCompanyId', data.CommunityCompany[0].CompanyId)
            localStorage.setItem(
              'isOwner',
              data.CommunityCompany[0].CompanyId === this.getSelectedCompany.companyId
            )

            if (
              encodeURI(this.selectedCommunity.id) !=
              window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1)
            ) {
              this.$router.push('/threat-sharing')
            }
            this.$store.dispatch('threadSharing/getBusinessCategories')
            this.$store.dispatch('threadSharing/getSuggestedCommunities')
            this.$store.dispatch('threadSharing/getMembers')
          })
      })
      .catch(error => {
        if (
          encodeURI(this.selectedCommunity.id) !=
          window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1)
        ) {
          this.$router.push('/threat-sharing')
        }
      })
  },
  mounted() {
    this.$nextTick(() => {
      if (AuthenticationService.isAuthenticated()) {
        this.getCurrentUser()
      }
      if (!this.isJoined && localStorage.getItem('communityPrivacy') === 'true') {
        this.$router.push('/threat-sharing')
      }
      window.addEventListener('resize', this.onResize)
      //this.tab = 1
    })
    const compId =
      (this.userGetter.currentCompany && this.userGetter.currentCompany.id) ||
      localStorage.getItem('companyId')

    const communId = this.selectedCommunity.id || localStorage.getItem('communityId')
    this.$store.dispatch('threadSharing/fetchCommunityPosts', {
      companyId: compId,
      communId: communId
    })
    if (this.selectedCommunity && this.selectedCommunity.id) {
      this.$store.dispatch('threadSharing/getMemberRequests', this.selectedCommunity.id)
    } else {
      this.$store.dispatch('threadSharing/getMemberRequests', localStorage.getItem('communityId'))
    }
    this.$store.dispatch('threadSharing/getTopPosts', localStorage.getItem('companyId'))
    const yourPostsObj = {
      compId: compId || localStorage.getItem('companyId'),
      userId: localStorage.getItem('userId')
    }
    this.$store.dispatch('threadSharing/getYourPosts', yourPostsObj)
  },
  beforeRouteLeave(to, from, next) {
    if (this.$store.state.threadSharing.isWantToShareIncident) {
      this.$store.state.threadSharing.isWantToShareIncident = false
      next(false)
    } else if (this.$refs.refIncidents && this.$refs.refIncidents.isWantToInvestigate) {
      this.$refs.refIncidents.isWantToInvestigate = false
      next(false)
    } else if (this.$refs.refIncidents && this.$refs.refIncidents.isWantToShareIncident) {
      this.$refs.refIncidents.isWantToShareIncident = false
      next(false)
    } else if (this.$refs.refIncidents && this.$refs.refIncidents.isWantToPostIncident) {
      this.$refs.refIncidents.isWantToPostIncident = false
      next(false)
    } else if (this.$refs.refIncidents && this.$refs.refIncidents.deleteIncidentModal) {
      this.$refs.refIncidents.deleteIncidentModal = false
      next(false)
    } else if (this.isWantToPostIncident) {
      this.isWantToPostIncident = false
      next(false)
    } else if (this.isWantToAddMembers) {
      this.isWantToAddMembers = false
      next(false)
    } else if (this.isWantToEditCommunity) {
      this.isWantToEditCommunity = false
      next(false)
    } else if (this.isWantToAddNewCommunity) {
      this.isWantToAddNewCommunity = false
      next(false)
    } else if (this.isWantToLeaveFromCommunity) {
      this.isWantToLeaveFromCommunity = false
      next(false)
    } else if (this.isWantToDeleteCommunity) {
      this.isWantToDeleteCommunity = false
      next(false)
    } else if (this.notificationSettingsOpened) {
      this.notificationSettingsOpened = false
      next(false)
    } else {
      next(true)
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    ...mapActions({
      getCurrentUser: 'auth/getCurrentUser'
    }),
    getMembers() {
      this.$store.dispatch('threadSharing/getMembers')
      this.$store.dispatch(
        'threadSharing/getMemberRequests',
        this.selectedCommunity.id || localStorage.getItem('communityId')
      )
    },
    onResize() {
      this.windowWidth = window.outerWidth
    },
    onEditClose() {
      if (this.isMobileVisible && this.windowWidth < 769) {
        this.isMobileInfo = true
      }
      this.isWantToEditCommunity = false
    },
    onCancelDelete() {
      if (this.isMobileVisible && this.windowWidth < 769) {
        this.isMobileInfo = true
      }
      this.isWantToDeleteCommunity = false
    },
    onCancelLeave() {
      if (this.isMobileVisible && this.windowWidth < 769) {
        this.isMobileInfo = true
      }
      this.isWantToLeaveFromCommunity = false
    },
    onLeaveConfirmed() {
      if (this.isMobileVisible && this.windowWidth < 769) {
        this.isMobileInfo = true
      }
      this.isWantToLeaveFromCommunity = false
      this.$store
        .dispatch('threadSharing/leaveCommunity', {
          communityId: localStorage.getItem('communityId'),
          creatorId: localStorage.getItem('creatorId')
        })
        .then(() => {
          this.$router.push('/threat-sharing')
        })
    },
    onCloseNotifications() {
      if (this.isMobileVisible && this.windowWidth < 769) {
        this.isMobileInfo = true
      }
      this.notificationSettingsOpened = false
    },
    onDeleteCommunity() {
      if (this.isMobileVisible && this.windowWidth < 769) {
        this.isMobileInfo = true
      }
      this.isWantToDeleteCommunity = false
      this.$store
        .dispatch('threadSharing/deleteCommunity', {
          communityId: localStorage.getItem('communityId'),
          userId: localStorage.getItem('creatorId')
        })
        .then(() => {
          if (this.$router.name != 'Threat Sharing') {
            this.$router.push('/threat-sharing')
          }
        })
    },
    onCancelInvite() {
      if (this.isMobileVisible && this.windowWidth < 769) {
        this.isMobileInfo = true
      }
      this.isWantToAddMembers = false
      this.$store.commit('threadSharing/SET_INVITE_RESULTS', [])
      this.emailsForApi = []
      this.model = []
      if (this.isMobileVisible && this.windowWidth < 769) {
        this.isMobileInfo = true
      }
    },
    onInvite() {
      if (this.$refs.emails.validate()) {
        this.emailsForApi = []
        for (let mail of this.model) {
          const communId = this.selectedCommunity.id || localStorage.getItem('communityId')
          const compId =
            (this.userGetter.currentCompany && this.userGetter.currentCompany.id) ||
            localStorage.getItem('companyId')
          const emailObj = {
            Email: mail,
            CommunityId: communId,
            InviterCompanyId: compId
          }
          this.emailsForApi.push(emailObj)
        }
        this.$store.dispatch('threadSharing/inviteMembers', this.emailsForApi)
        this.isMailChanged = false
      }
    },
    onAddClose() {
      this.isWantToAddNewCommunity = false
    },
    saveNotifications() {
      this.notifications.CommunityId = localStorage.getItem('communityId')
      this.notifications.CompanyId = localStorage.getItem('companyId')
      const refThis = this
      this.$store.dispatch('threadSharing/saveNotifications', this.notifications).then(() => {
        refThis.notificationSettingsOpened = false
      })
    },
    joinCommunity(communityId, creatorId) {
      this.$store.dispatch('threadSharing/joinCommunity', {
        CommunityId: communityId,
        CreatorId: creatorId
      })
    },
    closePost() {
      this.isWantToPostIncident = false
      this.isWantToPostFromParent = false
      if (this.isMobileVisible && this.windowWidth < 769) {
        this.isMobileInfo = true
      }
    },
    edit(index, item) {
      if (!this.editing) {
        this.editing = item
        this.mails = item
        this.index = index
      } else {
        this.editing = null
        this.index = -1
      }
    },
    filter(item, queryText, itemText) {
      if (item.header) return false
      const hasValue = val => (val != null ? val : '')
      const text = hasValue(itemText)
      const query = hasValue(queryText)

      return (
        text
          .toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1
      )
    },
    isJoined() {
      if (this.myCommunities && this.myCommunities.length) {
        return this.myCommunities.some(
          cId => cId.CommunityId == localStorage.getItem('communityId')
        )
      }
    },
    validateEmailArea() {
      const refThis = this
      setTimeout(function() {
        if (refThis.model) {
          let i = refThis.model.length
          while (i--) {
            if (!refThis.regexChar(refThis.model[i])) {
              refThis.model.splice(i, 1)
            }
          }
        }
      }, 300)
    },
    regexChar(val) {
      return /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/@\/,\/.\/\-\/_\s]*$/gi.test(val)
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
    mobileInfoClicked() {
      this.isMobileInfo = true
      this.$store.commit('threadSharing/SET_MOBILE_INFO', true)
    }
  }
}
</script>

<style scoped lang="scss">
.page-wrapper {
  height: 100%;
  position: relative;
}

.container {
  max-width: 100%;
}

::v-deep .suggested-card > .row {
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

::v-deep .main-column > .v-card {
  border-radius: 20px !important;
  box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;
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
  min-width: min-content !important;
  text-align: left !important;
}

::v-deep .v-slide-group__wrapper {
  padding-left: 20px !important;
}

.v-card.v-sheet.theme--light {
  padding-top: 0;
  padding-left: 3px;
  padding-right: 3px;
  border-radius: 20px;
}

.community-notification__container {
  max-width: 364px !important;
  padding: 32px 24px 0px 24px !important;
}

//search Input css
::v-deep .v-label--active {
  transform: translateY(-15px) scale(0.75);
}

::v-deep .v-text-field--outlined .v-label {
  top: 11px;
}

::v-deep .v-input__slot {
  -webkit-box-align: stretch;
  -ms-flex-align: stretch;
  align-items: stretch;
  min-height: 40px !important;
}

::v-deep label.v-label.theme--light {
  font-size: 12px;
}

.v-input {
  font-size: 13px !important;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.54);
}

// end search input

::v-deep .v-slide-group__content {
  border-bottom: 2px solid #e4e7ed;
  margin-right: 20px;
}

::v-deep .v-tabs-slider-wrapper {
  bottom: -1px !important;
  color: #0486fe !important;
}

::v-deep .v-tabs-bar {
  height: 60px !important;

  .v-tab {
    font-family: 'Open Sans', sans-serif !important;
    font-weight: 400;
    font-weight: 400;
    margin-right: 48px;
  }
}

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

::v-deep .v-text-field--outlined fieldset {
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
  text-transform: unset !important;
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

::v-deep .v-application--is-ltr .v-data-footer__select .v-select {
  margin: 0 !important;
}

::v-deep .v-btn:not(.v-btn--round).v-size--default,
::v-deep .v-btn--icon.v-size--default {
  height: 36px !important;
}

::v-deep .v-btn--icon.v-size--default {
  margin-left: 4px;
  width: 36px !important;
}

// Right Column
.right-side-content {
  a {
    text-decoration: none !important;
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

::v-deep .right-side-like .v-icon,
::v-deep .right-side-message .v-icon {
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
  min-height: 76px;
  margin-bottom: 8px;
  border-radius: 4px !important;
  box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
    0 3px 1px -2px rgba(80, 80, 80, 0.12);

  .suggested-title {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-top: 6px;
    padding-bottom: 4px;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .suggested-com-detail {
    font-size: 12px;

    .suggested-people-icon {
      font-size: 14px !important;
    }

    .suggested-industry {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.58;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
    }
  }

  .suggested-right-action {
    align-items: center;
    display: flex;

    .suggested-btn {
      align-items: center;
      background-color: #2196f3 !important;
      color: #fff !important;
      text-transform: capitalize;
      display: flex;
      justify-content: center;

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
  padding-bottom: 30px;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87) !important;
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
  width: 100%;
  margin-right: 10px;

  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87) !important;

  .community-notification-switch {
    align-items: center;
    display: flex;
    height: 25px !important;
    margin-top: 10px !important;
  }
}
::v-deep .v-input--switch__thumb {
  top: calc(50% - 13px);
  height: 26.7px;
  width: 24.8px;
}

::v-deep .v-input--switch__track {
  opacity: 0.4;
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

::v-deep .invite-input {
  width: 100% !important;
}

::v-deep .invite-input > .v-input__control > .v-input__slot {
  align-items: center;
  border-radius: 8px;
  border: solid 1px rgba(0, 0, 0, 0.16);
  background-color: #fff;
  box-shadow: unset !important;
  display: flex;
  width: 100% !important;

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

  > ::v-deep .v-overlay__content {
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

::v-deep .investigate-overlay,
::v-deep .post-incident-overlay,
::v-deep .right-col-overlay {
  .v-overlay__content {
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    overflow-y: scroll;
  }
}

::v-deep .v-form {
  width: 100%;
}

::v-deep .v-chip {
  border: 1px solid transparent;
}

::v-deep .v-messages__message {
  font-weight: 400 !important;
  font-size: 10px !important;
}

.mail-errors {
  text-align: left;
  font-size: 10px;
  margin-left: 12px;
  width: 100%;
  margin-bottom: 4px;
}

.right-col-wrapper {
  align-items: center;
  display: flex;
  padding: 78px;
  position: relative;
  width: 100%;

  @media only screen and (max-width: 500px) {
    padding: 16px !important;
    margin-right: -5px;
    width: 97%;
  }
}

::v-deep .v-slide-group__wrapper {
  contain: unset !important;
  overflow: visible !important;
}

::v-deep .v-data-footer {
  margin-top: 24px !important;
  justify-content: flex-end !important;
}

::v-deep .v-data-footer__select {
  .v-select {
    margin: 0 !important;
    margin-top: 3px !important;
    margin-left: 32px !important;
    height: 30px !important;
  }

  .v-text-field > .v-input__control > .v-input__slot:after {
    border: none !important;
    display: none !important;
  }

  .theme--light.v-text-field > .v-input__control > .v-input__slot:before {
    border: none !important;
  }

  .v-input__append-inner {
    margin-left: 0 !important;
    margin-top: 3px !important;
    margin-right: 5px !important;
    padding-left: 0 !important;
  }

  .v-select__slot {
    align-items: center;
    display: flex;
    justify-content: center;
    height: 27px !important;
    background-color: #f2f2f2 !important;

    .v-select__selections {
      margin-left: 10px;
    }
  }

  .v-input__icon {
    width: 20px !important;
    min-width: 20px !important;
    height: 20px !important;
  }
}

.tablet-info-btn {
  display: none;
  position: absolute;
  right: -24px;
  top: -16px;
  z-index: 13;

  @media only screen and (max-width: 769px) {
    display: block;
  }
}

@media only screen and (max-width: 769px) {
  .v-application .main-column {
    padding: 0 16px !important;
  }
  .right-col-desktop {
    display: none !important;
  }
}
::v-deep .text-decoration-none {
  text-decoration: none !important;
  text-decoration-line: none !important;
}
</style>
