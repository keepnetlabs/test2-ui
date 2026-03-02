import PERMISSIONS from '@/permissions'
import Vue from 'vue'
const {
  PLAYBOOK_PERMISSIONS,
  DASHBOARD_PERMISSIONS,
  THREAT_SHARING_LEFT_MENU_PERMISSIONS,
  PHISHING_SIMULATOR_LEFT_MENU_PERMISSIONS,
  PHISHING_SCENARIO_LEFT_MENU_PERMISSIONS,
  CAMPAIGN_MANAGER_LEFT_MENU_PERMISSIONS,
  PHISHING_SCENARIO_PERMISSIONS,
  EMAIL_TEMPLATES_PERMISSIONS,
  LANDING_PAGE_TEMPLATES_PERMISSIONS,
  CAMPAIGN_MANAGER_PARENT,
  SETTINGS_LEFT_MENU_PERMISSIONS,
  QUISHING_SIMULATOR_LEFT_MENU_PERMISSIONS,
  QUISHING_SCENARIO_LEFT_MENU_PERMISSIONS,
  QUISHING_SCENARIO_PERMISSIONS,
  QUISHING_EMAIL_TEMPLATES_PERMISSIONS,
  QUISHING_LANDING_PAGE_TEMPLATES_PERMISSIONS,
  QUISHING_CAMPAIGN_MANAGER_LEFT_MENU_PERMISSIONS,
  QUISHING_SETTINGS_LEFT_MENU_PERMISSIONS,
  QUISHING_CAMPAIGN_MANAGER_PARENT,
  QUISHING_DNS_PERMISSIONS,
  QUISHING_DOMAIN_PERMISSIONS,
  QUISHING_EXCLUDE_IP_ADDRESS_PERMISSIONS,
  INCIDENT_RESPONDER_LIST_GROUP_PERMISSIONS,
  INCIDENT_RESPONDER_LEFT_MENU_PERMISSIONS,
  PHISHING_REPORTER_LEFT_MENU_PERMISSIONS,
  REPORTS_LEFT_MENU_PERMISSIONS,
  COMPANY_LEFT_MENU_PERMISSIONS,
  THREAT_SHARING_PERMISSIONS,
  CAMPAIGN_REPORTS_PERMISSIONS,
  QUISHING_CAMPAIGN_REPORTS_PERMISSIONS,
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
  GOOGLE_USER_PROVISION_PERMISSIONS,
  SCIM_SETTINGS_PERMISSIONS,
  MICROSOFT_TEAMS_SETTINGS_PERMISSIONS,
  SIEM_INTEGRATION_PERMISSIONS,
  SYSTEM_USERS_PERMISSIONS,
  ROLES_PERMISSIONS,
  LDAP_PERMISSIONS,
  VISHING_LEFT_MENU_PERMISSIONS,
  VISHING_TEMPLATES_PERMISSIONS,
  VISHING_CAMPAIGN_MANAGER_PERMISSIONS,
  VISHING_REPORTS_PERMISSIONS,
  AWARENESS_EDUCATOR_LIST_GROUP_PERMISSIONS,
  AWARENESS_EDUCATOR_PERMISSIONS,
  ETS_QUICK_SCAN_PERMISSIONS,
  ETS_ATTACK_VECTOR_PERMISSIONS,
  ETS_QUICK_SCAN_REPORT_PERMISSIONS,
  THREAT_INTELLIGENCE_PERMISSIONS,
  ALLOW_LIST_PERMISSIONS,
  AGENTIC_AI_SETTINGS_PERMISSIONS,
  AI_ALLY_SETTINGS_PERMISSIONS,
  DIRECT_EMAIL_CREATION_PERMISSIONS,
  ADVANCED_REPORTS_PERMISSIONS,
  EXECUTIVE_REPORTS_PERMISSIONS,
  SCHEDULED_REPORTS_PERMISSIONS,
  SMISHING_SIMULATOR_LEFT_MENU_PERMISSIONS,
  SMISHING_SCENARIOS_PERMISSIONS,
  SMISHING_TEXT_MESSAGE_TEMPLATES_PERMISSIONS,
  SMISHING_LANDING_PAGE_TEMPLATES_PERMISSIONS,
  SMISHING_CAMPAIGN_MANAGER_LEFT_MENU_PERMISSIONS,
  SMISHING_CAMPAIGN_MANAGER_PERMISSIONS,
  SMISHING_CAMPAIGN_JOB_PERMISSIONS,
  SMISHING_REPORT_PERMISSIONS,
  SMISHING_SETTINGS_LEFT_MENU_PERMISSIONS,
  SMISHING_DNS_PERMISSIONS,
  SMISHING_DOMAIN_PERMISSIONS,
  SMISHING_SCENARIOS_LEFT_MENU_PERMISSIONS,
  SMISHING_EXCLUDED_IP_PERMISSIONS,
  TRAINING_REPORTS_PERMISSIONS,
  CALLBACK_SIMULATOR_LEFT_MENU_PERMISSIONS,
  CALLBACK_SCENARIOS_LEFT_MENU_PERMISSIONS,
  CALLBACK_CAMPAIGN_MANAGER_LEFT_MENU_PERMISSIONS,
  CALLBACK_SETTINGS_LEFT_MENU_PERMISSIONS,
  CALLBACK_SCENARIOS_PERMISSIONS,
  CALLBACK_EMAIL_TEMPLATES_PERMISSIONS,
  CALLBACK_TEMPLATES_PERMISSIONS,
  CALLBACK_CAMPAIGN_MANAGER_PARENT,
  CALLBACK_CAMPAIGN_JOB_PERMISSIONS,
  CALLBACK_REPORT_PERMISSIONS,
  CALLBACK_SETTINGS_PERMISSIONS,
  GAMIFICATION_REPORT_PERMISSIONS
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
  quishingCampaignReportsPermissions: QUISHING_CAMPAIGN_REPORTS_PERMISSIONS,
  domainPermisisons: DOMAIN_PERMISSIONS,
  dnsPermissions: DNS_PERMISSIONS,
  aiAllySettingsPermissions: AI_ALLY_SETTINGS_PERMISSIONS,
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
  googleUserProvisionPermissions: GOOGLE_USER_PROVISION_PERMISSIONS,
  scimSettingsPermissions: SCIM_SETTINGS_PERMISSIONS,
  microsoftTeamsSettingsPermissions: MICROSOFT_TEAMS_SETTINGS_PERMISSIONS,
  siemIntegrationPermissions: SIEM_INTEGRATION_PERMISSIONS,
  systemUsersPermissions: SYSTEM_USERS_PERMISSIONS,
  systemRolesPermissions: ROLES_PERMISSIONS,
  ldapPermissions: LDAP_PERMISSIONS,
  excludeIpAddressPermissions: EXCLUDE_IP_ADDRESS_PERMISSIONS,
  vishingLeftMenuPermissions: VISHING_LEFT_MENU_PERMISSIONS,
  vishingTemplatesPermissions: VISHING_TEMPLATES_PERMISSIONS,
  vishingCampaignManagerPermissions: VISHING_CAMPAIGN_MANAGER_PERMISSIONS,
  vishingReportsPermissions: VISHING_REPORTS_PERMISSIONS,
  awarenessEducatorListGroupPermissions: AWARENESS_EDUCATOR_LIST_GROUP_PERMISSIONS,
  awarenessEducatorPermissions: AWARENESS_EDUCATOR_PERMISSIONS,
  etsQuickScanPermissions: ETS_QUICK_SCAN_PERMISSIONS,
  etsAttackVectorPermissions: ETS_ATTACK_VECTOR_PERMISSIONS,
  etsQuickScanReportPermissions: ETS_QUICK_SCAN_REPORT_PERMISSIONS,
  threatIntelligencePermissions: THREAT_INTELLIGENCE_PERMISSIONS,
  allowListPermissions: ALLOW_LIST_PERMISSIONS,
  agenticAISettingsPermissions: AGENTIC_AI_SETTINGS_PERMISSIONS,
  directEmailCreationPermissions: DIRECT_EMAIL_CREATION_PERMISSIONS,
  advancedReportsPermissions: ADVANCED_REPORTS_PERMISSIONS,
  executiveReportsPermissions: EXECUTIVE_REPORTS_PERMISSIONS,
  scheduledReportsPermissions: SCHEDULED_REPORTS_PERMISSIONS,
  smishingSimulatorLeftMenuPermissions: SMISHING_SIMULATOR_LEFT_MENU_PERMISSIONS,
  smishingScenariosLeftMenuPermissions: SMISHING_SCENARIOS_LEFT_MENU_PERMISSIONS,
  smishingScenariosPermissions: SMISHING_SCENARIOS_PERMISSIONS,
  smishingTextMessageTemplatesPermissions: SMISHING_TEXT_MESSAGE_TEMPLATES_PERMISSIONS,
  smishingLandingPageTemplatesPermissions: SMISHING_LANDING_PAGE_TEMPLATES_PERMISSIONS,
  smishingCampaignManagerLeftMenuPermissions: SMISHING_CAMPAIGN_MANAGER_LEFT_MENU_PERMISSIONS,
  smishingCampaignManagerPermissions: SMISHING_CAMPAIGN_MANAGER_PERMISSIONS,
  smishingCampaignJobPermissions: SMISHING_CAMPAIGN_JOB_PERMISSIONS,
  smishingReportPermissions: SMISHING_REPORT_PERMISSIONS,
  smishingSettingsLeftMenuPermissions: SMISHING_SETTINGS_LEFT_MENU_PERMISSIONS,
  smishingDnsPermissions: SMISHING_DNS_PERMISSIONS,
  smishingDomainPermissions: SMISHING_DOMAIN_PERMISSIONS,
  smishingExcludedIpPermissions: SMISHING_EXCLUDED_IP_PERMISSIONS,
  trainingReportsPermissions: TRAINING_REPORTS_PERMISSIONS,
  quishingSimulatorLeftPermissions: QUISHING_SIMULATOR_LEFT_MENU_PERMISSIONS,
  quishingScenarioLeftPermissions: QUISHING_SCENARIO_LEFT_MENU_PERMISSIONS,
  quishingScenarioPermissions: QUISHING_SCENARIO_PERMISSIONS,
  quishingEmailTemplatesPermissions: QUISHING_EMAIL_TEMPLATES_PERMISSIONS,
  quishingLandingPageTemplatesPermissions: QUISHING_LANDING_PAGE_TEMPLATES_PERMISSIONS,
  quishingCampaignManagerLeftPermissions: QUISHING_CAMPAIGN_MANAGER_LEFT_MENU_PERMISSIONS,
  quishingSettingsLeftPermissions: QUISHING_SETTINGS_LEFT_MENU_PERMISSIONS,
  quishingCampaignManagerParentPermissions: QUISHING_CAMPAIGN_MANAGER_PARENT,
  quishingDnsPermissions: QUISHING_DNS_PERMISSIONS,
  quishingDomainPermissions: QUISHING_DOMAIN_PERMISSIONS,
  quishingExcludeIpAddressPermissions: QUISHING_EXCLUDE_IP_ADDRESS_PERMISSIONS,
  callbackSimulatorLeftMenuPermissions: CALLBACK_SIMULATOR_LEFT_MENU_PERMISSIONS,
  callbackScenariosLeftMenuPermissions: CALLBACK_SCENARIOS_LEFT_MENU_PERMISSIONS,
  callbackCampaignManagerLeftMenuPermissions: CALLBACK_CAMPAIGN_MANAGER_LEFT_MENU_PERMISSIONS,
  callbackSettingsLeftMenuPermissions: CALLBACK_SETTINGS_LEFT_MENU_PERMISSIONS,
  callbackScenariosPermissions: CALLBACK_SCENARIOS_PERMISSIONS,
  callbackEmailTemplatesPermissions: CALLBACK_EMAIL_TEMPLATES_PERMISSIONS,
  callbackTemplatesPermissions: CALLBACK_TEMPLATES_PERMISSIONS,
  callbackCampaignManagerParentPermissions: CALLBACK_CAMPAIGN_MANAGER_PARENT,
  callbackCampaignJobPermissions: CALLBACK_CAMPAIGN_JOB_PERMISSIONS,
  callbackReportPermissions: CALLBACK_REPORT_PERMISSIONS,
  callbackSettingsPermissions: CALLBACK_SETTINGS_PERMISSIONS,
  gamificationReportPermissions: GAMIFICATION_REPORT_PERMISSIONS
}
let state = JSON.parse(localStorage.getItem('permissions')) || defaultState
state = structuredClone(state)
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
    getQuishingSimulatorLeftMenuPermissions(state) {
      return state?.quishingSimulatorLeftPermissions?.isOneOfThemPermitted
    },
    getQuishingScenarioLeftMenuPermissions(state) {
      return state?.quishingScenarioLeftPermissions?.isOneOfThemPermitted
    },
    getQuishingScenariosSearchPermissions(state) {
      return state?.quishingScenarioPermissions?.SEARCH?.hasPermission
    },
    getQuishingScenariosPreviewPermissions(state) {
      return state?.quishingScenarioPermissions?.PREVIEW?.hasPermission
    },
    getQuishingScenariosEditPermissions(state) {
      return state?.quishingScenarioPermissions?.EDIT?.hasPermission
    },
    getQuishingScenariosCreatePermissions(state) {
      return state?.quishingScenarioPermissions?.CREATE?.hasPermission
    },
    getQuishingScenariosDeletePermissions(state) {
      return state?.quishingScenarioPermissions?.DELETE?.hasPermission
    },
    getQuishingScenariosExportPermissions(state) {
      return state?.quishingScenarioPermissions?.EXPORT?.hasPermission
    },
    getQuishingEmailTemplatesSearchPermissions(state) {
      return state?.quishingEmailTemplatesPermissions?.SEARCH?.hasPermission
    },
    getQuishingEmailTemplatesEditPermissions(state) {
      return state?.quishingEmailTemplatesPermissions?.EDIT?.hasPermission
    },
    getQuishingEmailTemplatesCreatePermissions(state) {
      return state?.quishingEmailTemplatesPermissions?.CREATE?.hasPermission
    },
    getQuishingEmailTemplatesDeletePermissions(state) {
      return state?.quishingEmailTemplatesPermissions?.DELETE?.hasPermission
    },
    getQuishingEmailTemplatesExportPermissions(state) {
      return state?.quishingEmailTemplatesPermissions?.EXPORT?.hasPermission
    },
    getQuishingLandingPageTemplatesSearchPermissions(state) {
      return state?.quishingLandingPageTemplatesPermissions?.SEARCH?.hasPermission
    },
    getQuishingLandingPageTemplatesEditPermissions(state) {
      return state?.quishingLandingPageTemplatesPermissions?.EDIT?.hasPermission
    },
    getQuishingLandingPageTemplatesCreatePermissions(state) {
      return state?.quishingLandingPageTemplatesPermissions?.CREATE?.hasPermission
    },
    getQuishingLandingPageTemplatesDeletePermissions(state) {
      return state?.quishingLandingPageTemplatesPermissions?.DELETE?.hasPermission
    },
    getQuishingLandingPageTemplatesExportPermissions(state) {
      return state?.quishingLandingPageTemplatesPermissions?.EXPORT?.hasPermission
    },
    getQuishingCampaignManagerLeftMenuPermissions(state) {
      return state?.quishingCampaignManagerLeftPermissions?.isOneOfThemPermitted
    },
    getQuishingCampaignManagerParentSearchPermissions(state) {
      return state?.quishingCampaignManagerParentPermissions?.SEARCH?.hasPermission
    },
    getQuishingCampaignManagerParentPreviewPermissions(state) {
      return state?.quishingCampaignManagerParentPermissions?.PREVIEW?.hasPermission
    },
    getQuishingCampaignManagerParentDeletePermissions(state) {
      return state?.quishingCampaignManagerParentPermissions?.DELETE?.hasPermission
    },
    getQuishingCampaignManagerParentCreatePermissions(state) {
      return state?.quishingCampaignManagerParentPermissions?.CREATE?.hasPermission
    },
    getQuishingCampaignManagerParentExportPermissions(state) {
      return state?.quishingCampaignManagerParentPermissions?.EXPORT?.hasPermission
    },
    getQuishingCampaignManagerParentUpdatePermissions(state) {
      return state?.quishingCampaignManagerParentPermissions?.UPDATE?.hasPermission
    },
    getQuishingSettingsLeftMenuPermissions(state) {
      return state?.quishingSettingsLeftPermissions?.isOneOfThemPermitted
    },
    getQuishingDomainCreatePermissions(state) {
      return state?.quishingDomainPermissions?.CREATE?.hasPermission
    },
    getQuishingDomainSearchPermissions(state) {
      return state?.quishingDomainPermissions?.SEARCH?.hasPermission
    },
    getQuishingDomainUpdatePermissions(state) {
      return state?.quishingDomainPermissions?.UPDATE?.hasPermission
    },
    getQuishingDomainDeletePermissions(state) {
      return state?.quishingDomainPermissions?.DELETE?.hasPermission
    },
    getQuishingDomainExportPermissions(state) {
      return state?.quishingDomainPermissions?.EXPORT?.hasPermission
    },
    getQuishingDomainFormDetailsPermissions(state) {
      return state?.quishingDomainPermissions?.FORM_DETAILS?.hasPermission
    },
    getQuishingDnsCreatePermissions(state) {
      return state?.quishingDnsPermissions?.CREATE?.hasPermission
    },
    getQuishingDnsSearchPermissions(state) {
      return state?.quishingDnsPermissions?.SEARCH?.hasPermission
    },
    getQuishingDnsUpdatePermissions(state) {
      return state?.quishingDnsPermissions?.UPDATE?.hasPermission
    },
    getQuishingDnsDeletePermissions(state) {
      return state?.quishingDnsPermissions?.DELETE?.hasPermission
    },
    getQuishingDnsExportPermissions(state) {
      return state?.quishingDnsPermissions?.EXPORT?.hasPermission
    },
    getQuishingExcludedIpAddressGetPermissions(state) {
      return state?.quishingExcludeIpAddressPermissions?.GET?.hasPermission
    },
    getQuishingExcludedIpAddressPostPermissions(state) {
      return state?.quishingExcludeIpAddressPermissions?.POST?.hasPermission
    },
    getQuishingCampaignReportsSearchPermissions(state) {
      return state?.quishingCampaignReportsPermissions?.SEARCH?.hasPermission
    },
    getQuishingCampaignReportsGetPermissions(state) {
      return state?.quishingCampaignReportsPermissions?.GET?.hasPermission
    },
    getQuishingCampaignReportsDeletePermissions(state) {
      return state?.quishingCampaignReportsPermissions?.DELETE?.hasPermission
    },
    getQuishingCampaignReportsOpenedPermissions(state) {
      return state?.quishingCampaignReportsPermissions?.OPENED?.hasPermission
    },
    getQuishingCampaignReportsOpenedDetailsPermissions(state) {
      return state?.quishingCampaignReportsPermissions?.OPENED_DETAILS?.hasPermission
    },
    getQuishingCampaignReportsClickedPermissions(state) {
      return state?.quishingCampaignReportsPermissions?.CLICKED?.hasPermission
    },
    getQuishingCampaignReportsClickedDetailsPermissions(state) {
      return state?.quishingCampaignReportsPermissions?.CLICKED_DETAILS?.hasPermission
    },
    getQuishingCampaignReportsOpenedAttachmentPermissions(state) {
      return state?.quishingCampaignReportsPermissions?.OPENED_ATTACHMENT?.hasPermission
    },
    getQuishingCampaignReportsOpenedAttachmentDetailsPermissions(state) {
      return state?.quishingCampaignReportsPermissions?.OPENED_ATTACHMENT_DETAILS?.hasPermission
    },
    getQuishingCampaignReportsSubmittedDataPermissions(state) {
      return state?.quishingCampaignReportsPermissions?.SUBMITTED_DATA?.hasPermission
    },
    getQuishingCampaignReportsSubmittedDataDetailsPermissions(state) {
      return state?.quishingCampaignReportsPermissions?.SUBMITTED_DATA_DETAILS?.hasPermission
    },
    getQuishingCampaignReportsNoResponsePermissions(state) {
      return state?.quishingCampaignReportsPermissions?.NO_RESPONSE?.hasPermission
    },
    getQuishingCampaignReportsPhishingReporterPermissions(state) {
      return state?.quishingCampaignReportsPermissions?.PHISHING_REPORTER?.hasPermission
    },
    getQuishingCampaignReportsPhishingReporterDetailsPermissions(state) {
      return state?.quishingCampaignReportsPermissions?.PHISHING_REPORTER_DETAILS?.hasPermission
    },
    getQuishingCampaignReportsSendingReportPermissions(state) {
      return state?.quishingCampaignReportsPermissions?.SENDING_REPORT?.hasPermission
    },
    getQuishingCampaignReportsSendingReportDetailsPermissions(state) {
      return state?.quishingCampaignReportsPermissions?.SENDING_REPORT_DETAILS?.hasPermission
    },

    getSmishingSimulatorLeftMenuPermissions(state) {
      return state?.smishingSimulatorLeftMenuPermissions?.isOneOfThemPermitted
    },
    getSmishingScenariosLeftMenuPermissions(state) {
      return state?.smishingScenariosLeftMenuPermissions?.isOneOfThemPermitted
    },
    getSmishingScenariosSearchPermissions(state) {
      return state?.smishingScenariosPermissions?.SEARCH?.hasPermission
    },
    getSmishingScenariosGetPermissions(state) {
      return state?.smishingScenariosPermissions?.GET?.hasPermission
    },
    getSmishingScenariosCreatePermissions(state) {
      return state?.smishingScenariosPermissions?.CREATE?.hasPermission
    },
    getSmishingScenariosEditPermissions(state) {
      return state?.smishingScenariosPermissions?.EDIT?.hasPermission
    },
    getSmishingScenariosDeletePermissions(state) {
      return state?.smishingScenariosPermissions?.DELETE?.hasPermission
    },
    getSmishingScenariosPreviewPermissions(state) {
      return state?.smishingScenariosPermissions?.PREVIEW?.hasPermission
    },
    getSmishingScenariosExportPermissions(state) {
      return state?.smishingScenariosPermissions?.EXPORT?.hasPermission
    },
    getSmishingTextMessageTemplatesSearchPermissions(state) {
      return state?.smishingTextMessageTemplatesPermissions?.SEARCH?.hasPermission
    },
    getSmishingTextMessageTemplatesGetPermissions(state) {
      return state?.smishingTextMessageTemplatesPermissions?.GET?.hasPermission
    },
    getSmishingTextMessageTemplatesCreatePermissions(state) {
      return state?.smishingTextMessageTemplatesPermissions?.CREATE?.hasPermission
    },
    getSmishingTextMessageTemplatesEditPermissions(state) {
      return state?.smishingTextMessageTemplatesPermissions?.EDIT?.hasPermission
    },
    getSmishingTextMessageTemplatesDeletePermissions(state) {
      return state?.smishingTextMessageTemplatesPermissions?.DELETE?.hasPermission
    },
    getSmishingTextMessageTemplatesExportPermissions(state) {
      return state?.smishingTextMessageTemplatesPermissions?.EXPORT?.hasPermission
    },
    getSmishingLandingPageTemplatesSearchPermissions(state) {
      return state?.smishingLandingPageTemplatesPermissions?.SEARCH?.hasPermission
    },
    getSmishingLandingPageTemplatesGetPermissions(state) {
      return state?.smishingLandingPageTemplatesPermissions?.GET?.hasPermission
    },
    getSmishingLandingPageTemplatesCreatePermissions(state) {
      return state?.smishingLandingPageTemplatesPermissions?.CREATE?.hasPermission
    },
    getSmishingLandingPageTemplatesEditPermissions(state) {
      return state?.smishingLandingPageTemplatesPermissions?.EDIT?.hasPermission
    },
    getSmishingLandingPageTemplatesDeletePermissions(state) {
      return state?.smishingLandingPageTemplatesPermissions?.DELETE?.hasPermission
    },
    getSmishingLandingPageTemplatesExportPermissions(state) {
      return state?.smishingLandingPageTemplatesPermissions?.EXPORT?.hasPermission
    },
    getSmishingCampaignManagerLeftMenuPermissions(state) {
      return state?.smishingCampaignManagerLeftMenuPermissions?.isOneOfThemPermitted
    },
    getSmishingCampaignManagerSearchPermissions(state) {
      return state?.smishingCampaignManagerPermissions?.SEARCH?.hasPermission
    },
    getSmishingCampaignManagerGetPermissions(state) {
      return state?.smishingCampaignManagerPermissions?.GET?.hasPermission
    },
    getSmishingCampaignManagerCreatePermissions(state) {
      return state?.smishingCampaignManagerPermissions?.CREATE?.hasPermission
    },
    getSmishingCampaignManagerEditPermissions(state) {
      return state?.smishingCampaignManagerPermissions?.EDIT?.hasPermission
    },
    getSmishingCampaignManagerDeletePermissions(state) {
      return state?.smishingCampaignManagerPermissions?.DELETE?.hasPermission
    },
    getSmishingCampaignManagerPreviewPermissions(state) {
      return state?.smishingCampaignManagerPermissions?.PREVIEW?.hasPermission
    },
    getSmishingCampaignManagerExportPermissions(state) {
      return state?.smishingCampaignManagerPermissions?.EXPORT?.hasPermission
    },
    getSmishingCampaignJobSearchPermissions(state) {
      return state?.smishingCampaignJobPermissions?.SEARCH?.hasPermission
    },
    getSmishingCampaignJobStartPermissions(state) {
      return state?.smishingCampaignJobPermissions?.START?.hasPermission
    },
    getSmishingCampaignJobLaunchPermissions(state) {
      return state?.smishingCampaignJobPermissions?.LAUNCH?.hasPermission
    },
    getSmishingCampaignJobStopPermissions(state) {
      return state?.smishingCampaignJobPermissions?.STOP?.hasPermission
    },
    getSmishingCampaignJobDeletePermissions(state) {
      return state?.smishingCampaignJobPermissions?.DELETE?.hasPermission
    },
    getSmishingCampaignJobResendPermissions(state) {
      return state?.smishingCampaignJobPermissions?.RESEND?.hasPermission
    },
    getSmishingCampaignJobResendListPermissions(state) {
      return state?.smishingCampaignJobPermissions?.RESEND_LIST?.hasPermission
    },
    getSmishingCampaignJobExportPermissions(state) {
      return state?.smishingCampaignJobPermissions?.EXPORT?.hasPermission
    },
    getSmishingReportSummaryPermissions(state) {
      return state?.smishingReportPermissions?.SUMMARY?.hasPermission
    },
    getSmishingReportSearchTypePermissions(state) {
      return state?.smishingReportPermissions?.SEARCH_TYPE?.hasPermission
    },
    getSmishingReportTypeExportPermissions(state) {
      return state?.smishingReportPermissions?.TYPE_EXPORT?.hasPermission
    },
    getSmishingReportClickedDetailstPermissions(state) {
      return state?.smishingReportPermissions?.CLICKED_DETAILS?.hasPermission
    },
    getSmishingReportSubmittedDataDetailstPermissions(state) {
      return state?.smishingReportPermissions?.SUBMITTED_DATA_DETAILS?.hasPermission
    },
    getSmishingReportSubmittedMFADetailstPermissions(state) {
      return state?.smishingReportPermissions?.SUBMITTED_MFA_DETAILS?.hasPermission
    },
    getSmishingReportDownloadReportPermissions(state) {
      return state?.smishingReportPermissions?.DOWNLOAD_REPORT?.hasPermission
    },
    getSmishingSettingsLeftMenuPermissions(state) {
      return state?.smishingSettingsLeftMenuPermissions?.isOneOfThemPermitted
    },
    getSmishingDnsCreatePermissions(state) {
      return state?.smishingDnsPermissions?.CREATE?.hasPermission
    },
    getSmishingDnsSearchPermissions(state) {
      return state?.smishingDnsPermissions?.SEARCH?.hasPermission
    },
    getSmishingDnsUpdatePermissions(state) {
      return state?.smishingDnsPermissions?.UPDATE?.hasPermission
    },
    getSmishingDnsDeletePermissions(state) {
      return state?.smishingDnsPermissions?.DELETE?.hasPermission
    },
    getSmishingDnsGetPermissions(state) {
      return state?.smishingDnsPermissions?.GET?.hasPermission
    },
    getSmishingDnsExportPermissions(state) {
      return state?.smishingDnsPermissions?.EXPORT?.hasPermission
    },
    getSmishingDomainSearchPermissions(state) {
      return state?.smishingDomainPermissions?.SEARCH?.hasPermission
    },
    getSmishingDomainCreatePermissions(state) {
      return state?.smishingDomainPermissions?.CREATE?.hasPermission
    },
    getSmishingDomainUpdatePermissions(state) {
      return state?.smishingDomainPermissions?.UPDATE?.hasPermission
    },
    getSmishingDomainDeletePermissions(state) {
      return state?.smishingDomainPermissions?.DELETE?.hasPermission
    },
    getSmishingDomainGetPermissions(state) {
      return state?.smishingDomainPermissions?.GET?.hasPermission
    },
    getSmishingDomainExportPermissions(state) {
      return state?.smishingDomainPermissions?.EXPORT?.hasPermission
    },
    getSmishingDomainFormDetailsPermissions(state) {
      return state?.smishingDomainPermissions?.FORM_DETAILS?.hasPermission
    },
    getSmishingExcludedIpGetPermissions(state) {
      return state?.smishingExcludedIpPermissions?.GET?.hasPermission
    },
    getSmishingExcludedIpPostPermissions(state) {
      return state?.smishingExcludedIpPermissions?.POST?.hasPermission
    },
    getEmailTemplatesSearchPermissions(state) {
      return state?.emailTemplatesPermissions?.SEARCH?.hasPermission
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
    getTrainingReportsSearchPermissions(state) {
      return state?.trainingReportsPermissions?.SEARCH_REPORTS?.hasPermission
    },
    getLandingPageTemplatesSearchPermissions(state) {
      return state?.landingPageTemplatesPermissions?.SEARCH?.hasPermission
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
    getDnsExportPermissions(state) {
      return state?.dnsPermissions?.EXPORT?.hasPermission
    },
    getExcludedIpAddressGetPermissions(state) {
      return state?.excludeIpAddressPermissions?.GET?.hasPermission
    },
    getExcludedIpAddressPostPermissions(state) {
      return state?.excludeIpAddressPermissions?.POST?.hasPermission
    },
    getVishingLeftMenuPermissions(state) {
      return state?.vishingLeftMenuPermissions?.isOneOfThemPermitted
    },
    getVishingTemplatesLeftMenuPermissions(state) {
      return state?.vishingLeftMenuPermissions?.VISHING_TEMPLATES?.hasPermission
    },
    getVishingTemplatesSearchPermissions(state) {
      return state?.vishingTemplatesPermissions?.SEARCH?.hasPermission
    },
    getVishingTemplatesGetPermissions(state) {
      return state?.vishingTemplatesPermissions?.GET?.hasPermission
    },
    getVishingTemplatesCreatePermissions(state) {
      return state?.vishingTemplatesPermissions?.CREATE?.hasPermission
    },
    getVishingTemplatesEditPermissions(state) {
      return state?.vishingTemplatesPermissions?.EDIT?.hasPermission
    },
    getVishingTemplatesDeletePermissions(state) {
      return state?.vishingTemplatesPermissions?.DELETE?.hasPermission
    },
    getVishingTemplatesPreviewPermissions(state) {
      return state?.vishingTemplatesPermissions?.PREVIEW?.hasPermission
    },
    getVishingTemplatesExportPermissions(state) {
      return state?.vishingTemplatesPermissions?.EXPORT?.hasPermission
    },
    getVishingCampaignManagerLeftMenuPermissions(state) {
      return state?.vishingLeftMenuPermissions?.VISHING_CAMPAIGN_MANAGER?.hasPermission
    },
    getVishingCampaignManagerSearchPermissions(state) {
      return state?.vishingCampaignManagerPermissions?.SEARCH?.hasPermission
    },
    getVishingCampaignManagerGetPermissions(state) {
      return state?.vishingCampaignManagerPermissions?.GET?.hasPermission
    },
    getVishingCampaignManagerCreatePermissions(state) {
      return state?.vishingCampaignManagerPermissions?.CREATE?.hasPermission
    },
    getVishingCampaignManagerEditPermissions(state) {
      return state?.vishingCampaignManagerPermissions?.EDIT?.hasPermission
    },
    getVishingCampaignManagerDeletePermissions(state) {
      return state?.vishingCampaignManagerPermissions?.DELETE?.hasPermission
    },
    getVishingCampaignManagerStopPermissions(state) {
      return state?.vishingCampaignManagerPermissions?.STOP?.hasPermission
    },
    getVishingCampaignManagerPreviewPermissions(state) {
      return state?.vishingCampaignManagerPermissions?.PREVIEW?.hasPermission
    },
    getVishingCampaignManagerLaunchPermissions(state) {
      return state?.vishingCampaignManagerPermissions?.LAUNCH?.hasPermission
    },
    getVishingCampaignManagerExportPermissions(state) {
      return state?.vishingCampaignManagerPermissions?.EXPORT?.hasPermission
    },
    getVishingReportsSummaryPermissions(state) {
      return state?.vishingReportsPermissions?.SUMMARY?.hasPermission
    },
    getVishingReportsUsersPermissions(state) {
      return state?.vishingReportsPermissions?.USERS?.hasPermission
    },
    getVishingReportsAnsweredPermissions(state) {
      return state?.vishingReportsPermissions?.ANSWERED?.hasPermission
    },
    getVishingReportsDialedNumberPermissions(state) {
      return state?.vishingReportsPermissions?.DIALLED_NUMBER?.hasPermission
    },
    getVishingReportsNoResponsePermissions(state) {
      return state?.vishingReportsPermissions?.NO_RESPONSE?.hasPermission
    },
    getVishingReportsResendPermissions(state) {
      return state?.vishingReportsPermissions?.RESEND?.hasPermission
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
      const { SUMMARY = {}, SEARCH_LOG = {}, SEARCH_STATS = {}, NOTIFY_RESULT = {} } =
        state?.incidentResponderListGroupPermissions || {}
      return [
        SUMMARY?.hasPermission,
        SEARCH_LOG?.hasPermission,
        SEARCH_STATS?.hasPermission,
        NOTIFY_RESULT?.hasPermission
      ].some(Boolean)
    },
    getCrossCompanyPagePermissions() {
      const { SEARCH_LOG = {}, SEARCH_STATS = {} } =
        state?.incidentResponderListGroupPermissions || {}
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
    getAdvancedReportsSearchPermissions(state) {
      return state?.advancedReportsPermissions?.SEARCH?.hasPermission
    },
    getExecutiveReportsSearchPermissions(state) {
      return state?.executiveReportsPermissions?.SEARCH?.hasPermission
    },
    getScheduledReportsSearchPermissions(state) {
      return state?.scheduledReportsPermissions?.SEARCH?.hasPermission
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
      const { TARGET_USERS = {}, TARGET_GROUPS = {} } = state?.companyLeftMenuPermissions || {}
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
      const { COMPANY = {}, COMPANY_GROUPS = {} } = state?.companyLeftMenuPermissions || {}
      return COMPANY?.hasPermission || COMPANY_GROUPS?.hasPermission
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
        getters?.getSIEMIntegrationSearchPermissions ||
        getters?.getDirectEmailCreationSearchPermissions ||
        getters?.getAccountPrivacyPermission ||
        getters?.getAIAllySettingsGetPermissions ||
        getters?.getGoogleUserProvisionGetPermissions ||
        getters?.getLDAPDetailPermission ||
        getters?.getAllowListPermissionsSearch
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
    getDirectEmailCreationSearchPermissions(state) {
      return state?.directEmailCreationPermissions?.SEARCH?.hasPermission
    },
    getAccountPrivacyPermission(state) {
      return state?.companyLeftMenuPermissions?.ACCOUNT_PRIVACY?.hasPermission
    },
    getDirectEmailCreatePermissions(state) {
      return state?.directEmailCreationPermissions?.CREATE?.hasPermission
    },
    getDirectEmailUpdatePermissions(state) {
      return state?.directEmailCreationPermissions?.UPDATE?.hasPermission
    },
    getDirectEmailDeletePermissions(state) {
      return state?.directEmailCreationPermissions?.DELETE?.hasPermission
    },
    getDirectEmailExportPermissions(state) {
      return state?.directEmailCreationPermissions?.EXPORT?.hasPermission
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
    getAgenticAISettingsGetPermissions(state) {
      return state?.agenticAISettingsPermissions?.GET?.hasPermission
    },
    getAIAllySettingsGetPermissions(state) {
      return state?.aiAllySettingsPermissions?.GET?.hasPermission
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
    getGoogleUserProvisionGetPermissions(state) {
      return state?.googleUserProvisionPermissions?.GET?.hasPermission
    },
    getSCIMSettingsSearchPermissions(state) {
      return state?.scimSettingsPermissions?.SEARCH?.hasPermission
    },
    getMicrosoftTeamsSettingsGetPermissions(state) {
      return state?.microsoftTeamsSettingsPermissions?.GET?.hasPermission
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
      const { SYSTEM_USERS = {}, ROLES = {} } = state?.companyLeftMenuPermissions || {}
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
      const { AUDIT_LOGS = {} } = state?.companyLeftMenuPermissions || {}
      return AUDIT_LOGS?.hasPermission
    },
    getJobLogsSearchPermission(state) {
      const { JOB_LOGS = {} } = state?.companyLeftMenuPermissions || {}
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
    getDashboardPhishingCampaignTrendsPermission(state) {
      return state?.dashboardPermissions?.PHISHING_CAMPAIGN_TRENDS?.hasPermission
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
      const { FIELD_MAPPING_USERS, LDAP_FIELDS } = state?.ldapPermissions || {}
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
        phishingReporterCard: getters?.getPhishingReporterLeftMenuPermissions,
        roiSettingCard: getters?.getIncidentResponderLeftMenuPermissions,
        recentCampaignsCard: getters?.getPhishingSimulatorLeftMenuPermissions,
        mostPhishedUsersCard: getters?.getPhishingSimulatorLeftMenuPermissions,
        phishingCampaignTrendsCard: getters?.getPhishingSimulatorLeftMenuPermissions,
        mostEngagedCampaignsCard: getters?.getPhishingSimulatorLeftMenuPermissions,
        topPhishingSimulationReportersCard: getters?.getPhishingSimulatorLeftMenuPermissions
      }
    },
    getEtsQuickScanPermissionSearch(state) {
      return state?.etsQuickScanPermissions?.SEARCH?.hasPermission
    },
    getEtsQuickScanPermissionCreate(state) {
      return state?.etsQuickScanPermissions?.CREATE?.hasPermission
    },
    getEtsQuickScanPermissionUpdate(state) {
      return state?.etsQuickScanPermissions?.UPDATE?.hasPermission
    },
    getEtsQuickScanPermissionDelete(state) {
      return state?.etsQuickScanPermissions?.DELETE?.hasPermission
    },
    getEtsQuickScanPermissionExport(state) {
      return state?.etsQuickScanPermissions?.EXPORT?.hasPermission
    },
    getEtsAttackVectorPermissionSearch(state) {
      return state?.etsAttackVectorPermissions?.SEARCH?.hasPermission
    },
    getEtsAttackVectorPermissionCreate(state) {
      return state?.etsAttackVectorPermissions?.CREATE?.hasPermission
    },
    getEtsAttackVectorPermissionUpdate(state) {
      return state?.etsAttackVectorPermissions?.UPDATE?.hasPermission
    },
    getEtsAttackVectorPermissionDelete(state) {
      return state?.etsAttackVectorPermissions?.DELETE?.hasPermission
    },
    getEtsAttackVectorPermissionExport(state) {
      return state?.etsAttackVectorPermissions?.EXPORT?.hasPermission
    },
    getEtsAttackVectorPermissionEnableDisable(state) {
      return !!(
        state?.etsAttackVectorPermissions?.ENABLE && state?.etsAttackVectorPermissions?.DISABLE
      )
    },
    getEtsQuickScanReportPermissionStat(state) {
      return state?.etsQuickScanReportPermissions?.STATS?.hasPermission
    },
    getEtsQuickScanReportPermissionSearch(state) {
      return state?.etsQuickScanReportPermissions?.SEARCH?.hasPermission
    },
    getEtsQuickScanReportPermissionExport(state) {
      return state?.etsQuickScanReportPermissions?.EXPORT?.hasPermission
    },
    getAwarenessEducatorListGroupPermissions(state) {
      return state?.awarenessEducatorListGroupPermissions?.isOneOfThemPermitted
    },
    getTrainingSearchPermission(state) {
      return state?.awarenessEducatorListGroupPermissions?.TRAININGS?.hasPermission
    },
    getEnrollmentsSearchPermission(state) {
      return state?.awarenessEducatorListGroupPermissions?.ENROLLMENTS?.hasPermission
    },
    getCertificatesSearchPermission(state) {
      return state?.awarenessEducatorListGroupPermissions?.CERTIFICATES?.hasPermission
    },
    getSendTrainingPermission(state) {
      return state?.awarenessEducatorPermissions?.SEND_TRAINING?.hasPermission
    },
    getCreateTrainingPermission(state) {
      return state?.awarenessEducatorPermissions?.CREATE_TRAINING?.hasPermission
    },
    getUpdateTrainingPermission(state) {
      return state?.awarenessEducatorPermissions?.EDIT_TRAINING?.hasPermission
    },
    getExportTrainingPermission(state) {
      return state?.awarenessEducatorPermissions?.EXPORT_TRAINING?.hasPermission
    },
    getDeleteTrainingPermission(state) {
      return state?.awarenessEducatorPermissions?.DELETE_TRAINING?.hasPermission
    },
    getEnrollmentEditPermission(state) {
      return state?.awarenessEducatorPermissions?.EDIT_ENROLLMENT?.hasPermission
    },
    getDeleteEnrollmentPermission(state) {
      return state?.awarenessEducatorPermissions?.DELETE_ENROLLMENT?.hasPermission
    },
    getExportEnrollmentPermission(state) {
      return state?.awarenessEducatorPermissions?.EXPORT_ENROLLMENT?.hasPermission
    },
    getDeleteCertificatePermission(state) {
      return state?.awarenessEducatorPermissions?.DELETE_CERTIFICATE?.hasPermission
    },
    getEditCertificatePermission(state) {
      return state?.awarenessEducatorPermissions?.EDIT_CERTIFICATE?.hasPermission
    },
    getCreateCertificatePermission(state) {
      return state?.awarenessEducatorPermissions?.CREATE_CERTIFICATE?.hasPermission
    },
    getExportCertificatePermission(state) {
      return state?.awarenessEducatorPermissions?.EXPORT_CERTIFICATE?.hasPermission
    },
    getThreatIntelligencePermissionsSearch(state) {
      return state?.threatIntelligencePermissions?.SEARCH?.hasPermission
    },
    getThreatIntelligencePermissionsExport(state) {
      return state?.threatIntelligencePermissions?.EXPORT?.hasPermission
    },
    getAllowListPermissionsSearch(state) {
      return state?.allowListPermissions?.SEARCH?.hasPermission
    },
    getAllowListPermissionsCreate(state) {
      return state?.allowListPermissions?.CREATE?.hasPermission
    },
    getAllowListPermissionsCreateTxt(state) {
      return state?.allowListPermissions?.CREATE_TXT?.hasPermission
    },
    getAllowListPermissionsVerify(state) {
      return state?.allowListPermissions?.VERIFY?.hasPermission
    },
    getAllowListPermissionsDelete(state) {
      return state?.allowListPermissions?.DELETE?.hasPermission
    },
    getAllowListPermissionsExport(state) {
      return state?.allowListPermissions?.EXPORT?.hasPermission
    },
    getCallbackSimulatorLeftMenuPermissions(state) {
      return state?.callbackSimulatorLeftMenuPermissions?.isOneOfThemPermitted
    },
    getCallbackScenarioLeftMenuPermissions(state) {
      return state?.callbackScenariosLeftMenuPermissions?.isOneOfThemPermitted
    },
    getCallbackScenariosSearchPermissions(state) {
      return state?.callbackScenariosPermissions?.SEARCH?.hasPermission
    },
    getCallbackScenariosEditPermissions(state) {
      return state?.callbackScenariosPermissions?.UPDATE?.hasPermission
    },
    getCallbackScenariosCreatePermissions(state) {
      return state?.callbackScenariosPermissions?.CREATE?.hasPermission
    },
    getCallbackScenariosDeletePermissions(state) {
      return state?.callbackScenariosPermissions?.DELETE?.hasPermission
    },
    getCallbackScenariosExportPermissions(state) {
      return state?.callbackScenariosPermissions?.EXPORT?.hasPermission
    },
    getCallbackEmailTemplatesSearchPermissions(state) {
      return state?.callbackEmailTemplatesPermissions?.SEARCH?.hasPermission
    },
    getCallbackEmailTemplatesEditPermissions(state) {
      return state?.callbackEmailTemplatesPermissions?.UPDATE?.hasPermission
    },
    getCallbackEmailTemplatesCreatePermissions(state) {
      return state?.callbackEmailTemplatesPermissions?.CREATE?.hasPermission
    },
    getCallbackEmailTemplatesDeletePermissions(state) {
      return state?.callbackEmailTemplatesPermissions?.DELETE?.hasPermission
    },
    getCallbackEmailTemplatesExportPermissions(state) {
      return state?.callbackEmailTemplatesPermissions?.EXPORT?.hasPermission
    },
    getCallbackTemplatesSearchPermissions(state) {
      return state?.callbackTemplatesPermissions?.SEARCH?.hasPermission
    },
    getCallbackTemplatesEditPermissions(state) {
      return state?.callbackTemplatesPermissions?.UPDATE?.hasPermission
    },
    getCallbackTemplatesCreatePermissions(state) {
      return state?.callbackTemplatesPermissions?.CREATE?.hasPermission
    },
    getCallbackTemplatesDeletePermissions(state) {
      return state?.callbackTemplatesPermissions?.DELETE?.hasPermission
    },
    getCallbackTemplatesExportPermissions(state) {
      return state?.callbackTemplatesPermissions?.EXPORT?.hasPermission
    },
    getCallbackCampaignManagerLeftMenuPermissions(state) {
      return state?.callbackCampaignManagerLeftMenuPermissions?.isOneOfThemPermitted
    },
    getCallbackCampaignSearchPermissions(state) {
      return state?.callbackCampaignManagerParentPermissions?.SEARCH?.hasPermission
    },
    getCallbackCampaignPreviewPermissions(state) {
      return state?.callbackCampaignManagerParentPermissions?.PREVIEW?.hasPermission
    },
    getCallbackCampaignCreatePermissions(state) {
      return state?.callbackCampaignManagerParentPermissions?.CREATE?.hasPermission
    },
    getCallbackCampaignDeletePermissions(state) {
      return state?.callbackCampaignManagerParentPermissions?.DELETE?.hasPermission
    },
    getCallbackCampaignExportPermissions(state) {
      return state?.callbackCampaignManagerParentPermissions?.EXPORT?.hasPermission
    },
    getCallbackCampaignJobSearchPermissions(state) {
      return state?.callbackCampaignJobPermissions?.SEARCH?.hasPermission
    },
    getCallbackCampaignJobStartPermissions(state) {
      return state?.callbackCampaignJobPermissions?.START?.hasPermission
    },
    getCallbackCampaignJobLaunchPermissions(state) {
      return state?.callbackCampaignJobPermissions?.LAUNCH?.hasPermission
    },
    getCallbackCampaignJobStopPermissions(state) {
      return state?.callbackCampaignJobPermissions?.STOP?.hasPermission
    },
    getCallbackCampaignJobDeletePermissions(state) {
      return state?.callbackCampaignJobPermissions?.DELETE?.hasPermission
    },
    getCallbackCampaignJobResendPermissions(state) {
      return state?.callbackCampaignJobPermissions?.RESEND?.hasPermission
    },
    getCallbackCampaignJobResendListPermissions(state) {
      return state?.callbackCampaignJobPermissions?.RESEND_LIST?.hasPermission
    },
    getCallbackCampaignJobExportPermissions(state) {
      return state?.callbackCampaignJobPermissions?.EXPORT?.hasPermission
    },
    getCallbackReportSummaryPermissions(state) {
      return state?.callbackReportPermissions?.SUMMARY?.hasPermission
    },
    getCallbackReportSearchTypePermissions(state) {
      return state?.callbackReportPermissions?.SEARCH_TYPE?.hasPermission
    },
    getCallbackReportTypeExportPermissions(state) {
      return state?.callbackReportPermissions?.TYPE_EXPORT?.hasPermission
    },
    getCallbackReportOpenedDetailsPermissions(state) {
      return state?.callbackReportPermissions?.OPENED_DETAILS?.hasPermission
    },
    getCallbackReportReportedDetailsPermissions(state) {
      return state?.callbackReportPermissions?.REPORTED_DETAILS?.hasPermission
    },
    getCallbackReportDownloadReportPermissions(state) {
      return state?.callbackReportPermissions?.DOWNLOAD_REPORT?.hasPermission
    },
    getCallbackSettingsLeftMenuPermissions(state) {
      return state?.callbackSettingsLeftMenuPermissions?.isOneOfThemPermitted
    },
    getCallbackSettingsSearchPermissions(state) {
      return state?.callbackSettingsPermissions?.SEARCH?.hasPermission
    },
    getCallbackSettingsExportPermissions(state) {
      return state?.callbackSettingsPermissions?.EXPORT?.hasPermission
    },
    getCallbackSettingsMapNumbersPermissions(state) {
      return state?.callbackSettingsPermissions?.MAP_NUMBERS?.hasPermission
    },
    getCallbackSettingsDeleteNumberPermissions(state) {
      return state?.callbackSettingsPermissions?.DELETE_NUMBER?.hasPermission
    },
    getCallbackSettingsExchangePermissions(state) {
      return state?.callbackSettingsPermissions?.EXCHANGE?.hasPermission
    },
    getGamificationReportSearchPermissions(state) {
      return state?.gamificationReportPermissions?.SEARCH?.hasPermission
    },
    getGamificationReportTopPerformersPermissions(state) {
      return state?.gamificationReportPermissions?.TOP_PERFORMERS?.hasPermission
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
        'aiAllySettingsPermissions',
        'whiteLabelingPermissions',
        'proxySettingsPermissions',
        'samlIntegrationPermissions',
        'googleUserProvisionPermissions',
        'scimSettingsPermissions',
        'microsoftTeamsSettingsPermissions',
        'siemIntegrationPermissions',
        'systemUsersPermissions',
        'systemRolesPermissions',
        'ldapPermissions',
        'excludeIpAddressPermissions',
        'vishingLeftMenuPermissions',
        'vishingTemplatesPermissions',
        'vishingCampaignManagerPermissions',
        'vishingReportsPermissions',
        'awarenessEducatorListGroupPermissions',
        'awarenessEducatorPermissions',
        'etsQuickScanPermissions',
        'etsAttackVectorPermissions',
        'etsQuickScanReportPermissions',
        'threatIntelligencePermissions',
        'allowListPermissions',
        'agenticAISettingsPermissions',
        'directEmailCreationPermissions',
        'advancedReportsPermissions',
        'executiveReportsPermissions',
        'scheduledReportsPermissions',
        'smishingSimulatorLeftMenuPermissions',
        'smishingScenariosLeftMenuPermissions',
        'smishingScenariosPermissions',
        'smishingTextMessageTemplatesPermissions',
        'smishingLandingPageTemplatesPermissions',
        'smishingCampaignManagerLeftMenuPermissions',
        'smishingCampaignManagerPermissions',
        'smishingCampaignJobPermissions',
        'smishingReportPermissions',
        'smishingSettingsLeftMenuPermissions',
        'smishingDnsPermissions',
        'smishingDomainPermissions',
        'smishingExcludedIpPermissions',
        'trainingReportsPermissions',
        'quishingSimulatorLeftPermissions',
        'quishingScenarioLeftPermissions',
        'quishingScenarioPermissions',
        'quishingEmailTemplatesPermissions',
        'quishingLandingPageTemplatesPermissions',
        'quishingCampaignManagerLeftPermissions',
        'quishingSettingsLeftPermissions',
        'quishingCampaignManagerParentPermissions',
        'quishingDnsPermissions',
        'quishingDomainPermissions',
        'quishingExcludeIpAddressPermissions',
        'quishingCampaignReportsPermissions',
        'callbackSimulatorLeftMenuPermissions',
        'callbackScenariosLeftMenuPermissions',
        'callbackCampaignManagerLeftMenuPermissions',
        'callbackSettingsLeftMenuPermissions',
        'callbackScenariosPermissions',
        'callbackEmailTemplatesPermissions',
        'callbackTemplatesPermissions',
        'callbackCampaignManagerParentPermissions',
        'callbackCampaignJobPermissions',
        'callbackReportPermissions',
        'callbackSettingsPermissions',
        'gamificationReportPermissions'
      ]
      statePermissionKeys.forEach((key) => {
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
