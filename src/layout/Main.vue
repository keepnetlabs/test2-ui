<template>
  <v-app class="layout-container">
    <app-snackbar />
    <v-dialog v-model="feedbackDialog" v-if="feedbackDialog" persistent :width="600">
      <feedback-popup></feedback-popup>
    </v-dialog>
    <SecurityModal
      v-if="openPasswordChange"
      :openPasswordChange="openPasswordChange"
      @changePasswordChange="changePasswordChange"
    />
    <SettingsModal
      v-if="showSettingsModalStatus"
      :showSettingsModalStatus="showSettingsModalStatus"
      @changeSettings="changeSettings"
    />
    <LeavingDialog />
    <v-overlay :value="isLoadingFromStore > 0" :z-index="9999999">
      <div class="text-center">
        <v-progress-circular :size="50" color="primary" indeterminate />
      </div>
    </v-overlay>
    <target-users-check-license-dialog
      v-if="showLicenseExceededDialog"
      :status="showLicenseExceededDialog"
      :dialogBody="getDialogBody"
      @close-overlay="handleCloseLicenseExceededDialog"
    />
    <v-row justify="center">
      <v-dialog
        :value="isSwitchDialogOpen"
        content-class="switch-dialog"
        width="600"
        @click:outside="setSwitchDialog(!isSwitchDialogOpen)"
        @keydown.esc="setSwitchDialog(false)"
      >
        <switch-account
          v-if="isSwitchDialogOpen"
          :navigatorMenuProps="navigatorMenuProps"
        ></switch-account>
      </v-dialog>
    </v-row>
    <v-overlay absolute :opacity="0.46" :value="!isDisconnected" :z-index="99999">
      <div class="connection-lost-wrapper">
        <connection-lost @onIUnderstand="onIUnderstandClick($event)"></connection-lost>
      </div>
    </v-overlay>
    <div class="layout-container__background"></div>
    <div class="page-nav__left-main">
      <div class="page-nav__fixed-content" v-if="!mini && drawer">
        <div class="page-nav__logo-wrapper" style="display: flex; align-items: center;">
          <offline :ping-url="baseUrl" @detected-condition="handleConnectivityChange">
            <div slot="online"></div>
            <!-- Only renders when the device is offline -->
            <div slot="offline"></div>
          </offline>
          <v-app-bar-nav-icon
            class="page-nav__menu-toggle menu-icon-wrapper"
            color="blue"
            height="48"
            width="48"
            x-large
            :style="getDrawerStyle"
            @click.stop="onNavigationClick()"
            ><v-icon style="height: 32px; width: 32px;">{{
              iconPaths.mdiMenu
            }}</v-icon></v-app-bar-nav-icon
          >
          <div class="v-responsive">
            <img
              v-if="!mini && drawer"
              class="page-nav__logo-wrapper__logo"
              :src="getMainLogo"
              id="img--main-logo"
            />
            <div v-else>
              <img
                v-if="!!getLogoImage"
                :src="getLogoImage"
                class="menu-mini-img"
                id="img--main-mini-logo"
              />
            </div>
          </div>
        </div>
        <div class="page-nav__simulated-company" v-if="isReturnMainAccountVisible">Managing as</div>
        <div :class="navigationDrawerClass">
          <div class="user-name-dropdown">
            <div class="user-name-dropdown__menu">
              <v-menu
                class="user-name-dropdown__menu-item"
                :disabled="false"
                :absolute="false"
                :open-on-hover="false"
                :close-on-click="true"
                :close-on-content-click="true"
                :offset-x="true"
                :offset-y="false"
                :z-index="999"
                :nudge-right="19"
                :nudge-top="25"
                max-width="226"
                @click="removeTooltip"
              >
                <template #activator="{ on: onMenu }">
                  <div
                    v-on="onMenu"
                    class="user-name-dropdown-font v-btn-dropdown v-btn v-btn--depressed v-btn--flat v-btn--tile theme--light v-size--default black--text"
                  >
                    <div class="user-name-dropdown-font__tooltip-wrapper">
                      <div class="user-name-dropdown__logo">
                        <img v-if="!!getLogoImage" id="img--company-logo" :src="getLogoImage" />
                      </div>
                      <div class="user-name-dropdown__details">
                        <v-tooltip
                          ref="accountTooltip"
                          bottom
                          :disabled="isSelectedCompanyNameDisabled"
                        >
                          <template #activator="{ on: onTooltip }">
                            <span
                              v-on="{ ...onTooltip }"
                              id="text--company-name"
                              class="user-name-dropdown__details-item"
                              >{{ getSelectedCompanyName }}</span
                            >
                          </template>
                          <span>{{ getSelectedCompanyName }}</span>
                        </v-tooltip>
                        <v-tooltip
                          ref="firstNameTooltip"
                          bottom
                          :disabled="getFirstName && getFirstName.length < 15"
                        >
                          <template #activator="{ on: onTooltipFirstName }">
                            <span
                              v-on="{ ...onTooltipFirstName }"
                              id="text--user-first-name"
                              class="user-name-dropdown__details-item"
                              >{{ getFirstName }}</span
                            >
                          </template>
                          <span>{{ getFirstName }}</span>
                        </v-tooltip>
                        <v-tooltip
                          ref="roleTooltip"
                          bottom
                          :disabled="getRolename && getRolename.length < 15"
                        >
                          <template #activator="{ on: onTooltipRoleName }">
                            <span
                              v-on="{ ...onTooltipRoleName }"
                              id="text--user-role-name"
                              class="user-name-dropdown__details--item"
                              >{{ getRolename }}</span
                            >
                          </template>
                          <span>{{ getRolename }}</span>
                        </v-tooltip>
                      </div>
                      <div class="user-name-dropdown__icon">
                        <v-icon class="user-name-dropdown-font__icon">{{
                          iconPaths.mdiChevronRight
                        }}</v-icon>
                      </div>
                    </div>
                  </div>
                </template>

                <v-list class="user-name-dropdown__content">
                  <v-list-item
                    v-if="setDropdownVisibility(item)"
                    v-for="item in dropdownData"
                    :id="item.id"
                    :key="item.key"
                    :class="{ 'user-name-dropdown__content--divider': setDropdownDivider(item) }"
                    @click="changeDropdownItem(item.value)"
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
          <div class="user-role-wrapper"></div>
        </div>
      </div>
      <div class="page-nav__left-menu-mini" v-if="mini && drawer">
        <v-app-bar-nav-icon
          class="page-nav__menu-toggle menu-icon-wrapper"
          color="blue"
          :style="getDrawerStyle"
          height="48"
          width="48"
          id="mini-menu"
          x-large
          style="left: 22px !important;"
          @click.stop="onNavigationClick()"
        ></v-app-bar-nav-icon>
        <div class="page-nav__simulated-company--mini" v-if="isReturnMainAccountVisible">M</div>
        <div class="v-responsive">
          <div v-if="mini && drawer">
            <img v-if="!!getMiniLogo" :src="getMiniLogo" class="menu-mini-img" />
          </div>
        </div>
      </div>
      <v-navigation-drawer
        v-model="getDrawer"
        color="rgba(255, 255, 255, 0.9)"
        app
        width="285"
        :mini-variant.sync="getMini"
        transition="scale-transition"
        :mobile-break-point="767"
        permanent
        touchless
        class="page-nav"
      >
        <v-list dense class="page-nav__content">
          <router-link
            v-if="getDashboardPermissions"
            id="btn--link-navigator-menu-dashboard"
            to="/"
            class="menu-link-default"
          >
            <app-router-item title="Dashboard" :icon="iconPaths.mdiHome" />
          </router-link>
          <router-link
            v-if="getThreatSharingLeftMenuPermissions"
            to="/threat-sharing"
            id="btn--link-navigator-menu-threat-sharing"
            :class="['menu-link-default', routerName === 'Community' && 'active-link']"
            @click.native="deleteTSVuexData"
          >
            <app-router-item title="Threat Sharing" :icon="iconPaths.mdiFlag" />
          </router-link>
          <v-list-group
            v-if="getPhishingSimulatorLeftMenuPermissions"
            id="btn--link-navigator-menu-phishing-simulator-list-group"
            no-action
            :class="['menu-with-item menu-link-default hook-menu', getPhishingSimulatorPermissions]"
            :prepend-icon="iconPaths.mdiHook"
            :append-icon="iconPaths.mdiChevronDown"
          >
            <template v-slot:activator>
              <v-list-item-content class="menu-list-item">
                <v-list-item-title>Phishing Simulator</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-if="getPhishingScenarioLeftMenuPermissions"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/phishing-simulator/phishing-scenarios"
                  id="btn--link-navigator-menu-phishing-scenario"
                  route-name="Phishing Scenarios"
                  :router-name="routerName"
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getCampaignManagerLeftMenuPermissions"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/phishing-simulator/campaign-manager"
                  id="btn--link-navigator-menu-phishing-campaign-manager"
                  route-name="Campaign Manager"
                  :active-class-comparator="() => routerName === 'Campaign Manager'"
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getSettingsLeftMenuPermissions"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/phishing-simulator/settings"
                  id="btn--link-navigator-menu-phishing-dns-service"
                  route-name="Settings"
                  :router-name="routerName"
                />
              </v-list-item-content>
            </v-list-item>
          </v-list-group>

          <v-list-group
            v-if="getIncidentResponderListGroupPermissions"
            id="btn--link-navigator-menu-incident-responder-list-group"
            :class="['menu-with-item menu-link-default', getIncidentResponderClasses]"
            no-action
            :append-icon="iconPaths.mdiChevronDown"
            :prepend-icon="iconPaths.mdiFlash"
          >
            <template v-slot:activator>
              <v-list-item-content class="menu-list-item">
                <v-list-item-title>Incident Responder</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-if="getIncidentResponderLeftMenuPermissions"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/incident-responder"
                  id="btn--link-navigator-menu-incident-responder"
                  route-name="Incident Responder"
                  :active-class-comparator="
                    () => routerName === 'Analysis Details' || routerName === 'Incident Responder'
                  "
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getInvestigationsSearchPermission"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/incident-responder/investigations"
                  id="btn--link-navigator-menu-investigations"
                  route-name="Investigations"
                  :active-class-comparator="
                    () => routerName === 'Investigation Details' || routerName === 'Investigations'
                  "
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getIntegrationsSearchPermission"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/incident-responder/integrations"
                  id="btn--link-navigator-menu-integrations"
                  route-name="Integrations"
                  :router-name="routerName"
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getPlaybookSearchPermission"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/incident-responder/playbook"
                  id="btn--link-navigator-menu-playbook"
                  route-name="Playbook"
                  :router-name="routerName"
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getMailConfigurationSearchPermission"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/incident-responder/mailConfiguration"
                  id="btn--link-navigator-menu-mail-configuration"
                  route-name="Mail Configurations"
                  :router-name="routerName"
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getCrossCompanyPermissions"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/incident-responder/cross-company-integration"
                  id="btn--link-navigator-menu-sandbox"
                  route-name="Cross Company Integration"
                  :router-name="routerName"
                />
              </v-list-item-content>
            </v-list-item>
          </v-list-group>

          <router-link
            v-if="getPhishingReporterLeftMenuPermissions"
            to="/phishing-reporter"
            id="btn--link-navigator-phishing-reporter"
            :class="['menu-link-default', routerName === 'Phishing Reporter' && 'active-link']"
          >
            <app-router-item title="Phishing Reporter" :icon="iconPaths.mdiAccountVoice" />
          </router-link>
          <v-list-group
            v-if="getReportsLeftMenuPermissions"
            id="btn--link-navigator-menu-reports-list-group"
            no-action
            :class="getReportsClasses"
            :prepend-icon="iconPaths.mdiEqualizer"
            :append-icon="iconPaths.mdiChevronDown"
          >
            <template v-slot:activator>
              <v-list-item-content class="menu-list-item">
                <v-list-item-title>Reports</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item style="padding-left: 0 !important; margin-left: -5px;">
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/reports/campaign-reports"
                  id="btn--link-navigator-menu-reports"
                  route-name="Campaign Reports"
                  :active-class-comparator="
                    () => routerName === 'Campaign Reports' || routerName === 'Campaign Report'
                  "
                />
              </v-list-item-content>
            </v-list-item>
            <!--
            <v-list-item style="padding-left: 0 !important; margin-left: -5px;">
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/reports/simple-reports"
                  id="btn--link-navigator-menu-simple-reports"
                  route-name="Simple Reports"
                  :active-class-comparator="
                    () => routerName === 'Simple Reports' || routerName === 'Simple Report Details'
                  "
                />
              </v-list-item-content>
            </v-list-item>
            !-->
          </v-list-group>
          <v-list-group
            v-if="getCompanyLeftMenuPermissions"
            id="btn--link-navigator-menu-company-list-group"
            no-action
            :class="['menu-with-item menu-link-default', getCompanyClasses]"
            :prepend-icon="iconPaths.mdiBriefcaseVariant"
            :append-icon="iconPaths.mdiChevronDown"
          >
            <template v-slot:activator>
              <v-list-item-content class="menu-list-item">
                <v-list-item-title>Company</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-if="getTargetUsersLeftMenuPermissions"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/company/target-users"
                  id="btn--link-navigator-menu-target-users"
                  route-name="Target Users"
                  :active-class-comparator="
                    () => routerName === 'Target Group Users' || routerName === 'Target Users'
                  "
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getCompaniesLeftMenuPermissions"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/company/companies"
                  id="btn--link-navigator-menu-companies"
                  route-name="Companies"
                  :active-class-comparator="
                    () => routerName === 'Company Group Details' || routerName === 'Companies'
                  "
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getCompanySettingsLeftMenuPermissions"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/company/company-settings"
                  id="btn--link-navigator-menu-company-settings"
                  route-name="Company Settings"
                  :router-name="routerName"
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getSystemUserSearchPermission"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/company/system-users"
                  id="btn--link-navigator-menu-system-users"
                  route-name="System Users"
                  :router-name="routerName"
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getAuditLogSearchPermission"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content" style="border: 0 !important;">
                <app-router-link
                  to="/company/audit"
                  id="btn--link-navigator-menu-audit-log"
                  route-name="Audit Log"
                  :active-class-comparator="() => routerName === 'Audit'"
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getJobLogsSearchPermission"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content" style="border: 0 !important;">
                <app-router-link
                  to="/company/job-log"
                  id="btn--link-navigator-menu-job-log"
                  route-name="Job Log"
                  :router-name="routerName"
                />
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
        <navigation-drawer-footer :is-mini="getMini" :navigatorMenuProps="navigatorMenuProps" />
      </v-navigation-drawer>
    </div>

    <!-- Header Begin -->
    <v-app-bar class="page-header elevation-0 transparent" extension-height="100" app absolute flat>
      <div class="page-header__details">
        <div class="page-header__content">
          <div class="page-header__title" id="text--router-name">
            <h1 v-if="routerName === 'Community'">
              <router-link
                v-if="communityId"
                ref="communityNameRef"
                :to="`/threat-sharing?detailsId=${communityId}`"
                class="page-header__title-link text-decoration-none"
                >{{ communityName || $route.params.name }}</router-link
              ><span v-else>
                <MainListItemLoading
                  v-if="communityName === 'Loading...'"
                  :loading="communityName === 'Loading...'"
                />
                <span v-else>
                  {{ communityName || $route.params.name }}
                </span>
              </span>
            </h1>
            <h1 v-else-if="routerName === 'Company Group Details'">
              {{ getCompanyGroupName || $route.params.name }}
            </h1>
            <h1 v-else-if="routerName === 'Target Group Users'">
              {{ getTargetGroupUsersRouterName }}
            </h1>
            <h1 v-else-if="routerName === 'Campaign Report'">
              {{ getCampaignReportName }}
            </h1>
            <h1 v-else>{{ routerName }}</h1>
          </div>
          <Breadcrumb :base-name="getBreadCrumbBaseName" />
        </div>
      </div>
      <div class="page-header__actions">
        <v-menu min-width="200" max-width="200" offset-y transition="scale-transition">
          <template v-slot:activator="{ on }">
            <v-btn id="btn--dashboard-header-help-menu" icon color="white" v-on="on">
              <v-icon>{{ iconPaths.mdiHelpCircle }}</v-icon>
            </v-btn>
          </template>
          <v-list>
            <template v-for="(item, index) in rightDropdownData">
              <v-list-item
                v-if="getRightDropdownDataItemRender(item)"
                :key="index"
                :id="item.id"
                :disabled="item.disabled"
                @click="handleClickRightDropdown(item)"
              >
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    v-text="item.text"
                    :data-content="
                      item.text === 'Get Help'
                        ? `mailto:${supportEmailAddress || 'support@keepnetlabs.com'}`
                        : item.text === 'Documentation'
                        ? 'https://doc.keepnetlabs.com'
                        : ''
                    "
                  ></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>
    <v-content :style="getMini ? 'padding-left: 63px' : 'padding-left: 285px'">
      <v-container
        fluid
        style="height: 100%; padding-bottom: 47px !important;"
        class="app-container ml-0 pa-0 pt-2 mr-0 pb-12"
      >
        <router-view :key="getRouterKey" />
      </v-container>
      <app-footer :brand-name="getBreadCrumbBaseName" />
    </v-content>
    <v-tour
      class="main-v-tour"
      name="tourDashboard"
      :steps="tourSteps"
      :options="{
        highlight: true,
        debug: false,
        labels: {
          buttonSkip: 'END TOUR',
          buttonPrevious: 'BACK',
          buttonNext: 'NEXT',
          buttonStop: 'FINISH'
        }
      }"
    />
  </v-app>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import {
  mdiHome,
  mdiChevronRight,
  mdiFlag,
  mdiFlash,
  mdiHook,
  mdiChevronDown,
  mdiAccountVoice,
  mdiEqualizer,
  mdiBriefcaseVariant,
  mdiMenu,
  mdiHelpCircle
} from '@mdi/js'
import offline from 'v-offline'
import ConnectionLost from '../components/ConnectionLost'
import SwitchAccount from '../components/SwitchAccount'
import FeedbackPopup from '../components/FeedbackPopup'
import AppFooter from './AppFooter'
import AppSnackbar from './AppSnackbar'
import AuthenticationService from '../services/authentication'
import Breadcrumb from '@/components/Breadcrumb'
import labels from '@/model/constants/labels'
import TargetUsersCheckLicenseDialog from '@/components/TargetUsers/TargetUsersCheckLicenseDialog'
import MainListItemLoading from '@/components/SkeletonLoading/MainListItemLoading'
import AppRouterItem from '@/layout/AppRouterItem'
import SecurityModal from '@/components/Security/SecurityModal'
import SettingsModal from '@/components/SettingsModal'
import NavigationDrawerFooter from '@/layout/NavigationDrawerFooter'
import LeavingDialog from '@/components/LeavingDialog'
import AppRouterLink from '@/layout/AppRouterLink'

export default {
  name: 'Main',
  components: {
    AppRouterLink,
    LeavingDialog,
    NavigationDrawerFooter,
    SecurityModal,
    SettingsModal,
    AppRouterItem,
    FeedbackPopup,
    AppFooter,
    ConnectionLost,
    SwitchAccount,
    offline,
    AppSnackbar,
    Breadcrumb,
    TargetUsersCheckLicenseDialog,
    MainListItemLoading
  },
  data() {
    return {
      showSettingsModalStatus: false,
      labels,
      navigationDrawerClass: '',
      iconPaths: {
        mdiHome,
        mdiChevronRight,
        mdiFlag,
        mdiFlash,
        mdiHook,
        mdiChevronDown,
        mdiAccountVoice,
        mdiEqualizer,
        mdiBriefcaseVariant,
        mdiMenu,
        mdiHelpCircle
      },
      switchDialogStatus: false,
      showNewPassword: false,
      currentPassword: null,
      newPasswordError: null,
      newPasswordErrorText: null,
      newPassword: null,
      reNewPassword: null,
      openPasswordChange: false,
      communityId: null,
      baseUrl: null,
      communityName: null,
      companyGroupName: null,
      drawer: null,
      mini: null,
      isDisconnected: true,
      rightDropdownData: [
        {
          text: 'Tour',
          icon: 'mdi-reminder',
          url: '',
          id: 'btn--dashboard-header-menu-tour',
          disabled: false
        },
        {
          text: 'Documentation',
          icon: 'mdi-file-document',
          url: '',
          id: 'btn--dashboard-header-menu-documentation',
          disabled: false
        },
        {
          text: 'Get Help',
          icon: 'mdi-help-circle',
          id: 'btn--dashboard-header-menu-get-help',
          url: '',
          disabled: false
        },
        {
          text: 'Feedback',
          icon: 'mdi-message-alert',
          id: 'btn--dashboard-header-menu-feedback',
          url: '',
          disabled: false
        }
      ],
      dropdownData: [
        {
          text: 'Switch Company',
          id: 'btn-switch-company--dashboard',
          icon: 'mdi-swap-horizontal',
          url: '',
          value: 'switchCompany'
        },
        {
          text: 'Return to Main Account',
          id: 'btn-return-to-main-account--dashboard',
          icon: 'mdi-rotate-left',
          url: '',
          value: 'returnToMainAccount'
        },
        {
          text: 'Settings',
          id: 'btn-settings--dashboard',
          icon: 'mdi-cog',
          url: '',
          value: 'changeSettings'
        },
        {
          text: 'Security',
          id: 'btn-security--dashboard',
          icon: 'mdi-lock',
          url: '',
          value: 'changePassword'
        },
        {
          text: 'Logout',
          id: 'btn-logout--dashboard',
          icon: 'mdi-login-variant',
          url: '',
          value: 'logout'
        }
      ],
      tourSteps: [
        {
          target: '#available-widgets', // We're using document.querySelector() under the hood
          content: `Available Widgets`
        },
        {
          target: '#PhishingReporterIrHeader',
          content:
            'Number of online Phishing Reporter users by total number of phishing reporter users'
        },
        {
          target: '#IncidentAnalysisIrHeader',
          content: 'Number of detected harmful emails by total number of reported email'
        },
        {
          target: '#InvestigationsIrHeader',
          content: 'Number of auto and manually executed investigations'
        },
        {
          target: '#ROISummaryIrHeader',
          content: 'Return of investment states how much time and money you saved '
        },
        {
          target: '#RecentlyPostedThreats',
          content: 'Most recent incidents shared in your communities'
        },
        {
          target: '#TopPosts',
          content: 'Most engaged incidents shared in your communities'
        },

        {
          target: '#TopRules',
          content: 'Most activated playbook rules'
        },

        {
          target: '#IncidentClusters',
          content: "Reported emails clustered by reporters' avarage reliability score over time"
        },
        {
          target: '#ReportedEmailTrends',
          content: 'Numbers of reported emails by category over time'
        },
        {
          target: '#RecentlyReportedIncidents',
          content: 'Numbers of reported emails by category'
        },
        {
          target: '#Reporters',
          content:
            "Top reporters sorted by reliability score. Reliability score measures a user's credibility calculated by accuracy of their reported emails that are detected harmful"
        },
        {
          target: '#RecentInvestigations',
          content: 'Most recent investigations'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      isFeedbackPopupOpened: 'dashboard/isPopupOpened',
      isSwitchDialogOpen: 'dashboard/getIsSwitchDialogOpen',
      isLoadingFromStore: 'common/getIsLoading',
      navigatorMenuProps: 'whitelabel/getNavigatorMenuProps',
      brandName: 'whitelabel/getBrandName',
      supportEmailAddress: 'whitelabel/getSupportEmailAddress',
      showLicenseExceededDialog: 'whitelabel/getShowLicenseDialog',
      companyLicense: 'whitelabel/getCompanyLicense',
      getDashboardPermissions: 'permissions/getDashboardPermissions',
      getThreatSharingLeftMenuPermissions: 'permissions/getThreatSharingLeftMenuPermissions',
      getPhishingSimulatorLeftMenuPermissions:
        'permissions/getPhishingSimulatorLeftMenuPermissions',
      getPhishingScenarioLeftMenuPermissions: 'permissions/getPhishingScenarioLeftMenuPermissions',
      getCampaignManagerLeftMenuPermissions: 'permissions/getCampaignManagerLeftMenuPermissions',
      getSettingsLeftMenuPermissions: 'permissions/getSettingsLeftMenuPermissions',
      getIncidentResponderListGroupPermissions:
        'permissions/getIncidentResponderListGroupPermissions',
      getIncidentResponderLeftMenuPermissions:
        'permissions/getIncidentResponderLeftMenuPermissions',
      getInvestigationsSearchPermission: 'permissions/getInvestigationsSearchPermission',
      getIntegrationsSearchPermission: 'permissions/getIntegrationsSearchPermission',
      getPlaybookSearchPermission: 'permissions/getPlaybookSearchPermission',
      getMailConfigurationSearchPermission: 'permissions/getMailConfigurationSearchPermission',
      getCrossCompanyPermissions: 'permissions/getCrossCompanyPermissions',
      getPhishingReporterLeftMenuPermissions: 'permissions/getPhishingReporterLeftMenuPermissions',
      getReportsLeftMenuPermissions: 'permissions/getReportsLeftMenuPermissions',
      getCompanyLeftMenuPermissions: 'permissions/getCompanyLeftMenuPermissions',
      getTargetUsersLeftMenuPermissions: 'permissions/getTargetUsersLeftMenuPermissions',
      getCompaniesLeftMenuPermissions: 'permissions/getCompaniesLeftMenuPermissions',
      getCompanySettingsLeftMenuPermissions: 'permissions/getCompanySettingsLeftMenuPermissions',
      getSystemUserSearchPermission: 'permissions/getSystemUserSearchPermission',
      getAuditLogSearchPermission: 'permissions/getAuditLogSearchPermission',
      getJobLogsSearchPermission: 'permissions/getJobLogsSearchPermission'
    }),
    getCompanyGroupName() {
      return this.routerName === 'Company Group Details'
        ? localStorage.getItem('companyGroupName')
        : ''
    },
    getBreadCrumbBaseName() {
      return this.brandName || this.$store.state.auth.selectedCompanyName
    },
    getTargetGroupUsersRouterName() {
      return this.$route.params.label || localStorage.getItem('lastTargetGroupUsers')
    },
    getReportsClasses() {
      const { routerName } = this
      return [
        'menu-with-item menu-link-default',
        routerName === 'Campaign Reports' ||
        routerName === 'Simple Reports' ||
        routerName === 'Campaign Report' ||
        routerName === 'Simple Report Details'
          ? 'primary--text active-menu-parent'
          : 'un-selected-list-item'
      ]
    },
    getCampaignReportName() {
      if (this.$store?.state?.common?.activePageRouterName) {
        return `Campaign Report - ${this.$store?.state?.common?.activePageRouterName}`
      }
      return 'Campaign Report'
    },
    getRouterKey() {
      const { name } = this.$route
      if (['Community', 'Threat Sharing'].includes(name)) {
        return this.$route.fullPath
      }
      return ''
    },
    getCompanyClasses() {
      const routerName = this.routerName
      const isSelected =
        routerName === 'Company' ||
        routerName === 'Target Users' ||
        routerName === 'Companies' ||
        routerName === 'Company Settings' ||
        routerName === 'Company Group Details' ||
        routerName === 'Target Group Users' ||
        routerName === 'System Users' ||
        routerName === 'Job Log' ||
        routerName === 'Audit'
      return {
        'primary--text active-menu-parent': isSelected,
        'un-selected-list-item': !isSelected
      }
    },
    getIncidentResponderClasses() {
      const routerName = this.routerName
      const isSelected =
        routerName === 'Incident Responder' ||
        routerName === 'Investigations' ||
        routerName === 'Integrations' ||
        routerName === 'Playbook' ||
        routerName === 'Mail Configurations' ||
        routerName === 'Analysis Details' ||
        routerName === 'Investigation Details' ||
        routerName === 'Cross Company Integration'
      return {
        'primary--text active-menu-parent': isSelected,
        'un-selected-list-item': !isSelected
      }
    },
    getPhishingSimulatorPermissions() {
      const routerName = this.routerName
      return {
        'primary--text active-menu-parent':
          routerName === 'Phishing Simulator' ||
          routerName === 'Email Templates' ||
          routerName === 'Phishing Scenarios' ||
          routerName === 'Campaign Manager' ||
          routerName === 'Settings',
        'un-selected-list-item':
          routerName !== 'Phishing Simulator' || routerName !== 'Email Templates'
      }
    },
    getCommunityName() {
      let _this = this
      _this.communityId = localStorage.getItem('communityResourceIdForRedirect')
      _this.communityName =
        _this.$route.params.communityName || localStorage.getItem('communityName')
      return this.communityName
    },
    getDialogBody() {
      return this.companyLicense
        ? `Your license allows to use the system with ${this.companyLicense.licenseLimit} target users. Current target user count is ${this.companyLicense.totalUserCount}.`
        : ''
    },
    isReturnMainAccountVisible() {
      if (
        this.$store.state.auth.userRoleName === 'CompanyAdmin' ||
        this.$store.state.auth.userRoleName === 'Company Admin'
      )
        return false
      return (
        localStorage.getItem('companyResourceId') !==
        localStorage.getItem('selectedCompanyRequestId')
      )
    },
    companyName() {
      return this.brandName
        ? this.brandName
        : localStorage.getItem('selectedCompanyName') || localStorage.getItem('companyName')
    },
    routerName() {
      return this.$route.name
    },
    getDrawer: {
      get() {
        if (this.drawer == null) {
          return window.outerWidth > 768
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
    feedbackDialog: {
      get() {
        return this.isFeedbackPopupOpened
      },
      set(newValue) {
        this.changeFeedbackPopup(newValue)
      }
    },
    getUser() {
      return this?.$store?.state?.auth?.user
    },
    getLogoImage() {
      if (!this.getUser) return ''
      let image =
        localStorage.getItem('isSelectCompany') === 'true'
          ? this.$store.state.dashboard.selectedCompanyObject.logoUrl
          : this.$store.state.auth.logoUrl
      return image || require('../assets/img/no-logo.png')
    },
    getMainLogo() {
      if (!this.getUser) return ''
      let image = this.navigatorMenuProps.mainLogoUrl
      return image || require('../assets/img/no-logo.png')
    },
    getMiniLogo() {
      if (!this.getUser) return ''
      let image = this.navigatorMenuProps.minimizedMenuLogoUrl
      return image || require('../assets/img/no-logo.png')
    },
    getFirstName() {
      return this.$store.state.auth.user.firstName || ''
    },
    getSelectedCompanyName() {
      return this?.$store?.state?.auth?.selectedCompanyName || ''
    },
    getRolename() {
      return this?.$store?.state?.auth?.userRoleName || ''
    },
    getDrawerStyle() {
      return this.mini ? 'left: 5px !important;' : 'left : 244px !important;'
    },
    isSelectedCompanyNameDisabled() {
      return this.getSelectedCompanyName && this.getSelectedCompanyName.length < 15
    }
  },
  watch: {
    openPasswordChange(newVal) {
      if (!newVal) {
        this.showNewPassword = false
      }
    },
    $route: {
      handler: function (to) {
        if (to.name === 'Community') {
          this.communityName = to.params.communityName
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.baseUrl = `${window.location.origin}`
    this.getNavigationDrawerClasses()
    this.$nextTick(() => {
      if (AuthenticationService.isAuthenticated()) {
        this.getCurrentUser()
        this.$store.dispatch('whitelabel/callForData')
        this.callForSystemSummary()
        this.interval = setInterval(() => {
          if (!this.isDisconnected) {
            clearInterval(this.interval)
          }
        }, 20000)
      }
    })
    setTimeout(() => {
      let contentDom = document.getElementsByClassName('v-navigation-drawer__content')[0]
      if (contentDom && !this.isEventAdded) {
        document
          .getElementsByClassName('v-navigation-drawer__content')[0]
          .addEventListener('scroll', () => {
            this.getNavigationDrawerClasses()
          })
        this.isEventAdded = true
      }
    }, 500)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    ...mapActions({
      changeFeedbackPopup: 'dashboard/changeFeedbackPopup',
      logoutUser: 'dashboard/logoutUser',
      setSwitchDialog: 'dashboard/setSwitchDialog',
      getCurrentUser: 'auth/getCurrentUser',
      handleCloseLicenseExceededDialog: 'whitelabel/toggleShowExceedDialog'
    }),
    getRightDropdownDataItemRender({ text }) {
      if (text === 'Tour') {
        return this.$route.name === 'Dashboard'
      }
      return true
    },
    changeSettings() {
      this.showSettingsModalStatus = !this.showSettingsModalStatus
    },
    changePasswordChange() {
      this.openPasswordChange = !this.openPasswordChange
    },
    getNavigationDrawerClasses() {
      const main = `d-flex justify-center flex-wrap user-wrapper ${
        this.isReturnMainAccountVisible && 'p-0'
      }`
      const shadow = 'user-wrapper__scroll-on'
      let content =
        document.getElementsByClassName('page-nav__content') &&
        document.getElementsByClassName('page-nav__content')[0]
      let userContent =
        document.getElementsByClassName('user-wrapper') &&
        document.getElementsByClassName('user-wrapper')[0]
      let isScroll = content && content.getBoundingClientRect().top < 200
      let _class = main
      if (isScroll) _class = _class + ' ' + shadow
      if (userContent) userContent.className = _class
      this.navigationDrawerClass = _class
    },
    deleteTSVuexData() {
      let communitiesData = null
      this.$store.dispatch('communities/setCommunities', {
        key: 'communities',
        communitiesData
      })
      let incidentsData = null
      this.$store.dispatch('incidents/setIncidents', {
        key: 'incidents',
        incidentsData
      })
    },
    callForSystemSummary() {
      const payload = {}
      if (this.$route.name !== 'Target Users') {
        payload.checkExceedDialog = true
      }
      this.$store.dispatch('whitelabel/callForSystemInfoSummary', payload)
    },
    removeTooltip() {
      this.$refs.accountTooltip.isActive = false
    },
    setDropdownDivider(item) {
      if (item.value === 'switchCompany') {
        return (
          this.$store.state.auth.userRoleName !== 'Company Admin' &&
          !this.isReturnMainAccountVisible
        )
      } else if (item.value === 'returnToMainAccount') {
        return item.value === 'returnToMainAccount' && this.isReturnMainAccountVisible
      } else {
        return false
      }
    },
    setDropdownVisibility(item) {
      if (item.value === 'switchCompany') {
        return this.$store.state.auth.userRoleName !== 'Company Admin'
      } else if (item.value === 'returnToMainAccount') {
        return item.value === 'returnToMainAccount' && this.isReturnMainAccountVisible
      } else {
        return true
      }
    },
    handleClickRightDropdown(item = { text: '' }) {
      const { text } = item
      const domElem = document.createElement('a')
      switch (text) {
        case 'Tour':
          this.tourSafeStarter('tourDashboard')
          break
        case 'Feedback':
          this.feedbackDialog = true
          break
        case 'Get Help':
          domElem.href = `mailto:${this.supportEmailAddress || 'support@keepnetlabs.com'}`
          domElem.click()
          break
        case 'Documentation':
          domElem.href = 'https://doc.keepnetlabs.com'
          domElem.target = '_blank'
          domElem.click()
          break
        default:
          break
      }
    },
    tourSafeStarter(tourName) {
      const arr = []
      this.tourSteps.forEach((x) => document.querySelector(x.target) && arr.push(x))
      this.tourSteps = arr
      this.$tours[tourName].start()
    },
    changeDropdownItem(item) {
      switch (item) {
        case 'logout':
          this.logoutUser()
          break
        case 'changePassword':
          this.currentPassword = null
          this.newPassword = null
          this.reNewPassword = null
          this.openPasswordChange = true
          break
        case 'switchCompany':
          this.setSwitchDialog(true)
          break
        case 'returnToMainAccount':
          let mainCompanyId = localStorage.getItem('companyResourceId')
          let mainCompanyName = localStorage.getItem('companyName')
          localStorage.setItem('isSelectCompany', false)
          localStorage.setItem('companyId', mainCompanyId)
          localStorage.setItem('companyRequestId', mainCompanyId)
          localStorage.setItem('selectedCompanyRequestId', mainCompanyId)
          localStorage.setItem('selectedCompanyName', mainCompanyName)
          this.$router.go(0)
          break
        case 'changeSettings':
          this.changeSettings()
          break
        default:
          return
      }
    },
    onIUnderstandClick(data) {
      this.isDisconnected = data
    },
    handleConnectivityChange(status) {
      this.isDisconnected = !!status
      return this.isDisconnected
    },
    onNavigationClick() {
      this.getDrawer = true
      this.getMini = !this.getMini
    }
  }
}
</script>
<style lang="scss">
.mdi-hook {
  transform: scaleX(-1);
}
.hook-menu {
  .v-list-group__header__prepend-icon {
    transform: rotate(-25deg);
  }
}
.layout-container {
  .user-name-dropdown__content {
    .v-list-item__title {
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      display: flex;
      i {
        margin-right: 16px;
        font-size: 20px;
      }
    }
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
    margin: 16px 0 !important;
    .v-toolbar__content {
      justify-content: space-between;
      padding-left: 8px;
      padding-right: 0;
    }
    &__details {
      max-width: 85%;
    }
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
      padding-left: 16px;
      margin-bottom: 1px;
    }
    &__title {
      h1 {
        color: white;
        font-size: 34px;
        @media (max-width: 1024px) {
          font-size: 22px;
        }
        font-weight: bold;
        margin: 0;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      &-link {
        color: white;
        font-size: 34px;
        font-weight: bold;
        margin: 0;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
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
          cursor: default;
        }
      }
    }
  }
  .page-nav {
    overflow: visible;
    background: white !important;
    padding-top: 210px;
    z-index: 7 !important;
    &__simulated-company {
      width: 100%;
      height: 24px;
      background-color: #e6a23c;
      font-size: 12px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.33;
      letter-spacing: normal;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      &--mini {
        top: 92px;
        height: 13px;
        background-color: #e6a23c;
        font-size: 9px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.33;
        letter-spacing: normal;
        color: #ffffff;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        width: 64px;
      }
    }
    &__left-menu-mini {
      width: 56px;
      height: 200px;
      position: fixed;
      z-index: 13;
      #mini-menu {
        margin-left: 3px;
      }
      .v-responsive {
        top: 110px;
      }
    }
    &__content {
      padding-top: 2px;
      flex-basis: 90%;
    }
    &__fixed-content {
      position: fixed;
      background: white;
      width: 285px;
      z-index: 8;
    }
    ::-webkit-scrollbar {
      width: 16px; /* width of the entire scrollbar */
      border: 1px solid rgba(0, 0, 0, 0.02);
      box-shadow: inset -1.5px 0 0 0 rgba(0, 0, 0, 0.07), inset -2px 0 0 0 rgba(0, 0, 0, 0.02),
        inset 1.5px 0 0 0 rgba(0, 0, 0, 0.02), inset 1px 0 0 0 rgba(0, 0, 0, 0.07);
    }

    ::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.51);
      border: 5px solid transparent;
      border-radius: 22px;
      background-clip: content-box;
    }

    &__menu-toggle {
      left: 224px;
      top: 25px !important;
      position: fixed;
      z-index: 9;
      transition: all 0.2s ease-in-out;
      background-color: #edf7fd;
      margin-left: -15px;
      .v-icon__svg {
        width: 100%;
        height: 100%;
      }
    }
    &__logo-wrapper {
      max-width: 150px;
      max-height: 48px;
      margin: 24px 24px 16px;
      min-height: 48px;
      &__logo {
        max-height: 48px;
        max-width: 100%;
      }
    }
    &.v-navigation-drawer--mini-variant {
      min-width: 64px;
      .page-nav__menu-toggle {
        transition: all 0.2s ease-in-out;
        margin-left: 0;
        .v-icon__svg {
          width: 100%;
          height: 100%;
        }
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
      margin-right: -4px !important;
    }
    .v-list-group__header__append-icon {
      min-width: 24px !important;
      margin: 0px -4px 0 6px !important;
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
      margin-bottom: 0 !important;
      margin-top: 12px !important;
    }
  }
}

.layout-container {
  .page-nav {
    .v-list-item--active > .v-list-item__icon,
    .menu-list-item > .v-list-item__icon {
      margin-right: 16px !important;
      margin-bottom: 0 !important;
      margin-top: 13px !important;
      &.v-list-group__header__append-icon {
        margin-top: 0 !important;
      }
      i {
        font-size: 24px !important;
      }
    }
  }

  .menu-list-item {
    .v-list-item__title {
      line-height: 1.2rem !important;
    }
  }

  .v-menu__content {
    border-radius: 20px;
  }

  .user-name-dropdown {
    display: flex;
    position: relative;
    padding: 16px 8px;
    border-radius: 8px;
    background-color: #fafafa;
    &__content--divider {
      border-bottom: 1px solid #e0e0e0;
    }
    width: 100%;
    &__menu {
      width: 100%;
      &-item {
        width: 100%;
      }
    }
    &__logo {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;

      img {
        max-width: 100%;
        max-height: 60px;
      }
    }
    &__details {
      flex-flow: column;
      display: flex;
      height: 60px;
      text-transform: capitalize !important;
      word-wrap: break-word;
      max-width: 150px;
      min-width: 150px;
      margin-left: 8px;
      cursor: pointer;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      &-item {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      span {
        max-width: 150px;
        text-align: left;
        font-size: 14px;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: #383b41;
        &:first-child {
          font-weight: 600;
        }
        &:last-child {
          font-size: 12px;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: 1;
          height: 16px;
          color: #757575;
        }
      }
    }
    &__icon {
      padding-left: 10px;
      i {
        cursor: pointer;
        &:before {
          opacity: 0.8;
          color: #383b41;
        }
      }
    }
  }

  .user-name-dropdown-font {
    align-items: flex-start;
    height: 60px !important;
    padding: 0 !important;
    justify-content: flex-start;
    &:hover:before {
      opacity: 0 !important;
    }
    &__icon {
      margin-top: 2px;
      &::before {
        color: black;
        font-weight: 900;
      }
    }
    &__tooltip-wrapper {
      display: flex;
      width: 100%;
      align-items: center;
      height: 60px;
      cursor: pointer;
    }
  }

  .user-wrapper {
    background: white;
    padding: 8px;
    &__scroll-on {
      box-shadow: 0 2px 3px 0 rgb(142 142 142 / 20%);
    }
  }

  .logo-wrapper {
    margin: 56px auto 16px;
    width: 180px;
    height: 60px;
  }

  .v-navigation-drawer {
    min-width: 64px;
  }

  .v-navigation-drawer__content {
    display: flex;
    flex-direction: column;
    .v-list-item {
      border-left: 5px solid transparent;
    }
    .v-list--dense .v-list-item .v-list-item__content {
      padding: 0 !important;
    }
    .menu-list-item,
    .v-list-group__header {
      max-height: 48px;
      min-height: 48px;
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
      width: 91%;
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
    left: 244px;
    top: 16px;
    position: fixed;
    z-index: 20;
    transition: all 0.2s ease-in-out;
  }

  .v-navigation-drawer {
    overflow: visible !important;
    z-index: 8;

    @media only screen and (max-width: 1025px) {
      position: fixed !important;
    }
  }

  .v-content {
    height: 100%;
    margin-top: 16px;
    @media only screen and (max-width: 769px) {
      padding: 160px 0 0 60px !important;
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

    .v-list-group__header,
    .v-list-item--active {
      padding-left: 12px !important;
    }

    .v-list-item .v-list-item__icon,
    .v-list-group__header > .v-list-item__icon {
      margin-right: 0 !important;
    }
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
    max-width: 48px;
    max-height: 48px;
    margin-left: 8px;
  }

  .menu-link-default {
    text-decoration: none;
  }

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    .v-cart-dropdown-list {
      width: 160px !important;

      .v-list-item__title {
        margin-top: 10px !important;
      }
    }
  }
  .menu-item-wrapper {
    line-height: 1.2 !important;
    padding-left: 72px;
    height: 36px !important;
    margin-right: 30px;
    border-radius: 0 23px 23px 0;
    cursor: pointer;

    .menu-item-span {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 13px;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.54;
      letter-spacing: normal;
      color: #383b41 !important;
    }
  }

  .v-list-group__items {
    .v-list-item {
      align-items: center;
      display: flex;
      max-height: 36px !important;
      min-height: 36px !important;
      margin: 2px 0 !important;

      .v-list-item__icon:first-child {
        margin-top: 12px;
        margin-left: 0;

        i {
          font-size: 22px !important;
        }
      }
    }
  }

  .active-menu-parent {
    .v-list-group__header {
      border-left: solid 5px !important;
      border-color: #2196f3 !important;

      .v-list-item__title {
        color: #2196f3 !important;
      }

      .v-list-item__icon .v-icon__svg {
        color: #2196f3 !important;
      }
    }
  }
  .switch-dialog {
    width: 600px !important;
    border-radius: 20px !important;
    overflow: visible !important;
  }

  .v-application--wrap {
    background-color: #fafafa !important;
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
    color: #383b41 !important;
  }
}
.layout-container .active-link .menu-item-wrapper .menu-item-span {
  color: #1565c0 !important;
  font-weight: 600;
}
.main-v-tour {
  .v-step {
    min-width: 300px;
    max-width: 300px;
    padding: 0 !important;
    background: #fff !important;
    box-shadow: 0 11px 15px -7px rgba(80, 80, 80, 0.2), 0 24px 38px 0 rgba(80, 80, 80, 0.14),
      0 9px 46px 8px rgba(80, 80, 80, 0.12) !important;
    border: solid 1px #2196f3;
    border-radius: 12px !important;
    &__content {
      padding: 24px !important;
      margin-bottom: 0 !important;
      border-bottom: 1px solid #e0e0e0;
      font-size: 13px !important;
      font-weight: normal !important;
      font-stretch: normal !important;
      font-style: normal !important;
      line-height: normal !important;
      letter-spacing: normal !important;
      color: #383b41 !important;
      text-align: left;
    }
    &__arrow {
      border-color: #ffffff !important;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
    }
    &__buttons {
      padding: 14px 32px !important;
      display: flex;
      justify-content: space-between;
    }
    &__button-skip {
      font-size: 14px !important;
      font-weight: 600 !important;
      font-stretch: normal !important;
      font-style: normal !important;
      line-height: 1.71 !important;
      letter-spacing: normal !important;
      text-align: center !important;
      color: #f56c6c !important;
      padding: 0 !important;
      margin: 0 !important;
      height: 24px !important;
    }
    &__button-next {
      font-size: 14px !important;
      font-weight: 600 !important;
      font-stretch: normal !important;
      font-style: normal !important;
      line-height: 1.71 !important;
      letter-spacing: normal !important;
      color: #2196f3 !important;
      padding: 0 !important;
      margin: 0 !important;
      height: 24px !important;
    }
    &__button-previous {
      font-size: 14px !important;
      font-weight: 600 !important;
      font-stretch: normal !important;
      font-style: normal !important;
      line-height: 1.71 !important;
      letter-spacing: normal !important;
      color: #2196f3 !important;
      padding: 0 !important;
      margin: 0 !important;
      height: 24px !important;
      margin-left: 35px !important;
    }
    &__button-stop {
      font-size: 14px !important;
      font-weight: 600 !important;
      font-stretch: normal !important;
      font-style: normal !important;
      line-height: 1.71 !important;
      letter-spacing: normal !important;
      text-align: center !important;
      color: #f56c6c !important;
      padding: 0 !important;
      margin: 0 !important;
      height: 24px !important;
    }
  }
  .v-step[x-placement^='bottom'] .v-step__arrow {
    border-width: 0 0.9rem 0.9rem 0.9rem !important;
    top: -0.9rem !important;
  }
  .v-step[x-placement^='top'] .v-step__arrow {
    border-width: 0.9rem 0.9rem 0 0.9rem !important;
    bottom: -0.9rem !important;
  }
  .v-step[x-placement^='bottom'] {
    margin-top: 1.2rem !important;
  }
  .v-step[x-placement^='top'] {
    margin-bottom: 1.2rem !important;
  }
}
#btn--link-navigator-menu-phishing-simulator-list-group {
  .v-list-group__header__prepend-icon {
    .v-icon {
      transform: rotateY(180deg);
    }
  }
}
</style>
