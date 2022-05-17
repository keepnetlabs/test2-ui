const ENUMS = {
  DNS: {
    ROOT_URL: 'phishing-simulator/dns-services'
  },
  DOMAIN: {
    ROOT_URL: 'phishing-simulator/domain-records'
  },
  SCIM: {
    ROOT_URL: 'scim'
  },
  SIEM_INTEGRATION: {
    ROOT_URL: 'companies/siem-settings'
  },
  METHODS: {
    POST: 'POST',
    GET: 'GET',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
  }
}
export default {
  DASHBOARD_PERMISSIONS: {
    WIDGETS: {
      url: `dashboard/widgets`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    WIDGET_POST: {
      url: `dashboard/widgets`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    COMMUNITY_POST_TOP_POSTS: {
      url: `community-posts/top-posts`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    COMMUNITY_POSTS: {
      url: 'community-posts/search',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    NOTIFIED_EMAIL: {
      url: `notified-emails/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SUMMARY: {
      url: `dashboard/summary`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    REPORTED_EMAIL_TRENDS: {
      url: 'dashboard/reported-email-trends',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    IR_SUMMARY: {
      url: 'ir/dashboard/summary',
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    IR_TOP_RULES: {
      url: 'ir/dashboard/top-rules',
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    IR_RUNNING_INVESTIGATIONS: {
      url: 'ir/dashboard/running-investigations',
      hasPermission: false,
      method: ENUMS.METHODS.GET
    }
  },
  THREAT_SHARING_LEFT_MENU_PERMISSIONS: {
    ALL_COMMUNITIES: {
      url: `communities/search/all`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    MY_COMMUNITIES: {
      url: `communities/search/my`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    COMMUNITY_POSTS: {
      url: `community-posts/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  THREAT_SHARING_PERMISSIONS: {
    MY_INVITATIONS: {
      url: `communities/my-invitations`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    CREATE_COMMUNITY: {
      url: 'communities',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    EDIT_COMMUNITYT: {
      url: 'communities/{resourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    LEAVE_COMMUNITYT: {
      url: 'communities/{resourceId}/leave',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DELETE_COMMUNITY: {
      url: 'communities/{resourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    POST_INCIDENT: {
      url: 'community-posts',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    INVITE_TO_COMMUNITY: {
      url: 'communities/{resourceId}/invite',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    MY_LAST_POSTS: {
      url: 'community-posts/my-last-posts',
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    TOP_POSTS: {
      url: 'community-posts/top-posts',
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    SUGGESTED_COMMUNITIES: {
      url: 'communities/suggested',
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    GET_POST: {
      url: 'community-posts/{resourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    SHARE_POST: {
      url: 'community-posts/{resourceId}/share',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DELETE_POST: {
      url: 'community-posts/{resourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    CREATE_COMMENT: {
      url: 'community-posts/{communityPostResourceId}/comments',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    EDIT_COMMENT: {
      url: 'community-posts/comments/{resourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE_COMMENT: {
      url: 'community-posts/comments/{resourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    }
  },
  PHISHING_SIMULATOR_LEFT_MENU_PERMISSIONS: {
    EMAIL_TEMPLATE: {
      url: `phishing-simulator/email-templates`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PHISHING_SCENARIO: {
      url: `phishing-simulator/phishing-scenario/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DNS: {
      url: `phishing-simulator/dns-services/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DOMAIN: {
      url: `phishing-simulator/domain-records/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  PHISHING_SCENARIO_LEFT_MENU_PERMISSIONS: {
    EMAIL_TEMPLATE: {
      url: `phishing-simulator/email-templates`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PHISHING_SCENARIO: {
      url: `phishing-simulator/phishing-scenario/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    LANDING_PAGE: {
      url: 'phishing-simulator/landing-page-template',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  PHISHING_SCENARIO_PERMISSIONS: {
    SEARCH: {
      url: `phishing-simulator/phishing-scenario/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PREVIEW: {
      url: `phishing-simulator/phishing-scenario/preview/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EDIT: {
      url: `phishing-simulator/phishing-scenario/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    CREATE: {
      url: `phishing-simulator/phishing-scenario`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DELETE: {
      url: `phishing-simulator/phishing-scenario/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT: {
      url: `phishing-simulator/phishing-scenario/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  EMAIL_TEMPLATES_PERMISSIONS: {
    SEARCH: {
      url: `phishing-simulator/email-templates/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PREVIEW: {
      url: `phishing-simulator/email-templates/preview/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EDIT: {
      url: `phishing-simulator/email-templates/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    CREATE: {
      url: `phishing-simulator/email-templates`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DELETE: {
      url: `phishing-simulator/email-templates/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT: {
      url: `phishing-simulator/email-templates/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  LANDING_PAGE_TEMPLATES_PERMISSIONS: {
    SEARCH: {
      url: 'phishing-simulator/landing-page-template/search',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PREVIEW: {
      url: `phishing-simulator/landing-page-template/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EDIT: {
      url: `phishing-simulator/landing-page-template/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    CREATE: {
      url: `phishing-simulator/landing-page-template`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DELETE: {
      url: `phishing-simulator/landing-page-template/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    EXPORT: {
      url: `phishing-simulator/landing-page-template/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  CAMPAIGN_MANAGER_LEFT_MENU_PERMISSIONS: {
    CAMPAIGN_MANAGER: {
      url: `phishing-simulator/phishing-campaign/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  SETTINGS_LEFT_MENU_PERMISSIONS: {
    DNS: {
      url: `phishing-simulator/dns-services/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DOMAIN: {
      url: `phishing-simulator/domain-records/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  INCIDENT_RESPONDER_LIST_GROUP_PERMISSIONS: {
    NOTIFIED_EMAIL: {
      url: `notified-emails/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SUMMARY: {
      url: `is/dashboard/summary`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SEARCH_LOG: {
      url: `is/dashboard/search-log`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SEARCH_STATS: {
      url: `is/dashboard/search-stats`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    NOTIFY_RESULT: {
      url: `notify/result`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  INCIDENT_RESPONDER_LEFT_MENU_PERMISSIONS: {
    NOTIFIED_EMAIL: {
      url: `notified-emails/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    INVESTIGATIONS: {
      url: `investigations/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    INTEGRATIONS: {
      url: `analysis-engines/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    PLAYBOOKS: {
      url: `playbooks/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    MAIL_CONFIGURATIONS: {
      url: `mail-configurations/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  INCIDENT_RESPONDER_OTHER_PERMISSIONS: {
    RE_ANALYZE: {
      url: `notified-emails/{resourceId}/reanalyze`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    }
  },
  INVESTIGATION_PERMISSIONS: {
    GET: {
      url: `investigations/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    STOP: {
      url: `investigations/{resourceId}/cancel`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    SEARCH: {
      url: `investigations/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    POST: {
      url: `investigations`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    RE_ANALYZE: {
      url: `notified-emails/{resourceId}/reanalyze`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    }
  },
  INTEGRATION_PERMISSIONS: {
    SEARCH: {
      url: `analysis-engines/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    UPDATE: {
      url: `analysis-engines/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DISABLE: {
      url: `analysis-engines/{resourceId}/disable`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    EXPORT: {
      url: `analysis-engines/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    POST: {
      url: `analysis-engines`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DELETE: {
      url: `analysis-engines/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    }
  },
  ADVANCED_SETTINGS_PERMISSIONS: {
    SEARCH: {
      url: `analysis-engines/analysis-exclusions`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    UPDATE: {
      url: `analysis-engines/analysis-exclusions`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    }
  },
  PHISHING_REPORTER_LEFT_MENU_PERMISSIONS: {
    SEARCH: {
      url: `phishing-reporter/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    GET: {
      url: `phishing-reporter`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    }
  },
  PHISHING_REPORTER_PERMISSIONS: {
    SEARCH: {
      url: `phishing-reporter/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SUMMARY: {
      url: `phishing-reporter/summary`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    GET: {
      url: `phishing-reporter`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    SAVE: {
      url: `phishing-reporter`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    DELETE_USER: {
      url: `phishing-reporter-users/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    }
  },
  REPORTS_LEFT_MENU_PERMISSIONS: {
    SEARCH: {
      url: `phishing-simulator/phishing-campaign-job-report/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  CAMPAIGN_REPORTS_PERMISSIONS: {
    SEARCH: {
      url: `phishing-simulator/phishing-campaign-job-report/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    GET: {
      url: `phishing-simulator/phishing-campaign-job-report/summary/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    DELETE: {
      url: `phishing-simulator/phishing-campaign-job-report/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    }
  },
  COMPANY_LEFT_MENU_PERMISSIONS: {
    TARGET_USERS: {
      url: `target-users/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    TARGET_GROUPS: {
      url: `target-groups/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    COMPANY_GROUPS: {
      url: `company-groups/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    COMPANY: {
      url: `companies/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SMTP_SETTINGS: {
      url: `companies/smtp-settings/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    ROLES: {
      url: `roles/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SYSTEM_USERS: {
      url: `system-users/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    AUDIT_LOGS: {
      url: `audit-logs`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  PLAYBOOK_PERMISSIONS: {
    MATCHING_PLAYBOOKS_SEARCH: {
      url: 'notified-emails/matching-playbooks/{playbookResourceId}/search',
      hasPermission: false,
      method: 'POST'
    },
    MATCHING_PLAYBOOKS_EXPORT: {
      url: 'notified-emails/matching-playbooks/{playbookResourceId}/search/export',
      hasPermission: false,
      method: 'POST'
    },
    SEARCH: {
      url: 'playbooks/search',
      hasPermission: false,
      method: 'POST'
    },
    GET: {
      url: 'playbooks/{resourceId}',
      hasPermission: false,
      method: 'GET'
    },
    CREATE: {
      url: 'playbooks',
      hasPermission: false,
      method: 'POST'
    },
    DELETE: {
      url: 'playbooks/{resourceId}',
      hasPermission: false,
      method: 'DELETE'
    },
    UPDATE: {
      url: 'playbooks/{resourceId}',
      hasPermission: false,
      method: 'PUT'
    },
    EXPORT: {
      url: 'playbooks/search/export',
      hasPermission: false,
      method: 'POST'
    }
  },
  MAIL_CONFIGURATION_PERMISSIONS: {
    O365_POST: {
      url: 'mail-configurations/o365',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    O365_UPDATE: {
      url: 'mail-configurations/o365/{resourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    SEARCH: {
      url: 'mail-configurations/search',
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    O365_DELETE: {
      url: 'mail-configurations/o365/{resourceId}',
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    }
  },
  SMTP_SETTINGS_PERMISSIONS: {
    CREATE: {
      url: 'companies/smtp-settings',
      hasPermission: false,
      method: 'POST'
    },
    SEARCH: {
      url: 'companies/smtp-settings/search',
      hasPermission: false,
      method: 'POST'
    },
    UPDATE: {
      url: 'companies/smtp-settings/{resourceId}',
      hasPermission: false,
      method: 'PUT'
    },
    DELETE: {
      url: 'companies/smtp-settings/{resourceId}',
      hasPermission: false,
      method: 'DELETE'
    },
    GET: {
      url: 'companies/smtp-settings/{resourceId}',
      hasPermission: false,
      method: 'GET'
    },
    EXPORT: {
      url: 'companies/smtp-settings/search/export',
      hasPermission: false,
      method: 'POST'
    }
  },
  WHITE_LABEL_PERMISSIONS: {
    GET: {
      url: 'whitelabeling',
      hasPermission: false,
      method: 'GET'
    },
    UPDATE: {
      url: 'whitelabeling/{resourceId}',
      hasPermission: false,
      method: 'PUT'
    },
    DELETE: {
      url: 'whitelabeling/{resourceId}',
      hasPermission: false,
      method: 'DELETE'
    }
  },
  PROXY_SETTINGS_PERMISSIONS: {
    SEARCH: {
      url: 'companies/proxy-settings/search',
      hasPermission: false,
      method: 'POST'
    },
    DELETE: {
      url: 'companies/proxy-settings/{resourceId}',
      hasPermission: false,
      method: 'DELETE'
    },
    GET: {
      url: 'companies/proxy-settings/{resourceId}',
      hasPermission: false,
      method: 'GET'
    },
    CREATE: {
      url: 'companies/proxy-settings',
      hasPermission: false,
      method: 'POST'
    },
    EXPORT: {
      url: 'companies/proxy-settings/search/export',
      hasPermission: false,
      method: 'POST'
    },
    TEST: {
      url: 'companies/proxy-settings/test',
      hasPermission: false,
      method: 'POST'
    },
    UPDATE: {
      url: 'companies/proxy-settings/{resourceId}',
      hasPermission: false,
      method: 'PUT'
    }
  },
  CAMPAIGN_MANAGER_PARENT: {
    SEARCH: {
      url: 'phishing-simulator/phishing-campaign/search',
      hasPermission: false,
      method: 'POST'
    },
    PREVIEW: {
      url: 'phishing-simulator/phishing-campaign/preview/{resourceId}',
      hasPermission: false,
      method: 'GET'
    },
    DELETE: {
      url: 'phishing-simulator/phishing-campaign/{resourceId}',
      hasPermission: false,
      method: 'DELETE'
    },
    GET: {
      url: 'phishing-simulator/phishing-campaign/{resourceId}',
      hasPermission: false,
      method: 'GET'
    },
    CREATE: {
      url: 'phishing-simulator/phishing-campaign',
      hasPermission: false,
      method: 'POST'
    },
    EXPORT: {
      url: 'phishing-simulator/phishing-campaign/search/export',
      hasPermission: false,
      method: 'POST'
    },
    UPDATE: {
      url: 'phishing-simulator/phishing-campaign/{resourceId}',
      hasPermission: false,
      method: 'PUT'
    }
  },
  DNS_PERMISSIONS: {
    CREATE: {
      url: `${ENUMS.DNS.ROOT_URL}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SEARCH: {
      url: `${ENUMS.DNS.ROOT_URL}/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    UPDATE: {
      url: `${ENUMS.DNS.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `${ENUMS.DNS.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    GET: {
      url: `${ENUMS.DNS.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EXPORT: {
      url: `${ENUMS.DNS.ROOT_URL}/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  },
  DOMAIN_PERMISSIONS: {
    CREATE: {
      url: `${ENUMS.DOMAIN.ROOT_URL}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SEARCH: {
      url: `${ENUMS.DOMAIN.ROOT_URL}/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    UPDATE: {
      url: `${ENUMS.DOMAIN.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `${ENUMS.DOMAIN.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    GET: {
      url: `${ENUMS.DOMAIN.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EXPORT: {
      url: `${ENUMS.DOMAIN.ROOT_URL}/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    FORM_DETAILS: {
      url: `${ENUMS.DOMAIN.ROOT_URL}/form-details`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    }
  },
  SCIM_SETTINGS_PERMISSIONS: {
    CREATE: {
      url: `${ENUMS.SCIM.ROOT_URL}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SEARCH: {
      url: `${ENUMS.SCIM.ROOT_URL}/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    UPDATE: {
      url: `${ENUMS.SCIM.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `${ENUMS.SCIM.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    GET: {
      url: `${ENUMS.SCIM.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EXPORT: {
      url: `${ENUMS.SCIM.ROOT_URL}/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    REVOKE: {
      url: `${ENUMS.SCIM.ROOT_URL}/{resourceId}/revoke`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    FIELDS: {
      url: `${ENUMS.SCIM.ROOT_URL}/fields`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    }
  },
  SIEM_INTEGRATION_PERMISSIONS: {
    CREATE: {
      url: `${ENUMS.SIEM_INTEGRATION.ROOT_URL}`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    SEARCH: {
      url: `${ENUMS.SIEM_INTEGRATION.ROOT_URL}/search`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    },
    UPDATE: {
      url: `${ENUMS.SIEM_INTEGRATION.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.PUT
    },
    DELETE: {
      url: `${ENUMS.SIEM_INTEGRATION.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.DELETE
    },
    GET: {
      url: `${ENUMS.SIEM_INTEGRATION.ROOT_URL}/{resourceId}`,
      hasPermission: false,
      method: ENUMS.METHODS.GET
    },
    EXPORT: {
      url: `${ENUMS.SIEM_INTEGRATION.ROOT_URL}/search/export`,
      hasPermission: false,
      method: ENUMS.METHODS.POST
    }
  }
}
