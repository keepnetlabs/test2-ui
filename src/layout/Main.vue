<template>
  <v-app class="main">
    <template v-for="(snackbar, index) in snackbars">
      <v-snackbar
        :key="snackbar.message"
        v-model="snackbar.status"
        :color="snackbar.color"
        bottom
        @input="changeSnackbarStatus($event, snackbar)"
        :style="getSnackBarStyle(snackbar.message, index)"
        :timeout="3000"
      >
        <div class="snackbar__left-column">
          <div v-if="snackbar.icon">
            <v-icon color="#fff" size="20px"> {{ snackbar.icon }}</v-icon>
          </div>
          <div class="snackbar__message" :class="[snackbar.icon ? 'ml-4' : '']">
            {{ snackbar.message }}
          </div>
        </div>
        <div class="snackbar__right-column">
          <v-icon
            v-if="!snackbar.action"
            color="#fff"
            size="20px"
            @click="changeSnackbarStatus(false, snackbar)"
            >mdi-close
          </v-icon>
          <router-link class="snackbar__action" v-else :to="snackbar.action.link">
            <v-btn @click.native="changeSnackbarStatus($event, snackbar)" color="#2196f3" rounded>
              {{ snackbar.action.label }}
            </v-btn>
          </router-link>
        </div>
      </v-snackbar>
    </template>
    <v-dialog v-model="feedbackdialog" :width="600">
      <feedback-popup v-on:closePopUp="feedbackdialog = $event"></feedback-popup>
    </v-dialog>
    <v-overlay :z-index="15" :value="isTourActive"></v-overlay>
    <tour-widget></tour-widget>
    <v-overlay :value="isLoadingFromStore > 0" :z-index="9999999">
      <div class="text-center">
        <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
      </div>
    </v-overlay>
    <v-row justify="center">
      <v-dialog v-model="switchDialog" content-class="switch-dialog" width="600">
        <switch-account></switch-account>
      </v-dialog>
    </v-row>
    <v-overlay :absolute="false" :opacity="0.46" :value="sessionCheck" :z-index="999">
      <session-expired @closeSessionExpired="sessionCheck = false"></session-expired>
    </v-overlay>
    <v-overlay absolute :opacity="0.46" :value="!isDisconnected" :z-index="99999">
      <div class="connection-lost-wrapper">
        <connection-lost v-on:onIUnderstand="onIUndestandClick($event)"></connection-lost>
      </div>
    </v-overlay>
    <div class="background"></div>
    <v-navigation-drawer
      color="rgba(255, 255, 255, 0.9)"
      app
      width="270"
      v-model="getDrawer"
      :mini-variant.sync="getMini"
      transition="scale-transition"
      :mobile-break-point="767"
    >
      <v-app-bar-nav-icon
        class="Oval-3 ml-4 menu-icon-wrapper"
        color="blue"
        @click.stop="onNavigationClick()"
        :style="getDrawerPadding2"
        height="48"
        width="48"
        x-large
      ></v-app-bar-nav-icon>
      <v-overlay
        :z-index="12"
        :value="!(getTourData[4] || getTourData[5]) && getTourData.isActive"
      ></v-overlay>
      <div>
        <div class="logo-wrapper">
          <div
            v-show="isTourActive"
            class="tour-btn-container tour-five"
            :class="{ z_index_custom_1: getTourData['4'] }"
          >
            <div class="tour-btn-wrapper">
              <div class="tour-btn-circle">
                <div class="tour-btn-circle-inner"></div>
              </div>
            </div>
          </div>
          <offline @detected-condition="handleConnectivityChange">
            <div slot="online"></div>
            <!-- Only renders when the device is offline -->
            <div slot="offline"></div>
          </offline>
          <div class="v-responsive">
            <router-link to="/">
              <img
                v-if="!mini && drawer"
                style="max-width: 180px; max-height: 180px;"
                src="../assets/img/logo-kep.png"
              />
              <img v-else src="../assets/img/account-circle.png" class="menu-mini-img" />
            </router-link>
          </div>
        </div>
      </div>
      <div class="d-flex justify-center flex-wrap user-wrapper mb-12">
        <div class="user-name-dropdown">
          <div class="user-name-dropdown-font">
            <v-menu
              :disabled="false"
              :absolute="false"
              :open-on-hover="false"
              :close-on-click="true"
              :close-on-content-click="true"
              :offset-x="false"
              :offset-y="true"
            >
              <template v-slot:activator="{ on }">
                <div
                  class="v-btn-dropdown v-btn v-btn--depressed v-btn--flat v-btn--tile theme--light v-size--default black--text pr-0 pl-2"
                  v-on="on"
                >
                  <div class="user-name-dropdown-font">{{ getFullName }}</div>
                  <v-icon>mdi-chevron-down</v-icon>
                </div>
              </template>

              <v-list class="v-cart-dropdown-list">
                <v-list-item
                  v-for="item in dropdownData"
                  :key="item.key"
                  @click="changeDropdownItem(item)"
                >
                  <v-list-item-title>
                    <v-icon>{{ item.icon }}</v-icon>
                    {{ item.text }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
          <div class="user-name-dropdown-detail">
            <span>{{ getRolename }}</span>
            <span>{{ getCompanyName }}</span>
          </div>
        </div>
        <div class="user-role-wrapper"></div>
      </div>
      <v-list dense>
        <div
          v-show="isTourActive"
          class="tour-btn-container tour-six"
          :class="{ z_index_custom_1: getTourData['5'] }"
        >
          <div class="tour-btn-wrapper">
            <div class="tour-btn-circle">
              <div class="tour-btn-circle-inner"></div>
            </div>
          </div>
        </div>

        <router-link to="/" class="menu-link-default">
          <v-list-item class="menu-list-item">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item>
        </router-link>
        <router-link to="/threat-sharing" class="menu-link-default">
          <v-list-item class="menu-list-item">
            <v-list-item-icon>
              <v-icon>mdi-flag</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Threat Sharing</v-list-item-title>
          </v-list-item>
        </router-link>
        <v-list-group
          prepend-icon="mdi-briefcase"
          no-action
          class="menu-with-item menu-link-default"
        >
          <template v-slot:activator>
            <v-list-item-content class="menu-list-item">
              <v-list-item-title>Company</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item style="padding-left: 0 !important; margin-left: -5px;">
            <v-list-item-content class="menu-item-content">
              <router-link to="/target-users" class="menu-link-default">
                <v-list-item-title class="menu-item-wrapper">
                  <span class="menu-item-span">Target Users</span>
                </v-list-item-title>
              </router-link>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-group
          prepend-icon="mdi-flash"
          no-action
          class="menu-with-item menu-link-default"
          :class="{ 'primary--text active-menu-parent': routerName === 'Incident Responder' }"
        >
          <template v-slot:activator>
            <v-list-item-content class="menu-list-item">
              <v-list-item-title>Incident Responder</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item style="padding-left: 0 !important; margin-left: -5px;">
            <v-list-item-content class="menu-item-content">
              <router-link to="/incident-responder" class="menu-link-default">
                <v-list-item-title class="menu-item-wrapper">
                  <span class="menu-item-span">Incident Responder</span>
                </v-list-item-title>
              </router-link>
            </v-list-item-content>
          </v-list-item>
          <v-list-item style="padding-left: 0 !important; margin-left: -5px;">
            <v-list-item-content class="menu-item-content">
              <router-link to="/phishing-reporter" class="menu-link-default">
                <v-list-item-title class="menu-item-wrapper">
                  <span class="menu-item-span">Phishing Reporter</span>
                </v-list-item-title>
              </router-link>
            </v-list-item-content>
          </v-list-item>
          <v-list-item style="padding-left: 0 !important; margin-left: -5px;">
            <v-list-item-content class="menu-item-content">
              <router-link to="/integrations" class="menu-link-default">
                <v-list-item-title class="menu-item-wrapper">
                  <span class="menu-item-span">Integrations</span>
                </v-list-item-title>
              </router-link>
            </v-list-item-content>
          </v-list-item>
          <v-list-item style="padding-left: 0 !important; margin-left: -5px;">
            <v-list-item-content class="menu-item-content">
              <router-link to="/playbook" class="menu-link-default">
                <v-list-item-title class="menu-item-wrapper">
                  <span class="menu-item-span">Playbook</span>
                </v-list-item-title>
              </router-link>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <!--
        <div v-for="(item, index) in menuList" :key="index">
          <v-list-group
            v-if="item.childs && item.childs.length"
            v-model="item.active"
            :prepend-icon="item.icon"
            no-action
            class="menu-list-item"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item v-for="(subItem, ind) in item.childs" :key="ind">
              <v-list-item-content>
                <v-list-item-title v-text="subItem.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item v-else v-model="item.active" class="menu-list-item">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </div>
        -->
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :style="getMini ? 'padding-left: 6px' : 'padding-left: 5px'"
      app
      flat
      absolute
      class="header-container"
      height="160"
    >
      <div class="d-flex flex-column topbar-wrapper">
        <div class="topbar-inline-wrapper d-flex flex-row flex-wrap mt-3">
          <account-dropdown></account-dropdown>
          <div class="d-flex flex-lg-grow-1"></div>
          <div class="search-notification-wrapper d-flex flex-row flex-wrap ml-auto">
            <div class="d-flex flex-lg-grow-1"></div>
            <div class="ml-auto">
              <div class="search-wrapper">
                <v-text-field flat dark rounded solo prepend-inner-icon="mdi-magnify">
                  <template v-slot:label>
                    <span class="placeholder-search" style="font-size: 16px;">Search</span>
                  </template>
                </v-text-field>
              </div>
            </div>
            <div class="divider-header"></div>
            <v-menu
              :close-on-content-click="false"
              fixed
              content-class="notification-menu"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on }">
                <v-btn style="margin-top: -3px" icon color="white" v-on="on">
                  <div class="notification-bell">
                    <v-icon style="font-size: 22px;" color="white">mdi-bell</v-icon>
                    <span v-if="getUnreadMessages > 0" class="manuel-badge">
                      {{ getUnreadMessages }}
                    </span>
                  </div>
                </v-btn>
              </template>
              <div class="notification-wrapper">
                <div v-for="notification in notificationList">
                  <!-- eslint-disable-line -->
                  <div class="notification-content">
                    <div class="notification-title">{{ notification.content }}</div>
                    <div
                      v-on:click="onNotificationSeen(notification)"
                      v-if="notification.isSeen == false"
                      class="notification-light"
                    ></div>
                    <div class="notification-date-time">
                      {{ getFormattedDate(notification.date) }}
                    </div>
                  </div>
                  <v-divider class="mt-5 mb-5"></v-divider>
                </div>
              </div>
            </v-menu>

            <div class="help-wrapper pl-2">
              <v-menu content-class="help-menu" fixed transition="scale-transition">
                <template nudge-right v-slot:activator="{ on }">
                  <v-btn style="margin-top: -3px" icon color="white" v-on="on">
                    <v-icon style="font-size: 25px; margin-bottom: 2px;">mdi-help-circle</v-icon>
                  </v-btn>
                </template>
                <v-list class="v-cart-dropdown-list">
                  <v-list-item
                    v-for="(item, index) in rightDropdownData"
                    :key="index"
                    @click="changeDropdownItem2(item)"
                  >
                    <v-list-item-title>
                      <v-icon>{{ item.icon }}</v-icon>
                      {{ item.text }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
        </div>
        <div class="v-flex flex-column align-center">
          <v-toolbar-title>
            <span v-if="routerName === 'Community'">{{ communityName || $route.params.name }}</span>
            <span v-else>{{ routerName }}</span>
          </v-toolbar-title>
          <div class="breadcrumb-wrapper ml-2 pt-1">
            <div class="pr-2">
              <router-link class="breadcrumb-links" to="/" v-if="routerName === 'Dashboard'"
                >{{ breadcrumbs[0].text }}
              </router-link>
              <router-link
                class="breadcrumb-links"
                to="/threat-sharing"
                v-if="routerName === 'Threat Sharing'"
                >{{ breadcrumbs[1].text }}
              </router-link>
              <router-link
                class="breadcrumb-links"
                to="/threat-sharing"
                v-if="routerName === 'Community'"
              >
                {{ breadcrumbs[1].text }}
                <v-icon style="color: #fff; font-size: 16px;">mdi-chevron-right</v-icon>
                {{ breadcrumbs[2].text }}
              </router-link>
              <router-link
                class="breadcrumb-links"
                to="/threatsharing"
                v-if="routerName === 'Incident Responder'"
              >
                {{ breadcrumbs[3].text }}
                <v-icon style="color: #fff; font-size: 16px;">mdi-chevron-right</v-icon>
                Dashboard
              </router-link>
              <router-link
                class="breadcrumb-links"
                to="/integrations"
                v-if="routerName === 'Integrations'"
              >
                {{ breadcrumbs[3].text }}
              </router-link>
              <router-link
                class="breadcrumb-links"
                to="/threatsharing"
                style=" display: flex;align-items: center;"
                v-if="routerName === 'Phishing Reporter'"
              >
                {{ breadcrumbs[1].text }}
                <v-icon style="color: #fff; font-size: 16px; ">mdi-chevron-right</v-icon>
                Playbook
              </router-link>
              <router-link
                class="breadcrumb-links"
                to="/incident-responder"
                v-if="routerName === 'Analysis Details'"
                >{{ breadcrumbs[3].text }}
              </router-link>
              <router-link
                class="breadcrumb-links"
                to="/investigations"
                v-if="routerName === 'Investigation Details'"
              >
                Investigations
              </router-link>
              <router-link
                v-if="routerName === 'Target Users'"
                :to="$route.path"
                class="bread-last-step breadcrumb-links"
              >
                Company
              </router-link>
              <router-link
                v-if="routerName === 'Investigations'"
                :to="$route.path"
                class="bread-last-step breadcrumb-links"
                >Incident Responder > {{ routerName }}
              </router-link>
              <v-icon
                v-if="
                  routerName !== 'Incident Responder' &&
                    routerName !== 'Investigations' &&
                    routerName !== 'Phishing Reporter'
                "
                style="color: #fff; font-size: 16px;"
                >mdi-chevron-right
              </v-icon>
              <router-link
                v-if="
                  routerName !== 'Incident Responder' &&
                    routerName !== 'Investigations' &&
                    routerName !== 'Phishing Reporter'
                "
                :to="$route.path"
                class="bread-last-step breadcrumb-links"
                >{{ routerName }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </v-app-bar>
    <v-content :style="getMini ? 'padding-left: 63px' : 'padding-left: 270px'">
      <v-container fluid style="height: 100%;" class="app-container ml-0 pa-0 pt-2 mr-0">
        <router-view />
      </v-container>
      <v-footer class="footer d-flex">
        <div class="footer-item__primary footer-copyright">
          Copyright Keepnet Labs &copy; {{ new Date().getFullYear() }}
        </div>
        <div class="footer-item__secondary footer-links">
          <a href="#">Privacy Policy</a> &bull; <a href="#">Terms and Conditions</a> &bull;
        </div>
        <div class="footer-item__third footer-links">
          <a href="#">Cookie Policy</a> &bull;
          <a href="#">EULA</a>
        </div>
        <div class="footer-item__fourth footer-designedby">Designed by Keepnet Labs</div>
      </v-footer>
    </v-content>
  </v-app>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import offline from 'v-offline'
import AccountDropdown from '../components/AccountDropdown'
import ConnectionLost from '../components/ConnectionLost'
import SessionExpired from '../components/SessionExpired'
import SwitchAccount from '../components/SwitchAccount'
import TourWidget from '../components/TourWidget'
import FeedbackPopup from '../components/FeedbackPopup'
import AuthenticationService from '../services/authentication'

export default {
  name: 'Main',
  components: {
    FeedbackPopup,
    AccountDropdown,
    ConnectionLost,
    SessionExpired,
    SwitchAccount,
    offline,
    TourWidget
  },
  data() {
    return {
      sessionCheck: false,
      tour: {
        isActive: false,
        one: { active: false },
        two: { active: false },
        three: { active: false },
        four: { active: false },
        five: { active: false }
      },
      drawer: null,
      mini: null,
      dialog: true,
      isDisconnected: true,
      rightDropdownData: [
        {
          text: 'Tour',
          icon: 'mdi-reminder',
          url: ''
        },
        {
          text: 'Documentation',
          icon: 'mdi-file-document',
          url: ''
        },
        {
          text: 'Get Help',
          icon: 'mdi-help-circle',
          url: ''
        },
        {
          text: 'Video Tutorial',
          icon: 'mdi-play-speed',
          url: ''
        },
        {
          text: 'Feedback',
          icon: 'mdi-message-alert',
          url: ''
        }
      ],
      dropdownData: [
        {
          text: 'Edit Profile',
          icon: 'mdi-account',
          url: ''
        },
        {
          text: 'Change Password',
          icon: 'mdi-lock',
          url: ''
        },
        {
          text: 'Login History',
          icon: 'mdi-history',
          url: ''
        },
        {
          text: 'Logout',
          icon: 'mdi-login-variant',
          url: ''
        }
      ],
      selectedOpt1: 'Programming',
      selectedItems: ['Programming', 'Design', 'Vue', 'Vuetify'],
      components: [
        'Autocompletes',
        'Comboboxes',
        'Forms',
        'Inputs',
        'Overflow Buttons',
        'Selects',
        'Selection Controls',
        'Sliders',
        'Textareas',
        'Text Fields'
      ],
      items2: [
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' }
      ],
      messages: 3,
      items: [
        {
          id: 1,
          title: 'Dashboard',
          name: 'dashboard',
          icon: 'mdi-home',
          active: true,
          show: false
        },
        {
          title: 'Profile',
          icon: 'mdi-account',
          items: [{ title: 'List Item' }]
        },
        {
          title: 'Campaign Manager',
          icon: 'mdi-shape',
          items: [{ title: 'List Item' }]
        },
        {
          title: 'Trainings',
          icon: 'mdi-whistle',
          items: [{ title: 'List Item' }]
        },
        {
          title: 'Transcript',
          icon: 'mdi-school',
          items: [{ title: 'List Item' }]
        },
        {
          title: 'Vishing',
          icon: 'mdi-bag-personal',
          items: [{ title: 'List Item' }]
        },
        {
          id: 1,
          title: 'Phishing Simulator', // mnPhishing
          icon: 'mdi-email',
          items: [
            {
              id: 5,
              title: 'List Item',
              show: false
            }
          ]
        },
        {
          title: 'Avaranes Educator', // mnTraining
          icon: 'mdi-book',
          items: [{ title: 'List Item' }]
        },
        {
          title: 'Email Threat Simulator',
          icon: 'mdi-earth',
          items: [{ title: 'List Item' }]
        },
        {
          title: 'Threat Intelligence',
          icon: 'mdi-security',
          items: [{ title: 'List Item' }]
        },
        {
          title: 'Incident Responder',
          icon: 'mdi-flash',
          items: [{ title: 'List Item' }]
        },
        {
          title: 'Threat Sharing',
          icon: 'mdi-flag'
        },
        {
          title: 'Report Manager',
          icon: 'mdi-poll-box',
          items: [{ title: 'List Item' }]
        },
        {
          title: 'Company',
          icon: 'mdi-briefcase',
          items: [{ title: 'List Item' }]
        },
        {
          title: 'Advanced Settings',
          icon: 'mdi-cog',
          items: [{ title: 'List Item' }]
        }
      ],
      breadcrumbs: [
        {
          text: 'Keepnet Labs',
          disabled: true,
          exact: false,
          href: '/'
        },
        {
          text: 'Incident Responder',
          disabled: true,
          exact: false,
          href: '/'
        },
        {
          text: 'Threat Sharing',
          disabled: true,
          exact: false,
          href: '/threat-sharing'
        },
        {
          text: 'Incident Responder',
          disabled: true,
          exact: false,
          href: '/incident-responder'
        },
        {
          text: 'Analysis Details',
          disabled: true,
          exact: false,
          href: '/analysis-details'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      getMenuStatus: 'common/getMenuStatus',
      getErrors: 'common/getErrors',
      getColor: 'common/getColor',
      snackbars: 'common/getSnackBars',
      isFeedbackPopupOpened: 'dashboard/isPopupOpened',
      isSessionExpired: 'dashboard/getIsSessionExpired',
      getTourData: 'tour/getTourData',
      isTourActive: 'tour/isTourActive',
      menuList: 'dashboard/getMenuList',
      isSwitchDialogOpen: 'dashboard/getIsSwitchDialogOpen',
      notificationList: 'dashboard/getNotificationList',
      isLoadingFromStore: 'common/getIsLoading'
    }),
    communityName() {
      return (
        this.$store.state.threadSharing.selectedCommunity.name ||
        localStorage.getItem('communityName')
      )
    },
    routerName() {
      return this.$route.name
    },
    getDrawer: {
      get() {
        if (this.drawer == null) {
          if (window.outerWidth > 768) {
            return true
          }
          return false
        }
        return this.drawer
      },
      set(newValue) {
        this.drawer = newValue
      }
    },
    getMini: {
      get() {
        if (this.mini == null) {
          if (window.outerWidth > 768) {
            return false
          }
          return false
        }
        return this.mini
      },
      set(newValue) {
        this.mini = newValue
      }
    },
    feedbackdialog: {
      get() {
        return this.isFeedbackPopupOpened
      },
      set(newValue) {
        this.changeFeedbackPopup(newValue)
      }
    },
    switchDialog: {
      get() {
        return this.isSwitchDialogOpen
      },
      set(newValue) {
        this.setSwitchDialog(newValue)
      }
    },
    getUnreadMessages() {
      return this.notificationList.filter(x => x.isSeen == false).length
    },
    getFullName() {
      if (this.$store.state.auth.user == undefined) {
        return ''
      }
      return this.$store.state.auth.user.fullName
    },
    getCompanyName() {
      if (this.$store.state.auth.companyName == undefined) {
        return ''
      }
      return this.$store.state.auth.companyName
    },
    getRolename() {
      if (this.$store.state.auth.userRoleName == undefined) {
        return ''
      }
      return this.$store.state.auth.userRoleName
    },
    getDrawerPadding2() {
      if (window.outerWidth > 768) {
        if (this.mini) {
          return 'left: 5px !important;'
        }
        return 'left : 232px !important;'
      }
      if (this.drawer) {
        return 'left: 232px !important;'
      }
      return 'left : 262px !important;'
    },
    getDrawerPadding() {
      // eslint-disable-line
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 'left : 278px;'
        case 'sm':
          return 'left : 278px;'
        case 'md':
          return 'left : 278px;' // 46
        case 'lg':
          return 'left : 232px;'
        case 'xl':
          return 'left : 232px;'
      }
    },
    isLoading: {
      get() {
        return this.isLoadingFromStore
      },
      set() {}
    }
  },
  watch: {
    getTourData(payload) {
      if (payload['4'] == true || payload['5'] == true) {
        if (window.outerWidth > 778) {
          this.getDrawer = true
          this.getMini = false
        } else {
          this.getMini = false
          this.getDrawer = true
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (AuthenticationService.isAuthenticated()) {
        this.getMenus()
        this.getCurrentUser()
        this.getNotifications()
        this.interval = setInterval(() => {
          if (!this.isDisconnected) {
            clearInterval(this.interval)
          }
          this.sessionCheck = AuthenticationService.isExpired()
        }, 20000)
      }
    })
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    ...mapActions({
      getCurrentUser: 'auth/getCurrentUser'
    }),
    changeSnackbarStatus(value, snackbar) {
      this.$store.dispatch('common/closeSnackBar', snackbar)
    },
    onNotificationSeen(notification) {
      notification.isSeen = true
      this.notificationSeen(notification)
    },
    getSnackBarStyle(message, index) {
      const messageLength = message.trim().length
      const styleObj = {}
      if (index >= 1) {
        styleObj['bottom'] = `${65 * index}px`
        if (window.outerWidth <= 580) {
          styleObj['bottom'] = `${75 * index}px`
        }
      } else {
        styleObj['bottom'] = '5px'
      }
      if (messageLength > 40 && messageLength < 60) {
        styleObj['width'] = '580px'
      } else if (messageLength > 60) {
        styleObj['width'] = '580px'
      } else {
        styleObj['width'] = '480px'
      }
      if (window.outerWidth <= 580) {
        styleObj['width'] = '95%'
      }
      return styleObj
    },
    getFormattedDate() {
      const date1 = new Date('2019-10-24T08:41:23.927')
      return `${date1.toDateString().split(' ')[2]} ${date1.toDateString().split(' ')[0]}`
    },
    changeDropdownItem2(item) {
      if (item.text == 'Tour' && this.routerName === 'Dashboard') {
        this.$tours.myTour.start()
        this.setTourStatus(true)
      } else if (item.text == 'Feedback') {
        this.feedbackdialog = true
      }
    },
    changeDropdownItem(item) {
      if (item.text == 'Logout') {
        this.logoutUser()
        //this.$router.push('/login')
      }
    },
    ...mapActions({
      setSnackStatus: 'common/setSnackStatus',
      changeFeedbackPopup: 'dashboard/changeFeedbackPopup',
      setTourStatus: 'tour/setTourStatus',
      getMenus: 'dashboard/getMenus',
      logoutUser: 'dashboard/logoutUser',
      getNotifications: 'dashboard/getNotifications',
      setSwitchDialog: 'dashboard/setSwitchDialog',
      notificationSeen: 'dashboard/notificationSeen'
    }),
    onIUndestandClick(data) {
      this.isDisconnected = data
    },
    handleConnectivityChange(status) {
      this.isDisconnected = !!status
      return this.isDisconnected
    },
    onNavigationClick() {
      if (window.outerWidth > 778) {
        this.getDrawer = true
        this.getMini = !this.getMini
      } else {
        this.getMini = false
        this.getDrawer = !this.getDrawer
      }
    },
    isMobile() {
      if (
        window.outerWidth < 1025 ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPad Pro/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i)
      ) {
        return false
      }
      return true
    }
  }
}
</script>
<style lang="scss">
header.header-container {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  @media only screen and (max-width: 1025px) {
    left: 0 !important;
  }
}

::v-deep .z_index_custom_1 {
  z-index: 99999 !important;
}

.tour-five {
  left: 210px;
  top: 77px;
}

.tour-six {
  left: 210px;
  top: 244px;
}

.tour-btn-container {
  cursor: pointer;
  position: absolute;
  width: 48px;
  height: 48px;
  display: flex;

  .tour-btn-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: solid 1px #e5f1ff;
    margin-top: 10px;

    .tour-btn-circle {
      border-radius: 50%;
      width: 32px;
      height: 32px;
      background-color: #e5f1ff;
      display: flex;
      align-items: center;
      justify-content: center;

      .tour-btn-circle-inner {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: #b3d4fc;
      }
    }
  }
}

.v-list-item--active > .v-list-item__icon,
.menu-list-item > .v-list-item__icon {
  margin-right: 16px !important;
  margin-bottom: 12px !important;
  margin-top: 12px !important;

  i {
    font-size: 22px !important;
  }
}

.menu-list-item {
  ::v-deep .v-list-item__title {
    line-height: 1.2rem !important;
  }
}

.footer-designedby {
  height: 17px;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 12px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #000000;
}

.footer-copyright {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 12px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #000000;
}

.footer-links {
  align-items: center;
  display: flex;

  a {
    height: 19px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.58;
    letter-spacing: normal;
    color: #000;
    text-decoration: none;
    padding: 0 16px;
  }
}

// End Footer

// Notification
.v-menu__content {
  border-radius: 20px;
}

.notification-confirmation-buttons {
  position: absolute;
  bottom: -20px;
  right: 1px;
}

.notification-date-time {
  height: 17px;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 12px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.54);
}

.notification-wrapper {
  width: 306px;
  max-height: 520px;
  border-radius: 20px;
  box-shadow: 0 8px 10px -3px rgba(80, 80, 80, 0.14), 0 2px 4px 0 rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(80, 80, 80, 0.12);
  background-color: white;
  padding-left: 26px;
  padding-right: 26px;
  padding-top: 26px;
  padding-bottom: 26px;
  overflow: auto;
}

.notification-content {
  cursor: pointer;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  min-height: 60px;
}

.notification-title {
  width: 246px;
  max-height: 60px;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.notification-light {
  margin-top: 7px;
  width: 8px;
  height: 8px;
  background-color: #409eff;
  position: absolute;
  right: 0;
  top: -2px;
  border-radius: 50%;
}

.notification-light-off {
  display: none;
}

//Notification end
.v-cart-icon-wrapper {
  color: red;
}

.breadcrumb-wrapper {
  font-size: 12px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(255, 255, 255, 1);
  text-align: right;

  ::v-deep .v-breadcrumbs__item {
    color: white;
  }

  .bread-last-step {
    color: rgba(255, 255, 255, 0.7);
  }
}

::v-deep .v-breadcrumbs li {
  font-size: 12px !important;
}

::v-deep .v-breadcrumbs li:nth-child(even) {
  padding: 0px 3px;
}

.user-name-dropdown-detail {
  -webkit-flex-direction: column;
  flex-direction: column !important;
  padding-top: 5px;

  span {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    display: block;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #2196f3;
    // border: solid red 1px;
  }
}

.user-name-dropdown {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
}

.user-name-dropdown-font {
  align-items: flex-start;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 20px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: rgba(0, 0, 0, 0.87);
  text-transform: capitalize !important;
  max-width: 240px;
  word-wrap: break-word;
  white-space: initial;
}

.user-wrapper {
  width: 237px;
  height: 87px;
  margin: 0 auto;
}

.logo-wrapper {
  margin-top: 56px;
  margin-bottom: 16px;
  margin-left: auto;
  margin-right: auto;
  width: 180px;
  height: 60px;
}

.v-navigation-drawer {
  min-width: 64px;
}

.v-navigation-drawer__content {
  .v-list-item {
    border-left: 5px solid transparent;
  }
}

.v-list-item--active {
  border-left: solid 5px !important;
  border-color: #2196f3 !important;
  color: #2196f3 !important;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
}

.active-link {
  .menu-item-wrapper {
    background-color: #e3f2fd !important;
    border-left: unset !important;
    border-color: unset !important;
  }
}

.active-link > div {
  border-left: solid 5px !important;
  border-color: #2196f3 !important;
  height: 48px;
  font-size: 16px;

  > div,
  .v-icon {
    color: #2196f3 !important;
    font-family: 'Open Sans', sans-serif !important;
  }
}

.search-wrapper {
  padding-top: 0;
  margin-right: 24px;

  .v-input__slot {
    background-color: rgba(255, 255, 255, 0.3) !important;
    min-height: 27px !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
  }

  .v-icon {
    font-size: 20px !important;
  }
}

.divider-header {
  margin-right: 14px;
  border-color: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.3);
  align-self: stretch;
  border: solid;
  border-width: 0 thin 0 0;
  display: -ms-inline-flexbox;
  display: inline-flex;
  margin-top: 8px;
  min-height: 25px;
  max-height: 25px;
  max-width: 0px;
  width: 0px;
  vertical-align: text-bottom;
}

.bell-badge-wrapper {
  width: 48px;
  height: 48px;
  align-items: center;
}

.v-toolbar__title {
  margin-left: 8px;
  font-size: 34px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: white;
  font-family: 'Open Sans', sans-serif !important;
}

.background {
  height: 285px;
  width: 100%;
  background-image: url('../assets/img/light.svg') !important;
  background-position: left top; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-size: cover;
  flex-flow: column !important;
  position: absolute;
}

.menu-icon-wrapper {
  left: 232px;
  top: 16px;
  position: fixed;
  z-index: 9;
  transition: all 0.2s ease-in-out;
}

.v-navigation-drawer {
  overflow: visible !important;
  z-index: 15;

  @media only screen and (max-width: 1025px) {
    position: fixed !important;
  }
}

.v-content {
  min-height: calc(100vh - 46px);

  @media only screen and (max-width: 1025px) {
    padding: 160px 0 0 65px !important;
  }
  @media only screen and (max-width: 769px) {
    padding: 160px 0 0 0 !important;
  }
}

header {
  @media only screen and (max-width: 1025px) {
    padding-left: 75px !important;
  }
  @media only screen and (max-width: 769px) {
    padding-left: 0 !important;
  }
}

.v-navigation-drawer--mini-variant {
  transition: all 0.2s ease-in-out;

  .logo-wrapper {
    margin-left: 8px;
  }

  .user-name-dropdown {
    visibility: hidden;
  }

  .menu-icon-wrapper {
    transition: all 0.2s ease-in-out;
    left: 45px !important;
  }

  .menu-mini-img {
    margin-left: 0 !important;
  }

  .v-app-bar__nav-icon {
    margin-left: 3px !important;
  }

  ::v-deep .v-list-group__header,
  ::v-deep .v-list-item--active {
    padding-left: 12px !important;
  }

  ::v-deep .v-list-item .v-list-item__icon,
  ::v-deep .v-list-group__header > .v-list-item__icon {
    margin-right: 0 !important;
  }
}

.svg-wrapper {
  position: absolute;
  display: inline-block;
  width: 2030px;
  overflow: hidden;
  height: 450px;
}

.svg-wrapper svg {
  position: center;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.Shape {
  margin-top: 10px;
  width: 24px;
  height: 16px;
  color: #2196f3;
}

.Oval-3 {
  box-shadow: 0 2px 10px 5px rgba(33, 150, 243, 0.2);
  background-color: #edf7fd;
}

.RoundedButton {
  border-radius: 50%;
  width: 51px;
  height: 51px;
}

.btn-custom {
  margin-left: 259px !important;
  margin-top: -50px;
  z-index: 9999;
  position: absolute;
  width: 50px;
  height: 50px;
}

.ButtonOriantation {
  padding: 0 auto;
  font-size: 32px;
}

::v-deep .v-dialog {
  overflow: hidden !important;
}

.v-navigation-drawer--mini-variant {
  .user-wrapper {
    height: 0 !important;
  }

  .menu-icon-wrapper {
    transition: all 0.2s ease-in-out;
    left: 0 !important;
  }

  .logo-wrapper {
    margin-left: 8px !important;
    margin-top: 110px !important;
  }

  .v-sheet--tile > div {
    margin-top: 5px !important;
    margin-left: 0 !important;
  }
}

.topbar-wrapper {
  justify-content: center !important;
  position: relative;
  width: 100%;
}

.placeholder-search {
  color: rgba(255, 255, 255, 0.87);
  font-size: 16px;
  font-family: 'Open Sans', sans-serif !important;
}

::v-deep .v-list-group .v-list-group__header .v-list-item__icon.v-list-group__header__append-icon {
  margin-left: 6px !important;
  min-width: 24px !important;
}

::v-deep .v-list-item__title {
  align-items: center;
  display: flex;
  font-family: 'Open Sans', sans-serif !important;

  i {
    padding-right: 16px;
  }
}

.menu-list-item > ::v-deep .v-list-item__title {
  font-size: 16px !important;
  line-height: 22px !important;
}

::v-deep .v-text-field--rounded > .v-input__control > .v-input__slot {
  width: 180px;
  height: 40px;
  padding-left: 12px !important;
}

::v-deep .theme--dark.v-breadcrumbs .v-breadcrumbs__item--disabled {
  color: rgba(255, 255, 255, 0.7) !important;
  font-weight: bold !important;
  font-size: 12px !important;
}

::v-deep .v-navigation-drawer__border {
  display: none !important;
}

::v-deep .v-list-group__header__prepend-icon {
  margin-right: 16px !important;
}

@media only screen and (max-width: 1025px) {
  .v-navigation-drawer {
    background-color: rgba(255, 255, 255, 1) !important;
    border-color: rgba(255, 255, 255, 1) !important;
  }
  .menu-icon-wrapper {
    transition: all 0.2s ease-in-out;
    box-shadow: unset !important;
  }
  .topbar-inline-wrapper {
    justify-content: space-between !important;
  }
}

@media only screen and (max-width: 500px) {
  ::v-deep .v-card,
  .v-card__text {
    padding: 8px !important;
  }
  .v-application .app-container {
    padding-bottom: 100px !important;
  }
  .search-wrapper,
  .divider-header {
    display: none !important;
  }
  .search-notification-wrapper {
    margin-top: 0;
  }
  .v-application .breadcrumb-wrapper {
    padding-top: 0 !important;
  }
  .v-application .topbar-inline-wrapper {
    margin-top: 0 !important;
  }
  ::v-deep .v-toolbar__content {
    align-items: flex-start;
    margin-top: 15px;
  }
  ::v-deep .v-toolbar__title {
    margin-top: 26px;
    padding-bottom: 7px;
  }
  ::v-deep .v-cart-icon-wrapper {
    width: 40px;
    height: 40px;
    margin-right: 10px !important;

    .v-icon {
      font-size: 19px !important;
    }

    .v-card-headline {
      font-size: 19px !important;
    }
  }
  ::v-deep .v-footer {
    height: 200px !important;
  }
}

.menu-mini-img {
  max-width: 64px;
  max-height: 60px;
  margin-left: 8px;
}

.menu-link-default {
  text-decoration: none;
}

.help-wrapper {
  padding-left: 30px;
}

.search-notification-wrapper {
  .v-toolbar__content .v-btn.v-btn--icon.v-size--default {
    height: 44px !important;
  }
}

.notification-bell {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 44px;
  height: 44px;
}

.manuel-badge {
  width: 18px !important;
  min-width: 18px !important;
  height: 18px !important;
  top: 3px !important;
  right: 5px !important;
  align-items: center;
  display: flex;
  justify-content: center;
  background-color: red;
  border-radius: 50%;
  position: absolute;

  span {
    font-size: 11px;
  }
}

.header-container > ::v-deep .v-toolbar__content {
  padding-bottom: 0 !important;
  padding-top: 4px !important;
}

.breadcrumb-links {
  text-decoration: none !important;
  color: #fff !important;
  cursor: pointer;
}

@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  .v-cart-dropdown-list {
    width: 160px !important;

    .v-list-item__title {
      margin-top: 10px !important;
    }
  }
}

.v-footer {
  align-items: center;
  display: flex;
  height: 47px;
  padding: 0 16px;
  position: absolute;
  bottom: -40px;
  width: 100%;
}

.footer {
  flex-wrap: wrap;
  @media only screen and (max-width: 1025px) {
    justify-content: center;
  }
}

.footer-item {
  flex: 1;

  &__primary {
    order: 1;
    flex-grow: 1;
    @media only screen and (max-width: 1025px) {
      flex-grow: 0;
      order: 3;
      padding: 0 25px;
    }
  }

  &__secondary {
    order: 2;
    @media only screen and (max-width: 1025px) {
      order: 1;
    }
  }

  &__third {
    order: 3;
    flex-grow: 1;
    @media only screen and (max-width: 1025px) {
      flex-grow: 0;
      order: 2;
    }
  }

  &__fourth {
    order: 4;
    @media only screen and (max-width: 1025px) {
      padding: 0 25px;
    }
  }
}

::v-deep
  .v-application--is-ltr
  .v-list-group--no-action
  > .v-list-group__items
  > div
  > .v-list-item {
  padding-left: 0 !important;
}

.menu-item-wrapper {
  line-height: 1.2 !important;
  border-radius: 23px;
  padding-left: 70px;
  height: 35px !important;
  margin-right: 30px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  cursor: pointer;

  .menu-item-span {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 13px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.54;
    letter-spacing: normal;
    color: #1565c0;
  }
}

.menu-with-item ::v-deep .v-list-item {
  align-items: center;
  display: flex;
  min-height: 48px !important;

  .v-list-item__icon:first-child {
    margin-top: 12px;
    margin-left: 0;

    i {
      font-size: 22px !important;
    }
  }
}

.active-menu-parent > ::v-deep .v-list-group__header {
  border-left: solid 5px !important;
  border-color: #2196f3 !important;

  .v-list-item__title {
    color: #2196f3 !important;
  }

  .v-list-item__icon > i {
    color: #2196f3 !important;
  }
}

.disabled-cursor,
button:disabled {
  cursor: no-drop !important;
  pointer-events: all !important;
}

::v-deep .switch-dialog {
  width: 600px !important;
  border-radius: 20px !important;
}

::v-deep .v-application--wrap {
  background-color: #fafafa !important;
}

.help-menu {
  left: unset !important;
  right: 0 !important;
  top: 56px !important;
  min-width: 200px !important;
  width: 200px !important;
}

.notification-menu {
  left: unset !important;
  right: 0 !important;
  top: 56px !important;
  min-width: 300px !important;
  width: 300px !important;
}

::v-deep .v-snack__wrapper {
  width: 100%;
}

::v-deep .v-snack__content {
  padding: 12px 16px;
}

.snackbar {
  &__left-column {
    display: flex;
    align-items: center;
    flex-basis: 85%;
  }

  &__right-column {
  }

  &__message {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: #ffffff;
  }

  &__action {
    text-decoration: none;
    color: white;
    margin-right: 5px;

    ::v-deep .v-btn__content {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      color: #ffffff;
    }

    ::v-deep .v-btn {
      height: 36px !important;
    }
  }
}

::v-deep .v-snack {
  @media (max-width: 580px) {
    width: 95% !important;
  }
}
</style>
