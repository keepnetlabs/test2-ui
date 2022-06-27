import PERMISSIONS from '@/permissions'
import Vue from 'vue'
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
  EXCLUDE_IP_ADDRESS_PERMISSIONS,
  INCIDENT_RESPONDER_OTHER_PERMISSIONS,
  INVESTIGATION_PERMISSIONS,
  INTEGRATION_PERMISSIONS,
  ADVANCED_SETTINGS_PERMISSIONS,
  MAIL_CONFIGURATION_PERMISSIONS,
  PHISHING_REPORTER_PERMISSIONS,
  TARGET_USERS_PERMISSIONS,
  TARGET_GROUPS_PERMISSIONS,
  COMPANIES_PERMISSIONS,
  COMPANY_GROUPS_PERMISSIONS,
  SMTP_SETTINGS_PERMISSIONS,
  NOTIFICATION_TEMPLATES_PERMISSIONS,
  REST_API_PERMISSIONS,
  WHITE_LABEL_PERMISSIONS,
  PROXY_SETTINGS_PERMISSIONS,
  SAML_INTEGRATION_PERMISSIONS,
  SCIM_SETTINGS_PERMISSIONS,
  SIEM_INTEGRATION_PERMISSIONS,
  SYSTEM_USERS_PERMISSIONS,
  ROLES_PERMISSIONS,
  LDAP_PERMISSIONS
} = PERMISSIONS

const defaultState = {
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
  phishingReporterPermissions: PHISHING_REPORTER_PERMISSIONS,
  targetUsersPermissions: TARGET_USERS_PERMISSIONS,
  targetGroupsPermissions: TARGET_GROUPS_PERMISSIONS,
  companiesPermissions: COMPANIES_PERMISSIONS,
  companyGroupsPermissions: COMPANY_GROUPS_PERMISSIONS,
  smtpSettingsPermissions: SMTP_SETTINGS_PERMISSIONS,
  notificationTemplatesPermissions: NOTIFICATION_TEMPLATES_PERMISSIONS,
  restApiPermissions: REST_API_PERMISSIONS,
  whiteLabelingPermissions: WHITE_LABEL_PERMISSIONS,
  proxySettingsPermissions: PROXY_SETTINGS_PERMISSIONS,
  samlIntegrationPermissions: SAML_INTEGRATION_PERMISSIONS,
  scimSettingsPermissions: SCIM_SETTINGS_PERMISSIONS,
  siemIntegrationPermissions: SIEM_INTEGRATION_PERMISSIONS,
  systemUsersPermissions: SYSTEM_USERS_PERMISSIONS,
  systemRolesPermissions: ROLES_PERMISSIONS,
  ldapPermissions: LDAP_PERMISSIONS,
  excludeIpAddressPermissions: EXCLUDE_IP_ADDRESS_PERMISSIONS
}
let state = JSON.parse(localStorage.getItem('permissions')) || defaultState
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
    getThreatSharingGetIncidentsPermission(state) {
      return state?.threatSharingPermissions?.GET_INCIDENTS?.hasPermission
    },
    getThreatSharingGetMembersPermission(state) {
      return state?.threatSharingPermissions?.GET_MEMBERS?.hasPermission
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
    getExcludedIpAddressGetPermissions(state) {
      return state?.excludeIpAddressPermissions?.GET?.hasPermission
    },
    getExcludedIpAddressPostPermissions(state) {
      return state?.excludeIpAddressPermissions?.POST?.hasPermission
    },
    getIncidentResponderListGroupPermissions(state) {
      return state?.incidentResponderListGroupPermissions?.isOneOfThemPermitted
    },
    getIncidentResponderLeftMenuPermissions(state) {
      return state?.incidentResponderLeftMenuPermissions?.isOneOfThemPermitted
    },
    getInvestigationsSearchPermission(state) {
      return state?.incidentResponderListGroupPermissions?.INVESTIGATIONS?.hasPermission
    },
    getIntegrationsSearchPermission(state) {
      return state?.incidentResponderListGroupPermissions?.INTEGRATIONS?.hasPermission
    },
    getPlaybookSearchPermission(state) {
      return state?.incidentResponderListGroupPermissions?.PLAYBOOKS?.hasPermission
    },
    getMailConfigurationSearchPermission(state) {
      return state?.incidentResponderListGroupPermissions?.MAIL_CONFIGURATIONS?.hasPermission
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
    getCampaignReportsOpenedPermissions(state) {
      return state?.campaignReportsPermissions?.OPENED?.hasPermission
    },
    getCampaignReportsOpenedDetailsPermissions(state) {
      return state?.campaignReportsPermissions?.OPENED_DETAILS?.hasPermission
    },
    getCampaignReportsClickedPermissions(state) {
      return state?.campaignReportsPermissions?.CLICKED?.hasPermission
    },
    getCampaignReportsClickedDetailsPermissions(state) {
      return state?.campaignReportsPermissions?.CLICKED_DETAILS?.hasPermission
    },
    getCampaignReportsOpenedAttachmentPermissions(state) {
      return state?.campaignReportsPermissions?.OPENED_ATTACHMENT?.hasPermission
    },
    getCampaignReportsOpenedAttachmentDetailsPermissions(state) {
      return state?.campaignReportsPermissions?.OPENED_ATTACHMENT_DETAILS?.hasPermission
    },
    getCampaignReportsSubmittedDataPermissions(state) {
      return state?.campaignReportsPermissions?.SUBMITTED_DATA?.hasPermission
    },
    getCampaignReportsSubmittedDataDetailsPermissions(state) {
      return state?.campaignReportsPermissions?.SUBMITTED_DATA_DETAILS?.hasPermission
    },
    getCampaignReportsNoResponsePermissions(state) {
      return state?.campaignReportsPermissions?.NO_RESPONSE?.hasPermission
    },
    getCampaignReportsPhishingReporterPermissions(state) {
      return state?.campaignReportsPermissions?.PHISHING_REPORTER?.hasPermission
    },
    getCampaignReportsPhishingReporterDetailsPermissions(state) {
      return state?.campaignReportsPermissions?.PHISHING_REPORTER_DETAILS?.hasPermission
    },
    getCampaignReportsSendingReportPermissions(state) {
      return state?.campaignReportsPermissions?.SENDING_REPORT?.hasPermission
    },
    getCampaignReportsSendingReportDetailsPermissions(state) {
      return state?.campaignReportsPermissions?.SENDING_REPORT_DETAILS?.hasPermission
    },
    getCampaignReportsResendPermissions(state) {
      return state?.campaignReportsPermissions?.RESEND?.hasPermission
    },
    getCompanyLeftMenuPermissions(state) {
      return state?.companyLeftMenuPermissions?.isOneOfThemPermitted
    },
    getTargetUsersLeftMenuPermissions(state) {
      const { TARGET_USERS = {}, TARGET_GROUPS = {} } = state?.companyLeftMenuPermissions
      return TARGET_USERS?.hasPermission || TARGET_GROUPS?.hasPermission
    },
    getTargetUsersSearchPermissions(state) {
      return state?.targetUsersPermissions?.SEARCH?.hasPermission
    },
    getTargetUsersCreatePermissions(state) {
      return state?.targetUsersPermissions?.CREATE?.hasPermission
    },
    getTargetUsersEditPermissions(state) {
      return state?.targetUsersPermissions?.EDIT?.hasPermission
    },
    getTargetUsersDeletePermissions(state) {
      return state?.targetUsersPermissions?.DELETE?.hasPermission
    },
    getTargetGroupsSearchPermissions(state) {
      return state?.targetGroupsPermissions?.SEARCH?.hasPermission
    },
    getTargetGroupsCreatePermissions(state) {
      return state?.targetGroupsPermissions?.CREATE?.hasPermission
    },
    getTargetGroupsEditPermissions(state) {
      return state?.targetGroupsPermissions?.EDIT?.hasPermission
    },
    getTargetGroupsDeletePermissions(state) {
      return state?.targetGroupsPermissions?.DELETE?.hasPermission
    },
    getTargetGroupsDeleteUsersPermissions(state) {
      return state?.targetGroupsPermissions?.DELETE_USERS?.hasPermission
    },
    getCompaniesSearchPermissions(state) {
      return state?.companiesPermissions?.SEARCH?.hasPermission
    },
    getCompaniesCreatePermissions(state) {
      return state?.companiesPermissions?.CREATE?.hasPermission
    },
    getCompaniesEditPermissions(state) {
      return state?.companiesPermissions?.EDIT?.hasPermission
    },
    getCompaniesDeletePermissions(state) {
      return state?.companiesPermissions?.DELETE?.hasPermission
    },
    getCompanyGroupsSearchPermissions(state) {
      return state?.companyGroupsPermissions?.SEARCH?.hasPermission
    },
    getCompanyGroupsCreatePermissions(state) {
      return state?.companyGroupsPermissions?.CREATE?.hasPermission
    },
    getCompanyGroupsEditPermissions(state) {
      return state?.companyGroupsPermissions?.EDIT?.hasPermission
    },
    getCompanyGroupsDeletePermissions(state) {
      return state?.companyGroupsPermissions?.DELETE?.hasPermission
    },
    getCompaniesLeftMenuPermissions(state) {
      const { COMPANIES = {}, COMPANY_GROUPS = {} } = state?.companyLeftMenuPermissions
      return COMPANIES?.hasPermission || COMPANY_GROUPS?.hasPermission
    },
    getCompanySettingsLeftMenuPermissions(state, getters) {
      return (
        getters?.getRestApiSearchPermissions ||
        getters?.getNotificationTemplatesSearchPermissions ||
        getters?.getWhiteLabelingGetPermissions ||
        getters?.getSMTPSettingsSearchPermissions ||
        getters?.getProxySettingsSearchPermissions ||
        getters?.getSAMLIntegrationSearchPermissions ||
        getters?.getSCIMSettingsSearchPermissions ||
        getters?.getSIEMIntegrationSearchPermissions
      )
    },
    getSMTPSettingsSearchPermissions(state) {
      return state?.smtpSettingsPermissions?.SEARCH?.hasPermission
    },
    getSMTPSettingsCreatePermissions(state) {
      return state?.smtpSettingsPermissions?.CREATE?.hasPermission
    },
    getSMTPSettingsUpdatePermissions(state) {
      return state?.smtpSettingsPermissions?.UPDATE?.hasPermission
    },
    getSMTPSettingsDeletePermissions(state) {
      return state?.smtpSettingsPermissions?.DELETE?.hasPermission
    },
    getSMTPSettingsGetPermissions(state) {
      return state?.smtpSettingsPermissions?.GET?.hasPermission
    },
    getSMTPSettingsExportPermissions(state) {
      return state?.smtpSettingsPermissions?.EXPORT?.hasPermission
    },
    getNotificationTemplatesSearchPermissions(state) {
      return state?.notificationTemplatesPermissions?.SEARCH?.hasPermission
    },
    getNotificationTemplatesCreatePermissions(state) {
      return state?.notificationTemplatesPermissions?.CREATE?.hasPermission
    },
    getNotificationTemplatesUpdatePermissions(state) {
      return state?.notificationTemplatesPermissions?.EDIT?.hasPermission
    },
    getNotificationTemplatesDeletePermissions(state) {
      return state?.notificationTemplatesPermissions?.DELETE?.hasPermission
    },
    getNotificationTemplatesGetPermissions(state) {
      return state?.notificationTemplatesPermissions?.GET?.hasPermission
    },
    getNotificationTemplatesExportPermissions(state) {
      return state?.notificationTemplatesPermissions?.EXPORT?.hasPermission
    },
    getNotificationTemplatesMakeDefaultPermissions(state) {
      return state?.notificationTemplatesPermissions?.MAKE_DEFAULT?.hasPermission
    },
    getRestApiSearchPermissions(state) {
      return state?.restApiPermissions?.SEARCH?.hasPermission
    },
    getRestApiCreatePermissions(state) {
      return state?.restApiPermissions?.CREATE?.hasPermission
    },
    getRestApiUpdatePermissions(state) {
      return state?.restApiPermissions?.UPDATE?.hasPermission
    },
    getRestApiDeletePermissions(state) {
      return state?.restApiPermissions?.DELETE?.hasPermission
    },
    getRestApiGetPermissions(state) {
      return state?.restApiPermissions?.GET?.hasPermission
    },
    getRestApiExportPermissions(state) {
      return state?.restApiPermissions?.EXPORT?.hasPermission
    },
    getWhiteLabelingGetPermissions(state) {
      return state?.whiteLabelingPermissions?.GET?.hasPermission
    },
    getWhiteLabelingUpdatePermissions(state) {
      return state?.whiteLabelingPermissions?.UPDATE?.hasPermission
    },
    getWhiteLabelingDeletePermissions(state) {
      return state?.whiteLabelingPermissions?.DELETE?.hasPermission
    },
    getProxySettingsSearchPermissions(state) {
      return state?.proxySettingsPermissions?.SEARCH?.hasPermission
    },
    getProxySettingsCreatePermissions(state) {
      return state?.proxySettingsPermissions?.CREATE?.hasPermission
    },
    getProxySettingsUpdatePermissions(state) {
      return state?.proxySettingsPermissions?.UPDATE?.hasPermission
    },
    getProxySettingsDeletePermissions(state) {
      return state?.proxySettingsPermissions?.DELETE?.hasPermission
    },
    getProxySettingsGetPermissions(state) {
      return state?.proxySettingsPermissions?.GET?.hasPermission
    },
    getProxySettingsExportPermissions(state) {
      return state?.proxySettingsPermissions?.EXPORT?.hasPermission
    },
    getProxySettingsTestPermissions(state) {
      return state?.proxySettingsPermissions?.TEST?.hasPermission
    },
    getSAMLIntegrationSearchPermissions(state) {
      return state?.samlIntegrationPermissions?.SEARCH?.hasPermission
    },
    getSAMLIntegrationCreatePermissions(state) {
      return state?.samlIntegrationPermissions?.CREATE?.hasPermission
    },
    getSAMLIntegrationUpdatePermissions(state) {
      return state?.samlIntegrationPermissions?.UPDATE?.hasPermission
    },
    getSAMLIntegrationDeletePermissions(state) {
      return state?.samlIntegrationPermissions?.DELETE?.hasPermission
    },
    getSAMLIntegrationGetPermissions(state) {
      return state?.samlIntegrationPermissions?.GET?.hasPermission
    },
    getSAMLIntegrationExportPermissions(state) {
      return state?.samlIntegrationPermissions?.EXPORT?.hasPermission
    },
    getSCIMSettingsSearchPermissions(state) {
      return state?.scimSettingsPermissions?.SEARCH?.hasPermission
    },
    getSCIMSettingsCreatePermissions(state) {
      return state?.scimSettingsPermissions?.CREATE?.hasPermission
    },
    getSCIMSettingsUpdatePermissions(state) {
      return state?.scimSettingsPermissions?.UPDATE?.hasPermission
    },
    getSCIMSettingsDeletePermissions(state) {
      return state?.scimSettingsPermissions?.DELETE?.hasPermission
    },
    getSCIMSettingsGetPermissions(state) {
      return state?.scimSettingsPermissions?.GET?.hasPermission
    },
    getSCIMSettingsExportPermissions(state) {
      return state?.scimSettingsPermissions?.EXPORT?.hasPermission
    },
    getSCIMSettingsRevokePermissions(state) {
      return state?.scimSettingsPermissions?.REVOKE?.hasPermission
    },
    getSCIMSettingsFieldsPermissions(state) {
      return state?.scimSettingsPermissions?.FIELDS?.hasPermission
    },
    getSIEMIntegrationSearchPermissions(state) {
      return state?.siemIntegrationPermissions?.SEARCH?.hasPermission
    },
    getSIEMIntegrationCreatePermissions(state) {
      return state?.siemIntegrationPermissions?.CREATE?.hasPermission
    },
    getSIEMIntegrationUpdatePermissions(state) {
      return state?.siemIntegrationPermissions?.UPDATE?.hasPermission
    },
    getSIEMIntegrationDeletePermissions(state) {
      return state?.siemIntegrationPermissions?.DELETE?.hasPermission
    },
    getSIEMIntegrationGetPermissions(state) {
      return state?.siemIntegrationPermissions?.GET?.hasPermission
    },
    getSIEMIntegrationExportPermissions(state) {
      return state?.siemIntegrationPermissions?.EXPORT?.hasPermission
    },
    getSIEMIntegrationPermissions(state, getters) {
      return {
        search: getters.getSIEMIntegrationSearchPermissions,
        create: getters.getSIEMIntegrationCreatePermissions,
        update: getters.getSIEMIntegrationUpdatePermissions,
        delete: getters.getSIEMIntegrationDeletePermissions,
        get: getters.getSIEMIntegrationGetPermissions,
        export: getters.getSIEMIntegrationExportPermissions
      }
    },
    getSystemUserSearchPermission(state) {
      const { SYSTEM_USERS = {}, ROLES = {} } = state?.companyLeftMenuPermissions
      return SYSTEM_USERS?.hasPermission || ROLES?.hasPermission
    },
    getSystemUsersSearchPermission(state) {
      return state?.systemUsersPermissions?.SEARCH?.hasPermission
    },
    getSystemUsersCreatePermission(state) {
      return state?.systemUsersPermissions?.CREATE?.hasPermission
    },
    getSystemUsersUpdatePermission(state) {
      return state?.systemUsersPermissions?.UPDATE?.hasPermission
    },
    getSystemUsersDeletePermission(state) {
      return state?.systemUsersPermissions?.DELETE?.hasPermission
    },
    getSystemUsersExportPermission(state) {
      return state?.systemUsersPermissions?.EXPORT?.hasPermission
    },
    getSystemRolesSearchPermission(state) {
      return state?.systemRolesPermissions?.SEARCH?.hasPermission
    },
    getSystemRolesCreatePermission(state) {
      return state?.systemRolesPermissions?.CREATE?.hasPermission
    },
    getSystemRolesUpdatePermission(state) {
      return state?.systemRolesPermissions?.UPDATE?.hasPermission
    },
    getSystemRolesDeletePermission(state) {
      return state?.systemRolesPermissions?.DELETE?.hasPermission
    },
    getSystemRolesExportPermission(state) {
      return state?.systemRolesPermissions?.EXPORT?.hasPermission
    },
    getAuditLogSearchPermission(state) {
      const { AUDIT_LOGS = {} } = state?.companyLeftMenuPermissions
      return AUDIT_LOGS?.hasPermission
    },
    getJobLogsSearchPermission(state) {
      const { JOB_LOGS = {} } = state?.companyLeftMenuPermissions
      return JOB_LOGS?.hasPermission
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
    getIncidentResponderROISettingGetPermission(state) {
      return state?.incidentResponderOtherPermissions?.GET_ROI_SETTINGS?.hasPermission
    },
    getIncidentResponderROISettingPostPermission(state) {
      return state?.incidentResponderOtherPermissions?.POST_ROI_SETTINGS?.hasPermission
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
    getLDAPDetailPermission(state) {
      return state?.ldapPermissions?.DETAIL?.hasPermission
    },
    getLDAPSettingCreatePermission(state) {
      return state?.ldapPermissions?.SETTING_CREATE?.hasPermission
    },
    getLDAPSettingUpdatePermission(state) {
      return state?.ldapPermissions?.SETTING_UPDATE?.hasPermission
    },
    getLDAPSettingSchedulePermission(state) {
      return state?.ldapPermissions?.SCHEDULE_SEARCH?.hasPermission
    },
    getLDAPFieldMappingPermissions(state) {
      const { FIELD_MAPPING_USERS, LDAP_FIELDS } = state?.ldapPermissions
      return FIELD_MAPPING_USERS?.hasPermission && LDAP_FIELDS?.hasPermission
    },
    getLDAPCreateConfigPermission(state) {
      return state?.ldapPermissions?.CREATE_CONFIG?.hasPermission
    },
    getLDAPScheduleUpdatePermission(state) {
      return state?.ldapPermissions?.SCHEDULE_UPDATE?.hasPermission
    },
    getLDAPScheduleDeletePermission(state) {
      return state?.ldapPermissions?.SCHEDULE_DELETE?.hasPermission
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
        widgets: getters?.getDashboardWidgetsPermission,
        phishingReporterCard: getters?.getPhishingReporterSummaryPermissions,
        roiSettingCard: getters?.getIncidentResponderROISettingGetPermission,
        recentCampaignsCard: getters?.getCampaignReportsGetPermissions,
        mostPhishedUsersCard: getters?.getCampaignReportsGetPermissions
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
        'phishingReporterPermissions',
        'targetUsersPermissions',
        'targetGroupsPermissions',
        'companiesPermissions',
        'companyGroupsPermissions',
        'smtpSettingsPermissions',
        'notificationTemplatesPermissions',
        'restApiPermissions',
        'whiteLabelingPermissions',
        'proxySettingsPermissions',
        'samlIntegrationPermissions',
        'scimSettingsPermissions',
        'siemIntegrationPermissions',
        'systemUsersPermissions',
        'systemRolesPermissions',
        'ldapPermissions',
        'excludeIpAddressPermissions'
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
    },
    RESET_STATE(state) {
      const defaultStateKeys = Object.keys(defaultState)
      for (const key of defaultStateKeys) {
        Vue.set(state, key, defaultState[key])
      }
    }
  },
  actions: {
    setPermissionsList({ commit, dispatch }, payload = []) {
      commit('SET_PERMISSIONS_LIST', payload)
      dispatch('setAllPermissions')
    },
    setAllPermissions({ commit }) {
      commit('SET_ALL_PERMISSIONS')
    },
    resetState({ commit }) {
      commit('RESET_STATE')
    }
  }
}

export default store
