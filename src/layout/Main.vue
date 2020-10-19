<template>
  <v-app class="layout-container">
    <app-snackbar />
    <app-dialog :status="openPasswordChange" icon="mdi-lock" title="Change Password" size="big">
      <template v-slot:app-dialog-body>
        <v-card-text class="password-modal">
          <div v-if="newPasswordError" class="login-error-container">
            <div v-if="newPasswordError" class="login-error-wrapper">
              <div class="login-error-icon dark pr-2">
                <v-icon dark large color="#f56c6c">mdi-close-circle</v-icon>
              </div>
              <div class="login-error-message pr-1">
                {{ newPasswordErrorText }}
              </div>
            </div>
          </div>
          <div class="new-password-wrapper">
            <v-row align="center" justify="center">
              <v-col sm="12" class="p-0">
                <v-form ref="newPasswordByMain">
                  <div>
                    <label class="new-password-wrapper__label mb-2">Current Password</label>
                    <v-text-field
                      v-model="currentPassword"
                      label="Current password"
                      class="reset-pass-textfield mb-6"
                      :rules="[rules.required]"
                      @click="newPasswordError = false"
                      outlined
                      hint="At least 8 characters with 1 capital letter, 1 lowercase letter and 1 number"
                      :append-icon="show1 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                      :type="show1 ? '' : 'password'"
                      @click:append="show1 = !show1"
                      autocomplete="disabled"
                    ></v-text-field>
                  </div>
                  <div>
                    <label class="new-password-wrapper__label mb-2">New Password</label>
                    <v-text-field
                      v-model="newPassword"
                      label="Enter new password"
                      class="reset-pass-textfield mb-6"
                      :rules="[rules.required, rules.minPassword, rules.equal]"
                      @click="newPasswordError = false"
                      outlined
                      hint="At least 8 characters with 1 capital letter, 1 lowercase letter and 1 number"
                      :append-icon="show2 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                      :type="show2 ? '' : 'password'"
                      @click:append="show2 = !show2"
                      autocomplete="disabled"
                    ></v-text-field>
                  </div>
                  <div>
                    <PasswordChecker :password="newPassword" />
                  </div>
                  <div>
                    <label class="new-password-wrapper__label mb-2">Confirm Password</label>
                    <v-text-field
                      v-model="reNewPassword"
                      :rules="[rules.required, rules.minPassword, rules.equal]"
                      label="Enter new password again"
                      class="reset-pass-textfield"
                      @click="newPasswordError = false"
                      outlined
                    ></v-text-field>
                  </div>
                </v-form>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </template>
      <template v-slot:app-dialog-footer>
        <div class="d-flex download-buttons flex-row flex-wrap justify-end">
          <v-btn text color="#f56c6c" class="k-dialog__button" @click="openPasswordChange = false"
            >CANCEL</v-btn
          >
          <v-btn text color="#2196f3" class="k-dialog__button" @click="changePassword"
            >CONFIRM</v-btn
          >
        </div>
      </template>
    </app-dialog>
    <v-dialog v-model="feedbackdialog" :width="600">
      <feedback-popup v-on:closePopUp="feedbackdialog = $event"></feedback-popup>
    </v-dialog>
    <v-overlay :z-index="15" :value="isTourActive"></v-overlay>
    <tour-widget></tour-widget>
    <v-overlay :value="isLoadingFromStore > 0" :z-index="9999999">
      <div class="text-center">
        <v-progress-circular :size="50" color="primary" indeterminate />
      </div>
    </v-overlay>
    <v-row justify="center">
      <v-dialog v-model="switchDialog" content-class="switch-dialog" width="600">
        <switch-account></switch-account>
      </v-dialog>
    </v-row>
    <v-overlay :absolute="false" :opacity="0.46" :value="sessionCheck" :z-index="999">
      <session-expired></session-expired>
    </v-overlay>
    <v-overlay absolute :opacity="0.46" :value="!isDisconnected" :z-index="99999">
      <div class="connection-lost-wrapper">
        <connection-lost v-on:onIUnderstand="onIUndestandClick($event)"></connection-lost>
      </div>
    </v-overlay>
    <div class="layout-container__background"></div>

    <v-navigation-drawer
      color="rgba(255, 255, 255, 0.9)"
      app
      width="270"
      v-model="getDrawer"
      :mini-variant.sync="getMini"
      transition="scale-transition"
      :mobile-break-point="767"
      permanent
      touchless
      class="page-nav"
      :class="{ 'bg-blur': sessionCheck }"
    >
      <v-app-bar-nav-icon
        class="page-nav__menu-toggle menu-icon-wrapper"
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
        <div class="page-nav__logo-wrapper">
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
          <offline @detected-condition="handleConnectivityChange" :ping-url="baseUrl">
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
          :class="{
            'primary--text active-menu-parent':
              routerName === 'Company' ||
              routerName === 'Target Users' ||
              routerName === 'Companies' ||
              routerName === 'Company Settings' ||
              routerName === 'System Users',
            'un-selected-list-item':
              routerName !== 'Company' ||
              routerName === 'Target Users' ||
              routerName === 'Companies' ||
              routerName === 'Company Settings' ||
              routerName === 'System Users'
          }"
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
          <v-list-item style="padding-left: 0 !important; margin-left: -5px;">
            <v-list-item-content class="menu-item-content">
              <router-link to="/companies" class="menu-link-default">
                <v-list-item-title class="menu-item-wrapper">
                  <span class="menu-item-span">Companies</span>
                </v-list-item-title>
              </router-link>
            </v-list-item-content>
          </v-list-item>
          <v-list-item style="padding-left: 0 !important; margin-left: -5px;">
            <v-list-item-content class="menu-item-content">
              <router-link to="/company-settings" class="menu-link-default">
                <v-list-item-title class="menu-item-wrapper">
                  <span class="menu-item-span">Company Settings</span>
                </v-list-item-title>
              </router-link>
            </v-list-item-content>
          </v-list-item>
          <v-list-item style="padding-left: 0 !important; margin-left: -5px;">
            <v-list-item-content class="menu-item-content">
              <router-link to="/system-users" class="menu-link-default">
                <v-list-item-title class="menu-item-wrapper">
                  <span class="menu-item-span">System Users</span>
                </v-list-item-title>
              </router-link>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-group
          prepend-icon="mdi-flash"
          no-action
          class="menu-with-item menu-link-default"
          :class="{
            'primary--text active-menu-parent':
              routerName === 'Incident Responder' ||
              routerName === 'Investigations' ||
              routerName === 'Integrations' ||
              routerName === 'Playbook' ||
              routerName === 'Mail Configurations',
            'un-selected-list-item':
              routerName !== 'Incident Responder' ||
              routerName === 'Investigations' ||
              routerName === 'Integrations' ||
              routerName === 'Playbook' ||
              routerName === 'Mail Configurations'
          }"
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
              <router-link to="/investigations" class="menu-link-default">
                <v-list-item-title class="menu-item-wrapper">
                  <span class="menu-item-span">Investigations</span>
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
          <v-list-item style="padding-left: 0 !important; margin-left: -5px;">
            <v-list-item-content class="menu-item-content">
              <router-link to="/mailConfiguration" class="menu-link-default">
                <v-list-item-title class="menu-item-wrapper">
                  <span class="menu-item-span">Mail Configurations</span>
                </v-list-item-title>
              </router-link>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <router-link to="/phishing-reporter" class="menu-link-default">
          <v-list-item class="menu-list-item">
            <v-list-item-icon>
              <v-icon>mdi-account-voice</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Phishing Reporter</v-list-item-title>
          </v-list-item>
        </router-link>
        <router-link
          to="/grapesjs"
          class="menu-link-default"
          v-if="isGrapesDebug || routerName === 'Grapes'"
        >
          <v-list-item class="menu-list-item">
            <v-list-item-icon>
              <v-icon>mdi-account-voice</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Grapes JS</v-list-item-title>
          </v-list-item>
        </router-link>
      </v-list>
    </v-navigation-drawer>
    <!-- Header Begin -->
    <v-app-bar
      class="page-header elevation-0 transparent"
      extension-height="100"
      app
      absolute
      flat
      :class="{ 'bg-blur': sessionCheck }"
    >
      <account-dropdown />
      <v-spacer />
      <v-menu
        offset-y
        min-width="300"
        max-width="300"
        max-height="520"
        :close-on-content-click="false"
        transition="scale-transition"
      >
        <template v-slot:activator="{ on }">
          <v-btn icon color="white" v-on="on">
            <div class="notification-bell">
              <v-icon color="white">mdi-bell</v-icon>
              <span v-if="getUnreadMessages > 0" class="manuel-badge">
                {{ getUnreadMessages }}
              </span>
            </div>
          </v-btn>
        </template>
        <v-list>
          <v-list-item-group>
            <div v-if="!notificationList.length" class="no-notification">No notifications</div>
            <template
              v-for="(notification, index) in notificationList"
              v-if="notificationList.length"
            >
              <v-list-item :key="index">
                <v-list-item-content>
                  <v-list-item-title>{{ notification.content }}</v-list-item-title>
                  <v-list-item-subtitle
                    >{{ getFormattedDate(notification.date) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action v-if="notification.isSeen === false">
                  <v-btn
                    :key="index"
                    v-on:click="onNotificationSeen(notification)"
                    v-ripple="false"
                    icon
                  >
                    <v-icon x-small color="#409eff">mdi-circle</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-divider v-if="index + 1 < notificationList.length" :key="index" />
            </template>
          </v-list-item-group>
        </v-list>
      </v-menu>

      <v-menu min-width="200" max-width="200" offset-y transition="scale-transition">
        <template v-slot:activator="{ on }">
          <v-btn icon color="white" v-on="on">
            <v-icon>mdi-help-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in rightDropdownData"
            :key="index"
            @click="changeDropdownItem2(item)"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>

      <template v-slot:extension>
        <div class="page-header__content">
          <div class="page-header__title">
            <h1 v-if="routerName === 'Community'">
              <router-link
                :to="`/threat-sharing?detailsId=${communityId}`"
                v-if="communityId"
                class="page-header__title-link text-decoration-none"
                >{{ communityName || $route.params.name }}</router-link
              ><span v-else>{{ communityName || $route.params.name }}</span>
            </h1>
            <h1 v-else-if="routerName === 'Company Group Details'">
              {{ companyGroupName || $route.params.name }}
            </h1>
            <h1 v-else>{{ routerName }}</h1>
          </div>

          <div class="page-header__breadcrumb">
            <router-link class="breadcrumb-links" to="/">
              {{ companyName || 'Company' }}
            </router-link>

            <router-link
              class="breadcrumb-links"
              to="/threat-sharing"
              v-if="routerName === 'Community'"
            >
              <v-icon style="color: #fff; font-size: 16px;">mdi-chevron-right</v-icon>
              {{ breadcrumbs[2].text }}
            </router-link>

            <router-link
              class="breadcrumb-links"
              to="/threat-sharing"
              v-if="routerName === 'Incident Responder'"
            >
              <v-icon style="color: #fff; font-size: 16px;">mdi-chevron-right</v-icon>
              {{ breadcrumbs[3].text }}
              <v-icon style="color: #fff; font-size: 16px;">mdi-chevron-right</v-icon>
              Dashboard
            </router-link>

            <router-link
              class="breadcrumb-links"
              to="/integrations"
              v-if="routerName === 'Integrations'"
            >
              <v-icon style="color: #fff; font-size: 16px;">mdi-chevron-right</v-icon>
              {{ breadcrumbs[3].text }}
            </router-link>

            <router-link
              class="breadcrumb-links"
              to="/phishing-reporter"
              style="display: flex; align-items: center;"
              v-if="routerName === 'Phishing Reporter'"
            >
              <v-icon style="color: #fff; font-size: 16px;">mdi-chevron-right</v-icon>
              Phishing Reporter
            </router-link>
            <router-link
              class="breadcrumb-links"
              to="/playbook"
              style="display: flex; align-items: center;"
              v-if="routerName === 'Playbook'"
            >
              <v-icon style="color: #fff; font-size: 16px;">mdi-chevron-right</v-icon>
              {{ breadcrumbs[1].text }}
              <v-icon style="color: #fff; font-size: 16px;">mdi-chevron-right</v-icon>
              Playbook
            </router-link>

            <router-link
              class="breadcrumb-links"
              to="/mailConfiguration"
              style="display: flex; align-items: center;"
              v-if="routerName === 'MailConfiguration'"
            >
              <v-icon style="color: #fff; font-size: 16px;">mdi-chevron-right</v-icon>
              {{ breadcrumbs[1].text }}
            </router-link>

            <router-link
              class="breadcrumb-links"
              to="/incident-responder"
              v-if="routerName === 'Analysis Details'"
            >
              <v-icon style="color: #fff; font-size: 16px;">mdi-chevron-right</v-icon>
              {{ breadcrumbs[3].text }}
            </router-link>

            <router-link
              class="breadcrumb-links"
              to="/investigations"
              v-if="routerName === 'Investigation Details'"
            >
              <v-icon style="color: #fff; font-size: 16px;">mdi-chevron-right</v-icon>

              Investigations
            </router-link>

            <router-link
              v-if="routerName === 'Target Users'"
              :to="$route.path"
              class="bread-last-step breadcrumb-links"
            >
              <v-icon style="color: #fff; font-size: 16px;">mdi-chevron-right</v-icon>

              Company
            </router-link>
            <router-link
              v-if="routerName === 'Companies'"
              :to="$route.path"
              class="bread-last-step breadcrumb-links"
            >
              <v-icon style="color: #fff; font-size: 16px;">mdi-chevron-right</v-icon>

              Company
            </router-link>
            <router-link
              v-if="routerName === 'Company Settings'"
              :to="$route.path"
              class="bread-last-step breadcrumb-links"
            >
              <v-icon style="color: #fff; font-size: 16px;">mdi-chevron-right</v-icon>

              Company
            </router-link>

            <router-link
              v-if="routerName === 'Investigations'"
              :to="$route.path"
              class="bread-last-step breadcrumb-links"
            >
              <v-icon style="color: #fff; font-size: 16px;">mdi-chevron-right</v-icon>

              Incident Responder > {{ routerName }}
            </router-link>
            <v-icon
              v-if="
                routerName !== 'Incident Responder' &&
                routerName !== 'Investigations' &&
                routerName !== 'Playbook' &&
                routerName !== 'Phishing Reporter'
              "
              style="color: #fff; font-size: 16px;"
              >mdi-chevron-right
            </v-icon>
            <router-link
              v-if="
                routerName !== 'Incident Responder' &&
                routerName !== 'Investigations' &&
                routerName !== 'Playbook' &&
                routerName !== 'Phishing Reporter'
              "
              :to="$route.path"
              class="bread-last-step breadcrumb-links"
              >{{ routerName }}
            </router-link>
          </div>
        </div>
      </template>
    </v-app-bar>
    <!-- Header End -->
    <v-content
      :style="getMini ? 'padding-left: 63px' : 'padding-left: 270px'"
      :class="{ 'bg-blur': sessionCheck }"
    >
      <v-container fluid style="height: 100%;" class="app-container ml-0 pa-0 pt-2 mr-0">
        <router-view />
      </v-container>
      <app-footer />
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
import AppFooter from './AppFooter'
import AppSnackbar from './AppSnackbar'
import AuthenticationService from '../services/authentication'
import 'grapesjs/dist/css/grapes.min.css'
import 'grapesjs-preset-webpage/dist/grapesjs-preset-webpage.min.css'
import 'grapesjs-preset-newsletter/dist/grapesjs-preset-newsletter.css'
import AppDialog from '../components/AppDialog'
import PasswordChecker from '../components/Common/PasswordChecker/PasswordChecker'
import { updatePassword } from '../api/auth'
import { COMMON_CONSTANTS } from '../model/constants/commonConstants'

export default {
  name: 'Main',
  components: {
    FeedbackPopup,
    AppFooter,
    AccountDropdown,
    ConnectionLost,
    SessionExpired,
    SwitchAccount,
    offline,
    TourWidget,
    AppSnackbar,
    AppDialog,
    PasswordChecker
  },
  data() {
    return {
      currentPassword: null,
      show1: false,
      show2: false,
      newPasswordError: null,
      newPasswordErrorText: null,
      newPassword: null,
      reNewPassword: null,
      openPasswordChange: false,
      communityId: null,
      baseUrl: null,
      communityName: null,
      companyGroupName: null,
      companyGroupResourceId: null,
      rules: {
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        min: (v) => v.length >= 8 || 'Minimum 8 characters',
        max: (v) => v.length < 254 || 'Email address cannot exceed 254 characters',
        required: (value) => !!value || 'Required.',
        minPassword: (value) => {
          const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/
          return pattern.test(value) || "Password doesn't match with the password criteria"
        },
        equal: (v) => v === this.newPassword || "'New password' and 'Confirm password' do not match"
      },

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
          text: 'Dashboard',
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
      isFeedbackPopupOpened: 'dashboard/isPopupOpened',
      isSessionExpired: 'dashboard/getIsSessionExpired',
      getTourData: 'tour/getTourData',
      isTourActive: 'tour/isTourActive',
      menuList: 'dashboard/getMenuList',
      isSwitchDialogOpen: 'dashboard/getIsSwitchDialogOpen',
      notificationList: 'dashboard/getNotificationList',
      isLoadingFromStore: 'common/getIsLoading',
      sessionCheck: 'common/getSessionCheck'
    }),
    companyName() {
      return localStorage.getItem('selectedCompanyName') || localStorage.getItem('companyName')
    },
    routerName() {
      return this.$route.name
    },
    isGrapesDebug() {
      return this.$route.query.grapesDemo === 'true'
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
          if (window.outerWidth > 767) {
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
      return this.notificationList.filter((x) => x.isSeen == false).length
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
      if (window.outerWidth > 767) {
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
        default:
          return ''
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
    this.baseUrl = `${window.location.origin}`
    this.$nextTick(() => {
      if (AuthenticationService.isAuthenticated()) {
        //this.getMenus()
        this.getCurrentUser() //@arda login
        //this.getNotifications()
        this.interval = setInterval(() => {
          if (!this.isDisconnected) {
            clearInterval(this.interval)
          }
          //this.sessionCheck = AuthenticationService.isExpired()
        }, 20000)
      }
    })
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  updated() {
    this.getCommunityName()
    this.routerName === 'Company Group Details' && this.getCompanyGroupName()
  },
  methods: {
    ...mapActions({
      getCurrentUser: 'auth/getCurrentUser'
    }),

    changePassword() {
      if (this.$refs.newPasswordByMain.validate()) {
        let payload = {
          CurrentPassword: this.currentPassword,
          NewPassword: this.newPassword,
          ConfirmNewPassword: this.reNewPassword
        }
        updatePassword(payload)
          .then((response) => {
            this.$store.dispatch('common/createSnackBar', {
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              message: 'Password has been changed successfully!'
            })
            this.openPasswordChange = false
          })
          .catch((error) => {})
      }
    },

    getCommunityName() {
      this.communityId = localStorage.getItem('communityResourceIdForRedirect')
      this.communityName = localStorage.getItem('communityName')
    },
    getCompanyGroupName() {
      this.companyGroupResourceId = localStorage.getItem('companyGroupResourceId')
      this.companyGroupName = localStorage.getItem('companyGroupName')
    },
    onNotificationSeen(notification) {
      notification.isSeen = true
      this.notificationSeen(notification)
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
      } else if (item.text === 'Change Password') {
        this.openPasswordChange = true
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
      notificationSeen: 'dashboard/notificationSeen',
      changeSessionExpiredStatus: 'common/changeSessionExpiredStatus'
    }),
    onIUndestandClick(data) {
      this.isDisconnected = data
    },
    handleConnectivityChange(status) {
      this.isDisconnected = !!status
      return this.isDisconnected
    },
    onNavigationClick() {
      if (window.outerWidth > 767) {
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
.layout-container {
  .no-notification {
    color: rgba(0, 0, 0, 0.54);
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    padding: 16px 24px;
  }
  &__background {
    height: 285px;
    width: 100%;
    background-image: url('../assets/img/light.svg');
    background-position: left top; // Center the image
    background-repeat: no-repeat; // Do not repeat the image
    background-size: cover;
    flex-flow: column !important;
    position: absolute;
  }
  .page-header {
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding-right: 16px;
    padding-top: 8px;
    &__search {
      width: 180px;
      .v-text-field {
        line-height: 28px;
        color: #fff;
        .v-input__control {
          font-size: 16px;
          .v-input__slot {
            background-color: rgba(255, 255, 255, 0.3);
            border-radius: 20px;
            padding: 0 14px;
            input {
            }
          }
        }
      }
    }

    &__divider {
      margin-left: 24px;
      margin-right: 16px;
      min-height: initial;
      max-height: initial;
      height: 24px;
      align-self: center;
      border-color: rgba(255, 255, 255, 0.3);
    }
    &__content {
      display: flex;
      //flex-direction: column;
      flex-flow: column;
      width: 100%;
      padding-left: 8px;
      margin-bottom: 1px;
      @media (max-width: 896px) {
        flex-direction: column;
        align-items: flex-start;
      }
    }
    &__title {
      margin-bottom: 6px;
      h1 {
        color: white;
        font-size: 34px;
        @media (max-width: 1024px) {
          font-size: 22px;
        }
        font-weight: bold;
        margin: 0;
      }
      &-link {
        color: white;
        font-size: 34px;
        font-weight: bold;
        margin: 0;
      }
    }
    &__breadcrumb {
      color: white;
      text-decoration: none;
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: bold;
      a {
        color: inherit;
        text-decoration: inherit;
        &:last-of-type {
          opacity: 0.7;
        }
      }
    }
  }
  .page-nav {
    overflow: visible;
    &__menu-toggle {
      left: 232px;
      top: 16px;
      position: fixed;
      z-index: 9;
      transition: all 0.2s ease-in-out;
      box-shadow: 0 2px 10px 5px rgba(33, 150, 243, 0.2);
      background-color: #edf7fd;
      margin-left: 16px;
    }
    &__logo-wrapper {
      margin: 56px auto 16px;
      width: 180px;
      height: 60px;
    }
    &.v-navigation-drawer--mini-variant {
      min-width: 64px;
      .page-nav__menu-toggle {
        transition: all 0.2s ease-in-out;
        margin-left: 0;
      }
      .page-nav__logo-wrapper {
        margin-left: 8px;
        margin-top: 110px;
      }
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
    .v-list-group .v-list-group__header .v-list-item__icon.v-list-group__header__append-icon {
      margin-left: 6px !important;
      min-width: 24px !important;
      margin-right: 1px !important;
    }

    .v-list-item__title {
      align-items: center;
      display: flex;
      font-family: 'Open Sans', sans-serif !important;

      i {
        padding-right: 16px;
      }
    }

    .menu-list-item > .v-list-item__title {
      font-size: 16px !important;
      line-height: 22px !important;
    }

    .v-navigation-drawer__border {
      display: none !important;
    }

    .v-list-group__header__prepend-icon {
      margin-right: 16px !important;
    }
  }
}

.layout-container {
  .z_index_custom_1 {
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
  .page-nav {
    .v-list-item--active > .v-list-item__icon,
    .menu-list-item > .v-list-item__icon {
      margin-right: 16px !important;
      margin-bottom: 12px !important;
      margin-top: 12px !important;

      i {
        font-size: 22px !important;
      }
    }
  }

  .menu-list-item {
    .v-list-item__title {
      line-height: 1.2rem !important;
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
    display: flex;
    align-items: center;
    flex-direction: row-reverse;

    .pr-2 {
      display: flex;
      align-items: center;
    }

    .v-breadcrumbs__item {
      color: white;
    }

    .bread-last-step {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  .v-breadcrumbs li {
    font-size: 12px !important;
  }

  .v-breadcrumbs li:nth-child(even) {
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
    background-position: left top; // Center the image
    background-repeat: no-repeat; // Do not repeat the image
    background-size: cover;
    flex-flow: column !important;
    position: absolute;
  }

  .menu-icon-wrapper {
    left: 232px;
    top: 16px;
    position: fixed;
    z-index: 20;
    transition: all 0.2s ease-in-out;
  }

  .v-navigation-drawer {
    overflow: visible !important;
    z-index: 12;

    @media only screen and (max-width: 1025px) {
      position: fixed !important;
    }
  }

  .v-content {
    // min-height: calc(100vh - 46px);
    height: 100%;
    @media only screen and (max-width: 1025px) {
      padding: 160px 0 0 65px !important;
    }
    @media only screen and (max-width: 769px) {
      padding: 160px 0 0 60px !important;
    }
  }

  header {
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

    .v-list-group__header,
    .v-list-item--active {
      padding-left: 12px !important;
    }

    .v-list-item .v-list-item__icon,
    .v-list-group__header > .v-list-item__icon {
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

  .v-dialog {
    //overflow: hidden !important;
  }

  .v-navigation-drawer--mini-variant {
    .user-wrapper {
      height: 0 !important;
    }

    .v-sheet--tile > div {
      margin-top: 5px !important;
      margin-left: 0 !important;
    }
  }

  @media only screen and (max-width: 1025px) {
    .v-navigation-drawer {
      background-color: rgba(255, 255, 255, 1) !important;
      border-color: rgba(255, 255, 255, 1) !important;
    }
  }

  @media only screen and (max-width: 500px) {
    .v-card,
    .v-card__text {
      // padding: 8px !important;
    }
    .v-cart-icon-wrapper {
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
  }

  .menu-mini-img {
    max-width: 64px;
    max-height: 60px;
    margin-left: 8px;
  }

  .menu-link-default {
    text-decoration: none;
  }
  /*
  .help-wrapper {
    padding-left: 30px;
  }

  .search-notification-wrapper {
    .v-toolbar__content .v-btn.v-btn--icon.v-size--default {
      height: 44px !important;
    }
  }
*/

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
  /*
    .header-container > ::v-deep .v-toolbar__content {
      padding-bottom: 0 !important;
      padding-top: 4px !important;
    }

    .breadcrumb-links {
      text-decoration: none !important;
      color: #fff !important;
      cursor: pointer;
    }
  */
  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    .v-cart-dropdown-list {
      width: 160px !important;

      .v-list-item__title {
        margin-top: 10px !important;
      }
    }
  }

  /*
    .v-application--is-ltr
    .v-list-group--no-action
    > .v-list-group__items
    > div
    > .v-list-item {
    padding-left: 0 !important;
  }
*/
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
      color: #383b41 !important;
    }
  }

  .menu-with-item .v-list-item {
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

  .active-menu-parent > .v-list-group__header {
    border-left: solid 5px !important;
    border-color: #2196f3 !important;

    .v-list-item__title {
      color: #2196f3 !important;
    }

    .v-list-item__icon > i {
      color: #2196f3 !important;
    }
  }

  /* .disabled-cursor,
  button:disabled {
    cursor: no-drop !important;
    pointer-events: all !important;
  }
*/
  .switch-dialog {
    width: 600px !important;
    border-radius: 20px !important;
  }

  .v-application--wrap {
    background-color: #fafafa !important;
  }
}
.password-modal {
  .new-password-wrapper {
    &__label {
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      padding: 0 15px;
      margin-bottom: 8px;
    }
  }
  .back-to-reset-password {
    display: flex;
    background-color: white;
    position: absolute;
    bottom: 24px;
    right: 24px;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    color: #2196f3;
    text-transform: uppercase;
    i {
      color: #2196f3;
    }
    cursor: pointer;
  }
  .reset-pass-textfield {
    padding: 0 15px !important;
  }
  .login-error-container {
    align-items: center;
    display: flex;
    justify-content: center;
    padding-bottom: 15px;
    width: 100%;
  }

  .login-error-wrapper {
    width: 300px;
    border-radius: 3px;
    background-color: rgba(245, 108, 108, 0.2);
    padding: 22px 16px;
    display: flex;
    flex-direction: row;

    .login-error-icon {
      i {
        font-size: 24px !important;
        margin-bottom: -1px;
      }
    }

    .login-error-message {
      align-self: center;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
    }
  }

  .reset-password-wrapper {
    .v-text-field.v-text-field--solo .v-input__control {
      min-height: 20px !important;
      padding: 0;
    }
    &__success {
      min-height: 300px;
    }
  }

  .forgot-password {
    align-items: center;
    text-decoration: none;
    color: black;
    cursor: pointer;
    font-size: 11px;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: rgba(0, 0, 0, 0.87);
  }

  .login-remember {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .v-input--checkbox {
      label.v-label.theme--light {
        font-size: 11px;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: rgba(0, 0, 0, 0.87) !important;
      }

      i.v-icon.notranslate.mdi.mdi-checkbox-blank-outline.theme--light {
        font-size: 20px !important;
      }

      i.v-icon.notranslate.mdi.mdi-checkbox-marked.theme--light.accent--text {
        font-size: 20px !important;
      }
    }
  }

  .mdi-eye-off-outline::before {
    color: rgba(0, 0, 0, 0.26);
  }

  .v-input {
    height: 40px !important;
  }

  .v-input .v-label {
    font-family: 'Open Sans', sans-serif;
    font-size: 12px;
    height: 20px;
    font-weight: 600;
  }

  .login-desc {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: rgba(0, 0, 0, 0.54);
    margin-bottom: 32px;
  }

  .login-title {
    margin-top: 88px;
    margin-bottom: 8px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 36px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #2196f3;
  }

  .v-sheet {
    border-radius: 20px;
  }

  .v-card-login-wrapper {
    border-radius: 20px !important;
    padding-top: 24px;
    padding-left: 24px;
    padding-right: 24px;
    padding-bottom: 80px;
  }

  .background {
    height: 100%;
    width: 100%;
    background-image: url('../assets/img/login-bg.svg') !important;
    background-position: left top; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: cover;
    flex-flow: column !important;
    position: absolute;
  }

  .v-input--selection-controls__ripple {
    margin-right: 0 !important;
    width: 20px !important;
    height: 20px !important;
    left: -5px !important;
    top: calc(50% - 17px) !important;
  }

  .remember-me-check {
    &.v-input--checkbox.v-input--selection-controls {
      margin-top: 0;
      padding-top: 0;
      height: auto !important;
    }
    padding-left: 5px;

    label {
      color: rgba(0, 0, 0, 0.87) !important;
      font-family: 'Open Sans', sans-serif !important;
      font-weight: 400 !important;
      font-size: 9px;
      left: -8px !important;
    }
  }

  .login-btn {
    height: 36px !important;
    min-width: 132px !important;
  }

  .captcha-wrapper {
    align-items: center;
    display: flex;
    justify-content: center;
    padding-bottom: 30px;
    width: 100%;
    margin-top: 16px;

    > div {
      max-width: 300px;
    }
  }

  .login-user-pass-wrapper > .row > div {
    max-width: 300px;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0px 1000px #fff inset;
    transition: background-color 5000s ease-in-out 0s;
  }

  .login-label {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
  }

  @media only screen and (max-width: 769px) {
    .login-card-wrapper {
      padding: 10px !important;
      padding-right: 16px !important;
    }
  }
}
.un-selected-list-item {
  color: rgba(0, 0, 0, 0.54);
  border-left: none !important;
  .v-list-item {
    border-left: 5px solid transparent !important;
    .v-list-group__header__prepend-icon {
      color: rgba(0, 0, 0, 0.54) !important;
    }
    .v-list-group__header__append-icon {
      color: rgba(0, 0, 0, 0.54) !important;
    }
  }
  .v-list-item__title {
    color: rgba(0, 0, 0, 0.87) !important;
  }
}
.layout-container .active-link .menu-item-wrapper .menu-item-span {
  color: #1565c0 !important;
  font-weight: 600;
}
</style>
