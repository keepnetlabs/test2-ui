import PERMISSIONS from '@/permissions'
const {
  PLAYBOOK_PERMISSIONS,
  DASHBOARD_PERMISSIONS,
  THREAT_SHARING_LEFT_MENU_PERMISSIONS,
  PHISHING_SIMULATOR_LEFT_MENU_PERMISSIONS,
  PHISHING_SCENARIO_LEFT_MENU_PERMISSIONS,
  CAMPAIGN_MANAGER_LEFT_MENU_PERMISSIONS,
  SETTINGS_LEFT_MENU_PERMISSIONS,
  INCIDENT_RESPONDER_LIST_GROUP_PERMISSIONS,
  INCIDENT_RESPONDER_LEFT_MENU_PERMISSIONS,
  PHISHING_REPORTER_LEFT_MENU_PERMISSIONS,
  REPORTS_LEFT_MENU_PERMISSIONS,
  COMPANY_LEFT_MENU_PERMISSIONS,
  THREAT_SHARING_PERMISSIONS,
  PHISHING_SCENARIO_PERMISSIONS,
  EMAIL_TEMPLATES_PERMISSIONS,
  LANDING_PAGE_TEMPLATES_PERMISSIONS,
  CAMPAIGN_MANAGER_PARENT,
  CAMPAIGN_REPORTS_PERMISSIONS,
  DOMAIN_PERMISSIONS,
  DNS_PERMISSIONS,
  INCIDENT_RESPONDER_OTHER_PERMISSIONS,
  INVESTIGATION_PERMISSIONS,
  INTEGRATION_PERMISSIONS,
  ADVANCED_SETTINGS_PERMISSIONS,
  MAIL_CONFIGURATION_PERMISSIONS,
  PHISHING_REPORTER_PERMISSIONS
} = PERMISSIONS
let state = JSON.parse(localStorage.getItem('permissions')) || {
  permissions: [],
  playbookPermissions: PLAYBOOK_PERMISSIONS,
  dashboardPermissions: DASHBOARD_PERMISSIONS,
  threatSharingPermissions: THREAT_SHARING_PERMISSIONS,
  threatSharingLeftMenuPermissions: THREAT_SHARING_LEFT_MENU_PERMISSIONS,
  phishingSimulatorLeftMenuPermissions: PHISHING_SIMULATOR_LEFT_MENU_PERMISSIONS,
  phishingScenarioLeftMenuPermissions: PHISHING_SCENARIO_LEFT_MENU_PERMISSIONS,
  campaignManagerLeftMenuPermissions: CAMPAIGN_MANAGER_LEFT_MENU_PERMISSIONS,
  settingsLeftMenuPermissions: SETTINGS_LEFT_MENU_PERMISSIONS,
  incidentResponderListGroupPermissions: INCIDENT_RESPONDER_LIST_GROUP_PERMISSIONS,
  incidentResponderLeftMenuPermissions: INCIDENT_RESPONDER_LEFT_MENU_PERMISSIONS,
  phishingReporterLeftMenuPermissions: PHISHING_REPORTER_LEFT_MENU_PERMISSIONS,
  reportsLeftMenuPermissions: REPORTS_LEFT_MENU_PERMISSIONS,
  companyLeftMenuPermissions: COMPANY_LEFT_MENU_PERMISSIONS,
  phishingScenariosPermissions: PHISHING_SCENARIO_PERMISSIONS,
  emailTemplatesPermissions: EMAIL_TEMPLATES_PERMISSIONS,
  landingPageTemplatesPermissions: LANDING_PAGE_TEMPLATES_PERMISSIONS,
  campaignManagerParentPermissions: CAMPAIGN_MANAGER_PARENT,
  campaignReportsPermissions: CAMPAIGN_REPORTS_PERMISSIONS,
  domainPermisisons: DOMAIN_PERMISSIONS,
  dnsPermissions: DNS_PERMISSIONS,
  incidentResponderOtherPermissions: INCIDENT_RESPONDER_OTHER_PERMISSIONS,
  investigationPermissions: INVESTIGATION_PERMISSIONS,
  integrationPermissions: INTEGRATION_PERMISSIONS,
  advancedSettingsPermissions: ADVANCED_SETTINGS_PERMISSIONS,
  mailConfigurationPermissions: MAIL_CONFIGURATION_PERMISSIONS,
  phishingReporterPermissions: PHISHING_REPORTER_PERMISSIONS
}
state = JSON.parse(JSON.stringify(state))
const store = {
  namespaced: true,
  state,
  getters: {
    getPermissions(state) {
      return state.permission
    },
    getDashboardPermissions(state) {
      return state?.dashboardPermissions?.isOneOfThemPermitted
    },
    getThreatSharingLeftMenuPermissions(state) {
      return state?.threatSharingLeftMenuPermissions?.isOneOfThemPermitted
    },
    getThreatSharingAllCommunitiesPermission(state) {
      return state?.threatSharingLeftMenuPermissions?.ALL_COMMUNITIES?.hasPermission
    },
    getThreatSharingMyCommunitiesPermission(state) {
      return state?.threatSharingLeftMenuPermissions?.MY_COMMUNITIES?.hasPermission
    },
    getThreatSharingCommunityPostsPermission(state) {
      return state?.threatSharingLeftMenuPermissions?.COMMUNITY_POSTS?.hasPermission
    },
    getThreatSharingMyInvitationsPermission(state) {
      return state?.threatSharingPermissions?.MY_INVITATIONS?.hasPermission
    },
    getThreatSharingCreateCommunityPermission(state) {
      return state?.threatSharingPermissions?.CREATE_COMMUNITY?.hasPermission
    },
    getThreatSharingEditCommunityPermission(state) {
      return state?.threatSharingPermissions?.EDIT_COMMUNITYT?.hasPermission
    },
    getThreatSharingLeaveCommunityPermission(state) {
      return state?.threatSharingPermissions?.LEAVE_COMMUNITYT?.hasPermission
    },
    getThreatSharingDeleteCommunityPermission(state) {
      return state?.threatSharingPermissions?.DELETE_COMMUNITY?.hasPermission
    },
    getThreatSharingInviteToCommunityPermission(state) {
      return state?.threatSharingPermissions?.INVITE_TO_COMMUNITY?.hasPermission
    },
    getThreatSharingSuggestedCommunitiesPermission(state) {
      return state?.threatSharingPermissions?.SUGGESTED_COMMUNITIES?.hasPermission
    },
    getThreatSharingPostIncidentPermission(state) {
      return state?.threatSharingPermissions?.POST_INCIDENT?.hasPermission
    },
    getThreatSharingMyLastPostsPermission(state) {
      return state?.threatSharingPermissions?.MY_LAST_POSTS?.hasPermission
    },
    getThreatSharingTopPostsPermission(state) {
      return state?.threatSharingPermissions?.TOP_POSTS?.hasPermission
    },
    getThreatSharingGetPostPermission(state) {
      return state?.threatSharingPermissions?.GET_POST?.hasPermission
    },
    getThreatSharingSharePostPermission(state) {
      return state?.threatSharingPermissions?.SHARE_POST?.hasPermission
    },
    getThreatSharingDeletePostPermission(state) {
      return state?.threatSharingPermissions?.DELETE_POST?.hasPermission
    },
    getThreatSharingCreateCommentPermission(state) {
      return state?.threatSharingPermissions?.CREATE_COMMENT?.hasPermission
    },
    getThreatSharingEditCommentPermission(state) {
      return state?.threatSharingPermissions?.EDIT_COMMENT?.hasPermission
    },
    getThreatSharingDeleteCommentPermission(state) {
      return state?.threatSharingPermissions?.DELETE_COMMENT?.hasPermission
    },
    getPhishingSimulatorLeftMenuPermissions(state) {
      return state?.phishingSimulatorLeftMenuPermissions?.isOneOfThemPermitted
    },
    getPhishingScenarioLeftMenuPermissions(state) {
      return state?.phishingScenarioLeftMenuPermissions?.isOneOfThemPermitted
    },
    getPhishingScenariosSearchPermissions(state) {
      return state?.phishingScenariosPermissions?.SEARCH?.hasPermission
    },
    getPhishingScenariosPreviewPermissions(state) {
      return state?.phishingScenariosPermissions?.PREVIEW?.hasPermission
    },
    getPhishingScenariosEditPermissions(state) {
      return state?.phishingScenariosPermissions?.EDIT?.hasPermission
    },
    getPhishingScenariosCreatePermissions(state) {
      return state?.phishingScenariosPermissions?.CREATE?.hasPermission
    },
    getPhishingScenariosDeletePermissions(state) {
      return state?.phishingScenariosPermissions?.DELETE?.hasPermission
    },
    getPhishingScenariosExportPermissions(state) {
      return state?.phishingScenariosPermissions?.EXPORT?.hasPermission
    },
    getEmailTemplatesSearchPermissions(state) {
      return state?.emailTemplatesPermissions?.SEARCH?.hasPermission
    },
    getEmailTemplatesPreviewPermissions(state) {
      return state?.emailTemplatesPermissions?.PREVIEW?.hasPermission
    },
    getEmailTemplatesEditPermissions(state) {
      return state?.emailTemplatesPermissions?.EDIT?.hasPermission
    },
    getEmailTemplatesCreatePermissions(state) {
      return state?.emailTemplatesPermissions?.CREATE?.hasPermission
    },
    getEmailTemplatesDeletePermissions(state) {
      return state?.emailTemplatesPermissions?.DELETE?.hasPermission
    },
    getEmailTemplatesExportPermissions(state) {
      return state?.emailTemplatesPermissions?.EXPORT?.hasPermission
    },
    getLandingPageTemplatesSearchPermissions(state) {
      return state?.landingPageTemplatesPermissions?.SEARCH?.hasPermission
    },
    getLandingPageTemplatesPreviewPermissions(state) {
      return state?.landingPageTemplatesPermissions?.PREVIEW?.hasPermission
    },
    getLandingPageTemplatesEditPermissions(state) {
      return state?.landingPageTemplatesPermissions?.EDIT?.hasPermission
    },
    getLandingPageTemplatesCreatePermissions(state) {
      return state?.landingPageTemplatesPermissions?.CREATE?.hasPermission
    },
    getLandingPageTemplatesDeletePermissions(state) {
      return state?.landingPageTemplatesPermissions?.DELETE?.hasPermission
    },
    getLandingPageTemplatesExportPermissions(state) {
      return state?.landingPageTemplatesPermissions?.EXPORT?.hasPermission
    },
    getCampaignManagerLeftMenuPermissions(state) {
      return state?.campaignManagerLeftMenuPermissions?.isOneOfThemPermitted
    },
    getCampaignManagerParentSearchPermissions(state) {
      return state?.campaignManagerParentPermissions?.SEARCH?.hasPermission
    },
    getCampaignManagerParentPreviewPermissions(state) {
      return state?.campaignManagerParentPermissions?.PREVIEW?.hasPermission
    },
    getCampaignManagerParentDeletePermissions(state) {
      return state?.campaignManagerParentPermissions?.DELETE?.hasPermission
    },
    getCampaignManagerParentGetPermissions(state) {
      return state?.campaignManagerParentPermissions?.GET?.hasPermission
    },
    getCampaignManagerParentCreatePermissions(state) {
      return state?.campaignManagerParentPermissions?.CREATE?.hasPermission
    },
    getCampaignManagerParentExportPermissions(state) {
      return state?.campaignManagerParentPermissions?.EXPORT?.hasPermission
    },
    getCampaignManagerParentUpdatePermissions(state) {
      return state?.campaignManagerParentPermissions?.UPDATE?.hasPermission
    },
    getSettingsLeftMenuPermissions(state) {
      return state?.settingsLeftMenuPermissions?.isOneOfThemPermitted
    },
    getDomainCreatePermissions(state) {
      return state?.domainPermisisons?.CREATE?.hasPermission
    },
    getDomainSearchPermissions(state) {
      return state?.domainPermisisons?.SEARCH?.hasPermission
    },
    getDomainUpdatePermissions(state) {
      return state?.domainPermisisons?.UPDATE?.hasPermission
    },
    getDomainDeletePermissions(state) {
      return state?.domainPermisisons?.DELETE?.hasPermission
    },
    getDomainGetPermissions(state) {
      return state?.domainPermisisons?.GET?.hasPermission
    },
    getDomainExportPermissions(state) {
      return state?.domainPermisisons?.EXPORT?.hasPermission
    },
    getDomainFormDetailsPermissions(state) {
      return state?.domainPermisisons?.FORM_DETAILS?.hasPermission
    },
    getDnsCreatePermissions(state) {
      return state?.dnsPermissions?.CREATE?.hasPermission
    },
    getDnsSearchPermissions(state) {
      return state?.dnsPermissions?.SEARCH?.hasPermission
    },
    getDnsUpdatePermissions(state) {
      return state?.dnsPermissions?.UPDATE?.hasPermission
    },
    getDnsDeletePermissions(state) {
      return state?.dnsPermissions?.DELETE?.hasPermission
    },
    getDnsGetPermissions(state) {
      return state?.dnsPermissions?.GET?.hasPermission
    },
    getDnsExportPermissions(state) {
      return state?.dnsPermissions?.EXPORT?.hasPermission
    },
    getIncidentResponderListGroupPermissions(state) {
      return state?.incidentResponderListGroupPermissions?.isOneOfThemPermitted
    },
    getIncidentResponderLeftMenuPermissions(state) {
      return state?.incidentResponderLeftMenuPermissions?.isOneOfThemPermitted
    },
    getInvestigationsSearchPermission(state) {
      return state?.incidentResponderLeftMenuPermissions?.INVESTIGATIONS?.hasPermission
    },
    getIntegrationsSearchPermission(state) {
      return state?.incidentResponderLeftMenuPermissions?.INTEGRATIONS?.hasPermission
    },
    getPlaybookSearchPermission(state) {
      return state?.incidentResponderLeftMenuPermissions?.PLAYBOOKS?.hasPermission
    },
    getMailConfigurationSearchPermission(state) {
      return state?.incidentResponderLeftMenuPermissions?.MAIL_CONFIGURATIONS?.hasPermission
    },
    getCrossCompanyPermissions(state) {
      const {
        SUMMARY = {},
        SEARCH_LOG = {},
        SEARCH_STATS = {},
        NOTIFY_RESULT = {}
      } = state?.incidentResponderListGroupPermissions
      return [
        SUMMARY?.hasPermission,
        SEARCH_LOG?.hasPermission,
        SEARCH_STATS?.hasPermission,
        NOTIFY_RESULT?.hasPermission
      ].some((permission) => permission)
    },
    getCrossCompanyPagePermissions() {
      const { SEARCH_LOG = {}, SEARCH_STATS = {} } = state?.incidentResponderListGroupPermissions
      return {
        SEARCH_LOG,
        SEARCH_STATS
      }
    },
    getPhishingReporterLeftMenuPermissions(state) {
      return state?.phishingReporterLeftMenuPermissions?.isOneOfThemPermitted
    },
    getPhishingReporterSearchPermissions(state) {
      return state?.phishingReporterPermissions?.SEARCH?.hasPermission
    },
    getPhishingReporterSummaryPermissions(state) {
      return state?.phishingReporterPermissions?.SUMMARY?.hasPermission
    },
    getPhishingReporterGetPermissions(state) {
      return state?.phishingReporterPermissions?.GET?.hasPermission
    },
    getPhishingReporterSavePermissions(state) {
      return state?.phishingReporterPermissions?.SAVE?.hasPermission
    },
    getPhishingReporterDeleteUserPermissions(state) {
      return state?.phishingReporterPermissions?.DELETE_USER?.hasPermission
    },
    getReportsLeftMenuPermissions(state) {
      return state?.reportsLeftMenuPermissions?.isOneOfThemPermitted
    },
    getCampaignReportsSearchPermissions(state) {
      return state?.campaignReportsPermissions?.SEARCH?.hasPermission
    },
    getCampaignReportsGetPermissions(state) {
      return state?.campaignReportsPermissions?.GET?.hasPermission
    },
    getCampaignReportsDeletePermissions(state) {
      return state?.campaignReportsPermissions?.DELETE?.hasPermission
    },
    getCompanyLeftMenuPermissions(state) {
      return state?.companyLeftMenuPermissions?.isOneOfThemPermitted
    },
    getTargetUsersLeftMenuPermissions(state) {
      const { TARGET_USERS = {}, TARGET_GROUPS = {} } = state?.companyLeftMenuPermissions
      return TARGET_USERS?.hasPermission || TARGET_GROUPS?.hasPermission
    },
    getCompaniesLeftMenuPermissions(state) {
      const { COMPANIES = {}, COMPANY_GROUPS = {} } = state?.companyLeftMenuPermissions
      return COMPANIES?.hasPermission || COMPANY_GROUPS?.hasPermission
    },
    getCompanySettingsLeftMenuPermissions(state) {
      const { ROLES = {}, SMTP_SETTINGS = {} } = state?.companyLeftMenuPermissions
      return ROLES?.hasPermission || SMTP_SETTINGS?.hasPermission
    },
    getSystemUserSearchPermission(state) {
      const { SYSTEM_USERS = {} } = state?.companyLeftMenuPermissions
      return SYSTEM_USERS?.hasPermission
    },
    getAuditLogSearchPermission(state) {
      const { AUDIT_LOG = {} } = state?.companyLeftMenuPermissions
      return AUDIT_LOG?.hasPermission
    },
    getIncidentResponderSummaryPermission(state) {
      return state?.dashboardPermissions?.IR_SUMMARY?.hasPermission
    },
    getIncidentResponderTopRulesPermission(state) {
      return state?.dashboardPermissions?.IR_TOP_RULES?.hasPermission
    },
    getIncidentResponderRunningInvestigationsPermission(state) {
      return state?.dashboardPermissions?.IR_RUNNING_INVESTIGATIONS?.hasPermission
    },
    getDashboardReportersPermission(state) {
      return state?.dashboardPermissions?.REPORTERS?.hasPermission
    },
    getDashboardReportedEmailTrendsPermission(state) {
      return state?.dashboardPermissions?.REPORTED_EMAIL_TRENDS?.hasPermission
    },
    getIncidentResponderNotifiedEmailPermission(state) {
      return state?.incidentResponderListGroupPermissions?.NOTIFIED_EMAIL?.hasPermission
    },
    getIncidentResponderNotifiedEmailReAnalyze(state) {
      return state?.incidentResponderOtherPermissions?.RE_ANALYZE?.hasPermission
    },
    getDashboardWidgetsPermission(state) {
      return state?.dashboardPermissions?.WIDGETS?.hasPermission
    },
    getInvestigationPermissions(state) {
      return state?.investigationPermissions
    },
    getIntegrationPermissions(state) {
      return state?.integrationPermissions
    },
    getAdvancedSettingsPermissions(state) {
      return state?.advancedSettingsPermissions
    },
    getPlaybookPermissions(state) {
      return state?.playbookPermissions
    },
    getMailConfigurationPermissions(state) {
      return state?.mailConfigurationPermissions
    },
    getWidgetsPermissions(state, getters) {
      return {
        runningInvestigation: getters?.getIncidentResponderRunningInvestigationsPermission,
        irSummary: getters?.getIncidentResponderSummaryPermission,
        communityPosts: getters?.getThreatSharingCommunityPostsPermission,
        topRules: getters?.getIncidentResponderTopRulesPermission,
        topPosts: getters?.getThreatSharingTopPostsPermission,
        reporters: getters?.getDashboardReportersPermission,
        reportedEmailTrends: getters?.getDashboardReportedEmailTrendsPermission,
        notifiedEmail: getters?.getIncidentResponderNotifiedEmailPermission,
        widgets: getters?.getDashboardWidgetsPermission
      }
    }
  },
  mutations: {
    SET_PERMISSIONS_LIST(state = {}, permissions = []) {
      state.permissions = permissions
    },
    SET_ALL_PERMISSIONS(state = {}) {
      const statePermissionKeys = [
        'playbookPermissions',
        'dashboardPermissions',
        'threatSharingPermissions',
        'threatSharingLeftMenuPermissions',
        'phishingSimulatorLeftMenuPermissions',
        'phishingScenarioLeftMenuPermissions',
        'campaignManagerLeftMenuPermissions',
        'settingsLeftMenuPermissions',
        'incidentResponderListGroupPermissions',
        'incidentResponderOtherPermissions',
        'incidentResponderLeftMenuPermissions',
        'phishingReporterLeftMenuPermissions',
        'reportsLeftMenuPermissions',
        'companyLeftMenuPermissions',
        'phishingScenariosPermissions',
        'emailTemplatesPermissions',
        'landingPageTemplatesPermissions',
        'campaignManagerParentPermissions',
        'campaignReportsPermissions',
        'domainPermisisons',
        'dnsPermissions',
        'investigationPermissions',
        'integrationPermissions',
        'advancedSettingsPermissions',
        'mailConfigurationPermissions',
        'phishingReporterPermissions'
      ]
      statePermissionKeys.map((key) => {
        const permissionObject = { ...state[key] }
        const permissions = Object.keys(permissionObject).filter(
          (key) => key !== 'isOneOfThemPermitted'
        )
        let isOneOfThemPermitted = false
        for (const permissionKey of permissions) {
          const permission = permissionObject[permissionKey]
          const { url, method } = permission
          permission.hasPermission = state.permissions.includes(`${url}|${method}`)
          if (permission.hasPermission) isOneOfThemPermitted = true
        }
        permissionObject.isOneOfThemPermitted = isOneOfThemPermitted
        state[key] = permissionObject
      })
      localStorage.setItem('permissions', JSON.stringify(state))
      console.log('state', state)
    }
  },
  actions: {
    setPermissionsList({ commit, dispatch }, payload = []) {
      commit('SET_PERMISSIONS_LIST', payload)
      dispatch('setAllPermissions')
    },
    setAllPermissions({ commit }) {
      commit('SET_ALL_PERMISSIONS')
    }
  }
}

export default store
