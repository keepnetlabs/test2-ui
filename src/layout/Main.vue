<template>
  <v-app class="layout-container">
    <app-snackbar />
    <v-dialog v-model="feedbackdialog" v-if="feedbackdialog" persistent :width="600">
      <feedback-popup v-on:closePopUp="feedbackdialog = $event"></feedback-popup>
    </v-dialog>
    <SecurityModal
      :openPasswordChange="openPasswordChange"
      @changePasswordChange="changePasswordChange"
      v-if="openPasswordChange"
      :rules="rules"
    />
    <SettingsModal
      :showSettingsModalStatus="showSettingsModalStatus"
      v-if="showSettingsModalStatus"
      @changeSettings="changeSettings"
    />
    <v-overlay :value="isLoadingFromStore > 0" :z-index="9999999">
      <div class="text-center">
        <v-progress-circular :size="50" color="primary" indeterminate />
      </div>
    </v-overlay>
    <target-users-check-license-dialog
      v-if="showLicenseExceededDialog"
      :status="showLicenseExceededDialog"
      :dialogBody="getDialogBody"
      @close-overlay="showLicenseExceededDialog = false"
    />
    <v-row justify="center">
      <v-dialog
        v-model="isSwitchDialogOpen"
        content-class="switch-dialog"
        width="600"
        @click:outside="setSwitchDialog(!isSwitchDialogOpen)"
      >
        <switch-account
          v-if="isSwitchDialogOpen"
          :navigatorMenuProps="navigatorMenuProps"
        ></switch-account>
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
    <div class="page-nav__left-main">
      <div class="page-nav__fixed-content" v-if="!mini && drawer">
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
          <v-app-bar-nav-icon
            class="page-nav__menu-toggle menu-icon-wrapper"
            color="blue"
            @click.stop="onNavigationClick()"
            :style="getDrawerPadding2"
            height="48"
            width="48"
            x-large
          ></v-app-bar-nav-icon>
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
        <div :class="scroll()">
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
                    class="user-name-dropdown-font v-btn-dropdown v-btn v-btn--depressed v-btn--flat v-btn--tile theme--light v-size--default black--text"
                    v-on="onMenu"
                  >
                    <div class="user-name-dropdown-font__tooltip-wrapper">
                      <div class="user-name-dropdown__logo">
                        <img v-if="!!getLogoImage" id="img--company-logo" :src="getLogoImage" />
                      </div>
                      <div class="user-name-dropdown__details">
                        <v-tooltip
                          bottom
                          :disabled="getSelectedCompanyName && getSelectedCompanyName.length < 15"
                          ref="accountTooltip"
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
                          bottom
                          :disabled="getFirstName && getFirstName.length < 15"
                          ref="firstNameTooltip"
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
                          bottom
                          :disabled="getRolename && getRolename.length < 15"
                          ref="roleTooltip"
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
                        <v-icon class="user-name-dropdown-font__icon">mdi-chevron-right</v-icon>
                      </div>
                    </div>
                  </div>
                </template>

                <v-list class="user-name-dropdown__content">
                  <v-list-item
                    v-for="item in dropdownData"
                    :id="item.id"
                    :key="item.key"
                    @click="changeDropdownItem(item.value)"
                    v-if="setDropdownVisibility(item)"
                    :class="{ 'user-name-dropdown__content--divider': setDropdownDivider(item) }"
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
          @click.stop="onNavigationClick()"
          :style="getDrawerPadding2"
          height="48"
          width="48"
          id="mini-menu"
          x-large
          style="left: 22px !important;"
        ></v-app-bar-nav-icon>
        <div class="page-nav__simulated-company--mini" v-if="isReturnMainAccountVisible">M</div>
        <div class="v-responsive">
          <div v-if="mini && drawer">
            <img v-if="!!getMiniLogo" :src="getMiniLogo" class="menu-mini-img" />
          </div>
        </div>
      </div>
      <v-navigation-drawer
        color="rgba(255, 255, 255, 0.9)"
        app
        width="285"
        v-model="getDrawer"
        :mini-variant.sync="getMini"
        transition="scale-transition"
        :mobile-break-point="767"
        permanent
        touchless
        class="page-nav"
        :class="{ 'bg-blur': sessionCheck }"
      >
        <v-overlay
          :z-index="12"
          :value="!(getTourData[4] || getTourData[5]) && getTourData.isActive"
        ></v-overlay>
        <v-list dense class="page-nav__content" ref="pageNavContent">
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

          <router-link
            v-if="checkDashboardPermission()"
            id="btn--link-navigator-menu-dashboard"
            to="/"
            class="menu-link-default"
          >
            <app-router-item icon="mdi-home" title="Dashboard" />
          </router-link>
          <router-link
            to="/threat-sharing"
            id="btn--link-navigator-menu-threat-sharing"
            class="menu-link-default"
            :class="[routerName === 'Community' && 'active-link']"
            @click.native="deleteTSVuexData"
            v-if="
              !checkPermissionMultiple(
                [
                  'communities/search/all|POST',
                  'communities/search/my|POST',
                  'community-posts/search|POST'
                ],
                false
              )
            "
          >
            <app-router-item icon="mdi-flag" title="Threat Sharing" />
          </router-link>

          <v-list-group
            prepend-icon="mdi-hook"
            id="btn--link-navigator-menu-phishing-simulator-list-group"
            no-action
            :class="['menu-with-item menu-link-default hook-menu', getPhishingSimulatorPermissions]"
            v-if="checkPhishingSimulatorPermissions()"
          >
            <template v-slot:activator>
              <v-list-item-content class="menu-list-item">
                <v-list-item-title>Phishing Simulator</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              style="padding-left: 0 !important; margin-left: -5px;"
              v-if="checkPermissionMultiple(['phishing-simulator/email-templates|POST'])"
            >
              <v-list-item-content class="menu-item-content">
                <router-link
                  to="/phishing-scenarios"
                  id="btn--link-navigator-menu-phishing-scenario"
                  class="menu-link-default"
                  :class="[routerName === 'Phishing Scenarios' && 'active-link']"
                >
                  <v-list-item-title class="menu-item-wrapper">
                    <span class="menu-item-span">Phishing Scenarios</span>
                  </v-list-item-title>
                </router-link>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>

          <v-list-group
            prepend-icon="mdi-flash"
            id="btn--link-navigator-menu-incident-responder-list-group"
            no-action
            :class="['menu-with-item menu-link-default', getIncidentResponderClasses]"
            v-if="checkIncidentResponderPermissions()"
          >
            <template v-slot:activator>
              <v-list-item-content class="menu-list-item">
                <v-list-item-title>Incident Responder</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              style="padding-left: 0 !important; margin-left: -5px;"
              v-if="
                checkPermissionMultiple([
                  'ir/dashboard/running-investigations|GET',
                  'companies/roi-settings|GET',
                  'ir/dashboard/top-rules|GET',
                  'notified-emails/search|POST',
                  'is/dashboard/summary|POST',
                  'is/dashboard/search-log|POST',
                  'is/dashboard/search-stats|POST',
                  'notify/result|POST'
                ])
              "
            >
              <v-list-item-content class="menu-item-content">
                <router-link
                  to="/incident-responder"
                  id="btn--link-navigator-menu-incident-responder"
                  class="menu-link-default"
                  :class="[
                    (routerName === 'Analysis Details' || routerName === 'Incident Responder') &&
                      'active-link'
                  ]"
                >
                  <v-list-item-title class="menu-item-wrapper">
                    <span class="menu-item-span">Incident Responder</span>
                  </v-list-item-title>
                </router-link>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              style="padding-left: 0 !important; margin-left: -5px;"
              v-if="checkPermissionMultiple(['investigations/search|POST'])"
            >
              <v-list-item-content class="menu-item-content">
                <router-link
                  to="/investigations"
                  class="menu-link-default"
                  id="btn--link-navigator-menu-investigations"
                  :class="[
                    (routerName === 'Investigation Details' || routerName === 'Investigations') &&
                      'active-link'
                  ]"
                >
                  <v-list-item-title class="menu-item-wrapper">
                    <span class="menu-item-span">Investigations</span>
                  </v-list-item-title>
                </router-link>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              style="padding-left: 0 !important; margin-left: -5px;"
              v-if="checkPermissionMultiple(['analysis-engines/search|POST'])"
            >
              <v-list-item-content class="menu-item-content">
                <router-link
                  to="/integrations"
                  id="btn--link-navigator-menu-integrations"
                  :class="['menu-link-default', routerName === 'Integrations' && 'active-link']"
                >
                  <v-list-item-title class="menu-item-wrapper">
                    <span class="menu-item-span">Integrations</span>
                  </v-list-item-title>
                </router-link>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              style="padding-left: 0 !important; margin-left: -5px;"
              v-if="checkPermissionMultiple(['playbooks/search|POST'])"
            >
              <v-list-item-content class="menu-item-content">
                <router-link
                  to="/playbook"
                  id="btn--link-navigator-menu-playbook"
                  :class="['menu-link-default', routerName === 'Playbook' && 'active-link']"
                >
                  <v-list-item-title class="menu-item-wrapper">
                    <span class="menu-item-span">Playbook</span>
                  </v-list-item-title>
                </router-link>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              style="padding-left: 0 !important; margin-left: -5px;"
              v-if="checkPermissionMultiple(['mail-configurations/search|POST'])"
            >
              <v-list-item-content class="menu-item-content">
                <router-link
                  to="/mailConfiguration"
                  id="btn--link-navigator-menu-mail-configuration"
                  :class="[
                    'menu-link-default',
                    routerName === 'Mail Configurations' && 'active-link'
                  ]"
                >
                  <v-list-item-title class="menu-item-wrapper">
                    <span class="menu-item-span">Mail Configurations</span>
                  </v-list-item-title>
                </router-link>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              style="padding-left: 0 !important; margin-left: -5px;"
              v-if="
                checkPermissionMultiple([
                  'is/dashboard/summary|POST',
                  'is/dashboard/search-log|POST',
                  'is/dashboard/search-stats|POST',
                  'notify/result|POST'
                ])
              "
            >
              <v-list-item-content class="menu-item-content">
                <router-link
                  to="/sandbox"
                  id="btn--link-navigator-menu-sandbox"
                  :class="[
                    'menu-link-default',
                    routerName === 'Cross Company Integration' && 'active-link'
                  ]"
                >
                  <v-list-item-title class="menu-item-wrapper">
                    <span class="menu-item-span">Cross Company Integration</span>
                  </v-list-item-title>
                </router-link>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>

          <router-link
            to="/phishing-reporter"
            id="btn--link-navigator-phishing-reporter"
            class="menu-link-default"
            :class="[routerName === 'Phishing Reporter' && 'active-link']"
            v-if="
              checkPermissionMultiple(['phishing-reporter/search|POST', 'phishing-reporter|GET'])
            "
          >
            <app-router-item icon="mdi-account-voice" title="Phishing Reporter" />
          </router-link>
          <v-list-group
            id="btn--link-navigator-menu-company-list-group"
            prepend-icon="mdi-briefcase-variant"
            no-action
            :class="['menu-with-item menu-link-default', getCompanyClasses]"
          >
            <template v-slot:activator>
              <v-list-item-content class="menu-list-item">
                <v-list-item-title>Company</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              style="padding-left: 0 !important; margin-left: -5px;"
              v-if="
                checkPermissionMultiple(['target-users/search|POST', 'target-groups/search|POST'])
              "
            >
              <v-list-item-content class="menu-item-content">
                <router-link
                  to="/target-users"
                  id="btn--link-navigator-menu-target-users"
                  class="menu-link-default"
                  :class="[
                    (routerName === 'Target Group Users' || routerName === 'Target Users') &&
                      'active-link'
                  ]"
                >
                  <v-list-item-title class="menu-item-wrapper">
                    <span class="menu-item-span">Target Users</span>
                  </v-list-item-title>
                </router-link>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              style="padding-left: 0 !important; margin-left: -5px;"
              v-if="
                this.$store.state.auth.userRoleName !== 'CompanyAdmin' &&
                checkPermissionMultiple(['company-groups/search|POST', 'companies/search|POST'])
              "
            >
              <v-list-item-content class="menu-item-content">
                <router-link
                  to="/companies"
                  id="btn--link-navigator-menu-companies"
                  class="menu-link-default"
                  :class="[
                    (routerName === 'Company Group Details' || routerName === 'Companies') &&
                      'active-link'
                  ]"
                >
                  <v-list-item-title class="menu-item-wrapper">
                    <span class="menu-item-span">Companies</span>
                  </v-list-item-title>
                </router-link>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              style="padding-left: 0 !important; margin-left: -5px;"
              v-if="
                checkPermissionMultiple([
                  'companies/smtp-settings/search|POST',
                  'roles/search|POST'
                ])
              "
            >
              <v-list-item-content class="menu-item-content">
                <router-link
                  to="/company-settings"
                  id="btn--link-navigator-menu-company-settings"
                  :class="['menu-link-default', routerName === 'Company Settings' && 'active-link']"
                >
                  <v-list-item-title class="menu-item-wrapper">
                    <span class="menu-item-span">Company Settings</span>
                  </v-list-item-title>
                </router-link>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              style="padding-left: 0 !important; margin-left: -5px;"
              v-if="checkPermissionMultiple(['system-users/search|POST'])"
            >
              <v-list-item-content class="menu-item-content">
                <router-link
                  to="/system-users"
                  id="btn--link-navigator-menu-system-users"
                  :class="['menu-link-default', routerName === 'System Users' && 'active-link']"
                >
                  <v-list-item-title class="menu-item-wrapper">
                    <span class="menu-item-span">System Users</span>
                  </v-list-item-title>
                </router-link>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              style="padding-left: 0 !important; margin-left: -5px;"
              :class="[routerName === 'Audit' && 'active-link']"
              v-if="checkPermissionMultiple(['audit-logs|POST'])"
            >
              <v-list-item-content class="menu-item-content" style="border: 0 !important;">
                <router-link
                  to="/audit"
                  id="btn--link-navigator-menu-audit-log"
                  class="menu-link-default"
                >
                  <v-list-item-title class="menu-item-wrapper">
                    <span class="menu-item-span">Audit Log</span>
                  </v-list-item-title>
                </router-link>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
        <navigation-drawer-footer :is-mini="getMini" :navigatorMenuProps="navigatorMenuProps" />
      </v-navigation-drawer>
    </div>

    <!-- Header Begin -->
    <v-app-bar
      class="page-header elevation-0 transparent"
      extension-height="100"
      app
      absolute
      flat
      :class="{ 'bg-blur': sessionCheck }"
    >
      <div class="page-header__details">
        <div class="page-header__content">
          <div class="page-header__title" id="text--router-name">
            <h1 v-if="routerName === 'Community'">
              <router-link
                :to="`/threat-sharing?detailsId=${communityId}`"
                v-if="communityId"
                class="page-header__title-link text-decoration-none"
                ref="communityNameRef"
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
              {{ companyGroupName || $route.params.name }}
            </h1>
            <h1 v-else-if="routerName === 'Target Group Users'">
              {{ getTargetGroupUsersRouterName }}
            </h1>
            <h1 v-else>{{ routerName }}</h1>
          </div>

          <Breadcrumb :base-name="getBreadCrumbBaseName" />
        </div>
      </div>
      <div class="page-header__actions">
        <v-menu
          v-if="false"
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
            <v-btn id="btn--dashboard-header-help-menu" icon color="white" v-on="on">
              <v-icon>mdi-help-circle</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in rightDropdownData"
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
                  :data-content="
                    item.text === 'Get Help'
                      ? `mailto:${supportEmailAddress || 'support@keepnetlabs.com'}`
                      : item.text === 'Documentation'
                      ? 'https://doc.keepnetlabs.com'
                      : ''
                  "
                  v-text="item.text"
                ></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>
    <!-- Header End -->
    <v-content
      :style="getMini ? 'padding-left: 63px' : 'padding-left: 285px'"
      :class="{ 'bg-blur': sessionCheck }"
    >
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
import offline from 'v-offline'
import ConnectionLost from '../components/ConnectionLost'
import SessionExpired from '../components/SessionExpired'
import SwitchAccount from '../components/SwitchAccount'
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
import Breadcrumb from '@/components/Breadcrumb'
import { checkPermission, checkPermissionMultiple } from '../utils/functions'
import labels from '@/model/constants/labels'
import { getCheckCompanyLicense } from '@/api/company'
import TargetUsersCheckLicenseDialog from '@/components/TargetUsers/TargetUsersCheckLicenseDialog'
import MainListItemLoading from '@/components/SkeletonLoading/MainListItemLoading'
import AppRouterItem from '@/layout/AppRouterItem'
import SecurityModal from '@/components/Security/SecurityModal'
import SettingsModal from '@/components/Settings/SettingsModal'
import NavigationDrawerFooter from '@/layout/NavigationDrawerFooter'

export default {
  name: 'Main',
  components: {
    NavigationDrawerFooter,
    SecurityModal,
    SettingsModal,
    AppRouterItem,
    FeedbackPopup,
    AppFooter,
    ConnectionLost,
    SessionExpired,
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
      isScroll: null,
      companyLicense: null,
      showLicenseExceededDialog: false,
      labels,
      switchDialogStatus: false,
      showNewPassword: false,
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
          return (
            pattern.test(value) ||
            'At least 8 characters with 1 capital letter, 1 lowercase letter, 1 number and 1 special character'
          )
        },
        equal: (v) => v === this.newPassword || "'New password' and 'Confirm password' do not match"
      },
      drawer: null,
      mini: null,
      dialog: true,
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
          content: 'Numbers of reported emails by category over time'
        },
        {
          target: '#Reporters',
          content:
            "Top reporters sorted by reliability score. Reliability score measures a user's credibility calculatted by accuracy of their reported emails that are detected harmful"
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
      sessionCheck: 'common/getSessionCheck',
      navigatorMenuProps: 'whitelabel/getNavigatorMenuProps',
      brandName: 'whitelabel/getBrandName',
      supportEmailAddress: 'whitelabel/getSupportEmailAddress'
    }),
    getBreadCrumbBaseName() {
      return this.brandName || this.$store.state.auth.selectedCompanyName
    },
    getTargetGroupUsersRouterName() {
      return this.$route.params.label || localStorage.getItem('lastTargetGroupUsers')
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
      return {
        'primary--text active-menu-parent':
          routerName === 'Company' ||
          routerName === 'Target Users' ||
          routerName === 'Companies' ||
          routerName === 'Company Settings' ||
          routerName === 'Company Group Details' ||
          routerName === 'Target Group Users' ||
          routerName === 'System Users' ||
          routerName === 'Audit',
        'un-selected-list-item':
          routerName !== 'Company' ||
          routerName === 'Target Users' ||
          routerName === 'Companies' ||
          routerName === 'Company Settings' ||
          routerName === 'System Users' ||
          routerName === 'Target Group Users' ||
          routerName === 'Company Group Details' ||
          routerName === 'Audit'
      }
    },
    getIncidentResponderClasses() {
      const routerName = this.routerName
      return {
        'primary--text active-menu-parent':
          routerName === 'Incident Responder' ||
          routerName === 'Investigations' ||
          routerName === 'Integrations' ||
          routerName === 'Playbook' ||
          routerName === 'Mail Configurations' ||
          routerName === 'Analysis Details' ||
          routerName === 'Investigation Details',
        'un-selected-list-item':
          routerName !== 'Incident Responder' ||
          routerName === 'Investigations' ||
          routerName === 'Integrations' ||
          routerName === 'Playbook' ||
          routerName === 'Analysis Details' ||
          routerName === 'Mail Configurations' ||
          routerName === 'Investigation Details'
      }
    },
    getPhishingSimulatorPermissions() {
      const routerName = this.routerName
      return {
        'primary--text active-menu-parent':
          routerName === 'Phishing Simulator' ||
          routerName === 'Email Templates' ||
          routerName === 'Phishing Scenarios',
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
      if (this.$store.state.auth.userRoleName === 'CompanyAdmin') return false
      let recFunction = () => {
        if (
          !localStorage.getItem('companyResourceId') ||
          !localStorage.getItem('selectedCompanyRequestId')
        ) {
          recFunction()
        }
      }
      recFunction()
      return (
        this.$store.state.auth.userRoleName !== 'CompanyAdmin' &&
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
    getLogoImage() {
      if (this.$store.state.auth.user == undefined) {
        return ''
      }
      let image =
        localStorage.getItem('isSelectCompany') === 'true'
          ? this.$store.state.dashboard.selectedCompanyObject.logoUrl
          : this.$store.state.auth.logoUrl
      return image || require('../assets/img/no-logo.png')
    },
    getMainLogo() {
      if (this.$store.state.auth.user == undefined) {
        return ''
      }
      let image = this.navigatorMenuProps.mainLogoUrl
      return image || require('../assets/img/no-logo.png')
    },
    getMiniLogo() {
      if (this.$store.state.auth.user == undefined) {
        return ''
      }
      let image = this.navigatorMenuProps.minimizedMenuLogoUrl
      return image || require('../assets/img/no-logo.png')
    },
    getFirstName() {
      if (this.$store.state.auth.user == undefined) {
        return ''
      }
      return this.$store.state.auth.user.firstName
    },
    getCompanyName() {
      if (this.$store.state.auth.companyName == undefined) {
        return ''
      }
      return (
        this.$store.state.dashboard.selectedCompanyObject.name || this.$store.state.auth.companyName
      )
    },
    getSelectedCompanyName() {
      if (this.$store.state.auth.companyName == undefined) {
        return ''
      }
      return this.$store.state.auth.selectedCompanyName
    },
    getRolename() {
      if (this.$store.state.auth.userRoleName == undefined) {
        return ''
      }
      return this.$store.state.auth.userRoleName
    },
    getDrawerPadding2() {
      if (this.mini) {
        return 'left: 5px !important;'
      }
      return 'left : 244px !important;'
      if (this.drawer) {
        return 'left: 244px !important;'
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
    },
    openPasswordChange(newVal, oldVal) {
      if (!newVal) {
        this.show1 = false
        this.show2 = false
        this.showNewPassword = false
      }
    },
    $route: {
      handler: function (to, from) {
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
    this.$nextTick(() => {
      if (AuthenticationService.isAuthenticated()) {
        this.getCurrentUser() //@iceman login
        //adding resourceId to fullstory
        if (this.$FullStory) {
          this.$FullStory.identify(this.$store.state['auth'].user.id)
          this.$FullStory.setUserVars({ companyId: this.$store.state['auth'].selectedCompanyId })
        }
        this.$store.dispatch('whitelabel/callForData')
        this.$store.dispatch('whitelabel/callForSystemVersion')
        this.callForLicenseCheck()
        //this.getNotifications()
        this.interval = setInterval(() => {
          if (!this.isDisconnected) {
            clearInterval(this.interval)
          }
          //this.sessionCheck = AuthenticationService.isExpired()
        }, 20000)
      }
    })
    setTimeout(() => {
      let contentDom = document.getElementsByClassName('v-navigation-drawer__content')[0]
      if (contentDom) {
        document
          .getElementsByClassName('v-navigation-drawer__content')[0]
          .addEventListener('scroll', (event) => {
            this.scroll()
          })
      }
    }, 500)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  updated() {
    this.routerName === 'Company Group Details' && this.getCompanyGroupName()
  },
  methods: {
    ...mapActions({
      getCurrentUser: 'auth/getCurrentUser'
    }),
    changeSettings() {
      this.showSettingsModalStatus = !this.showSettingsModalStatus
    },
    changePasswordChange() {
      this.openPasswordChange = !this.openPasswordChange
    },
    scroll() {
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
      return _class
    },
    checkDashboardPermission() {
      return checkPermissionMultiple([
        'dashboard/widgets|GET',
        'dashboard/widgets|POST',
        'community-posts/top-posts|GET',
        'notified-emails/search|POST',
        'dashboard/summary|GET',
        'dashboard/reported-email-trends|POST',
        'ir/dashboard/summary|GET',
        'ir/dashboard/top-rules|GET',
        'ir/dashboard/running-investigations|GET',
        'community-posts/search|POST'
      ])
    },
    checkIncidentResponderPermissions() {
      return checkPermissionMultiple([
        'ir/dashboard/running-investigations|GET',
        'companies/roi-settings|GET',
        'ir/dashboard/top-rules|GET',
        'notified-emails/search|POST',
        'investigations/search|POST',
        'analysis-engines/search|POST',
        'playbooks/search|POST',
        'mail-configurations/search|POST'
      ])
    },
    checkPhishingSimulatorPermissions() {
      return checkPermissionMultiple(['phishing-simulator/email-templates|POST'])
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
    callForLicenseCheck() {
      if (this.$route.name !== 'Target Users') {
        const companyResourceId = localStorage.getItem('companyId')
        getCheckCompanyLicense(companyResourceId).then((response) => {
          const { data: { data = {} } = {} } = response
          const { isLicenseExceeded, licenseLimit, totalUserCount, isLimited } = data
          this.companyLicense = data
          if (isLimited && isLicenseExceeded) {
            this.showLicenseExceededDialog = true
          }
        })
      }
    },
    checkPermissionMultiple(data, contain) {
      return checkPermissionMultiple(data, contain)
    },
    removeTooltip() {
      this.$refs.accountTooltip.isActive = false
    },
    setDropdownDivider(item) {
      if (item.value === 'switchCompany') {
        return (
          this.$store.state.auth.userRoleName !== 'CompanyAdmin' && !this.isReturnMainAccountVisible
        )
      } else if (item.value === 'returnToMainAccount') {
        return item.value === 'returnToMainAccount' && this.isReturnMainAccountVisible
      } else {
        return false
      }
    },
    setDropdownVisibility(item) {
      if (item.value === 'switchCompany') {
        return this.$store.state.auth.userRoleName !== 'CompanyAdmin'
      } else if (item.value === 'returnToMainAccount') {
        return item.value === 'returnToMainAccount' && this.isReturnMainAccountVisible
      } else {
        return true
      }
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
    handleClickRightDropdown(item = { text: '' }) {
      const { text } = item
      const domElem = document.createElement('a')
      switch (text) {
        case 'Tour':
          this.tourSafeStarter('tourDashboard')
          break
        case 'Feedback':
          this.feedbackdialog = true
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
    margin: 16px 0 !important;
    .v-toolbar__content {
      justify-content: space-between;
      padding-left: 8px;
      padding-right: 0;
    }
    &__details {
      max-width: 85%;
    }
    &__actions {
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
        width: 100%;
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

    //::-webkit-scrollbar-track {}

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
    }
    &__logo-wrapper {
      max-width: 150px;
      max-height: 48px;
      margin: 24px 24px 16px;
      &__logo {
        max-height: 48px;
      }
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
      margin-right: -4px !important;
    }
    .v-list-group__header__append-icon {
      margin-left: 6px !important;
      min-width: 24px !important;
      margin-right: -4px !important;
      margin-bottom: 0 !important;
      margin-top: 0px !important;
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
      color: rgba(0, 0, 0, 0.87);
      // border: solid red 1px;
    }
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
        max-width: 60px;
        max-height: 60px;
        border-radius: 40px;
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
      display: flex;
      height: 60px;
      cursor: pointer;
    }
  }

  .user-wrapper {
    //margin: 0 0 88px;
    background: white;
    padding: 8px;
    &__scroll-on {
      box-shadow: 0px 2px 3px 0 rgb(142 142 142 / 20%);
    }
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
    // min-height: calc(100vh - 46px);
    height: 100%;
    margin-top: 16px;
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
    max-width: 48px;
    max-height: 48px;
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
    padding-left: 72px;
    height: 36px !important;
    margin-right: 30px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
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
    border-width: 0px 0.9rem 0.9rem 0.9rem !important;
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
</style>
