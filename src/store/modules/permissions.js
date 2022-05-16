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
  INCIDENT_RESPONDER_OTHER_PERMISSIONS,
  INVESTIGATION_PERMISSIONS,
  INTEGRATION_PERMISSIONS,
  ADVANCED_SETTINGS_PERMISSIONS,
  MAIL_CONFIGURATION_PERMISSIONS
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
  incidentResponderOtherPermissions: INCIDENT_RESPONDER_OTHER_PERMISSIONS,
  investigationPermissions: INVESTIGATION_PERMISSIONS,
  integrationPermissions: INTEGRATION_PERMISSIONS,
  advancedSettingsPermissions: ADVANCED_SETTINGS_PERMISSIONS,
  mailConfigurationPermissions: MAIL_CONFIGURATION_PERMISSIONS
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
    getCampaignManagerLeftMenuPermissions(state) {
      return state?.campaignManagerLeftMenuPermissions?.isOneOfThemPermitted
    },
    getSettingsLeftMenuPermissions(state) {
      return state?.settingsLeftMenuPermissions?.isOneOfThemPermitted
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
    getReportsLeftMenuPermissions(state) {
      return state?.reportsLeftMenuPermissions?.isOneOfThemPermitted
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
    getIncidentResponderNotifiedEmailPermission(state) {
      return state?.incidentResponderListGroupPermissions?.NOTIFIED_EMAIL?.hasPermission
    },
    getIncidentResponderNotifiedEmailReAnalyze(state) {
      return state?.incidentResponderOtherPermissions?.RE_ANALYZE?.hasPermission
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
    getMailConfigurationPermissions() {
      return state?.mailConfigurationPermissions
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
        'investigationPermissions',
        'integrationPermissions',
        'advancedSettingsPermissions',
        'mailConfigurationPermissions'
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
