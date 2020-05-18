<template>
  <div class="page-wrapper">
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
      <v-card light class="confirm-dialog pb-4 pa-6" style="width: 370px;">
        <v-list-item class="pl-0 pr-0 pb-8 pt-2">
          <span class="community-notification-header">Community Notification Settings</span>
        </v-list-item>
        <v-list-item
          class="community-notification-row pa-0"
          style="border-bottom: 1px solid rgba(80, 80, 80, 0.14);"
        >
          Notifications
          <v-switch
            id="general-notif-switch"
            v-model="notifications.IsNotificationsEnabled"
            color="#2196f3"
            hide-details
            class="community-notification-switch mt-0"
          />
        </v-list-item>
        <v-list-item class="community-notification-row pa-0">
          Dashboard notifications
          <v-switch
            id="dashboard-notif-switch"
            v-model="notifications.IsDashboardEnabled"
            color="#2196f3"
            hide-details
            class="community-notification-switch mt-0"
            :disabled="!notifications.IsNotificationsEnabled"
          />
        </v-list-item>
        <v-list-item class="community-notification-row pa-0">
          Email notifications
          <v-switch
            id="email-notif-switch"
            v-model="notifications.IsEmailEnabled"
            color="#2196f3"
            hide-details
            class="community-notification-switch mt-0"
            :disabled="!notifications.IsNotificationsEnabled"
          />
        </v-list-item>
        <v-list-item class="community-notification-row pa-0">
          SMS notifications
          <v-switch
            id="whatsapp-notif-switch"
            v-model="notifications.IsWhatsappEnabled"
            color="#2196f3"
            hide-details
            class="community-notification-switch mt-0"
            :disabled="!notifications.IsNotificationsEnabled"
          />
        </v-list-item>
        <div class="d-flex flex-row flex-wrap justify-end pt-2">
          <v-btn
            id="notif-cancel-btn"
            text
            color="#f56c6c"
            class="pa-0"
            @click="notificationSettingsOpened = false"
            >CANCEL
          </v-btn>
          <v-btn id="notif-save-btn" text color="#2196f3" class="pa-0" @click="saveNotifications"
            >SAVE
          </v-btn>
        </div>
      </v-card>
    </v-overlay>
    <v-overlay
      id="delete-commun-overlay"
      fixed
      :opacity="0.46"
      :value="isWantToDeleteCommunity"
      :z-index="999"
    >
      <v-card id="delete-commun-card" light class="confirm-dialog pb-4 pa-6" style="width: 444px;">
        <v-list-item class="pl-0 pr-0">
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon id="delete-icon-community" medium left color="blue" class="ml-2"
              >mdi-delete
            </v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline">Delete Community?</v-list-item-title>
            <v-list-item-subtitle class="v-card-sub-header">Community Name</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="pl-0 pr-0 pt-7 pb-6">
          <span class="delete-info">All incidents and data will be lost</span>
        </v-list-item>
        <div class="d-flex flex-row flex-wrap justify-end">
          <v-btn id="cancel-delete-commun-btn" text color="#f56c6c" @click="onCancelDelete"
            >CANCEL
          </v-btn>
          <v-btn id="delete-delete-commun-btn" text color="#2196f3" @click="onDeleteCommunity"
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
      <v-card id="leave-commun-card" light class="confirm-dialog pb-4 pa-6" style="width: 444px;">
        <v-list-item class="pl-0 pr-0">
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon id="delete-icon-community" medium left color="blue" class="ml-2"
              >mdi-exit-to-app
            </v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline">Leave Community?</v-list-item-title>
            <v-list-item-subtitle class="v-card-sub-header">Community Name</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="pl-0 pr-0 pt-7 pb-6">
          <span class="delete-info">
            You are leaving “Community name”. You won’t be able to post incidents to this community
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
      id="add-new-community-overlay"
      :value="isWantToAddNewCommunity"
      :class="{ newCommunityOverlay: isWantToAddNewCommunity }"
      :opacity="1"
      :z-index="999"
      color="white"
    >
      <new-community @closeAdd="onAddClose" />
    </v-overlay>
    <v-overlay
      id="is-mobile-right-column-overlay"
      :opacity="0.46"
      :value="isMobile && isMobileInfo"
      :z-index="999"
      class="right-col-overlay"
      style="overflow: auto;"
    >
      <div class="right-col-wrapper">
        <right-column
          :pageView="true"
          @closeCommunity="closeCommunityFromMobileInfo"
          @openNotifications="notificationsFromMobileInfo"
          @postIncident="postIncidentFromMobileInfo"
          @addMembers="postIncidentFromMobileInfo"
          @editCommunity="editCommunityFromMobileInfo"
          @createCommunity="createCommunityFromMobileInfo"
          @leaveCommunity="isWantToLeaveFromCommunity = true"
        />
      </div>
    </v-overlay>
    <v-layout id="ts-layout" wrap style="min-height: 79vh;">
      <v-col class="main-column pr-0" cols="12" md="8">
        <v-card id="ts-card" class="pl-1 pt-2 pr-1">
          <v-tabs id="ts-tabs" v-model="tab" background-color="transparent" color="basil">
            <v-tab id="ts-tab-incident" @click="getIncidents">Incidents</v-tab>
            <v-tab id="ts-tab-community" @click="getCommunities">Communities</v-tab>
            <div class="tablet-info-btn">
              <v-btn
                id="ts-info-btn"
                class="create-com-btn"
                @click="mobileInfoClicked"
                block
                rounded
              >
                <v-icon class="pr-1">mdi-information</v-icon>
                INFO
              </v-btn>
            </div>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <incidents ref="refIncidents" @go-to-communities="changeTabCommunities" />
            </v-tab-item>
            <v-tab-item>
              <communities
                @open-notification="notificationFromCommunities()"
                @create-community="isWantToAddNewCommunity = true"
                @edit-community="editTheCommunity()"
                ref="refCommunities"
              />
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>

      <v-col id="ts-right-column" class="right-column" cols="12" md="4">
        <right-column
          class="right-col-desktop"
          @openNotifications="notificationSettingsOpened = true"
          @postIncident="isWantToPostIncident = true"
          @addMembers="isWantToAddMembers = true"
          @editCommunity="isWantToEditCommunity = true"
          @createCommunity="isWantToAddNewCommunity = true"
          @leaveCommunity="isWantToLeaveFromCommunity = true"
        />
      </v-col>
    </v-layout>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import AuthenticationService from '../services/authentication'
import Incidents from '../components/ThreadSharing/Incidents'
import Communities from '../components/ThreadSharing/Communities'
import EditCommunity from '../components/ThreadSharing/EditCommunity'
import NewCommunity from '../components/ThreadSharing/NewCommunity'
import RightColumn from '../components/ThreadSharing/RightColumn'

export default {
  name: 'ThreatSharing',
  components: {
    Incidents,
    Communities,
    EditCommunity,
    NewCommunity,
    RightColumn
  },
  data: () => ({
    search: '',
    itemsPerPageOptions: [5, 10, 20],
    itemsPerPage: 5,
    tab: null,
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    notificationSettingsOpened: false,
    isWantToAddNewCommunity: false,
    isWantToEditCommunity: false,
    isWantToDeleteCommunity: false,
    isWantToAddMembers: false,
    isMobileInfo: false,
    isWantToPostIncident: false,
    isWantToLeaveFromCommunity: false,
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
    editObj: {},
    pageView: true,
    dbound: null,
    firstClick: 1,
    windowWidth: 0
  }),
  computed: {
    ...mapGetters({
      isTourActive: 'tour/isTourActive',
      getTourData: 'tour/getTourData',
      menuList: 'dashboard/getMenuList',
      selectedCompany: 'dashboard/getSelectedCompany',
      notifications: 'threadSharing/notificationGetter',
      selectedCommunity: 'threadSharing/selectedCommunityGetter',
      userGetter: 'auth/userGetter',
      isMobileVisible: 'threadSharing/mobileVisibilityGetter'
    }),
    ...mapState({
      companyInformation: state => state.dashboard.companyInformation
    }),
    isMobile() {
      if (window.outerWidth < 769) {
        return true
      } else {
        this.$store.commit('threadSharing/SET_MOBILE_INFO', false)
        return false
      }
    }
  },
  watch: {
    model(val, prev) {
      if (val && val.length > 5) {
        this.$nextTick(() => this.model.pop())
      }
      if (val.length === prev.length) return

      this.model = val.map(v => {
        if (typeof v === 'string' && !v.startsWith(' ')) {
          v = {
            text: v,
            color: this.colors[this.nonce - 1]
          }
          this.items.push(v)
          this.nonce++
        }
        return v
      })
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
        this.dispatchPage()
      }
    },
    windowWidth(val, prev) {
      if (val && val != prev && val > 768) {
        this.$store.commit('threadSharing/SET_MOBILE_INFO', false)
        this.isMobileInfo = false
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (AuthenticationService.isAuthenticated()) {
        this.getCurrentUser()
        this.dispatchPage()
      }
      window.addEventListener('resize', this.onResize)
      if (this.$route.query && !!this.$route.query.communityID) {
        this.getCommunities(2, true)
      }
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  beforeRouteLeave(to, from, next) {
    if (this.isWantToAddNewCommunity) {
      this.onAddClose()
      next(false)
    } else if (this.$refs.refIncidents.isWantToInvestigate) {
      this.$refs.refIncidents.isWantToInvestigate = false
      next(false)
    } else if (this.$refs.refIncidents.isWantToShareIncident) {
      this.$refs.refIncidents.isWantToShareIncident = false
      next(false)
    } else if (this.$refs.refIncidents.isWantToPostIncident) {
      this.$refs.refIncidents.isWantToPostIncident = false
      next(false)
    } else if (this.$refs.refIncidents.deleteIncidentModal) {
      this.$refs.refIncidents.deleteIncidentModal = false
      next(false)
    } else if (this.isWantToEditCommunity) {
      this.isWantToEditCommunity = false
      next(false)
    } else if (this.notificationSettingsOpened) {
      this.notificationSettingsOpened = false
      next(false)
    } else if (this.isWantToDeleteCommunity) {
      this.isWantToDeleteCommunity = false
      next(false)
    } else if (this.$refs.refCommunities && this.$refs.refCommunities.confirmDialog) {
      this.$refs.refCommunities.confirmDialog = false
      next(false)
    } else {
      next()
    }
  },
  methods: {
    ...mapActions({
      getCurrentUser: 'auth/getCurrentUser'
    }),
    dispatchPage(account) {
      this.$store.dispatch('threadSharing/getCommunities')
      this.$store.dispatch('threadSharing/getBusinessCategories')
      this.$store.dispatch('threadSharing/getSuggestedCommunities')
      this.$store.dispatch('threadSharing/getRequestsCompany', localStorage.getItem('companyId'))
      this.$store.dispatch('threadSharing/getTopPosts', localStorage.getItem('companyId'))
      const yourPostsObj = {
        compId: localStorage.getItem('companyId'),
        userId: localStorage.getItem('userId')
      }
      this.$store.dispatch('threadSharing/getYourPosts', yourPostsObj)
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
    getCommunities(firstClickValue, isDefault) {
      if (firstClickValue || this.firstClick > 1) {
        const refThis = this
        refThis.isDefault = isDefault
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(function() {
          refThis.$store.dispatch('threadSharing/getCommunities').finally(res => {
            refThis.isDefault ? (refThis.tab = 1) : ''
          })
        }, 3000)
      }
      this.firstClick = this.firstClick + 1
    },
    getIncidents() {
      const compId =
        // (this.userGetter.currentCompany && this.userGetter.currentCompany.id) ||
        localStorage.getItem('companyId')
      const communId = ''
      this.$store.dispatch('threadSharing/fetchCommunityPosts', {
        companyId: compId,
        communId: ''
      })
    },
    onCancelDelete() {
      if (this.isMobileVisible && this.windowWidth < 769) {
        this.isMobileInfo = true
      }
      this.isWantToDeleteCommunity = false
    },
    onDeleteCommunity() {
      if (this.isMobileVisible && this.windowWidth < 769) {
        this.isMobileInfo = true
      }
      this.isWantToDeleteCommunity = false
      this.$store.dispatch('threadSharing/deleteCommunity', {
        communityId: localStorage.getItem('communityId'),
        userId: localStorage.getItem('creatorId')
      })
    },
    onCancelLeave() {
      if (this.isMobileVisible && this.windowWidth < 769) {
        this.isMobileInfo = true
      }
      this.isWantToLeaveFromCommunity = false
    },
    onCancelInvite() {
      if (this.isMobileVisible && this.windowWidth < 769) {
        this.isMobileInfo = true
      }
      this.isWantToAddMembers = false
    },
    onAddClose() {
      if (this.isMobileVisible && this.windowWidth < 769) {
        this.isMobileInfo = true
      }
      this.isWantToAddNewCommunity = false
    },
    notificationFromCommunities() {
      this.notificationSettingsOpened = true
      this.$store.dispatch('threadSharing/getNotifications', this.selectedCommunity.id)
    },
    saveNotifications() {
      this.notifications.CommunityId = this.selectedCommunity.id
      this.notifications.CompanyId =
        this.selectedCommunity.communityCompanyId || localStorage.getItem('companyId')
      const refThis = this
      this.$store.dispatch('threadSharing/saveNotifications', this.notifications).then(() => {
        refThis.notificationSettingsOpened = false
      })
    },
    editTheCommunity() {
      this.isWantToEditCommunity = true
    },
    postIncident() {
      this.$store.state.threadSharing.isWantToPostIncident = true
    },
    changeTabCommunities() {
      this.tab = 1
    },
    edit(index, item) {
      if (!this.editing) {
        this.editing = item
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
    mobileInfoClicked() {
      this.isMobileInfo = true
      this.$store.commit('threadSharing/SET_MOBILE_INFO', true)
    },
    closeCommunityFromMobileInfo() {
      this.isMobileInfo = false
    },
    notificationsFromMobileInfo() {
      this.notificationSettingsOpened = true
    },
    postIncidentFromMobileInfo() {
      this.isWantToPostIncident = true
    },
    addMembersFromMobileInfo() {
      this.isWantToAddMembers = true
    },
    editCommunityFromMobileInfo() {
      this.isWantToEditCommunity = true
    },
    createCommunityFromMobileInfo() {
      this.isWantToAddNewCommunity = true
    },
    onLeaveConfirmed() {
      this.isWantToLeaveFromCommunity = false
      this.$store.dispatch('threadSharing/leaveCommunity', {
        communityId: localStorage.getItem('communityId'),
        creatorId: localStorage.getItem('creatorId')
      })
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

::v-deep .main-column > .v-card,
::v-deep .right-column > .v-card {
  border-radius: 20px !important;
  box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;
  background-color: #fff !important;
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
    line-height: 31px;
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
    font-family: 'Open Sans', sans-serif !important;
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
  border-radius: 8px !important;
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
  text-transform: capitalize !important;
  padding-bottom: 10px;
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
  padding: 0;
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

::v-deep .v-btn--contained {
  border-radius: 18px !important;
  box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5) !important;
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
    width: min-content;

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

::v-deep .invite-input > .v-input__control > .v-input__slot {
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
  text-transform: capitalize;
}

::v-deep .v-overlay {
  max-width: 100vw;
}

.right-col-overlay > ::v-deep .v-overlay__content {
  display: flex;
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: scroll;
}

.right-col-overlay > ::v-deep .v-overlay__scrim {
  position: fixed !important;
}

.right-col-wrapper {
  align-items: stretch;
  display: flex;
  padding: 78px;
  position: relative;
  width: 100%;

  .pop-up-card {
    overflow: scroll;
    -webkit-overflow-scrolling: auto;
    -webkit-appearance: none;

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

  @media only screen and (max-width: 500px) {
    padding: 5px !important;
  }
}

::v-deep .v-slide-group__wrapper {
  contain: unset !important;
  overflow: visible !important;
}

.tablet-info-btn {
  display: none;
  position: absolute;
  right: 0;
  top: 10px;
  z-index: 13;

  @media only screen and (max-width: 769px) {
    display: block;
  }
  @media only screen and (max-width: 500px) {
    right: -14px;
    top: -23px;
  }
}

@media only screen and (max-width: 769px) {
  .v-application .main-column {
    padding: 0 16px !important;
  }
  .right-col-desktop {
    display: none !important;
  }
  .v-data-footer {
    justify-content: center !important;
  }
}
</style>
