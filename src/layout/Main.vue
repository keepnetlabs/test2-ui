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
    <InitializeCompanyModal
      v-if="isShowInitializeCompanyModal"
      :status="isShowInitializeCompanyModal"
      @on-close="toggleShowInitializeCompanyModal"
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
      :dialog-body="getLicenseDialogBody"
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
    <AppDialog v-if="!isDisconnected" :status="!isDisconnected" :z-index="99999">
      <template #app-dialog-body>
        <div class="connection-lost-wrapper">
          <connection-lost @onIUnderstand="onIUnderstandClick($event)"></connection-lost>
        </div>
      </template>
      <template #app-dialog-footer>
        <div class="connection-lost-button d-flex flex-row flex-wrap justify-end">
          <v-btn text color="#2196f3" @click="onIUnderstandClick(true)">I UNDERSTAND</v-btn>
        </div>
      </template>
    </AppDialog>
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
              alt=""
              id="img--main-logo"
            />
            <div v-else>
              <img
                v-if="!!getLogoImage"
                id="img--main-mini-logo"
                class="menu-mini-img"
                alt="mini-logo"
                :src="getLogoImage"
              />
            </div>
          </div>
        </div>
        <div class="page-nav__simulated-company" v-if="isReturnMainAccountVisible">
          Managing as
        </div>
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
                        <img
                          v-if="!!getLogoImage"
                          id="img--company-logo"
                          alt="company-logo"
                          :src="getLogoImage"
                        />
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
                  <template v-for="item in dropdownData">
                    <v-list-item
                      v-if="setDropdownVisibility(item)"
                      :id="item.id"
                      :key="item.key"
                      :class="{
                        'user-name-dropdown__content--divider': setDropdownDivider(item)
                      }"
                      @click="changeDropdownItem(item.value)"
                    >
                      <v-list-item-title>
                        <v-icon>{{ item.icon }}</v-icon>
                        {{ item.text }}
                      </v-list-item-title>
                    </v-list-item>
                  </template>
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
        <div class="page-nav__simulated-company--mini" v-if="isReturnMainAccountVisible">
          M
        </div>
        <div class="v-responsive">
          <div v-if="mini && drawer">
            <img
              v-if="!!getMiniLogo"
              :src="getMiniLogo"
              class="menu-mini-img"
              alt="menu-mini-logo"
            />
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
            v-if="getThreatIntelligencePermissionsSearch"
            to="/threat-intelligence"
            id="btn--link-navigator-menu-threat-intelligence"
            :class="['menu-link-default', routerName === 'Threat Intelligence' && 'active-link']"
          >
            <app-router-item title="Threat Intelligence" icon="$threat-intelligence" />
          </router-link>

          <router-link
            v-if="getEtsQuickScanPermissionSearch"
            to="/email-threat-simulator"
            id="btn--link-navigator-menu-email-threat-simulator"
            :class="[
              'menu-link-default',
              (routerName === 'Email Threat Simulator' || routerName === 'Scan Report') &&
                'active-link'
            ]"
          >
            <app-router-item title="Email Threat Simulator" :icon="iconPaths.mdiShieldHalfFull" />
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
            :class="['menu-with-item menu-link-default hook-menu', getPhishingSimulatorClasses]"
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
                  :active-class-comparator="
                    () =>
                      routerName === 'Campaign Manager' ||
                      routerName === 'Campaign Reports' ||
                      routerName === 'Campaign Report'
                  "
                  @click="handlePhishingCampaignManagerClick"
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
            v-if="getCallbackSimulatorLeftMenuPermissions"
            id="btn--link-navigator-menu-callback-simulator-list-group"
            no-action
            :class="['menu-with-item menu-link-default', getCallbackSimulatorClasses]"
            prepend-icon="$callback"
            :append-icon="iconPaths.mdiChevronDown"
          >
            <template v-slot:activator>
              <v-list-item-content class="menu-list-item">
                <v-list-item-title>Callback Simulator</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-if="getCallbackScenarioLeftMenuPermissions"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/callback-simulator/callback-scenarios"
                  id="btn--link-navigator-menu-callback-scenarios"
                  route-name="Callback Scenarios"
                  :router-name="routerName"
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getCallbackCampaignManagerLeftMenuPermissions"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/callback-simulator/campaign-manager"
                  id="btn--link-navigator-menu-callback-campaign-manager"
                  route-name="Campaign Manager"
                  :active-class-comparator="
                    () =>
                      routerName === 'Callback Campaign Manager' || routerName === 'Callback Report'
                  "
                  @click="handleCallbackCampaignManagerClick"
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getCallbackSettingsLeftMenuPermissions"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/callback-simulator/settings"
                  id="btn--link-navigator-menu-callback-settings"
                  route-name="Settings"
                  :router-name="routerName"
                  :active-class-comparator="() => routerName === 'Callback Settings'"
                />
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-group
            v-if="getVishingLeftMenuPermissions"
            id="btn--link-navigator-menu-vishing-simulator-list-group"
            no-action
            :class="['menu-with-item menu-link-default vishing-menu', getVishingClasses]"
            :prepend-icon="iconPaths.mdiPhoneInTalk"
            :append-icon="iconPaths.mdiChevronDown"
          >
            <template v-slot:activator>
              <v-list-item-content class="menu-list-item">
                <v-list-item-title>Vishing Simulator</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-if="getVishingTemplatesLeftMenuPermissions"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/vishing/vishing-templates"
                  id="btn--link-navigator-menu-vishing-templates"
                  route-name="Vishing Templates"
                  :router-name="routerName"
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getVishingCampaignManagerLeftMenuPermissions"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/vishing/campaign-manager"
                  id="btn--link-navigator-menu-vishing-campaign-manager"
                  route-name="Vishing Campaign Manager"
                  route-text="Campaign Manager"
                  :router-name="routerName"
                  :active-class-comparator="
                    () =>
                      routerName === 'Vishing Campaign Manager' || routerName === 'Vishing Report'
                  "
                />
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-group
            v-if="getSmishingSimulatorLeftMenuPermissions"
            id="btn--link-navigator-menu-smishing-simulator-list-group"
            no-action
            prepend-icon="$smishing-simulator"
            :class="['menu-with-item menu-link-default', getSmishingSimulatorClasses]"
            :append-icon="iconPaths.mdiChevronDown"
          >
            <template v-slot:activator>
              <v-list-item-content class="menu-list-item">
                <v-list-item-title>Smishing Simulator</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-if="getSmishingScenariosLeftMenuPermissions"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/smishing-simulator/smishing-scenarios"
                  id="btn--link-navigator-menu-smishing-scenario"
                  route-name="Smishing Scenarios"
                  :router-name="routerName"
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getSmishingCampaignManagerLeftMenuPermissions"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/smishing-simulator/campaign-manager"
                  id="btn--link-navigator-menu-smishing-campaign-manager"
                  route-name="Campaign Manager"
                  :active-class-comparator="
                    () =>
                      routerName === 'Smishing Campaign Manager' || routerName === 'Smishing Report'
                  "
                  @click="handleSmishingCampaignManagerClick"
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getSmishingSettingsLeftMenuPermissions"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/smishing-simulator/settings"
                  id="btn--link-navigator-menu-smishing-dns-service"
                  route-name="Settings"
                  :router-name="routerName"
                  :active-class-comparator="() => routerName === 'Smishing Settings'"
                />
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-group
            v-if="getQuishingSimulatorLeftMenuPermissions"
            id="btn--link-navigator-menu-quishing-simulator-list-group"
            no-action
            :prepend-icon="getQuishingPrependIcon"
            :class="['menu-with-item menu-link-default', getQuishingSimulatorClasses]"
            :append-icon="iconPaths.mdiChevronDown"
          >
            <template #activator>
              <v-list-item-content class="menu-list-item">
                <v-list-item-title>Quishing Simulator</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-if="getQuishingScenarioLeftMenuPermissions"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/quishing-simulator/quishing-scenarios"
                  id="btn--link-navigator-menu-quishing-simulator"
                  route-name="Quishing Scenarios"
                  :router-name="routerName"
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getQuishingCampaignManagerLeftMenuPermissions"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/quishing-simulator/campaign-manager"
                  id="btn--link-navigator-menu-quishing-campaign-manager"
                  route-name="Campaign Manager"
                  :active-class-comparator="
                    () =>
                      routerName === 'Quishing Campaign Manager' || routerName === 'Quishing Report'
                  "
                  @click="handleQuishingCampaignManagerClick"
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getQuishingSettingsLeftMenuPermissions"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/quishing-simulator/settings"
                  id="btn--link-navigator-menu-quishing-dns-service"
                  route-name="Settings"
                  :router-name="routerName"
                  :active-class-comparator="() => routerName === 'Quishing Settings'"
                />
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-group
            v-if="getAwarenessEducatorListGroupPermissions"
            id="btn--link-navigator-menu-awareness-educator-list-group"
            :class="[
              'menu-with-item menu-link-default un-selected-list-item',
              getAwarenessEducatorClasses
            ]"
            no-action
            :prepend-icon="iconPaths.mdiBook"
            :append-icon="iconPaths.mdiChevronDown"
          >
            <template v-slot:activator>
              <v-list-item-content class="menu-list-item">
                <v-list-item-title>Awareness Educator</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-if="getTrainingSearchPermission"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/awareness-educator/training-library"
                  id="btn--link-navigator-menu-training-library"
                  route-name="Training Library"
                  :router-name="routerName"
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getEnrollmentsSearchPermission"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/awareness-educator/enrollments"
                  id="btn--link-navigator-menu-enrollments"
                  route-name="Enrollments"
                  :router-name="routerName"
                  :active-class-comparator="
                    () =>
                      routerName === 'Enrollments' ||
                      routerName === 'Training Report' ||
                      routerName === 'Scorm Proxy Report'
                  "
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getCertificatesSearchPermission"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/awareness-educator/certificates"
                  id="btn--link-navigator-menu-certificates"
                  route-name="Certificates"
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
            <template #activator>
              <v-list-item-content class="menu-list-item">
                <v-list-item-title>Reports</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-if="getAdvancedReportsSearchPermissions"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/reports/advanced-reports"
                  id="btn--link-navigator-menu-advanced-reports"
                  route-name="Advanced Reports"
                  :active-class-comparator="
                    () => routerName === 'Advanced Reports' || routerName === 'Advanced Report'
                  "
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getExecutiveReportsSearchPermissions"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/reports/executive-reports"
                  id="btn--link-navigator-menu-executive-reports"
                  route-name="Executive Reports"
                  :active-class-comparator="
                    () =>
                      routerName === 'Executive Reports' ||
                      routerName === 'Executive Report' ||
                      routerName === 'New Executive Report' ||
                      routerName === 'Preview Executive Report' ||
                      routerName === 'Edit Executive Report' ||
                      routerName === 'Duplicate Executive Report'
                  "
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getScheduledReportsSearchPermissions"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/reports/scheduled-reports"
                  id="btn--link-navigator-menu-scheduled-reports"
                  route-name="Scheduled Reports"
                  :active-class-comparator="
                    () => routerName === 'Scheduled Reports' || routerName === 'Scheduled Report'
                  "
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="getGamificationReportSearchPermissions"
              style="padding-left: 0 !important; margin-left: -5px;"
            >
              <v-list-item-content class="menu-item-content">
                <app-router-link
                  to="/reports/gamification-report"
                  id="btn--link-navigator-menu-gamification-report"
                  route-name="Gamification Report"
                  :active-class-comparator="() => routerName === 'Gamification Report'"
                />
              </v-list-item-content>
            </v-list-item>
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
            <h1 v-else-if="routerName === 'Training Report'">
              {{ getTrainingReportName }}
            </h1>
            <h1 v-else-if="routerName === 'Vishing Report'">
              {{ getVishingReportName }}
            </h1>
            <h1 v-else-if="routerName === 'Smishing Report'">
              {{ getSmishingReportName }}
            </h1>
            <h1 v-else-if="routerName === 'Quishing Report'">
              {{ getQuishingReportName }}
            </h1>
            <h1 v-else-if="routerName === 'Callback Report'">
              {{ getCallbackReportName }}
            </h1>
            <h1 v-else-if="routerName === 'Scorm Proxy Report'">
              {{ getScormProxyReportName }}
            </h1>

            <h1 v-else>{{ routerName }}</h1>
          </div>
          <Breadcrumb :base-name="getBreadCrumbBaseName" />
        </div>
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

    <!-- Chat Panel -->
  <ChatPanel v-if="isAwarenessEducator && isTestEnvironment" />
  </v-app>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import {
  mdiHome,
  mdiChevronRight,
  mdiFlag,
  mdiShieldHalfFull,
  mdiFlash,
  mdiHook,
  mdiChevronDown,
  mdiAccountVoice,
  mdiEqualizer,
  mdiBriefcaseVariant,
  mdiMenu,
  mdiHelpCircle,
  mdiPhoneInTalk,
  mdiBook,
  mdiSearchWeb
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
import InitializeCompanyModal from '@/components/Companies/InitializeCompanyModal'
import AppDialog from '@/components/AppDialog.vue'
import ChatPanel from '@/components/layout/ChatPanel.vue'

export default {
  name: 'Main',
  components: {
    AppDialog,
    InitializeCompanyModal,
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
    MainListItemLoading,
    ChatPanel
  },
  data() {
    return {
      isShowInitializeCompanyModal: false,
      showSettingsModalStatus: false,
      labels,
      navigationDrawerClass: '',
      iconPaths: {
        mdiHome,
        mdiChevronRight,
        mdiFlag,
        mdiShieldHalfFull,
        mdiFlash,
        mdiHook,
        mdiChevronDown,
        mdiAccountVoice,
        mdiEqualizer,
        mdiBriefcaseVariant,
        mdiMenu,
        mdiHelpCircle,
        mdiPhoneInTalk,
        mdiBook,
        mdiSearchWeb
      },
      switchDialogStatus: false,
      showNewPassword: false,
      openPasswordChange: false,
      communityId: null,
      baseUrl: null,
      communityName: null,
      companyGroupName: null,
      drawer: null,
      mini: null,
      isDisconnected: true,
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
      ]
    }
  },
  computed: {
    ...mapGetters({
      companyUpdateRequired: 'auth/companyUpdateRequired',
      isFeedbackPopupOpened: 'dashboard/isPopupOpened',
      isSwitchDialogOpen: 'dashboard/getIsSwitchDialogOpen',
      isLoadingFromStore: 'common/getIsLoading',
      navigatorMenuProps: 'whitelabel/getNavigatorMenuProps',
      brandName: 'whitelabel/getBrandName',
      supportEmailAddress: 'whitelabel/getSupportEmailAddress',
      showLicenseExceededDialog: 'whitelabel/getShowLicenseDialog',
      companyLicense: 'whitelabel/getCompanyLicense',
      getDashboardPermissions: 'permissions/getDashboardPermissions',
      getEtsQuickScanPermissionSearch: 'permissions/getEtsQuickScanPermissionSearch',
      getThreatSharingLeftMenuPermissions: 'permissions/getThreatSharingLeftMenuPermissions',
      getPhishingSimulatorLeftMenuPermissions:
        'permissions/getPhishingSimulatorLeftMenuPermissions',
      getPhishingScenarioLeftMenuPermissions: 'permissions/getPhishingScenarioLeftMenuPermissions',
      getVishingLeftMenuPermissions: 'permissions/getVishingLeftMenuPermissions',
      getVishingTemplatesLeftMenuPermissions: 'permissions/getVishingTemplatesLeftMenuPermissions',
      getVishingCampaignManagerLeftMenuPermissions:
        'permissions/getVishingCampaignManagerLeftMenuPermissions',
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
      getJobLogsSearchPermission: 'permissions/getJobLogsSearchPermission',
      getAwarenessEducatorListGroupPermissions:
        'permissions/getAwarenessEducatorListGroupPermissions',
      getTrainingSearchPermission: 'permissions/getTrainingSearchPermission',
      getEnrollmentsSearchPermission: 'permissions/getEnrollmentsSearchPermission',
      getCertificatesSearchPermission: 'permissions/getCertificatesSearchPermission',
      getThreatIntelligencePermissionsSearch: 'permissions/getThreatIntelligencePermissionsSearch',
      getAdvancedReportsSearchPermissions: 'permissions/getAdvancedReportsSearchPermissions',
      getExecutiveReportsSearchPermissions: 'permissions/getExecutiveReportsSearchPermissions',
      getScheduledReportsSearchPermissions: 'permissions/getScheduledReportsSearchPermissions',
      getCampaignReportsSearchPermissions: 'permissions/getCampaignReportsSearchPermissions',
      getSmishingSimulatorLeftMenuPermissions:
        'permissions/getSmishingSimulatorLeftMenuPermissions',
      getSmishingScenariosLeftMenuPermissions:
        'permissions/getSmishingScenariosLeftMenuPermissions',
      getSmishingCampaignManagerLeftMenuPermissions:
        'permissions/getSmishingCampaignManagerLeftMenuPermissions',
      getSmishingSettingsLeftMenuPermissions: 'permissions/getSmishingSettingsLeftMenuPermissions',
      getQuishingSimulatorLeftMenuPermissions:
        'permissions/getQuishingSimulatorLeftMenuPermissions',
      getQuishingCampaignManagerLeftMenuPermissions:
        'permissions/getQuishingCampaignManagerLeftMenuPermissions',
      getQuishingScenarioLeftMenuPermissions: 'permissions/getQuishingScenarioLeftMenuPermissions',
      getQuishingSettingsLeftMenuPermissions: 'permissions/getQuishingSettingsLeftMenuPermissions',
      getCallbackSimulatorLeftMenuPermissions:
        'permissions/getCallbackSimulatorLeftMenuPermissions',
      getCallbackCampaignManagerLeftMenuPermissions:
        'permissions/getCallbackCampaignManagerLeftMenuPermissions',
      getCallbackScenarioLeftMenuPermissions: 'permissions/getCallbackScenarioLeftMenuPermissions',
      getCallbackSettingsLeftMenuPermissions: 'permissions/getCallbackSettingsLeftMenuPermissions',
      getGamificationReportSearchPermissions: 'permissions/getGamificationReportSearchPermissions'
    }),
    getCompanyGroupName() {
      return this.routerName === 'Company Group Details'
        ? localStorage.getItem('companyGroupName')
        : ''
    },
    isShowSwitchCompany() {
      return ['Root', 'Reseller'].includes(this.$store.state.auth.userRoleName)
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
        routerName === 'Advanced Reports' ||
        routerName === 'Advanced Report' ||
        routerName === 'Executive Reports' ||
        routerName === 'Executive Report' ||
        routerName === 'New Executive Report' ||
        routerName === 'Preview Executive Report' ||
        routerName === 'Edit Executive Report' ||
        routerName === 'Duplicate Executive Report' ||
        routerName === 'Scheduled Reports' ||
        routerName === 'Scheduled Report' ||
        routerName === 'Gamification Report'
          ? 'primary--text active-menu-parent'
          : 'un-selected-list-item'
      ]
    },
    getQuishingPrependIcon() {
      return [
        'Quishing Scenarios',
        'Quishing Campaign Manager',
        'Quishing Settings',
        'Quishing Report'
      ].includes(this.routerName)
        ? '$qr-code-selected'
        : '$qr-code'
    },
    getCampaignReportName() {
      if (this.$store?.state?.common?.activePageRouterName) {
        return `Campaign Report - ${this.$store?.state?.common?.activePageRouterName}`
      }
      return 'Campaign Report'
    },
    getTrainingReportName() {
      if (this.$store?.state?.common?.activePageRouterName) {
        const type = this.$store?.state?.common?.activeTrainingType
        return `${type.startsWith('SCORM') ? 'Training' : type} Report - ${
          this.$store?.state?.common?.activePageRouterName
        }`
      }
      return 'Training Report'
    },
    getScormProxyReportName() {
      if (this.$store?.state?.common?.activePageRouterName) {
        return `Scorm Proxy Report - ${this.$store?.state?.common?.activePageRouterName}`
      }
      return 'Scorm Proxy Report'
    },
    getVishingReportName() {
      if (this.$store?.state?.common?.activePageRouterName) {
        return `Vishing Report - ${this.$store?.state?.common?.activePageRouterName}`
      }
      return 'Vishing Report'
    },
    getSmishingReportName() {
      if (this.$store?.state?.common?.activePageRouterName) {
        return `Smishing Report - ${this.$store?.state?.common?.activePageRouterName}`
      }
      return 'Smishing Report'
    },
    getQuishingReportName() {
      if (this.$store?.state?.common?.activePageRouterName) {
        return `Quishing Report - ${this.$store?.state?.common?.activePageRouterName}`
      }
      return 'Quishing Report'
    },
    getCallbackReportName() {
      if (this.$store?.state?.common?.activePageRouterName) {
        return `Callback Report - ${this.$store?.state?.common?.activePageRouterName}`
      }
      return 'Callback Report'
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
    getVishingClasses() {
      const routerName = this.routerName
      const isSelected =
        routerName === 'Vishing' ||
        routerName === 'Vishing Templates' ||
        routerName === 'Vishing Campaign Manager' ||
        routerName === 'Vishing Report'
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
    getCallbackSimulatorClasses() {
      const routerName = this.routerName
      return {
        'primary--text active-menu-parent':
          routerName === 'Callback Simulator' ||
          routerName === 'Callback Scenarios' ||
          routerName === 'Callback Campaign Manager' ||
          routerName === 'Callback Settings' ||
          routerName === 'Callback Report',
        'un-selected-list-item': routerName !== 'Callback Simulator'
      }
    },
    getPhishingSimulatorClasses() {
      const routerName = this.routerName
      return {
        'primary--text active-menu-parent':
          routerName === 'Phishing Simulator' ||
          routerName === 'Email Templates' ||
          routerName === 'Phishing Scenarios' ||
          routerName === 'Campaign Manager' ||
          routerName === 'Campaign Reports' ||
          routerName === 'Campaign Report' ||
          routerName === 'Settings',
        'un-selected-list-item':
          routerName !== 'Phishing Simulator' || routerName !== 'Email Templates'
      }
    },
    getSmishingSimulatorClasses() {
      const routerName = this.routerName
      return {
        'primary--text active-menu-parent':
          routerName === 'Smishing Simulator' ||
          routerName === 'Smishing Scenarios' ||
          routerName === 'Smishing Campaign Manager' ||
          routerName === 'Smishing Settings' ||
          routerName === 'Smishing Report',
        'un-selected-list-item': routerName !== 'Smishing Simulator'
      }
    },
    getQuishingSimulatorClasses() {
      const routerName = this.routerName
      return {
        'primary--text active-menu-parent':
          routerName === 'Quishing Simulator' ||
          routerName === 'Quishing Scenarios' ||
          routerName === 'Quishing Campaign Manager' ||
          routerName === 'Quishing Settings' ||
          routerName === 'Quishing Report',
        'un-selected-list-item': routerName !== 'Quishing Simulator'
      }
    },
    getAwarenessEducatorClasses() {
      const routerName = this.routerName
      return {
        'primary--text active-menu-parent':
          routerName === 'Training Library' ||
          routerName === 'Enrollments' ||
          routerName === 'Certificates' ||
          routerName === 'Training Report' ||
          routerName === 'Scorm Proxy Report',
        'un-selected-list-item':
          routerName !== 'Training Library' ||
          routerName !== 'Enrollments' ||
          routerName !== 'Certificates' ||
          routerName !== 'Training Report' ||
          routerName !== 'Scorm Proxy Report'
      }
    },
    getLicenseDialogBody() {
      return this.companyLicense
        ? `Your license allows to use the system with ${this.companyLicense.licenseLimit} target users. Current target user count is ${this.companyLicense.totalUserCount}.`
        : ''
    },
    isReturnMainAccountVisible() {
      if (!this.isShowSwitchCompany) return false
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
      return this.$route.name || ''
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
          const savedMini = localStorage.getItem('navigationMiniState')
          if (savedMini !== null) {
            return JSON.parse(savedMini)
          }
          return false
        }
        return this.mini
      },
      set(newValue) {
        this.mini = newValue
        localStorage.setItem('navigationMiniState', JSON.stringify(newValue))
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
      return this?.$store?.state?.auth?.user?.firstName || ''
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
    },
    isAwarenessEducator() {
      return this.$route.path.includes('/awareness-educator')
    },
    isTestEnvironment() {
      return window.location.hostname.includes('test-ui.devkeepnet.com')
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
    // Restore mini state from localStorage
    const savedMini = localStorage.getItem('navigationMiniState')
    if (savedMini !== null) {
      this.mini = JSON.parse(savedMini)
    }
    this.getNavigationDrawerClasses()
    this.$nextTick(() => {
      if (AuthenticationService.isAuthenticated()) {
        this.getCurrentUser()
        this.$store.dispatch('whitelabel/callForData')
        this.$store.dispatch('login/getCurrentCompany')
        this.callForSystemSummary()
        if (this.companyUpdateRequired) this.toggleShowInitializeCompanyModal()
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
    handlePhishingCampaignManagerClick() {
      this.$router.push('/phishing-simulator/campaign-manager?status=parent')
    },
    handleCallbackCampaignManagerClick() {
      this.$router.push('/callback-simulator/campaign-manager?status=parent')
    },
    handleSmishingCampaignManagerClick() {
      this.$router.push('/smishing-simulator/campaign-manager?status=parent')
    },
    handleQuishingCampaignManagerClick() {
      this.$router.push('/quishing-simulator/campaign-manager?status=parent')
    },
    toggleShowInitializeCompanyModal() {
      this.isShowInitializeCompanyModal = !this.isShowInitializeCompanyModal
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
        return this.isShowSwitchCompany && !this.isReturnMainAccountVisible
      } else if (item.value === 'returnToMainAccount') {
        return item.value === 'returnToMainAccount' && this.isReturnMainAccountVisible
      } else {
        return false
      }
    },
    setDropdownVisibility(item) {
      if (item.value === 'switchCompany') {
        return this.isShowSwitchCompany
      } else if (item.value === 'returnToMainAccount') {
        return item.value === 'returnToMainAccount' && this.isReturnMainAccountVisible
      } else {
        return true
      }
    },
    changeDropdownItem(item) {
      if (item === 'logout') {
        this.logoutUser()
        this.$store.dispatch('login/getWhiteLabelByUrl')
      }
      if (item === 'changePassword') {
        this.openPasswordChange = true
      }
      if (item === 'switchCompany') {
        this.setSwitchDialog(true)
      }
      if (item === 'returnToMainAccount') {
        let mainCompanyId = localStorage.getItem('companyResourceId')
        let mainCompanyName = localStorage.getItem('companyName')
        localStorage.setItem('isSelectCompany', false)
        localStorage.setItem('companyId', mainCompanyId)
        localStorage.setItem('companyRequestId', mainCompanyId)
        localStorage.setItem('selectedCompanyRequestId', mainCompanyId)
        localStorage.setItem('selectedCompanyName', mainCompanyName)
        this.$router.go(0)
      }
      if (item === 'changeSettings') {
        this.changeSettings()
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
